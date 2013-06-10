

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.ComponentModel;
using System.Collections;
using System.Text.RegularExpressions;
using System.Collections.Specialized;
using System.Threading;
using System.Web.Script;

using AjaxControlToolkit.Design;

using BindingDirection = System.ComponentModel.BindingDirection;
using System.Data;

namespace AjaxControlToolkit
{
    /// <summary>
    /// This class implements a reorderable, data bindable list control.
    /// 
    /// It demonstrates writing a control that is AJAX-aware in that it creates and
    /// manages a set of ASP.NET AJAX extenders. to imporove it's client experience.
    /// 
    /// It is also data aware.  When supplied with a database that matches an expected format,
    /// it will automatically update the sort order of the items.  The database must have an integer-typed
    /// column that this list can have "ownership" of.  By setting this column name into the "SortOrderField" property,
    /// reorders will happen automatically.
    /// 
    /// </summary>
    [Designer("AjaxControlToolkit.ReorderListDesigner, AjaxControlToolkit")]
    [System.Drawing.ToolboxBitmap(typeof(ReorderList), "ReorderList.ReorderList.ico")]
    public class ReorderList : CompositeDataBoundControl, IRepeatInfoUser, INamingContainer, ICallbackEventHandler, IPostBackEventHandler
    {
        // key fields for various things.
        private static object ItemCommandKey = new object();
        private static object CancelCommandKey = new object();
        private static object EditCommandKey = new object();
        private static object DeleteCommandKey = new object();
        private static object UpdateCommandKey = new object();
        private static object InsertCommandKey = new object();
        private static object ItemDataBoundKey = new object();
        private static object ItemCreatedKey = new object();
        private static object ItemReorderKey = new object();
        private static object KeysKey = new object();
        
        /// <summary>
        ///  All of our event handlers.
        /// </summary>
        public event EventHandler<ReorderListCommandEventArgs> ItemCommand { add { Events.AddHandler(ItemCommandKey, value); } remove { Events.RemoveHandler(ItemCommandKey, value); } }
        public event EventHandler<ReorderListCommandEventArgs> CancelCommand { add { Events.AddHandler(CancelCommandKey, value); } remove { Events.RemoveHandler(CancelCommandKey, value); } }
        public event EventHandler<ReorderListCommandEventArgs> DeleteCommand { add { Events.AddHandler(DeleteCommandKey, value); } remove { Events.RemoveHandler(DeleteCommandKey, value); } }
        public event EventHandler<ReorderListCommandEventArgs> EditCommand { add { Events.AddHandler(EditCommandKey, value); } remove { Events.RemoveHandler(EditCommandKey, value); } }
        public event EventHandler<ReorderListCommandEventArgs> InsertCommand { add { Events.AddHandler(InsertCommandKey, value); } remove { Events.RemoveHandler(InsertCommandKey, value); } }
        public event EventHandler<ReorderListCommandEventArgs> UpdateCommand { add { Events.AddHandler(UpdateCommandKey, value); } remove { Events.RemoveHandler(UpdateCommandKey, value); } }
        public event EventHandler<ReorderListItemEventArgs> ItemDataBound { add { Events.AddHandler(ItemDataBoundKey, value); } remove { Events.RemoveHandler(ItemDataBoundKey, value); } }
        public event EventHandler<ReorderListItemEventArgs> ItemCreated { add { Events.AddHandler(ItemCreatedKey, value); } remove { Events.RemoveHandler(ItemCreatedKey, value); } }
        public event EventHandler<ReorderListItemReorderEventArgs> ItemReorder { add { Events.AddHandler(ItemReorderKey, value); } remove { Events.RemoveHandler(ItemReorderKey, value); } }

        /// <summary>
        /// The actual list control.  This control actually renders a DIV with some children:
        /// 
        /// The UL control
        /// The DropWatcherExtender
        /// The DraggableListitemExtender
        /// The drop template control
        /// </summary>
        private BulletedList _childList;
        
        /// <summary>
        /// A control that we generate for the drop template
        /// </summary>
        private Control _dropTemplateControl;

        /// <summary>
        /// Our template member variables.
        /// </summary>
        private ITemplate _reorderTemplate;
        private ITemplate _itemTemplate;
        private ITemplate _editItemTemplate;
        private ITemplate _insertItemTemplate;
        private ITemplate _dragHandleTemplate;
        private ITemplate _emptyListTemplate;

        /// <summary>
        /// The list of items that can be dragged around.  We maintain this list so we know
        /// what to generate later in the draggableListItems Extender
        /// </summary>
        private List<DraggableListItemInfo> _draggableItems;
        private DropWatcherExtender _dropWatcherExtender;

        private class DraggableListItemInfo
        {
            public Control TargetControl;
            public Control HandleControl;
            public DraggableListItemExtender Extender;
        }

        private ArrayList itemsArray;
        private const string ArgReplace = "_~Arg~_";
        private const string ArgContext = "_~Context~_";
        private const string ArgSuccess = "_~Success~_";
        private const string ArgError   = "_~Error~_";
        private ReorderListItemLayoutType _layoutType = ReorderListItemLayoutType.Table;

       
        /// <summary>
        /// Specifies whether this control allows reorder.
        /// </summary>
        [DefaultValue(false)]
        public bool AllowReorder
        {
            get
            {
                return GetPropertyValue("AllowReorder", true);
            }
            set
            {
                SetPropertyValue("AllowReorder", value);
            }
        }

        private IOrderedDictionary BoundFieldValues
        {
            get
            {
                if (ViewState["BoundFieldValues"] == null)
                {
                    IOrderedDictionary bfv = new OrderedDictionary();
                    ViewState["BoundFieldValues"] = bfv;
                }
                return (IOrderedDictionary)ViewState["BoundFieldValues"];
            }
        }

        [DefaultValue("")]
        public string CallbackCssStyle
        {
            get
            {
                return GetPropertyValue("CallbackCssStyle", "");
            }
            set
            {
                SetPropertyValue("CallbackCssStyle", value);
            }
        }

        internal BulletedList ChildList
        {
            get
            {
                if (_childList == null)
                {
                    _childList = new BulletedList();
                    _childList.ID = "_rbl";
                    this.Controls.Add(_childList);
                }
                else if (_childList.Parent == null)
                {
                    // this gets cleared by base databinding code since the ChildList
                    // is parented to the ReorderList.
                    //
                    this.Controls.Add(_childList);                    
                }
                return _childList;
            }
        }

