using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Copy", Constants.HtmlEditorCopyButtonName)]
    public class Copy : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("EdCopy");
            base.OnPreRender(e);
        }
    }

}
