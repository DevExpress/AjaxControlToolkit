using System.Web.UI;

#if (NET45 || NET40)
[assembly: WebResource("jQuery.jQuery.js", "application/x-javascript", CdnPath = "http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.10.2.min.js")]
[assembly: WebResource("jQuery.jQuery.debug.js", "application/x-javascript", CdnPath = "http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.10.2.js")]
#else
[assembly: WebResource("jQuery.jQuery.js", "application/x-javascript")]
[assembly: WebResource("jQuery.jQuery.debug.js", "application/x-javascript")]
#endif

[assembly: WebResource("jQuery.jQueryUIWidget.js", "application/x-javascript")]
[assembly: WebResource("jQuery.jQueryUIWidget.debug.js", "application/x-javascript")]
[assembly: WebResource("jQuery.Start.js", "text/javascript")]
[assembly: WebResource("jQuery.Start.debug.js", "text/javascript")]
[assembly: WebResource("Common.JQueryToolkitScripts.js", "application/x-javascript")]
[assembly: WebResource("Common.JQueryToolkitScripts.debug.js", "application/x-javascript")]


namespace AjaxControlToolkit {
    [ClientScriptResource(null, "jQuery.jQuery.js", LoadOrder = 0)]
    [ClientScriptResource(null, "jQuery.jQueryUIWidget.js", LoadOrder = 1)]
    [ClientScriptResource(null, "jQuery.Start.js", LoadOrder = 2)]
    [ClientScriptResource(null, "Common.JQueryToolkitScripts.js", LoadOrder = 3)]
    public static class JQueryToolkitScripts {
    }
}