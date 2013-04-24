using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace AjaxControlToolkit
{
    public class AjaxFileUploadStates
    {
        private readonly HttpContext _httpContext;
        private readonly string _id;

        public AjaxFileUploadStates(HttpContext context, string id)
        {
            _httpContext = context;
            _id = id;
        }

        private string GetSessionName(string name)
        {
            return "AjaxFileUpload_" + name + "_" + _id;
        }

        public decimal FileLength
        {
            get
            {
                return decimal.Parse((string)_httpContext.Cache[GetSessionName("percent")] ?? "0");
            }
            set
            {
                _httpContext.Cache[GetSessionName("percent")] = value.ToString();
            }
        }

        public decimal Uploaded
        {
            get
            {
                return decimal.Parse((string)_httpContext.Cache[GetSessionName("uploaded")] ?? "0");
            }
            set
            {
                _httpContext.Cache[GetSessionName("uploaded")] = value.ToString();
            }
        }

        public decimal Percent
        {
            get
            {
                var length = this.FileLength;
                var uploaded = this.Uploaded;

                if (length == 0 || uploaded == 0)
                    return 0;

                return (uploaded / length) * 100;
            }
        }
    }
}
