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

        // In Medium Trust environments, set AjaxFileUploadHelper.RootTempFolderPath to an existing directory located within the web application root.
        AjaxFileUploadHelper.RootTempFolderPath = "~/Temp";
        BundleTable.EnableOptimizations = true;
    }

</script>
