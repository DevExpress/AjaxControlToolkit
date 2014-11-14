using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ToolboxItem(false)]
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeBoxButton", Constants.HtmlEditorDesignModeBoxButtonName)]
    public class DesignModeBoxButton : BoxButton {
        public DesignModeBoxButton()
            : base() {
            ActiveModes.Add(ActiveModeType.Design);
        }
    }

}
