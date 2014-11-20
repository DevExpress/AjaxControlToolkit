using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.BulletedList", Constants.HtmlEditorBulletedListButtonName)]
    public class BulletedList : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("EdListBullet");
            base.OnPreRender(e);
        }
    }

}
