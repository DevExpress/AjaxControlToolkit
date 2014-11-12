using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace AjaxControlToolkit {

    internal class PersistentStoreManager {
        const string _idSeperator = "~!~";
        string _extendedFileUploadGUID = null;

        private PersistentStoreManager() {
        }

        public static PersistentStoreManager Instance {
            get { return InstanceInitializer.instance; }
        }

        public string ExtendedFileUploadGUID {
            get { return _extendedFileUploadGUID; }
            set { _extendedFileUploadGUID = value; }
        }

        public string GetFullID(string controlId) {
            return _extendedFileUploadGUID + PersistentStoreManager._idSeperator + controlId;
        }

        public void ClearAllFilesFromSession(string controlId) {
            var currentContext = GetCurrentContext();
            if(currentContext == null)
                return;

            var keysToRemove = new Collection<string>();
            foreach(string key in currentContext.Session.Keys) {
                if(key.StartsWith(_extendedFileUploadGUID))
                    keysToRemove.Add(key);
            }
            foreach(string key in keysToRemove) {
                currentContext.Session.Remove(key);
            }
        }

        public void RemoveFileFromSession(string controlId) {
            var currentContext = GetCurrentContext();
            if(currentContext == null)
                return;

            var keysToRemove = new Collection<string>();
            foreach(string key in currentContext.Session.Keys) {
                if(key.StartsWith(GetFullID(controlId)))
                    keysToRemove.Add(key);
            }
            foreach(string key in keysToRemove) {
                currentContext.Session.Remove(key);
            }
        }

        public void AddFileToSession(string controlId, string filename, HttpPostedFile fileUpload) {
            if(fileUpload == null)
                throw new ArgumentNullException("fileUpload");

            if(String.IsNullOrEmpty(controlId))
                throw new ArgumentException("controlId cannot be empty", "controlId");

            var currentContext = GetCurrentContext();
            if(currentContext == null)
                return;

            var mode = currentContext.Session.Mode;
            if(mode != SessionStateMode.InProc)
                throw new InvalidOperationException("The AsyncFileUpload control only supports session state mode \"InProc\" when persisting files in session.");

            currentContext.Session.Add(GetFullID(controlId), fileUpload);
        }

        public bool FileExists(string controlId) {
            if(String.IsNullOrEmpty(controlId))
                throw new ArgumentException("controlId cannot be empty", "controlId");

            var currentContext = GetCurrentContext();
            if(currentContext == null)
                return false;

            if(currentContext.Session[GetFullID(controlId)] == null)
                return false;

            return currentContext.Session[GetFullID(controlId)] as HttpPostedFile != null;
        }

        public string GetFileName(string controlId) {
            if(String.IsNullOrEmpty(controlId))
                throw new ArgumentException("controlId cannot be empty", "controlId");

            var currentContext = GetCurrentContext();
            if(currentContext == null)
                return String.Empty;

            var postedFile = currentContext.Session[GetFullID(controlId)] as HttpPostedFile;
            if(postedFile == null)
                return String.Empty;

            return postedFile.FileName;
        }

        public string GetContentType(string controlId) {
            if(String.IsNullOrEmpty(controlId))
                throw new ArgumentException("controlId cannot be empty", "controlId");

            var currentContext = GetCurrentContext();
            if(currentContext == null)
                return String.Empty;

            var postedFile = currentContext.Session[GetFullID(controlId)] as HttpPostedFile;
            if(postedFile == null)
                return String.Empty;

            return postedFile.ContentType;
        }


        public HttpPostedFile GetFileFromSession(string controlId) {
            if(String.IsNullOrEmpty(controlId))
                throw new ArgumentException("controlId cannot be empty", "controlId");

            var currentContext = GetCurrentContext();
            if(currentContext == null)
                return null;

            if(currentContext.Session[GetFullID(controlId)] == null)
                return null;

            var postedFile = currentContext.Session[GetFullID(controlId)] as HttpPostedFile;
            if(postedFile == null)
                throw new InvalidCastException("postedFile");

            return postedFile;
        }

        public List<HttpPostedFile> GetAllFilesFromSession(string controlId) {
            var result = new List<HttpPostedFile>();
            var currentContext = GetCurrentContext();
            if(currentContext == null)
                return result;

            foreach(string key in currentContext.Session.Keys) {
                if(!key.StartsWith(_extendedFileUploadGUID) || HttpContext.Current.Session[key] == null)
                    continue;

                var postedFile = HttpContext.Current.Session[key] as HttpPostedFile;
                if(postedFile == null)
                    continue;

                result.Add(postedFile);
            }

            return result;
        }

        HttpContext GetCurrentContext() {
            if(HttpContext.Current == null || HttpContext.Current.Session == null)
                return null;

            return HttpContext.Current;
        }

        class InstanceInitializer {

            //preventing marking class as BeforeFieldInit
            static InstanceInitializer() {
            }

            internal static readonly PersistentStoreManager instance = new PersistentStoreManager();
        }
    }
}