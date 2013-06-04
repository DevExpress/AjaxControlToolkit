

using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: System.Web.UI.WebResource("FilteredTextBox.FilteredTextBoxBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("FilteredTextBox.FilteredTextBoxBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    [Designer("AjaxControlToolkit.FilteredTextBoxDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.FilteredTextBoxBehavior", "FilteredTextBox.FilteredTextBoxBehavior.js")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(TextBox))]
    [DefaultProperty("ValidChars")]
    [ToolboxBitmap(typeof(FilteredTextBoxExtender), "FilteredTextBox.FilteredTextBox.ico")]
    public class FilteredTextBoxExtender : ExtenderControlBase
    {
        /// <summary>
        /// The type of filter to be used by the extender
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(FilterTypes.Custom)]
        public FilterTypes FilterType
        {
            get { return GetPropertyValue<FilterTypes>("FilterType", FilterTypes.Custom); }
            set { SetPropertyValue<FilterTypes>("FilterType", value); }
        }

        /// <summary>
        /// The filter mode to be used by the extender
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(FilterModes.ValidChars)]
        public FilterModes FilterMode
        {
            get { return GetPropertyValue<FilterModes>("FilterMode", FilterModes.ValidChars); }
            set { SetPropertyValue<FilterModes>("FilterMode", value); }
        }

        /// <summary>
        /// A string consisting of all valid chars for the text field
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string ValidChars
        {
            get { return GetPropertyValue("ValidChars", ""); }
            set { SetPropertyValue("ValidChars", value); }
        }

        /// <summary>
        /// A string consisting of all invalid chars for the text field
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string InvalidChars
        {
            get { return GetPropertyValue("InvalidChars", ""); }
            set { SetPropertyValue("InvalidChars", value); }
        }

        /// <summary>
        /// An integer containing the interval (in milliseconds) in which 
        /// the field's contents are filtered
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(250)]
        public int FilterInterval
        {
            get { return GetPropertyValue("FilterInterval", 250); }
            set { SetPropertyValue("FilterInterval", value); }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        protected override bool CheckIfValid(bool throwException)
        {
            if (FilterType == FilterTypes.Custom && (
                 (FilterMode == FilterModes.ValidChars && string.IsNullOrEmpty(ValidChars)) ||
                 (FilterMode == FilterModes.InvalidChars && string.IsNullOrEmpty(InvalidChars))))
            {
                if (throwException)
                {
                    throw new InvalidOperationException("If FilterTypes.Custom is specified, please provide a value for ValidChars or InvalidChars");
                }
                return false;
            }
            return base.CheckIfValid(throwException);
        }
    }
}