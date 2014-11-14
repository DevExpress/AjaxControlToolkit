using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class HtmlEditorExtender_HtmlEditorExtender : System.Web.UI.Page {

    protected void Page_Load(object sender, EventArgs e) {
        if(Request.QueryString["preview"] == "1" && !string.IsNullOrEmpty(Request.QueryString["fileId"])) {
            var fileId = Request.QueryString["fileId"];
            var fileContents = (byte[])Session["fileContents_" + fileId];
            var fileContentType = (string)Session["fileContentType_" + fileId];

            if(fileContents != null) {
                Response.Clear();
                Response.ContentType = fileContentType;
                Response.BinaryWrite(fileContents);
                Response.End();
            }
        }
    }

    protected void ajaxFileUpload_OnUploadComplete(object sender, AjaxControlToolkit.AjaxFileUploadEventArgs e) {
        if(e.ContentType.Contains("jpg") || e.ContentType.Contains("gif")
            || e.ContentType.Contains("png") || e.ContentType.Contains("jpeg")) {
            Session["fileContentType_" + e.FileId] = e.ContentType;
            Session["fileContents_" + e.FileId] = e.GetContents();
        }

        // Set PostedUrl to preview the uploaded file.         
        e.PostedUrl = string.Format("?preview=1&fileId={0}", e.FileId);
    }

    protected void btnsubmit_click(object sender, EventArgs e) {
        // Retrieve the html contents from htmleditor extender
        var htmlContents = System.Web.HttpUtility.HtmlDecode(txtBox1.Text);
    }
}