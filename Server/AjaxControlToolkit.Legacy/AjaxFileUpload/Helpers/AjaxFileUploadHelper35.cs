using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Handle upload request for .NET 3.5
    /// </summary>
    public static class AjaxFileUploadHelper
    {
        private const int ChunkSize = 1024 * 1024 * 4;

        /// <summary>
        /// Add upload abort request.
        /// </summary>
        /// <param name="context">Current HttpContext.</param>
        /// <param name="fileId">File id to be aborted.</param>
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
            var result = ProcessStream(context, request.Files[0],
                          request.QueryString["fileId"],
                          request.QueryString["fileName"],
                          bool.Parse(request.QueryString["chunked"] ?? "false"),
                          bool.Parse(request.QueryString["firstChunk"] ?? "false"));

            if (!result)
                request.Form.Clear();

            return result;
        }

        private static bool ProcessStream(HttpContext context, HttpPostedFile httpPostedFile, string fileId, string fileName, bool chunked, bool isFirstChunk)
        {
            Stream destination = null;
            var states = new AjaxFileUploadStates(context, fileId);

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

            var totalLength = httpPostedFile.ContentLength;
            var bufferSize = totalLength < ChunkSize ? totalLength : ChunkSize;
            
            var bytesWritten = 0;

            // Write uploaded data per chunk, so we can abort it anytime in a middle of process
            while (bytesWritten < totalLength)
            {
                var bytesToWrite = bytesWritten + bufferSize > totalLength ?
                    totalLength-bytesWritten : bufferSize;

                var buffer = new byte[bytesToWrite];

                httpPostedFile.InputStream.Read(buffer, 0, bytesToWrite);
                destination.Write(buffer, 0, bytesToWrite);

                bytesWritten += bytesToWrite;

                if (states.Abort)
                {
                    destination.Dispose();
                    return false;
                }
            }
            destination.Close();
            destination.Dispose();

            return true;
        }
    }
}
