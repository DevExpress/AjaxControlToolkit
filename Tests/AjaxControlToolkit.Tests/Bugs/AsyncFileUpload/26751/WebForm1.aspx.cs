using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26751
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            async1.UploadedComplete += new EventHandler<AsyncFileUploadEventArgs>(async1_UploadedComplete);
        }

        void async1_UploadedComplete(object sender, AsyncFileUploadEventArgs e)
        {
            async1.SaveAs(MapPath("~/Bugs/AsyncFileUpload/Somefile.txt"));
        }
    }
}