using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;

namespace AjaxControlToolkit.Jasmine {
    public class Global : System.Web.HttpApplication {

        protected void Application_Start(object sender, EventArgs e) {
            RegisterRoutes(RouteTable.Routes);
            AjaxControlToolkit.ToolkitResourceManager.RegisterControl(typeof(Suites.ToolkitResourceManager.TestExtender));
        }

        void RegisterRoutes(RouteCollection routeCollection) {
            routeCollection.MapPageRoute("TestsRoute",
                                        "Tests/{suite}",
                                        "~/Tests.aspx");

            routeCollection.MapPageRoute("SpecsRoute",
                            "Suite/{suiteDirName}/Specs/{specName}",
                            "~/Suites/{suiteDirName}/Specs/{specName}.aspx");

            routeCollection.MapPageRoute("SuiteRoute",
                            "Suite/{suiteDirName}/{specName}",
                            "~/Suites/{suiteDirName}/{specName}.aspx");
        }

        protected void Session_Start(object sender, EventArgs e) {

        }

        protected void Application_BeginRequest(object sender, EventArgs e) {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e) {

        }

        protected void Application_Error(object sender, EventArgs e) {

        }

        protected void Session_End(object sender, EventArgs e) {

        }

        protected void Application_End(object sender, EventArgs e) {

        }
    }
}