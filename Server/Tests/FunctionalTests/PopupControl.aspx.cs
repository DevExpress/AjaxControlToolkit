

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
using AjaxControlToolkit;


public partial class Automated_PopupControl : System.Web.UI.Page
{
    protected void Button1_Click(object sender, EventArgs e)
    {
        PopupControlExtender1.Commit("Commit");
    }
    protected void Button2_Click(object sender, EventArgs e)
    {
        PopupControlExtender1.Commit("");
    }
    protected void Button3_Click(object sender, EventArgs e)
    {
        PopupControlExtender1.Cancel();
    }

    protected void Button7_Click(object sender, EventArgs e)
    {
        PopupControlExtender1.Cancel();
        PopupControlExtender1.Cancel();
        PopupControlExtender1.Cancel();
    }

    protected void Button4_Click(object sender, EventArgs e)
    {
        PopupControlExtender.GetProxyForCurrentPopup(Page).Commit("Commit");
    }
    protected void Button5_Click(object sender, EventArgs e)
    {
        PopupControlExtender.GetProxyForCurrentPopup(Page).Commit("");
    }
    protected void Button6_Click(object sender, EventArgs e)
    {
        PopupControlExtender.GetProxyForCurrentPopup(Page).Cancel();
    }

    protected void Button8_Click(object sender, EventArgs e)
    {
        PopupControlExtender1.Commit("foo");
        PopupControlExtender1.Commit("bar");
    }

    protected void Button9_Click(object sender, EventArgs e)
    {
        PopupControlExtender1.Cancel();
        PopupControlExtender1.Commit("bar2");
    }

    protected void Button10_Click(object sender, EventArgs e)
    {
        PopupControlExtender1.Commit("bar3");
        PopupControlExtender1.Cancel();
    }
}