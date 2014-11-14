using System;
using System.ComponentModel;
using System.Web.UI;
using System.Drawing.Design;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ToolboxItem(false)]
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Cut", Constants.HtmlEditorCutButtonName)]
    public class Cut : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("EdCut");
            base.OnPreRender(e);
        }
    }

}
