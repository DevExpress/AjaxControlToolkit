#pragma warning disable 1591
using System;

namespace AjaxControlToolkit {

    public class CascadingDropDownNameValue {
        public string name;
        public string value;
        public bool isDefaultValue;
        public string optionTitle;

        public CascadingDropDownNameValue() {
        }

        public CascadingDropDownNameValue(string name, string value) {
            this.name = name;
            this.value = value;
        }

        public CascadingDropDownNameValue(string name, string value, bool defaultValue) {
            this.name = name;
            this.value = value;
            this.isDefaultValue = defaultValue;
        }
    }

}

#pragma warning restore 1591