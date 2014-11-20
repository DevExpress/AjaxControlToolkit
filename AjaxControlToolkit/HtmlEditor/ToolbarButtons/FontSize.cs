using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ParseChildren(true)]
    [PersistChildren(false)]
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
