using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;

public partial class DoubleUploadIssue : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!this.IsPostBack)
        {
            if (Session["Files"] == null)
            {
                InitializeFileTable();
            }
            GridView1.DataSource = (DataTable)Session["Files"];
            GridView1.DataBind();
        }


        if (Request.Params.Get("__EVENTTARGET") == "UploadPostback")
        {
            RefillConfDatatable();
            DataTable dtFiles = (DataTable)Session["Files"];
            GridView1.DataSource = dtFiles;
            GridView1.DataBind();
        }
    }

    /// <summary>
    /// Execute this the first time that the page posts back (check the "__EVENTTARGET" to determin this).
    /// This will save the file in the proper directory.
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void AsyncFileUpload1_UploadedComplete(object sender, AjaxControlToolkit.AsyncFileUploadEventArgs e)
    {
        if (Request.Params.Get("__EVENTTARGET") != "UploadPostback")
        {
            string filename = System.IO.Path.GetFileName(AsyncFileUpload1.FileName);

            AsyncFileUpload1.SaveAs(@"c:\\test\\" + filename);

            DataTable dtFiles = (DataTable)Session["Files"];
            DataRow drFile = dtFiles.NewRow();
            drFile["FileName"] = filename;
            drFile["IsConfidential"] = false;
            dtFiles.Rows.Add(drFile);
            Session["Files"] = dtFiles;
        }
    }

    /// <summary>
    /// Build an empty datatable and initialize the Session
    /// </summary>
    private void InitializeFileTable()
    {
        DataTable dtFiles = new DataTable("File");

        //File Name
        dtFiles.Columns.Add("FileName", typeof(string));

        //File Confidentiality
        dtFiles.Columns.Add("IsConfidential", typeof(bool));

        //Store the datatable in a Session variable
        Session["Files"] = dtFiles;
    }

    /// <summary>
    /// Use this to retain the value of the "Confidential" checkbox after postback.  
    /// This is called from the "Attach" button before adding a new file, and from the
    /// "Remove" button before removing a file
    /// </summary>
    private void RefillConfDatatable()
    {
        DataTable dtFiles = (DataTable)Session["Files"];

        int i = 0;
        foreach (GridViewRow row in GridView1.Rows)
        {
            dtFiles.Rows[i][1] = ((CheckBox)row.FindControl("chkConfidential")).Checked;
            i++;
        }

        Session["Files"] = dtFiles;
    }

    /// <summary>
    /// Event handler for the "Remove" button on each grid item
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void GridView1_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        RefillConfDatatable();

        e.Cancel = true;
        string fileName = ((Label)GridView1.Rows[e.RowIndex].FindControl("lblFileName")).Text;

        System.IO.File.Delete(@"c:\\test\\" + fileName);

        //Remove file from grid
        DataTable dtFiles = (DataTable)Session["Files"];
        dtFiles.Rows.RemoveAt(e.RowIndex);

        GridView1.DataSource = dtFiles;
        GridView1.DataBind();
    }
}