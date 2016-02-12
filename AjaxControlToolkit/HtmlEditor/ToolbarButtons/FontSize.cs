#pragma warning disable 1591
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.FontSize", Constants.HtmlEditorFontSizeButtonName)]
    public class FontSize : DesignModeSelectButton {
        [DefaultValue("70px")]
        [Category("Appearance")]
        public override string SelectWidth {
            get { return "70px"; }
        }
    }

}

#pragma warning restore 1591