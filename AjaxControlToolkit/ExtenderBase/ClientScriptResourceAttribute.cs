#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit {

    public sealed class ClientScriptResourceAttribute : ClientResourceAttribute {

        private string _componentType;

        public ClientScriptResourceAttribute(string componentType, string resourcePath)
            : base(resourcePath) {

            _componentType = componentType;
        }

        // The component type name to use when referencing the component class in XML.
        // If the XML reference is "<myns:Foo/>", the component type is "Foo".
        public string ComponentType {
            get { return _componentType; }
        }

    }

}
#pragma warning restore 1591