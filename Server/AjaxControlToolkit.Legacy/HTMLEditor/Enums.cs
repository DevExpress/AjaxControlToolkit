using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;

#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("HTMLEditor.Enums.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Enums.debug.js", "text/javascript")]
#endregion

namespace AjaxControlToolkit.HTMLEditor
{
    public enum ActiveModeType { Design, Html, Preview };

    [ClientScriptResource(null, "HTMLEditor.Enums.js")]
    internal static class Enums
    {
    }
}
