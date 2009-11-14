


using System;
using System.Data;
using System.Drawing;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using AjaxControlToolkit;

public partial class ResizableControl : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    protected void Button1_Click(object sender, EventArgs e)
    {
        Size s = ResizableControlExtender1.Size;
        Label1.Text = s.Width + "x" + s.Height;
        s.Width += 10;
        s.Height += 15;
        ResizableControlExtender1.Size = s;
    }
}
