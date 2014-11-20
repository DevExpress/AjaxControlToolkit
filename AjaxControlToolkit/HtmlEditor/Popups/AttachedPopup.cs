using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.Popups {

    [ToolboxItem(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.Popups.AttachedPopup", Constants.HtmlEditorAttachedPopupName)]
    public class AttachedPopup : Popup {
    }

}
