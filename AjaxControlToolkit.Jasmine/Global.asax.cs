using AjaxControlToolkit.Jasmine.App_Start;
using System;
using System.Web;
using System.Web.Optimization;
using System.Web.Routing;

namespace AjaxControlToolkit.Jasmine {
    public class Global : System.Web.HttpApplication {

        protected void Application_Start(object sender, EventArgs e) {
            RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            AjaxControlToolkit.ToolkitResourceManager.RegisterControl(typeof(Suites.ToolkitResourceManager.TestExtender));
        }

        void RegisterRoutes(RouteCollection routeCollection) {
            routeCollection.MapPageRoute("TestsRoute", "Tests/{suite}", "~/Tests.aspx");

            routeCollection.MapPageRoute("SpecsRoute",
                "Suite/{suiteDirName}/Specs/{specName}",
                "~/Suites/{suiteDirName}/Specs/{specName}.aspx");

            routeCollection.MapPageRoute("SuiteRoute",
                "Suite/{suiteDirName}/{specName}",
                "~/Suites/{suiteDirName}/{specName}.aspx");
        }
    }
}