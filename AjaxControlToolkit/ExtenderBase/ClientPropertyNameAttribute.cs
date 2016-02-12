#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit {

    [AttributeUsage(AttributeTargets.Property)]
    public sealed class ClientPropertyNameAttribute : Attribute {
        private string _propertyName;

        public ClientPropertyNameAttribute(string propertyName) {
            _propertyName = propertyName;
        }

        public string PropertyName {
            get { return _propertyName; }
        }

    }

}
#pragma warning restore 1591