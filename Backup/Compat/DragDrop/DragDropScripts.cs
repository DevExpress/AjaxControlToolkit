


using System;

[assembly: System.Web.UI.WebResource("Compat.DragDrop.DragDropScripts.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Compat.DragDrop.DragDropScripts.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    [RequiredScript(typeof(TimerScript))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource(null, "Compat.DragDrop.DragDropScripts.js")]
    public static class DragDropScripts
    {
    }
}