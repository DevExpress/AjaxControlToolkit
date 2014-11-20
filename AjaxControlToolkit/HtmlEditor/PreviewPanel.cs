using System;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.HtmlEditor))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.PreviewPanel", Constants.HtmlEditorPreviewPanelName)]
    internal class PreviewPanel : ModePanel {
        public PreviewPanel()
            : base(HtmlTextWriterTag.Iframe) {
        }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);

            Attributes.Add("name", ClientID);
            Attributes.Add("marginheight", "0");
            Attributes.Add("marginwidth", "0");
            Attributes.Add("frameborder", "0");
            if(EditPanel.IE(Page))
                Attributes.Add("src", "javascript:false;");
            Style.Add(HtmlTextWriterStyle.BorderWidth, Unit.Pixel(0).ToString());
        }
    }

}
