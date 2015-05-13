using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager {

    public partial class Release_Static : System.Web.UI.Page {

        protected override void OnPreInit(EventArgs e) {
            base.OnPreInit(e);

            AjaxControlToolkit.ToolkitResourceManager.RegisterScriptMappings();
        }

        protected override void OnUnload(EventArgs e) {
            base.OnUnload(e);

            AjaxControlToolkit.ToolkitResourceManager.RemoveScriptMappingsRegistration();
        }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);

            AjaxControlToolkit.ToolkitResourceManager.RenderStyleLinks = false;
        }

        protected void Page_Load(object sender, EventArgs e) {
        }
    }

}