using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;

#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("HTMLEditor.DesignPanelEventHandler.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.DesignPanelEventHandler.debug.js", "text/javascript")]
#endregion

namespace AjaxControlToolkit.HTMLEditor
{
    [ClientScriptResource(null, "HTMLEditor.DesignPanelEventHandler.js")]
    internal static class DesignPanelEventHandler
    {
    }
}
