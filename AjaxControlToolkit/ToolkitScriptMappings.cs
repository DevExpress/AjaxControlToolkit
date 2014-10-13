using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;

namespace AjaxControlToolkit {

    // Usage:
    //
    // Application_Start:
    // ToolkitScriptMappings.Register();
    // BundleTable.Bundles.Add(new ScriptBundle("~/bundles/AjaxControlToolki").Include(ToolkitScriptMappings.GetScriptPaths()));
    // 
    // ScriptManager:
    // <asp:ScriptReference Path="~/bundles/AjaxControlToolkit" />

    public static class ToolkitScriptMappings {

        public static string[] GetScriptPaths(params string[] toolkitBundles) {
            return GetScriptNames(toolkitBundles).Select(n => FormatScriptPath(n, false)).ToArray();
        }

        public static void Register() {
            foreach(var name in GetScriptNames(null))
                AddDefinition(name);
        }

        static IEnumerable<string> GetScriptNames(string[] toolkitBundles) { 
            return new Bundling.BundleResolver(new Bundling.DefaultCache()).GetScriptNames(new HttpContextWrapper(HttpContext.Current), toolkitBundles);
        }

        static void AddDefinition(string name) {
            ScriptManager.ScriptResourceMapping.AddDefinition(
                name + Constants.JsPostfix,
                typeof(ToolkitScriptMappings).Assembly,
                new ScriptResourceDefinition() {
                    Path = FormatScriptPath(name, false),
                    DebugPath = FormatScriptPath(name, true)
                }
            );
        }

        static string FormatScriptPath(string script, bool isDebug) {
            return "~/Scripts/AjaxControlToolkit/" 
                + (isDebug ? "Debug" : "Release") + "/" 
                + script 
                + (isDebug ? Constants.DebugJsPostfix : Constants.JsPostfix);
        }
    }

}