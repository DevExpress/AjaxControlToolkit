using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton", Constants.HtmlEditorToggleButtonName)]
    public abstract class EditorToggleButton : DesignModeImageButton {
    }

}
