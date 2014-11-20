using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorClear", Constants.HtmlEditorForeColorClearButtonName)]
    public class ForeColorClear : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("EdColorFgClear");
            base.OnPreRender(e);
        }
    }

}
