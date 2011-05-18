using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit;

public partial class MultipleAsyncFileUpload : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //AsyncFileUpload1.UploaderStyle = AjaxControlToolkit.AsyncFileUpload.UploaderStyleEnum.Modern;        
        AsyncFileUpload1.UploadedComplete += new EventHandler<AsyncFileUploadEventArgs>(AsyncFileUpload1_UploadedComplete);
        AsyncFileUpload1.UploadedFileError += new EventHandler<AsyncFileUploadEventArgs>(AsyncFileUpload1_UploadedFileError);
        AsyncFileUpload2.UploadedComplete += new EventHandler<AsyncFileUploadEventArgs>(AsyncFileUpload2_UploadedComplete);
        AsyncFileUpload2.UploadedFileError += new EventHandler<AsyncFileUploadEventArgs>(AsyncFileUpload2_UploadedFileError);

    }

    void AsyncFileUpload1_UploadedComplete(object sender, AsyncFileUploadEventArgs e)
    {
        ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "size", "top.$get(\""+uploadResult.ClientID+"\").innerHTML = 'Uploaded size: " + AsyncFileUpload1.FileBytes.Length.ToString() + "';", true);

        // Uncomment to save to AsyncFileUpload\Uploads folder.
        // ASP.NET must have the necessary permissions to write to the file system.

        // string savePath = MapPath("~/AsyncFileUpload/Uploads/" + Path.GetFileName(e.filename));
        // AsyncFileUpload1.SaveAs(savePath);
    }

    void AsyncFileUpload1_UploadedFileError(object sender, AsyncFileUploadEventArgs e)
    {
        ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "error", "top.$get(\"" + uploadResult.ClientID + "\").innerHTML = 'Error: " + e.StatusMessage + "';", true);
    }

    void AsyncFileUpload2_UploadedComplete(object sender, AsyncFileUploadEventArgs e)
    {
        ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "size", "top.$get(\"" + uploadResult2.ClientID + "\").innerHTML = 'Uploaded size: " + AsyncFileUpload2.FileBytes.Length.ToString() + "';", true);

        // Uncomment to save to AsyncFileUpload\Uploads folder.
        // ASP.NET must have the necessary permissions to write to the file system.

        // string savePath = MapPath("~/AsyncFileUpload/Uploads/" + Path.GetFileName(e.filename));
        // AsyncFileUpload1.SaveAs(savePath);
    }

    void AsyncFileUpload2_UploadedFileError(object sender, AsyncFileUploadEventArgs e)
    {
        ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "error", "top.$get(\"" + uploadResult2.ClientID + "\").innerHTML = 'Error: " + e.StatusMessage + "';", true);
    }
}
