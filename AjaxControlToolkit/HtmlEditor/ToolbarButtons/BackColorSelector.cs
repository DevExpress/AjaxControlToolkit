#pragma warning disable 1591
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorSelector", Constants.HtmlEditorBackColorSelectorButtonName)]
    public class BackColorSelector : ColorSelector {
    }

}

#pragma warning restore 1591