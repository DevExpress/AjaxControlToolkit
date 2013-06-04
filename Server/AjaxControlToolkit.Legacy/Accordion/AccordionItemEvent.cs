

using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;

namespace AjaxControlToolkit
{
    /// <summary>
    /// The AccordionItemEventArgs is used to provide notication when
    /// Accordion items are created, databound, etc.
    /// </summary>
    public class AccordionItemEventArgs : EventArgs
    {
        /// <summary>
        /// Container control for the Accordion item
        /// </summary>
        private AccordionContentPanel _item;

        /// <summary>
        /// Type of the Accordion item (i.e. Header or Content)
        /// </summary>
        private AccordionItemType _type;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="item">Container</param>
        /// <param name="type">AccordionItemType</param>
        public AccordionItemEventArgs(AccordionContentPanel item, AccordionItemType type)
        {
            _item = item;
            _type = type;
        }

        /// <summary>
        /// Container
        /// </summary>
        public AccordionContentPanel AccordionItem
        {
            get { return _item; }
        }

        /// <summary>
        /// Type of the Accordion Item (either Header or Content)
        /// </summary>
        public AccordionItemType ItemType
        {
            get { return _type; }
        }

        /// <summary>
        /// DataItem being bound to the Container
        /// </summary>
        public object Item
        {
            get { return _item.DataItem; }
        }

        /// <summary>
        /// Index of the DataItem being bound to the Container
        /// </summary>
        public int ItemIndex
        {
            get { return _item.DataItemIndex; }
        }
    }
}