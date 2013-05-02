﻿using System;
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
        internal const string TempDirectory = "~/App_Data/_AjaxFileUpload";
        private const int ChunkSize = 1024 * 1024 * 4;

        private static readonly List<string> AbortRequests = new List<string>();

        /// <summary>
        /// Add upload abort request.
        /// </summary>
        /// <param name="fileId">file id to be aborted.</param>
        public static void Abort(string fileId)
        {
            if (!AbortRequests.Contains(fileId))
                AbortRequests.Add(fileId);
        }


        /// <summary>
        /// Process uploaded file from http request.
        /// </summary>
        /// <param name="request"></param>
        public static bool Process(HttpContext context, HttpRequest request)
        {
#if NET45
            using (var stream = request.GetBufferedInputStream()) {
#else
            using (var stream = request.GetBufferlessInputStream())
            {
#endif
                var success = ProcessStream(context, stream, 
                    request.QueryString["fileId"],
                    request.QueryString["fileName"],
                    bool.Parse(request.QueryString["chunked"] ?? "false"),
                    bool.Parse(request.QueryString["firstChunk"] ?? "false"),
                    bool.Parse(request.QueryString["usePoll"] ?? "false"));

                if (!success)
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
                    if (AbortRequests.Contains(fileId))
                    {
                        AbortRequests.Remove(fileId);
                        return false;
                    }

                    // read per chunk
                    var chunkSize = ChunkSize;
                    if (chunkSize > source.Length)
                        chunkSize = (int)source.Length;

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

                                // Prepare temporary folder, we use file id as a folder name.
                                var tempFolder = Path.Combine(HttpContext.Current.Server.MapPath(TempDirectory), fileId);
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

                            if (!AbortRequests.Contains(fileId))
                                AbortRequests.Remove(fileId);
                        }
                        break;
                    }
                }
            }

            return true;
        }
    }
}
