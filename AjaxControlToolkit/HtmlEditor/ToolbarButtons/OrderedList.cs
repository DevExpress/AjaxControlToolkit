#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.OrderedList", Constants.HtmlEditorOrderedListButtonName)]
    public class OrderedList : MethodButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-ListNum");
            base.OnPreRender(e);
        }
    }

}

#pragma warning restore 1591