using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ToolboxItem(false)]
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteText", Constants.HtmlEditorPasteTextButtonName)]
    public class PasteText : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("EdPasteText");
            base.OnPreRender(e);
        }
    }

}
