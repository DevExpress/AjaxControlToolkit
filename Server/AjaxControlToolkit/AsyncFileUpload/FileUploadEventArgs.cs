using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;

namespace AjaxControlToolkit {
    /// <summary>
    /// AsyncFileUploadState represents the state of file that is requested to upload (Success, Failed, Unknown).
    /// </summary>
    public enum AsyncFileUploadState {
        Success = 0,
        Failed = 1,
        Unknown = 2
    }

    /// <summary>
    /// AsyncFileUploadEventArgs enables you to send values relate to file in the argument of event.
    /// AsyncFileUploadState, StatusMessage, filename and filesize can be passed with the help of this class.
    /// </summary>
    public class AsyncFileUploadEventArgs : EventArgs {

        /// <summary>
        /// Constructor to intialize object of type AsyncFieUploadEventArgs
        /// </summary>
        public AsyncFileUploadEventArgs() {
        }

        /// <summary>
        /// This constructor is obsolete as fields are replaced by public properties
        /// and public fields are obsolete.
        /// </summary>
        /// <param name="state"></param>
        /// <param name="statusMessage"></param>
        /// <param name="filename"></param>
        /// <param name="filesize"></param>
        [Obsolete]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public AsyncFileUploadEventArgs(AsyncFileUploadState state, string statusMessage, string filename, string filesize) {
            this.statusMessage = statusMessage;
            this.filename = filename;
            this.filesize = filesize;
            this.state = state;
        }

        /// <summary>
        /// Public field statusMessage is replaced with public property
        /// so it is obsoleted and removed from intellisense.
        /// </summary>
        [Obsolete]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public string statusMessage = String.Empty;

        /// <summary>
        /// Public field filename is replaced with public property
        /// so it is obsoleted and removed from intellisense.
        /// </summary>
        [Obsolete]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public string filename = String.Empty;

        /// <summary>
        /// Public field filesize is replaced with public property
        /// so it is obsoleted and removed from intellisense.
        /// </summary>
        [Obsolete]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public string filesize = String.Empty;

        /// <summary>
        /// Public field state is replaced with public property
        /// so it is obsoleted and removed from intellisense.
        /// </summary>
        [Obsolete]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public AsyncFileUploadState state = AsyncFileUploadState.Unknown;


        #region Properties

        /// <summary>
        /// Gets or Sets Status message of uploaded file.
        /// </summary>
        public string StatusMessage { get; set; }

        /// <summary>
        /// Gets or Sets file name of uploaded file.
        /// </summary>
        public string FileName { get; set; }

        /// <summary>
        /// Gets or Sets fileSize of uploaded file.
        /// </summary>
        public string FileSize { get; set; }

        /// <summary>
        /// Gets or Sets State of uploaded file.
        /// </summary>
        public AsyncFileUploadState State { get; set; }

        #endregion
    }
}
