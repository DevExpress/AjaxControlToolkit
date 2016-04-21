using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Jasmine.Suites {
    public partial class ValidatorCalloutUpdatePanelUnobtrusiveTests : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            ScriptManager.ScriptResourceMapping.AddDefinition("jquery",
              new ScriptResourceDefinition {
                  Path = "~/Infrastructure/scripts/libs/jquery-2.1.4.js"
              });
            this.UnobtrusiveValidationMode = UnobtrusiveValidationMode.WebForms;
        }

        protected void btnPostback_Click(object sender, EventArgs e) {
            TestUpdatePanel.Update();
        }

    }
}