using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Jasmine.Suites {
    public partial class Suite : System.Web.UI.MasterPage {
        protected void Page_Load(object sender, EventArgs e) {
            Page.Header.DataBind();    
        }

        protected string GetCurrentPage() {
            return Request.Url.AbsoluteUri;
        }
    }
}