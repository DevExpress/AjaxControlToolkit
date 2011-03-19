using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit;

namespace AjaxControlToolkit.Tests.Tests.RatingControl {
    public partial class RatingControl_TestPage : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {

        }


        protected void Rating1_Changed(object sender, RatingEventArgs e) {
            if (e != null)
                e.CallbackResult = ((Rating)sender).ID + ";" + e.Value + ";" + e.Tag;
        }
        protected void Rating3_Changed(object sender, RatingEventArgs e) {
            if (e != null)
                e.CallbackResult = ((Rating)sender).ID + ";" + e.Value + ";" + e.Tag;
        }
        protected void Rating2_Changed(object sender, RatingEventArgs e) {
            if (e != null)
                e.CallbackResult = ((Rating)sender).ID + ";" + e.Value + ";" + e.Tag;
        }
        protected void Rating4_Changed(object sender, RatingEventArgs e) {
            if (e != null)
                e.CallbackResult = ((Rating)sender).ID + ";" + e.Value + ";" + e.Tag;
        }

        protected void Rating5_Changed(object sender, RatingEventArgs e) {
            if (e != null) {
                if (e.Value == "2") {
                    Rating5.CurrentRating = 10;
                }
            }
        }
    
    }
}