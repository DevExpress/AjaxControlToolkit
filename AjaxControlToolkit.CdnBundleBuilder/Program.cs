using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Hosting;
using System.Web.Optimization;

namespace AjaxControlToolkit.CdnBundleBuilder {

    class Program {

        static void Main(string[] args) {
            var scriptBundle = new ScriptBundle("~/ScriptsBundle").Include(ToolkitResourceManager.GetScriptPaths());
            var styleBundle = new StyleBundle("~/StylesBundle").Include(ToolkitResourceManager.GetStylePaths());

            BundleTable.VirtualPathProvider = new VirtualPathProviderImpl();
            BundleTable.Bundles.Add(scriptBundle);
            BundleTable.Bundles.Add(styleBundle);

            var context = new BundleContext(CreateHttpContext(), BundleTable.Bundles, String.Empty);

            File.WriteAllText("../AjaxControlToolkit.StaticResources/Scripts/Bundle.js", scriptBundle.GenerateBundleResponse(context).Content);
            File.WriteAllText("../AjaxControlToolkit.StaticResources/Styles/Bundle.css", styleBundle.GenerateBundleResponse(context).Content);
        }

        static HttpContextWrapper CreateHttpContext() {
            return new HttpContextWrapper(new HttpContext(
                new HttpRequest("", "http://example.com", ""),
                new HttpResponse(new StringWriter())
            ));
        }

        class VirtualPathProviderImpl : VirtualPathProvider {
            public override VirtualFile GetFile(string virtualPath) {
                virtualPath = virtualPath
                    .Replace("~/Scripts/AjaxControlToolkit/", "../AjaxControlToolkit.StaticResources/Scripts/")
                    .Replace("~/Content/AjaxControlToolkit/Styles", "../AjaxControlToolkit.StaticResources/Styles/");

                return new VirtualFileImpl(virtualPath);
            }
        }

        class VirtualFileImpl : VirtualFile {

            public VirtualFileImpl(string path)
                : base(path) {
            }

            public override Stream Open() {
                return File.Open(VirtualPath, FileMode.Open);
            }
        }

        class NoTransform : IBundleTransform {

            public void Process(BundleContext context, BundleResponse response) {
                
            }
        }
    }

}
