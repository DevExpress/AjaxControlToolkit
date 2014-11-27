using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit.HtmlEditor.Sanitizer {

    internal class HtmlAttributeWrapper : IHtmlAttribute {
        HtmlAttribute _wrappedAttribute;

        public HtmlAttributeWrapper(HtmlAttribute wrappedAttribute) {
            if(wrappedAttribute == null)
                throw new ArgumentNullException("wrappedAttribute");

            _wrappedAttribute = wrappedAttribute;
        }

        public string Name {
            get { return _wrappedAttribute.Name; }
        }

        public string Value {
            get { return _wrappedAttribute.Value; }
            set { _wrappedAttribute.Value = value; }
        }

        public void Remove() {
            _wrappedAttribute.Remove();
        }
    }

}