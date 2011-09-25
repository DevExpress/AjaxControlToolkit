using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Tests.Bugs.Tabs._25686
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void tabControl_ActiveTabChanged(object sender, EventArgs e)
        {
            
            if (tabControl.ActiveTabIndex.Equals(0))
            {
                lblActiveIndex.Text = "0";
            }
            else if (tabControl.ActiveTabIndex.Equals(1))
            {
                lblActiveIndex.Text = "1";
            }
            else if (tabControl.ActiveTabIndex.Equals(2))
            {
                lblActiveIndex.Text = "2";
            }
            else if (tabControl.ActiveTabIndex.Equals(3))
            {
                lblActiveIndex.Text = "3";
            }
        }
    }
}