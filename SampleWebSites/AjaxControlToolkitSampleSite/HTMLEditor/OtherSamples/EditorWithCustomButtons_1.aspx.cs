using System;
using System.Web.UI;

public partial class test : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if(!Page.IsPostBack) {
            editor.Content = "Some text Some text Some text Some text<br/>Some text Some text Some text Some text<br/>Some text Some text Some text Some text<br/>Some text Some text Some text Some text<br/>Some text Some text Some text Some text<br/>Some text Some text Some text Some text";
        }
    }
}