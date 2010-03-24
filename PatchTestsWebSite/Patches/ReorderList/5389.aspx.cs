using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit;
using System.IO;


public partial class Patch5389 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        ReorderList1.ItemReorder += new EventHandler<ReorderListItemReorderEventArgs>(ReorderList1_ItemReorder);    
    }

    void ReorderList1_ItemReorder(object sender, ReorderListItemReorderEventArgs e) {
        
    }
}
