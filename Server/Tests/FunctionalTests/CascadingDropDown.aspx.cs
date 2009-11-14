

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
using System.Collections.Specialized;

public partial class Automated_CascadingDropDown : System.Web.UI.Page
{
    protected void Button1_Click(object sender, EventArgs e)
    {
        Label3.Text = string.Format("{0}:{1}:{2}", DropDownList8.SelectedValue, DropDownList8.SelectedItem.Value, DropDownList8.SelectedItem.Text);
    }
    protected void DropDownList1_SelectedIndexChanged(object sender, EventArgs e)
    {
        Label1.Text = "SelectedIndexChanged";
    }
    protected void DropDownList7_SelectedIndexChanged(object sender, EventArgs e)
    {
        Label2.Text = "SelectedIndexChanged";
    }
    protected void Button2_Click(object sender, EventArgs e)
    {
        if(!String.IsNullOrEmpty(DropDownList9.SelectedValue))
            Label7.Text = DropDownList9.SelectedValue;
        else
            Label7.Text = "ERROR";
    }
    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);
        Label4.Text = string.Join(",", new string[] { DropDownList1.SelectedItem.Text, DropDownList2.SelectedItem.Text, DropDownList3.SelectedItem.Text, DropDownList3b.SelectedItem.Text });
        Label5.Text = DropDownListI.SelectedItem.Text;
        Label6.Text = string.Join(",", new string[] { cascadingDefaultMakeDropDown.SelectedItem.Text, cascadingDefaultModelDropDown.SelectedItem.Text, cascadingDefaultColorDropDown.SelectedItem.Text });

        CascadingDropDown13.SelectedValue = "Incomplete Make";
        CascadingDropDown14.SelectedValue = "Incomplete Model";
    }
}
