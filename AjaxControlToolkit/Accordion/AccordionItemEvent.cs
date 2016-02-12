#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;

namespace AjaxControlToolkit {

    // The AccordionItemEventArgs is used to provide notication when
    // Accordion items are created, databound, etc.
    public class AccordionItemEventArgs : EventArgs {        
        AccordionContentPanel _item;
        AccordionItemType _type;

        public AccordionItemEventArgs(AccordionContentPanel item, AccordionItemType type) {
            _item = item;
            _type = type;
        }

        public AccordionContentPanel AccordionItem {
            get { return _item; }
        }

        public AccordionItemType ItemType {
            get { return _type; }
        }

        public object Item {
            get { return _item.DataItem; }
        }

        public int ItemIndex {
            get { return _item.DataItemIndex; }
        }
    }

}
#pragma warning restore 1591