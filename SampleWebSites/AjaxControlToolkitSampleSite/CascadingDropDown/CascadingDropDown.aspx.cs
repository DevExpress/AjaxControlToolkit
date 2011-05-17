// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;
using System.Web.Services;
using AjaxControlToolkit;

public partial class CascadingDropDown_CascadingDropDown : CommonPage
{
    protected void DropDownList3_SelectedIndexChanged(object sender, EventArgs e)
    {
        // Get selected values
        string make = DropDownList1.SelectedItem.Text;
        string model = DropDownList2.SelectedItem.Text;
        string color = DropDownList3.SelectedItem.Text;

        // Output result string based on which values are specified
        if (string.IsNullOrEmpty(make))
        {
            Label1.Text = "Please select a make.";
        }
        else if (string.IsNullOrEmpty(model))
        {
            Label1.Text = "Please select a model.";
        }
        else if (string.IsNullOrEmpty(color))
        {
            Label1.Text = "Please select a color.";
        }
        else
        {
            Label1.Text = string.Format("You have chosen a {0} {1} {2}. Nice car!", color, make, model);
        }
    }

    [WebMethod]
    [System.Web.Script.Services.ScriptMethod]
    public static CascadingDropDownNameValue[] GetDropDownContentsPageMethod(string knownCategoryValues, string category)
    {
        return new CarsService().GetDropDownContents(knownCategoryValues, category);
    }
}