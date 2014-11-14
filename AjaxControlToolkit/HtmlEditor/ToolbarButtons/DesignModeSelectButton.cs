using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeSelectButton", Constants.HtmlEditorDesignModeSelectButtonName)]
    public abstract class DesignModeSelectButton : SelectButton {
        protected DesignModeSelectButton()
            : base() {
            ActiveModes.Add(ActiveModeType.Design);
        }
    }

}
