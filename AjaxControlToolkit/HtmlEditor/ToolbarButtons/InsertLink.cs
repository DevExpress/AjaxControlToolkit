#pragma warning disable 1591
using AjaxControlToolkit.HtmlEditor.Popups;
using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.InsertLink", Constants.HtmlEditorInsertLinkButtonName)]
    public class InsertLink : OkCancelPopupButton {
        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            RelatedPopup = new LinkProperties();
            AutoClose = false;
        }

        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-Link");
            base.OnPreRender(e);
        }
    }

}

#pragma warning restore 1591