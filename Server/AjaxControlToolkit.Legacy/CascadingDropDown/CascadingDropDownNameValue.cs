


using System;

namespace AjaxControlToolkit
{
    [Serializable]
    public class CascadingDropDownNameValue
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1051:DoNotDeclareVisibleInstanceFields", Justification = "Necessary for web service serialization")]
        public string name;

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1051:DoNotDeclareVisibleInstanceFields", Justification = "Necessary for web service serialization")]
        public string value;

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1051:DoNotDeclareVisibleInstanceFields", Justification = "Necessary for web service serialization")]
        public bool isDefaultValue;

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1051:DoNotDeclareVisibleInstanceFields", Justification = "Necessary for web service serialization")]
        public string optionTitle;

        public CascadingDropDownNameValue()
        {
        }

        public CascadingDropDownNameValue(string name, string value)
        {
            this.name = name;
            this.value = value;
        }

        public CascadingDropDownNameValue(string name, string value, bool defaultValue)
        {
            this.name = name;
            this.value = value;
            this.isDefaultValue = defaultValue;
        }
    }
}
