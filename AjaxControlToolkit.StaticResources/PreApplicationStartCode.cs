using System;
using System.Web.Optimization;

namespace AjaxControlToolkit.StaticResources {

    public class PreApplicationStartCode {

        public static void Start() {
            if(ToolkitConfig.UseStaticResources)
                ToolkitResourceManager.RegisterScriptMappings(null);

            CreateScriptBundle(null);
            CreateStyleBundle(null);

            var bundleResolver = new AjaxControlToolkit.Bundling.BundleResolver(new AjaxControlToolkit.Bundling.DefaultCache());
            foreach(var bundleName in bundleResolver.GetControlBundles()) {
                if(ToolkitConfig.UseStaticResources)
                    ToolkitResourceManager.RegisterScriptMappings(bundleName);

                CreateScriptBundle(bundleName);
                CreateStyleBundle(bundleName);
            }
        }

        static void CreateScriptBundle(string bundleName) {
            if(String.IsNullOrWhiteSpace(bundleName)) {
                var bundle = new ScriptBundle("~/Scripts/AjaxControlToolkit/Bundle", Constants.CdnPrefix + "Scripts/AjaxControlToolkit/Bundle.js")
                    .Include(ToolkitResourceManager.GetScriptPaths());
                AddCdnFallbackExpression(bundle);
                BundleTable.Bundles.Add(bundle);
            } else {
                var bundle = new ScriptBundle("~/Scripts/AjaxControlToolkit/" + bundleName + "Bundle")
                    .Include(ToolkitResourceManager.GetScriptPaths(bundleName));
                AddCdnFallbackExpression(bundle);
                BundleTable.Bundles.Add(bundle);
            }
        }

        static void AddCdnFallbackExpression(Bundle bundle) {
            bundle.CdnFallbackExpression = "Sys.Extended";
        }

        static void CreateStyleBundle(string bundleName) {
            if(String.IsNullOrWhiteSpace(bundleName))
                BundleTable.Bundles.Add(new StyleBundle("~/Content/AjaxControlToolkit/Styles/Bundle", Constants.CdnPrefix + "Content/AjaxControlToolkit/Styles/Bundle.css")
                    .Include(ToolkitResourceManager.GetStylePaths()));
            else
                BundleTable.Bundles.Add(new StyleBundle("~/Content/AjaxControlToolkit/Styles/" + bundleName + "Bundle")
                    .Include(ToolkitResourceManager.GetStylePaths(bundleName)));
        }
    }
}
