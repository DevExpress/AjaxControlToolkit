using System;
using System.Web;

namespace AjaxControlToolkit {

    /// <summary>
    /// AjaxControlToolkit http handler for generating output of the combined script files.
    /// </summary>
    public class CombineScriptsHandler : IHttpHandler {
        /// <summary>
        /// You will need to configure this handler in the Web.config file of your 
        /// web and register it with IIS before being able to use it. For more information
        /// see the following link: http://go.microsoft.com/?linkid=8101007
        /// </summary>

        #region IHttpHandler Members

        public bool IsReusable {
            // Return false in case your Managed Handler cannot be reused for another request.
            // Usually this would be false in case you have some state information preserved per request.
            get { return true; }
        }

        public void ProcessRequest(HttpContext context) {
            if (!ToolkitScriptManager.OutputCombinedScriptFile(context)) {
                throw new InvalidOperationException("Combined script file output failed unexpectedly.");
            }
        }

        #endregion
    }
}