        /// <summary>
        /// The column name for the primary key field for this control to use
        /// </summary>
        [DefaultValue("")]
        public string DataKeyField
        {
            get
            {
                return GetPropertyValue("DataKeyName", "");
            }
            set
            {
                SetPropertyValue("DataKeyName", value);
            }
        }

        /// <summary>
        /// The indexed collection of data keys, one for each row, when databound.
        /// </summary>
        [Browsable(false)]
        public DataKeyCollection DataKeys
        {
            get
            {
                return new DataKeyCollection(DataKeysArray);
            }
        }

        /// <summary>
        /// Set to true when a reorder callback happens.  We check this on a 
        /// postback to see if we need to re-databind.        
        /// </summary>
        private bool DataBindPending
        {
            get
            {
                EnsureChildControls();
                if (_dropWatcherExtender != null)
                {
                    string state = _dropWatcherExtender.ClientState;
                    return !String.IsNullOrEmpty(state);
                }
                return false;
            }
        }

        protected ArrayList DataKeysArray
        {
            get
            {
                if (ViewState["DataKeysArray"] == null)
                {
                    ViewState["DataKeysArray"] = new ArrayList();
                }
                return (ArrayList)ViewState["DataKeysArray"];
            }
        }

        /// <summary>
        /// The ID of an IDataSource object to databind this list to.
        /// </summary>
        [TypeConverter(typeof(TypedControlIDConverter<IDataSource>))]
        public override string DataSourceID
        {
            get
            {
                return base.DataSourceID;
            }
            set
            {
                base.DataSourceID = value;
            }
        }

        /// <summary>
        /// The handle alignment in relation to the item template.  
        /// </summary>
        [DefaultValue(ReorderHandleAlignment.Left)]
        public ReorderHandleAlignment DragHandleAlignment
        {
            get
            {
                return GetPropertyValue("DragHandleAlignment", ReorderHandleAlignment.Left);
            }
            set
            {
                SetPropertyValue("DragHandleAlignment",value);
            }
        }


        /// <summary>
        /// The template to use for the handle that a user can "grab" with the mouse and reorder
        /// the item.
        /// </summary>
        [Browsable(false)]
        [TemplateContainer(typeof(ReorderListItem))]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DefaultValue("")]        
        public ITemplate DragHandleTemplate
        {
            get { return _dragHandleTemplate; }
            set { _dragHandleTemplate = value; }
        }

