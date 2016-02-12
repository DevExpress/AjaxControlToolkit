#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;
using System.Web;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Design {

    /// A simple derived class of ControlID converter that lets us filter based on a type.
    /// This lets us have drop-downs in the property browser that pick a given Button or TextBox, etc.
    public class TypedControlIDConverter<T> : ControlIDConverter {
        protected override bool FilterControl(Control control) {
            return typeof(T).IsInstanceOfType(control);
        }
    }

}

#pragma warning restore 1591