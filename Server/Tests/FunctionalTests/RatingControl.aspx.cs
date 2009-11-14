

using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.Services;
using AjaxControlToolkit;

public partial class Automated_RatingControl : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void Rating1_Changed(object sender, RatingEventArgs e)
    {
        e.CallbackResult = ((Rating)sender).ID + ";" + e.Value + ";" + e.Tag;
    }
    protected void Rating3_Changed(object sender, RatingEventArgs e)
    {
        e.CallbackResult = ((Rating)sender).ID + ";" + e.Value + ";" + e.Tag;
    }
    protected void Rating2_Changed(object sender, RatingEventArgs e)
    {
        e.CallbackResult = ((Rating)sender).ID + ";" + e.Value + ";" + e.Tag;
    }
    protected void Rating4_Changed(object sender, RatingEventArgs e)
    {
        e.CallbackResult = ((Rating)sender).ID + ";" + e.Value + ";" + e.Tag;
    }

    protected void Rating5_Changed(object sender, RatingEventArgs e)
    {
        if (e.Value == "2")
        {
            Rating5.CurrentRating = 10;
        }
    }
}