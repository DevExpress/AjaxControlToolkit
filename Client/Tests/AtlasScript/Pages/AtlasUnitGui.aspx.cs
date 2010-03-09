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
using System.Xml;
using System.Text;
using System.Web.UI;

public partial class AtlasUnitGui : System.Web.UI.Page {
    protected void Page_LoadComplete(object sender, EventArgs e) {
        AtlasUnitUtil.AddScriptReference(Page, "AtlasUnitGui.js");
    }
}
