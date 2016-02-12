#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace AjaxControlToolkit {

    public class AjaxFileUploadEventArgs : EventArgs {
        string _fileId = String.Empty;
        string _statusMessage = String.Empty;
        string _fileName = String.Empty;
        int _fileSize = 0;
        string _contentType = String.Empty;
        string _postedUrl = string.Empty;
        AjaxFileUploadState _state = AjaxFileUploadState.Unknown;

        public AjaxFileUploadEventArgs(string fileId, AjaxFileUploadState state, string statusMessage, string fileName, int fileSize, string contentType) {
            _fileId = fileId;
            _state = state;
            _statusMessage = statusMessage;
            _fileName = fileName;
            _fileSize = fileSize;
            _contentType = contentType;
        }

        public string FileId {
            get { return _fileId; }
        }

        public AjaxFileUploadState State {
            get { return _state; }
        }

        public string ContentType {
            get { return _contentType; }
        }

        public int FileSize {
            get { return _fileSize; }
        }

        public string FileName {
            get { return _fileName; }
        }

        public string StatusMessage {
            get { return _statusMessage; }
        }

        // TODO add code for resolve url
        public string PostedUrl {
            get { return _postedUrl; }
            set { _postedUrl = value; }
        }

        // Use <code>GetStreamContents()</code> instead when uploaded file size is too big to avoid System.OutOfMemoryException exception.
        public byte[] GetContents() {
            using(var stream = GetStreamContents()) {
                var buffer = new byte[stream.Length];
                stream.Read(buffer, 0, buffer.Length);
                return buffer;
            }
        }

        public Stream GetStreamContents() {
            var dir = AjaxFileUpload.BuildTempFolder(this._fileId);
            return File.OpenRead(Path.Combine(dir, this._fileName));
        }

        public void DeleteTemporaryData() {
            var dirInfo = new DirectoryInfo(AjaxFileUpload.BuildTempFolder(this._fileId));
            if(dirInfo.Exists)
                dirInfo.Delete(true);
        }



    }

}
#pragma warning restore 1591