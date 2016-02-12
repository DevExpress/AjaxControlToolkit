#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI;

namespace AjaxControlToolkit {

    public interface IControlResolver {

        Control ResolveControl(string controlId);

    }

}

#pragma warning restore 1591