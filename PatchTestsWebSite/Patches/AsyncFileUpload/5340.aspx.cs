using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit;
using System.IO;


public partial class Patch5340 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        AsyncFileUpload3.ClearAllFilesFromSession();
        //        AsyncFileUpload2.ClearFileFromSession();
        //AsyncFileUpload1.UploaderStyle = AjaxControlToolkit.AsyncFileUpload.UploaderStyleEnum.Modern;
        AsyncFileUpload1.UploadedComplete += new EventHandler<AsyncFileUploadEventArgs>(AsyncFileUpload_UploadedComplete);
        AsyncFileUpload2.UploadedComplete += new EventHandler<AsyncFileUploadEventArgs>(AsyncFileUpload_UploadedComplete);
        AsyncFileUpload3.UploadedComplete += new EventHandler<AsyncFileUploadEventArgs>(AsyncFileUpload_UploadedComplete);
        AsyncFileUpload1.UploadedFileError += new EventHandler<AsyncFileUploadEventArgs>(AsyncFileUpload_UploadedFileError);
        AsyncFileUpload2.UploadedFileError += new EventHandler<AsyncFileUploadEventArgs>(AsyncFileUpload_UploadedFileError);
        AsyncFileUpload3.UploadedFileError += new EventHandler<AsyncFileUploadEventArgs>(AsyncFileUpload_UploadedFileError);
    }

    void AsyncFileUpload_UploadedComplete(object sender, AsyncFileUploadEventArgs e)
    {
        // Uncomment to save to AsyncFileUpload\Uploads folder.
        // ASP.NET must have the necessary permissions to write to the file system.
        AsyncFileUpload asyncFileUpload = (AsyncFileUpload) sender;
        string savePath = MapPath("~/Patches/AsyncFileUpload/Uploads/" + Path.GetFileName(e.filename));
        asyncFileUpload.SaveAs(savePath);
        AsyncFileUpload3.ClearFileFromSession();
    }

    void AsyncFileUpload_UploadedFileError(object sender, AsyncFileUploadEventArgs e) {
    }
}
