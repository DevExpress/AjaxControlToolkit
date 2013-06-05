using System;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.ComponentModel.Design.Serialization;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Drawing.Design;
using System.Security.Permissions;
using System.Collections;
using System.Collections.ObjectModel;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Schema;
using System.Globalization;
using System.CodeDom;
using System.Drawing;
using System.IO;
using AjaxControlToolkit;

#region [ Resources ]

[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.LinkProperties.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.LinkProperties.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.Popups
{
    [ParseChildren(true)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.Popups.LinkProperties", "HTMLEditor.Popups.LinkProperties.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1501:AvoidExcessiveInheritance")]
    internal class LinkProperties : OkCancelAttachedTemplatePopup
    {
        #region [ Fields ]

        private string _defaultTarget = "_self";
        private TextBox _url = new TextBox();
        private HtmlSelect _target = new HtmlSelect();

        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new LinkProperties
        /// </summary>
        public LinkProperties()
            : base()
        {
        }

        #endregion

        #region [ Properties ]

        [DefaultValue("_self")]
        [Category("Behavior")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        public string DefaultTarget
        {
            get { return _defaultTarget; }
            set { _defaultTarget = value; }
        }

        #endregion

        #region [ Methods ]

        protected override void CreateChildControls()
        {
            HtmlGenericControl _urlTextHolder = new HtmlGenericControl("span");
            HtmlGenericControl _targetTextHolder = new HtmlGenericControl("span");
            Table table = new Table();
            table.Attributes.Add("border", "0");
            table.Attributes.Add("cellspacing", "0");
            table.Attributes.Add("cellpadding", "2");

            TableRow row = new TableRow();
            table.Rows.Add(row);

            TableCell cell = new TableCell();
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
            _target.Items.Add(new ListItem(GetField("Target","New"), "_blank"));
            _target.Items.Add(new ListItem(GetField("Target","Current"), "_self"));
            _target.Items.Add(new ListItem(GetField("Target","Parent"), "_parent"));
            _target.Items.Add(new ListItem(GetField("Target","Top"), "_top"));
            cell.Controls.Add(_target);

            Content.Add(table);

            RegisteredFields.Add(new RegisteredField("url", _url));
            RegisteredFields.Add(new RegisteredField("target", _target));
            base.CreateChildControls();
        }

        protected override void OnPreRender(EventArgs e)
        {
            _url.Attributes.Add("id", _url.ClientID);
            _target.Attributes.Add("id", _target.ClientID);
            base.OnPreRender(e);
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            descriptor.AddProperty("defaultTarget", DefaultTarget);
        }

        #endregion
    }
}
