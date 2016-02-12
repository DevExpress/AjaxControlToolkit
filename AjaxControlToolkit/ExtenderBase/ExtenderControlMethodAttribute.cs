#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit {

    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public sealed class ExtenderControlMethodAttribute : Attribute {
        private bool _isScriptMethod;

        public ExtenderControlMethodAttribute()
            : this(true) {
        }

        public ExtenderControlMethodAttribute(bool isScriptMethod) {
            _isScriptMethod = isScriptMethod;
        }

        public bool IsScriptMethod {
            get { return _isScriptMethod; }
        }

    }

}
#pragma warning restore 1591