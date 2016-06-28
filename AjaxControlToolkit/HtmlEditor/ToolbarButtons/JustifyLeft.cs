using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyLeft", Constants.HtmlEditorJustifyLeftButtonName)]
    public class JustifyLeft : EditorToggleButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-AlignLeft");
            base.OnPreRender(e);
        }
    }

}

