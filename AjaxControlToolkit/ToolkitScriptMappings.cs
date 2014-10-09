using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI;

namespace AjaxControlToolkit {

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
                    Path = FormatScriptPath(script, false)
                    // DebugPath = FormatScriptPath(script, true) - bundling does not work with debug scripts
                }
            );
        }

        static string FormatScriptPath(string script, bool isDebug) {
            return "~/Scripts/AjaxControlToolkit/" + script + (isDebug ? Constants.DebugJsPostfix : Constants.JsPostfix);
        }
    }

}