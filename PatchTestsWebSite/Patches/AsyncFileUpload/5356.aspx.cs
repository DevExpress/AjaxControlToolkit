using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit;
using System.IO;


public partial class Patch5356 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        AsyncFileUpload1.ClearAllFilesFromSession();
        AsyncFileUpload1.UploadedComplete += new EventHandler<AsyncFileUploadEventArgs>(AsyncFileUpload_UploadedComplete);
        AsyncFileUpload1.UploadedFileError += new EventHandler<AsyncFileUploadEventArgs>(AsyncFileUpload_UploadedFileError);
    }

    void AsyncFileUpload_UploadedComplete(object sender, AsyncFileUploadEventArgs e)
    {
        // Uncomment to save to AsyncFileUpload\Uploads folder.
        // ASP.NET must have the necessary permissions to write to the file system.
        AsyncFileUpload asyncFileUpload = (AsyncFileUpload) sender;
        string savePath = MapPath("~/Patches/AsyncFileUpload/Uploads/" + Path.GetFileName(e.filename));
        asyncFileUpload.SaveAs(savePath);
    }

    void AsyncFileUpload_UploadedFileError(object sender, AsyncFileUploadEventArgs e) {
    }
}
