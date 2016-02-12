#pragma warning disable 1591
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeImageButton", Constants.HtmlEditorDesignModeImageButtonName)]
    public abstract class DesignModeImageButton : ImageButton {
        protected DesignModeImageButton()
            : base() {
            ActiveModes.Add(ActiveModeType.Design);
        }
    }

}

#pragma warning restore 1591