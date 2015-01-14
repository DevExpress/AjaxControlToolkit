using System;
using System.Web.Optimization;

namespace AjaxControlToolkit.StaticResources {

    public class PreApplicationStartCode {

        public static void Start() {
            CreateScriptBundle(null);
            CreateStyleBundle(null);

            var bundleResolver = new AjaxControlToolkit.Bundling.BundleResolver(new AjaxControlToolkit.Bundling.DefaultCache());
            foreach(var bundleName in bundleResolver.GetControlBundles()) {
                CreateScriptBundle(bundleName);
                CreateStyleBundle(bundleName);
            }
        }

        static void CreateScriptBundle(string bundleName) {
            if(String.IsNullOrWhiteSpace(bundleName))
                BundleTable.Bundles.Add(new ScriptBundle("~/Scripts/AjaxControlToolkit/Bundle")
                    .Include(ToolkitResourceManager.GetScriptPaths()));
            else
                BundleTable.Bundles.Add(new ScriptBundle("~/Scripts/AjaxControlToolkit/" + bundleName + "Bundle")
                    .Include(ToolkitResourceManager.GetScriptPaths(bundleName)));
        }

        static void CreateStyleBundle(string bundleName) {
            if(String.IsNullOrWhiteSpace(bundleName))
                BundleTable.Bundles.Add(new StyleBundle("~/Content/AjaxControlToolkit/Styles/Bundle")
                    .Include(ToolkitResourceManager.GetStylePaths()));
            else
                BundleTable.Bundles.Add(new StyleBundle("~/Content/AjaxControlToolkit/Styles/" + bundleName + "Bundle")
                    .Include(ToolkitResourceManager.GetStylePaths(bundleName)));
        }
    }
}
