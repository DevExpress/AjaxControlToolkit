#pragma warning disable 1591
using System;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    // The AccordionCommandEventArgs provides access to the container
    // AccordionContentPanel for data commands
    public class AccordionCommandEventArgs : CommandEventArgs {
        AccordionContentPanel _container;

        internal AccordionCommandEventArgs(AccordionContentPanel container, string commandName, object commandArg)
            : base(commandName, commandArg) {
            _container = container;
        }

        public AccordionContentPanel Container {
            get { return _container; }
        }
    }

}
#pragma warning restore 1591