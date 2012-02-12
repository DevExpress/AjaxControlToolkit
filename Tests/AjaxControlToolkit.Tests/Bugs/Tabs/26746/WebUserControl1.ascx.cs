using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Tests.Bugs.Tabs._26746
{
    public partial class WebUserControl1 : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void Tabs_ActiveTabChanged(object sender, EventArgs e)
        {
            tab1.Text += "triggered ";

        }
        protected void Button_Click(object sender, EventArgs e)
        {
            txt1.Text = "Clicked";
        }
    }
}