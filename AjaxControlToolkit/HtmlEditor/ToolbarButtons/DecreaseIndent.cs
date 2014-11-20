using System;
using System.ComponentModel;
using System.Web.UI;
using System.Drawing.Design;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.DecreaseIndent", Constants.HtmlEditorDecreaseIndentButtonName)]
    public class DecreaseIndent : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("EdIndentLess");
            base.OnPreRender(e);
        }
    }

}
