

using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit
{
    /// <summary>
    /// The Accordion control represents a series of panes that can be viewed
    /// one at a time.  The control is used to create "strongly typed" access
    /// to the AccordionBehavior.  Its major purpose is to structure the content
    /// in a way that the AccordionBehavior can understand it. 
    /// </summary>
    [ParseChildren(true)]
    [PersistChildren(false)]
    [Designer("AjaxControlToolkit.AccordionDesigner, AjaxControlToolkit")]
    [ToolboxData("<{0}:Accordion runat=server></{0}:Accordion>")]
    [System.Drawing.ToolboxBitmap(typeof(Accordion), "Accordion.Accordion.ico")]
    public class Accordion : WebControl
    {
        /// <summary>
        /// ViewState key for tracking the number of panes in the Accordion
        /// </summary>
        internal const string ItemCountViewStateKey = "_!ItemCount";

        /// <summary>
        /// Event to raise when an item (i.e. Pane's Header or Content) is
        /// created during data binding
        /// </summary>
        public event EventHandler<AccordionItemEventArgs> ItemCreated;

        /// <summary>
        /// Event to raise when an item (i.e. Pane's Header or Content) is
        /// data bound
        /// </summary>
        public event EventHandler<AccordionItemEventArgs> ItemDataBound;

        /// <summary>
        /// Event to raise when a command is fired
        /// </summary>
        public event CommandEventHandler ItemCommand;

        /// <summary>
        /// AccordionExtender to attach
        /// </summary>
        private AccordionExtender _extender;

        /// <summary>
        /// The Accordion's child panes
        /// </summary>
        private AccordionPaneCollection _panes;

        #region DataBinding Fields

        /// <summary>
        /// DataSource to bind the Accordion to
        /// </summary>
        private object _dataSource;

        /// <summary>
        /// DataBinding template for the header
        /// </summary>
        private ITemplate _headerTemplate;

        /// <summary>
        /// DataBinding template for the content
        /// </summary>
        private ITemplate _contentTemplate;

        /// <summary>
        /// Whether or not the control has been initialized
        /// </summary>
        private bool _initialized;

        /// <summary>
        /// Whether the page's PreLoad event has already fired
        /// </summary>
        private bool _pagePreLoadFired;

        /// <summary>
        /// Whether or not the Accordion needs to be databound but hasn't been yet
        /// </summary>
        private bool _requiresDataBinding;

        /// <summary>
        /// Flag to determine if we should throw an exception when a data property
        /// (i.e. DataSource, DataSourceID, DataMember) is changed
        /// </summary>
        private bool _throwOnDataPropertyChange;

        /// <summary>
        /// View of the the data provided by the data property
        /// </summary>
        private DataSourceView _currentView;

        /// <summary>
        /// Whether the current DataSourceView was loaded from a DataSourceID
        /// </summary>
        private bool _currentViewIsFromDataSourceID;

        /// <summary>
        /// Whether the current DataSourceView contains valid data
        /// </summary>
        private bool _currentViewValid;

        /// <summary>
        /// Arguments used to sort, filter, etc., the data when creating
        /// the DataSourceView (although we will use the default whenever possible)
        /// </summary>
        private DataSourceSelectArguments _arguments;

        /// <summary>
        /// Enumerable list of data items obtained from the DataSource
        /// </summary>
        IEnumerable _selectResult;

        /// <summary>
        /// Thread synchronization event used for obtaining data from the DataSource
        /// </summary>
        EventWaitHandle _selectWait;

        #endregion

        /// <summary>
        /// Default constructor that tells ASP.NET to render it as a DIV
        /// </summary>
        public Accordion()
            : base(HtmlTextWriterTag.Div)
        {
        }

        /// <summary>
        /// Reference to the AccordionExtender wrapped by the Accordion control
        /// </summary>
        /// <remarks>
        /// This will be referenced in CreateChildControls so that the extender
        /// will always be created by any calls to EnsureChildControls.
        /// </remarks>
        private AccordionExtender AccordionExtender
        {
            get
            {
                if (_extender == null)
                {
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
        /// Length of the transition animation in milliseconds
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Length of the transition animation in milliseconds")]
        [DefaultValue(500)]
        public int TransitionDuration
        {
            get { return AccordionExtender.TransitionDuration; }
            set { AccordionExtender.TransitionDuration = value; }
        }

        /// <summary>
        /// The number of frames per second used in the transition animation effects.
        /// This is used to tune performance when using FadeTransition, a large number
        /// of Accordion Panes, etc.
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Number of frames per second used in the transition animation")]
        [DefaultValue(15)]
        public int FramesPerSecond
        {
            get { return AccordionExtender.FramesPerSecond; }
            set { AccordionExtender.FramesPerSecond = value; }
        }

        /// <summary>
        /// Whether or not to use a fade effect when transitioning between selected
        /// Accordion Panes
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Whether or not to use a fade effect in the transition animations")]
        [DefaultValue(false)]
        public bool FadeTransitions
        {
            get { return AccordionExtender.FadeTransitions; }
            set { AccordionExtender.FadeTransitions = value; }
        }

        /// <summary>
        /// Default Header CSS Class
        /// </summary>
        [Browsable(true)]
        [Category("Appearance")]
        [Description("Default CSS class for Accordion Pane Headers")]
        public string HeaderCssClass
        {
            get { return AccordionExtender.HeaderCssClass; }
            set { AccordionExtender.HeaderCssClass = value; }
        }

        /// <summary>
        /// Default selected Header CSS Class
        /// </summary>
        [Browsable(true)]
        [Category("Appearance")]
        [Description("Default CSS class for the selected Accordion Pane Headers")]
        public string HeaderSelectedCssClass
        {
            get { return AccordionExtender.HeaderSelectedCssClass; }
            set { AccordionExtender.HeaderSelectedCssClass = value; }
        }

        /// <summary>
        /// Default Content CSS Class
        /// </summary>
        [Browsable(true)]
        [Category("Appearance")]
        [Description("Default CSS class for Accordion Pane Content")]
        public string ContentCssClass
        {
            get { return AccordionExtender.ContentCssClass; }
            set { AccordionExtender.ContentCssClass = value; }
        }

        /// <summary>
        /// Determine how growth of the Accordion will be controlled.  If it is set to
        /// None, then the Accordion can grow as large or as small as necessary.  If it is
        /// set to Limit, then the Accordion will always be less than or equal to its
        /// Height.  If it is set to Fill then it will always be equal to its height.
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Determine how the growth of the Accordion will be controlled")]
        [DefaultValue(AutoSize.None)]
        public AutoSize AutoSize
        {
            get { return AccordionExtender.AutoSize; }
            set { AccordionExtender.AutoSize = value; }
        }

        /// <summary>
        /// Index of the AccordionPane to be displayed
        /// (this property must be set before OnPreRender)
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Index of the AccordionPane to be displayed")]
        [DefaultValue(0)]
        public int SelectedIndex
        {
            get { return AccordionExtender.SelectedIndex; }
            set { AccordionExtender.SelectedIndex = value; }
        }

        /// <summary>
        /// Whether or not clicking the header will close the currently opened pane (leaving
        /// all the Accordion's panes closed)
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Whether or not clicking the header will close the currently opened pane (leaving all the Accordion's panes closed)")]
        [DefaultValue(true)]
        public bool RequireOpenedPane
        {
            get { return AccordionExtender.RequireOpenedPane; }
            set { AccordionExtender.RequireOpenedPane = value; }
        }

        /// <summary>
        /// Whether or not we suppress the client-side click handlers of any elements (including server
        /// controls like Button or HTML elements like anchor) in the header sections of the Accordion.
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Whether or not we suppress the client-side click handlers of any elements in the header sections")]
        [DefaultValue(false)]
        [SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Postbacks", Justification = "ASP.NET term")]
        public bool SuppressHeaderPostbacks
        {
            get { return AccordionExtender.SuppressHeaderPostbacks; }
            set { AccordionExtender.SuppressHeaderPostbacks = value; }
        }

        /// <summary>
        /// Collection of child panes in the Accordion
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        public AccordionPaneCollection Panes
        {
            get
            {
                if (_panes == null)
                    _panes = new AccordionPaneCollection(this);
                return _panes;
            }
        }

        /// <summary>
        /// Prevent the Controls property from appearing in the editor (so
        /// that people will use the Panes collection instead)
        /// </summary>
        [EditorBrowsable(EditorBrowsableState.Never)]
        public override ControlCollection Controls
        {
            get { return base.Controls; }
        }

        #region DataBinding Properties

        /// <summary>
        /// Template for the Header of databound panes
        /// </summary>
        [Browsable(false)]
        [DefaultValue(null)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(AccordionContentPanel))]
        public virtual ITemplate HeaderTemplate
        {
            get { return _headerTemplate; }
            set { _headerTemplate = value; }
        }

        /// <summary>
        /// Template for the Content of databound panes
        /// </summary>
        [Browsable(false)]
        [DefaultValue(null)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(AccordionContentPanel))]
        public virtual ITemplate ContentTemplate
        {
            get { return _contentTemplate; }
            set { _contentTemplate = value; }
        }

        /// <summary>
        /// Gets or sets the data source that provides data for populating
        /// the list of AccordionPanes.
        /// </summary>
        [Bindable(true)]
        [Category("Data")]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        public virtual object DataSource
        {
            get { return _dataSource; }
            set
            {
                if ((value == null) || (value is IListSource) || (value is IEnumerable))
                {
                    _dataSource = value;
                    OnDataPropertyChanged();
                }
                else
                {
                    throw new ArgumentException("Can't bind to value that is not an IListSource or an IEnumerable.");
                }
            }
        }

        /// <summary>
        /// The ID of the DataControl that this control should use to retrieve
        /// its data source. When the control is bound to a DataControl, it
        /// can retrieve a data source instance on-demand, and thereby attempt
        /// to work in auto-DataBind mode.
        /// </summary>
        [DefaultValue("")]
        [IDReferenceProperty(typeof(DataSourceControl))]
        [Category("Data")]
        [SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", MessageId = "Member", Justification = "Following ASP.NET Convention")]
        public virtual string DataSourceID
        {
            get { return ViewState["DataSourceID"] as string ?? string.Empty; }
            set
            {
                ViewState["DataSourceID"] = value;
                OnDataPropertyChanged();
            }
        }

        /// <summary>
        /// Member in the DataSource to bind to
        /// </summary>
        [DefaultValue("")]
        [Category("Data")]
        public virtual string DataMember
        {
            get { return ViewState["DataMember"] as string ?? string.Empty; }
            set
            {
                ViewState["DataMember"] = value;
                OnDataPropertyChanged();
            }
        }

        /// <summary>
        /// Whether or not the Accordion was databound using the DataSourceID
        /// property rather than setting the DataSource directly
        /// </summary>
        [SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", MessageId = "Member", Justification = "Following ASP.NET Convention")]
        protected bool IsBoundUsingDataSourceID
        {
            get { return !string.IsNullOrEmpty(DataSourceID); }
        }

        /// <summary>
        /// Whether or not the control has already been databound, or still needs
        /// to be databound
        /// </summary>
        protected bool RequiresDataBinding
        {
            get { return _requiresDataBinding; }
            set { _requiresDataBinding = value; }
        }

        /// <summary>
        /// Arguments used to request data-related operations from
        /// data source controls when data is retrieved
        /// </summary>
        protected DataSourceSelectArguments SelectArguments
        {
            get
            {
                if (_arguments == null)
                    _arguments = CreateDataSourceSelectArguments();
                return _arguments;
            }
        }

        #endregion

        /// <summary>
        /// OnInit handler to wireup the Page's PreLoad event
        /// </summary>
        /// <param name="e">EventArgs</param>
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            if (Page != null)
            {
                Page.PreLoad += new EventHandler(this.OnPagePreLoad);
                if (!IsViewStateEnabled && Page.IsPostBack)
                    RequiresDataBinding = true;
            }
        }

        /// <summary>
        /// OnPreLoad is used to determine whether or not we still need to databind the Accordion
        /// </summary>
        /// <param name="sender">Sender</param>
        /// <param name="e">EventArgs</param>
        private void OnPagePreLoad(object sender, EventArgs e)
        {
            _initialized = true;

            if (Page != null)
            {
                Page.PreLoad -= new EventHandler(this.OnPagePreLoad);

                // Setting RequiresDataBinding to true in OnLoad is too late because the OnLoad page event
                // happens before the control.OnLoad method gets called.  So a page_load handler on the page
                // that calls DataBind won't prevent DataBind from getting called again in PreRender.
                if (!Page.IsPostBack)
                    RequiresDataBinding = true;

                // If this is a postback and viewstate is enabled, but we have never bound the control
                // before, it is probably because its visibility was changed in the postback.  In this
                // case, we need to bind the control or it will never appear.  This is a common scenario
                // for Wizard and MultiView.
                if (Page.IsPostBack && IsViewStateEnabled && ViewState[ItemCountViewStateKey] == null)
                    RequiresDataBinding = true;

                _pagePreLoadFired = true;
            }

            EnsureChildControls();
        }

        /// <summary>
        /// Connect to the DataSourceView and determine if we still need to
        /// do databinding
        /// </summary>
        /// <param name="e">EventArgs</param>
        protected override void OnLoad(EventArgs e)
        {
            _initialized = true; // just in case we were added to the page after PreLoad
            ConnectToDataSourceView();
            if (Page != null && !_pagePreLoadFired && ViewState[ItemCountViewStateKey] == null)
            {
                // If the control was added after PagePreLoad, we still need to databind it because it missed its
                // first change in PagePreLoad.  If this control was created by a call to a parent control's DataBind
                // in Page_Load (with is relatively common), this control will already have been databound even
                // though pagePreLoad never fired and the page isn't a postback.
                if (!Page.IsPostBack)
                {
                    RequiresDataBinding = true;
                }
                // If the control was added to the page after page.PreLoad, we'll never get the event and we'll
                // never databind the control.  So if we're catching up and Load happens but PreLoad never happened,
                // call DataBind.  This may make the control get databound twice if the user called DataBind on the control
                // directly in Page.OnLoad, but better to bind twice than never to bind at all.
                else if (IsViewStateEnabled)
                {
                    RequiresDataBinding = true;
                }
            }

            base.OnLoad(e);
        }

        /// <summary>
        /// Create the AccordionExtender and attach it to the div
        /// that will be generated for this control
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1804:RemoveUnusedLocals", MessageId = "controls")]
        protected override void CreateChildControls()
        {
            base.CreateChildControls();

            // If we already have items in the ViewState, create the control
            // hierarchy using the view state (and not the datasource)
            if (AccordionExtender != null && ViewState[ItemCountViewStateKey] != null)
                CreateControlHierarchy(false);

            ClearChildViewState();

            // Ensure creation of child controls
            foreach (AccordionPane pane in Panes)
            {
                ControlCollection controls = pane.Controls;
            }
        }

        /// <summary>
        /// Mark the selected AccordionPane so it does not appear collapsed
        /// </summary>
        /// <param name="e">EventArgs</param>
        protected override void OnPreRender(EventArgs e)
        {
            EnsureDataBound();
            base.OnPreRender(e);

            // Set the overflow to hidden to prevent any growth from
            // showing initially before it is hidden by the script if
            // we are controlling the height
            if (AutoSize != AutoSize.None)
            {
                Style[HtmlTextWriterStyle.Overflow] = "hidden";
                Style[HtmlTextWriterStyle.OverflowX] = "auto";
            }

            // Apply the standard header/content styles, but allow the
            // pane's styles to take precedent            
            foreach (AccordionPane pane in Panes)
            {
                if (pane.HeaderCssClass == HeaderSelectedCssClass)
                    pane.HeaderCssClass = string.Empty;
                if (!string.IsNullOrEmpty(HeaderCssClass) && string.IsNullOrEmpty(pane.HeaderCssClass))
                    pane.HeaderCssClass = HeaderCssClass;
                if (!string.IsNullOrEmpty(ContentCssClass) && string.IsNullOrEmpty(pane.ContentCssClass))
                    pane.ContentCssClass = ContentCssClass;
            }

            // Get the index of the selected pane, or use the first pane if we don't
            // have a valid index and require one.  (Note: We don't reset the SelectedIndex
            // property because it may refer to a pane that will be added dynamically on the
            // client.  If we need to start with a pane visible, then we'll open the first
            // pane because that's the default value used on the client as the SelectedIndex
            // in this scenario.)
            int index = AccordionExtender.SelectedIndex;
            index = ((index < 0 || index >= Panes.Count) && AccordionExtender.RequireOpenedPane) ? 0 : index;

            // Make sure the selected pane is displayed
            if (index >= 0 && index < Panes.Count)
            {
                AccordionContentPanel content = Panes[index].ContentContainer;
                if (content != null)
                    content.Collapsed = false;

                // Set the CSS class for the open panes header
                if (!string.IsNullOrEmpty(HeaderSelectedCssClass))
                    Panes[index].HeaderCssClass = HeaderSelectedCssClass;
            }
        }

        /// <summary>
        /// Override FindControl to look first at this control, then check each
        /// of its child AccordionPanes for the control
        /// </summary>
        /// <param name="id">ID of the control</param>
        /// <returns>Control</returns>
        public override Control FindControl(string id)
        {
            Control ctrl = base.FindControl(id);
            if (ctrl == null)
                foreach (AccordionPane pane in Panes)
                {
                    ctrl = pane.FindControl(id);
                    if (ctrl != null)
                        break;
                }
            return ctrl;
        }

        /// <summary>
        /// Empty out the child Pane's collection
        /// </summary>
        internal void ClearPanes()
        {
            for (int i = Controls.Count - 1; i >= 0; i--)
                if (Controls[i] is AccordionPane)
                    Controls.RemoveAt(i);
        }

        #region DataBinding

        /// <summary>
        /// Connects this data bound control to the appropriate DataSourceView
        /// and hooks up the appropriate event listener for the
        /// DataSourceViewChanged event. The return value is the new view (if
        /// any) that was connected to. An exception is thrown if there is
        /// a problem finding the requested view or data source.
        /// </summary>
        /// <returns>New View</returns>
        [SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        private DataSourceView ConnectToDataSourceView()
        {
            // If the current view is correct, there is no need to reconnect
            if (_currentViewValid && !DesignMode)
                return _currentView;

            // Disconnect from old view, if necessary
            if ((_currentView != null) && (_currentViewIsFromDataSourceID))
            {
                // We only care about this event if we are bound through the DataSourceID property
                _currentView.DataSourceViewChanged -= new EventHandler(OnDataSourceViewChanged);
            }

            // Connect to new view
            IDataSource ds = null;
            string dataSourceID = DataSourceID;

            if (!string.IsNullOrEmpty(dataSourceID))
            {
                // Try to find a DataSource control with the ID specified in DataSourceID
                Control control = NamingContainer.FindControl(dataSourceID);
                if (control == null)
                    throw new HttpException(String.Format(CultureInfo.CurrentCulture, "DataSource '{1}' for control '{0}' doesn't exist", ID, dataSourceID));
                ds = control as IDataSource;
                if (ds == null)
                    throw new HttpException(String.Format(CultureInfo.CurrentCulture, "'{1}' is not a data source for control '{0}'.", ID, dataSourceID));
            }

            if (ds == null)
            {
                // DataSource control was not found, construct a temporary data source to wrap the data
                return null;
            }
            else
            {
                // Ensure that both DataSourceID as well as DataSource are not set at the same time
                if (DataSource != null)
                    throw new InvalidOperationException("DataSourceID and DataSource can't be set at the same time.");
            }

            // IDataSource was found, extract the appropriate view and return it
            DataSourceView newView = ds.GetView(DataMember);
            if (newView == null)
                throw new InvalidOperationException(String.Format(CultureInfo.CurrentCulture, "DataSourceView not found for control '{0}'", ID));

            _currentViewIsFromDataSourceID = IsBoundUsingDataSourceID;
            _currentView = newView;
            // If we're bound through the DataSourceID proeprty, then we care about this event
            if ((_currentView != null) && (_currentViewIsFromDataSourceID))
                _currentView.DataSourceViewChanged += new EventHandler(OnDataSourceViewChanged);
            _currentViewValid = true;

            return _currentView;
        }

        /// <summary>
        /// Bind the Accordion to its DataSource
        /// </summary>
        public override void DataBind()
        {
            // Don't databind to a data source control when the control is in the designer but not top-level
            if (IsBoundUsingDataSourceID && DesignMode && (Site == null))
                return;

            // do our own databinding
            RequiresDataBinding = false;
            OnDataBinding(EventArgs.Empty);
        }

        /// <summary>
        /// DataBind the Accordion to its panes
        /// </summary>
        /// <param name="e">EventArgs</param>
        protected override void OnDataBinding(EventArgs e)
        {
            base.OnDataBinding(e);

            //Only bind if the control has the DataSource or DataSourceID set
            if (this.DataSource != null || IsBoundUsingDataSourceID)
            {
                // reset the control state
                ClearPanes();
                ClearChildViewState();

                // and then create the control hierarchy using the datasource
                CreateControlHierarchy(true);
                ChildControlsCreated = true;
            }
        }

        /// <summary>
        /// Create the new control hierarchy of AccordionPanes
        /// (using the DataSource if specificed)
        /// </summary>
        /// <param name="useDataSource">Whether or not we should use the DataSource</param>
        protected virtual void CreateControlHierarchy(bool useDataSource)
        {
            int count = -1;
            IEnumerable dataSource = null;
            List<AccordionPane> itemsArray = new List<AccordionPane>();

            if (!useDataSource)
            {
                object viewCount = ViewState[ItemCountViewStateKey];

                // ViewState must have a non-null value for ItemCount because we check for
                // this in CreateChildControls
                if (viewCount != null)
                {
                    count = (int)viewCount;
                    if (count != -1)
                    {
                        List<object> dummyList = new List<object>(count);
                        for (int i = 0; i < count; i++)
                            dummyList.Add(null);
                        dataSource = dummyList;
                        itemsArray.Capacity = count;
                    }
                }
            }
            else
            {
                dataSource = GetData();
                count = 0;
                ICollection collection = dataSource as ICollection;
                if (collection != null)
                    itemsArray.Capacity = collection.Count;
            }

            if (dataSource != null)
            {
                int index = 0;
                foreach (object dataItem in dataSource)
                {
                    AccordionPane ap = new AccordionPane();
                    ap.ID = string.Format(System.Globalization.CultureInfo.InvariantCulture, "{0}_Pane_{1}", this.ID, index.ToString(CultureInfo.InvariantCulture));

                    Controls.Add(ap);

                    CreateItem(dataItem, index, AccordionItemType.Header, ap.HeaderContainer, HeaderTemplate, useDataSource);
                    CreateItem(dataItem, index, AccordionItemType.Content, ap.ContentContainer, ContentTemplate, useDataSource);

                    itemsArray.Add(ap);

                    count++;
                    index++;
                }
            }

            // If we're binding, save the number of items contained in the repeater for use in round-trips
            if (useDataSource)
                ViewState[ItemCountViewStateKey] = ((dataSource != null) ? count : -1);
        }

        /// <summary>
        /// Create an AccordionPane's item (either Header or Content) and raise the ItemCreated event
        /// </summary>
        /// <param name="dataItem">Item's data</param>
        /// <param name="index">Index</param>
        /// <param name="itemType">Type of the item (Header or Content)</param>
        /// <param name="container">Control to fill</param>
        /// <param name="template">Template for the binding</param>
        /// <param name="dataBind">Whether or not to bind</param>
        private void CreateItem(object dataItem, int index, AccordionItemType itemType, AccordionContentPanel container, ITemplate template, bool dataBind)
        {

            if (template == null)
                return;

            AccordionItemEventArgs itemArgs = new AccordionItemEventArgs(container, itemType);
            OnItemCreated(itemArgs);

            container.SetDataItemProperties(dataItem, index, itemType);
            template.InstantiateIn(container);

            if (dataBind)
            {
                container.DataBind();
                OnItemDataBound(itemArgs);
            }
        }

        /// <summary>
        /// Ensure that the Accordion has been databound if it needed to be
        /// </summary>
        protected void EnsureDataBound()
        {
            try
            {
                _throwOnDataPropertyChange = true;
                if (RequiresDataBinding && !string.IsNullOrEmpty(DataSourceID))
                    DataBind();
            }
            finally
            {
                _throwOnDataPropertyChange = false;
            }
        }

        /// <summary>
        /// Returns an IEnumerable that is the DataSource, which either came
        /// from the DataSource property or from the control bound via the
        /// DataSourceID property.
        /// </summary>
        /// <returns>DataSource</returns>
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Performs complex action")]
        protected virtual IEnumerable GetData()
        {
            _selectResult = null;
            DataSourceView view = ConnectToDataSourceView();
            if (view != null)
            {
                Debug.Assert(_currentViewValid);

                // create a handle here to make sure this is a synchronous operation.
                _selectWait = new EventWaitHandle(false, EventResetMode.AutoReset);
                view.Select(SelectArguments, new DataSourceViewSelectCallback(DoSelect));
                _selectWait.WaitOne();

            }
            else if (DataSource != null)
            {
                _selectResult = DataSource as IEnumerable;
            }
            return _selectResult;
        }

        /// <summary>
        /// Create the DataSourceSelectArguments (which just defaults to the Empty value
        /// because we don't want to sort, filter, etc.)
        /// </summary>
        /// <returns>DataSourceSelectArguments</returns>
        protected virtual DataSourceSelectArguments CreateDataSourceSelectArguments()
        {
            return DataSourceSelectArguments.Empty;
        }

        /// <summary>
        /// Select the data
        /// </summary>
        /// <param name="data">Data</param>
        private void DoSelect(IEnumerable data)
        {
            _selectResult = data;
            _selectWait.Set();
        }

        /// <summary>
        /// Wrap the CommandArgs of an ItemCommand event with AccordionCommandEventArgs
        /// </summary>
        /// <param name="source">Source</param>
        /// <param name="args">EventArgs</param>
        /// <returns>Whether the event was handled</returns>
        protected override bool OnBubbleEvent(object source, EventArgs args)
        {
            bool handled = false;
            AccordionCommandEventArgs accordionArgs = args as AccordionCommandEventArgs;
            if (accordionArgs != null)
            {
                OnItemCommand(accordionArgs);
                handled = true;
            }
            return handled;
        }

        /// <summary>
        /// This method is called when DataMember, DataSource, or DataSourceID is changed.
        /// </summary>
        [SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        protected virtual void OnDataPropertyChanged()
        {
            if (_throwOnDataPropertyChange)
                throw new HttpException("Invalid data property change");
            if (_initialized)
                RequiresDataBinding = true;
            _currentViewValid = false;
        }

        /// <summary>
        /// Indicate that we need to be databound whenever the DataSourceView changes
        /// </summary>
        /// <param name="sender">Sender</param>
        /// <param name="args">EventArgs</param>
        protected virtual void OnDataSourceViewChanged(object sender, EventArgs args)
        {
            RequiresDataBinding = true;
        }

        /// <summary>
        /// Raise the ItemCommand event
        /// </summary>
        /// <param name="args">EventArgs</param>
        [SuppressMessage("Microsoft.Design", "CA1011:ConsiderPassingBaseTypesAsParameters", Justification = "Using appropriate EventArgs for the Event")]
        protected virtual void OnItemCommand(AccordionCommandEventArgs args)
        {
            if (ItemCommand != null)
                ItemCommand(this, args);
        }

        /// <summary>
        /// Raise the ItemCreatedEvent
        /// </summary>
        /// <param name="args">EventArgs</param>
        protected virtual void OnItemCreated(AccordionItemEventArgs args)
        {
            if (ItemCreated != null)
                ItemCreated(this, args);
        }

        /// <summary>
        /// Raise the ItemDataBound event
        /// </summary>
        /// <param name="args">EventArgs</param>
        protected virtual void OnItemDataBound(AccordionItemEventArgs args)
        {
            if (ItemDataBound != null)
                ItemDataBound(this, args);
        }

        #endregion
    }
}