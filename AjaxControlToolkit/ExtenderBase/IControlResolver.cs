using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI;

namespace AjaxControlToolkit {

    public interface IControlResolver {

        Control ResolveControl(string controlId);

    }

}

