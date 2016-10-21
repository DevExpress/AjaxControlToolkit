using AjaxControlToolkit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class CascadingDropDown_CascadingDropDown : System.Web.UI.Page {

    protected void DropDownList3_SelectedIndexChanged(object sender, EventArgs e) {
        var make = DropDownList1.SelectedItem.Text;
        var model = DropDownList2.SelectedItem.Text;
        var color = DropDownList3.SelectedItem.Text;

        // Output result string based on which values are specified
        if(String.IsNullOrEmpty(make)) {
            Label1.Text = "Please select a make.";
        }
        else if(String.IsNullOrEmpty(model)) {
            Label1.Text = "Please select a model.";
        }
        else if(String.IsNullOrEmpty(color)) {
            Label1.Text = "Please select a color.";
        }
        else {
            Label1.Text = String.Format("You have chosen a {0} {1} {2}. Nice car!", color, make, model);
        }
    }

    [WebMethod]
    [ScriptMethod]
    public static CascadingDropDownNameValue[] GetDropDownContentsPageMethod(string knownCategoryValues, string category) {
        return new CarsService().GetDropDownContents(knownCategoryValues, category);
    }
}