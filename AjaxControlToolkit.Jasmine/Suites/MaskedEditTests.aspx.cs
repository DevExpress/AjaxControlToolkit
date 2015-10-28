using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Jasmine.Suites {
    public partial class MaskedEditTests : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {

            PhoneNumberTarget.Text = "1234567890";
            RightToLeftNumberTarget.Text = "123456789";
            RightToLeftNumberClearMaskTarget.Text = "123456789";
        }
    }
}