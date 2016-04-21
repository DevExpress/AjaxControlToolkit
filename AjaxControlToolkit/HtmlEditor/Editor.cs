#pragma warning disable 1591
using AjaxControlToolkit.Design;
using AjaxControlToolkit.HtmlEditor.ToolbarButtons;
using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor {

    [Obsolete("HtmlEditor is obsolete. Use HtmlEditorExtender instead.")]
    [Designer("AjaxControlToolkit.Design.EditorDesigner, AjaxControlToolkit")]
    [ToolboxItem(false)]
    [ValidationPropertyAttribute("Content")]
    [ClientCssResource(Constants.HtmlEditorEditorName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.Enums))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.BackColorClear))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.BackColorSelector))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.Bold))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.BoxButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.BulletedList))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.ColorButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.ColorSelector))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.CommonButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.Copy))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.Cut))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.DecreaseIndent))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.DesignMode))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.DesignModeBoxButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.DesignModeImageButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.DesignModePopupImageButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.DesignModeSelectButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.EditorToggleButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.FixedBackColor))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.FixedColorButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.FixedForeColor))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.FontName))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.FontSize))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.ForeColor))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.ForeColorClear))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.ForeColorSelector))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.HorizontalSeparator))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.HtmlMode))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.ImageButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.IncreaseIndent))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.InsertHR))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.InsertLink))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.Italic))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.JustifyCenter))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.JustifyFull))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.JustifyLeft))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.JustifyRight))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.Ltr))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.MethodButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.ModeButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.OkCancelPopupButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.OrderedList))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.Paragraph))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.Paste))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.PasteText))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.PasteWord))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.PreviewMode))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.Redo))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.RemoveAlignment))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.RemoveLink))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.RemoveStyles))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.Rtl))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.SelectButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.SelectOption))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.Selector))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.StrikeThrough))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.SubScript))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.SuperScript))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.Underline))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.ToolbarButtons.Undo))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.Popups.AttachedPopup))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.Popups.AttachedTemplatePopup))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.Popups.BaseColorsPopup))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.Popups.LinkProperties))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.Popups.OkCancelAttachedTemplatePopup))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.Popups.Popup))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.Popups.PopupBGIButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.Popups.PopupBoxButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.Popups.PopupCommonButton))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.Popups.RegisteredField))]

    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.Editor", Constants.HtmlEditorEditorName)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.HtmlEditorName + Constants.IconPostfix)]

    public class Editor : ScriptControlBase {
        internal Toolbar _bottomToolbar;
        internal Toolbar _topToolbar;

        EditPanel _editPanel;
        Toolbar _changingToolbar;
        TableCell _editPanelCell;
        TableRow _topToolbarRow;
        TableRow _bottomToolbarRow;

        bool _wasPreRender;

        public Editor()
            : base(false, HtmlTextWriterTag.Div) {
        }

        [Category("Behavior")]
        public event ContentChangedEventHandler ContentChanged {
            add {
                EditPanel.Events.AddHandler(EditPanel.EventContentChanged, value);
            }
            remove {
                EditPanel.Events.RemoveHandler(EditPanel.EventContentChanged, value);
            }
        }

        protected bool IsDesign {
            get {
                try {
                    var isd = false;
                    if(Context == null)
                        isd = true;
                    else if(Site != null)
                        isd = Site.DesignMode;
                    else
                        isd = false;

                    return isd;
                }
                catch { return true; }
            }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public virtual bool SuppressTabInDesignMode {
            get { return EditPanel.SuppressTabInDesignMode; }
            set { EditPanel.SuppressTabInDesignMode = value; }
        }

        [DefaultValue(false)]
        public virtual bool TopToolbarPreservePlace {
            get { return (bool)(ViewState["TopToolbarPreservePlace"] ?? false); }
            set { ViewState["TopToolbarPreservePlace"] = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public virtual bool IgnoreTab {
            get { return (bool)(ViewState["IgnoreTab"] ?? false); }
            set { ViewState["IgnoreTab"] = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        [Description("Folder used for toolbar's buttons' images")]
        public virtual string ButtonImagesFolder {
            get { return (String)(ViewState["ButtonImagesFolder"] ?? String.Empty); }
            set { ViewState["ButtonImagesFolder"] = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public virtual bool NoUnicode {
            get { return EditPanel.NoUnicode; }
            set { EditPanel.NoUnicode = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public virtual bool NoScript {
            get { return EditPanel.NoScript; }
            set { EditPanel.NoScript = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public virtual bool InitialCleanUp {
            get { return EditPanel.InitialCleanUp; }
            set { EditPanel.InitialCleanUp = value; }
        }

        [DefaultValue("ajax__htmleditor_htmlpanel_default")]
        [Category("Appearance")]
        public virtual string HtmlPanelCssClass {
            get { return EditPanel.HtmlPanelCssClass; }
            set { EditPanel.HtmlPanelCssClass = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public virtual string DocumentCssPath {
            get { return EditPanel.DocumentCssPath; }
            set { EditPanel.DocumentCssPath = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public virtual string DesignPanelCssPath {
            get { return EditPanel.DesignPanelCssPath; }
            set { EditPanel.DesignPanelCssPath = value; }
        }

        [DefaultValue(true)]
        [Category("Behavior")]
        public virtual bool AutoFocus {
            get { return EditPanel.AutoFocus; }
            set { EditPanel.AutoFocus = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public virtual string Content {
            get { return EditPanel.Content; }
            set { EditPanel.Content = value; }
        }

        [DefaultValue(ActiveModeType.Design)]
        [Category("Behavior")]
        public virtual ActiveModeType ActiveMode {
            get { return EditPanel.ActiveMode; }
            set { EditPanel.ActiveMode = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        public virtual string OnClientActiveModeChanged {
            get { return EditPanel.OnClientActiveModeChanged; }
            set { EditPanel.OnClientActiveModeChanged = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        public virtual string OnClientBeforeActiveModeChanged {
            get { return EditPanel.OnClientBeforeActiveModeChanged; }
            set { EditPanel.OnClientBeforeActiveModeChanged = value; }
        }

        [DefaultValue(typeof(Unit), "")]
        [Category("Appearance")]
        public override Unit Height {
            get { return base.Height; }
            set { base.Height = value; }
        }

        [DefaultValue(typeof(Unit), "")]
        [Category("Appearance")]
        public override Unit Width {
            get { return base.Width; }
            set { base.Width = value; }
        }

        [DefaultValue("ajax__htmleditor_editor_default")]
        [Category("Appearance")]
        public override string CssClass {
            get { return base.CssClass; }
            set { base.CssClass = value; }
        }

        internal EditPanel EditPanel {
            get {
                if(_editPanel == null)
                    _editPanel = new EditPanelInstance();
                return _editPanel;
            }
        }

        protected Toolbar BottomToolbar {
            get {
                if(_bottomToolbar == null)
                    _bottomToolbar = new ToolbarInstance();
                return _bottomToolbar;
            }
        }

        protected Toolbar TopToolbar {
            get {
                if(_topToolbar == null)
                    _topToolbar = new ToolbarInstance();
                return _topToolbar;
            }
        }

        protected override Style CreateControlStyle() {
            var style = new EditorStyle(ViewState);
            style.CssClass = "ajax__htmleditor_editor_default";
            return style;
        }

        protected override void AddAttributesToRender(HtmlTextWriter writer) {
            if(!ControlStyleCreated || IsDesign) {
                writer.AddAttribute(HtmlTextWriterAttribute.Class, (IsDesign ? "ajax__htmleditor_editor_base " : "") + "ajax__htmleditor_editor_default");
            }
            base.AddAttributesToRender(writer);
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            descriptor.AddComponentProperty("editPanel", EditPanel.ClientID);
            if(_changingToolbar != null) descriptor.AddComponentProperty("changingToolbar", _changingToolbar.ClientID);
        }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);

            EditPanel.Toolbars.Add(BottomToolbar);
            _changingToolbar = TopToolbar;
            EditPanel.Toolbars.Add(TopToolbar);

            var table = new Table();
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

            Controls.Add(table);
        }

        protected virtual void FillBottomToolbar() {
            BottomToolbar.Buttons.Add(new DesignMode());
            BottomToolbar.Buttons.Add(new HtmlMode());
            BottomToolbar.Buttons.Add(new PreviewMode());
        }

        protected virtual void FillTopToolbar() {
            Collection<SelectOption> options;
            SelectOption option;

            TopToolbar.Buttons.Add(new ToolbarButtons.Undo());
            TopToolbar.Buttons.Add(new ToolbarButtons.Redo());
            TopToolbar.Buttons.Add(new ToolbarButtons.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButtons.Bold());
            TopToolbar.Buttons.Add(new ToolbarButtons.Italic());
            TopToolbar.Buttons.Add(new ToolbarButtons.Underline());
            TopToolbar.Buttons.Add(new ToolbarButtons.StrikeThrough());
            TopToolbar.Buttons.Add(new ToolbarButtons.SubScript());
            TopToolbar.Buttons.Add(new ToolbarButtons.SuperScript());
            TopToolbar.Buttons.Add(new ToolbarButtons.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButtons.Ltr());
            TopToolbar.Buttons.Add(new ToolbarButtons.Rtl());
            TopToolbar.Buttons.Add(new ToolbarButtons.HorizontalSeparator());

            var FixedForeColor = new ToolbarButtons.FixedForeColor();
            TopToolbar.Buttons.Add(FixedForeColor);
            var ForeColorSelector = new ToolbarButtons.ForeColorSelector();
            ForeColorSelector.FixedColorButtonId = FixedForeColor.ID = "FixedForeColor";
            TopToolbar.Buttons.Add(ForeColorSelector);
            TopToolbar.Buttons.Add(new ToolbarButtons.ForeColorClear());

            TopToolbar.Buttons.Add(new ToolbarButtons.HorizontalSeparator());

            var FixedBackColor = new ToolbarButtons.FixedBackColor();
            TopToolbar.Buttons.Add(FixedBackColor);
            var BackColorSelector = new ToolbarButtons.BackColorSelector();
            BackColorSelector.FixedColorButtonId = FixedBackColor.ID = "FixedBackColor";
            TopToolbar.Buttons.Add(BackColorSelector);
            TopToolbar.Buttons.Add(new ToolbarButtons.BackColorClear());

            TopToolbar.Buttons.Add(new ToolbarButtons.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButtons.RemoveStyles());
            TopToolbar.Buttons.Add(new ToolbarButtons.HorizontalSeparator());

            var fontName = new FontName();
            TopToolbar.Buttons.Add(fontName);

            options = fontName.Options;

            option = new SelectOption {
                Text = "Arial",
                Value = "arial,helvetica,sans-serif"
            };
            options.Add(option);

            option = new SelectOption {
                Text = "Courier New",
                Value = "courier new,courier,monospace"
            };
            options.Add(option);

            option = new SelectOption {
                Text = "Georgia",
                Value = "georgia,times new roman,times,serif"
            };
            options.Add(option);

            option = new SelectOption {
                Text = "Tahoma",
                Value = "tahoma,arial,helvetica,sans-serif"
            };
            options.Add(option);

            option = new SelectOption {
                Text = "Times New Roman",
                Value = "times new roman,times,serif"
            };
            options.Add(option);

            option = new SelectOption {
                Text = "Verdana",
                Value = "verdana,arial,helvetica,sans-serif"
            };
            options.Add(option);

            option = new SelectOption {
                Text = "Impact",
                Value = "impact"
            };
            options.Add(option);

            option = new SelectOption {
                Text = "WingDings",
                Value = "wingdings"
            };
            options.Add(option);

            TopToolbar.Buttons.Add(new ToolbarButtons.HorizontalSeparator());
            var fontSize = new ToolbarButtons.FontSize();
            TopToolbar.Buttons.Add(fontSize);

            options = fontSize.Options;

            option = new SelectOption {
                Text = "1 ( 8 pt)",
                Value = "8pt"
            };
            options.Add(option);

            option = new SelectOption {
                Text = "2 (10 pt)",
                Value = "10pt"
            };
            options.Add(option);

            option = new SelectOption {
                Text = "3 (12 pt)",
                Value = "12pt"
            };
            options.Add(option);

            option = new SelectOption {
                Text = "4 (14 pt)",
                Value = "14pt"
            };
            options.Add(option);

            option = new SelectOption {
                Text = "5 (18 pt)",
                Value = "18pt"
            };
            options.Add(option);

            option = new SelectOption {
                Text = "6 (24 pt)",
                Value = "24pt"
            };
            options.Add(option);

            option = new SelectOption {
                Text = "7 (36 pt)",
                Value = "36pt"
            };
            options.Add(option);

            TopToolbar.Buttons.Add(new ToolbarButtons.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButtons.Cut());
            TopToolbar.Buttons.Add(new ToolbarButtons.Copy());
            TopToolbar.Buttons.Add(new ToolbarButtons.Paste());
            TopToolbar.Buttons.Add(new ToolbarButtons.PasteText());
            TopToolbar.Buttons.Add(new ToolbarButtons.PasteWord());
            TopToolbar.Buttons.Add(new ToolbarButtons.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButtons.DecreaseIndent());
            TopToolbar.Buttons.Add(new ToolbarButtons.IncreaseIndent());
            TopToolbar.Buttons.Add(new ToolbarButtons.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButtons.Paragraph());
            TopToolbar.Buttons.Add(new ToolbarButtons.JustifyLeft());
            TopToolbar.Buttons.Add(new ToolbarButtons.JustifyCenter());
            TopToolbar.Buttons.Add(new ToolbarButtons.JustifyRight());
            TopToolbar.Buttons.Add(new ToolbarButtons.JustifyFull());
            TopToolbar.Buttons.Add(new ToolbarButtons.RemoveAlignment());
            TopToolbar.Buttons.Add(new ToolbarButtons.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButtons.OrderedList());
            TopToolbar.Buttons.Add(new ToolbarButtons.BulletedList());

            TopToolbar.Buttons.Add(new ToolbarButtons.HorizontalSeparator());
            TopToolbar.Buttons.Add(new ToolbarButtons.InsertHR());
            TopToolbar.Buttons.Add(new ToolbarButtons.InsertLink());
            TopToolbar.Buttons.Add(new ToolbarButtons.RemoveLink());
        }

        protected override void CreateChildControls() {
            BottomToolbar.Buttons.Clear();
            FillBottomToolbar();
            if(BottomToolbar.Buttons.Count == 0) {
                if(EditPanel.Toolbars.Contains(BottomToolbar)) 
                    EditPanel.Toolbars.Remove(BottomToolbar);
                _bottomToolbarRow.Visible = false;
                (EditPanel.Parent as TableCell).Style["border-bottom-width"] = "0";
            }
            else {
                BottomToolbar.AlwaysVisible = true;
                BottomToolbar.ButtonImagesFolder = ButtonImagesFolder;
                for(var i = 0; i < BottomToolbar.Buttons.Count; i++)
                    BottomToolbar.Buttons[i].IgnoreTab = IgnoreTab;
            }

            TopToolbar.Buttons.Clear();
            FillTopToolbar();
            if(TopToolbar.Buttons.Count == 0) {
                if(EditPanel.Toolbars.Contains(TopToolbar)) 
                    EditPanel.Toolbars.Remove(TopToolbar);
                _topToolbarRow.Visible = false;
                (EditPanel.Parent as TableCell).Style["border-top-width"] = "0";
                _changingToolbar = null;
            }
            else {
                TopToolbar.ButtonImagesFolder = ButtonImagesFolder;
                for(var i = 0; i < TopToolbar.Buttons.Count; i++) {
                    TopToolbar.Buttons[i].IgnoreTab = IgnoreTab;
                    TopToolbar.Buttons[i].PreservePlace = TopToolbarPreservePlace;
                }
            }

            if(!Height.IsEmpty)
                (Controls[0] as Table).Style.Add(HtmlTextWriterStyle.Height, Height.ToString());
            if(!Width.IsEmpty)
                (Controls[0] as Table).Style.Add(HtmlTextWriterStyle.Width, Width.ToString());

            if(EditPanel.IE(Page) && !IsDesign) {
                _editPanelCell.Style[HtmlTextWriterStyle.Height] = "expression(Sys.Extended.UI.HtmlEditor.Editor.MidleCellHeightForIE(this.parentNode.parentNode.parentNode,this.parentNode))";
            }
            EditPanel.IgnoreTab = IgnoreTab;
        }

        protected override void OnPreRender(EventArgs e) {
            try {
                base.OnPreRender(e);
            }
            catch { }
            _wasPreRender = true;
        }

        protected override void Render(HtmlTextWriter writer) {
            if(!_wasPreRender) 
                OnPreRender(new EventArgs());
            base.Render(writer);
        }

        internal void CreateChilds(DesignerWithMapPath designer) {
            CreateChildControls();
            TopToolbar.CreateChilds(designer);
            BottomToolbar.CreateChilds(designer);
            EditPanel.SetDesigner(designer);
        }

        private sealed class EditorStyle : Style {
            public EditorStyle(StateBag state)
                : base(state) {
            }

            protected override void FillStyleAttributes(CssStyleCollection attributes, IUrlResolutionService urlResolver) {
                base.FillStyleAttributes(attributes, urlResolver);

                attributes.Remove(HtmlTextWriterStyle.Height);
                attributes.Remove(HtmlTextWriterStyle.Width);
            }
        }
    }

}

#pragma warning restore 1591