using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ToolboxItem(false)]
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveLink", Constants.HtmlEditorRemoveLinkButtonName)]
    public class RemoveLink : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("EdUnlink");
            base.OnPreRender(e);
        }
    }

}
