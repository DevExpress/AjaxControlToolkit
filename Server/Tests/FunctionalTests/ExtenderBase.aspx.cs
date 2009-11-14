

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

public partial class Automated_ExtenderBase : System.Web.UI.Page
{
    private Label label
    {
        get
        {
            return (Label)LoginView1.FindControl("LoginViewLabel");
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        label.Text = "";
    }

    private void AddMessage(string method, string controlID)
    {
        label.Text += string.Format("<br />{0} ({1})", method, controlID);
    }

    protected void cbe_ResolveTargetControlID(object sender, AjaxControlToolkit.ResolveControlEventArgs e)
    {
        if (e.ControlID == "LoginViewButton")
        {
            e.Control = LoginView1.FindControl(e.ControlID);
            AddMessage("cbe_ResolveTargetControlID", e.ControlID);
        }
    }

    protected void cbe_ResolveControlID(object sender, AjaxControlToolkit.ResolveControlEventArgs e)
    {
        if (e.ControlID == "LoginViewButton")
        {
            e.Control = LoginView1.FindControl(e.ControlID);
            AddMessage("cbe_ResolveControlID", e.ControlID);
        }
    }

    protected void cpe_ResolveControlID(object sender, AjaxControlToolkit.ResolveControlEventArgs e)
    {
        e.Control = LoginView1.FindControl(e.ControlID);
        AddMessage("cpe_ResolveControlID", e.ControlID);
    }
}
