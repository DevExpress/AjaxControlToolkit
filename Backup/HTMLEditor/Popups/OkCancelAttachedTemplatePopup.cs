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

[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.OkCancelAttachedTemplatePopup.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.OkCancelAttachedTemplatePopup.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.Popups
{
    [ToolboxItem(false)]
    [ParseChildren(true)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.Popups.OkCancelAttachedTemplatePopup", "HTMLEditor.Popups.OkCancelAttachedTemplatePopup.js")]
    public class OkCancelAttachedTemplatePopup : AttachedTemplatePopup
    {
        #region [ Fields ]


        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new OkCancelAttachedTemplatePopup
        /// </summary>
        public OkCancelAttachedTemplatePopup()
            : base()
        {
        }

        #endregion

        #region [ Properties ]


        #endregion

        #region [ Methods ]

        protected override void CreateChildControls()
        {
            PopupBGIButton ok = new PopupBGIButton();
            ok.Text = GetButton("OK");
            ok.Name = "OK";
            ok.CssClass += " " + "ajax__htmleditor_popup_confirmbutton ";

            PopupBGIButton cancel = new PopupBGIButton();
            cancel.Text = GetButton("Cancel");
            cancel.Name = "Cancel";
            cancel.CssClass += " " + "ajax__htmleditor_popup_confirmbutton";

            Table table = new Table();
            table.Attributes.Add("border", "0");
            table.Attributes.Add("cellspacing", "0");
            table.Attributes.Add("cellpadding", "0");
            table.Style["width"] = "100%";

            TableRow row = new TableRow();
            table.Rows.Add(row);
            TableCell cell = new TableCell();
            row.Cells.Add(cell);
            cell.HorizontalAlign = HorizontalAlign.Right;
            cell.Controls.Add(ok);
            cell.Controls.Add(cancel);
            Content.Add(table);

            RegisteredHandlers.Add(new RegisteredField("OK", ok));
            RegisteredHandlers.Add(new RegisteredField("Cancel", cancel));
            base.CreateChildControls();
        }

        #endregion
    }
}
