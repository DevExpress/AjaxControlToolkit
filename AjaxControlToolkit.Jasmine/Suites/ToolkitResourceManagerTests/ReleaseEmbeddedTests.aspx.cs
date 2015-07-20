using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager {

    public partial class ToolkitResourceManager_ReleaseEmbedded : System.Web.UI.Page {

        protected void Page_PreRender(object sender, EventArgs e) {
            ScriptManager.GetCurrent(Page).ScriptMode = ScriptMode.Release;
            ScriptManager.GetCurrent(Page).EnableCdn = false;
        }
    }

}