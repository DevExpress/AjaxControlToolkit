using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteWord", Constants.HtmlEditorPasteWordButtonName)]
    public class PasteWord : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-PasteWord");
            base.OnPreRender(e);
        }
    }

}

