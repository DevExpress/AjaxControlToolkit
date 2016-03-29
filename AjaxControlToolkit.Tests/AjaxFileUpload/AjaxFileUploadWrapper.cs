using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Tests {

    class AjaxFileUploadWrapper : MarshalByRefObject {

        const string testStream = "------WebKitFormBoundaryuzPlX1oHHDDbSusw\r\nContent-Disposition: form-data; name=\"act-file-data\"; filename=\"1#.txt\"\r\nContent-Type: text/plain\r\n\r\n123\r\n------WebKitFormBoundaryuzPlX1oHHDDbSusw--\r\n";

        public void ProcessStreamWithoutTempRootPath() {
            AjaxFileUploadHelper.RootTempFolderPath = "";
            ProcessStream();
        }

        public void ProcessStreamWithTempRootPath() {
            AjaxFileUploadHelper.RootTempFolderPath = @"C:\";
            ProcessStream();
        }

        void ProcessStream() {
            var stream = GenerateStreamFromString(testStream);
            new AjaxFileUploadHelper().ProcessStream(new FakeCache(), stream, "fileId", "fileName", false, false, false);
        }

        MemoryStream GenerateStreamFromString(string value) {
            return new MemoryStream(Encoding.UTF8.GetBytes(value ?? ""));
        }

        private class FakeCache : IWebCache {

            Dictionary<string, object> set = new Dictionary<string, object>();

            public object this[string key] {
                get {
                    if(set.ContainsKey(key))
                        return set[key];

                    return null;
                }
                set { set[key] = value; }
            }
        }
    }
}
