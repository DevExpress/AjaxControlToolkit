using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

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
        private byte[] _contents;
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
        /// <param name="contents">Contents of file.</param>
        public AjaxFileUploadEventArgs(string fileId, AjaxFileUploadState state, string statusMessage, string fileName, int fileSize, string contentType, byte[] contents)
        {
            _fileId = fileId;
            _state = state;
            _statusMessage = statusMessage;
            _fileName = fileName;
            _fileSize = fileSize;
            _contentType = contentType;
            _contents = contents;
        }

        /// <summary>
        /// To get Id of file.
        /// </summary>
        public string FileId
        {
            get { return _fileId; }
        }

        /// <summary>
        /// To get contents of uploaded file.
        /// </summary>
        /// <returns></returns>
        public byte[] GetContents()
        {
            return _contents;
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

    }
}
