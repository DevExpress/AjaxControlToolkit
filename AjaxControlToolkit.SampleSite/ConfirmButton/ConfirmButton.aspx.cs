using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ConfirmButton_ConfirmButton : System.Web.UI.Page {
    protected void Button_Click(object sender, EventArgs e) {
        Label1.Text = "You clicked the " + ((Control)sender).ID + " at " + DateTime.Now.ToLongTimeString() + ".";
    }
}