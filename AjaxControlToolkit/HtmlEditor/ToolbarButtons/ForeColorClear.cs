#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorClear", Constants.HtmlEditorForeColorClearButtonName)]
    public class ForeColorClear : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-ColorFgClear");
            base.OnPreRender(e);
        }
    }

}

#pragma warning restore 1591