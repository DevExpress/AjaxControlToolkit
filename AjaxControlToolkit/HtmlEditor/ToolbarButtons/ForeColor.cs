using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColor", Constants.HtmlEditorForeColorButtonName)]
    public class ForeColor : ColorButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-ColorFg");
            base.OnPreRender(e);
        }
    }

}
