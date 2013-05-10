using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace AjaxControlToolkit
{
    public class AjaxFileUploadAzureHelper
    {
        private const int ChunkSize = 1024 * 1024 * 4;
        private const int ChunkSizeForPolling = 64 * 1024;

        private static readonly string AzureConnectionString;

        static AjaxFileUploadAzureHelper()
        {
            var conStrSetting = System.Web.Configuration.WebConfigurationManager.AppSettings["AjaxFileUploadAzureConnectionString"];
            if (string.IsNullOrEmpty(conStrSetting))
                throw new Exception("AjaxFileUploadAzureConnectionString is not specified on web.config.");
            AzureConnectionString = conStrSetting;
        }

        internal static bool ProcessStream(HttpContext context, Stream source, string fileId, string fileName, bool chunked, bool isFirstChunk, bool usePoll, string azureContainerName)
        {
            if (string.IsNullOrEmpty(azureContainerName))
                throw new Exception("AzureContainerName is not specified.");

            FileHeaderInfo headerInfo = null;
            var states = new AjaxFileUploadStates(context, fileId);
            var uploaded = 0;

            using (var tmpStream = new MemoryStream())
            {
                var totalBytesRead = 0;
                var done = false;
                var fileLength = 0;
                var blobClient = GetCloudBlobClient();
                var blobContainer = blobClient.GetContainerReference(azureContainerName);
                blobContainer.CreateIfNotExists();

                CloudBlockBlob blob = null;

                while (true)
                {
                    if (states.Abort)
                        return false;

                    // read per chunk
                    var chunkSize = usePoll ? ChunkSizeForPolling : ChunkSize;
                    if (chunkSize > source.Length)
                    {
                        chunkSize = (int)source.Length;
                        if (usePoll)
                            states.FileLength = chunkSize;
                    }

                    var chunk = new byte[chunkSize];
                    var index = 0;
                    while (index < chunk.Length)
                    {
                        var bytesRead = source.Read(chunk, index, chunk.Length - index);
                        if (bytesRead == 0)
                            break;

                        if (usePoll)
                            states.Uploaded += bytesRead;

                        index += bytesRead;
                    }

                    totalBytesRead += index;

                    // Byte is not empty nor reach end of file
                    if (index != 0)
                    {
                        // Keep seeking header info until it's found
                        if (headerInfo == null)
                        {
                            // Append every first byte into temporary memory stream
                            tmpStream.Write(chunk, 0, index);

                            // Load it all into byte array, and try parse it so we can get header info
                            var firstBytes = tmpStream.ToArray();

                            // Find header info from first bytes.
                            headerInfo = MultipartFormDataParser.ParseHeaderInfo(firstBytes, Encoding.UTF8);

                            // If it's found, then start writing to file.
                            if (headerInfo != null)
                            {
                                // Calculate total file length.
                                fileLength = ((int)(source.Length - headerInfo.BoundaryDelimiterLength) - headerInfo.StartIndex);
                                if (usePoll)
                                    states.FileLength = fileLength;

                                // Only write file data, so not all bytes are written.
                                var lengthToWrite = totalBytesRead - headerInfo.StartIndex;
                                if (lengthToWrite > fileLength)
                                {
                                    lengthToWrite = fileLength;
                                    done = true;
                                }

                                // Get first chunk of file data.
                                var firstChunk = new byte[lengthToWrite];
                                Buffer.BlockCopy(firstBytes, headerInfo.StartIndex, firstChunk, 0, lengthToWrite);
                                
                                // Create blob reference.
                                blob = blobContainer.GetBlockBlobReference(fileName);
                                if (!chunked || isFirstChunk)
                                    blob.DeleteIfExists();

                                var id = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
                                blob.PutBlock(id, new MemoryStream(firstChunk, true), null);
                                uploaded = firstChunk.Length;
                                states.BlockList.Add(id);
                            }
                        }
                        else
                        {
                            var length = index;

                            // Reach in the end of stream, remove last boundary
                            if (uploaded + index > fileLength)
                            {
                                length -= headerInfo.BoundaryDelimiterLength;
                                done = true;
                            }

                            var id = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
                            blob.PutBlock(id, new MemoryStream(chunk, 0, length, true), null);
                            uploaded += length;
                            states.BlockList.Add(id);
                        }
                    }


                    // There is no byte to read anymore, upload is finished.
                    if (done || index != chunk.Length)
                    {
                        if (blob!=null)
                        {
                            blob.PutBlockList(states.BlockList);
                            states.AzureBlobUri = blob.Uri.AbsoluteUri;
                        }
                        break;
                    }
                }
            }

            return true;
        }

        internal static AjaxFileUploadBlobInfo GetFileInfo(HttpContext context, string fileId)
        {
            var blobClient = GetCloudBlobClient();
            var states = new AjaxFileUploadStates(context, fileId);
            var blob = blobClient.GetBlobReferenceFromServer(new Uri(states.AzureBlobUri));

            var name = blob.Name;
            return new AjaxFileUploadBlobInfo
                       {
                           Name = name,
                           Extension = name.Substring(name.LastIndexOf(".") + 1),
                           Length = blob.Properties.Length,
                           ContentType = blob.Properties.ContentType,
                           Uri = blob.Uri
                       };
        }

        public static void DownloadStream(string absoluteUri, Stream destination, out AjaxFileUploadBlobInfo blobInfo)
        {
            DownloadStream(absoluteUri, destination, out blobInfo, false);
        }

        public static void DownloadStream(string absoluteUri, Stream destination, out AjaxFileUploadBlobInfo blobInfo, bool deleteOnDownloaded)
        {
            var blobClient = GetCloudBlobClient();
            var blob = blobClient.GetBlobReferenceFromServer(new Uri(absoluteUri));
            var name = blob.Name;

            blobInfo = new AjaxFileUploadBlobInfo
            {
                Name = name,
                Extension = name.Substring(name.LastIndexOf(".") + 1),
                Length = blob.Properties.Length,
                ContentType = blob.Properties.ContentType
            };

            blob.DownloadToStream(destination);

            if (deleteOnDownloaded)
                blob.Delete();
        }

        private static CloudBlobClient GetCloudBlobClient()
        {
            var storageAccount = CloudStorageAccount.DevelopmentStorageAccount;
            if (AzureConnectionString.ToLower().Replace(" ", "") != "usedevelopmentstorage=true")
                storageAccount = CloudStorageAccount.Parse(AzureConnectionString);

            var blobClient = storageAccount.CreateCloudBlobClient();
            return blobClient;
        }
    }
}
