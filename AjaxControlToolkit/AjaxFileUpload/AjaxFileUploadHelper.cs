#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace AjaxControlToolkit {

    public static class AjaxFileUploadHelper {
        const int ChunkSize = 1024 * 1024 * 4;
        const int ChunkSizeForPolling = 64 * 1024;

        public static void Abort(HttpContext context, string fileId) {
            (new AjaxFileUploadStates(context, fileId)).Abort = true;
        }

        public static bool Process(HttpContext context) {
            var request = context.Request;
            var fileId = request.QueryString["fileId"];
            var fileName = request.QueryString["fileName"];
            var chunked = bool.Parse(request.QueryString["chunked"] ?? "false");
            var firstChunk = bool.Parse(request.QueryString["firstChunk"] ?? "false");
            var usePoll = bool.Parse(request.QueryString["usePoll"] ?? "false");

            using(var stream = request.GetBufferlessInputStream()) {
                var success = false;
                success = ProcessStream(
                    context, stream, fileId, fileName,
                    chunked, firstChunk, usePoll);

                if(!success)
                    request.Form.Clear();

                return success;
            }
        }

        public static bool ProcessStream(HttpContext context, Stream source, string fileId, string fileName, bool chunked, bool isFirstChunk, bool usePoll) {
            FileHeaderInfo headerInfo = null;
            Stream destination = null;
            var states = new AjaxFileUploadStates(context, fileId);

            using(var tmpStream = new MemoryStream()) {
                var totalBytesRead = 0;
                var done = false;
                var fileLength = 0;

                while(true) {
                    if(states.Abort)
                        return false;

                    // read per chunk
                    var chunkSize = usePoll ? ChunkSizeForPolling : ChunkSize;
                    if(chunkSize > source.Length) {
                        chunkSize = (int)source.Length;
                        if(usePoll)
                            states.FileLength = chunkSize;
                    }

                    var chunk = new byte[chunkSize];
                    var index = 0;
                    while(index < chunk.Length) {
                        var bytesRead = source.Read(chunk, index, chunk.Length - index);
                        if(bytesRead == 0)
                            break;

                        if(usePoll)
                            states.Uploaded += bytesRead;

                        index += bytesRead;
                    }

                    totalBytesRead += index;

                    // Byte is not empty nor reach end of file
                    if(index != 0) {
                        // Keep seeking header info until it's found
                        if(headerInfo == null) {
                            // Append every first byte into temporary memory stream
                            tmpStream.Write(chunk, 0, index);

                            // Load it all into byte array, and try parse it so we can get header info
                            var firstBytes = tmpStream.ToArray();

                            // Find header info from first bytes.
                            headerInfo = MultipartFormDataParser.ParseHeaderInfo(firstBytes, Encoding.UTF8);

                            // If it's found, then start writing to file.
                            if(headerInfo != null) {
                                // Calculate total file length.
                                fileLength = ((int)(source.Length - headerInfo.BoundaryDelimiterLength) - headerInfo.StartIndex);
                                if(usePoll)
                                    states.FileLength = fileLength;

                                // Only write file data, so not all bytes are written.
                                var lengthToWrite = totalBytesRead - headerInfo.StartIndex;
                                if(lengthToWrite > fileLength) {
                                    lengthToWrite = fileLength;
                                    done = true;
                                }

                                // Get first chunk of file data.
                                var firstChunk = new byte[lengthToWrite];
                                Buffer.BlockCopy(firstBytes, headerInfo.StartIndex, firstChunk, 0, lengthToWrite);

                                // Prepare temporary folder, we use file id as a folder name.
                                var tempFolder = AjaxFileUpload.BuildTempFolder(fileId);
                                if(!Directory.Exists(tempFolder)) Directory.CreateDirectory(tempFolder);

                                // Build temporary file path.
                                var tmpFilePath = Path.Combine(tempFolder, fileName);

                                if(!IsSubDirectory(AjaxFileUpload.BuildRootTempFolder(), Path.GetDirectoryName(tmpFilePath)))
                                    throw new Exception("Insecure operation prevented");

                                if(!chunked || isFirstChunk)
                                    // Create new file, if this is a first chunk or file is not chunked.
                                    destination = new FileStream(tmpFilePath, FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite);
                                else
                                    // Append data to existing teporary file for next chunks
                                    destination = new FileStream(tmpFilePath, FileMode.Append, FileAccess.Write, FileShare.ReadWrite);

                                // Writing it now.
                                destination.Write(firstChunk, 0, lengthToWrite);
                            }
                        } else {
                            var length = index;

                            // Reach in the end of stream, remove last boundary
                            if(destination.Length + index > fileLength) {
                                length -= headerInfo.BoundaryDelimiterLength;
                                done = true;
                            }

                            destination.Write(chunk, 0, length);
                        }
                    }

                    // There is no byte to read anymore, upload is finished.
                    if(done || index != chunk.Length) {
                        if(destination != null) {
                            destination.Close();
                            destination.Dispose();
                        }
                        break;
                    }
                }
            }
            return true;
        }

        static bool IsSubDirectory(string parentDirectory, string childDirectory) {
            var directoryInfo = new DirectoryInfo(childDirectory).Parent;
            while(directoryInfo != null) {
                if(directoryInfo.FullName == parentDirectory)
                    return true;
                directoryInfo = directoryInfo.Parent;
            }

            return false;
        }
    }

}
#pragma warning restore 1591