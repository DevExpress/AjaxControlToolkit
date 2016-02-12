#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit {

    public class AsyncFileUploadEventArgs : EventArgs {
        string _statusMessage = String.Empty;
        string _filename = String.Empty;
        string _filesize = String.Empty;
        AsyncFileUploadState _state = AsyncFileUploadState.Unknown;

        public AsyncFileUploadEventArgs() {
        }

        public AsyncFileUploadEventArgs(AsyncFileUploadState state, string statusMessage, string filename, string filesize) {
            _statusMessage = statusMessage;
            _filename = filename;
            _filesize = filesize;
            _state = state;
        }

        public string StatusMessage {
            get { return _statusMessage; }
        }

        public string FileName {
            get { return _filename; }
        }

        public string FileSize {
            get { return _filesize; }
        }

        public AsyncFileUploadState State {
            get { return _state; }
        }
    }

}

#pragma warning restore 1591