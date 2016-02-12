#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// FFilteredTextBox is an extender that either allows users to enter only characters 
    /// that you define into a text box or prevents users from entering specified characters.
    /// </summary>
    /// <remarks>
    /// Note that as the extender relies on JavaScript, you should never assume that data that is sent 
    /// to the server consists only of allowed characters.
    /// Always perform server-side validation check on data that is sent from the client.
    /// </remarks>
    [Designer(typeof(FilteredTextBoxExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.FilteredTextBoxBehavior", Constants.FilteredTextBoxName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(TextBox))]
    [DefaultProperty("ValidChars")]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.FilteredTextBoxName + Constants.IconPostfix)]
    public class FilteredTextBoxExtender : ExtenderControlBase {
        /// <summary>
        /// A filter type to apply that is specified as a comma-separated combination 
        /// of the following values: Numbers, LowercaseLetters, UppercaseLetters, and Custom. 
        /// Custom is default.
        /// </summary>
        /// <remarks>
        /// If Custom is specified, the ValidChars property will be used in addition to other settings, such as Numbers.
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue(FilterTypes.Custom)]
        [ClientPropertyName("filterType")]
        public FilterTypes FilterType {
            get { return GetPropertyValue<FilterTypes>("FilterType", FilterTypes.Custom); }
            set { SetPropertyValue<FilterTypes>("FilterType", value); }
        }

        /// <summary>
        /// A filter mode to apply. Supported values are ValidChars and InvalidChars.
        /// If the property is set to InvalidChars, FilterType must be set to Custom.
        /// ValidChars is default.
        /// </summary>
        /// <remarks>
        /// If the property is set to ValidChars, FilterType must be set to Custom.
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue(FilterModes.ValidChars)]
        [ClientPropertyName("filterMode")]
        public FilterModes FilterMode {
            get { return GetPropertyValue<FilterModes>("FilterMode", FilterModes.ValidChars); }
            set { SetPropertyValue<FilterModes>("FilterMode", value); }
        }

        /// <summary>
        /// A string that consists of all characters that are considered valid for the text box when the field type is Custom.
        /// </summary>
        /// <remarks>
        /// If the field type is not Custom, this property value is ignored.
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("validChars")]
        public string ValidChars {
            get { return GetPropertyValue("ValidChars", ""); }
            set { SetPropertyValue("ValidChars", value); }
        }

        /// <summary>
        /// A string that consists of all characters that are considered invalid for the text box when the field type is Custom.
        /// </summary>
        /// <remarks>
        /// If the field type is not Custom, this property value is ignored.
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("invalidChars")]
        public string InvalidChars {
            get { return GetPropertyValue("InvalidChars", ""); }
            set { SetPropertyValue("InvalidChars", value); }
        }

        /// <summary>
        /// An integer that specifies an interval in milliseconds, in which the field's content is filtered.	
        /// </summary>
        /// <remarks>
        /// The default is 250
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue(250)]
        [ClientPropertyName("filterInterval")]
        public int FilterInterval {
            get { return GetPropertyValue("FilterInterval", 250); }
            set { SetPropertyValue("FilterInterval", value); }
        }

        protected override bool CheckIfValid(bool throwException) {
            if(FilterType == FilterTypes.Custom && (
                 (FilterMode == FilterModes.ValidChars && String.IsNullOrEmpty(ValidChars)) ||
                 (FilterMode == FilterModes.InvalidChars && String.IsNullOrEmpty(InvalidChars)))) {
                if(throwException)
                    throw new InvalidOperationException("If FilterTypes.Custom is specified, please provide a value for ValidChars or InvalidChars");

                return false;
            }
            return base.CheckIfValid(throwException);
        }
    }

}

#pragma warning restore 1591