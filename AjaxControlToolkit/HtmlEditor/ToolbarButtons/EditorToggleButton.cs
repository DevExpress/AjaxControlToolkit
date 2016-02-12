#pragma warning disable 1591
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton", Constants.HtmlEditorToggleButtonName)]
    public abstract class EditorToggleButton : DesignModeImageButton {
    }

}

#pragma warning restore 1591