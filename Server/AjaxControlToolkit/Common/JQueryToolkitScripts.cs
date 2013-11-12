using System.Web.UI;

[assembly: System.Web.UI.WebResource(AjaxControlToolkit.Constants.BaseScriptResourceName, "text/javascript")]
[assembly: System.Web.UI.WebResource(AjaxControlToolkit.Constants.BaseScriptResourceNameDebug, "text/javascript")]
[assembly: ScriptResource(AjaxControlToolkit.Constants.BaseScriptResourceName, "ScriptResources.BaseScriptsResources.resources", "Sys.Extended.UI.Resources")]

#if (NET45 || NET40)
[assembly: WebResource("jQuery.jQuery.js", "application/x-javascript", CdnPath = "http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.10.2.min.js")]
[assembly: WebResource("jQuery.jQuery.debug.js", "application/x-javascript", CdnPath = "http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.10.2.js")]
#else
[assembly: WebResource("jQuery.jQuery.js", "application/x-javascript")]
[assembly: WebResource("jQuery.jQuery.debug.js", "application/x-javascript")]
#endif

[assembly: WebResource("jQuery.Start.js", "text/javascript")]
[assembly: WebResource("jQuery.Start.debug.js", "text/javascript")]
[assembly: WebResource("jQuery.Common.Common.js", "text/javascript")]
[assembly: WebResource("jQuery.Common.Common.debug.js", "text/javascript")]
[assembly: WebResource("jQuery.jQueryUIWidget.js", "application/x-javascript")]
[assembly: WebResource("jQuery.jQueryUIWidget.debug.js", "application/x-javascript")]
[assembly: WebResource("Common.JQueryToolkitScripts.js", "application/x-javascript")]
[assembly: WebResource("Common.JQueryToolkitScripts.debug.js", "application/x-javascript")]


namespace AjaxControlToolkit {
    [ClientScriptResource(null, Constants.BaseScriptResourceName, LoadOrder = 0)] // Maintain dependency of Sys.Extended.UI.Resources
    [ClientScriptResource(null, "jQuery.jQuery.js", LoadOrder = 1)]
    [ClientScriptResource(null, "jQuery.Start.js", LoadOrder = 2)]
    [ClientScriptResource(null, "jQuery.Common.Common.js", LoadOrder = 3)]
    [ClientScriptResource(null, "jQuery.jQueryUIWidget.js", LoadOrder = 4)]
    [ClientScriptResource(null, "Common.JQueryToolkitScripts.js", LoadOrder = 5)]
    public class JQueryToolkitScripts {
        
    }
}