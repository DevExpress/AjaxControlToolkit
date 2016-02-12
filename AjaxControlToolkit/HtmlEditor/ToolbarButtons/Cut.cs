#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Web.UI;
using System.Drawing.Design;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Cut", Constants.HtmlEditorCutButtonName)]
    public class Cut : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-Cut");
            base.OnPreRender(e);
        }
    }

}

#pragma warning restore 1591