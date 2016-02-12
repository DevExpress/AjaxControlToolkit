#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AjaxControlToolkit {

    public class AjaxFileUploadStates {
        readonly HttpContext _httpContext;
        readonly string _id;

        public AjaxFileUploadStates(HttpContext context, string id) {
            _httpContext = context;
            _id = id;
        }

        public decimal FileLength {
            get { return decimal.Parse((string)_httpContext.Cache[GetSessionName("fileLength")] ?? "0"); }
            set { _httpContext.Cache[GetSessionName("fileLength")] = value.ToString(); }
        }

        public decimal Uploaded {
            get { return decimal.Parse((string)_httpContext.Cache[GetSessionName("uploaded")] ?? "0"); }
            set { _httpContext.Cache[GetSessionName("uploaded")] = value.ToString(); }
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
            get { return bool.Parse((string)_httpContext.Cache[GetSessionName("abort")] ?? "false"); }
            set { _httpContext.Cache[GetSessionName("abort")] = value.ToString(); }
        }

        public List<string> BlockList {
            get {
                if(_httpContext.Cache[GetSessionName("blockList")] == null)
                    _httpContext.Cache[GetSessionName("blockList")] = new List<string>();

                return (List<string>)_httpContext.Cache[GetSessionName("blockList")];
            }
            set { _httpContext.Cache[GetSessionName("blockList")] = value; }
        }

        string GetSessionName(string name) {
            return "AjaxFileUpload_" + name + "_" + _id;
        }
    }

}
#pragma warning restore 1591