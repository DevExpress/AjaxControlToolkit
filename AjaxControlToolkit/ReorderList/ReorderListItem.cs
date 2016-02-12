#pragma warning disable 1591
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    // This is the control that represents an item in the reorder list.
    // It's kind of special because it can either be an LI element or something else,
    // which is needed so the DragHandle can also be bindable (it's a child of a list item)
    [ToolboxItem(false)]
    public class ReorderListItem : WebControl, IDataItemContainer {
        object _dataItem;
        ReorderListItem _baseItem;
        HtmlTextWriterTag _tag = HtmlTextWriterTag.Li;
        int _itemIndex;
        ListItemType _itemType;
        bool _isAddItem /* = false */;

        // Item type.
        public ListItemType ItemType {
            get {
                if(_baseItem != null)
                    return _baseItem.ItemType;
                if(_isAddItem)
                    throw new InvalidOperationException("Item type isn't valid for Add items.");
                return _itemType;
            }
            set { _itemType = value; }
        }

        // Data item.
        public object DataItem {
            get {
                if(_baseItem != null)
                    return _baseItem.DataItem;
                return _dataItem;
            }
            set { _dataItem = value; }
        }

        // Item index.
        public int ItemIndex {
            get {
                if(_baseItem != null)
                    return _baseItem.ItemIndex;
                return _itemIndex;
            }
            set { _itemIndex = value; }
        }

        // Whether this item is new.
        public bool IsAddItem {
            get {
                if(_baseItem != null)
                    return _baseItem.IsAddItem;
                return _isAddItem;
            }
        }

        protected override HtmlTextWriterTag TagKey {
            get { return _tag; }
        }

        internal const string ItemBaseName = "_rli";

        internal ReorderListItem(ReorderListItem baseItem, HtmlTextWriterTag tag) {
            _baseItem = baseItem;
            _tag = tag;
        }

        public ReorderListItem(int index)
            : this(index, false) {
        }

        public ReorderListItem(int index, bool isAddItem) {
            _itemIndex = index;
            if(!isAddItem)
                ID = String.Format(CultureInfo.InvariantCulture, "{0}{1}", ItemBaseName, index);
            else
                ID = String.Format(CultureInfo.InvariantCulture, "{0}Insert", ItemBaseName);

            Style["vertical-align"] = "middle";
            _isAddItem = isAddItem;
        }

        public ReorderListItem(object dataItem, int index, ListItemType itemType)
            : this(index) {
            _dataItem = dataItem;
            _itemType = itemType;
        }

        protected override bool OnBubbleEvent(object source, EventArgs args) {
            var ceargs = args as CommandEventArgs;
            if(null != ceargs) {
                var e = new ReorderListCommandEventArgs(ceargs, source, this);

                RaiseBubbleEvent(this, e);
                return true;
            }
            return true;
        }

        #region IDataItemContainer Members

        // Data item index.
        public int DataItemIndex {
            get { return ItemIndex; }
        }

        // Display index.
        public int DisplayIndex {
            get { return ItemIndex; }
        }

        #endregion
    }

}
#pragma warning restore 1591