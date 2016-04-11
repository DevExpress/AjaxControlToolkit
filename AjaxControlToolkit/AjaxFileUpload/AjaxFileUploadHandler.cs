#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.SessionState;

namespace AjaxControlToolkit {

    // Map this handler as AjaxFileUploadHandler.axd
    public class AjaxFileUploadHandler : IHttpHandler, IReadOnlySessionState {

        public bool IsReusable {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context) {
            var request = context.Request;

            if(request.QueryString["contextKey"] != AjaxFileUpload.ContextKey)
                throw new Exception("Invalid context key");

            if(request.Headers["Content-Type"] != null &&
                request.Headers["Content-Type"].StartsWith("multipart/form-data;") &&
                request.Headers["Content-Length"] != null)
                AjaxFileUploadHelper.Process(context);
            else
                throw new Exception("Invalid upload request.");

            context.Response.ContentEncoding = Encoding.UTF8;
            context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            context.Response.End();
        }
    }

}
#pragma warning restore 1591