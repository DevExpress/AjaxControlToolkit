using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Bold", Constants.HtmlEditorBoldButtonName)]
    public class Bold : EditorToggleButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("EdFormatBold");
            base.OnPreRender(e);
        }
    }

}
