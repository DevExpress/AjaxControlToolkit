#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit {

    [AttributeUsage(AttributeTargets.Property, Inherited = true)]
    public sealed class ExtenderControlEventAttribute : Attribute {
        private bool _isScriptEvent;

        public ExtenderControlEventAttribute()
            : this(true) {
        }

        public ExtenderControlEventAttribute(bool isScriptEvent) {
            _isScriptEvent = isScriptEvent;
        }

        public bool IsScriptEvent {
            get { return _isScriptEvent; }
        }

    }

}
#pragma warning restore 1591