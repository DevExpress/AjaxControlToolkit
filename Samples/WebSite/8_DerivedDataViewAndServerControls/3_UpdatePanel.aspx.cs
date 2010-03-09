using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _1_Basic_DataView_8_UpdatePanel : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        theTime.Text = DateTime.Now.ToLongTimeString();
    }
}
