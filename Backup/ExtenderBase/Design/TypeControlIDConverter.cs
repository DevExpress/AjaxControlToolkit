


using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;
using System.Web;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Design
{
    /// <summary>
    /// A simple derived class of ControlID converter that lets us filter based on a type.
    /// 
    /// This lets us have drop-downs in the property browser that pick a given Button or TextBox, etc.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification="Following ASP.NET AJAX pattern")]
    public class TypedControlIDConverter<T> : ControlIDConverter
    {
        protected override bool FilterControl(Control control)
        {
            return typeof(T).IsInstanceOfType(control);
        }
    } 
}
