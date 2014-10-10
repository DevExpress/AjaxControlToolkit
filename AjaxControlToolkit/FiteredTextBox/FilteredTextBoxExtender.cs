using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.FilteredTextBoxExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.FilteredTextBoxBehavior", Constants.FilteredTextBoxScriptName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(TextBox))]
    [DefaultProperty("ValidChars")]
    [ToolboxBitmap(typeof(FilteredTextBoxExtender), "FilteredTextBox.ico")]
    public class FilteredTextBoxExtender : ExtenderControlBase {
        [ExtenderControlProperty]
        [DefaultValue(FilterTypes.Custom)]
        public FilterTypes FilterType {
            get { return GetPropertyValue<FilterTypes>("FilterType", FilterTypes.Custom); }
            set { SetPropertyValue<FilterTypes>("FilterType", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(FilterModes.ValidChars)]
        public FilterModes FilterMode {
            get { return GetPropertyValue<FilterModes>("FilterMode", FilterModes.ValidChars); }
            set { SetPropertyValue<FilterModes>("FilterMode", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue("")]
        public string ValidChars {
            get { return GetPropertyValue("ValidChars", ""); }
            set { SetPropertyValue("ValidChars", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue("")]
        public string InvalidChars {
            get { return GetPropertyValue("InvalidChars", ""); }
            set { SetPropertyValue("InvalidChars", value); }
        }

        // An integer containing the interval (in milliseconds) in which 
        // the field's contents are filtered
        [ExtenderControlProperty]
        [DefaultValue(250)]
        public int FilterInterval {
            get { return GetPropertyValue("FilterInterval", 250); }
            set { SetPropertyValue("FilterInterval", value); }
        }

        protected override bool CheckIfValid(bool throwException) {
            if (FilterType == FilterTypes.Custom && (
                 (FilterMode == FilterModes.ValidChars && string.IsNullOrEmpty(ValidChars)) ||
                 (FilterMode == FilterModes.InvalidChars && string.IsNullOrEmpty(InvalidChars)))) {
                if (throwException) {
                    throw new InvalidOperationException("If FilterTypes.Custom is specified, please provide a value for ValidChars or InvalidChars");
                }
                return false;
            }
            return base.CheckIfValid(throwException);
        }
    }
}