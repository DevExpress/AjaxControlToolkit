#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Web.UI;
using System.Drawing.Design;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedForeColor", Constants.HtmlEditorFixedForeColorButtonName)]
    public class FixedForeColor : FixedColorButton {
        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            MethodButton = new MethodButton();
            MethodButton.CssClass = String.Empty;
            DefaultColor = "#FF0000";
        }

        protected override void OnPreRender(EventArgs e) {
            MethodButton.InternalRegisterButtonImages("Ed-ForeColor");
            base.OnPreRender(e);
        }
    }

}

#pragma warning restore 1591