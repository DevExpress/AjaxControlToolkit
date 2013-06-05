

using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;

namespace AjaxControlToolkit
{
    public class ResolveControlEventArgs : EventArgs
    {
        private string _controlID;
        private Control _control;
        
        public ResolveControlEventArgs(string controlId)
        {
            _controlID = controlId;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string ControlID
        {
            get { return _controlID; }
        }

        public Control Control
        {
            get { return _control; }
            set { _control = value; }
        }       
    }
}
