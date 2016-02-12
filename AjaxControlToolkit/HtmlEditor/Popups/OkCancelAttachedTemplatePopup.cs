#pragma warning disable 1591
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor.Popups {

    [ToolboxItem(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.Popups.OkCancelAttachedTemplatePopup", Constants.HtmlEditorOkCancelAttachedTemplatePopupName)]
    public class OkCancelAttachedTemplatePopup : AttachedTemplatePopup {
        public OkCancelAttachedTemplatePopup()
            : base() {
        }

        protected override void CreateChildControls() {
            var ok = new PopupBGIButton();
            ok.Text = GetButton("OK");
            ok.Name = "OK";
            ok.CssClass += " " + "ajax__htmleditor_popup_confirmbutton ";

            var cancel = new PopupBGIButton();
            cancel.Text = GetButton("Cancel");
            cancel.Name = "Cancel";
            cancel.CssClass += " " + "ajax__htmleditor_popup_confirmbutton";

            var table = new Table();
            table.Attributes.Add("border", "0");
            table.Attributes.Add("cellspacing", "0");
            table.Attributes.Add("cellpadding", "0");
            table.Style["width"] = "100%";

            var row = new TableRow();
            table.Rows.Add(row);

            var cell = new TableCell();
            row.Cells.Add(cell);
            cell.HorizontalAlign = HorizontalAlign.Right;
            cell.Controls.Add(ok);
            cell.Controls.Add(cancel);
            Content.Add(table);

            RegisteredHandlers.Add(new RegisteredField("OK", ok));
            RegisteredHandlers.Add(new RegisteredField("Cancel", cancel));
            base.CreateChildControls();
        }
    }

}

#pragma warning restore 1591