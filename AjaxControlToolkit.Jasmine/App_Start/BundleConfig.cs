using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Optimization;

namespace AjaxControlToolkit.Jasmine.App_Start {

    public class BundleConfig {
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new ScriptBundle("~/bundles/jasmine")
                .Include("~/Infrastructure/Scripts/Libs/jasmine-2.2.0/jasmine.js",
                         "~/Infrastructure/Scripts/Libs/jasmine-2.2.0/jasmine-html.js",
                         "~/Infrastructure/Scripts/Libs/jasmine-2.2.0/boot.js"));

            bundles.Add(new StyleBundle("~/bundles/jasmine-style")
                .Include("~/Infrastructure/Scripts/Libs/jasmine-2.2.0/jasmine.css"));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include("~/Infrastructure/Scripts/Libs/jquery-2.1.4.js",
                "~/Infrastructure/Scripts/Libs/jquery.simulate.js"));

            bundles.Add(new ScriptBundle("~/bundles/testUtils").Include("~/Infrastructure/Scripts/TestUtils/*.js"));
        }
    }
}
