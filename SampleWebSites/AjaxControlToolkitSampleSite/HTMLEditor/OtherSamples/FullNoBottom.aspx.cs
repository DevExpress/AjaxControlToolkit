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
using AjaxControlToolkit.HTMLEditor;
using System.Collections;
using System.Collections.ObjectModel;

public partial class test : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if(!Page.IsPostBack) {
            editor.Content = "Some text Some text Some text Some text<br/>Some text Some text Some text Some text<br/>Some text Some text Some text Some text<br/>Some text Some text Some text Some text<br/>Some text Some text Some text Some text<br/>Some text Some text Some text Some text";
        }
    }
}