#pragma warning disable 1591
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web;
using System.Web.Script;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit.Design;
using BindingDirection = System.ComponentModel.BindingDirection;

namespace AjaxControlToolkit {

    /// <summary>
    /// ReorderList is an ASP.NET AJAX control that implements a bulleted data-bound list with items that
    /// can be reordered interactively. To reorder items in the list, a user simply drags the item's control
    /// bar to its new location. Graphical feedback is shown where the item will be placed as it is dragged by
    /// the user. The data source is updated after the item is dropped in its new location. 
    /// </summary>
    /// <remarks>
    /// When bound to data, the ReorderList control will behave like many other databound controls. If data you are
    /// displaying has a field that determines sort order (e.g. the select query is sorted by this column), and
    /// that column is of an integer type, the ReorderList can automatically perform reorders if its SortOrderField
    /// property is set. ReorderList can also be bound to a data source that implements IList (such as Arrays).
    /// 
    /// The ReorderList control is different than other samples because it is an ASP.NET server-side control that is
    /// aware of ASP.NET AJAX behavior. Rather than extending existing controls on a page, it delivers rich client-side
    /// experience directly and still has a traditional postback server model for interaction with an application.
    /// 
    /// ReorderList can handle reorders in two ways either via a callback or postback. In the case of a callback, no
    /// page postback happens on reordering. This is useful if data is only to be ordered. If data items are to be
    /// deleted or edited, a full postback needs to occur to sync the server side-state with the client0side state.
    /// The PostbackOnReorder property enables this. 
    /// </remarks>
    [Designer(typeof(ReorderListDesigner))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.ReorderListName + Constants.IconPostfix)]
    public class ReorderList : CompositeDataBoundControl, IRepeatInfoUser, INamingContainer, ICallbackEventHandler, IPostBackEventHandler {
        static object ItemCommandKey = new object();
        static object CancelCommandKey = new object();
        static object EditCommandKey = new object();
        static object DeleteCommandKey = new object();
        static object UpdateCommandKey = new object();
        static object InsertCommandKey = new object();
        static object ItemDataBoundKey = new object();
        static object ItemCreatedKey = new object();
        static object ItemReorderKey = new object();
        static object KeysKey = new object();

        public event EventHandler<ReorderListCommandEventArgs> ItemCommand {
            add { Events.AddHandler(ItemCommandKey, value); }
            remove { Events.RemoveHandler(ItemCommandKey, value); }
        }

        public event EventHandler<ReorderListCommandEventArgs> CancelCommand {
            add { Events.AddHandler(CancelCommandKey, value); }
            remove { Events.RemoveHandler(CancelCommandKey, value); }
        }

        public event EventHandler<ReorderListCommandEventArgs> DeleteCommand {
            add { Events.AddHandler(DeleteCommandKey, value); }
            remove { Events.RemoveHandler(DeleteCommandKey, value); }
        }

        public event EventHandler<ReorderListCommandEventArgs> EditCommand {
            add { Events.AddHandler(EditCommandKey, value); }
            remove { Events.RemoveHandler(EditCommandKey, value); }
        }

        public event EventHandler<ReorderListCommandEventArgs> InsertCommand {
            add { Events.AddHandler(InsertCommandKey, value); }
            remove { Events.RemoveHandler(InsertCommandKey, value); }
        }

        public event EventHandler<ReorderListCommandEventArgs> UpdateCommand {
            add { Events.AddHandler(UpdateCommandKey, value); }
            remove { Events.RemoveHandler(UpdateCommandKey, value); }
        }

        public event EventHandler<ReorderListItemEventArgs> ItemDataBound {
            add { Events.AddHandler(ItemDataBoundKey, value); }
            remove { Events.RemoveHandler(ItemDataBoundKey, value); }
        }

        public event EventHandler<ReorderListItemEventArgs> ItemCreated {
            add { Events.AddHandler(ItemCreatedKey, value); }
            remove { Events.RemoveHandler(ItemCreatedKey, value); }
        }

        public event EventHandler<ReorderListItemReorderEventArgs> ItemReorder {
            add { Events.AddHandler(ItemReorderKey, value); }
            remove { Events.RemoveHandler(ItemReorderKey, value); }
        }

        // The actual list control.  This control actually renders a DIV with some children:
        // * UL control
        // * DropWatcherExtender
        // * DraggableListitemExtender
        // * drop template control
        BulletedList _childList;

        // A control that we generate for the drop template
        Control _dropTemplateControl;

        ITemplate _reorderTemplate;
        ITemplate _itemTemplate;
        ITemplate _editItemTemplate;
        ITemplate _insertItemTemplate;
        ITemplate _dragHandleTemplate;
        ITemplate _emptyListTemplate;

        // The list of items that can be dragged around.  We maintain this list so we know
        // what to generate later in the draggableListItems Extender
        List<DraggableListItemInfo> _draggableItems;
        DropWatcherExtender _dropWatcherExtender;

        private class DraggableListItemInfo {
            public Control TargetControl;
            public Control HandleControl;
            public DraggableListItemExtender Extender;
        }

        ArrayList itemsArray;
        const string ArgReplace = "_~Arg~_";
        const string ArgContext = "_~Context~_";
        const string ArgSuccess = "_~Success~_";
        const string ArgError = "_~Error~_";
        ReorderListItemLayoutType _layoutType = ReorderListItemLayoutType.Table;

        /// <summary>
        /// Determines whether or not to allow drag/drop reordering. It is automatically set to true if ReorderTemplate is present
        /// </summary>
        [DefaultValue(false)]
        public bool AllowReorder {
            get { return GetPropertyValue("AllowReorder", true); }
            set { SetPropertyValue("AllowReorder", value); }
        }

        IOrderedDictionary BoundFieldValues {
            get {
                if(ViewState["BoundFieldValues"] == null) {
                    var bfv = new OrderedDictionary();
                    ViewState["BoundFieldValues"] = bfv;
                }
                return (IOrderedDictionary)ViewState["BoundFieldValues"];
            }
        }

        /// <summary>
        /// A callback CSS style
        /// </summary>
        [DefaultValue("")]
        public string CallbackCssStyle {
            get { return GetPropertyValue("CallbackCssStyle", String.Empty); }
            set { SetPropertyValue("CallbackCssStyle", value); }
        }

        internal BulletedList ChildList {
            get {
                if(_childList == null) {
                    _childList = new BulletedList();
                    _childList.ID = "_rbl";
                    this.Controls.Add(_childList);
                } else if(_childList.Parent == null) {
                    // this gets cleared by base databinding code since the ChildList
                    // is parented to the ReorderList.
                    //
                    this.Controls.Add(_childList);
                }
                return _childList;
            }
        }

        /// <summary>
        /// The primary key field for data
        /// </summary>
        [DefaultValue("")]
        public string DataKeyField {
            get { return GetPropertyValue("DataKeyName", String.Empty); }
            set { SetPropertyValue("DataKeyName", value); }
        }

        /// <summary>
        /// The indexed collection of data keys (one key for each row when data is bound)
        /// </summary>
        [Browsable(false)]
        public DataKeyCollection DataKeys {
            get { return new DataKeyCollection(DataKeysArray); }
        }

        // Set to true when a reorder callback happens.  We check this on a 
        // postback to see if we need to re-databind.        
        bool DataBindPending {
            get {
                EnsureChildControls();
                if(_dropWatcherExtender != null) {
                    var state = _dropWatcherExtender.ClientState;
                    return !String.IsNullOrEmpty(state);
                }
                return false;
            }
        }

        protected ArrayList DataKeysArray {
            get {
                if(ViewState["DataKeysArray"] == null)
                    ViewState["DataKeysArray"] = new ArrayList();

                return (ArrayList)ViewState["DataKeysArray"];
            }
        }

        /// <summary>
        /// ID of the data source to use to populate this control
        /// </summary>
        [TypeConverter(typeof(TypedControlIDConverter<IDataSource>))]
        public override string DataSourceID {
            get { return base.DataSourceID; }
            set { base.DataSourceID = value; }
        }

        /// <summary>
        /// Sets the drag handle relative to the item row (Top, Bottom, Left, or Right)
        /// </summary>
        [DefaultValue(ReorderHandleAlignment.Left)]
        public ReorderHandleAlignment DragHandleAlignment {
            get { return GetPropertyValue("DragHandleAlignment", ReorderHandleAlignment.Left); }
            set { SetPropertyValue("DragHandleAlignment", value); }
        }


        /// <summary>
        /// A template for the drag handle that a user clicks and drags to reorder items
        /// </summary>
        [Browsable(false)]
        [TemplateContainer(typeof(ReorderListItem))]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DefaultValue("")]
        public ITemplate DragHandleTemplate {
            get { return _dragHandleTemplate; }
            set { _dragHandleTemplate = value; }
        }

        /// <summary>
        /// A template to show when a list has no data. This item is not data-bindable
        /// </summary>
        [Browsable(false)]
        [TemplateContainer(typeof(ReorderListItem))]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DefaultValue("")]
        public ITemplate EmptyListTemplate {
            get { return _emptyListTemplate; }
            set { _emptyListTemplate = value; }
        }

        /// <summary>
        /// An index of an item that is currently in Edit mode.
        /// The default value is -1, which means no item is in edit mode 
        /// </summary>
        [DefaultValue(-1)]
        public int EditItemIndex {
            get { return GetPropertyValue("EditItemIndex", -1); }
            set { SetPropertyValue("EditItemIndex", value); }
        }

        /// <summary>
        /// A template to display for a row that is in Edit mode
        /// </summary>
        [Browsable(false)]
        [TemplateContainer(typeof(IDataItemContainer), BindingDirection.TwoWay)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DefaultValue("")]
        public ITemplate EditItemTemplate {
            get { return _editItemTemplate; }
            set { _editItemTemplate = value; }
        }

        /// <summary>
        /// Determines where new items are inserted into the list (Beginning or End)
        /// </summary>
        [DefaultValue(ReorderListInsertLocation.Beginning)]
        public ReorderListInsertLocation ItemInsertLocation {
            get { return GetPropertyValue("ItemInsertLocation", ReorderListInsertLocation.Beginning); }
            set { SetPropertyValue("ItemInsertLocation", value); }
        }

        /// <summary>
        /// A template to show for adding new items to the list
        /// </summary>
        [Browsable(false)]
        [TemplateContainer(typeof(IDataItemContainer), BindingDirection.TwoWay)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DefaultValue("")]
        public ITemplate InsertItemTemplate {
            get { return _insertItemTemplate; }
            set { _insertItemTemplate = value; }
        }

        /// <summary>
        /// A template to display for items in the list
        /// </summary>
        [Browsable(false)]
        [TemplateContainer(typeof(IDataItemContainer), BindingDirection.TwoWay)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DefaultValue("")]
        public ITemplate ItemTemplate {
            get { return _itemTemplate; }
            set { _itemTemplate = value; }
        }

        /// <summary>
        /// A collection of reodered list items
        /// </summary>
        [Browsable(false)]
        public ReorderListItemCollection Items {
            get {
                EnsureDataBound();
                return new ReorderListItemCollection(this);
            }
        }

        /// <summary>
        /// The type of a layout to apply to items. If Table is selected, the DragHandleAlignment property
        /// is used to lay out items in relation to the drag handle. If not, items are simply wrapped in
        /// the Panel controls and can be positioned using CSS
        /// </summary>
        [DefaultValue(ReorderListItemLayoutType.Table)]
        public ReorderListItemLayoutType LayoutType {
            get { return _layoutType; }
            set { _layoutType = value; }
        }

        /// <summary>
        /// Determines whether or not to do a postback on reordering
        /// </summary>
        [DefaultValue("true")]
        public bool PostBackOnReorder {
            get { return GetPropertyValue("PostBackOnReorder", false); }
            set { SetPropertyValue("PostBackOnReorder", value); }
        }

        /// <summary>
        /// The name of a column that controls the sort order of rows in the data base
        /// </summary>
        [DefaultValue("")]
        public string SortOrderField {
            get { return GetPropertyValue("SortOrderField", String.Empty); }
            set { SetPropertyValue("SortOrderField", value); }
        }

        /// <summary>
        /// A template to use as a visible drop element when a user is dragging an item.
        /// This template is not data-bindable
        /// </summary>
        [Browsable(false)]
        [TemplateContainer(typeof(ReorderListItem))]
        [PersistenceMode(PersistenceMode.InnerDefaultProperty)]
        [DefaultValue("")]
        public ITemplate ReorderTemplate {
            get { return _reorderTemplate; }
            set { _reorderTemplate = value; }
        }

        /// <summary>
        /// Determines whether or not the InsertItem is shown. If this value is
        /// not set and the InsertItemTemplate is set, the default value is set to true
        /// </summary>
        [DefaultValue(false)]
        public bool ShowInsertItem {
            get { return GetPropertyValue("ShowInsertItem", InsertItemTemplate != null); }
            set { SetPropertyValue("ShowInsertItem", value); }
        }

        // This control renders a DIV
        protected override HtmlTextWriterTag TagKey {
            get { return HtmlTextWriterTag.Div; }
        }

        public ReorderList() {

        }

        // Helper method to copy the values from one dictionary to another.
        static IDictionary CopyDictionary(IDictionary source, IDictionary dest) {
            if(dest == null)
                dest = new OrderedDictionary(source.Count);

            foreach(DictionaryEntry de in source) {
                dest[de.Key] = de.Value;
            }

            return dest;
        }

        void ClearChildren() {
            ChildList.Controls.Clear();
            _dropTemplateControl = null;

            if(_draggableItems != null) {
                foreach(var item in _draggableItems) {
                    if(item.Extender != null)
                        item.Extender.Dispose();
                }
            }
            _draggableItems = null;

            for(int i = Controls.Count - 1; i >= 0; i--) {
                if(Controls[i] is DropWatcherExtender) {
                    Controls[i].Dispose();

                }
            }
        }

        // This method does the heavy lifting of building the control hierarchy from a dataSource.
        // If no datasource is passed in, for example when a postback occurs, it creates a dummy list
        // based on the number of items it last had.
        protected override int CreateChildControls(IEnumerable dataSource, bool dataBinding) {
            ClearChildren();

            var countDelta = 0;

            var keysArray = DataKeysArray;
            itemsArray = new ArrayList();
            var count = DesignMode ? 1 : 0;

            if(dataBinding) {
                keysArray.Clear();

                var c = dataSource as ICollection;

                if(c != null) {
                    keysArray.Capacity = c.Count;
                    itemsArray.Capacity = c.Count;
                }
            }

            if(dataSource != null) {
                var keyField = DataKeyField;
                var storeKey = (dataBinding && !String.IsNullOrEmpty(keyField));

                var hasDragHandle = AllowReorder && (DragHandleTemplate != null);

                count = 0;
                var index = 0;

                // for each item in the list, create it's ReorderListItem
                // which gets automatically added to the parent.
                //
                foreach(var dataItem in dataSource) {
                    if(storeKey)
                        keysArray.Add(DataBinder.GetPropertyValue(dataItem, keyField));

                    var itemType = ListItemType.Item;

                    if(index == EditItemIndex)
                        itemType = ListItemType.EditItem;

                    CreateItem(index, dataBinding, dataItem, itemType, hasDragHandle);

                    count++;
                    index++;
                }

                // add the insert item if needed.
                //
                if(ShowInsertItem && InsertItemTemplate != null) {
                    CreateInsertItem(index);
                    countDelta++;
                }
            }

            if(AllowReorder && count > 1 && _draggableItems != null) {
                // we should now have a list of items that can be dragged,
                // setup the the extender behaviors for them.
                //
                foreach(DraggableListItemInfo dlii in _draggableItems) {
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
                if(PostBackOnReorder)
                    _dropWatcherExtender.PostBackCode = Page.ClientScript.GetPostBackEventReference(this, ArgReplace);
                else {
                    _dropWatcherExtender.PostBackCode = Page.ClientScript.GetCallbackEventReference(this, "'" + ArgReplace + "'", ArgSuccess, "'" + ArgContext + "'", ArgError, true);
                    _dropWatcherExtender.ArgContextString = ArgContext;
                    _dropWatcherExtender.ArgSuccessString = ArgSuccess;
                    _dropWatcherExtender.ArgErrorString = ArgError;
                }
                _dropWatcherExtender.EnableClientState = !PostBackOnReorder;

                _dropWatcherExtender.BehaviorID = UniqueID + "_dItemEx";
                _dropWatcherExtender.TargetControlID = ChildList.ID;

                this.Controls.Add(_dropWatcherExtender);
            }

            return ChildList.Controls.Count - countDelta;
        }


        // Creates the control that will be our reorder template.
        Control CreateReorderArea(int index, string reorderKey) {
            var reorderContainer = new Panel();
            reorderContainer.ID = String.Format(CultureInfo.InvariantCulture, "__drop{1}{0}", index, reorderKey);

            if(ReorderTemplate != null)
                ReorderTemplate.InstantiateIn(reorderContainer);

            return reorderContainer;
        }

        protected virtual ReorderListItem CreateInsertItem(int index) {
            if(InsertItemTemplate != null && ShowInsertItem) {
                var item = new ReorderListItem(index, true);
                InsertItemTemplate.InstantiateIn(item);
                ChildList.Controls.Add(item);
                return item;
            }
            return null;
        }

        // Builds the drag handle element and the table which controls it's alignment
        protected virtual void CreateDragHandle(ReorderListItem item) {
            if(!AllowReorder)
                return;

            Control dragHolder = item;
            if(DragHandleTemplate != null) {

                Control outerItem = null;
                Control itemParent = null;

                if(LayoutType == ReorderListItemLayoutType.User) {

                    outerItem = new Panel();
                    Panel itemCell = new Panel();
                    Panel handleCell = new Panel();

                    dragHolder = handleCell;
                    itemParent = itemCell;

                    if(DragHandleAlignment == ReorderHandleAlignment.Left ||
                        DragHandleAlignment == ReorderHandleAlignment.Top) {
                        outerItem.Controls.Add(handleCell);
                        outerItem.Controls.Add(itemCell);
                    } else {
                        outerItem.Controls.Add(itemCell);
                        outerItem.Controls.Add(handleCell);
                    }
                } else {
                    // we'll use a table to organize all of this.  Set it up.
                    //
                    var itemTable = new Table();
                    outerItem = itemTable;
                    itemTable.BorderWidth = 0;
                    itemTable.Style.Add("border-spacing", "0 0");

                    // we keep track of two cells: one to put the item in,
                    // on to put the handle in.
                    //
                    var itemCell = new TableCell();
                    itemParent = itemCell;
                    itemCell.Width = new Unit(100, UnitType.Percentage);
                    itemCell.Style.Add("padding", "0");

                    var handleCell = new TableCell();
                    handleCell.Style.Add("padding", "0");
                    dragHolder = handleCell;

                    // based on the alignment value, we set up the cells in the table.
                    //
                    switch(DragHandleAlignment) {
                        case ReorderHandleAlignment.Left:
                        case ReorderHandleAlignment.Right:

                            var r = new TableRow();

                            if(DragHandleAlignment == ReorderHandleAlignment.Left) {
                                r.Cells.Add(handleCell);
                                r.Cells.Add(itemCell);
                            } else {
                                r.Cells.Add(itemCell);
                                r.Cells.Add(handleCell);
                            }
                            itemTable.Rows.Add(r);
                            break;

                        case ReorderHandleAlignment.Top:
                        case ReorderHandleAlignment.Bottom:

                            var itemRow = new TableRow();
                            var handleRow = new TableRow();

                            itemRow.Cells.Add(itemCell);
                            handleRow.Cells.Add(handleCell);

                            if(DragHandleAlignment == ReorderHandleAlignment.Top) {
                                itemTable.Rows.Add(handleRow);
                                itemTable.Rows.Add(itemRow);
                            } else {
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
                var holderItem = new ReorderListItem(item, HtmlTextWriterTag.Div);
                DragHandleTemplate.InstantiateIn(holderItem);
                dragHolder.Controls.Add(holderItem);

                // add the table
                //
                item.Controls.Add(outerItem);
            } else {
                // otherwise we just create dummy holder (apologies to dummies).
                //
                var holderPanel = new Panel();
                MoveChildren(item, holderPanel);
                dragHolder = holderPanel;
                item.Controls.Add(holderPanel);
            }

            dragHolder.ID = String.Format(CultureInfo.InvariantCulture, "__dih{0}", item.ItemIndex);

            // add the item we created to the draggableItems list.
            //
            if(_draggableItems == null)
                _draggableItems = new List<DraggableListItemInfo>();

            var dlii = new DraggableListItemInfo();
            dlii.TargetControl = item;
            dlii.HandleControl = dragHolder;
            _draggableItems.Add(dlii);
        }

        // Creates a item at the specified index and binds it to the given data source.
        protected virtual ReorderListItem CreateItem(int index, bool dataBind, object dataItem, ListItemType itemType, bool hasDragHandle) {
            if(itemType != ListItemType.Item && itemType != ListItemType.EditItem && itemType != ListItemType.Separator)
                throw new ArgumentException("Unknown value", "itemType");

            var item = new ReorderListItem(dataItem, index, itemType);
            item.ClientIDMode = ClientIDMode.AutoID;

            OnItemCreated(new ReorderListItemEventArgs(item));

            var template = ItemTemplate;

            if(index == EditItemIndex) {
                template = EditItemTemplate;
            }

            if(itemType == ListItemType.Separator) {
                template = ReorderTemplate;
            }

            if(template != null) {
                template.InstantiateIn(item);
            }

            if(itemType == ListItemType.Item && template == null && dataItem != null && DataSource is IList) {
                // if we don't have a type, and we're bound to an IList, just convert the value.
                //
                var tc = TypeDescriptor.GetConverter(dataItem);
                if(tc != null) {
                    var l = new Label();
                    l.Text = tc.ConvertToString(null, CultureInfo.CurrentUICulture, dataItem);
                    item.Controls.Add(l);
                }
            }

            CreateDragHandle(item);

            ChildList.Controls.Add(item);

            if(dataBind) {
                item.DataBind();
                OnItemDataBound(new ReorderListItemEventArgs(item));
                item.DataItem = null;
            }

            return item;
        }

        protected virtual bool DoReorder(int oldIndex, int newIndex) {
            if(IsBoundUsingDataSourceID && SortOrderField != null) {
                var dsv = GetData();

                var w = new System.Threading.EventWaitHandle(false, EventResetMode.AutoReset);
                var success = false;
                RequiresDataBinding = true;

                try {

                    // get the data that's currently in the database
                    //
                    dsv.Select(new DataSourceSelectArguments(),
                        delegate(IEnumerable dataSource) {
                            success = DoReorderInternal(dataSource, oldIndex, newIndex, dsv);
                            w.Set();
                        }
                    );

                    w.WaitOne();
                    // wait for the select to finish - this makes an async operation look
                    // like a synchronous one.
                    //
                } catch(Exception ex) {
                    CallbackResult = ex.Message;
                    throw;
                }

                return success;
            } else if(DataSource is DataTable || DataSource is DataView) {
                var dt = DataSource as DataTable;

                if(dt == null) {
                    dt = ((DataView)DataSource).Table;
                }

                return DoReorderInternal(dt, oldIndex, newIndex);
            } else if(DataSource is IList && !((IList)DataSource).IsReadOnly) {
                var ds = (IList)DataSource;

                var value = ds[oldIndex];

                if(oldIndex > newIndex) {
                    for(var i = oldIndex; i > newIndex; i--) {
                        // copy all the items up
                        ds[i] = ds[i - 1];
                    }
                } else {
                    for(var i = oldIndex; i < newIndex; i++) {
                        ds[i] = ds[i + 1];
                    }
                }

                ds[newIndex] = value;

                return true;
            }
            return false;
        }

        // Reorder row [oldIndex] to position [newIndex] in a datatable.
        bool DoReorderInternal(DataTable dataSource, int oldIndex, int newIndex) {
            if(String.IsNullOrEmpty(SortOrderField)) {
                return false;
            }

            var start = Math.Min(oldIndex, newIndex);
            var end = Math.Max(oldIndex, newIndex);

            var filter = String.Format(CultureInfo.InvariantCulture, "{0} >= {1} AND {0} <= {2}", SortOrderField, start, end);

            var rows = dataSource.Select(filter, SortOrderField + " ASC");

            var column = dataSource.Columns[SortOrderField];
            var newValue = rows[newIndex - start][column];

            // reorder the list to reflect the new sort.
            //
            if(oldIndex > newIndex) {
                for(var i = 0; i < rows.Length - 1; i++) {
                    rows[i][column] = rows[i + 1][column];
                }
            } else {
                for(var i = rows.Length - 1; i > 0; i--) {
                    rows[i][column] = rows[i - 1][column];
                }
            }

            rows[oldIndex - start][column] = newValue;

            dataSource.AcceptChanges();
            return true;
        }

        // Does the real work of the reorder.  It moves the item from oldIndex to newIndex in the given data source.
        bool DoReorderInternal(IEnumerable dataSource, int oldIndex, int newIndex, DataSourceView dsv) {
            var sortField = SortOrderField;

            // get the values for each row that we'll be modifying.
            //               
            var valuesList = new List<IOrderedDictionary>(Math.Abs(oldIndex - newIndex));

            var start = Math.Min(oldIndex, newIndex);
            var end = Math.Max(oldIndex, newIndex);

            if(start == end) {
                return false;
            }

            var i = 0;
            foreach(var row in dataSource) {
                try {
                    if(i < start) {
                        continue;
                    }

                    if(i > end) {
                        break;
                    }

                    var values = new OrderedDictionary();
                    var keys = new Hashtable();

                    var props = TypeDescriptor.GetProperties(row);

                    foreach(PropertyDescriptor p in props) {
                        var value = p.GetValue(row);

                        // convert DBNulls to Null (See Issue 5900)
                        if(p.PropertyType.IsValueType && value == DBNull.Value) {
                            value = null;
                        }

                        values[p.Name] = value;

                        if(p.Name == DataKeyField) {
                            keys[p.Name] = values[p.Name];
                            values.Remove(p.Name);
                        }
                    }

                    // stuff the row into the newValues, we'll use it later.
                    //
                    values[KeysKey] = keys;
                    valuesList.Add(values);
                } finally {
                    i++;
                }
            }

            // now that we've got the values, swap them in the list.
            // First, make the indexes zero-based.
            //
            oldIndex -= start;
            newIndex -= start;

            var startOrder = int.MinValue;

            // figure out the current sort value of the highest item in the
            // list.
            //
            if(valuesList.Count > 0 && valuesList[0].Contains(sortField)) {
                var startValue = valuesList[0][sortField];

                string startValueAsString;

                if(startValue is int) {
                    // optimize the common case
                    //
                    startOrder = (int)startValue;
                } else if((startValueAsString = startValue as string) != null) {
                    if(!Int32.TryParse(startValueAsString, NumberStyles.Integer, CultureInfo.InvariantCulture, out startOrder)) {
                        return false;
                    }
                } else {
                    // handle all the various int flavors...
                    //
                    if(startValue != null && startValue.GetType().IsValueType && startValue.GetType().IsPrimitive) {
                        startOrder = Convert.ToInt32(startValue, CultureInfo.InvariantCulture);
                        return true;
                    }
                    return false;
                }
            } else {
                throw new InvalidOperationException("Couldn't find sort field '" + SortOrderField + "' in bound data.");
            }

            // start at zero if we couldn't find anything.
            if(startOrder == int.MinValue) {
                startOrder = 0;
            }

            // swap the items in the list itself.
            //
            var targetItem = valuesList[oldIndex];
            valuesList.RemoveAt(oldIndex);
            valuesList.Insert(newIndex, targetItem);

            // walk through each of them and update the source column
            //
            foreach(var values in valuesList) {
                // pull the keys back out.
                //                
                var keys = (IDictionary)values[KeysKey];

                // remove it from our values collection so it doesn't
                // get based to the data source
                //
                values.Remove(KeysKey);

                // Copy the current values to use as the old values.
                //
                var oldValues = CopyDictionary(values, null);

                // update the sort index
                //
                values[sortField] = startOrder++;

                // now call update with the new sort value.
                //
                dsv.Update(keys, values, oldValues,
                    delegate(int rowsAffected, Exception ex) {
                        if(ex != null)
                            throw new Exception("Failed to reorder.", ex);

                        return true;
                    }
                );
            }
            return true;
        }

        protected override void OnPreRender(EventArgs e) {
            // on pre render, see if an async call back happened.
            // if so, flip requires data binding.
            //
            if(DataBindPending)
                RequiresDataBinding = true;

            base.OnPreRender(e);
        }


        // Get the template to give us the current values for each field we need.
        void ExtractRowValues(IOrderedDictionary fieldValues, ReorderListItem item, bool includePrimaryKey, bool isAddOperation) {
            if(fieldValues == null)
                return;

            var bindableTemplate = ItemTemplate as IBindableTemplate;

            if(!isAddOperation) {
                switch(item.ItemType) {
                    case ListItemType.Item:
                        break;
                    case ListItemType.EditItem:
                        bindableTemplate = EditItemTemplate as IBindableTemplate;
                        break;
                    default:
                        return;
                }
            } else {
                bindableTemplate = InsertItemTemplate as IBindableTemplate;
            }

            if(bindableTemplate != null) {
                var keyName = DataKeyField;

                var newValues = bindableTemplate.ExtractValues(item);

                foreach(DictionaryEntry entry in newValues) {
                    // put the value in unless it's the primary key, we get that elsewhere.
                    //
                    if(includePrimaryKey || 0 != String.Compare((string)entry.Key, keyName, StringComparison.OrdinalIgnoreCase)) {
                        fieldValues[entry.Key] = entry.Value;
                    }
                }
            }
        }

        // Creates our DropTemplate control. The DragDropList behavior uses a second UL control to
        // do the actual drags. That control has children that represent the item to use as the dropTemplate
        // or empty template. This method creates that structure.
        protected WebControl GetDropTemplateControl(out Control dropItem, out Control emptyItem) {
            dropItem = null;
            emptyItem = null;
            if(!AllowReorder || DesignMode)
                return null;

            if(_dropTemplateControl == null) {
                var bl = new BulletedList();

                // make sure it doesn't show up.
                bl.Style["visibility"] = "hidden";
                bl.Style["display"] = "none";

                var dropAreaItem = new BulletedListItem();
                dropAreaItem.ID = "_dat";
                dropAreaItem.Style["vertical-align"] = "middle";

                if(ReorderTemplate == null)
                    dropAreaItem.Style["border"] = "1px solid black";
                else
                    ReorderTemplate.InstantiateIn(dropAreaItem);

                dropItem = dropAreaItem;
                bl.Controls.Add(dropAreaItem);
                _dropTemplateControl = bl;
                this.Controls.Add(bl);
            } else {
                dropItem = _dropTemplateControl.FindControl("_dat");
                emptyItem = null;
            }
            return (WebControl)_dropTemplateControl;
        }

        // Walks the database to find the correct value for a new item inserted into the list.
        int GetNewItemSortValue(out bool success) {
            var dsv = GetData();

            var w = new System.Threading.EventWaitHandle(false, EventResetMode.AutoReset);

            var newIndex = 0;
            var bSuccess = false;

            dsv.Select(new DataSourceSelectArguments(),
                delegate(IEnumerable dataSource) {
                    try {
                        // look for the first or last row, based on our InsertItemLocation
                        //
                        var list = dataSource as IList;

                        if(list == null) {
                            return;
                        }

                        if(0 == list.Count) {
                            bSuccess = true;
                            return;
                        }

                        object row = null;
                        var delta = 1;

                        if(ItemInsertLocation == ReorderListInsertLocation.End) {
                            row = list[list.Count - 1];
                        } else {
                            row = list[0];
                            delta = -1;
                        }

                        var rowProp = TypeDescriptor.GetProperties(row)[SortOrderField];

                        if(rowProp != null) {
                            var rowValue = rowProp.GetValue(row);

                            if(rowValue is int) {
                                newIndex = (int)rowValue + delta;
                                bSuccess = true;
                            }
                        }
                    } finally {
                        w.Set();
                    }
                }
            );

            w.WaitOne();

            success = bSuccess;

            return newIndex;
        }

        void HandleCancel(ReorderListCommandEventArgs e) {
            if(IsBoundUsingDataSourceID) {
                EditItemIndex = -1;
                RequiresDataBinding = true;
            }
            OnCancelCommand(e);
        }

        void HandleDelete(ReorderListCommandEventArgs e) {
            if(IsBoundUsingDataSourceID) {
                var view = GetData();

                if(view != null) {
                    IDictionary oldValues;
                    IOrderedDictionary newValues;
                    IDictionary keys;
                    PrepareRowValues(e, out oldValues, out newValues, out keys);

                    view.Delete(keys, oldValues,
                        delegate(int rows, Exception ex) {
                            if(ex != null)
                                return false;
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

        void HandleEdit(ReorderListCommandEventArgs e) {
            if(e.Item.ItemType == ListItemType.Item) {
                EditItemIndex = e.Item.ItemIndex;
                RequiresDataBinding = true;
            }
            OnEditCommand(e);
        }

        void HandleInsert(ReorderListCommandEventArgs e) {
            if(IsBoundUsingDataSourceID && SortOrderField != null) {
                IDictionary oldValues;
                IOrderedDictionary newValues;
                IDictionary keys;

                PrepareRowValues(e, out oldValues, out newValues, out keys, true);

                var view = GetData();

                bool success;

                var newIndex = GetNewItemSortValue(out success);

                if(success)
                    newValues[SortOrderField] = newIndex;

                if(view != null) {
                    view.Insert(newValues,
                        delegate(int rows, Exception ex) {
                            if(ex != null)
                                return false;
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

        void HandleUpdate(ReorderListCommandEventArgs e, int itemIndex) {
            if(IsBoundUsingDataSourceID) {
                IDictionary oldValues;
                IOrderedDictionary newValues;
                IDictionary keys;

                if(e == null && itemIndex != -1) {
                    e = new ReorderListCommandEventArgs(new CommandEventArgs("Update", null), this, (ReorderListItem)ChildList.Controls[itemIndex]);
                }

                PrepareRowValues(e, out oldValues, out newValues, out keys);

                var view = GetData();

                if(view != null) {
                    view.Update(keys, newValues, oldValues,
                        delegate(int rows, Exception ex) {
                            if(ex != null)
                                return false;
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

        static void MoveChildren(Control source, Control dest) {
            for(var i = source.Controls.Count - 1; i >= 0; i--)
                dest.Controls.AddAt(0, source.Controls[i]);
        }

        protected override bool OnBubbleEvent(object source, EventArgs args) {
            var ce = args as ReorderListCommandEventArgs;
            if(ce != null) {
                OnItemCommand(ce);

                if(ce.CommandArgument != null) {

                    var command = ce.CommandName.ToString(CultureInfo.InvariantCulture).ToUpperInvariant();

                    switch(command) {
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

        protected virtual void OnItemCreated(EventArgs e) {
            Invoke(ItemCreatedKey, e);
        }

        protected virtual void OnItemDataBound(EventArgs e) {
            Invoke(ItemDataBoundKey, e);
        }

        protected virtual void OnItemCommand(EventArgs e) {
            Invoke(ItemCommandKey, e);
        }

        protected virtual void OnItemReorder(ReorderListItemReorderEventArgs e) {
            try {
                if((DataSource != null || IsBoundUsingDataSourceID) && !DoReorder(e.OldIndex, e.NewIndex))
                    throw new InvalidOperationException("Can't reorder data source.  It is not a DataSource and does not implement IList.");
            } catch(Exception ex) {
                CallbackResult = ex.Message;
                throw;
            }
            Invoke(ItemReorderKey, e);
        }

        protected virtual void OnCancelCommand(EventArgs e) {
            Invoke(CancelCommandKey, e);
        }

        protected virtual void OnDeleteCommand(EventArgs e) {
            Invoke(DeleteCommandKey, e);
        }

        protected virtual void OnEditCommand(EventArgs e) {
            Invoke(EditCommandKey, e);
        }

        protected virtual void OnInsertCommand(EventArgs e) {
            Invoke(InsertCommandKey, e);
        }

        protected virtual void OnUpdateCommand(EventArgs e) {
            Invoke(UpdateCommandKey, e);
        }

        protected void Invoke(object key, EventArgs e) {
            var eventHandler = Events[key];

            if(eventHandler != null)
                eventHandler.DynamicInvoke(this, e);
        }

        protected override void PerformDataBinding(IEnumerable data) {
            ClearChildren();
            base.PerformDataBinding(data);

            if(IsBoundUsingDataSourceID && EditItemIndex != -1 && EditItemIndex < Controls.Count && IsViewStateEnabled) {
                // if we're editing, pick up the bound original values.
                //
                BoundFieldValues.Clear();
                ExtractRowValues(BoundFieldValues, ChildList.Controls[EditItemIndex] as ReorderListItem, false, false);
            }
        }

        void PrepareRowValues(ReorderListCommandEventArgs e, out IDictionary oldValues, out IOrderedDictionary newValues, out IDictionary keys) {
            PrepareRowValues(e, out oldValues, out newValues, out keys, false);
        }

        // Extracts the values from an editable row into the given dictionaries.
        private void PrepareRowValues(ReorderListCommandEventArgs e, out IDictionary oldValues, out IOrderedDictionary newValues, out IDictionary keys, bool isAddOperation) {
            if(!isAddOperation)
                oldValues = CopyDictionary(BoundFieldValues, null);
            else
                oldValues = null;


            newValues = new OrderedDictionary(oldValues == null ? 0 : oldValues.Count);

            if(DataKeyField != null && !isAddOperation) {
                keys = new OrderedDictionary(1);

                keys[DataKeyField] = DataKeysArray[e.Item.ItemIndex];
            } else
                keys = null;

            ExtractRowValues(newValues, e.Item, true, isAddOperation);
        }

        // Handle a reorder event from a server postback.
        void ProcessReorder(int oldIndex, int newIndex) {
            try {
                Debug.Assert(oldIndex >= 0, "Old index for reorder is < 0 (" + oldIndex + ")");
                Debug.Assert(oldIndex < Items.Count, "Old index for reorder is > items (" + oldIndex + ")");
                Debug.Assert(newIndex >= 0, "New index for reorder is < 0 (" + newIndex + ")");
                Debug.Assert(newIndex < Items.Count, "New index for reorder is > items (" + newIndex + ")");

                // fire the event.
                //
                if((oldIndex != newIndex) && (Math.Max(oldIndex, newIndex) != DataKeysArray.Count)) {
                    Control item = Items[oldIndex];

                    OnItemReorder(new ReorderListItemReorderEventArgs(item as ReorderListItem, oldIndex, newIndex));
                } else {
                    //DataBind();
                }
            } catch(Exception ex) {
                Debug.Fail(ex.ToString());
                //TODO WHY ARE SWALLOWING THIS EXCEPTION!!!
            }
        }

        protected override void RenderContents(HtmlTextWriter writer) {
            // show the empty item template if necessary.
            //
            if(ChildList.Controls.Count == 0) {
                if(EmptyListTemplate != null) {
                    var p = new Panel();
                    p.ID = ClientID;
                    EmptyListTemplate.InstantiateIn(p);
                    p.RenderControl(writer);
                }
                return;
            }

            base.RenderContents(writer);
        }

        /// <summary>
        /// Updates the specified row with its current values
        /// </summary>
        /// <param name="rowIndex" type="Int">Row index</param>
        public void UpdateItem(int rowIndex) {
            HandleUpdate(null, rowIndex);
        }

        #region IRepeatInfoUser Members
        /// <summary>
        /// Returns style of the reorder list item
        /// </summary>
        /// <param name="itemType" type="ListItemType">Item type</param>
        /// <param name="repeatIndex" type="Int">Repeat index</param>
        /// <returns>Item style</returns>
        public Style GetItemStyle(ListItemType itemType, int repeatIndex) {
            var item = GetItem(itemType, repeatIndex);
            return item.ControlStyle;
        }

        /// <summary>
        /// Determines whether or not the list has a footer
        /// </summary>
        public bool HasFooter {
            get { return false; }
        }

        /// <summary>
        /// Determines whether or not the list has a header
        /// </summary>
        public bool HasHeader {
            get { return false; }
        }

        /// <summary>
        /// Determines whether or not the list has separators
        /// </summary>
        public bool HasSeparators {
            get { return false; }
        }

        /// <summary>
        /// Renders an item
        /// </summary>
        /// <param name="itemType" type="ListItemType">Item type</param>
        /// <param name="repeatIndex" type="Int">Repeat index</param>
        /// <param name="repeatInfo" type="RepeatInfo">Repeat into</param>
        /// <param name="writer" type="HtmlTextWriter">Writer</param>
        public void RenderItem(ListItemType itemType, int repeatIndex, RepeatInfo repeatInfo, HtmlTextWriter writer) {
            var item = GetItem(itemType, repeatIndex);
            item.RenderControl(writer);
        }

        ReorderListItem GetItem(ListItemType itemType, int repeatIndex) {
            switch(itemType) {
                case ListItemType.Item:
                case ListItemType.EditItem:
                    return (ReorderListItem)Controls[repeatIndex];
                case ListItemType.Separator:
                    return (ReorderListItem)Controls[repeatIndex * 2];
                default:
                    throw new ArgumentException("Unknown value", "itemType");
            }
        }

        /// <summary>
        /// Determines the count of repeated items
        /// </summary>
        public int RepeatedItemCount {
            get {
                if(itemsArray != null)
                    return itemsArray.Count;
                return 0;
            }
        }
        #endregion

        // Parse our postback string into the event name, which item it's on, and any arguments
        static bool ParsePostBack(string eventArgument, out string eventName, out string itemId, out string[] args) {
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
            var argParts = eventArgument.Split(':');

            if(argParts.Length < 2)
                return false;

            eventName = argParts[0];
            itemId = argParts[1];

            if(argParts.Length > 2) {
                args = new string[argParts.Length - 2];
                Array.Copy(argParts, 2, args, 0, args.Length);
            }
            return true;
        }

        protected void RaisePostBackEvent(string eventArgument) {
            string eventName;
            string itemId;
            string[] args;

            if(ParsePostBack(eventArgument, out eventName, out itemId, out args)) {
                switch(eventName) {
                    case "reorder":
                        ProcessReorder(Int32.Parse(args[0], CultureInfo.InvariantCulture), Int32.Parse(args[1], CultureInfo.InvariantCulture));
                        break;
                }
            }
        }

        #region ICallbackEventHandler Members

        string _callbackResult = String.Empty;

        string CallbackResult {
            get { return _callbackResult; }
            set { _callbackResult = value; }
        }

        string ICallbackEventHandler.GetCallbackResult() {
            return CallbackResult;
        }

        void ICallbackEventHandler.RaiseCallbackEvent(string eventArgument) {
            CallbackResult = string.Empty;
            RaisePostBackEvent(eventArgument);
        }
        #endregion

        #region IPostBackEventHandler Members
        void IPostBackEventHandler.RaisePostBackEvent(string eventArgument) {
            CallbackResult = string.Empty;
            RaisePostBackEvent(eventArgument);
        }
        #endregion

        protected V GetPropertyValue<V>(string propertyName, V nullValue) {
            if(ViewState[propertyName] == null) {
                return nullValue;
            }
            return (V)ViewState[propertyName];
        }

        protected void SetPropertyValue<V>(string propertyName, V value) {
            ViewState[propertyName] = value;
        }
    }

}
#pragma warning restore 1591