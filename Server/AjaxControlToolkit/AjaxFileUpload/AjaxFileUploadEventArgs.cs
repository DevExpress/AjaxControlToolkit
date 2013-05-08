using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace AjaxControlToolkit
{
    /// <summary>
    /// AjaxFileUploadState keeps values of upload states
    /// </summary>
    public enum AjaxFileUploadState
    {
        Success = 0,
        Failed = 1,
        Unknown = 2
    }

    /// <summary>
    /// AjaxFileUploadEventArgs holds information of uploading file and used
    /// to pass back to the client.
    /// </summary>
    public class AjaxFileUploadEventArgs : EventArgs
    {
        private string _fileId = String.Empty;
        private string _statusMessage = String.Empty;
        private string _fileName = String.Empty;
        private int _fileSize = 0;
        private string _contentType = String.Empty;
        private AjaxFileUploadState _state = AjaxFileUploadState.Unknown;
        private string _postedUrl = string.Empty;

        /// <summary>
        /// Constructor to initialize various values of uploading file.
        /// </summary>
        /// <param name="fileId">Id of the file.</param>
        /// <param name="state">State of the Upload.</param>
        /// <param name="statusMessage">Status message.</param>
        /// <param name="fileName">Name of the file.</param>
        /// <param name="fileSize">Size of the file.</param>
        /// <param name="contentType">Content type of the file.</param>
        public AjaxFileUploadEventArgs(string fileId, AjaxFileUploadState state, string statusMessage, string fileName, int fileSize, string contentType)
        {
            _fileId = fileId;
            _state = state;
            _statusMessage = statusMessage;
            _fileName = fileName;
            _fileSize = fileSize;
            _contentType = contentType;
        }

        /// <summary>
        /// To get Id of file.
        /// </summary>
        public string FileId
        {
            get { return _fileId; }
        }

        /// <summary>
        /// Get contents of uploaded file in byte array.
        /// Use <code>GetStreamContents()</code> instead when uploaded file size is too big to avoid System.OutOfMemoryException exception.
        /// </summary>
        /// <returns></returns>
        public byte[] GetContents()
        {
            using (var stream = GetStreamContents())
            {
                var buffer = new byte[stream.Length];
                stream.Read(buffer, 0, buffer.Length);
                return buffer;
            }
        }

        /// <summary>
        /// Get contents of uploaded file in stream.
        /// </summary>
        /// <returns></returns>
        public Stream GetStreamContents()
        {
            var dir = AjaxFileUpload.BuildTempFolder(this._fileId);
            return File.OpenRead(Path.Combine(dir, this._fileName));
        }

        /// <summary>
        /// Delete temporary uploaded file data from temporary folder.
        /// </summary>
        public void DeleteTemporaryData()
        {
            var dirInfo = new DirectoryInfo(AjaxFileUpload.BuildTempFolder(this._fileId));
            if (dirInfo.Exists)
                dirInfo.Delete(true);
        }

        /// <summary>
        /// To get state of Uploading/uploaded file.
        /// </summary>
        public AjaxFileUploadState State
        {
            get { return _state; }
        }

        /// <summary>
        /// To get content types of uploaded file.
        /// </summary>
        public string ContentType
        {
            get { return _contentType; }
        }

        /// <summary>
        /// To get size of Uploaded file.
        /// </summary>
        public int FileSize
        {
            get { return _fileSize; }
        }

        /// <summary>
        /// To get name of Uploaded file.
        /// </summary>
        public string FileName
        {
            get { return _fileName; }
        }

        /// <summary>
        /// To get status message.
        /// </summary>
        public string StatusMessage
        {
            get { return _statusMessage; }
        }

        /// <summary>
        /// To get/set Url of uploaded file.
        /// </summary>
        public string PostedUrl
        {
            get
            {
                // to do add code for resolve url
                return _postedUrl;
            }
            set { _postedUrl = value; }
        }

        /// <summary>
        /// Returns absolute Uri of uploaded file on Azure blob storage.
        /// This only works if StoreToAzure set to true.
        /// </summary>
        /// <returns></returns>
        public string GetAzureBlobUri()
        {
            return (new AjaxFileUploadStates(HttpContext.Current, this._fileId)).AzureBlobUri;
        }
    }
}
