#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit {

    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public sealed class RequiredScriptAttribute : Attribute {

        private int _order;
        private Type _extenderType;

        public RequiredScriptAttribute(Type extenderType)
            : this(extenderType, 0) {
        }

        public RequiredScriptAttribute(Type extenderType, int loadOrder) {
            _extenderType = extenderType;
            _order = loadOrder;
        }

        public int LoadOrder {
            get { return _order; }
        }

        public Type ExtenderType {
            get { return _extenderType; }
        }

    }

}
#pragma warning restore 1591