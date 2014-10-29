using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ValidatorCallout_ValidatorCallout : System.Web.UI.Page {
    protected void Button1_OnClick(object sender, EventArgs e) {
        lblMessage.Text = string.Format("Thanks {0}, we'll give you a call at {1}.", NameTextBox.Text, PhoneNumberTextBox.Text);
    }
}