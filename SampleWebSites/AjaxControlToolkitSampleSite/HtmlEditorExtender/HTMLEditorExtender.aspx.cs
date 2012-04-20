// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Permissive License.
// See http://www.microsoft.com/resources/sharedsource/licensingbasics/sharedsourcelicenses.mspx.
// All other rights reserved.

using System;
using AjaxControlToolkit;

public partial class HTMLEditorExtender : CommonPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //AjaxFileUpload ajaxFileUpload = htmlEditorExtender2.AjaxFileUpload;
        //if (ajaxFileUpload != null)
        //{
        //    ajaxFileUpload.UploadComplete += new EventHandler<AjaxControlToolkit.AjaxFileUploadEventArgs>(ajaxFileUpload_OnUploadComplete);
        //}

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

    protected void ajaxFileUpload_OnUploadComplete(object sender, AjaxControlToolkit.AjaxFileUploadEventArgs e)
    {        
        if (e.ContentType.Contains("jpg") || e.ContentType.Contains("gif")
            || e.ContentType.Contains("png") || e.ContentType.Contains("jpeg"))
        {
            Session["fileContentType_" + e.FileId] = e.ContentType;
            Session["fileContents_" + e.FileId] = e.GetContents();
        }

        // Set PostedUrl to preview the uploaded file.         
        e.PostedUrl = string.Format("?preview=1&fileId={0}", e.FileId);
    }    
}