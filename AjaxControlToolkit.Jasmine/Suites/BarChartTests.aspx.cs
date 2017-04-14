using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Jasmine.Suites {
    public partial class BarChartTests : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            TargetControlWithAutoID.ClientIDMode = ClientIDMode.AutoID;
            TargetControlWithPredictableID.ClientIDMode = ClientIDMode.Predictable;
        }
    }
}