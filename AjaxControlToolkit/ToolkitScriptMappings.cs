using System;
using System.Collections.Generic;
using System.Linq;
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

        static readonly string[] _scripts = new[] {
            Constants.BaseScriptName,
            Constants.CommonScriptName,
            Constants.TextBoxWatermarkScriptName
        };

        public static string[] GetScriptPaths() {
            return _scripts.Select(name => FormatScriptPath(name, false)).ToArray();
        }

        public static void Register() {
            foreach(var script in _scripts) {
                AddDefinition(script);
            }
        }

        static void AddDefinition(string script) {
            ScriptManager.ScriptResourceMapping.AddDefinition(
                script + Constants.JsPostfix,
                typeof(ToolkitScriptMappings).Assembly,
                new ScriptResourceDefinition() {
                    Path = FormatScriptPath(script, false),
                    DebugPath = FormatScriptPath(script, true)
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