using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paste", Constants.HtmlEditorPasteButtonName)]
    public class Paste : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-Paste");
            base.OnPreRender(e);
        }
    }

}

