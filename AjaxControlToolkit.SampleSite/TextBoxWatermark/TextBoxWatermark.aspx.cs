using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class TextBoxWatermark_TextBoxWatermark : System.Web.UI.Page {

    protected void Page_Load(object sender, EventArgs e) {
        SetLabelText();
    }

    protected void Button1_Click(object sender, EventArgs e) {
        SetLabelText();
    }

    void SetLabelText() {
        Label1.Text = HttpUtility.HtmlEncode(string.Format("Hello {0} {1}!", FirstName, LastName));
    }

    string LastName {
        get { return String.IsNullOrEmpty(TextBox2.Text) ? "[blank]" : TextBox2.Text; }
    }

    string FirstName {
        get { return String.IsNullOrEmpty(TextBox1.Text) ? "[blank]" : TextBox1.Text; }
    }
}