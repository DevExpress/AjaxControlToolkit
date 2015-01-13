using System.Web.Optimization;

namespace AjaxControlToolkit.StaticResources {

    public class PreApplicationStartCode {

        public static void Start() {
            CreateScriptBundle();
            CreateStyleBundle();

            var bundleResolver = new AjaxControlToolkit.Bundling.BundleResolver(new AjaxControlToolkit.Bundling.DefaultCache());
            foreach(var bundleName in bundleResolver.GetControlBundles()) {
                CreateScriptBundle(bundleName);
                CreateStyleBundle(bundleName);
            }
        }

        static void CreateScriptBundle(string bundleName = null) {
            BundleTable.Bundles.Add(new ScriptBundle("~/Scripts/AjaxControlToolkit/" + bundleName + "Bundle")
                    .Include(ToolkitResourceManager.GetScriptPaths(bundleName)));
        }

        static void CreateStyleBundle(string bundleName = null) {
            BundleTable.Bundles.Add(new StyleBundle("~/Content/AjaxControlToolkit/Styles/" + bundleName + "Bundle")
                    .Include(ToolkitResourceManager.GetStylePaths(bundleName)));
        }
    }
}
