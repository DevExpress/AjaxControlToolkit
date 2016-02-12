#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit.HtmlEditor;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedColorButton", Constants.HtmlEditorFixedColorButtonName)]
    public abstract class FixedColorButton : DesignModeBoxButton {
        MethodButton _methodButton;
        DesignModeBoxButton _colorDiv;
        string _defaultColor = "#000000";

        protected MethodButton MethodButton {
            get { return _methodButton; }
            set { _methodButton = value; }
        }

        protected DesignModeBoxButton ColorDiv {
            get { return _colorDiv; }
            set { _colorDiv = value; }
        }

        [DefaultValue("#000000")]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("defaultColor")]
        public string DefaultColor {
            get { return _defaultColor; }
            set { _defaultColor = value; }
        }

        protected override void CreateChildControls() {
            var table = new Table();
            table.Attributes.Add("border", "0");
            table.Attributes.Add("cellspacing", "0");
            table.Attributes.Add("cellpadding", "0");
            table.Style[HtmlTextWriterStyle.Margin] = "1px";
            table.Style[HtmlTextWriterStyle.Padding] = "0";

            var row = new TableRow();
            var cell = new TableCell();

            table.Rows.Add(row);
            row.Cells.Add(cell);
            if(MethodButton != null)
                cell.Controls.Add(MethodButton);

            row = new TableRow();
            cell = new TableCell();
            table.Rows.Add(row);
            row.Cells.Add(cell);
            ColorDiv = new DesignModeBoxButton();
            ColorDiv.CssClass = String.Empty;
            ColorDiv.Style[HtmlTextWriterStyle.Margin] = "0";
            ColorDiv.Style[HtmlTextWriterStyle.Padding] = "0";
            ColorDiv.Width = new Unit(21, UnitType.Pixel);
            ColorDiv.Height = new Unit(5, UnitType.Pixel);
            ColorDiv.Style["background-color"] = DefaultColor;
            ColorDiv.Style["font-size"] = "1px";
            cell.Controls.Add(ColorDiv);

            Content.Add(table);

            base.CreateChildControls();
        }

        protected override void OnPreRender(EventArgs e) {
            ColorDiv.ToolTip = ToolTip;
            if(MethodButton != null)
                MethodButton.ToolTip = ToolTip;
            base.OnPreRender(e);
        }

        internal override void CreateChilds(DesignerWithMapPath designer) {
            if(MethodButton != null)
                MethodButton._designer = designer;
            Content.Clear();
            base.CreateChilds(designer);
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            descriptor.AddComponentProperty("colorDiv", ColorDiv.ClientID);
            if(MethodButton != null)
                descriptor.AddComponentProperty("methodButton", MethodButton.ClientID);
        }
    }

}

#pragma warning restore 1591