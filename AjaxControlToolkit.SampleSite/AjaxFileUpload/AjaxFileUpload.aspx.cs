using AjaxControlToolkit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class AjaxFileUpload_AjaxFileUpload : System.Web.UI.Page {

    protected void Page_Load(object sender, EventArgs e) {

        if(AjaxFileUpload1.IsInFileUploadPostBack) {
            // something for ajax file upload partial postback request
        } else {
            if(Request.QueryString["preview"] != "1" || string.IsNullOrEmpty(Request.QueryString["fileId"]))
                return;

            var fileId = Request.QueryString["fileId"];
            string fileContentType = null;
            byte[] fileContents = null;

            fileContents = (byte[])Session["fileContents_" + fileId];
            fileContentType = (string)Session["fileContentType_" + fileId];

            if(fileContents == null)
                return;

            Response.Clear();
            Response.ContentType = fileContentType;
            Response.BinaryWrite(fileContents);
            Response.End();
        }
    }

    protected void AjaxFileUpload1_OnUploadComplete(object sender, AjaxFileUploadEventArgs file) {
        // User can save file to File System, database or in session state
        if(file.ContentType.Contains("jpg") || file.ContentType.Contains("gif")
            || file.ContentType.Contains("png") || file.ContentType.Contains("jpeg")) {

            // Limit preview file for file equal or under 4MB only, otherwise when GetContents invoked
            // System.OutOfMemoryException will thrown if file is too big to be read.
            if(file.FileSize <= 1024 * 1024 * 4) {
                Session["fileContentType_" + file.FileId] = file.ContentType;
                Session["fileContents_" + file.FileId] = file.GetContents();

                // Set PostedUrl to preview the uploaded file.
                file.PostedUrl = string.Format("?preview=1&fileId={0}", file.FileId);
            } else {
                file.PostedUrl = "fileTooBig.gif";
            }

            // Since we never call the SaveAs method(), we need to delete the temporary fileß
            file.DeleteTemporaryData();
        }

        // In a real app, you would call SaveAs() to save the uploaded file somewhere
        // AjaxFileUpload1.SaveAs(MapPath("~/App_Data/" + file.FileName), true);

    }

    protected void AjaxFileUpload1_UploadCompleteAll(object sender, AjaxFileUploadCompleteAllEventArgs e) {
        var startedAt = (DateTime)Session["uploadTime"];
        var now = DateTime.Now;
        e.ServerArguments = new JavaScriptSerializer()
            .Serialize(new {
                duration = (now - startedAt).Seconds,
                time = DateTime.Now.ToShortTimeString()
            });
    }

    protected void AjaxFileUpload1_UploadStart(object sender, AjaxFileUploadStartEventArgs e) {
        var now = DateTime.Now;
        e.ServerArguments = now.ToShortTimeString();
        Session["uploadTime"] = now;
    }
}