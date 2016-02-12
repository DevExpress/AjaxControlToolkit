#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.Globalization;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// The Accordion control represents a series of panes that can be viewed
    /// one at a time.  The control is used to create "strongly typed" access
    /// to the AccordionBehavior.  Its major purpose is to structure the content
    /// in a way that the AccordionBehavior can understand it. 
    /// </summary>
    [Designer(typeof(AccordionDesigner))]
    [ToolboxData("<{0}:Accordion runat=server></{0}:Accordion>")]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.AccordionName + Constants.IconPostfix)]
    public class Accordion : WebControl {
        // ViewState key for tracking the number of panes in the Accordion
        internal const string ItemCountViewStateKey = "_!ItemCount";

        /// <summary>
        /// An event to raise when an item (i.e. Pane's Header or Content) is created during data binding
        /// </summary>
        public event EventHandler<AccordionItemEventArgs> ItemCreated;

        /// <summary>
        /// An event to raise when an item (i.e. Pane's Header or Content) is data bound
        /// </summary>
        public event EventHandler<AccordionItemEventArgs> ItemDataBound;

        /// <summary>
        /// An event to raise when a command is fired
        /// </summary>
        public event CommandEventHandler ItemCommand;

        // AccordionExtender to attach
        AccordionExtender _extender;
        
        // The Accordion's child panes
        AccordionPaneCollection _panes;

        #region DataBinding Fields

        // DataSource to bind the Accordion to
        object _dataSource;

        // DataBinding template for the header
        ITemplate _headerTemplate;

        // DataBinding template for the content
        ITemplate _contentTemplate;

        // Whether or not the control has been initialized
        bool _initialized;

        // Whether the page's PreLoad event has already fired
        bool _pagePreLoadFired;

        // Whether or not the Accordion needs to be databound but hasn't been yet
        bool _requiresDataBinding;

        // Flag to determine if we should throw an exception when a data property
        // (i.e. DataSource, DataSourceID, DataMember) is changed
        bool _throwOnDataPropertyChange;

        // View of the the data provided by the data property
        DataSourceView _currentView;

        // Whether the current DataSourceView was loaded from a DataSourceID
        bool _currentViewIsFromDataSourceID;

        // Whether the current DataSourceView contains valid data
        bool _currentViewValid;

        // Arguments used to sort, filter, etc., the data when creating
        // the DataSourceView (although we will use the default whenever possible)
        DataSourceSelectArguments _arguments;

        // Enumerable list of data items obtained from the DataSource
        IEnumerable _selectResult;

        // Thread synchronization event used for obtaining data from the DataSource
        EventWaitHandle _selectWait;

        #endregion

        // Default constructor that tells ASP.NET to render it as a DIV
        public Accordion()
            : base(HtmlTextWriterTag.Div) {
        }

        // Reference to the AccordionExtender wrapped by the Accordion control.
        // This will be referenced in CreateChildControls so that the extender
        // will always be created by any calls to EnsureChildControls.
        AccordionExtender AccordionExtender {
            get {
                if(_extender == null) {
                    // Create the extender
                    _extender = new AccordionExtender();
                    _extender.ID = ID + "_AccordionExtender";
                    _extender.TargetControlID = ID;
                    Controls.AddAt(0, _extender);
                }
                return _extender;
            }
        }

        /// <summary>
        /// Length of the transition animation in milliseconds. The default is 500
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Length of the transition animation in milliseconds")]
        [DefaultValue(500)]
        public int TransitionDuration {
            get { return AccordionExtender.TransitionDuration; }
            set { AccordionExtender.TransitionDuration = value; }
        }

        /// <summary>
        /// The number of frames per second used in animation effects' transition. 
        /// This is used to tune performance when using FadeTransition, 
        /// a large number of Accordion Panes, etc. 
        /// The default is 30.
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Number of frames per second used in the transition animation")]
        [DefaultValue(30)]
        public int FramesPerSecond {
            get { return AccordionExtender.FramesPerSecond; }
            set { AccordionExtender.FramesPerSecond = value; }
        }

        /// <summary>
        /// Whether or not to use a fade effect when transitioning between selected
        /// Accordion Panes. The default is false
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Whether or not to use a fade effect in the transition animations")]
        [DefaultValue(false)]
        public bool FadeTransitions {
            get { return AccordionExtender.FadeTransitions; }
            set { AccordionExtender.FadeTransitions = value; }
        }

        /// <summary>
        /// The default Header CSS class
        /// </summary>
        [Browsable(true)]
        [Category("Appearance")]
        [Description("Default CSS class for Accordion Pane Headers")]
        public string HeaderCssClass {
            get { return AccordionExtender.HeaderCssClass; }
            set { AccordionExtender.HeaderCssClass = value; }
        }

        /// <summary>
        /// The default selected Header CSS Class
        /// </summary>
        [Browsable(true)]
        [Category("Appearance")]
        [Description("Default CSS class for the selected Accordion Pane Headers")]
        public string HeaderSelectedCssClass {
            get { return AccordionExtender.HeaderSelectedCssClass; }
            set { AccordionExtender.HeaderSelectedCssClass = value; }
        }

        /// <summary>
        /// The default Content CSS class
        /// </summary>
        [Browsable(true)]
        [Category("Appearance")]
        [Description("Default CSS class for Accordion Pane Content")]
        public string ContentCssClass {
            get { return AccordionExtender.ContentCssClass; }
            set { AccordionExtender.ContentCssClass = value; }
        }

        /// <summary> 
        /// Determines how to controll resizing of the Accordion.
        /// If it is set to None, then the Accordion can grow as large or as small as necessary. 
        /// If it is set to Limit, then the Accordion will always be less than or equal to its Height. 
        /// If it is set to Fill then it will always be equal to its height. 
        /// The default is None.
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Determine how the growth of the Accordion will be controlled")]
        [DefaultValue(AutoSize.None)]
        public AutoSize AutoSize {
            get { return AccordionExtender.AutoSize; }
            set { AccordionExtender.AutoSize = value; }
        }

        /// <summary>
        /// Index of the AccordionPane to be displayed
        /// (this property must be set before OnPreRender). The default is 0
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Index of the AccordionPane to be displayed")]
        [DefaultValue(0)]
        public int SelectedIndex {
            get { return AccordionExtender.SelectedIndex; }
            set { AccordionExtender.SelectedIndex = value; }
        }

        /// <summary>
        /// Whether or not clicking the header will close the currently opened pane (leaving
        /// all the Accordion's panes closed). The default is true
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Whether or not clicking the header will close the currently opened pane (leaving all the Accordion's panes closed)")]
        [DefaultValue(true)]
        public bool RequireOpenedPane {
            get { return AccordionExtender.RequireOpenedPane; }
            set { AccordionExtender.RequireOpenedPane = value; }
        }

        /// <summary> 
        /// Whether or not we suppress the client-side click handlers of any elements (including server
        /// controls like Button or HTML elements like anchor) in the header sections of the Accordion.
        /// The default is false
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Whether or not we suppress the client-side click handlers of any elements in the header sections")]
        [DefaultValue(false)]
        public bool SuppressHeaderPostbacks {
            get { return AccordionExtender.SuppressHeaderPostbacks; }
            set { AccordionExtender.SuppressHeaderPostbacks = value; }
        }

        /// <summary> 
        /// A collection of child panes in the Accordion
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        public AccordionPaneCollection Panes {
            get {
                if(_panes == null)
                    _panes = new AccordionPaneCollection(this);
                return _panes;
            }
        }

        
        /// <summary>
        /// Prevent the Controls property from appearing in the editor (so
        /// that people will use the Panes collection instead)
        /// </summary>
        [EditorBrowsable(EditorBrowsableState.Never)]
        public override ControlCollection Controls {
            get { return base.Controls; }
        }

        #region DataBinding Properties

        /// <summary>
        /// A template for the Header of databound panes
        /// </summary>
        [Browsable(false)]
        [DefaultValue(null)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(AccordionContentPanel))]
        public virtual ITemplate HeaderTemplate {
            get { return _headerTemplate; }
            set { _headerTemplate = value; }
        }

        /// <summary>
        /// A template for the content of databound panes
        /// </summary>
        [Browsable(false)]
        [DefaultValue(null)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(AccordionContentPanel))]
        public virtual ITemplate ContentTemplate {
            get { return _contentTemplate; }
            set { _contentTemplate = value; }
        }

        /// <summary>
        /// The data source that provides data for populating 
        /// the list of AccordionPanes
        /// </summary>
        [Bindable(true)]
        [Category("Data")]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public virtual object DataSource {
            get { return _dataSource; }
            set {
                if((value == null) || (value is IListSource) || (value is IEnumerable)) {
                    _dataSource = value;
                    OnDataPropertyChanged();
                } else {
                    throw new ArgumentException("Can't bind to value that is not an IListSource or an IEnumerable.");
                }
            }
        }

        
        /// <summary>
        /// The ID of the DataControl that this control should use to retrieve its data source. 
        /// When the control is bound to a DataControl, it can retrieve a data source instance on demand,
        /// and thereby attempt to work in auto-DataBind mode.
        /// </summary>
        [DefaultValue("")]
        [IDReferenceProperty(typeof(DataSourceControl))]
        [Category("Data")]
        public virtual string DataSourceID {
            get { return ViewState["DataSourceID"] as string ?? String.Empty; }
            set {
                ViewState["DataSourceID"] = value;
                OnDataPropertyChanged();
            }
        }

        /// <summary>
        /// A member in the DataSource to bind to
        /// </summary>
        [DefaultValue("")]
        [Category("Data")]
        public virtual string DataMember {
            get { return ViewState["DataMember"] as string ?? String.Empty; }
            set {
                ViewState["DataMember"] = value;
                OnDataPropertyChanged();
            }
        }

        // Whether or not the Accordion was databound using the DataSourceID
        // property rather than setting the DataSource directly
        protected bool IsBoundUsingDataSourceID {
            get { return !String.IsNullOrEmpty(DataSourceID); }
        }

        // Whether or not the control has already been databound, or still needs
        // to be databound
        protected bool RequiresDataBinding {
            get { return _requiresDataBinding; }
            set { _requiresDataBinding = value; }
        }

        // Arguments used to request data-related operations from
        // data source controls when data is retrieved
        protected DataSourceSelectArguments SelectArguments {
            get {
                if(_arguments == null)
                    _arguments = CreateDataSourceSelectArguments();
                return _arguments;
            }
        }

        #endregion

        //OnInit handler to wireup the Page's PreLoad event
        protected override void OnInit(EventArgs e) {
            base.OnInit(e);

            if(Page != null) {
                Page.PreLoad += new EventHandler(this.OnPagePreLoad);
                if(!IsViewStateEnabled && Page.IsPostBack)
                    RequiresDataBinding = true;
            }
        }

        // OnPreLoad is used to determine whether or not we still need to databind the Accordion
        void OnPagePreLoad(object sender, EventArgs e) {
            _initialized = true;

            if(Page != null) {
                Page.PreLoad -= new EventHandler(this.OnPagePreLoad);

                // Setting RequiresDataBinding to true in OnLoad is too late because the OnLoad page event
                // happens before the control.OnLoad method gets called.  So a page_load handler on the page
                // that calls DataBind won't prevent DataBind from getting called again in PreRender.
                if(!Page.IsPostBack)
                    RequiresDataBinding = true;

                // If this is a postback and viewstate is enabled, but we have never bound the control
                // before, it is probably because its visibility was changed in the postback.  In this
                // case, we need to bind the control or it will never appear.  This is a common scenario
                // for Wizard and MultiView.
                if(Page.IsPostBack && IsViewStateEnabled && ViewState[ItemCountViewStateKey] == null)
                    RequiresDataBinding = true;

                _pagePreLoadFired = true;
            }

            EnsureChildControls();
        }

        // Connect to the DataSourceView and determine if we still need to
        // do databinding
        protected override void OnLoad(EventArgs e) {
            _initialized = true; // just in case we were added to the page after PreLoad
            ConnectToDataSourceView();
            if(Page != null && !_pagePreLoadFired && ViewState[ItemCountViewStateKey] == null) {
                // If the control was added after PagePreLoad, we still need to databind it because it missed its
                // first change in PagePreLoad.  If this control was created by a call to a parent control's DataBind
                // in Page_Load (with is relatively common), this control will already have been databound even
                // though pagePreLoad never fired and the page isn't a postback.
                if(!Page.IsPostBack) {
                    RequiresDataBinding = true;
                }
                    // If the control was added to the page after page.PreLoad, we'll never get the event and we'll
                    // never databind the control.  So if we're catching up and Load happens but PreLoad never happened,
                    // call DataBind.  This may make the control get databound twice if the user called DataBind on the control
                    // directly in Page.OnLoad, but better to bind twice than never to bind at all.
                else if(IsViewStateEnabled) {
                    RequiresDataBinding = true;
                }
            }

            base.OnLoad(e);
        }

        // Create the AccordionExtender and attach it to the div
        // that will be generated for this control
        protected override void CreateChildControls() {
            base.CreateChildControls();

            // If we already have items in the ViewState, create the control
            // hierarchy using the view state (and not the datasource)
            if(AccordionExtender != null && ViewState[ItemCountViewStateKey] != null)
                CreateControlHierarchy(false);

            ClearChildViewState();

            // Ensure creation of child controls
            foreach(var pane in Panes) {
                ControlCollection controls = pane.Controls;
            }
        }

        // Mark the selected AccordionPane so it does not appear collapsed 
        protected override void OnPreRender(EventArgs e) {
            EnsureDataBound();
            base.OnPreRender(e);

            // Set the overflow to hidden to prevent any growth from
            // showing initially before it is hidden by the script if
            // we are controlling the height
            if(AutoSize != AutoSize.None) {
                Style[HtmlTextWriterStyle.Overflow] = "hidden";
                Style[HtmlTextWriterStyle.OverflowX] = "auto";
            }

            // Apply the standard header/content styles, but allow the
            // pane's styles to take precedent
            foreach(var pane in Panes) {
                if(pane.HeaderCssClass == HeaderSelectedCssClass)
                    pane.HeaderCssClass = String.Empty;
                if(!String.IsNullOrEmpty(HeaderCssClass) && String.IsNullOrEmpty(pane.HeaderCssClass))
                    pane.HeaderCssClass = HeaderCssClass;
                if(!String.IsNullOrEmpty(ContentCssClass) && String.IsNullOrEmpty(pane.ContentCssClass))
                    pane.ContentCssClass = ContentCssClass;
            }

            // Get the index of the selected pane, or use the first pane if we don't
            // have a valid index and require one.  (Note: We don't reset the SelectedIndex
            // property because it may refer to a pane that will be added dynamically on the
            // client.  If we need to start with a pane visible, then we'll open the first
            // pane because that's the default value used on the client as the SelectedIndex
            // in this scenario.)
            var index = AccordionExtender.SelectedIndex;
            index = ((index < 0 || index >= Panes.Count) && AccordionExtender.RequireOpenedPane) ? 0 : index;

            // Make sure the selected pane is displayed
            if(index >= 0 && index < Panes.Count) {
                var content = Panes[index].ContentContainer;
                if(content != null)
                    content.Collapsed = false;

                // Set the CSS class for the open panes header
                if(!String.IsNullOrEmpty(HeaderSelectedCssClass))
                    Panes[index].HeaderCssClass = HeaderSelectedCssClass;
            }
        }

        
        /// <summary>
        /// Override FindControl to look first at this control, then check each
        /// of its child AccordionPanes for the control
        /// </summary>
        /// <param name="id" type="String">ID of the control to find</param>
        /// <returns></returns>
        public override Control FindControl(string id) {
            var ctrl = base.FindControl(id);
            if(ctrl == null)
                foreach(var pane in Panes) {
                    ctrl = pane.FindControl(id);
                    if(ctrl != null)
                        break;
                }
            return ctrl;
        }

        //Empty out the child Pane's collection 
        internal void ClearPanes() {
            for(var i = Controls.Count - 1; i >= 0; i--)
                if(Controls[i] is AccordionPane)
                    Controls.RemoveAt(i);
        }

        #region DataBinding

        // Connects this data bound control to the appropriate DataSourceView
        // and hooks up the appropriate event listener for the
        // DataSourceViewChanged event. The return value is the new view (if
        // any) that was connected to. An exception is thrown if there is
        // a problem finding the requested view or data source.
        DataSourceView ConnectToDataSourceView() {
            // If the current view is correct, there is no need to reconnect
            if(_currentViewValid && !DesignMode)
                return _currentView;

            // Disconnect from old view, if necessary
            if((_currentView != null) && (_currentViewIsFromDataSourceID)) {
                // We only care about this event if we are bound through the DataSourceID property
                _currentView.DataSourceViewChanged -= new EventHandler(OnDataSourceViewChanged);
            }

            // Connect to new view
            IDataSource ds = null;
            var dataSourceID = DataSourceID;

            if(!String.IsNullOrEmpty(dataSourceID)) {
                // Try to find a DataSource control with the ID specified in DataSourceID
                var control = NamingContainer.FindControl(dataSourceID);
                if(control == null)
                    throw new HttpException(String.Format(CultureInfo.CurrentCulture, "DataSource '{1}' for control '{0}' doesn't exist", ID, dataSourceID));
                ds = control as IDataSource;
                if(ds == null)
                    throw new HttpException(String.Format(CultureInfo.CurrentCulture, "'{1}' is not a data source for control '{0}'.", ID, dataSourceID));
            }

            if(ds == null)
                // DataSource control was not found, construct a temporary data source to wrap the data
                return null;
            else
                // Ensure that both DataSourceID as well as DataSource are not set at the same time
                if(DataSource != null)
                    throw new InvalidOperationException("DataSourceID and DataSource can't be set at the same time.");


            // IDataSource was found, extract the appropriate view and return it
            var newView = ds.GetView(DataMember);
            if(newView == null)
                throw new InvalidOperationException(String.Format(CultureInfo.CurrentCulture, "DataSourceView not found for control '{0}'", ID));

            _currentViewIsFromDataSourceID = IsBoundUsingDataSourceID;
            _currentView = newView;
            // If we're bound through the DataSourceID proeprty, then we care about this event
            if((_currentView != null) && (_currentViewIsFromDataSourceID))
                _currentView.DataSourceViewChanged += new EventHandler(OnDataSourceViewChanged);
            _currentViewValid = true;

            return _currentView;
        }

        /// <summary>
        /// Bind the Accordion to its DataSource
        /// </summary>
        public override void DataBind() {
            // Don't databind to a data source control when the control is in the designer but not top-level
            if(IsBoundUsingDataSourceID && DesignMode && (Site == null))
                return;

            // do our own databinding
            RequiresDataBinding = false;
            OnDataBinding(EventArgs.Empty);
        }

        // DataBind the Accordion to its panes
        protected override void OnDataBinding(EventArgs e) {
            base.OnDataBinding(e);

            //Only bind if the control has the DataSource or DataSourceID set
            if(this.DataSource != null || IsBoundUsingDataSourceID) {
                // reset the control state
                ClearPanes();
                ClearChildViewState();

                // and then create the control hierarchy using the datasource
                CreateControlHierarchy(true);
                ChildControlsCreated = true;
            }
        }

        // Create the new control hierarchy of AccordionPanes
        // (using the DataSource if specificed)
        protected virtual void CreateControlHierarchy(bool useDataSource) {
            var count = -1;
            IEnumerable dataSource = null;
            var itemsArray = new List<AccordionPane>();

            if(!useDataSource) {
                var viewCount = ViewState[ItemCountViewStateKey];

                // ViewState must have a non-null value for ItemCount because we check for
                // this in CreateChildControls
                if(viewCount != null) {
                    count = (int)viewCount;
                    if(count != -1) {
                        var dummyList = new List<object>(count);
                        for(var i = 0; i < count; i++)
                            dummyList.Add(null);
                        dataSource = dummyList;
                        itemsArray.Capacity = count;
                    }
                }
            } else {
                dataSource = GetData();
                count = 0;
                var collection = dataSource as ICollection;
                if(collection != null)
                    itemsArray.Capacity = collection.Count;
            }

            if(dataSource != null) {
                var index = 0;
                foreach(var dataItem in dataSource) {
                    var ap = new AccordionPane();
                    ap.ID = String.Format(System.Globalization.CultureInfo.InvariantCulture, "{0}_Pane_{1}", ID, index.ToString(CultureInfo.InvariantCulture));

                    Controls.Add(ap);

                    CreateItem(dataItem, index, AccordionItemType.Header, ap.HeaderContainer, HeaderTemplate, useDataSource);
                    CreateItem(dataItem, index, AccordionItemType.Content, ap.ContentContainer, ContentTemplate, useDataSource);

                    itemsArray.Add(ap);

                    count++;
                    index++;
                }
            }

            // If we're binding, save the number of items contained in the repeater for use in round-trips
            if(useDataSource)
                ViewState[ItemCountViewStateKey] = ((dataSource != null) ? count : -1);
        }

        // Create an AccordionPane's item (either Header or Content) and raise the ItemCreated event
        void CreateItem(object dataItem, int index, AccordionItemType itemType, AccordionContentPanel container, ITemplate template, bool dataBind) {

            if(template == null)
                return;

            var itemArgs = new AccordionItemEventArgs(container, itemType);
            OnItemCreated(itemArgs);

            container.SetDataItemProperties(dataItem, index, itemType);
            template.InstantiateIn(container);

            if(dataBind) {
                container.DataBind();
                OnItemDataBound(itemArgs);
            }
        }

        // Ensure that the Accordion has been databound if it needed to be
        protected void EnsureDataBound() {
            try {
                _throwOnDataPropertyChange = true;
                if(RequiresDataBinding && !String.IsNullOrEmpty(DataSourceID))
                    DataBind();
            } finally {
                _throwOnDataPropertyChange = false;
            }
        }

        // Returns an IEnumerable that is the DataSource, which either came
        // from the DataSource property or from the control bound via the
        // DataSourceID property.
        protected virtual IEnumerable GetData() {
            _selectResult = null;
            var view = ConnectToDataSourceView();
            if(view != null) {
                Debug.Assert(_currentViewValid);

                // create a handle here to make sure this is a synchronous operation.
                _selectWait = new EventWaitHandle(false, EventResetMode.AutoReset);
                view.Select(SelectArguments, new DataSourceViewSelectCallback(DoSelect));
                _selectWait.WaitOne();

            } else if(DataSource != null)
                _selectResult = DataSource as IEnumerable;

            return _selectResult;
        }

        // Create the DataSourceSelectArguments (which just defaults to the Empty value
        // because we don't want to sort, filter, etc.)
        protected virtual DataSourceSelectArguments CreateDataSourceSelectArguments() {
            return DataSourceSelectArguments.Empty;
        }

        // Select the data
        void DoSelect(IEnumerable data) {
            _selectResult = data;
            _selectWait.Set();
        }

        // Wrap the CommandArgs of an ItemCommand event with AccordionCommandEventArgs        
        // returns whether the event was handled
        protected override bool OnBubbleEvent(object source, EventArgs args) {
            var handled = false;
            var accordionArgs = args as AccordionCommandEventArgs;
            if(accordionArgs != null) {
                OnItemCommand(accordionArgs);
                handled = true;
            }
            return handled;
        }

        // This method is called when DataMember, DataSource, or DataSourceID is changed.
        protected virtual void OnDataPropertyChanged() {
            if(_throwOnDataPropertyChange)
                throw new HttpException("Invalid data property change");
            if(_initialized)
                RequiresDataBinding = true;
            _currentViewValid = false;
        }

        // Indicate that we need to be databound whenever the DataSourceView changes
        protected virtual void OnDataSourceViewChanged(object sender, EventArgs args) {
            RequiresDataBinding = true;
        }

        protected virtual void OnItemCommand(AccordionCommandEventArgs args) {
            if(ItemCommand != null)
                ItemCommand(this, args);
        }

        protected virtual void OnItemCreated(AccordionItemEventArgs args) {
            if(ItemCreated != null)
                ItemCreated(this, args);
        }

        protected virtual void OnItemDataBound(AccordionItemEventArgs args) {
            if(ItemDataBound != null)
                ItemDataBound(this, args);
        }

        #endregion
    }

}
#pragma warning restore 1591