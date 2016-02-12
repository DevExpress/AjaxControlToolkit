#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit {

    public class AjaxFileUploadCompleteAllEventArgs : EventArgs {
        readonly int _filesInQueue;
        readonly int _filesUploaded;
        readonly AjaxFileUploadCompleteAllReason _reason;

        public AjaxFileUploadCompleteAllEventArgs(int filesInQueue, int filesUploaded, AjaxFileUploadCompleteAllReason reason) {
            _filesInQueue = filesInQueue;
            _filesUploaded = filesUploaded;
            _reason = reason;
        }

        public int FilesUploaded {
            get { return _filesUploaded; }
        }

        public int FilesInQueue {
            get { return _filesInQueue; }
        }

        // State of reason that causing this event invoked.
        public AjaxFileUploadCompleteAllReason Reason {
            get { return _reason; }
        }

        public string ServerArguments { get; set; }
    }

}
#pragma warning restore 1591