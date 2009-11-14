using System;
using System.Collections.Generic;
using System.Text;

namespace AjaxControlToolkit
{
    public enum AsyncFileUploadState
    {
        Success = 0,
        Failed = 1,
        Unknown = 2
    }

    public class AsyncFileUploadEventArgs : EventArgs
    {
        public AsyncFileUploadEventArgs(AsyncFileUploadState state, string statusMessage, string filename, string filesize)
        {
            this.statusMessage = statusMessage;
            this.filename = filename;
            this.filesize = filesize;
            this.state = state;
        }
        public string statusMessage = String.Empty;
        public string filename = String.Empty;
        public string filesize = String.Empty;
        public AsyncFileUploadState state = AsyncFileUploadState.Unknown;
    }
}
