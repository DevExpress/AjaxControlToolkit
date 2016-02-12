#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit {

    public class AjaxFileUploadStartEventArgs : EventArgs {
        private readonly int _filesInQueue;

        public AjaxFileUploadStartEventArgs(int filesInQueue) {
            this._filesInQueue = filesInQueue;
        }

        public int FilesInQueue {
            get { return _filesInQueue; }
        }

        public string ServerArguments { get; set; }
    }

}
#pragma warning restore 1591