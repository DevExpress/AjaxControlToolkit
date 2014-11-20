using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor {

    [ClientCssResource(Constants.HtmlEditorHtmlPanelName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.HtmlPanel", Constants.HtmlEditorHtmlPanelName)]
    internal class HtmlPanel : ModePanel {
        public HtmlPanel()
            : base(HtmlTextWriterTag.Textarea) {
        }
    }

}
