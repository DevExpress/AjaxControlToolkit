using System.Web.Optimization;

namespace AjaxControlToolkit.StaticResources {

    public class PreApplicationStartCode {

        public static void Start() {
            BundleTable.Bundles.Add(new ScriptBundle("~/Scripts/AjaxControlToolkit/Bundle").Include(ToolkitResourceManager.GetScriptPaths()));
            BundleTable.Bundles.Add(new StyleBundle("~/Content/AjaxControlToolkit/Styles/Bundle").Include(ToolkitResourceManager.GetStylePaths()));
        }
    }
}
