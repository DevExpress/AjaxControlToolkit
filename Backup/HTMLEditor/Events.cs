using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;

#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("HTMLEditor.Events.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Events.debug.js", "text/javascript")]
#endregion

namespace AjaxControlToolkit.HTMLEditor
{
    [ClientScriptResource(null, "HTMLEditor.Events.js")]
    internal static class Events
    {
    }
}
