using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.SessionState;
using AjaxControlToolkit.Properties;

namespace AjaxControlToolkit
{
    internal sealed class AfuPersistedStoreManager
    {
        #region Constructor
        private AfuPersistedStoreManager()
        {
        }
        #endregion

        #region Public Singleton Instance Property
        public static AfuPersistedStoreManager Instance
        {
            get
            {
                // Return our singleton instance via our nested class.
                return InstanceInitializer.instance;
            }
        }
        #endregion

        #region Nested Class for Fully Lazy Singleton
        private class InstanceInitializer
        {
            // C# compiler needs static constructor so not to mark our class as beforefieldinit
            // beforefieldinit would allow our type initializer to be invoked at any time
            // before the first reference to a static field in it, this would prevent us for
            // using this method to create a fully lazy singleton. Ensuring we always do not
            // have our class marked as beforefieldinit means we are guaranteed that our type
            // initializer is only invoked when we are called and our internal static readonly
            // guarantees that we will only initialized once giving us a fully thread safe
            // fully lazy singleton.
            static InstanceInitializer()
            {
            }

            // Internal static readonly singleton containing our reference to our main object
            internal static readonly AfuPersistedStoreManager instance = new AfuPersistedStoreManager();
        }
        #endregion

        public enum PersistedStoreTypeEnum
        {
            Session = 0
        }

        private readonly static string IdSeperator = "~!~";
        private string extendedFileUploadGUID = null;
        private PersistedStoreTypeEnum persistedStorageType = PersistedStoreTypeEnum.Session;

        public PersistedStoreTypeEnum PersistedStorageType
        {
            get { return persistedStorageType; }
            set { persistedStorageType = value; }
        }

        public string ExtendedFileUploadGUID
        {
            get { return extendedFileUploadGUID; }
            set { extendedFileUploadGUID = value; }
        }

        public string GetFullID(string controlId)
        {
            return extendedFileUploadGUID + AfuPersistedStoreManager.IdSeperator + controlId;
        }

        public void ClearAllFilesFromSession(string controlId)
        {
            HttpContext currentContext = null;
            if ((currentContext = GetCurrentContext()) != null)
            {
                Collection<string> keysToRemove = new Collection<string>();
                foreach (string key in currentContext.Session.Keys)
                {
                    if (key.StartsWith(extendedFileUploadGUID))
                    {
                        keysToRemove.Add(key);
                    }
                }
                foreach (string key in keysToRemove)
                {
                    currentContext.Session.Remove(key);
                }
            }
        }

        public void RemoveFileFromSession(string controlId)
        {
            HttpContext currentContext = null;
            if ((currentContext = GetCurrentContext()) != null)
            {
                Collection<string> keysToRemove = new Collection<string>();
                foreach (string key in currentContext.Session.Keys)
                {
                    if (key.StartsWith(GetFullID(controlId)))
                    {
                        keysToRemove.Add(key);
                    }
                }
                foreach (string key in keysToRemove)
                {
                    currentContext.Session.Remove(key);
                }
            }
        }

        public void AddFileToSession(string controlId, string filename, HttpPostedFile fileUpload)
        {
            if (fileUpload == null)
            {
                throw new ArgumentNullException("fileUpload");
            }
            else if (controlId == String.Empty)
            {
                throw new ArgumentNullException("controlId");
            }

            HttpContext currentContext = null;
            if ((currentContext = GetCurrentContext()) != null)
            {
                var mode = currentContext.Session.Mode;
                if (mode != SessionStateMode.InProc) {
#if NET4 || NET45
                    throw new InvalidOperationException(Resources_NET4.SessionStateOutOfProcessNotSupported);
#else
                    throw new InvalidOperationException(Resources.SessionStateOutOfProcessNotSupported);
#endif
                }
                currentContext.Session.Add(GetFullID(controlId), fileUpload);
            }
        }

        public bool FileExists(string controlId)
        {
            if (controlId == null)
            {
                throw new ArgumentNullException("controlId");
            }
            HttpContext currentContext = null;
            if ((currentContext = GetCurrentContext()) != null)
            {
                if (currentContext.Session[GetFullID(controlId)] != null)
                {
                    HttpPostedFile postedFile = currentContext.Session[GetFullID(controlId)] as HttpPostedFile;
                    if (postedFile != null)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public string GetFileName(string controlId)
        {
            if (controlId == null)
            {
                throw new ArgumentNullException("controlId");
            }
            HttpContext currentContext = null;
            if ((currentContext = GetCurrentContext()) != null)
            {
                HttpPostedFile postedFile = currentContext.Session[GetFullID(controlId)] as HttpPostedFile;
                if (postedFile != null)
                {
                    return postedFile.FileName;
                }
            }
            return String.Empty;
        }

        public string GetContentType(string controlId)
        {
            if (controlId == null)
            {
                throw new ArgumentNullException("controlId");
            }
            HttpContext currentContext = null;
            if ((currentContext = GetCurrentContext()) != null)
            {
                HttpPostedFile postedFile = currentContext.Session[GetFullID(controlId)] as HttpPostedFile;
                if (postedFile != null)
                {
                    return postedFile.ContentType;
                }
            }
            return String.Empty;
        }


        public HttpPostedFile GetFileFromSession(string controlId)
        {
            if (controlId == null)
            {
                throw new ArgumentNullException("controlId");
            }
            HttpContext currentContext = null;
            if ((currentContext = GetCurrentContext()) != null)
            {
                if (currentContext.Session[GetFullID(controlId)] != null)
                {
                    HttpPostedFile postedFile = currentContext.Session[GetFullID(controlId)] as HttpPostedFile;
                    if (postedFile != null)
                    {
                        return postedFile;
                    }
                    else
                    {
                        throw new InvalidCastException("postedFile");
                    }
                }
                else
                {
                    return null;
                }
            }
            return null;
        }

        public List<HttpPostedFile> GetAllFilesFromSession(string controlId)
        {
            List<HttpPostedFile> postedFiles = new List<HttpPostedFile>();
            HttpContext currentContext = null;
            if ((currentContext = GetCurrentContext()) != null)
            {
                foreach (string key in currentContext.Session.Keys)
                {
                    if (key.StartsWith(extendedFileUploadGUID))
                    {
                        if (HttpContext.Current.Session[key] != null)
                        {
                            HttpPostedFile postedFile = HttpContext.Current.Session[key] as HttpPostedFile;
                            if (postedFile != null)
                            {
                                postedFiles.Add(postedFile);
                            }
                        }
                    }
                }
            }
            return postedFiles;
        }

        private HttpContext GetCurrentContext()
        {
            if (HttpContext.Current != null && HttpContext.Current.Session != null)
            {
                return HttpContext.Current;
            }
            else
            {
                return null;
            }
        }
    }
}
