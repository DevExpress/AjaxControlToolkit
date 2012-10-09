using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;

namespace AjaxControlToolkit.Tests.Bugs.cascadingdropdown
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        //protected void DropDownList3_SelectedIndexChanged(object sender, EventArgs e)
        //{
        //    // Get selected values
        //    string make = DropDownList1.SelectedItem.Text;
        //    //string model = DropDownList2.SelectedItem.Text;
        //    string color = DropDownList3.SelectedItem.Text;
            
        //}

        [WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public static CascadingDropDownNameValue[] GetDropDownContentsPageMethod(string knownCategoryValues, string category)
        {
            return new CarsService().GetDropDownContents(knownCategoryValues, category);
        }
    }
}