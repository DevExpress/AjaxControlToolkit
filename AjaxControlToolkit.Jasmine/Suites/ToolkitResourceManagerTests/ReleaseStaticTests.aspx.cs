using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManagerTests {

    public partial class ReleaseStatic : System.Web.UI.Page {

        protected void Page_PreInit(object sender, EventArgs e) {
            AjaxControlToolkit.ToolkitResourceManager.RegisterScriptMappings();
        }

        protected void Page_PreRender(object sender, EventArgs e) {
            ScriptManager.GetCurrent(Page).ScriptMode = ScriptMode.Release;
            ScriptManager.GetCurrent(Page).EnableCdn = false;
        }

        protected void Page_Unload(object sender, EventArgs e) {
            AjaxControlToolkit.ToolkitResourceManager.RemoveScriptMappingsRegistration();
        }
    }

}