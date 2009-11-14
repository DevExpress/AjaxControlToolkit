

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

public partial class Automated_ModalPopup : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void Button4_Click(object sender, EventArgs e)
    {
        Label1.Text = "Button4";
    }
    protected void ShowViaServer_Click(object sender, EventArgs e)
    {
        ModalPopupExtender1.Show();
    }
    protected void HideViaServer_Click(object sender, EventArgs e)
    {
        ModalPopupExtender1.Hide();
    }

    protected void MultipleShowsViaServer_Click(object sender, EventArgs e)
    {
        // Multiple calls to "Show()" or "hide()" should work
        ModalPopupExtender1.Show();
        ModalPopupExtender1.Show();
        ModalPopupExtender1.Show();
    }
}
