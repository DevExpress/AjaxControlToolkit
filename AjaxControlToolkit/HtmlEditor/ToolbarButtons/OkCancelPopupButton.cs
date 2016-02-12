#pragma warning disable 1591
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.OkCancelPopupButton", Constants.HtmlEditorOkCancelPopupButtonName)]
    public abstract class OkCancelPopupButton : DesignModePopupImageButton {
    }

}

#pragma warning restore 1591