#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// TabContainer is an ASP.NET AJAX Control, which creates a set of tabs that can be
    /// used to organize page content. TabContainer is a host for a number of TabPanel controls. 
    /// </summary>
    [Designer(typeof(TabContainerDesigner))]
    [ParseChildren(typeof(TabPanel))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientCssResource(Constants.TabsName)]
    [ClientScriptResource("Sys.Extended.UI.TabContainer", Constants.TabsName)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.TabsName + Constants.IconPostfix)]
    public class TabContainer : ScriptControlBase, IPostBackEventHandler {
        static readonly object EventActiveTabChanged = new object();

        int _activeTabIndex = -1;
        int _cachedActiveTabIndex = -1;
        bool _initialized;
        bool _autoPostBack;
        TabStripPlacement _tabStripPlacement;
        bool _useVerticalStripPlacement;
        Unit _verticalStripWidth = new Unit(120, UnitType.Pixel);
        bool _onDemand;
        TabCssTheme _cssTheme = TabCssTheme.XP;

        public TabContainer()
            : base(true, HtmlTextWriterTag.Div) {
        }

        /// <summary>
        /// Fires on the server side when a tab is changed after a postback
        /// </summary>
        [Category("Behavior")]
        public event EventHandler ActiveTabChanged {
            add { Events.AddHandler(EventActiveTabChanged, value); }
            remove { Events.RemoveHandler(EventActiveTabChanged, value); }
        }

        /// <summary>
        /// The first tab to show
        /// </summary>
        /// <remarks>
        /// For the client side
        /// </remarks>
        [DefaultValue(-1)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("activeTabIndex")]
        public int ActiveTabIndexForClient {
            get {
                var counter = ActiveTabIndex;
                for(int i = 0; i <= ActiveTabIndex && i < Tabs.Count; i++) {
                    if(!Tabs[i].Visible) counter--;
                }

                if(counter < 0)
                    return 0;

                return counter;
            }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeActiveTabIndexForClient() {
            return IsRenderingScript;
        }

        /// <summary>
        /// The first tab to show
        /// </summary>
        [DefaultValue(-1)]
        [Category("Behavior")]
        public virtual int ActiveTabIndex {
            get {
                if(_cachedActiveTabIndex > -1)
                    return _cachedActiveTabIndex;

                if(Tabs.Count == 0)
                    return -1;

                return _activeTabIndex;
            }
            set {
                if(value < -1)
                    throw new ArgumentOutOfRangeException("value");

                if(Tabs.Count == 0 && !_initialized) {
                    _cachedActiveTabIndex = value;
                    return;
                }

                if(ActiveTabIndex == value)
                    return;

                if(ActiveTabIndex != -1 && ActiveTabIndex < Tabs.Count)
                    Tabs[ActiveTabIndex].Active = false;

                if(value >= Tabs.Count) {
                    _activeTabIndex = Tabs.Count - 1;
                    _cachedActiveTabIndex = value;
                } else {
                    _activeTabIndex = value;
                    _cachedActiveTabIndex = -1;
                }

                if(ActiveTabIndex != -1 && ActiveTabIndex < Tabs.Count)
                    Tabs[ActiveTabIndex].Active = true;
            }
        }

        int LastActiveTabIndex {
            get { return (int)(ViewState["LastActiveTabIndex"] ?? -1); }
            set { ViewState["LastActiveTabIndex"] = value; }
        }

        /// <summary>
        /// A collection of tabs
        /// </summary>
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public TabPanelCollection Tabs {
            get { return (TabPanelCollection)Controls; }
        }

        /// <summary>
        /// The current active tab
        /// </summary>
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public TabPanel ActiveTab {
            get {
                var i = ActiveTabIndex;
                if(i < 0 || i >= Tabs.Count)
                    return null;

                EnsureActiveTab();
                return Tabs[i];
            }
            set {
                var i = Tabs.IndexOf(value);
                if(i < 0)
                    throw new ArgumentOutOfRangeException("value");

                ActiveTabIndex = i;
            }
        }

        /// <summary>
        /// Make an auto postback from JavaScript when a tab index changes
        /// </summary>
        [DefaultValue(false)]
        [Category("Behavior")]
        public bool AutoPostBack {
            get { return _autoPostBack; }
            set { _autoPostBack = value; }
        }

        /// <summary>
        /// Height of a tab body (does not include TabPanel headers)
        /// </summary>
        [DefaultValue(typeof(Unit), "")]
        [Category("Appearance")]
        public override Unit Height {
            get { return base.Height; }
            set {
                //if (!value.IsEmpty && value.Type != UnitType.Pixel)
                //{
                //    throw new ArgumentOutOfRangeException("value", "Height must be set in pixels only, or Empty.");
                //}
                base.Height = value;
            }
        }

        /// <summary>
        /// Width of the tab body
        /// </summary>
        [DefaultValue(typeof(Unit), "")]
        [Category("Appearance")]
        public override Unit Width {
            get { return base.Width; }
            set { base.Width = value; }
        }

        /// <summary>
        /// Gets or sets a CSS theme predefined in a CSS file
        /// </summary>        
        [DefaultValue(TabCssTheme.XP)]
        [Category("Appearance")]
        [ExtenderControlProperty]
        [ClientPropertyName("cssTheme")]
        public TabCssTheme CssTheme {
            get { return (TabCssTheme)(ViewState["CssTheme"] ?? TabCssTheme.XP); }
            set { ViewState["CssTheme"] = value; }
        }

        /// <summary>
        /// Determines whether or not to display scrollbars (None, Horizontal, Vertical, Both, Auto)
        /// in the TabContainer body
        /// </summary>
        [DefaultValue(ScrollBars.None)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("scrollBars")]
        public ScrollBars ScrollBars {
            get { return (ScrollBars)(ViewState["ScrollBars"] ?? ScrollBars.None); }
            set { ViewState["ScrollBars"] = value; }
        }

        /// <summary>
        /// Determines whether or not to render tabs on top of the container or below (Top, Bottom)
        /// </summary>
        [DefaultValue(TabStripPlacement.Top)]
        [Category("Appearance")]
        [ClientPropertyName("tabStripPlacement")]
        public TabStripPlacement TabStripPlacement {
            get { return _tabStripPlacement; }
            set { _tabStripPlacement = value; }
        }


        /// <summary>
        /// Fires on the client side when a tab is changed
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("activeTabChanged")]
        public string OnClientActiveTabChanged {
            get { return (string)(ViewState["OnClientActiveTabChanged"] ?? string.Empty); }
            set { ViewState["OnClientActiveTabChanged"] = value; }
        }

        /// <summary>
        /// AutoPostback ID
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("autoPostBackId")]
        public new string UniqueID {
            get { return base.UniqueID; }
            set { /* need to add a setter for serialization to work properly.*/ }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeUniqueID() {
            return IsRenderingScript && AutoPostBack;
        }

        /// <summary>
        /// Determines whether or not to render tabs on the left or right side of the container
        /// </summary>
        [Description("Change tab header placement vertically when value set to true")]
        [DefaultValue(false)]
        [Category("Appearance")]
        [ClientPropertyName("useVerticalStripPlacement")]
        public bool UseVerticalStripPlacement {
            get { return _useVerticalStripPlacement; }
            set { _useVerticalStripPlacement = value; }
        }

        /// <summary>
        /// Width of tab panels when tabs are displayed vertically
        /// </summary>
        [Description("Set width of tab strips when UseVerticalStripPlacement is set to true. Size must be in pixel")]
        [DefaultValue(typeof(Unit), "120px")]
        [Category("Appearance")]
        public Unit VerticalStripWidth {
            get { return _verticalStripWidth; }
            set {
                if(!value.IsEmpty && value.Type != UnitType.Pixel)
                    throw new ArgumentOutOfRangeException("value", "VerticalStripWidth must be set in pixels only, or Empty.");

                _verticalStripWidth = value;
            }
        }

        /// <summary>
        /// Determines whether or not to render/load precise tabs on demand or all tabs on page load
        /// </summary>
        [DefaultValue(false)]
        [Category("Behavior")]
        [ClientPropertyName("onDemand")]
        public bool OnDemand {
            get { return _onDemand; }
            set { _onDemand = value; }
        }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);

            Page.RegisterRequiresControlState(this);
            _initialized = true;

            if(_cachedActiveTabIndex > -1) {
                ActiveTabIndex = _cachedActiveTabIndex;
                if(ActiveTabIndex < Tabs.Count)
                    Tabs[ActiveTabIndex].Active = true;
            } else if(Tabs.Count > 0) {
                ActiveTabIndex = 0;
            }
        }

        protected virtual void OnActiveTabChanged(EventArgs e) {
            var eh = Events[EventActiveTabChanged] as EventHandler;
            if(eh != null)
                eh(this, e);
        }

        protected override void AddParsedSubObject(object obj) {
            var objTabPanel = obj as TabPanel;
            if(null != objTabPanel) {
                Controls.Add(objTabPanel);
            } else if(!(obj is LiteralControl)) {
                throw new HttpException(string.Format(CultureInfo.CurrentCulture, "TabContainer cannot have children of type '{0}'.", obj.GetType()));
            }
        }

        protected override void AddedControl(Control control, int index) {
            ((TabPanel)control).SetOwner(this);
            base.AddedControl(control, index);
        }

        protected override void RemovedControl(Control control) {
            var controlTabPanel = control as TabPanel;
            if(control != null && controlTabPanel.Active && ActiveTabIndex < Tabs.Count)
                EnsureActiveTab();

            controlTabPanel.SetOwner(null);
            base.RemovedControl(control);
        }

        protected override ControlCollection CreateControlCollection() {
            return new TabPanelCollection(this);
        }

        protected override Style CreateControlStyle() {
            var style = new TabContainerStyle(ViewState);
            style.CssClass = CssClass;
            return style;
        }

        int GetServerActiveTabIndex(int clientActiveTabIndex) {
            int counter = -1;
            int result = clientActiveTabIndex;
            for(int i = 0; i < Tabs.Count; i++) {
                if(Tabs[i].Visible) counter++;
                if(counter == clientActiveTabIndex) {
                    result = i;
                    break;
                }
            }
            return result;
        }

        protected override void LoadClientState(string clientState) {
            var state = (Dictionary<string, object>)new JavaScriptSerializer().DeserializeObject(clientState);
            if(state != null) {
                ActiveTabIndex = (int)state["ActiveTabIndex"];
                ActiveTabIndex = GetServerActiveTabIndex(ActiveTabIndex);

                object[] tabEnabledState = (object[])state["TabEnabledState"];
                object[] tabWasLoadedOnceState = (object[])state["TabWasLoadedOnceState"];
                for(int i = 0; i < tabEnabledState.Length; i++) {
                    int j = GetServerActiveTabIndex(i);
                    if(j < Tabs.Count) {
                        Tabs[j].Enabled = (bool)tabEnabledState[i];
                        Tabs[j].WasLoadedOnce = (bool)tabWasLoadedOnceState[i];
                    }
                }
            }
        }

        protected override string SaveClientState() {
            var state = new Dictionary<string, object>();
            state["ActiveTabIndex"] = ActiveTabIndex;

            var tabEnabledState = new List<object>();
            var tabWasLoadedOnceState = new List<object>();

            foreach(TabPanel tab in Tabs) {
                tabEnabledState.Add(tab.Enabled);
                tabWasLoadedOnceState.Add(tab.WasLoadedOnce);
            }
            state["TabEnabledState"] = tabEnabledState;
            state["TabWasLoadedOnceState"] = tabWasLoadedOnceState;
            return new JavaScriptSerializer().Serialize(state);
        }

        protected override void LoadControlState(object savedState) {
            var pair = (Pair)savedState;
            if(pair != null) {
                base.LoadControlState(pair.First);
                ActiveTabIndex = (int)pair.Second;
            } else {
                base.LoadControlState(null);
            }
        }

        protected override object SaveControlState() {
            // Saving last active tab index
            this.LastActiveTabIndex = this.ActiveTabIndex;

            var pair = new Pair();
            pair.First = base.SaveControlState();
            pair.Second = ActiveTabIndex;
            if(pair.First == null && pair.Second == null)
                return null;

            return pair;
        }

        protected override void AddAttributesToRender(HtmlTextWriter writer) {
            Style.Remove(HtmlTextWriterStyle.Visibility);

            if(!ControlStyleCreated && !String.IsNullOrWhiteSpace(CssClass))
                writer.AddAttribute(HtmlTextWriterAttribute.Class, CssClass);

            if(_useVerticalStripPlacement)
                writer.AddStyleAttribute(HtmlTextWriterStyle.Display, "block");

            if(!Height.IsEmpty && Height.Type == UnitType.Percentage)
                writer.AddStyleAttribute(HtmlTextWriterStyle.Height, Height.ToString());

            base.AddAttributesToRender(writer);
            writer.AddStyleAttribute(HtmlTextWriterStyle.Visibility, "hidden");
        }

        protected override void RenderContents(HtmlTextWriter writer) {
            //base.Render(writer);
            Page.VerifyRenderingInServerForm(this);

            if(_tabStripPlacement == TabStripPlacement.Top
                || _tabStripPlacement == TabStripPlacement.TopRight
                || (_tabStripPlacement == TabStripPlacement.Bottom && _useVerticalStripPlacement)
                || (_tabStripPlacement == TabStripPlacement.BottomRight && _useVerticalStripPlacement)
                )
                RenderHeader(writer);

            if(!Height.IsEmpty)
                writer.AddStyleAttribute(HtmlTextWriterStyle.Height, Height.ToString());

            writer.AddAttribute(HtmlTextWriterAttribute.Id, ClientID + "_body");
            writer.AddAttribute(HtmlTextWriterAttribute.Class, "ajax__tab_body" + GetSuffixTabStripPlacementCss());
            writer.AddStyleAttribute(HtmlTextWriterStyle.Display, "block");
            writer.RenderBeginTag(HtmlTextWriterTag.Div);
            RenderChildren(writer);
            writer.RenderEndTag();

            if((_tabStripPlacement == TabStripPlacement.Bottom && !_useVerticalStripPlacement) || _tabStripPlacement == TabStripPlacement.BottomRight && !_useVerticalStripPlacement)
                RenderHeader(writer);
        }

        protected virtual void RenderHeader(HtmlTextWriter writer) {
            writer.AddAttribute(HtmlTextWriterAttribute.Id, ClientID + "_header");
            writer.AddAttribute(HtmlTextWriterAttribute.Class, "ajax__tab_header" + GetSuffixTabStripPlacementCss());
            if(_tabStripPlacement == TabStripPlacement.BottomRight ||
                _tabStripPlacement == TabStripPlacement.TopRight)
                writer.AddStyleAttribute(HtmlTextWriterStyle.Direction, "rtl");

            if(_useVerticalStripPlacement) {
                writer.AddStyleAttribute(HtmlTextWriterStyle.Display, "block");
                if(_tabStripPlacement == TabStripPlacement.Bottom || _tabStripPlacement == TabStripPlacement.Top)
                    writer.AddAttribute(HtmlTextWriterAttribute.Style, "float:left");
                else
                    writer.AddAttribute(HtmlTextWriterAttribute.Style, "float:right");

                writer.AddStyleAttribute(HtmlTextWriterStyle.Width, _verticalStripWidth.ToString());
            }

            writer.RenderBeginTag(HtmlTextWriterTag.Div);

            if(_tabStripPlacement == TabStripPlacement.Bottom || _tabStripPlacement == TabStripPlacement.BottomRight)
                RenderSpannerForVerticalTabs(writer);

            if(!_useVerticalStripPlacement &&
                (_tabStripPlacement == TabStripPlacement.BottomRight
                || _tabStripPlacement == TabStripPlacement.TopRight)) {
                // reverse tab order placement
                var tabs = Tabs.Count;
                for(int i = tabs - 1; i >= 0; i--) {
                    var panel = Tabs[i];
                    if(panel.Visible)
                        panel.RenderHeader(writer);
                }
            } else {
                foreach(TabPanel panel in Tabs) {
                    if(panel.Visible)
                        panel.RenderHeader(writer);
                }
            }

            if(_tabStripPlacement == TabStripPlacement.Top || _tabStripPlacement == TabStripPlacement.TopRight)
                RenderSpannerForVerticalTabs(writer);

            writer.RenderEndTag();
        }

        void RenderSpannerForVerticalTabs(HtmlTextWriter writer) {
            if(!_useVerticalStripPlacement)
                return;

            writer.AddAttribute(HtmlTextWriterAttribute.Id, ClientID + "_headerSpannerHeight");
            writer.AddStyleAttribute(HtmlTextWriterStyle.Display, "block");
            writer.RenderBeginTag(HtmlTextWriterTag.Div);
            writer.RenderEndTag();
        }

        string GetSuffixTabStripPlacementCss() {
            var tabStripPlacementCss = "";
            if(_useVerticalStripPlacement) {
                tabStripPlacementCss += "_vertical";
                switch(_tabStripPlacement) {
                    case TabStripPlacement.Top:
                    case TabStripPlacement.Bottom:
                        tabStripPlacementCss += "left";
                        break;
                    case TabStripPlacement.TopRight:
                    case TabStripPlacement.BottomRight:
                        tabStripPlacementCss += "right";
                        break;
                }
            } else {
                switch(_tabStripPlacement) {
                    case TabStripPlacement.Bottom:
                    case TabStripPlacement.BottomRight:
                        tabStripPlacementCss = "_bottom";
                        break;
                }
            }
            return tabStripPlacementCss;
        }

        protected override bool LoadPostData(string postDataKey, NameValueCollection postCollection) {
            int tabIndex = ActiveTabIndex;
            bool result = base.LoadPostData(postDataKey, postCollection);
            if(ActiveTabIndex == 0 || tabIndex != ActiveTabIndex)
                return true;

            return result;
        }

        protected override void RaisePostDataChangedEvent() {
            // If the tab index changed
            if(LastActiveTabIndex == ActiveTabIndex)
                return;
            // Saving last active tab index
            LastActiveTabIndex = ActiveTabIndex;

            // The event fires only when the new active tab exists and has OnDemandMode = Always or
            // when OnDemandMode = Once and tab wasn't loaded yet
            var activeTab = this.ActiveTab;
            if(activeTab != null && (activeTab.OnDemandMode == OnDemandMode.Always || activeTab.OnDemandMode == OnDemandMode.Once && !activeTab.WasLoadedOnce))
                OnActiveTabChanged(EventArgs.Empty);
        }

        void EnsureActiveTab() {
            if(_activeTabIndex < 0 || _activeTabIndex >= Tabs.Count)
                _activeTabIndex = 0;

            for(int i = 0; i < Tabs.Count; i++) {
                Tabs[i].Active = i == ActiveTabIndex;
            }
        }

        public void ResetLoadedOnceTabs() {
            foreach(TabPanel tab in this.Tabs) {
                if(tab.OnDemandMode == OnDemandMode.Once && tab.WasLoadedOnce)
                    tab.WasLoadedOnce = false;
            }
        }

        sealed class TabContainerStyle : Style {

            public TabContainerStyle(StateBag state)
                : base(state) {
            }

            protected override void FillStyleAttributes(CssStyleCollection attributes, IUrlResolutionService urlResolver) {
                base.FillStyleAttributes(attributes, urlResolver);

                attributes.Remove(HtmlTextWriterStyle.Height);
                // commented below line to fix the issue #25821
                //attributes.Remove(HtmlTextWriterStyle.BackgroundColor);
                attributes.Remove(HtmlTextWriterStyle.BackgroundImage);
            }
        }

        void IPostBackEventHandler.RaisePostBackEvent(string eventArgument) {
            if(eventArgument.StartsWith("activeTabChanged", StringComparison.Ordinal)) {
                // change the active tab.
                //
                int parseIndex = eventArgument.IndexOf(":", StringComparison.Ordinal);
                Debug.Assert(parseIndex != -1, "Expected new active tab index!");
                if(parseIndex != -1 && Int32.TryParse(eventArgument.Substring(parseIndex + 1), out parseIndex)) {
                    parseIndex = GetServerActiveTabIndex(parseIndex);
                    if(parseIndex != ActiveTabIndex) {
                        ActiveTabIndex = parseIndex;
                        OnActiveTabChanged(EventArgs.Empty);
                    }
                }
            }
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            descriptor.AddProperty("tabStripPlacement", this.TabStripPlacement);
            descriptor.AddProperty("useVerticalStripPlacement", this.UseVerticalStripPlacement);
            descriptor.AddProperty("onDemand", this.OnDemand);
        }
    }
}

#pragma warning restore 1591