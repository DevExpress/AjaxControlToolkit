using System;

namespace AjaxControlToolkit
{
    public class AjaxFileUploadStartEventArgs : EventArgs
    {
        private readonly int _filesInQueue;

        public AjaxFileUploadStartEventArgs(int filesInQueue)
        {
            this._filesInQueue = filesInQueue;
        }

        /// <summary>
        /// Total number of files in queue.
        /// </summary>
        public int FilesInQueue
        {
            get { return _filesInQueue; }
        }

        /// <summary>
        /// Get or set arguments passed from server to client.
        /// </summary>
        public string ServerArguments { get; set; }
    }
}
