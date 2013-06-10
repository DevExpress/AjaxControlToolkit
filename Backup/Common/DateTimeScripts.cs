using System.Web.UI;
using System.Web;
using System.Web.Script.Services;
using AjaxControlToolkit;
using System.Globalization;

[assembly: System.Web.UI.WebResource("Common.DateTime.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("Common.DateTime.debug.js", "application/x-javascript")]

namespace AjaxControlToolkit
{
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource(null, "Common.DateTime.js")]
    public static class DateTimeScripts
    {
    }
}
