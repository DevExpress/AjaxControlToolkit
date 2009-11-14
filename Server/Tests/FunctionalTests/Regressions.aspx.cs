


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

public partial class Regressions : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // The following sequence of adding controls in the "wrong" order causes
        // an exception when used with the previous databinding implementation
        TextBox tb = new TextBox();
        tb.ID = "tbID";
        Page.Form.Controls.Add(tb);
        TextBoxWatermarkExtender tbwe = new TextBoxWatermarkExtender();
        tbwe.ID = "tbweID";
        tbwe.TargetControlID = tb.ID;
        tbwe.WatermarkText = "WatermarkText";
        Page.Form.Controls.Add(tbwe);
    }
}
