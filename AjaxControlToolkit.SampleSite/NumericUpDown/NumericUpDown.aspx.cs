using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class NumericUpDown_NumericUpDown : System.Web.UI.Page {

    protected void Page_Load(object sender, EventArgs e) {
    }

    protected void Button1_Click(object sender, EventArgs e) {
        Label1.Text =
            "Value: <b>" + TextBox1.Text + "</b><br>" +
            "Month: <b>" + TextBox2.Text + "</b><br>" +
            "Random Value: <b>" + TextBox3.Text + "</b><br>" +
            "Value: <b>" + TextBox4.Text + "</b>";
    }
}