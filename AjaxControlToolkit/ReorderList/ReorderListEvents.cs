#pragma warning disable 1591
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    public class ReorderListItemReorderEventArgs : ReorderListItemEventArgs {
        int _oldIndex;
        int _newIndex;

        public int OldIndex {
            get { return _oldIndex; }
            set { _oldIndex = value; }
        }

        public int NewIndex {
            get { return _newIndex; }
            set { _newIndex = value; }
        }

        internal ReorderListItemReorderEventArgs(ReorderListItem item, int oldIndex, int newIndex)
            : base(item) {
            _oldIndex = oldIndex;
            _newIndex = newIndex;
        }
    }

    public class ReorderListCommandEventArgs : CommandEventArgs {
        ReorderListItem _item;
        object _source;


        // The item the command was fired on
        public ReorderListItem Item {
            get { return _item; }
            set { _item = value; }
        }

        // The source object that originally fired the event
        public object Source {
            get { return _source; }
            set { _source = value; }
        }

        internal ReorderListCommandEventArgs(CommandEventArgs ce, object source, ReorderListItem item)
            : base(ce) {
            _item = item;
            _source = source;
        }
    }

    // A generic EventArgs for events coming from ReorderListItems
    public class ReorderListItemEventArgs : EventArgs {
        ReorderListItem _item;

        public ReorderListItem Item {
            get { return _item; }
            set { _item = value; }
        }

        public ReorderListItemEventArgs(ReorderListItem item) {
            _item = item;
        }
    }

}
#pragma warning restore 1591