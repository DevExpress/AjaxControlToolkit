<%@ Application Language="C#" %>
<%@ Import Namespace="System.Web.Optimization" %>
<%@ Import Namespace="AjaxControlToolkit" %>
<%@ Import Namespace="System.IO" %>

<script RunAt="server">

    void Application_Start(object sender, EventArgs e) {
        BundleTable.Bundles.Add(new ScriptBundle("~/bundles/MsAjaxJs").Include(
            "~/Scripts/WebForms/MsAjax/MicrosoftAjax.js",
            "~/Scripts/WebForms/MsAjax/MicrosoftAjaxApplicationServices.js",
            "~/Scripts/WebForms/MsAjax/MicrosoftAjaxTimer.js",
            "~/Scripts/WebForms/MsAjax/MicrosoftAjaxWebForms.js"));

        BundleTable.EnableOptimizations = true;

        var tempFolder = Server.MapPath(ToolkitConfig.TempFolder);
        foreach(var dir in Directory.EnumerateDirectories(tempFolder)) {
            try {
                Directory.Delete(dir, true);
            } catch { }
        }
    }

</script>
