using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxTestWebSite
{
    public partial class LandingUserControl : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void btnRegistNext_Click(object sender, EventArgs e)
        {
            labelInUserControl.Text = "Postback in user control";
        }


        #region Property

        public bool HoldVisible
        {
            get {
                return Session["holdVisible"] != null ? Convert.ToBoolean(Session["holdVisible"].ToString()) : false;
            }
            set {
                Session["holdVisible"] = value;
            }
        }

        #endregion
    }
}