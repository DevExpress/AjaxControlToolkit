using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Tests.Bugs.ModalPopup._26909
{
    public partial class Page : System.Web.UI.Page
    {
        protected override void OnLoadComplete(EventArgs e)
        {
            if (IsPostBack & LandingUserControl1.HoldVisible)
                LandingModalPopupExtender.Show();

            base.OnLoadComplete(e);
        }

        protected void btnClosePopup_Click(object sender, EventArgs e)
        {
            LandingUserControl1.HoldVisible = false;
            LandingModalPopupExtender.Hide();            
        }
    }
}