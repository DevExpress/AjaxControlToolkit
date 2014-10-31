using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ToggleButton_ToggleButton : System.Web.UI.Page {
    protected void Button1_Click(object sender, EventArgs e) {
        Label1.Text = String.Format("You indicated that you <b>{0}</b> like ASP.NET and you <b>{1}</b> like ASP.NET AJAX",
            (CheckBox1.Checked ? "do" : "do not"), (CheckBox2.Checked ? "do" : "do not"));
    }
}