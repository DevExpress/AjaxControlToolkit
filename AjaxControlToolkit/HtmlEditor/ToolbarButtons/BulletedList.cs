#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.BulletedList", Constants.HtmlEditorBulletedListButtonName)]
    public class BulletedList : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-ListBullet");
            base.OnPreRender(e);
        }
    }

}

#pragma warning restore 1591