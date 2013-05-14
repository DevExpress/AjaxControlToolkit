using System;

namespace AjaxControlToolkit
{
    /// <summary>
    /// State of reason that causing UploadCompleteAll event invoked.
    /// </summary>
    public enum AjaxFileUploadCompleteAllReason
    {
        /// <summary>
        /// All files were successfully uploaded normaly.
        /// </summary>
        Success = 0, 

        /// <summary>
        /// User requests to cancel upload. Some files might not uploaded.
        /// </summary>
        Canceled = 1,

        /// <summary>
        /// Could be error.
        /// </summary>
        Unknown = 2
    }

    public class AjaxFileUploadCompleteAllEventArgs : EventArgs
    {
        private readonly int _filesInQueue;
        private readonly int _filesUploaded;
        private readonly AjaxFileUploadCompleteAllReason _reason;

        public AjaxFileUploadCompleteAllEventArgs(int filesInQueue, int filesUploaded, AjaxFileUploadCompleteAllReason reason)
        {
            this._filesInQueue = filesInQueue;
            this._filesUploaded = filesUploaded;
            this._reason = reason;
        }

        /// <summary>
        /// Total number of uploaded files.
        /// </summary>
        public int FilesUploaded
        {
            get { return _filesUploaded; }
        }

        /// <summary>
        /// Total number of files in queue.
        /// </summary>
        public int FilesInQueue
        {
            get { return _filesInQueue; }
        }

        /// <summary>
        /// State of reason that causing this event invoked.
        /// </summary>
        public AjaxFileUploadCompleteAllReason Reason
        {
            get { return _reason; }
        }

        /// <summary>
        /// Get or set arguments passed from server to client.
        /// </summary>
        public string ServerArguments { get; set; }
    }
}
