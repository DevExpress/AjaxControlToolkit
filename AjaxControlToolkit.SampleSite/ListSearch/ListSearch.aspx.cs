using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ListSearch_ListSearch : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        ListBox1.DataSource = DemoData.ContentFillerWords;
        ListBox1.DataBind();
        DropDownList1.DataSource = DemoData.ContentFillerWords;
        DropDownList1.DataBind();
    }
}