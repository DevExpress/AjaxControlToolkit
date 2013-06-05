

using System;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit
{
    /// <summary>
    /// The AccordionCommandEventArgs provides access to the container
    /// AccordionContentPanel for data commands
    /// </summary>
    public class AccordionCommandEventArgs : CommandEventArgs
    {
        /// <summary>
        /// Container
        /// </summary>
        private AccordionContentPanel _container;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="container">Container</param>
        /// <param name="commandName">Command Name</param>
        /// <param name="commandArg">Command Argument</param>
        internal AccordionCommandEventArgs(AccordionContentPanel container, string commandName, object commandArg)
            : base(commandName, commandArg)
        {
            _container = container;
        }

        /// <summary>
        /// Container
        /// </summary>
        public AccordionContentPanel Container
        {
            get { return _container; }
        }
    }
}