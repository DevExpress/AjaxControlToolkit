using System;
using System.Reflection;
using System.Collections.Generic;

namespace System.Web.UI {
    public class AjaxScriptManager : ScriptManager {
        // redirects ajax scripts from System.Web.Extensions to System.Web.Ajax.
        private static Dictionary<String, bool> _scripts;

        static AjaxScriptManager() {
            _scripts = new Dictionary<string, bool>();
            _scripts.Add("MicrosoftAjax.js", true);
            _scripts.Add("MicrosoftAjaxWebForms.js", true);
            _scripts.Add("MicrosoftAjaxTimer.js", true);
            _scripts.Add("MicrosoftAjax.debug.js", true);
            _scripts.Add("MicrosoftAjaxWebForms.debug.js", true);
            _scripts.Add("MicrosoftAjaxTimer.debug.js", true);
        }

        private void ApplyAssembly(ScriptReference script, bool isComposite) {
            // if the script has a name and no path, and no assembly or the assembly is set to SWE,
            // set the path to the resource in System.Web.Ajax. We set the path instead of just changing the assembly
            // so that ScriptManager still considers the scripts Microsoft Ajax scripts, which allows it to emit
            // inline script.
            if (!String.IsNullOrEmpty(script.Name) && String.IsNullOrEmpty(script.Path) &&
                (String.IsNullOrEmpty(script.Assembly) || Assembly.Load(script.Assembly) == typeof(ScriptManager).Assembly)) {
                if (!isComposite && _scripts.ContainsKey(script.Name)) {
                    RedirectScriptReference sr = new RedirectScriptReference(script.Name);
                    script.Path = sr.GetBaseUrl(ScriptManager.GetCurrent(Page));
                    script.ScriptMode = ScriptMode.Release;
                }
                else {
                    script.Assembly = typeof(AjaxScriptManager).Assembly.FullName;
                }
            }
        }

        protected override void OnResolveCompositeScriptReference(CompositeScriptReferenceEventArgs e) {
            foreach (ScriptReference sr in e.CompositeScript.Scripts) {
                ApplyAssembly(sr, true);
            }
            base.OnResolveCompositeScriptReference(e);
        }

        protected override void OnResolveScriptReference(ScriptReferenceEventArgs args) {
            ApplyAssembly(args.Script, false);
            base.OnResolveScriptReference(args);
        }

        private class RedirectScriptReference : ScriptReference {
            public RedirectScriptReference(string name) {
                Name = name;
                Assembly = typeof(AjaxScriptManager).Assembly.FullName;
            }

            public string GetBaseUrl(ScriptManager sm) {
                return base.GetUrl(sm, true);
            }
        }
    }
}
