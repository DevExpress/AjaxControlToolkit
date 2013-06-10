using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Web;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Handle upload request for .NET 4.0 with GetBufferlessInputStream approach 
    /// and .NET 4.5 with GetBufferedInputStream approach.
    /// </summary>
    public static class AjaxFileUploadHelper
    {
        private const int ChunkSize = 1024*1024*4;
        private const int ChunkSizeForPolling = 64*1024;

        /// <summary>
        /// Add upload abort request.
        /// </summary>
        /// <param name="context">Current HttpContext</param>
        /// <param name="fileId">file id to be aborted.</param>
        public static void Abort(HttpContext context, string fileId)
        {
            (new AjaxFileUploadStates(context, fileId)).Abort = true;
        }


        /// <summary>
        /// Process uploaded file from http request.
        /// </summary>
        /// <param name="context">Current HttpContext</param>
        public static bool Process(HttpContext context)
        {
            var request = context.Request;
            var storeToAzure = bool.Parse(request.QueryString["storeToAzure"] ?? "false");
            var fileId = request.QueryString["fileId"];
            var fileName = request.QueryString["fileName"];
            var chunked = bool.Parse(request.QueryString["chunked"] ?? "false");
            var firstChunk = bool.Parse(request.QueryString["firstChunk"] ?? "false");
            var usePoll = bool.Parse(request.QueryString["usePoll"] ?? "false");
            var azureContainerName = request.QueryString["acn"];

#if NET45
            using (var stream = request.GetBufferedInputStream()) {
#else
            using (var stream = request.GetBufferlessInputStream()) {
#endif
                var success = false;
#if NET45
                if (storeToAzure)
                    success = AjaxFileUploadAzureHelper.ProcessStream(
                        context, stream, fileId, fileName,
                        chunked, firstChunk, usePoll, azureContainerName);
                else
#endif
                    success = ProcessStream(
                        context, stream, fileId, fileName,
                        chunked, firstChunk, usePoll);

                if(!success)
#if NET45
                    request.Abort();
#else
                    request.Form.Clear();
#endif
                return success;
            }
        }

        /// <summary>
        /// Process uploaded stream from Http request.
        /// </summary>
        /// <param name="context">Current HttpContext</param>
        /// <param name="source">Source stream</param>
        /// <param name="fileId">File Id</param>
        /// <param name="fileName">File Name</param>
        /// <param name="chunked">Determine uploading are processed by several chunks.</param>
        /// <param name="isFirstChunk">Is this stream for first chunk.</param>
        /// <returns></returns>
        public static bool ProcessStream(HttpContext context, Stream source, string fileId, string fileName, bool chunked, bool isFirstChunk, bool usePoll)
        {
            FileHeaderInfo headerInfo = null;
            Stream destination = null;
            var states = new AjaxFileUploadStates(context, fileId);

            using (var tmpStream = new MemoryStream())
            {
                var totalBytesRead = 0;
                var done = false;
                var fileLength = 0;          

                while (true)
                {
                    if (states.Abort)
                        return false;

                    // read per chunk
                    var chunkSize = usePoll ? ChunkSizeForPolling : ChunkSize;
                    if (chunkSize > source.Length)
                    {
                        chunkSize = (int) source.Length;
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
                                fileLength = ((int) (source.Length - headerInfo.BoundaryDelimiterLength) - headerInfo.StartIndex);
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

                                // Prepare temporary folder, we use file id as a folder name.
                                var tempFolder = AjaxFileUpload.BuildTempFolder(fileId);
                                if (!Directory.Exists(tempFolder)) Directory.CreateDirectory(tempFolder);

                                // Build temporary file path.
                                var tmpFilePath = Path.Combine(tempFolder, fileName);

                                if (!chunked || isFirstChunk)
                                    // Create new file, if this is a first chunk or file is not chunked.
                                    destination = new FileStream(tmpFilePath, FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite);
                                else
                                    // Append data to existing teporary file for next chunks
                                    destination = new FileStream(tmpFilePath, FileMode.Append, FileAccess.Write, FileShare.ReadWrite);

                                // Writing it now.
                                destination.Write(firstChunk, 0, lengthToWrite);
                            }
                        }
                        else
                        {
                            var length = index;
                            
                            // Reach in the end of stream, remove last boundary
                            if (destination.Length + index > fileLength)
                            {
                                length -= headerInfo.BoundaryDelimiterLength;
                                done = true;
                            }

                            destination.Write(chunk, 0, length);
                        }
                    }

                    

                    // There is no byte to read anymore, upload is finished.
                    if (done || index != chunk.Length)
                    {
                        if (destination != null)
                        {
                            destination.Close();
                            destination.Dispose();
                        }
                        break;
                    }
                }
            }

            return true;
        }
    }
}
