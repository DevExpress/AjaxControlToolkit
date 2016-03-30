<%@ Application Language="C#" %>
<%@ Import Namespace="System.Web.Optimization" %>
<%@ Import Namespace="AjaxControlToolkit" %>

<script RunAt="server">

    void Application_Start(object sender, EventArgs e) {
        BundleTable.Bundles.Add(new ScriptBundle("~/bundles/MsAjaxJs").Include(
            "~/Scripts/WebForms/MsAjax/MicrosoftAjax.js",
            "~/Scripts/WebForms/MsAjax/MicrosoftAjaxApplicationServices.js",
            "~/Scripts/WebForms/MsAjax/MicrosoftAjaxTimer.js",
            "~/Scripts/WebForms/MsAjax/MicrosoftAjaxWebForms.js"));

        // create "Temp" folder beforehand to avoid site recompilation: http://stackoverflow.com/questions/2699460/
        AjaxFileUploadHelper.RootTempFolderPath = HttpContext.Current.Server.MapPath(@"~\Temp");
        BundleTable.EnableOptimizations = true;
    }

</script>
