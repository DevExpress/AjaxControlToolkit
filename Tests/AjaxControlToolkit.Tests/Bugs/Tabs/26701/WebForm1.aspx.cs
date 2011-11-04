using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Tests.Bugs.Tabs._26701
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                DynamicContainer.DataSource = new string[] { "dummyItem" };
                this.DataBind();
            }
        }

        protected void ProcessActiveTabChanged(object sender, EventArgs e)
        {
            TabContainer senderAsContainer = sender as TabContainer;
            StatusTab.Text = String.Format("Tab {0} activated at {1}",
                senderAsContainer.ActiveTab.ClientID,
                DateTime.Now);
        }

        protected void ProcessButtonCommand(object sender, EventArgs e)
        {
            StatusButton.Text = String.Format("Button pressed at {0}", DateTime.Now);
        }
    }
}