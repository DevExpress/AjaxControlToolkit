#pragma warning disable 1591
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeSelectButton", Constants.HtmlEditorDesignModeSelectButtonName)]
    public abstract class DesignModeSelectButton : SelectButton {
        protected DesignModeSelectButton()
            : base() {
            ActiveModes.Add(ActiveModeType.Design);
        }
    }

}

#pragma warning restore 1591