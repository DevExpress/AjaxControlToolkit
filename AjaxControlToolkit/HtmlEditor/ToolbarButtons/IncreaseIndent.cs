using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ToolboxItem(false)]
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.IncreaseIndent", Constants.HtmlEditorIncreaseIndentButtonName)]
    public class IncreaseIndent : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("EdIndentMore");
            base.OnPreRender(e);
        }
    }

}
