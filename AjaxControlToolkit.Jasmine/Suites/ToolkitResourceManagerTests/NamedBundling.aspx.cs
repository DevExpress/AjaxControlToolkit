using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManagerTests {

    public partial class NamedBundling : System.Web.UI.Page {

        protected void Page_PreInit(object sender, EventArgs e) {
            AjaxControlToolkit.ToolkitResourceManager.RegisterScriptMappings();
        }

        protected void Page_Init(object sender, EventArgs e) {
            var scriptManager = ScriptManager.GetCurrent(Page);
            ScriptManager.ScriptResourceMapping.AddDefinition("MicrosoftAjaxWebForms.js", new ScriptResourceDefinition {
                Path = "~/Scripts/MicrosoftAjaxWebForms.js"
            });
            ScriptManager.ScriptResourceMapping.AddDefinition("MicrosoftAjax.js", new ScriptResourceDefinition {
                Path = "~/Scripts/MicrosoftAjax.js"
            });

            scriptManager.Scripts.Add(new ScriptReference("~/Scripts/AjaxControlToolkit/TestExtenderBundle"));
        }

        protected void Page_PreRender(object sender, EventArgs e) {
            ScriptManager.GetCurrent(Page).ScriptMode = ScriptMode.Debug;
            ScriptManager.GetCurrent(Page).EnableCdn = false;
        }

        protected void Page_Unload(object sender, EventArgs e) {
            AjaxControlToolkit.ToolkitResourceManager.RemoveScriptMappingsRegistration();
        }
    }

}