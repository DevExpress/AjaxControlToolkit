#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    // Class that adds a naming container to Panel and wraps
    // an extra div around the rendered HTML.  This extra div serves
    // the same purpose as the manually inserted div of CollapsiblePanel.
    // Since setting the height of an element with padding or margins to
    // zero can still leave something visible, it is this wrapper div
    // with no additional space that we actually attach to.
    public class AccordionContentPanel : Panel, INamingContainer, IDataItemContainer {
        bool _collapsed;
        object _dataItem;
        int _dataIndex;
        AccordionItemType _type;

        // Internal default constructor to prevent external instantiation
        internal AccordionContentPanel() {
        }

        // Internal constructor used to intialize a databound pane's content
        internal AccordionContentPanel(object dataItem, int dataIndex, AccordionItemType type)
            : this() {
            SetDataItemProperties(dataItem, dataIndex, type);
        }

        // Whether or not the panel should be initially collapsed to a height of 1px
        public bool Collapsed {
            get { return _collapsed; }
            set {
                _collapsed = value;
                this.Style[HtmlTextWriterStyle.Display] = _collapsed ? "none" : "block";
            }
        }

        public AccordionItemType ItemType {
            get { return _type; }
        }

        public object DataItem {
            get { return _dataItem; }
        }

        public int DataItemIndex {
            get { return _dataIndex; }
        }

        public int DisplayIndex {
            get { return _dataIndex; }
        }

        // Pass an AccordionCommandEventArgs whenever a CommandEvent is raised
        protected override bool OnBubbleEvent(object source, EventArgs args) {
            var commandArgs = args as CommandEventArgs;
            if(commandArgs != null) {
                var accordionArgs = new AccordionCommandEventArgs(this, commandArgs.CommandName, commandArgs.CommandArgument);
                RaiseBubbleEvent(this, accordionArgs);
                return true;
            }
            return false;
        }

        // Assign values to the data binding properties        
        internal void SetDataItemProperties(object dataItem, int dataIndex, AccordionItemType type) {
            _dataItem = dataItem;
            _dataIndex = dataIndex;
            _type = type;
        }
    }

}
#pragma warning restore 1591