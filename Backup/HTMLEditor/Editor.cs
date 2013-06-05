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

[assembly: System.Web.UI.WebResource("HTMLEditor.Editor.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Editor.debug.js", "application/x-javascript")]
[assembly: WebResource("HTMLEditor.Editor.css", "text/css", PerformSubstitution = true)]

#endregion

namespace AjaxControlToolkit.HTMLEditor
{
    [Designer("AjaxControlToolkit.EditorDesigner, AjaxControlToolkit")]
    [ParseChildren(true)]
    [PersistChildren(false)]
    [ValidationPropertyAttribute("Content")]
    [ClientCssResource("HTMLEditor.Editor.css")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(AjaxControlToolkit.HTMLEditor.Enums))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.Editor", "HTMLEditor.Editor.js")]
    [System.Drawing.ToolboxBitmap(typeof(AjaxControlToolkit.HTMLEditor.Editor), "HTMLEditor.Editor.ico")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "Toolbar")]
    public class Editor : ScriptControlBase
    {
        #region [ Fields ]

        private EditPanel _editPanel;
        private Toolbar _changingToolbar;
        private TableCell _editPanelCell;
        private TableRow _topToolbarRow;
        private TableRow _bottomToolbarRow;
        internal Toolbar _bottomToolbar;
        internal Toolbar _topToolbar;
        private bool _wasPreRender;

        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new Editor
        /// </summary>
        public Editor()
            : base(false, HtmlTextWriterTag.Div)
        {
        }

        #endregion

        #region [ Events ]

        [Category("Behavior")]
        public event ContentChangedEventHandler ContentChanged
        {
            add
            {
                EditPanel.Events.AddHandler(EditPanel.EventContentChanged, value);
            }
            remove
            {
                EditPanel.Events.RemoveHandler(EditPanel.EventContentChanged, value);
            }
        }

        #endregion

        #region [ Properties ]

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "Exception is caught only for debugging purposes")]
        protected bool IsDesign
        {
            get
            {
                try
                {
                    bool isd = false;
                    if (this.Context == null)
                    {
                        isd = true;
                    }
                    else if (this.Site != null)
                    {
                        isd = this.Site.DesignMode;
                    }
                    else
                    {
                        isd = false;
                    }
                    return isd;
                }
                catch { return true; }
            }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public virtual bool SuppressTabInDesignMode
        {
            get { return EditPanel.SuppressTabInDesignMode; }
            set { EditPanel.SuppressTabInDesignMode = value; }
        }

        [DefaultValue(false)]
        public virtual bool TopToolbarPreservePlace
        {
            get { return (bool)(ViewState["TopToolbarPreservePlace"] ?? false); }
            set { ViewState["TopToolbarPreservePlace"] = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public virtual bool IgnoreTab
        {
            get { return (bool)(ViewState["IgnoreTab"] ?? false); }
            set { ViewState["IgnoreTab"] = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        [Description("Folder used for toolbar's buttons' images")]
        public virtual string ButtonImagesFolder
        {
            get { return (string)(ViewState["ButtonImagesFolder"] ?? ""); }
            set { ViewState["ButtonImagesFolder"] = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public virtual bool NoUnicode
        {
            get { return EditPanel.NoUnicode; }
            set { EditPanel.NoUnicode = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public virtual bool NoScript
        {
            get { return EditPanel.NoScript; }
            set { EditPanel.NoScript = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public virtual bool InitialCleanUp
        {
            get { return EditPanel.InitialCleanUp; }
            set { EditPanel.InitialCleanUp = value; }
        }

        [DefaultValue("ajax__htmleditor_htmlpanel_default")]
        [Category("Appearance")]
        public virtual string HtmlPanelCssClass
        {
            get { return EditPanel.HtmlPanelCssClass; }
            set { EditPanel.HtmlPanelCssClass = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public virtual string DocumentCssPath
        {
            get { return EditPanel.DocumentCssPath; }
            set { EditPanel.DocumentCssPath = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public virtual string DesignPanelCssPath
        {
            get { return EditPanel.DesignPanelCssPath; }
            set { EditPanel.DesignPanelCssPath = value; }
        }

        [DefaultValue(true)]
        [Category("Behavior")]
        public virtual bool AutoFocus
        {
            get { return EditPanel.AutoFocus; }
            set { EditPanel.AutoFocus = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public virtual string Content
        {
            get { return EditPanel.Content; }
            set { EditPanel.Content = value; }
        }

        [DefaultValue(ActiveModeType.Design)]
        [Category("Behavior")]
        public virtual ActiveModeType ActiveMode
        {
            get { return EditPanel.ActiveMode; }
            set { EditPanel.ActiveMode = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        public virtual string OnClientActiveModeChanged
        {
            get { return EditPanel.OnClientActiveModeChanged; }
            set { EditPanel.OnClientActiveModeChanged = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        public virtual string OnClientBeforeActiveModeChanged
        {
            get { return EditPanel.OnClientBeforeActiveModeChanged; }
            set { EditPanel.OnClientBeforeActiveModeChanged = value; }
        }

        [DefaultValue(typeof(Unit), "")]
        [Category("Appearance")]
        public override Unit Height
        {
            get { return base.Height; }
            set { base.Height = value; }
        }

        [DefaultValue(typeof(Unit), "")]
        [Category("Appearance")]
        public override Unit Width
        {
            get { return base.Width; }
            set { base.Width = value; }
        }

        [DefaultValue("ajax__htmleditor_editor_default")]
        [Category("Appearance")]
        public override string CssClass
        {
            get { return base.CssClass; }
            set { base.CssClass = value; }
        }

        internal EditPanel EditPanel
        {
            get
            {
                if (_editPanel == null)
                    _editPanel = new AjaxControlToolkit.HTMLEditor.EditPanelInstance();
                return _editPanel;
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "Toolbar")]
        protected Toolbar BottomToolbar
        {
            get
            {
                if (_bottomToolbar == null)
                    _bottomToolbar = new AjaxControlToolkit.HTMLEditor.ToolbarInstance();
                return _bottomToolbar;
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "Toolbar")]
        protected Toolbar TopToolbar
        {
            get
            {
                if (_topToolbar == null)
                    _topToolbar = new AjaxControlToolkit.HTMLEditor.ToolbarInstance();
                return _topToolbar;
            }
        }

        #endregion

        #region [ Methods ]

        protected override Style CreateControlStyle()
        {
            EditorStyle style = new EditorStyle(ViewState);
            style.CssClass = "ajax__htmleditor_editor_default";
            return style;
        }

        protected override void AddAttributesToRender(HtmlTextWriter writer)
        {
            if (!ControlStyleCreated || IsDesign)
            {
                writer.AddAttribute(HtmlTextWriterAttribute.Class,(IsDesign?"ajax__htmleditor_editor_base ":"")+ "ajax__htmleditor_editor_default");
            }
            base.AddAttributesToRender(writer);
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            descriptor.AddComponentProperty("editPanel", EditPanel.ClientID);
            if (_changingToolbar != null) descriptor.AddComponentProperty("changingToolbar", _changingToolbar.ClientID);
        }

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            EditPanel.Toolbars.Add(BottomToolbar);
            _changingToolbar = TopToolbar;
            EditPanel.Toolbars.Add(TopToolbar);

            Table table = new Table();
            TableRow row;
            TableCell cell;

            table.CellPadding = 0;
            table.CellSpacing = 0;
            table.CssClass = "ajax__htmleditor_editor_container";
            table.Style[HtmlTextWriterStyle.BorderCollapse] = "separate";

            _topToolbarRow = row = new TableRow();
            cell = new TableCell();
            cell.Controls.Add(TopToolbar);
            cell.CssClass = "ajax__htmleditor_editor_toptoolbar";

            row.Cells.Add(cell);
            table.Rows.Add(row);

            row = new TableRow();
            _editPanelCell = cell = new TableCell();
            cell.CssClass = "ajax__htmleditor_editor_editpanel";

            cell.Controls.Add(EditPanel);

            row.Cells.Add(cell);
            table.Rows.Add(row);

            _bottomToolbarRow = row = new TableRow();
            cell = new TableCell();

            cell.Controls.Add(BottomToolbar);
            cell.CssClass = "ajax__htmleditor_editor_bottomtoolbar";
            row.Cells.Add(cell);
            table.Rows.Add(row);

            this.Controls.Add(table);
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "Toolbar")]
        protected virtual void FillBottomToolbar()
        {
            BottomToolbar.Buttons.Add(new ToolbarButton.DesignMode());
            BottomToolbar.Buttons.Add(new ToolbarButton.HtmlMode());
            BottomToolbar.Buttons.Add(new ToolbarButton.PreviewMode());
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "Toolbar")]
        protected virtual void FillTopToolbar()
        {
            Collection<ToolbarButton.SelectOption> options;
            ToolbarButton.SelectOption option;

            TopToolbar.Buttons.Add(new ToolbarButton.Undo());
            TopToolbar.Buttons.Add(new ToolbarButton.Redo());
            TopToolbar.Buttons.Add(new ToolbarButton.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButton.Bold());
            TopToolbar.Buttons.Add(new ToolbarButton.Italic());
            TopToolbar.Buttons.Add(new ToolbarButton.Underline());
            TopToolbar.Buttons.Add(new ToolbarButton.StrikeThrough());
            TopToolbar.Buttons.Add(new ToolbarButton.SubScript());
            TopToolbar.Buttons.Add(new ToolbarButton.SuperScript());
            TopToolbar.Buttons.Add(new ToolbarButton.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButton.Ltr());
            TopToolbar.Buttons.Add(new ToolbarButton.Rtl());
            TopToolbar.Buttons.Add(new ToolbarButton.HorizontalSeparator());

            ToolbarButton.FixedForeColor FixedForeColor = new ToolbarButton.FixedForeColor();
            TopToolbar.Buttons.Add(FixedForeColor);
            ToolbarButton.ForeColorSelector ForeColorSelector = new ToolbarButton.ForeColorSelector();
            ForeColorSelector.FixedColorButtonId = FixedForeColor.ID = "FixedForeColor";
            TopToolbar.Buttons.Add(ForeColorSelector);
            TopToolbar.Buttons.Add(new ToolbarButton.ForeColorClear());

            TopToolbar.Buttons.Add(new ToolbarButton.HorizontalSeparator());

            ToolbarButton.FixedBackColor FixedBackColor = new ToolbarButton.FixedBackColor();
            TopToolbar.Buttons.Add(FixedBackColor);
            ToolbarButton.BackColorSelector BackColorSelector = new ToolbarButton.BackColorSelector();
            BackColorSelector.FixedColorButtonId = FixedBackColor.ID = "FixedBackColor";
            TopToolbar.Buttons.Add(BackColorSelector);
            TopToolbar.Buttons.Add(new ToolbarButton.BackColorClear());

            TopToolbar.Buttons.Add(new ToolbarButton.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButton.RemoveStyles());
            TopToolbar.Buttons.Add(new ToolbarButton.HorizontalSeparator());

            ToolbarButton.FontName fontName = new ToolbarButton.FontName();
            TopToolbar.Buttons.Add(fontName);

            options = fontName.Options;
            option = new ToolbarButton.SelectOption();
            option.Value = "arial,helvetica,sans-serif";
            option.Text = "Arial";
            options.Add(option);
            option = new ToolbarButton.SelectOption();
            option.Value = "courier new,courier,monospace";
            option.Text = "Courier New";
            options.Add(option);
            option = new ToolbarButton.SelectOption();
            option.Value = "georgia,times new roman,times,serif";
            option.Text = "Georgia";
            options.Add(option);
            option = new ToolbarButton.SelectOption();
            option.Value = "tahoma,arial,helvetica,sans-serif";
            option.Text = "Tahoma";
            options.Add(option);
            option = new ToolbarButton.SelectOption();
            option.Value = "times new roman,times,serif";
            option.Text = "Times New Roman";
            options.Add(option);
            option = new ToolbarButton.SelectOption();
            option.Value = "verdana,arial,helvetica,sans-serif";
            option.Text = "Verdana";
            options.Add(option);
            option = new ToolbarButton.SelectOption();
            option.Value = "impact";
            option.Text = "Impact";
            options.Add(option);
            option = new ToolbarButton.SelectOption();
            option.Value = "wingdings";
            option.Text = "WingDings";
            options.Add(option);

            TopToolbar.Buttons.Add(new ToolbarButton.HorizontalSeparator());
            ToolbarButton.FontSize fontSize = new ToolbarButton.FontSize();
            TopToolbar.Buttons.Add(fontSize);

            options = fontSize.Options;
            option = new ToolbarButton.SelectOption();
            option.Value = "8pt";
            option.Text = "1 ( 8 pt)";
            options.Add(option);
            option = new ToolbarButton.SelectOption();
            option.Value = "10pt";
            option.Text = "2 (10 pt)";
            options.Add(option);
            option = new ToolbarButton.SelectOption();
            option.Value = "12pt";
            option.Text = "3 (12 pt)";
            options.Add(option);
            option = new ToolbarButton.SelectOption();
            option.Value = "14pt";
            option.Text = "4 (14 pt)";
            options.Add(option);
            option = new ToolbarButton.SelectOption();
            option.Value = "18pt";
            option.Text = "5 (18 pt)";
            options.Add(option);
            option = new ToolbarButton.SelectOption();
            option.Value = "24pt";
            option.Text = "6 (24 pt)";
            options.Add(option);
            option = new ToolbarButton.SelectOption();
            option.Value = "36pt";
            option.Text = "7 (36 pt)";
            options.Add(option);

            TopToolbar.Buttons.Add(new ToolbarButton.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButton.Cut());
            TopToolbar.Buttons.Add(new ToolbarButton.Copy());
            TopToolbar.Buttons.Add(new ToolbarButton.Paste());
            TopToolbar.Buttons.Add(new ToolbarButton.PasteText());
            TopToolbar.Buttons.Add(new ToolbarButton.PasteWord());
            TopToolbar.Buttons.Add(new ToolbarButton.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButton.DecreaseIndent());
            TopToolbar.Buttons.Add(new ToolbarButton.IncreaseIndent());
            TopToolbar.Buttons.Add(new ToolbarButton.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButton.Paragraph());
            TopToolbar.Buttons.Add(new ToolbarButton.JustifyLeft());
            TopToolbar.Buttons.Add(new ToolbarButton.JustifyCenter());
            TopToolbar.Buttons.Add(new ToolbarButton.JustifyRight());
            TopToolbar.Buttons.Add(new ToolbarButton.JustifyFull());
            TopToolbar.Buttons.Add(new ToolbarButton.RemoveAlignment());
            TopToolbar.Buttons.Add(new ToolbarButton.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButton.OrderedList());
            TopToolbar.Buttons.Add(new ToolbarButton.BulletedList());

            TopToolbar.Buttons.Add(new ToolbarButton.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButton.InsertHR());
            TopToolbar.Buttons.Add(new ToolbarButton.InsertLink());
            TopToolbar.Buttons.Add(new ToolbarButton.RemoveLink());
        }

        protected override void CreateChildControls()
        {
            BottomToolbar.Buttons.Clear();
            FillBottomToolbar();
            if (BottomToolbar.Buttons.Count == 0)
            {
                if (EditPanel.Toolbars.Contains(BottomToolbar)) EditPanel.Toolbars.Remove(BottomToolbar);
                _bottomToolbarRow.Visible = false;
                (EditPanel.Parent as TableCell).Style["border-bottom-width"] = "0px";
            }
            else
            {
                BottomToolbar.AlwaysVisible = true;
                BottomToolbar.ButtonImagesFolder = this.ButtonImagesFolder;
                for (int i = 0; i < BottomToolbar.Buttons.Count; i++)
                {
                    BottomToolbar.Buttons[i].IgnoreTab = this.IgnoreTab;
                }
            }

            TopToolbar.Buttons.Clear();
            FillTopToolbar();
            if (TopToolbar.Buttons.Count == 0)
            {
                if (EditPanel.Toolbars.Contains(TopToolbar)) EditPanel.Toolbars.Remove(TopToolbar);
                _topToolbarRow.Visible = false;
                (EditPanel.Parent as TableCell).Style["border-top-width"] = "0px";
                _changingToolbar = null;
            }
            else
            {
                TopToolbar.ButtonImagesFolder = this.ButtonImagesFolder;
                for (int i = 0; i < TopToolbar.Buttons.Count; i++)
                {
                    TopToolbar.Buttons[i].IgnoreTab = this.IgnoreTab;
                    TopToolbar.Buttons[i].PreservePlace = this.TopToolbarPreservePlace;
                }
            }

            if (!Height.IsEmpty)
                (Controls[0] as Table).Style.Add(HtmlTextWriterStyle.Height, Height.ToString());
            if (!Width.IsEmpty)
                (Controls[0] as Table).Style.Add(HtmlTextWriterStyle.Width, Width.ToString());

            if (EditPanel.IE(Page) && !IsDesign)
            {
                _editPanelCell.Style[HtmlTextWriterStyle.Height] = "expression(Sys.Extended.UI.HTMLEditor.Editor.MidleCellHeightForIE(this.parentNode.parentNode.parentNode,this.parentNode))";
            }
            EditPanel.IgnoreTab = this.IgnoreTab;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "Exception is caught only for debugging purposes")]
        protected override void OnPreRender(EventArgs e)
        {
            try
            {
                base.OnPreRender(e);
            }
            catch { }
            _wasPreRender = true;
        }

        protected override void Render(HtmlTextWriter writer)
        {
            if (!_wasPreRender) this.OnPreRender(new EventArgs());
            base.Render(writer);
        }

        internal void CreateChilds(DesignerWithMapPath designer)
        {
            this.CreateChildControls();
            this.TopToolbar.CreateChilds(designer);
            this.BottomToolbar.CreateChilds(designer);
            this.EditPanel.SetDesigner(designer);
        }

        #endregion

        #region [ EditorStyle ]

        private sealed class EditorStyle : Style
        {
            public EditorStyle(StateBag state)
                : base(state)
            {
            }

            protected override void FillStyleAttributes(CssStyleCollection attributes, IUrlResolutionService urlResolver)
            {
                base.FillStyleAttributes(attributes, urlResolver);

                attributes.Remove(HtmlTextWriterStyle.Height);
                attributes.Remove(HtmlTextWriterStyle.Width);
            }
        }

        #endregion
    }
}
