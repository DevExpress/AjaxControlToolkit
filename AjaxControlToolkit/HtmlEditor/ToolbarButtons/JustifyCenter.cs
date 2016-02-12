#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyCenter", Constants.HtmlEditorJustifyCenterButtonName)]
    public class JustifyCenter : EditorToggleButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-AlignCenter");
            base.OnPreRender(e);
        }
    }

}

#pragma warning restore 1591