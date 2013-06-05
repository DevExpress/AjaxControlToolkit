using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;

[assembly: System.Web.UI.WebResource("Common.Threading.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("Common.Threading.debug.js", "application/x-javascript")]

namespace AjaxControlToolkit
{
    [ClientScriptResource(null, "Common.Threading.js")]
    public static class ThreadingScripts
    {
    }
}
