using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit;

public partial class AjaxFileUpload_AjaxFileUpload : System.Web.UI.Page 
{

    protected void Page_Load(object sender, EventArgs e) {

        // check if postback came through AjaxFileUpload control
        if (AjaxFileUpload1.IsInFileUploadPostBack)
        {
            // do for ajax file upload partial postback request
        }
        else
        { 
            // do for normal page request
        }

        if (Request.QueryString["preview"] == "1" && !string.IsNullOrEmpty(Request.QueryString["fileId"]))
        {
            var fileId = Request.QueryString["fileId"];
            var fileContents = (byte[])Session["fileContents_" + fileId];
            var fileContentType = (string)Session["fileContentType_" + fileId];

            if (fileContents != null)
            {
                Response.Clear();
                Response.ContentType = fileContentType;
                Response.BinaryWrite(fileContents);
                Response.End();
            }
        }
    }

    protected void AjaxFileUpload1_OnUploadComplete(object sender, AjaxFileUploadEventArgs file)
    {
        // User can save file to File System, database or in session state
        if (file.ContentType.Contains("jpg") || file.ContentType.Contains("gif")
            || file.ContentType.Contains("png") || file.ContentType.Contains("jpeg"))
        {
            Session["fileContentType_" + file.FileId] = file.ContentType;
            Session["fileContents_" + file.FileId] = file.GetContents();
        }

        // Set PostedUrl to preview the uploaded file.         
        file.PostedUrl = string.Format("?preview=1&fileId={0}", file.FileId);
    }
    
}


