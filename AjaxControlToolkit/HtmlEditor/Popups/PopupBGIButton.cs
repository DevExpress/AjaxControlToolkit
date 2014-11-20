using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor.Popups {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.Popups.PopupBGIButton", Constants.HtmlEditorPopupBGIButtonName)]
    internal class PopupBGIButton : PopupBoxButton {
        string _text = String.Empty;

        public PopupBGIButton()
            : base(HtmlTextWriterTag.Div) {
        }

        public PopupBGIButton(HtmlTextWriterTag tag)
            : base(tag) {
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public string Text {
            get { return _text; }
            set { _text = value; }
        }

        protected override void CreateChildControls() {
            var span = new HtmlGenericControl("span");
            var table = new Table();
            table.Attributes.Add("border", "0");
            table.Attributes.Add("cellspacing", "0");
            table.Attributes.Add("cellpadding", "0");

            var row = new TableRow();
            table.Rows.Add(row);

            var cell = new TableCell();
            row.Cells.Add(cell);
            cell.VerticalAlign = VerticalAlign.Middle;
            cell.HorizontalAlign = HorizontalAlign.Center;
            cell.CssClass = "ajax__htmleditor_popup_bgibutton";

            var literal = new LiteralControl(Text);
            span.Controls.Add(literal);
            cell.Controls.Add(span);
            Content.Add(table);

            base.CreateChildControls();
        }
    }

}
