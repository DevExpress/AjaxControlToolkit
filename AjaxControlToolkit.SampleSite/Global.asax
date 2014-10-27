<%@ Application Language="C#" %>
<%@ Import Namespace="System.Web.Optimization" %>
<%@ Import Namespace="AjaxControlToolkit" %>

<script RunAt="server">

    void Application_Start(object sender, EventArgs e) {
        ToolkitResourceManager.UseStaticResources();
        BundleTable.EnableOptimizations = true;
        BundleTable.Bundles.Add(new ScriptBundle("~/Scripts/AjaxControlToolkit/Bundle").Include(ToolkitResourceManager.GetScriptPaths()));
        BundleTable.Bundles.Add(new StyleBundle("~/Content/AjaxControlToolkit/Styles/Bundle").Include(ToolkitResourceManager.GetStylePaths()));
    }

</script>
