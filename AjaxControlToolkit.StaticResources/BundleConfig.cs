using System.Web.Optimization;

namespace AjaxControlToolkit.StaticResources {

    public class BundleConfig {

        public static void Register() {
            BundleTable.Bundles.Add(new ScriptBundle("~/Scripts/AjaxControlToolkit/Bundle").Include(ToolkitResourceManager.GetScriptPaths()));
            BundleTable.Bundles.Add(new StyleBundle("~/Content/AjaxControlToolkit/Styles/Bundle").Include(ToolkitResourceManager.GetStylePaths()));
        }
    }
}
