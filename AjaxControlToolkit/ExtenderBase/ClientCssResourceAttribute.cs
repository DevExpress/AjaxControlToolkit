#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {

    public class ClientCssResourceAttribute : ClientResourceAttribute {

        public ClientCssResourceAttribute(string resourcePath)
            : base(resourcePath) {
        }
    }

}

#pragma warning restore 1591