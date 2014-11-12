using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace AjaxControlToolkit {

    internal class AfuPersistedStoreManager {
        const string _idSeperator = "~!~";
        string _extendedFileUploadGUID = null;

        private AfuPersistedStoreManager() {
        }

        public static AfuPersistedStoreManager Instance {
            get { return InstanceInitializer.instance; }
        }

        public string ExtendedFileUploadGUID {
            get { return _extendedFileUploadGUID; }
            set { _extendedFileUploadGUID = value; }
        }

        public string GetFullID(string controlId) {
            return _extendedFileUploadGUID + AfuPersistedStoreManager._idSeperator + controlId;
        }

        public void ClearAllFilesFromSession(string controlId) {
            HttpContext currentContext = null;
            if((currentContext = GetCurrentContext()) != null) {
                var keysToRemove = new Collection<string>();
                foreach(string key in currentContext.Session.Keys) {
                    if(key.StartsWith(_extendedFileUploadGUID))
                        keysToRemove.Add(key);
                }
                foreach(string key in keysToRemove) {
                    currentContext.Session.Remove(key);
                }
            }
        }

        public void RemoveFileFromSession(string controlId) {
            HttpContext currentContext = null;
            if((currentContext = GetCurrentContext()) != null) {
                var keysToRemove = new Collection<string>();
                foreach(string key in currentContext.Session.Keys) {
                    if(key.StartsWith(GetFullID(controlId)))
                        keysToRemove.Add(key);
                }
                foreach(string key in keysToRemove) {
                    currentContext.Session.Remove(key);
                }
            }
        }

        public void AddFileToSession(string controlId, string filename, HttpPostedFile fileUpload) {
            if(fileUpload == null) {
                throw new ArgumentNullException("fileUpload");
            } else if(controlId == String.Empty) {
                throw new ArgumentNullException("controlId");
            }

            HttpContext currentContext = null;
            if((currentContext = GetCurrentContext()) != null) {
                var mode = currentContext.Session.Mode;
                if(mode != SessionStateMode.InProc)
                    throw new InvalidOperationException("The AsyncFileUpload control only supports session state mode \"InProc\" when persisting files in session.");

                currentContext.Session.Add(GetFullID(controlId), fileUpload);
            }
        }

        public bool FileExists(string controlId) {
            if(controlId == null)
                throw new ArgumentNullException("controlId");

            HttpContext currentContext = null;
            if((currentContext = GetCurrentContext()) != null) {
                if(currentContext.Session[GetFullID(controlId)] != null) {
                    var postedFile = currentContext.Session[GetFullID(controlId)] as HttpPostedFile;
                    if(postedFile != null)
                        return true;
                }
            }
            return false;
        }

        public string GetFileName(string controlId) {
            if(controlId == null)
                throw new ArgumentNullException("controlId");

            HttpContext currentContext = null;
            if((currentContext = GetCurrentContext()) != null) {
                var postedFile = currentContext.Session[GetFullID(controlId)] as HttpPostedFile;
                if(postedFile != null)
                    return postedFile.FileName;
            }
            return String.Empty;
        }

        public string GetContentType(string controlId) {
            if(controlId == null)
                throw new ArgumentNullException("controlId");

            HttpContext currentContext = null;
            if((currentContext = GetCurrentContext()) != null) {
                var postedFile = currentContext.Session[GetFullID(controlId)] as HttpPostedFile;
                if(postedFile != null)
                    return postedFile.ContentType;
            }
            return String.Empty;
        }


        public HttpPostedFile GetFileFromSession(string controlId) {
            if(controlId == null)
                throw new ArgumentNullException("controlId");

            HttpContext currentContext = null;
            if((currentContext = GetCurrentContext()) != null) {
                if(currentContext.Session[GetFullID(controlId)] != null) {
                    var postedFile = currentContext.Session[GetFullID(controlId)] as HttpPostedFile;

                    if(postedFile != null)
                        return postedFile;
                    else
                        throw new InvalidCastException("postedFile");
                } else {
                    return null;
                }
            }
            return null;
        }

        public List<HttpPostedFile> GetAllFilesFromSession(string controlId) {
            var postedFiles = new List<HttpPostedFile>();
            HttpContext currentContext = null;
            if((currentContext = GetCurrentContext()) != null) {
                foreach(string key in currentContext.Session.Keys) {
                    if(key.StartsWith(_extendedFileUploadGUID)) {
                        if(HttpContext.Current.Session[key] != null) {
                            var postedFile = HttpContext.Current.Session[key] as HttpPostedFile;

                            if(postedFile != null)
                                postedFiles.Add(postedFile);
                        }
                    }
                }
            }
            return postedFiles;
        }

        HttpContext GetCurrentContext() {
            if(HttpContext.Current != null && HttpContext.Current.Session != null)
                return HttpContext.Current;
            else
                return null;
        }

        class InstanceInitializer {

            //preventing marking class as BeforeFieldInit
            static InstanceInitializer() {
            }

            internal static readonly AfuPersistedStoreManager instance = new AfuPersistedStoreManager();
        }
    }
}