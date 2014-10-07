using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit {

    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public sealed class ClientScriptResourceAttribute : Attribute {

        private int _loadOrder;
        private string _resourcePath;
        private string _componentType;

        public ClientScriptResourceAttribute(string componentType) {
            _componentType = componentType;
        }

        public ClientScriptResourceAttribute(string componentType, string fullResourceName)
            : this(componentType) {
            if(fullResourceName == null) throw new ArgumentNullException("fullResourceName");
            _resourcePath = fullResourceName;
        }

        public string ResourcePath {
            get { return _resourcePath; }
        }

        public int LoadOrder {
            get { return _loadOrder; }
        }

        // The component type name to use when referencing the component class in XML.
        // If the XML reference is "<myns:Foo/>", the component type is "Foo".
        public string ComponentType {
            get { return _componentType; }
        }

    }

}