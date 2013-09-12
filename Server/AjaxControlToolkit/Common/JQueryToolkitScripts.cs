using System.Web.UI;

[assembly: WebResource("jQuery.Start.js", "text/javascript")]
[assembly: WebResource("jQuery.Start.debug.js", "text/javascript")]

#if (NET45 || NET40)
[assembly: WebResource("jQuery.jQuery.js", "application/x-javascript", CdnPath = "http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.10.2.min.js")]
[assembly: WebResource("jQuery.jQuery.debug.js", "application/x-javascript", CdnPath = "http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.10.2.js")]
[assembly: WebResource("jQuery.jQueryUI.js", "application/x-javascript", CdnPath = "http://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.3/jquery-ui.min.js")]
[assembly: WebResource("jQuery.jQueryUI.debug.js", "application/x-javascript", CdnPath = "http://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.3/jquery-ui.js")]
#else
[assembly: WebResource("jQuery.jQuery.js", "application/x-javascript")]
[assembly: WebResource("jQuery.jQuery.debug.js", "application/x-javascript")]
[assembly: WebResource("jQuery.jQueryUI.js", "application/x-javascript")]
[assembly: WebResource("jQuery.jQueryUI.debug.js", "application/x-javascript")]
#endif



namespace AjaxControlToolkit {
    [ClientScriptResource(null, "jQuery.jQuery.js", LoadOrder = 0)]
    [ClientScriptResource(null, "jQuery.jQueryUI.js", LoadOrder = 1)]
    [ClientScriptResource(null, "jQuery.Start.js", LoadOrder = 2)]   
    public static class JQueryToolkitScripts {
    }
}