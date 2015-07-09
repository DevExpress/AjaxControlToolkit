using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Jasmine.Suites {
    public partial class ComboBoxTests : System.Web.UI.Page {

        protected void Page_Load(object sender, EventArgs e) {
        }

        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);

            if(IsPostBack) return;

            TargetExtender.DataSource = new string[] {
                "Alfa",
                "Alpha",
                "Bravo",
                "Charlie",
                "Delta",
                "Echo"
            };
            TargetExtender.DataBind();
        }
    }
}