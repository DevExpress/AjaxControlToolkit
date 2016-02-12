#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI;

namespace AjaxControlToolkit {

    public class ResolveControlEventArgs : EventArgs {
        private string _controlID;
        private Control _control;

        public ResolveControlEventArgs(string controlId) {
            _controlID = controlId;
        }

        public string ControlID {
            get { return _controlID; }
        }

        public Control Control {
            get { return _control; }
            set { _control = value; }
        }

    }

}

#pragma warning restore 1591