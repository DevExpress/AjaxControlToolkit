using System;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ColorButton", Constants.HtmlEditorColorButtonName)]
    public abstract class ColorButton : DesignModePopupImageButton {
        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            RelatedPopup = new Popups.BaseColorsPopup();
        }
    }

}
