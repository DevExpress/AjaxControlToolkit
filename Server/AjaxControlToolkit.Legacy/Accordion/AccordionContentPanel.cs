

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Class that adds a naming container to Panel and wraps
    /// an extra div around the rendered HTML.  This extra div serves
    /// the same purpose as the manually inserted div of CollapsiblePanel.
    /// Since setting the height of an element with padding or margins to
    /// zero can still leave something visible, it is this wrapper div
    /// with no additional space that we actually attach to.
    /// </summary>
    public class AccordionContentPanel : Panel, INamingContainer, IDataItemContainer
    {
        /// <summary>
        /// Whether or not the panel should be initially collapsed
        /// </summary>
        private bool _collapsed;

        /// <summary>
        /// DataItem this content panel was bound to
        /// </summary>
        private object _dataItem;

        /// <summary>
        /// Index in the data source this item was bound to
        /// </summary>
        private int _dataIndex;

        /// <summary>
        /// Whether this panel represents a header or a content section
        /// </summary>
        private AccordionItemType _type;

        /// <summary>
        /// Internal default constructor to prevent external instantiation
        /// </summary>
        internal AccordionContentPanel()
        {
        }

        /// <summary>
        /// Internal constructor used to intialize a databound pane's content
        /// </summary>
        /// <param name="dataItem">DataItem</param>
        /// <param name="dataIndex">DataIndex</param>
        /// <param name="type">AccordionItemType</param>
        internal AccordionContentPanel(object dataItem, int dataIndex, AccordionItemType type)
            : this()
        {
            SetDataItemProperties(dataItem, dataIndex, type);
        }

        /// <summary>
        /// Whether or not the panel should be initially collapsed to a height of 1px
        /// </summary>
        public bool Collapsed
        {
            get { return _collapsed; }
            set
            {
                _collapsed = value;
                this.Style[HtmlTextWriterStyle.Display] = _collapsed ? "none" : "block";
            }
        }

        /// <summary>
        /// Whether this panel represents a header or a content section
        /// </summary>
        public AccordionItemType ItemType
        {
            get { return _type; }
        }

        /// <summary>
        /// DataItem this content panel was bound to
        /// </summary>
        public object DataItem
        {
            get { return _dataItem; }
        }

        /// <summary>
        /// Index in the data source this item was bound to
        /// </summary>
        public int DataItemIndex
        {
            get { return _dataIndex; }
        }

        /// <summary>
        /// Position of the item displayed in the Accordion
        /// </summary>
        public int DisplayIndex
        {
            get { return _dataIndex; }
        }

        /// <summary>
        /// Pass an AccordionCommandEventArgs whenever a CommandEvent is raised
        /// </summary>
        /// <param name="source">Source</param>
        /// <param name="args">EventArgs</param>
        /// <returns>If the event was handled</returns>
        protected override bool OnBubbleEvent(object source, EventArgs args)
        {
            CommandEventArgs commandArgs = args as CommandEventArgs;
            if (commandArgs != null)
            {
                AccordionCommandEventArgs accordionArgs = new AccordionCommandEventArgs(this, commandArgs.CommandName, commandArgs.CommandArgument);
                RaiseBubbleEvent(this, accordionArgs);
                return true;
            }
            return false;
        }

        /// <summary>
        /// Assign values to the data binding properties
        /// </summary>
        /// <param name="dataItem">Data item to bind to</param>
        /// <param name="dataIndex">Index in the data source of this item</param>
        /// <param name="type">Whether this item is a Header or Content section</param>
        internal void SetDataItemProperties(object dataItem, int dataIndex, AccordionItemType type)
        {
            _dataItem = dataItem;
            _dataIndex = dataIndex;
            _type = type;
        }
    }
}