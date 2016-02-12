#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit {

    [AttributeUsage(AttributeTargets.Property)]
    public sealed class ExtenderControlPropertyAttribute : Attribute {

        private bool _useJsonSerialization;
        private bool _isScriptProperty;

        public ExtenderControlPropertyAttribute()
            : this(true) {
        }

        public ExtenderControlPropertyAttribute(bool isScriptProperty)
            : this(isScriptProperty, false) {
        }

        public ExtenderControlPropertyAttribute(bool isScriptProperty, bool useJsonSerialization) {
            _isScriptProperty = isScriptProperty;
            _useJsonSerialization = useJsonSerialization;
        }

        public bool IsScriptProperty {
            get { return _isScriptProperty; }
        }

        public bool UseJsonSerialization {
            get { return _useJsonSerialization; }
        }

    }

}

#pragma warning restore 1591