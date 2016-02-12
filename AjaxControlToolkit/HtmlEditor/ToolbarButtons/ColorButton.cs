#pragma warning disable 1591
using System;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ColorButton", Constants.HtmlEditorColorButtonName)]
    public abstract class ColorButton : DesignModePopupImageButton {
        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            RelatedPopup = new Popups.BaseColorsPopup();
        }
    }

}

#pragma warning restore 1591