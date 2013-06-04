using System;
using System.ComponentModel;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit
{
    public class ComboBoxItemInsertEventArgs : CancelEventArgs
    {
        private ListItem _listItem;
        private ComboBoxItemInsertLocation _insertLocation;

        internal ComboBoxItemInsertEventArgs(string text, ComboBoxItemInsertLocation location)
        {
            _listItem = new ListItem(text);
            _insertLocation = location;
        }

        public ListItem Item
        {
            set { _listItem = value; }
            get { return _listItem; }
        }

        public ComboBoxItemInsertLocation InsertLocation
        {
            set { _insertLocation = value; }
            get { return _insertLocation; }
        }

    }
}
