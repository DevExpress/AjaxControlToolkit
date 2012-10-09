using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Tests.Bugs.Tabs.pullrequestFixes
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void tc_ActiveTabChanged(object sender, EventArgs e)
        {
            // <- Set a breakpoint on this statement
        }
    }
}