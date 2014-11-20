using System;
using System.Web.UI;
using System.Web.UI.WebControls;
namespace AjaxControlToolkit.HtmlEditor {

    [RequiredScript(typeof(CommonToolkitScripts), 0)]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.HtmlEditor), 1)]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ExecCommandEmulation), 2)]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.DesignPanelEventHandler), 3)]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.DesignPanel", Constants.HtmlEditorDesignPanelName)]
    internal class DesignPanel : ModePanel {
        public DesignPanel()
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
