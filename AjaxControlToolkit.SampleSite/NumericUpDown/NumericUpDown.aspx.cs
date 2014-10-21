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
        Label1.Text = String.Format("Value: <b>{0}</b><br>Month: <b>{1}</b><br>Random Value: <b>{2}</b><br>Value: <b>{3}</b>", TextBox1.Text, TextBox2.Text, TextBox3.Text, TextBox4.Text);
    }
}