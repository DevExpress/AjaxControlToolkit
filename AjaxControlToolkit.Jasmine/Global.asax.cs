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
        }

        void RegisterRoutes(RouteCollection routeCollection) {
            routeCollection.MapPageRoute("TestsRoute",
                                        "Tests/{suite}",
                                        "~/Tests.aspx");

            routeCollection.MapPageRoute("SuiteRoute",
                            "Suite/{suiteName}",
                            "~/Suites/{suiteName}.aspx");
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