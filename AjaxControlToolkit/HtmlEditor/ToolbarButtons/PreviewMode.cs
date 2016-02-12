#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.PreviewMode", Constants.HtmlEditorPreviewModeButtonName)]
    public class PreviewMode : ModeButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-Preview");
            ActiveMode = ActiveModeType.Preview;
            base.OnPreRender(e);
        }
    }

}

#pragma warning restore 1591