using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Diagnostics;

namespace AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26737
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        private void WriteKeys() {
            Debug.WriteLine("pageKey=" + ViewState["pageKey"]);
            Debug.WriteLine("uploadKey=" + ViewState["uploadKey"]); 
        }


        protected void Button1_Click(object sender, EventArgs e)
        {
            ViewState.Add("pageKey", "Testing");
            Debug.WriteLine("Added pageKey to ViewState");
        }

        protected void Button2_Click(object sender, EventArgs e)
        {
            WriteKeys();
        }

        protected void AsyncFileUpload1_UploadedComplete(object sender, AsyncFileUploadEventArgs e)
        {
            ViewState.Add("uploadKey", "Testing");
            WriteKeys();
        }

        protected void AsyncFileUpload1_UploadedFileError(object sender, AsyncFileUploadEventArgs e)
        {

        }
    }
}