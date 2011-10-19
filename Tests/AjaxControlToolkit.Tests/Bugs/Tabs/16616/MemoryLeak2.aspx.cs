using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

namespace AjaxControlToolkit.Tests.Bugs.Tabs._16616
{
    public partial class MemoryLeak2 : System.Web.UI.Page
    {
        protected void btn_Click(object sender, EventArgs e)
        {
            this.tbp0.Visible = !this.tbp0.Visible;
            this.tbp1.Visible = !this.tbp1.Visible;
            this.tbp2.Visible = !this.tbp2.Visible;
            this.tbp3.Visible = !this.tbp3.Visible;
        }

        protected void btnNavigate_Click(object sender, EventArgs e)
        {
            Response.Redirect("MemoryLeak1.aspx");
        }

        protected void Timer_Tick(object sender, EventArgs e)
        {
            this.tbp0.Visible = !this.tbp0.Visible;
            this.tbp1.Visible = !this.tbp1.Visible;
            this.tbp2.Visible = !this.tbp2.Visible;
            this.tbp3.Visible = !this.tbp3.Visible;
        }
    }
}
