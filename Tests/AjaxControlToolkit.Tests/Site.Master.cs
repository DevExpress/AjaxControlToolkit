using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text.RegularExpressions;

namespace AjaxControlToolkit.Tests {
    public partial class Site : System.Web.UI.MasterPage {



        public string GetTestFrameUrl() {
            return Regex.Replace(Request.Path, ".aspx", "_TestPage.aspx", RegexOptions.IgnoreCase);
        }

    
    }
}