#pragma warning disable 1591
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeBoxButton", Constants.HtmlEditorDesignModeBoxButtonName)]
    public class DesignModeBoxButton : BoxButton {
        public DesignModeBoxButton()
            : base() {
            ActiveModes.Add(ActiveModeType.Design);
        }
    }

}

#pragma warning restore 1591