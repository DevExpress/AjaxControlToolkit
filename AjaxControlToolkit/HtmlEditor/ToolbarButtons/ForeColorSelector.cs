using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorSelector", Constants.HtmlEditorForeColorSelectorButtonName)]
    public class ForeColorSelector : ColorSelector {
    }

}

