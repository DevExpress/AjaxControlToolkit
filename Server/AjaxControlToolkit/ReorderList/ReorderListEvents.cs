

using System;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.ComponentModel;
using System.Collections;
using System.Text.RegularExpressions;
using System.Collections.Specialized;

// This file contains all the EventArgs/EventHandler definitions for the reorder list.
//

namespace AjaxControlToolkit
{
    /// <summary>
    /// The EventArgs class for use with the ReorderList.Reorder event.
    /// </summary>
    public class ReorderListItemReorderEventArgs : ReorderListItemEventArgs
    {
        private int _oldIndex;
        private int _newIndex;

        /// <summary>
        /// The original index of the item
        /// </summary>
        public int OldIndex
        {
            get { return _oldIndex; }
            set { _oldIndex = value; }
        }

        /// <summary>
        /// The new index of the item
        /// </summary>
        public int NewIndex
        {
            get { return _newIndex; }
            set { _newIndex = value; }
        }

        internal ReorderListItemReorderEventArgs(ReorderListItem item, int oldIndex, int newIndex)
            : base(item)
        {
            _oldIndex = oldIndex;
            _newIndex = newIndex;
        }
    }

    /// <summary>
    /// The EventArgs class that's used for all the command events fired by the ReorderList
    /// </summary>
    public class ReorderListCommandEventArgs : CommandEventArgs
    {
        private ReorderListItem _item;
        private object _source;

        /// <summary>
        /// The item the command was fired on
        /// </summary>
        public ReorderListItem Item
        {
            get { return _item; }
            set { _item = value; }
        }

        /// <summary>
        /// The source object that originally fired the event
        /// </summary>
        public object Source
        {
            get { return _source; }
            set { _source = value; }
        }

        internal ReorderListCommandEventArgs(CommandEventArgs ce, object source, ReorderListItem item)
            : base(ce)
        {
            _item = item;
            _source = source;
        }
    }

    /// <summary>
    /// A generic EventArgs for events coming from ReorderListItems
    /// </summary>
    public class ReorderListItemEventArgs : EventArgs
    {
        private ReorderListItem _item;

        public ReorderListItem Item
        {
            get { return _item; }
            set { _item = value; }
        }

        public ReorderListItemEventArgs(ReorderListItem item)            
        {
            _item = item;
        }
    }
}
