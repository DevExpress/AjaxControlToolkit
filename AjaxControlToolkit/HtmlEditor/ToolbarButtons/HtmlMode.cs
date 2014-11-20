using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ParseChildren(true)]
    [PersistChildren(false)]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.HtmlMode", Constants.HtmlEditorHtmlModeButtonName)]
    public class HtmlMode : ModeButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("EdHtml");
            ActiveMode = ActiveModeType.Html;
            base.OnPreRender(e);
        }
    }

}
