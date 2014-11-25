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

        ToolkitResourceManager.UseStaticResources();
        BundleTable.EnableOptimizations = true;
        BundleTable.Bundles.Add(new ScriptBundle("~/Scripts/AjaxControlToolkit/Bundle").Include(ToolkitResourceManager.GetScriptPaths()));
        BundleTable.Bundles.Add(new StyleBundle("~/Content/AjaxControlToolkit/Styles/Bundle").Include(ToolkitResourceManager.GetStylePaths()));
    }

</script>
