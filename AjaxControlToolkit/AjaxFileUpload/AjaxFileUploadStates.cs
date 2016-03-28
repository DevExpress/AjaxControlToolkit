#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Caching;

namespace AjaxControlToolkit {

    public class AjaxFileUploadStates {
        readonly IWebCache _cache;
        readonly string _id;

        public AjaxFileUploadStates(IWebCache cache, string id) {
            _cache = cache;
            _id = id;
        }

        public decimal FileLength {
            get { return decimal.Parse((string)_cache[GetSessionName("fileLength")] ?? "0"); }
            set { _cache[GetSessionName("fileLength")] = value.ToString(); }
        }

        public decimal Uploaded {
            get { return decimal.Parse((string)_cache[GetSessionName("uploaded")] ?? "0"); }
            set { _cache[GetSessionName("uploaded")] = value.ToString(); }
        }

        public decimal Percent {
            get {
                var length = this.FileLength;
                var uploaded = this.Uploaded;

                if(length == 0 || uploaded == 0)
                    return 0;

                return (uploaded / length) * 100;
            }
        }

        public bool Abort {
            get { return bool.Parse((string)_cache[GetSessionName("abort")] ?? "false"); }
            set { _cache[GetSessionName("abort")] = value.ToString(); }
        }

        public List<string> BlockList {
            get {
                if(_cache[GetSessionName("blockList")] == null)
                    _cache[GetSessionName("blockList")] = new List<string>();

                return (List<string>)_cache[GetSessionName("blockList")];
            }
            set { _cache[GetSessionName("blockList")] = value; }
        }

        string GetSessionName(string name) {
            return "AjaxFileUpload_" + name + "_" + _id;
        }
    }

}
#pragma warning restore 1591