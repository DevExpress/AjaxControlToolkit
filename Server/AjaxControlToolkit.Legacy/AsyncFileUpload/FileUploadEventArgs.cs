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
        /// Creates a new instance of FileUploadEventArgs
        /// </summary>
        /// <param name="state"></param>
        /// <param name="statusMessage"></param>
        /// <param name="filename"></param>
        /// <param name="filesize"></param>

        public AsyncFileUploadEventArgs(AsyncFileUploadState state, string statusMessage, string filename, string filesize) {
            _statusMessage = statusMessage;
            _filename = filename;
            _filesize = filesize;
            _state = state;
        }

        private string _statusMessage = String.Empty;
        private string _filename = String.Empty;
        private string _filesize = String.Empty;
        private AsyncFileUploadState _state = AsyncFileUploadState.Unknown;


        #region Properties

        /// <summary>
        /// Gets status message of uploaded file.
        /// </summary>
        public string StatusMessage {
            get {
                return _statusMessage;
            }
        }

        /// <summary>
        /// Gets file name of uploaded file.
        /// </summary>
        public string FileName {
            get {
                return _filename;
            }
        }

        /// <summary>
        /// Gets file size of uploaded file.
        /// </summary>
        public string FileSize {
            get {
                return _filesize;
            }
        }

        /// <summary>
        /// Gets state of uploaded file.
        /// </summary>
        public AsyncFileUploadState State {
            get {
                return _state;
            }
        }

        #endregion
    }
}
