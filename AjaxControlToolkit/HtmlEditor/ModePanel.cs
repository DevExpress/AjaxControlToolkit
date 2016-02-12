#pragma warning disable 1591
using System;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor {

    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.Editor", Constants.HtmlEditorModePanelName)]
    public abstract class ModePanel : ScriptControlBase {
        protected ModePanel(HtmlTextWriterTag tag)
            : base(false, tag) {
        }

        EditPanel _editPanel;

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);

            Style.Add(HtmlTextWriterStyle.Height, Unit.Percentage(100).ToString());
            Style.Add(HtmlTextWriterStyle.Width, Unit.Percentage(100).ToString());
            Style.Add(HtmlTextWriterStyle.Display, "none");
        }

        internal void setEditPanel(EditPanel editPanel) {
            _editPanel = editPanel;
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            if(_editPanel != null)
                descriptor.AddComponentProperty("editPanel", _editPanel.ClientID);
        }
    }

}

#pragma warning restore 1591