        /// <summary>
        /// The template that will be shown when the list has no data
        /// </summary>
        [Browsable(false)]
        [TemplateContainer(typeof(ReorderListItem))]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DefaultValue("")]
        public ITemplate EmptyListTemplate
        {
            get { return _emptyListTemplate; }
            set { _emptyListTemplate = value; }
        }

        /// <summary>
        /// The index of the item that is currently in edit mode.  
        /// The default is -1, meaning no item is in edit mode.
        /// </summary>
        [DefaultValue(-1)]
        public int EditItemIndex
        {
            get
            {
                return GetPropertyValue("EditItemIndex", -1);
            }
            set
            {
                SetPropertyValue("EditItemIndex", value);
            }
        }

        /// <summary>
        /// The template do display when a row is in edit mode.
        /// </summary>
        [Browsable(false)]
        [TemplateContainer(typeof(IDataItemContainer), BindingDirection.TwoWay)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DefaultValue("")]
        public ITemplate EditItemTemplate
        {
            get { return _editItemTemplate; }
            set { _editItemTemplate = value; }
        }

        /// <summary>
        /// Specifies where new items are added to the list: beginning or end.
        /// </summary>
        [DefaultValue(ReorderListInsertLocation.Beginning)]
        public ReorderListInsertLocation ItemInsertLocation
        {
            get
            {
                return GetPropertyValue("ItemInsertLocation", ReorderListInsertLocation.Beginning);
            }
            set
            {
                SetPropertyValue("ItemInsertLocation", value);
            }
        }
        
        /// <summary>
        /// The template to display for adding new items.
        /// </summary>
        [Browsable(false)]
        [TemplateContainer(typeof(IDataItemContainer), BindingDirection.TwoWay)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DefaultValue("")]
        public ITemplate InsertItemTemplate
        {
            get { return _insertItemTemplate; }
            set { _insertItemTemplate = value; }
        }        

        /// <summary>
        /// The template to display for rows in display mode.
        /// </summary>
        [Browsable(false)]
        [TemplateContainer(typeof(IDataItemContainer), BindingDirection.TwoWay)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DefaultValue("")]
        public ITemplate ItemTemplate
        {
            get { return _itemTemplate; }
            set { _itemTemplate = value; }
        }

        [Browsable(false)]
        public ReorderListItemCollection Items
        {
            get            
            {
                EnsureDataBound();
                return new ReorderListItemCollection(this);
            }
        }

        /// <summary>
        /// The type of layout to apply to the items.  If "Table" is selected, the 
        /// DragHandleAlignment property is used to lay out the items 
        /// in relation to the drag handle.  If not, the items are simply wrapped in Panel
        /// controls and can be positioned using CSS.
        /// </summary>
        [DefaultValue(ReorderListItemLayoutType.Table)]
        public ReorderListItemLayoutType LayoutType
        {
            get
            {
                return _layoutType;
            }
            set
            {
                _layoutType = value;
            }
        }

        [DefaultValue("true")]
        public bool PostBackOnReorder
        {
            get
            {
                return GetPropertyValue("PostBackOnReorder", false);

            }
            set
            {
                SetPropertyValue("PostBackOnReorder", value);
                
            }
        }

        /// <summary>
        /// The name of the column which controls the sort order of the rows in the data base.
        /// </summary>
        [DefaultValue("")]
        public string SortOrderField
        {
            get
            {
                return GetPropertyValue("SortOrderField", "");
            }
            set
            {
                SetPropertyValue("SortOrderField", value);
            }
        }

        /// <summary>
        /// The template to use as the drop visual when the user is dragging an item around.  
        /// This template is not data bindable.
        /// </summary>
        [Browsable(false)]
        [TemplateContainer(typeof(ReorderListItem))]
        [PersistenceMode(PersistenceMode.InnerDefaultProperty)]
        [DefaultValue("")]
        public ITemplate ReorderTemplate
        {
            get { return _reorderTemplate; }
            set { _reorderTemplate = value; }
        }

        /// <summary>
        /// The resource URL to use for loading the script associated with this control.
        /// </summary>
        private string ScriptResourceUrl
        {
            get
            {
                string url = Page.Request.Url.AbsoluteUri;
                string hostPath = url.Substring(0, url.Length - Page.Request.Url.PathAndQuery.Length);

                url = hostPath + Page.ClientScript.GetWebResourceUrl(typeof(ReorderList), "WebUtilControls.DragDropList.js").Replace("&", "&amp;");
                return url;
            }
        }

        /// <summary>
        /// Determines whether the InsertItem is shown.  If this value is not set and
        /// an InsertItemTemplate is set, this defaults to true.
        /// </summary>
        [DefaultValue(false)]
        public bool ShowInsertItem
        {
            get
            {
                return GetPropertyValue("ShowInsertItem", InsertItemTemplate != null);
            }
            set
            {
                SetPropertyValue("ShowInsertItem", value);
            }
        }

        /// <summary>
        /// This control renders a DIV
        /// </summary>
        protected override HtmlTextWriterTag TagKey
        {
            get
            {
                return HtmlTextWriterTag.Div;
            }
        }

        public ReorderList()
        {
            
        }

        /// <summary>
        /// Helper method to copy the values from one dictionary to another.
        /// </summary>
        private static IDictionary CopyDictionary(IDictionary source, IDictionary dest)
        {
            if (dest == null)
            {
                dest = new OrderedDictionary(source.Count);
            }

            foreach (DictionaryEntry de in source)
            {
                dest[de.Key] = de.Value;
            }

            return dest;
        }

        private void ClearChildren()
        {
            ChildList.Controls.Clear();            
            _dropTemplateControl = null;

            if (_draggableItems != null) {
                foreach (DraggableListItemInfo item in _draggableItems) {
                    if (item.Extender != null) {                       
                        item.Extender.Dispose();
                    }
                }
            }
            _draggableItems = null;

            for (int i = Controls.Count - 1; i >= 0; i--) {
                if (Controls[i] is DropWatcherExtender) {
                    Controls[i].Dispose();
                    
                }
            }
        }

        /// <summary>
        /// This method does the heavy lifting of building the control hierarchy from a dataSource.
        /// 
        /// If no datasource is passed in, for example when a postback occurs, it creates a dummy list
        /// based on the number of items it last had.
        /// </summary>
        /// <param name="dataSource"></param>
        /// 
        protected override int CreateChildControls(IEnumerable dataSource, bool dataBinding)
        {
            ClearChildren();

            int countDelta = 0;
            
            ArrayList keysArray = DataKeysArray;
            itemsArray = new ArrayList();
            int count = DesignMode ? 1 : 0;
                       
            if (dataBinding)
            {
                keysArray.Clear();

                ICollection c = dataSource as ICollection;

                if (c != null)
                {
                    keysArray.Capacity = c.Count;
                    itemsArray.Capacity = c.Count;
                }
            }

            if (dataSource != null)
            {
                string keyField = DataKeyField;
                bool storeKey = (dataBinding && !string.IsNullOrEmpty(keyField));
                
                bool hasDragHandle = AllowReorder && (DragHandleTemplate != null);

                count = 0;
                int index = 0;

                // for each item in the list, create it's ReorderListItem
                // which gets automatically added to the parent.
                //
                foreach (object dataItem in dataSource)
                {
                    if (storeKey)
                    {
                        keysArray.Add(DataBinder.GetPropertyValue(dataItem, keyField));
                    }

                    ListItemType itemType = ListItemType.Item;

                    if (index == EditItemIndex)
                    {
                        itemType = ListItemType.EditItem;
                    }

                    CreateItem(index, dataBinding, dataItem, itemType, hasDragHandle);

                    count++;
                    index++;
                }                               
                               
                // add the insert item if needed.
                //
                if (ShowInsertItem && InsertItemTemplate != null)
                {
                    CreateInsertItem(index);
                    countDelta++;
                }
            }

            if (AllowReorder && count > 1 && _draggableItems != null)
            {
                // we should now have a list of items that can be dragged,
                // setup the the extender behaviors for them.
                //
                foreach (DraggableListItemInfo dlii in _draggableItems)
                {
                    dlii.Extender = new DraggableListItemExtender();
                    dlii.Extender.TargetControlID = dlii.TargetControl.ID;
                    dlii.Extender.Handle = dlii.HandleControl.ClientID;
                    dlii.Extender.ID = String.Format(CultureInfo.InvariantCulture, "{0}_{1}", this.ID, dlii.Extender.TargetControlID);
                    this.Controls.Add(dlii.Extender);
                }
                // render our drag templates.
                //
                Control dropArea, emptyItem;
                GetDropTemplateControl(out dropArea, out emptyItem);
                
                _dropWatcherExtender = new DropWatcherExtender();
                _dropWatcherExtender.ArgReplaceString = ArgReplace;                
                _dropWatcherExtender.CallbackCssStyle = CallbackCssStyle;
                _dropWatcherExtender.DropLayoutElement = dropArea.ID;
                if (PostBackOnReorder)
                {
                    _dropWatcherExtender.PostBackCode = Page.ClientScript.GetPostBackEventReference(this, ArgReplace);
                }
                else
                {
                    _dropWatcherExtender.PostBackCode = Page.ClientScript.GetCallbackEventReference(this, "'" + ArgReplace + "'", ArgSuccess, "'" + ArgContext + "'", ArgError, true);
                    _dropWatcherExtender.ArgContextString = ArgContext;
                    _dropWatcherExtender.ArgSuccessString = ArgSuccess;
                    _dropWatcherExtender.ArgErrorString = ArgError;
                }
                _dropWatcherExtender.EnableClientState = !PostBackOnReorder;

                _dropWatcherExtender.BehaviorID = this.UniqueID + "_dItemEx";
                _dropWatcherExtender.TargetControlID = ChildList.ID;
                
                this.Controls.Add(_dropWatcherExtender);                
            }

            return ChildList.Controls.Count - countDelta;
        }


        /// <summary>
        /// Creates the control that will be our reorder template.
        /// </summary>
        /// <param name="index"></param>
        /// <param name="reorderKey"></param>
        /// <returns></returns>
        private Control CreateReorderArea(int index, string reorderKey)
        {
            Panel reorderContainer = new Panel();
            reorderContainer.ID = String.Format(CultureInfo.InvariantCulture, "__drop{1}{0}", index, reorderKey);

            if (ReorderTemplate != null)
            {
                ReorderTemplate.InstantiateIn(reorderContainer);
            }            
            return reorderContainer;
        }
        
        /// <summary>
        /// Creates the InsertItem object for a given index.
        /// </summary>
        protected virtual ReorderListItem CreateInsertItem(int index)
        {
            if (InsertItemTemplate != null && ShowInsertItem)
            {
                ReorderListItem item = new ReorderListItem(index, true);
                InsertItemTemplate.InstantiateIn(item);
                ChildList.Controls.Add(item);
                return item;
            }
            return null;
        }

        /// <summary>
        /// Builds the drag handle element and the table which controls it's alignment
        /// </summary>
        /// <param name="item">The item that's currently at this index</param>        
        protected virtual void CreateDragHandle(ReorderListItem item)
        {
            if (!AllowReorder) return;

            Control dragHolder = item;
            if (DragHandleTemplate != null) {

                Control outerItem = null;
                Control itemParent = null;

                if (LayoutType == ReorderListItemLayoutType.User)
                {

                    outerItem = new Panel();
                    Panel itemCell = new Panel();
                    Panel handleCell = new Panel();

                    dragHolder = handleCell;
                    itemParent = itemCell;

                    if (DragHandleAlignment == ReorderHandleAlignment.Left ||
                        DragHandleAlignment == ReorderHandleAlignment.Top)
                    {
                        outerItem.Controls.Add(handleCell);
                        outerItem.Controls.Add(itemCell);
                    }
                    else
                    {
                        outerItem.Controls.Add(itemCell);
                        outerItem.Controls.Add(handleCell);
                    }
                }
                else
                {
                    // we'll use a table to organize all of this.  Set it up.
                    //
                    Table itemTable = new Table();
                    outerItem = itemTable;
                    itemTable.BorderWidth = 0;
                    itemTable.CellPadding = 0;
                    itemTable.CellSpacing = 0;

                    // we keep track of two cells: one to put the item in,
                    // on to put the handle in.
                    //
                    TableCell itemCell = new TableCell();
                    itemParent = itemCell;
                    itemCell.Width = new Unit(100, UnitType.Percentage);

                    TableCell handleCell = new TableCell();
                    dragHolder = handleCell;

                    // based on the alignment value, we set up the cells in the table.
                    //
                    switch (DragHandleAlignment)
                    {
                        case ReorderHandleAlignment.Left:
                        case ReorderHandleAlignment.Right:

                            TableRow r = new TableRow();

                            if (DragHandleAlignment == ReorderHandleAlignment.Left)
                            {
                                r.Cells.Add(handleCell);
                                r.Cells.Add(itemCell);
                            }
                            else
                            {
                                r.Cells.Add(itemCell);
                                r.Cells.Add(handleCell);
                            }
                            itemTable.Rows.Add(r);
                            break;

                        case ReorderHandleAlignment.Top:
                        case ReorderHandleAlignment.Bottom:

                            TableRow itemRow = new TableRow();
                            TableRow handleRow = new TableRow();

                            itemRow.Cells.Add(itemCell);
                            handleRow.Cells.Add(handleCell);

                            if (DragHandleAlignment == ReorderHandleAlignment.Top)
                            {
                                itemTable.Rows.Add(handleRow);
                                itemTable.Rows.Add(itemRow);
                            }
                            else
                            {
                                itemTable.Rows.Add(itemRow);
                                itemTable.Rows.Add(handleRow);
                            }
                            break;
                    }   
                }   
                              
                // move the controls into the item cell from the item itself.
                //
                MoveChildren(item, itemParent);

                // create the dragholder
                //
                ReorderListItem holderItem = new ReorderListItem(item, HtmlTextWriterTag.Div);
                DragHandleTemplate.InstantiateIn(holderItem);
                dragHolder.Controls.Add(holderItem);

                // add the table
                //
                item.Controls.Add(outerItem);
            }
            else
            {
                // otherwise we just create dummy holder (apologies to dummies).
                //
                Panel holderPanel = new Panel();
                MoveChildren(item, holderPanel);
                dragHolder = holderPanel;
                item.Controls.Add(holderPanel);
            }

            dragHolder.ID = String.Format(CultureInfo.InvariantCulture, "__dih{0}", item.ItemIndex);

            // add the item we created to the draggableItems list.
            //
            if (_draggableItems == null) _draggableItems = new List<DraggableListItemInfo>();
                        
            DraggableListItemInfo dlii = new DraggableListItemInfo();
            dlii.TargetControl = item;
            dlii.HandleControl = dragHolder;
            _draggableItems.Add(dlii);
        }

        /// <summary>
        /// Creates a item at the specified index and binds it to the given data source.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        protected virtual ReorderListItem CreateItem(int index, bool dataBind, object dataItem, ListItemType itemType, bool hasDragHandle)
        {
            // Validate the item type is right.
            //
            if (itemType != ListItemType.Item && itemType != ListItemType.EditItem && itemType != ListItemType.Separator) throw new ArgumentException("Unknown value", "itemType");

            // create the item
            //
            ReorderListItem item = new ReorderListItem(dataItem, index, itemType);

            OnItemCreated(new ReorderListItemEventArgs(item));

            // figure out which template to use
            //
            ITemplate template = ItemTemplate;

            if (index == EditItemIndex)
            {
                template = EditItemTemplate;
            }

            if (itemType == ListItemType.Separator)
            {
                template = ReorderTemplate;
            }

            if (template != null)
            {
                template.InstantiateIn(item);
            }

            if (itemType == ListItemType.Item && template == null && dataItem != null && DataSource is IList)
            {
                // if we don't have a type, and we're bound to an IList, just convert the value.
                //
                TypeConverter tc = TypeDescriptor.GetConverter(dataItem);
                if (tc != null)
                {
                    Label l = new Label();
                    l.Text = tc.ConvertToString(null, CultureInfo.CurrentUICulture, dataItem);
                    item.Controls.Add(l);
                }
            }
            
            // create the drag handle
            CreateDragHandle(item);

            // add the item and databind it.
            //
            ChildList.Controls.Add(item);

            if (dataBind)
            {
                item.DataBind();
                OnItemDataBound(new ReorderListItemEventArgs(item));
                item.DataItem = null;
            }

            return item;
        }

        // Perform the actual reorder operation
        //
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        protected virtual bool DoReorder(int oldIndex, int newIndex)
        {
            if (IsBoundUsingDataSourceID && SortOrderField != null)
            {
                DataSourceView dsv = GetData();

                EventWaitHandle w = new System.Threading.EventWaitHandle(false, EventResetMode.AutoReset);
                bool success = false;
                RequiresDataBinding = true;

                try
                {

                       // get the data that's currently in the database
                    //
                    dsv.Select(new DataSourceSelectArguments(),
                        delegate(IEnumerable dataSource)
                        {
                            success = DoReorderInternal(dataSource, oldIndex, newIndex, dsv);
                            w.Set();
                        }
                    );

                    w.WaitOne();
                    // wait for the select to finish - this makes an async operation look
                    // like a synchronous one.
                    //
                }
                catch (Exception ex)
                {
                    CallbackResult = ex.Message;
                    throw;                    
                }                

                return success;
            }            
            else if (DataSource is DataTable || DataSource is DataView)
            {
                DataTable dt = DataSource as DataTable;

                if (dt == null)
                {
                    dt = ((DataView)DataSource).Table;                   
                }

                return DoReorderInternal(dt , oldIndex, newIndex);
            }
            else if (DataSource is IList && !((IList)DataSource).IsReadOnly)
            {
                IList ds = (IList)DataSource;

                object value = ds[oldIndex];

                if (oldIndex > newIndex)
                {
                    for (int i = oldIndex; i > newIndex; i--)
                    {
                        // copy all the items up
                        ds[i] = ds[i - 1];
                    }
                }
                else
                {
                    for (int i = oldIndex; i < newIndex; i++)
                    {
                        ds[i] = ds[i + 1];
                    }
                }

                ds[newIndex] = value;

                return true;
            }
            return false;
        }

        /// <summary>
        /// Reorder row [oldIndex] to position [newIndex] in a datatable.
        /// </summary>
        /// <param name="dataSource"></param>
        /// <param name="oldIndex"></param>
        /// <param name="newIndex"></param>
        /// <returns></returns>
        private bool DoReorderInternal(DataTable dataSource, int oldIndex, int newIndex)
        {
            if (String.IsNullOrEmpty(SortOrderField))
            {
                return false;
            }

            int start = Math.Min(oldIndex, newIndex);
            int end = Math.Max(oldIndex, newIndex);

            string filter = String.Format(CultureInfo.InvariantCulture, "{0} >= {1} AND {0} <= {2}", SortOrderField, start, end);

            DataRow[] rows = dataSource.Select(filter, SortOrderField + " ASC");

            DataColumn column = dataSource.Columns[SortOrderField];
            object newValue = rows[newIndex - start][column];

            // reorder the list to reflect the new sort.
            //
            if (oldIndex > newIndex)
            {
                for (int i = 0; i < rows.Length - 1; i++) 
                {                    
                    rows[i][column] = rows[i+1][column];
                }
            }
            else
            {
                for (int i = rows.Length -1; i > 0; i--)
                {
                    rows[i][column] = rows[i-1][column];
                }
            }

            rows[oldIndex - start][column] = newValue;

            // commit the changes.
            //
            dataSource.AcceptChanges();
            return true;
        }

        /// <summary>
        /// Does the real work of the reorder.  It moves the item from oldIndex to newIndex in the given data source.
        /// </summary>
        /// <param name="dataSource">The datasource this list is bound to</param>
        /// <param name="oldIndex">The original index of the item that we're reordering</param>
        /// <param name="newIndex">The designation index</param>
        /// <param name="dsv">The DataSourceView associated with this control</param>
        /// <returns></returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2201:DoNotRaiseReservedExceptionTypes", Justification="Avoiding breaking change")]
        private bool DoReorderInternal(IEnumerable dataSource, int oldIndex, int newIndex, DataSourceView dsv)
        {
            string sortField = SortOrderField;

            // get the values for each row that we'll be modifying.
            //               
            List<IOrderedDictionary> valuesList = new List<IOrderedDictionary>(Math.Abs(oldIndex - newIndex));

            int start = Math.Min(oldIndex, newIndex);
            int end = Math.Max(oldIndex, newIndex);

            // nothing to do!
            //
            if (start == end)
            {
                return false;
            }

            int i = 0;
            foreach (object row in dataSource)
            {
                try
                {
                    if (i < start)
                    {
                        continue;
                    }

                    if (i > end)
                    {
                        break;
                    }

                    IOrderedDictionary values = new OrderedDictionary();
                    IDictionary keys = new Hashtable();

                    PropertyDescriptorCollection props = TypeDescriptor.GetProperties(row);

                    foreach (PropertyDescriptor p in props)
                    {
                        object value = p.GetValue(row);                       

                        // convert DBNulls to Null (See Issue 5900)
                        if (p.PropertyType.IsValueType && value == DBNull.Value)
                        {
                            value = null;
                        }

                        values[p.Name] = value;

                        if (p.Name == DataKeyField)
                        {
                            keys[p.Name] = values[p.Name];
                            values.Remove(p.Name);
                        }
                    }

                    // stuff the row into the newValues, we'll use it later.
                    //
                    values[KeysKey] = keys;
                    valuesList.Add(values);
                }
                finally
                {
                    i++;
                }
            }

            // now that we've got the values, swap them in the list.
            // First, make the indexes zero-based.
            //
            oldIndex -= start;
            newIndex -= start;

            int startOrder = int.MinValue;

            // figure out the current sort value of the highest item in the
            // list.
            //
            if (valuesList.Count > 0 && valuesList[0].Contains(sortField))
            {
                object startValue = valuesList[0][sortField];

                string startValueAsString;

                if (startValue is int) {
                    // optimize the common case
                    //
                    startOrder = (int)startValue;
                }
                else if (null != (startValueAsString = startValue as string))
                {
                    if (!Int32.TryParse(startValueAsString, NumberStyles.Integer, CultureInfo.InvariantCulture, out startOrder))
                    {
                        return false;
                    }
                }
                else
                {
                    // handle all the various int flavors...
                    //
                    if (startValue != null && startValue.GetType().IsValueType && startValue.GetType().IsPrimitive)
                    {                        
                        startOrder = Convert.ToInt32(startValue, CultureInfo.InvariantCulture);
                        return true;
                    }                        
                    return false;
                }
            }
            else
            {
                throw new InvalidOperationException("Couldn't find sort field '" + SortOrderField + "' in bound data.");
            }

            // start at zero if we couldn't find anything.
            if (startOrder == int.MinValue)
            {
                startOrder = 0;
            }

            // swap the items in the list itself.
            //
            IOrderedDictionary targetItem = valuesList[oldIndex];
            valuesList.RemoveAt(oldIndex);
            valuesList.Insert(newIndex, targetItem);

            // walk through each of them and update the source column
            //
            foreach (IOrderedDictionary values in valuesList)
            {
                // pull the keys back out.
                //                
                IDictionary keys = (IDictionary)values[KeysKey];

                // remove it from our values collection so it doesn't
                // get based to the data source
                //
                values.Remove(KeysKey);

                // Copy the current values to use as the old values.
                //
                IDictionary oldValues = CopyDictionary(values, null);

                // update the sort index
                //
                values[sortField] = startOrder++;

                // now call update with the new sort value.
                //
                dsv.Update(keys, values, oldValues,
                    delegate(int rowsAffected, Exception ex)
                    {
                        if (ex != null)
                        {
                            throw new Exception("Failed to reorder.", ex);
                        }
                        return true;
                    }
                );
            }
            return true;
        }

        protected override void OnPreRender(EventArgs e)
        {
            // on pre render, see if an async call back happened.
            // if so, flip requires data binding.
            //
            if (DataBindPending)
            {
                RequiresDataBinding = true;                
            }
            
            base.OnPreRender(e);
        }

        
        /// <summary>
        /// Get the template to give us the current values for each field we need.
        /// </summary>
        private void ExtractRowValues(IOrderedDictionary fieldValues, ReorderListItem item, bool includePrimaryKey, bool isAddOperation)
        {
            if (fieldValues == null) return;

            // Which template are we using?
            //
            IBindableTemplate bindableTemplate = ItemTemplate as IBindableTemplate;

            if (!isAddOperation)
            {
                switch (item.ItemType)
                {
                    case ListItemType.Item:
                        break;
                    case ListItemType.EditItem:
                        bindableTemplate = EditItemTemplate as IBindableTemplate;
                        break;
                    default:
                        return;
                }
            }
            else
            {
                bindableTemplate = InsertItemTemplate as IBindableTemplate;
            }

            if (bindableTemplate != null)
            {
                string keyName = DataKeyField;

                // get the values from the template
                //
                IOrderedDictionary newValues = bindableTemplate.ExtractValues(item);

                foreach (DictionaryEntry entry in newValues)
                {
                    // put the value in unless it's the primary key, we get that elsewhere.
                    //
                    if (includePrimaryKey || 0 != String.Compare((string)entry.Key, keyName, StringComparison.OrdinalIgnoreCase))
                    {
                        fieldValues[entry.Key] = entry.Value;
                    }
                }
            }
        }

        /// <summary>
        /// Creates our DropTemplate control.   The DragDropList behavior uses a second UL control to
        /// do the actual drags.  That control has children that represent the item to use as the dropTemplate
        /// or empty template.  This method creates that structure.
        /// </summary>
        /// <param name="dropItem">Returns a reference to the item to use as the drop template</param>
        /// <param name="emptyItem">Returns a reference to the item to use as the empty template.</param>
        /// <returns></returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1021:AvoidOutParameters", Justification="Already returning a value")]
        protected WebControl GetDropTemplateControl(out Control dropItem, out Control emptyItem)
        {
            dropItem = null;
            emptyItem = null;               
            if (!AllowReorder || DesignMode) return null;

            if (_dropTemplateControl == null)
            {
                BulletedList bl = new BulletedList();

                // make sure it doesn't show up.
                bl.Style["visibility"] = "hidden";
                bl.Style["display"] = "none";

                BulletedListItem dropAreaItem = new BulletedListItem();
                dropAreaItem.ID = "_dat";
                dropAreaItem.Style["vertical-align"] = "middle";

                if (ReorderTemplate == null)
                {
                    dropAreaItem.Style["border"] = "1px solid black";
                }
                else
                {
                    ReorderTemplate.InstantiateIn(dropAreaItem);
                }
                dropItem = dropAreaItem;
                bl.Controls.Add(dropAreaItem);
                _dropTemplateControl = bl;
                this.Controls.Add(bl);
            }
            else
            {
                dropItem = _dropTemplateControl.FindControl("_dat");
                emptyItem = null;
            }
            return (WebControl)_dropTemplateControl;
        }

        /// <summary>
        /// Walks the database to find the correct value for a new item inserted into the list.
        /// </summary>        
        /// <returns>The sort value for the new item.</returns>
        private int GetNewItemSortValue(out bool success)
        {
            DataSourceView dsv = GetData();

            EventWaitHandle w = new System.Threading.EventWaitHandle(false, EventResetMode.AutoReset);
            
            int newIndex = 0;
            bool bSuccess = false;

            dsv.Select(new DataSourceSelectArguments(),
                delegate(IEnumerable dataSource)
                {
                    try
                    {
                        // look for the first or last row, based on our InsertItemLocation
                        //
                        IList list = dataSource as IList;

                        if (list == null)
                        {
                            return;
                        }

                        if (0 == list.Count)
                        {
                            bSuccess = true;
                            return;
                        }

                        object row = null;
                        int delta = 1;

                        if (ItemInsertLocation == ReorderListInsertLocation.End)
                        {
                            row = list[list.Count - 1];
                        }
                        else
                        {
                            row = list[0];
                            delta = -1;
                        }

                        // get the sort index value of that row
                        //
                        PropertyDescriptor rowProp = TypeDescriptor.GetProperties(row)[SortOrderField];

                        if (rowProp != null)
                        {
                            object rowValue = rowProp.GetValue(row);

                            if (rowValue is int)
                            {
                                newIndex = (int)rowValue + delta;
                                bSuccess = true;
                            }
                        }
                    }
                    finally
                    {
                        w.Set();
                    }
                }
            );

            // wait for the select to finish.
            //
            w.WaitOne();

            success = bSuccess;

            return newIndex;
        }

        // Called when a "Cancel" command is fired.
        //
        private void HandleCancel(ReorderListCommandEventArgs e)
        {
            if (IsBoundUsingDataSourceID)
            {
                EditItemIndex = -1;
                RequiresDataBinding = true;
            }
            OnCancelCommand(e);
        }

        // Called when a "Delete" command is fired.
        //        
        private void HandleDelete(ReorderListCommandEventArgs e)
        {
            if (IsBoundUsingDataSourceID)
            {
                DataSourceView view = GetData();

                if (view != null)
                {
                    IDictionary oldValues;
                    IOrderedDictionary newValues;
                    IDictionary keys;
                    // pick up the current values
                    //
                    PrepareRowValues(e, out oldValues, out newValues, out keys);

                    // do the delete
                    //
                    view.Delete(keys, oldValues,
                        delegate(int rows, Exception ex)
                        {
                            if (ex != null) return false;
                            OnDeleteCommand(e);
                            return true;
                        }
                    );
                    return;
                }
            }
            OnDeleteCommand(e);
            RequiresDataBinding = true;
        }

        // Called when a "Edit" command is fired.
        //        
        private void HandleEdit(ReorderListCommandEventArgs e)
        {
            if (e.Item.ItemType == ListItemType.Item)
            {
                EditItemIndex = e.Item.ItemIndex;
                RequiresDataBinding = true;
            }
            OnEditCommand(e);
        }

        private void HandleInsert(ReorderListCommandEventArgs e)
        {
            if (IsBoundUsingDataSourceID && SortOrderField != null)
            {
                IDictionary oldValues;
                IOrderedDictionary newValues;
                IDictionary keys;

                // pick up the row values
                //
                PrepareRowValues(e, out oldValues, out newValues, out keys, true);

                DataSourceView view = GetData();

                bool success;

                // get the sort index value for the newly added item.
                //
                int newIndex = GetNewItemSortValue(out success);

                if (success)
                {
                    newValues[SortOrderField] = newIndex;
                }

                if (view != null)
                {
                    // do the actual insert.
                    //
                    view.Insert(newValues,
                        delegate(int rows, Exception ex)
                        {
                            if (ex != null) return false;
                            OnInsertCommand(e);
                            return true;
                        }
                    );
                    return;
                }
            }
            OnInsertCommand(e);
            RequiresDataBinding = true;
        }

        // Called when an "Update" command is fired.
        //        
        private void HandleUpdate(ReorderListCommandEventArgs e, int itemIndex)
        {
            if (IsBoundUsingDataSourceID)
            {
                IDictionary oldValues;
                IOrderedDictionary newValues;
                IDictionary keys;

                if (e == null && itemIndex != -1)
                {
                    e = new ReorderListCommandEventArgs(new CommandEventArgs("Update", null), this, (ReorderListItem)ChildList.Controls[itemIndex]);
                }

                // extract the control values from the row
                //
                PrepareRowValues(e, out oldValues, out newValues, out keys);

                DataSourceView view = GetData();

                if (view != null)
                {
                    // do the update.
                    view.Update(keys, newValues, oldValues,
                        delegate(int rows, Exception ex)
                        {
                            if (ex != null) return false;
                            OnUpdateCommand(e);
                            EditItemIndex = -1;
                            return true;
                        }
                    );
                    return;
                }
            }
            OnUpdateCommand(e);
        }

        /// <summary>
        /// Moves the children of one control to another.
        /// </summary>
        private static void MoveChildren(Control source, Control dest)
        {
            for (int i = source.Controls.Count - 1; i >= 0; i--)
            {
                dest.Controls.AddAt(0, source.Controls[i]);
            }
        }
        
        /// <summary>
        /// Dispatches a bubbled event to the proper handler.        
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1807:AvoidUnnecessaryStringCreation", Justification = "Call to String.op_Equality done by switch statement")]
        protected override bool OnBubbleEvent(object source, EventArgs args)
        {
            ReorderListCommandEventArgs ce = args as ReorderListCommandEventArgs;
            if (ce != null)
            {
                OnItemCommand(ce);

                if (ce.CommandArgument != null)
                {

                    string command = ce.CommandName.ToString(CultureInfo.InvariantCulture).ToUpperInvariant();

                    switch (command)
                    {
                        case "INSERT":
                            HandleInsert(ce);
                            return true;
                        case "UPDATE":
                            HandleUpdate(ce, -1);
                            return true;
                        case "EDIT":
                            HandleEdit(ce);
                            return true;
                        case "DELETE":
                            HandleDelete(ce);
                            return true;
                        case "CANCEL":
                            HandleCancel(ce);
                            return true;
                    }
                }
            }
            return false;
        }

        //
        // Event stub functions
        //
        protected virtual void OnItemCreated(EventArgs e)
        {
            Invoke(ItemCreatedKey, e);
        }

        protected virtual void OnItemDataBound(EventArgs e)
        {
            Invoke(ItemDataBoundKey, e);
        }

        protected virtual void OnItemCommand(EventArgs e)
        {
            Invoke(ItemCommandKey, e);
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        protected virtual void OnItemReorder(ReorderListItemReorderEventArgs e)
        {
            try
            {
                if ((DataSource != null || IsBoundUsingDataSourceID ) && !DoReorder(e.OldIndex, e.NewIndex))
                {
                    throw new InvalidOperationException("Can't reorder data source.  It is not a DataSource and does not implement IList.");
                }
            }
            catch (Exception ex)
            {
                CallbackResult = ex.Message;
                throw;
            }
            Invoke(ItemReorderKey, e);
        }       

        protected virtual void OnCancelCommand(EventArgs e)
        {
            Invoke(CancelCommandKey, e);
        }

        protected virtual void OnDeleteCommand(EventArgs e)
        {
            Invoke(DeleteCommandKey, e);
        }

        protected virtual void OnEditCommand(EventArgs e)
        {
            Invoke(EditCommandKey, e);
        }

        protected virtual void OnInsertCommand(EventArgs e)
        {
            Invoke(InsertCommandKey, e);
        }

        protected virtual void OnUpdateCommand(EventArgs e)
        {
            Invoke(UpdateCommandKey, e);
        }

        protected void Invoke(object key, EventArgs e)
        {
            Delegate eventHandler = Events[key];

            if (eventHandler != null)
                eventHandler.DynamicInvoke(this, e);
        }

        /// <summary>
        /// Do the actual databinding
        /// </summary>
        /// <param name="data">our datasource</param>
        protected override void PerformDataBinding(IEnumerable data)
        {
            ClearChildren();
            base.PerformDataBinding(data);
            
            if (IsBoundUsingDataSourceID && EditItemIndex != -1 && EditItemIndex < Controls.Count && IsViewStateEnabled)
            {
                // if we're editing, pick up the bound original values.
                //
                BoundFieldValues.Clear();
                ExtractRowValues(BoundFieldValues, ChildList.Controls[EditItemIndex] as ReorderListItem, false, false);
            }            
        }        

        private void PrepareRowValues(ReorderListCommandEventArgs e, out IDictionary oldValues, out IOrderedDictionary newValues, out IDictionary keys)
        {
            PrepareRowValues(e, out oldValues, out newValues, out keys, false);
        }

        /// <summary>
        /// Extracts the values from an editable row into the given dictionaries.
        /// </summary>
        private void PrepareRowValues(ReorderListCommandEventArgs e, out IDictionary oldValues, out IOrderedDictionary newValues, out IDictionary keys, bool isAddOperation)
        {
            if (!isAddOperation)
            {
                oldValues = CopyDictionary(BoundFieldValues, null);
            }
            else
            {
                oldValues = null;
            }

            newValues = new OrderedDictionary(oldValues == null ? 0 : oldValues.Count);

            if (DataKeyField != null && !isAddOperation)
            {
                keys = new OrderedDictionary(1);

                keys[DataKeyField] = DataKeysArray[e.Item.ItemIndex];
            }
            else
            {
                keys = null;
            }

            // get the values.
            //
            ExtractRowValues(newValues, e.Item, true, isAddOperation);
        }

        /// <summary>
        /// Handle a reorder event from a server postback.
        /// </summary>
        /// <param name="newIndex">The item's new position</param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "Exception is caught only for debugging purposes")]
        private void ProcessReorder(int oldIndex, int newIndex)
        {
            try
            {
                System.Diagnostics.Debug.Assert(oldIndex >= 0, "Old index for reorder is < 0 (" + oldIndex + ")");
                System.Diagnostics.Debug.Assert(oldIndex < Items.Count, "Old index for reorder is > items (" + oldIndex + ")");
                System.Diagnostics.Debug.Assert(newIndex >= 0, "New index for reorder is < 0 (" + newIndex + ")");
                System.Diagnostics.Debug.Assert(newIndex < Items.Count, "New index for reorder is > items (" + newIndex + ")");

                // fire the event.
                //
                if ((oldIndex != newIndex) && (Math.Max(oldIndex, newIndex) != DataKeysArray.Count))
                {
                    Control item = Items[oldIndex];
            
                    OnItemReorder(new ReorderListItemReorderEventArgs(item as ReorderListItem, oldIndex, newIndex));
                }
                else
                {
                    //DataBind();
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.Fail(ex.ToString());
                //TODO WHY ARE SWALLOWING THIS EXCEPTION!!!
            }
        }

        protected override void RenderContents(HtmlTextWriter writer)
        {
            // show the empty item template if necessary.
            //
            if (ChildList.Controls.Count == 0)
            {
                if (EmptyListTemplate != null)
                {
                    Panel p = new Panel();
                    p.ID = ClientID;
                    EmptyListTemplate.InstantiateIn(p);
                    p.RenderControl(writer);
                }
                return;
            }

            base.RenderContents(writer);
        }
        
        /// <summary>
        /// Performs an update of the specified row with it's current values.
        /// </summary>
        /// <param name="rowIndex"></param>
        /// <param name="causesValidation"></param>
        public void UpdateItem(int rowIndex)
        {
            HandleUpdate(null, rowIndex);
        }

               

        #region IRepeatInfoUser Members
        public Style GetItemStyle(ListItemType itemType, int repeatIndex)
        {
            ReorderListItem item = GetItem(itemType, repeatIndex);
            return item.ControlStyle;
        }

        public bool HasFooter
        {
            get { return false; }
        }

        public bool HasHeader
        {
            get { return false; }
        }

        public bool HasSeparators
        {
            get { return false; }
        }

        public void RenderItem(ListItemType itemType, int repeatIndex, RepeatInfo repeatInfo, HtmlTextWriter writer)
        {
            ReorderListItem item = GetItem(itemType, repeatIndex);
            item.RenderControl(writer);
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        private ReorderListItem GetItem(ListItemType itemType, int repeatIndex)
        {
            switch (itemType)
            {
                case ListItemType.Item:
                case ListItemType.EditItem:
                    return (ReorderListItem)Controls[repeatIndex];
                case ListItemType.Separator:
                    return (ReorderListItem)Controls[repeatIndex * 2];
                default:
                    throw new ArgumentException("Unknown value", "itemType");
            }
        }

        public int RepeatedItemCount
        {
            get
            {
                if (itemsArray != null)
                    return itemsArray.Count;
                return 0;
            }
        }
        #endregion

        /// <summary>
        /// Parse our postback string into the event name, which item it's on, and any arguments
        /// </summary>
        /// <param name="eventArgument">The unparsed event postback string</param>
        /// <param name="eventName">The name of the event</param>
        /// <param name="itemId">The ID of the item that caused it</param>
        /// <param name="args">An array of args</param>
        /// <returns></returns>
        private static bool ParsePostBack(string eventArgument, out string eventName, out string itemId, out string[] args)
        {
            // format is like:
            // reorder:childItem0:1
            // which parses to:
            // eventName = "reorder"
            // itemId = "childItem0"
            // args = new string[]{"1"};
            //
            itemId = null;
            eventName = null;
            args = new string[0];
            string[] argParts = eventArgument.Split(':');

            if (argParts.Length < 2) return false;

            eventName = argParts[0];
            itemId = argParts[1];

            if (argParts.Length > 2)
            {
                args = new string[argParts.Length - 2];
                Array.Copy(argParts, 2, args, 0, args.Length);
            }
            return true;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1030:UseEventsWhereAppropriate", Justification = "Same-named as IPostBackEventHandler.RaisePostBackEvent")]
        protected void RaisePostBackEvent(string eventArgument)
        {
            string eventName;
            string itemId;
            string[] args;

            if (ParsePostBack(eventArgument, out eventName, out itemId, out args))
            {
                switch (eventName)
                {
                    case "reorder":
                        ProcessReorder(Int32.Parse(args[0], CultureInfo.InvariantCulture), Int32.Parse(args[1], CultureInfo.InvariantCulture));
                        break;
                }
            }
        }

        #region ICallbackEventHandler Members

        private string _callbackResult = string.Empty;

        private string CallbackResult
        {
            get
            {
                return _callbackResult;
            }
            set
            {
                _callbackResult = value;
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1033")]
        string ICallbackEventHandler.GetCallbackResult()        
        {            
            return CallbackResult;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1033")]
        void ICallbackEventHandler.RaiseCallbackEvent(string eventArgument)
        {
            CallbackResult = string.Empty;
            RaisePostBackEvent(eventArgument);            
        }
        #endregion

        #region IPostBackEventHandler Members
        void IPostBackEventHandler.RaisePostBackEvent(string eventArgument)
        {
            CallbackResult = string.Empty;
            RaisePostBackEvent(eventArgument);
        }
        #endregion

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "V", Justification = "V stands for value")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1715:IdentifiersShouldHaveCorrectPrefix", MessageId = "T", Justification = "V stands for value")]
        protected V GetPropertyValue<V>(string propertyName, V nullValue)
        {
            if (ViewState[propertyName] == null)
            {
                return nullValue;
            }
            return (V)ViewState[propertyName];
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "V", Justification = "V stands for value")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1715:IdentifiersShouldHaveCorrectPrefix", MessageId = "T", Justification = "V stands for value")]
        protected void SetPropertyValue<V>(string propertyName, V value)
        {
            ViewState[propertyName] = value;
        }
    }
}
