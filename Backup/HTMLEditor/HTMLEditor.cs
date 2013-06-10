using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;

#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("HTMLEditor.HTMLEditor.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.HTMLEditor.debug.js", "text/javascript")]
#endregion

namespace AjaxControlToolkit.HTMLEditor
{
    [ClientScriptResource(null, "HTMLEditor.HTMLEditor.js")]
    internal static class HTMLEditor
    {
    }
}
