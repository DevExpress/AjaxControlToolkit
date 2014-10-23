<%@ Application Language="C#" %>
<%@ Import Namespace="System.Web.Optimization" %>
<%@ Import Namespace="AjaxControlToolkit" %>

<script RunAt="server">

    void Application_Start(object sender, EventArgs e) {
        ToolkitResourceManager.UseStaticResources = true;
        BundleTable.EnableOptimizations = true;
        BundleTable.Bundles.Add(new ScriptBundle("~/bundles/AjaxControlToolkit/Scripts").Include(ToolkitResourceManager.GetScriptPaths()));
        BundleTable.Bundles.Add(new StyleBundle("~/bundles/AjaxControlToolkit/Styles").Include(ToolkitResourceManager.GetStylePaths()));
    }

</script>
