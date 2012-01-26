using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Tests.Bugs.Tabs._23295
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void TabContainer1_ActiveTabChanged(object sender, EventArgs e)
        {            
            var tab = (sender as TabContainer);
            var panel = (Panel)tab.ActiveTab.FindControl(tab.ActiveTab.ID + "Panel");
            if(panel != null)
            {
                panel.Controls.Clear();
                var label = new Label();
                label.Text = string.Format("Changed in Panel {0} at {1}", panel.ID,  DateTime.Now.ToLongTimeString());
                panel.Controls.Add(label);
            }
            //.ActiveTab.HeaderText = 
            //Do some processing herer.
        }
    }
}