


using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

public partial class Automated_ConfirmButton : System.Web.UI.Page
{
    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);
        Label1.Text = "";
    }

    protected void Link_Click(object sender, EventArgs e)
    {
        Label1.Text = "I have been clicked!";
    }
}
