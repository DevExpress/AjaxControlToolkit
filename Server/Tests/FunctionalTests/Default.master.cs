

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

public partial class Master_Default : System.Web.UI.MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // Use/don't use the CombineScriptsHandlerUrl feature of ToolkitScriptManager with 50% probability
        if (0 == (new Random()).Next(2))
        {
            ScriptManager1.CombineScriptsHandlerUrl = null;
        }
    }
}
