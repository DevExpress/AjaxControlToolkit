using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor.Popups {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.Popups.LinkProperties", Constants.HtmlEditorLinkPropertiesName)]
    internal class LinkProperties : OkCancelAttachedTemplatePopup {
        TextBox _url = new TextBox();
        HtmlSelect _target = new HtmlSelect();
        string _defaultTarget = "_self";

        public LinkProperties()
            : base() {
        }

        [DefaultValue("_self")]
        [Category("Behavior")]
        public string DefaultTarget {
            get { return _defaultTarget; }
            set { _defaultTarget = value; }
        }

        protected override void CreateChildControls() {
            var _urlTextHolder = new HtmlGenericControl("span");
            var _targetTextHolder = new HtmlGenericControl("span");

            var table = new Table();
            table.Attributes.Add("border", "0");
            table.Attributes.Add("cellspacing", "0");
            table.Attributes.Add("cellpadding", "2");

            var row = new TableRow();
            table.Rows.Add(row);

            var cell = new TableCell();
            row.Cells.Add(cell);
            cell.HorizontalAlign = HorizontalAlign.Left;
            cell.Controls.Add(_urlTextHolder);
            _urlTextHolder.Controls.Add(new LiteralControl(GetField("URL")));
            cell.Controls.Add(new LiteralControl(":"));

            cell = new TableCell();
            row.Cells.Add(cell);
            cell.HorizontalAlign = HorizontalAlign.Left;
            _url.Style["width"] = "200px";
            _url.MaxLength = 255;
            cell.Controls.Add(_url);

            row = new TableRow();
            table.Rows.Add(row);

            cell = new TableCell();
            row.Cells.Add(cell);
            cell.HorizontalAlign = HorizontalAlign.Left;
            cell.Controls.Add(_targetTextHolder);
            _targetTextHolder.Controls.Add(new LiteralControl(GetField("Target")));
            cell.Controls.Add(new LiteralControl(":"));

            cell = new TableCell();
            row.Cells.Add(cell);
            cell.HorizontalAlign = HorizontalAlign.Left;
            _target.Style["width"] = "105px";
            _target.Items.Add(new ListItem(GetField("Target", "New"), "_blank"));
            _target.Items.Add(new ListItem(GetField("Target", "Current"), "_self"));
            _target.Items.Add(new ListItem(GetField("Target", "Parent"), "_parent"));
            _target.Items.Add(new ListItem(GetField("Target", "Top"), "_top"));
            cell.Controls.Add(_target);

            Content.Add(table);

            RegisteredFields.Add(new RegisteredField("url", _url));
            RegisteredFields.Add(new RegisteredField("target", _target));
            base.CreateChildControls();
        }

        protected override void OnPreRender(EventArgs e) {
            _url.Attributes.Add("id", _url.ClientID);
            _target.Attributes.Add("id", _target.ClientID);
            base.OnPreRender(e);
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            descriptor.AddProperty("defaultTarget", DefaultTarget);
        }
    }

}
