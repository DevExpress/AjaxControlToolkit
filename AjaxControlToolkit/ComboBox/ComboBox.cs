#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Design;
using System.Globalization;
using System.Reflection;
using System.Security.Permissions;
using System.Web;
using System.Web.UI;
using System.Web.UI.Design.WebControls;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// Like AutoCompleteExtender, a combo box is an ASP.NET AJAX control that combines the flexibility of the TextBox with a list of options from which users are able to choose.
    /// </summary>
    [SupportsEventValidation()]
    [ValidationProperty("SelectedItem")]
    [AspNetHostingPermission(SecurityAction.LinkDemand, Level = AspNetHostingPermissionLevel.Minimal)]
    [AspNetHostingPermission(SecurityAction.InheritanceDemand, Level = AspNetHostingPermissionLevel.Minimal)]
    [Designer(typeof(ComboBoxDesigner))]
    [Bindable(true, BindingDirection.TwoWay)]
    [DataBindingHandler(typeof(ListControlDataBindingHandler))]
    [DefaultEvent("SelectedIndexChanged")]
    [DefaultProperty("SelectedValue")]
    [ControlValueProperty("SelectedValue")]
    [ParseChildren(true, "Items")]
    [ToolboxData("<{0}:ComboBox runat=\"server\"></{0}:ComboBox>")]
    [ClientCssResource(Constants.ComboBoxName)]
    [ClientScriptResource("Sys.Extended.UI.ComboBox", Constants.ComboBoxName)]
    [RequiredScript(typeof(ScriptControlBase), 2)]
    [RequiredScript(typeof(PopupExtender), 3)]
    [RequiredScript(typeof(CommonToolkitScripts), 4)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.ComboBoxName + Constants.IconPostfix)]
    public class ComboBox : ListControl, IScriptControl, IPostBackDataHandler, INamingContainer, IControlResolver {
        TextBox _textBoxControl;
        ScriptManager _scriptManager;
        ComboBoxButton _buttonControl;
        HiddenField _hiddenFieldControl;
        System.Web.UI.WebControls.BulletedList _optionListControl;
        Table _comboTable;
        TableRow _comboTableRow;
        TableCell _comboTableTextBoxCell;
        TableCell _comboTableButtonCell;

        static readonly object EventItemInserting = new object();
        static readonly object EventItemInserted = new object();

        protected virtual ScriptManager ScriptManager {
            set { _scriptManager = value; }
            get {
                if(_scriptManager == null) {
                    _scriptManager = ScriptManager.GetCurrent(Page);
                    if(_scriptManager == null)
                        throw new HttpException("A ScriptManager is required on the page to use ASP.NET AJAX Script Components.");
                }
                return _scriptManager;
            }
        }

        protected virtual string ClientControlType {
            get {
                var attr = (ClientScriptResourceAttribute)TypeDescriptor.GetAttributes(this)[typeof(ClientScriptResourceAttribute)];
                return attr.ComponentType;
            }
        }

        /// <summary>
        /// Resolves a control
        /// </summary>
        /// <param name="controlId">ID of the control</param>
        /// <returns>Found control</returns>
        public Control ResolveControl(string controlId) {
            return FindControl(controlId);
        }

        /// <summary>
        /// Specifies whether or not the ComboBox is rendered as an Inline or Block level HTML element. The default is Inline.
        /// </summary>
        [Category("Layout")]
        [DefaultValue(typeof(ComboBoxRenderMode), "Inline")]
        [Description("Whether the ComboBox will render as a block or inline HTML element.")]
        public ComboBoxRenderMode RenderMode {
            set { ViewState["RenderMode"] = value; }
            get { return (ViewState["RenderMode"] == null) ? ComboBoxRenderMode.Inline : (ComboBoxRenderMode)ViewState["RenderMode"]; }
        }

        /// <summary>
        /// Determines whether or not a user is allowed to enter text that does not match an item in the list and if the list is always displayed.
        /// </summary>
        /// <remarks>
        /// If "DropDownList" is specified, users are not allowed to enter text that does not match an item in the list. When "DropDown"
        /// (the default value) is specified, any text is allowed. If "Simple" is specified, any text is allowed and the list is
        /// always displayed regardless of the AutoCompleteMode property value.
        /// </remarks>
        [Category("Behavior")]
        [DefaultValue(typeof(ComboBoxStyle), "DropDown")]
        [Description("Whether the ComboBox requires typed text to match an item in the list or allows new items to be created.")]
        public virtual ComboBoxStyle DropDownStyle {
            set { ViewState["DropDownStyle"] = value; }
            get {
                var o = ViewState["DropDownStyle"];
                return (o != null) ? (ComboBoxStyle)o : ComboBoxStyle.DropDown;
            }
        }

        /// <summary>
        /// Determines how the ComboBox automatically completes typed text.
        /// </summary>
        /// <remarks>
        /// When Suggest is specified, the ComboBox will show a list, highlight the first matched item, and if necessary, scroll the list to show the highlighted item. 
        /// If Append is specified, the ComboBox will append the remainder of the first matched item to the user-typed text and highlight the appended text. 
        /// When SuggestAppend is specified, both of the above behaviors are applied. 
        /// If None (the default value) is specified, the ComboBox' auto-complete behaviors are disabled.
        /// </remarks>
        [Category("Behavior")]
        [DefaultValue(typeof(ComboBoxAutoCompleteMode), "None")]
        [Description("Whether the ComboBox auto-completes typing by suggesting an item in the list or appending matches as the user types.")]
        public virtual ComboBoxAutoCompleteMode AutoCompleteMode {
            set { ViewState["AutoCompleteMode"] = value; }
            get {
                var o = ViewState["AutoCompleteMode"];
                return (o != null) ? (ComboBoxAutoCompleteMode)o : ComboBoxAutoCompleteMode.None;
            }
        }

        /// <summary>
        /// Determines if to "Append" or "Prepend" new items when they are inserted into the list 
        /// or insert them in an "Ordinal" manner (alphabetically) based on the item Text or Value.
        /// The default is "Append"
        /// </summary>
        [Category("Behavior")]
        [DefaultValue(typeof(ComboBoxItemInsertLocation), "Append")]
        [Description("Whether a new item will be appended, prepended, or inserted ordinally into the items collection.")]
        public virtual ComboBoxItemInsertLocation ItemInsertLocation {
            set { ViewState["ItemInsertLocation"] = value; }
            get {
                var o = ViewState["ItemInsertLocation"];
                return (o != null) ? (ComboBoxItemInsertLocation)o : ComboBoxItemInsertLocation.Append;
            }
        }

        /// <summary>
        /// Specifies whether or not user-typed text matches items in the list in a case-sensitive manner. The default is false.
        /// </summary>
        [Category("Behavior")]
        [DefaultValue(false)]
        [Description("Whether the ComboBox auto-completes user typing on a case-sensitive basis.")]
        [ExtenderControlProperty]
        [ClientPropertyName("caseSensitive")]
        public virtual bool CaseSensitive {
            set { ViewState["CaseSensitive"] = value; }
            get {
                var o = ViewState["CaseSensitive"];
                return (o != null) ? (bool)o : false;
            }
        }

        /// <summary>
        /// When specified, replaces default styles applied to highlighted items in the list with a custom css class.
        /// </summary>
        [Category("Style")]
        [DefaultValue("")]
        [Description("The CSS class to apply to a hovered item in the list.")]
        [ExtenderControlProperty]
        [ClientPropertyName("listItemHoverCssClass")]
        public virtual string ListItemHoverCssClass {
            set { ViewState["ListItemHoverCssClass"] = value; }
            get {
                var o = ViewState["ListItemHoverCssClass"];
                return (o != null) ? (String)o : String.Empty;
            }
        }

        /// <summary>
        /// The ComboBox selected item index.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("selectedIndex")]
        public override int SelectedIndex {
            get {
                var selectedIndex = base.SelectedIndex;
                return selectedIndex;
            }
            set { base.SelectedIndex = value; }
        }

        /// <summary>
        /// Determines whether or not AutoPostBack should be used.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("autoPostBack")]
        public override bool AutoPostBack {
            get { return base.AutoPostBack; }
            set { base.AutoPostBack = value; }
        }

        /// <summary>
        /// Specifies maximum length of the associated TextBox control.
        /// </summary>
        public virtual int MaxLength {
            get { return TextBoxControl.MaxLength; }
            set { TextBoxControl.MaxLength = value; }
        }

        /// <summary>
        /// The ComboBox tab index.
        /// </summary>
        public override short TabIndex {
            get { return TextBoxControl.TabIndex; }
            set { TextBoxControl.TabIndex = value; }
        }

        /// <summary>
        /// Determines whether or not the ComboBox is enabled.
        /// </summary>
        public override bool Enabled {
            get { return base.Enabled; }
            set {
                base.Enabled = value;
                TextBoxControl.Enabled = base.Enabled;
                ButtonControl.Enabled = base.Enabled;
            }
        }

        /// <summary>
        /// ComboBox height.
        /// </summary>
        public override Unit Height {
            get { return TextBoxControl.Height; }
            set { TextBoxControl.Height = value; }
        }

        /// <summary>
        /// ComboBox width.
        /// </summary>
        public override Unit Width {
            get { return TextBoxControl.Width; }
            set { TextBoxControl.Width = value; }
        }

        /// <summary>
        /// A foreground color.
        /// </summary>
        public override Color ForeColor {
            get { return TextBoxControl.ForeColor; }
            set { TextBoxControl.ForeColor = value; }
        }

        /// <summary>
        /// A background color.
        /// </summary>
        public override Color BackColor {
            get { return TextBoxControl.BackColor; }
            set { TextBoxControl.BackColor = value; }
        }

        /// <summary>
        /// The ComboBox control font.
        /// </summary>
        public override FontInfo Font {
            get { return TextBoxControl.Font; }
        }

        /// <summary>
        /// The ComboBox border color.
        /// </summary>
        public override Color BorderColor {
            get { return TextBoxControl.BorderColor; }
            set {
                TextBoxControl.BorderColor = value;
                ButtonControl.BorderColor = value;
                TextBoxControl.Style.Add("border-right", "0px none");
            }
        }

        /// <summary>
        /// The ComboBox border style.
        /// </summary>
        public override BorderStyle BorderStyle {
            get { return TextBoxControl.BorderStyle; }
            set {
                TextBoxControl.BorderStyle = value;
                ButtonControl.BorderStyle = value;
            }
        }

        /// <summary>
        /// The ComboBox border width.
        /// </summary>
        public override Unit BorderWidth {
            get { return TextBoxControl.BorderWidth; }
            set {
                TextBoxControl.BorderWidth = value;
                ButtonControl.BorderWidth = value;
            }
        }

        protected virtual TextBox TextBoxControl {
            get {
                if(_textBoxControl == null) {
                    _textBoxControl = new TextBox();
                    _textBoxControl.ID = ID + "_TextBox";
                }
                return _textBoxControl;
            }
        }

        protected virtual ComboBoxButton ButtonControl {
            get {
                if(_buttonControl == null) {
                    _buttonControl = new ComboBoxButton();
                    _buttonControl.ID = ID + "_Button";
                }
                return _buttonControl;
            }
        }

        protected virtual HiddenField HiddenFieldControl {
            get {
                if(_hiddenFieldControl == null) {
                    _hiddenFieldControl = new HiddenField();
                    _hiddenFieldControl.ID = ID + "_HiddenField";
                }
                return _hiddenFieldControl;
            }
        }

        protected virtual System.Web.UI.WebControls.BulletedList OptionListControl {
            get {
                if(_optionListControl == null) {
                    _optionListControl = new System.Web.UI.WebControls.BulletedList();
                    _optionListControl.ID = ID + "_OptionList";
                }
                return _optionListControl;
            }
        }

        protected virtual Table ComboTable {
            get {
                if(_comboTable == null) {
                    _comboTable = new Table();
                    _comboTable.ID = ID + "_Table";
                    _comboTable.Rows.Add(ComboTableRow);
                }
                return _comboTable;
            }
        }

        protected virtual TableRow ComboTableRow {
            get {
                if(_comboTableRow == null) {
                    _comboTableRow = new TableRow();
                    _comboTableRow.Cells.Add(ComboTableTextBoxCell);
                    _comboTableRow.Cells.Add(ComboTableButtonCell);
                }
                return _comboTableRow;
            }
        }

        protected virtual TableCell ComboTableTextBoxCell {
            get {
                if(_comboTableTextBoxCell == null)
                    _comboTableTextBoxCell = new TableCell();
                return _comboTableTextBoxCell;
            }
        }

        protected virtual TableCell ComboTableButtonCell {
            get {
                if(_comboTableButtonCell == null)
                    _comboTableButtonCell = new TableCell();
                return _comboTableButtonCell;
            }
        }

        IEnumerable<ScriptReference> IScriptControl.GetScriptReferences() {
            return GetScriptReferences();
        }

        protected virtual IEnumerable<ScriptReference> GetScriptReferences() {
            if(!Visible)
                return null;

            return ToolkitResourceManager.GetControlScriptReferences(GetType());
        }

        IEnumerable<ScriptDescriptor> IScriptControl.GetScriptDescriptors() {
            return GetScriptDescriptors();
        }

        protected virtual IEnumerable<ScriptDescriptor> GetScriptDescriptors() {
            if(!Visible)
                return null;

            var descriptor = new ScriptControlDescriptor(ClientControlType, ClientID);
            ComponentDescriber.DescribeComponent(this, new ScriptComponentDescriptorWrapper(descriptor), this, this);
            descriptor.AddElementProperty("textBoxControl", TextBoxControl.ClientID);
            descriptor.AddElementProperty("buttonControl", ButtonControl.ClientID);
            descriptor.AddElementProperty("hiddenFieldControl", HiddenFieldControl.ClientID);
            descriptor.AddElementProperty("optionListControl", OptionListControl.ClientID);
            descriptor.AddElementProperty("comboTableControl", ComboTable.ClientID);
            descriptor.AddProperty("autoCompleteMode", AutoCompleteMode);
            descriptor.AddProperty("dropDownStyle", DropDownStyle);

            return new List<ScriptDescriptor> { descriptor };
        }

        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);
            ToolkitResourceManager.RegisterCssReferences(this);
        }

        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);
            ScriptManager.RegisterScriptControl<ComboBox>(this);
            Page.RegisterRequiresPostBack(this);
        }

        protected override void Render(HtmlTextWriter writer) {
            base.Render(writer);
            if(!DesignMode)
                ScriptManager.RegisterScriptDescriptors(this);
        }

        protected override void CreateChildControls() {
            if(Controls.Count < 1 || Controls[0] != ComboTable) {
                Controls.Clear();
                ComboTableTextBoxCell.Controls.Add(TextBoxControl);
                ComboTableButtonCell.Controls.Add(ButtonControl);
                Controls.Add(ComboTable);
                Controls.Add(OptionListControl);
                Controls.Add(HiddenFieldControl);
            }
        }

        protected override HtmlTextWriterTag TagKey {
            get { return HtmlTextWriterTag.Div; }
        }

        protected override void AddAttributesToRender(HtmlTextWriter writer) {
            AddContainerAttributesToRender(writer);
            AddTableAttributesToRender(writer);
            AddTextBoxAttributesToRender(writer);
            AddButtonAttributesToRender(writer);
            AddOptionListAttributesToRender(writer);
        }

        protected virtual void AddContainerAttributesToRender(HtmlTextWriter writer) {
            if(RenderMode == ComboBoxRenderMode.Inline)
                Style.Add(HtmlTextWriterStyle.Display, GetInlineDisplayStyle());
            base.AddAttributesToRender(writer);
        }

        protected virtual void AddTableAttributesToRender(HtmlTextWriter writer) {
            ComboTable.CssClass = "ajax__combobox_inputcontainer";
            ComboTableTextBoxCell.CssClass = "ajax__combobox_textboxcontainer";
            ComboTableButtonCell.CssClass = "ajax__combobox_buttoncontainer";
            ComboTable.BorderStyle = BorderStyle.None;
            ComboTable.BorderWidth = Unit.Pixel(0);
            if(RenderMode == ComboBoxRenderMode.Inline) {
                ComboTable.Style.Add(HtmlTextWriterStyle.Display, GetInlineDisplayStyle());

                if(!DesignMode) {
                    // when rendered inline, the combobox displays slightly above adjacent inline elements
                    ComboTable.Style.Add(HtmlTextWriterStyle.Position, "relative");
                    ComboTable.Style.Add(HtmlTextWriterStyle.Top, "5px");
                }
            }
        }

        protected virtual void AddTextBoxAttributesToRender(HtmlTextWriter writer) {
            TextBoxControl.AutoCompleteType = AutoCompleteType.None;
            TextBoxControl.Attributes.Add("autocomplete", "off");
        }

        protected virtual void AddButtonAttributesToRender(HtmlTextWriter writer) {
            if(!DesignMode) {
                ButtonControl.TabIndex = -1;

                return;
            }

            ButtonControl.Width = Unit.Pixel(14);
            ButtonControl.Height = Unit.Pixel(14);
        }

        protected virtual void AddOptionListAttributesToRender(HtmlTextWriter writer) {
            OptionListControl.CssClass = "ajax__combobox_itemlist";
            OptionListControl.Style.Add(HtmlTextWriterStyle.Display, "none");
            OptionListControl.Style.Add(HtmlTextWriterStyle.Visibility, "hidden");
        }

        /// <summary>
        /// Renders a control.
        /// </summary>
        /// <param name="writer">HTML text writer</param>
        public override void RenderControl(HtmlTextWriter writer) {
            if(DesignMode) {
                CreateChildControls();
                AddAttributesToRender(writer);
                ComboTable.RenderControl(writer);
            }
            else {
                HiddenFieldControl.Value = SelectedIndex.ToString();
                base.RenderControl(writer);
            }
        }

        protected override void RenderContents(HtmlTextWriter writer) {
            ComboTable.RenderControl(writer);

            OptionListControl.Items.Clear();
            var copy = new ListItem[Items.Count];
            Items.CopyTo(copy, 0);
            OptionListControl.Items.AddRange(copy);
            OptionListControl.RenderControl(writer);

            HiddenFieldControl.RenderControl(writer);
        }

        bool IPostBackDataHandler.LoadPostData(string postDataKey, NameValueCollection postCollection) {
            return LoadPostData(postDataKey, postCollection);
        }

        void IPostBackDataHandler.RaisePostDataChangedEvent() {
            RaisePostDataChangedEvent();
        }

        protected virtual bool LoadPostData(string postDataKey, NameValueCollection postCollection) {
            if(!Enabled)
                return false;

            var postCollectionValues = postCollection.GetValues(HiddenFieldControl.UniqueID);
            if(postCollectionValues == null)
                return false;

            var newSelectedIndex = Convert.ToInt32(postCollectionValues[0], CultureInfo.InvariantCulture);
            EnsureDataBound();

            if(newSelectedIndex == -2 && (DropDownStyle == ComboBoxStyle.Simple || DropDownStyle == ComboBoxStyle.DropDown)) {
                var newText = postCollection.GetValues(TextBoxControl.UniqueID)[0];
                var eventArgs = new ComboBoxItemInsertEventArgs(newText, ItemInsertLocation);
                OnItemInserting(eventArgs);

                if(!eventArgs.Cancel)
                    InsertItem(eventArgs);
                else
                    TextBoxControl.Text = (SelectedIndex < 0) ? String.Empty : SelectedItem.Text;

            } else if(newSelectedIndex != SelectedIndex) {
                SelectedIndex = newSelectedIndex;
                return true;
            }

            return false;
        }

        /// <summary>
        /// Raises PostDataChangeEvent.
        /// </summary>
        public virtual void RaisePostDataChangedEvent() {
            OnSelectedIndexChanged(EventArgs.Empty);
        }

        /// <summary>
        /// Fires on inserting an item.
        /// </summary>
        public event EventHandler<ComboBoxItemInsertEventArgs> ItemInserting {
            add { Events.AddHandler(EventItemInserting, value); }
            remove { Events.RemoveHandler(EventItemInserting, value); }
        }

        /// <summary>
        /// Fires when an item is inserted.
        /// </summary>
        public event EventHandler<ComboBoxItemInsertEventArgs> ItemInserted {
            add { Events.AddHandler(EventItemInserted, value); }
            remove { Events.RemoveHandler(EventItemInserted, value); }
        }

        protected virtual void OnItemInserting(ComboBoxItemInsertEventArgs e) {
            var handler = (EventHandler<ComboBoxItemInsertEventArgs>)Events[EventItemInserting];
            if(handler != null)
                handler(this, e);
        }

        protected virtual void OnItemInserted(ComboBoxItemInsertEventArgs e) {
            var handler = (EventHandler<ComboBoxItemInsertEventArgs>)Events[EventItemInserted];
            if(handler != null)
                handler(this, e);
        }

        protected virtual void InsertItem(ComboBoxItemInsertEventArgs e) {
            if(!e.Cancel) {
                var insertIndex = -1;

                if(e.InsertLocation == ComboBoxItemInsertLocation.Prepend)
                    insertIndex = 0;
                else if(e.InsertLocation == ComboBoxItemInsertLocation.Append)
                    insertIndex = Items.Count;
                else if(e.InsertLocation == ComboBoxItemInsertLocation.OrdinalText) {
                    // loop through items collection to find proper insertion point
                    insertIndex = 0;
                    foreach(ListItem li in Items) {
                        var compareValue = String.Compare(e.Item.Text, li.Text, StringComparison.Ordinal);
                        if(compareValue > 0)
                            ++insertIndex;
                        else
                            break;
                    }
                }
                else if(e.InsertLocation == ComboBoxItemInsertLocation.OrdinalValue) {
                    // loop through items collection to find proper insertion point
                    insertIndex = 0;
                    foreach(ListItem li in Items) {
                        var compareValue = String.Compare(e.Item.Value, li.Value, StringComparison.Ordinal);
                        if(compareValue > 0)
                            ++insertIndex;
                        else
                            break;
                    }
                }

                if(insertIndex >= Items.Count) {
                    Items.Add(e.Item);
                    SelectedIndex = Items.Count - 1;
                } else {
                    Items.Insert(insertIndex, e.Item);
                    SelectedIndex = insertIndex;
                }
                OnItemInserted(e);
            }
        }

        string GetInlineDisplayStyle() {
            var display = "inline";
            if(!DesignMode && (Page.Request.Browser.Browser.ToLower().Contains("safari")
                || Page.Request.Browser.Browser.ToLower().Contains("firefox")))
                display += "-block";
            return display;
        }
    }

}

#pragma warning restore 1591