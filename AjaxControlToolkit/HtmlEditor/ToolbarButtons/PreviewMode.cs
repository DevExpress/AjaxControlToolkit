using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ParseChildren(true)]
    [PersistChildren(false)]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.PreviewMode", Constants.HtmlEditorPreviewModeButtonName)]
    public class PreviewMode : ModeButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("EdPreview");
            ActiveMode = ActiveModeType.Preview;
            base.OnPreRender(e);
        }
    }

}
