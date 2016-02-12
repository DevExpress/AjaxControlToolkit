#pragma warning disable 1591
using System.ComponentModel;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    public class ComboBoxItemInsertEventArgs : CancelEventArgs {
        ListItem _listItem;
        ComboBoxItemInsertLocation _insertLocation;

        internal ComboBoxItemInsertEventArgs(string text, ComboBoxItemInsertLocation location) {
            _listItem = new ListItem(text);
            _insertLocation = location;
        }

        public ListItem Item {
            set { _listItem = value; }
            get { return _listItem; }
        }

        public ComboBoxItemInsertLocation InsertLocation {
            set { _insertLocation = value; }
            get { return _insertLocation; }
        }
    }

}

#pragma warning restore 1591