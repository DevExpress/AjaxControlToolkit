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

[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.PopupBGIButton.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.PopupBGIButton.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.Popups
{
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.Popups.PopupBGIButton", "HTMLEditor.Popups.PopupBGIButton.js")]
    internal class PopupBGIButton : PopupBoxButton
    {
        #region [ Fields ]

        private string _text = "";

        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new PopupBGIButton
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        public PopupBGIButton()
            : base(HtmlTextWriterTag.Div)
        {
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        public PopupBGIButton(HtmlTextWriterTag tag)
            : base(tag)
        {
        }

        #endregion

        #region [ Properties ]

        [DefaultValue("")]
        [Category("Appearance")]
        public string Text
        {
            get { return _text; }
            set { _text = value; }
        }

        #endregion

        #region [ Methods ]

        protected override void CreateChildControls()
        {
            HtmlGenericControl span = new HtmlGenericControl("span");
            Table table = new Table();
            table.Attributes.Add("border", "0");
            table.Attributes.Add("cellspacing", "0");
            table.Attributes.Add("cellpadding", "0");

            TableRow row = new TableRow();
            table.Rows.Add(row);
            TableCell cell = new TableCell();
            row.Cells.Add(cell);
            cell.VerticalAlign = VerticalAlign.Middle;
            cell.HorizontalAlign = HorizontalAlign.Center;
            cell.CssClass = "ajax__htmleditor_popup_bgibutton";

            LiteralControl literal = new LiteralControl(Text);
            span.Controls.Add(literal);
            cell.Controls.Add(span);
            Content.Add(table);

            base.CreateChildControls();
        }

        #endregion
    }
}
