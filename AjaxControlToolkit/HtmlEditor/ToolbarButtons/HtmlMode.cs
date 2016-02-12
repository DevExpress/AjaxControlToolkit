#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.HtmlMode", Constants.HtmlEditorHtmlModeButtonName)]
    public class HtmlMode : ModeButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-Html");
            ActiveMode = ActiveModeType.Html;
            base.OnPreRender(e);
        }
    }

}

#pragma warning restore 1591