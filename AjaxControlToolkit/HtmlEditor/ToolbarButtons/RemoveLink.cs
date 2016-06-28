using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveLink", Constants.HtmlEditorRemoveLinkButtonName)]
    public class RemoveLink : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-Unlink");
            base.OnPreRender(e);
        }
    }

}

