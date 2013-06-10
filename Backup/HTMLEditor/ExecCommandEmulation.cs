using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;

#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("HTMLEditor.ExecCommandEmulation.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.ExecCommandEmulation.debug.js", "text/javascript")]
#endregion

namespace AjaxControlToolkit.HTMLEditor
{
    [ClientScriptResource(null, "HTMLEditor.ExecCommandEmulation.js")]
    internal static class ExecCommandEmulation
    {
    }
}