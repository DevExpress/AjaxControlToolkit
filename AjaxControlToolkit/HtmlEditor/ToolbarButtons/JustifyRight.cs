using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyRight", Constants.HtmlEditorJustifyRightButtonName)]
    public class JustifyRight : EditorToggleButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-AlignRight");
            base.OnPreRender(e);
        }
    }

}
