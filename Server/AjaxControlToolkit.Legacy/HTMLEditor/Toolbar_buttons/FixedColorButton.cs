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

[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.FixedColorButton.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.FixedColorButton.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.ToolbarButton
{
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton", "HTMLEditor.Toolbar_buttons.FixedColorButton.js")]
    public abstract class FixedColorButton : DesignModeBoxButton
    {
        #region [ Fields ]

        private MethodButton _methodButton ;
        private DesignModeBoxButton _colorDiv ;
        private string _defaultColor = "#000000";

        #endregion

        #region [ Properties ]

        protected MethodButton MethodButton
        {
            get { return _methodButton; }
            set { _methodButton = value; }
        }

        protected DesignModeBoxButton ColorDiv
        {
            get { return _colorDiv; }
            set { _colorDiv = value; }
        }

        [DefaultValue("#000000")]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("defaultColor")]
        public string DefaultColor
        {
            get { return _defaultColor; }
            set { _defaultColor = value; }
        }

        #endregion

        #region [ Methods ]

        protected override void CreateChildControls()
        {
            Table table = new Table();
            table.Attributes.Add("border", "0");
            table.Attributes.Add("cellspacing", "0");
            table.Attributes.Add("cellpadding", "0");
            table.Style[HtmlTextWriterStyle.Margin] = "1px";
            table.Style[HtmlTextWriterStyle.Padding] = "0px";
            TableRow row = new TableRow();
            TableCell cell = new TableCell();
            table.Rows.Add(row);
            row.Cells.Add(cell);
            if (this.MethodButton != null)
            {
                cell.Controls.Add(this.MethodButton);
            }
            row = new TableRow();
            cell = new TableCell();
            table.Rows.Add(row);
            row.Cells.Add(cell);
            ColorDiv = new DesignModeBoxButton();
            ColorDiv.CssClass = "";
            ColorDiv.Style[HtmlTextWriterStyle.Margin] = "0px";
            ColorDiv.Style[HtmlTextWriterStyle.Padding] = "0px";
            ColorDiv.Width = new Unit(21, UnitType.Pixel);
            ColorDiv.Height = new Unit(5, UnitType.Pixel);
            ColorDiv.Style["background-color"] = DefaultColor;
            ColorDiv.Style["font-size"] = "1px";
            cell.Controls.Add(ColorDiv);

            Content.Add(table);

            base.CreateChildControls();
        }

        protected override void OnPreRender(EventArgs e)
        {
            ColorDiv.ToolTip = this.ToolTip;
            if (this.MethodButton != null)
            {
                this.MethodButton.ToolTip = this.ToolTip;
            }
            base.OnPreRender(e);
        }

        internal override void CreateChilds(DesignerWithMapPath designer)
        {
            if (this.MethodButton != null)
            {
                this.MethodButton._designer = designer; ;
            }
            Content.Clear();
            base.CreateChilds(designer);
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            descriptor.AddComponentProperty("colorDiv", ColorDiv.ClientID);
            if (this.MethodButton != null)
            {
                descriptor.AddComponentProperty("methodButton", MethodButton.ClientID);
            }
        }

        #endregion
    }
}
