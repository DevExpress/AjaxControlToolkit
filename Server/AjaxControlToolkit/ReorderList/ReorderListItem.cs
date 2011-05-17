


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

namespace AjaxControlToolkit
{
    /// <summary>
    /// This is the control that represents an item in the reorder list.
    /// 
    /// It's kind of special because it can either be an LI element or something else,
    /// which is needed so the DragHandle can also be bindable (it's a child of a list item)
    /// </summary>
    [ToolboxItem(false)]
    public class ReorderListItem : WebControl, IDataItemContainer
    {
        private object _dataItem;
        private ReorderListItem _baseItem;
        private HtmlTextWriterTag _tag = HtmlTextWriterTag.Li;
        private int _itemIndex;
        private ListItemType _itemType;
        private bool _isAddItem /* = false */;

        /// <summary>
        /// Deterimines the time of this item, such as a EditItem, InsertItem, etc.
        /// </summary>
        public ListItemType ItemType
        {
            get {
                if (_baseItem != null) return _baseItem.ItemType;
                if (_isAddItem) throw new InvalidOperationException("Item type isn't valid for Add items.");
                return _itemType; 
            }
            set { _itemType = value; }
        }

        /// <summary>
        /// The data object this item is bound to
        /// </summary>
        public object DataItem
        {
            get {
                if (_baseItem != null) return _baseItem.DataItem;
                return _dataItem; 
            }
            set { _dataItem = value; }
        }

        /// <summary>
        /// The index of this item
        /// </summary>
        public int ItemIndex
        {
            get {
                if (_baseItem != null) return _baseItem.ItemIndex;
                return _itemIndex; 
            }
            set { _itemIndex = value; }
        }

        /// <summary>
        /// Is this a new item?
        /// </summary>
        public bool IsAddItem
        {
            get
            {
                if (_baseItem != null) return _baseItem.IsAddItem;
                return _isAddItem;
            }            
        }

        protected override HtmlTextWriterTag TagKey
        {
            get
            {
                return _tag;
            }
        }

        internal const string ItemBaseName = "_rli";

        internal ReorderListItem(ReorderListItem baseItem, HtmlTextWriterTag tag)
        {
            _baseItem = baseItem;
            _tag = tag;            
        }

        public ReorderListItem(int index) : this(index, false)
        {           
        }

        public ReorderListItem(int index, bool isAddItem)
        {
            _itemIndex = index;
            if (!isAddItem)
            {
                ID = String.Format(CultureInfo.InvariantCulture , "{0}{1}", ItemBaseName, index);
            }
            else
            {
                ID = String.Format(CultureInfo.InvariantCulture, "{0}Insert", ItemBaseName);
            }
            Style["vertical-align"] = "middle";            
            _isAddItem = isAddItem;
        }

        public ReorderListItem(object dataItem, int index, ListItemType itemType) : this(index)
        {
            _dataItem = dataItem;
            _itemType = itemType;                        
        }

        /// <summary>
        /// When we get a bubble event, we create our ReorderListCommandArgs object
        /// and pass the event up to our parent to handle.
        /// </summary>
        protected override bool OnBubbleEvent(object source, EventArgs args)
        {
            CommandEventArgs ceargs = args as CommandEventArgs;
            if (null != ceargs)
            {
                ReorderListCommandEventArgs e = new ReorderListCommandEventArgs(ceargs, source, this);

                RaiseBubbleEvent(this, e);
                return true;
            }
            return true;
        }

        #region IDataItemContainer Members

        // DataItem implemented above

        public int DataItemIndex
        {
            get { return ItemIndex; }
        }

        public int DisplayIndex
        {
            get { return ItemIndex; }
        }

        #endregion
    }
        
}
