using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Underline", Constants.HtmlEditorUnderlineButtonName)]
    public class Underline : EditorToggleButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("EdFormatUnderline");
            base.OnPreRender(e);
        }
    }

}
