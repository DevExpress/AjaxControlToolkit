

using System;
using System.Data;
using System.Configuration;

using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

public partial class Accordion : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            //Test for work item 5796
            //If you called this.DataBind() in the page load
            //the non-bound accordion controls were empty.
            this.DataBind();

            Dictionary<string, string> values = new Dictionary<string,string>();
            values["A"] = "This is the value for A";
            values["B"] = "This is the value for B";
            values["C"] = "This is the value for C";
            values["D"] = "This is the value for D";
            dictionaryBound.DataSource = values;
            dictionaryBound.DataBind();
        }
    }

    protected void Button1_Click(object sender, EventArgs e)
    {
    }

    protected void Button2_Click(object sender, EventArgs e)
    {
        Label1.Text = "button onclick";
    }

    protected void MyAccordion_ItemCreated(object sender, AjaxControlToolkit.AccordionItemEventArgs e)
    {
    }

    protected void MyAccordion_ItemCommand(object sender, CommandEventArgs e)
    {
        if (!string.IsNullOrEmpty(e.CommandName))
        {
            Label1.Text = "ItemCommand handled with name " + e.CommandName + " and argument " + e.CommandArgument;
        }
    }
}