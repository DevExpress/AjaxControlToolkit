using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.Globalization;
using System.Drawing;

namespace AjaxControlToolkit {

    [TargetControlType(typeof(TextBox))]
    [Designer("AjaxControlToolkit.Design.PasswordStrengthExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.PasswordStrengthExtenderBehavior", Constants.PasswordStrengthName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ToolboxBitmap(typeof(PasswordStrength), "PasswordStrength.ico")]
    public class PasswordStrength : ExtenderControlBase {
        private const string _txtPasswordCssClass = "TextCssClass";
        private const string _barBorderCssClass = "BarBorderCssClass";
        private const string _barIndicatorCssClass = "BarIndicatorCssClass";
        private const string _strengthIndicatorType = "StrengthIndicatorType";
        private const string _displayPosition = "DisplayPosition";
        private const string _prefixText = "PrefixText";
        private const string _txtDisplayIndicators = "TextStrengthDescriptions";
        private const string _strengthStyles = "StrengthStyles";

        private const int TXT_INDICATORS_MIN_COUNT = 2;  // Minimum number of textual descriptions
        private const int TXT_INDICATORS_MAX_COUNT = 10; // Maximum number of textual descriptions.
        private const char TXT_INDICATOR_DELIMITER = ';'; // Text indicators are delimited with a semi colon

        private const string _preferredPasswordLength = "PreferredPasswordLength";
        private const string _minPasswordNumerics = "MinimumNumericCharacters";
        private const string _minPasswordSymbols = "MinimumSymbolCharacters";
        private const string _requiresUpperLowerCase = "RequiresUpperAndLowerCaseCharacters";

        private const string _minLowerCaseChars = "MinimumLowerCaseCharacters";
        private const string _minUpperCaseChars = "MinimumUpperCaseCharacters";


        private const string _helpHandleCssClass = "HelpHandleCssClass";
        private const string _helphandlePosition = "HelpHandlePosition";
        private const string _helpStatusLabelID = "HelpStatusLabelID";
        private const string _calcWeightings = "CalculationWeightings";

        private const string _prefixTextDefault = "Strength: ";

        // The preferred or ideal length of the password. Passwords could be less than this amount but wont reach the 100% calculation
        // if less than this count. This is used to calculate 50% of the percentage strength of the password
        // Ideally, a password should be 20 characters in length to be a strong password.
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int PreferredPasswordLength {
            get { return GetPropertyValue(_preferredPasswordLength, 0); }
            set { SetPropertyValue(_preferredPasswordLength, value); }
        }

        // The minimum number if numeric characters required. If there are less than this property, then the password is not
        // considered strong. If there are equal to or more than this value, then this will contribute 15% to the overall
        // password strength percentage value.
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int MinimumNumericCharacters {
            get { return GetPropertyValue(_minPasswordNumerics, 0); }
            set { SetPropertyValue(_minPasswordNumerics, value); }
        }

        // The Css class that is used to display the image for showing the password requirements to meet.
        // This is used so that the user can click on this image and get a display on what is required to make the
        // password strong according to the current properties.
        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string HelpHandleCssClass {
            get { return GetPropertyValue(_helpHandleCssClass, ""); }
            set { SetPropertyValue(_helpHandleCssClass, value); }
        }

        // The position that the help handle is displayed
        [ExtenderControlProperty()]
        [DefaultValue(DisplayPosition.AboveRight)]
        public DisplayPosition HelpHandlePosition {
            get { return GetPropertyValue(_helphandlePosition, DisplayPosition.AboveRight); }
            set { SetPropertyValue(_helphandlePosition, value); }
        }

        [IDReferenceProperty(typeof(Label))]
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string HelpStatusLabelID {
            get { return GetPropertyValue(_helpStatusLabelID, ""); }
            set { SetPropertyValue(_helpStatusLabelID, value); }
        }

        // The minimum number of symbol characters required (e.g. %^&* etc..). If there are less than this property, then the password is not
        // considered strong. If there are equal to or more than this value, then this will contribute 15% to the overall
        // password strength percentage value.
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int MinimumSymbolCharacters {
            get { return GetPropertyValue(_minPasswordSymbols, 0); }
            set { SetPropertyValue(_minPasswordSymbols, value); }
        }

        // Determines if mixed case passwords are required to be considered strong. If true, then there must be at least one occurrence
        // of mixed case (upper and lower) letters in the password to be considered strong. If there is, this will contribute 20% to the
        // overall password strength percentage value
        [ExtenderControlProperty()]
        [DefaultValue(false)]
        public bool RequiresUpperAndLowerCaseCharacters {
            get { return GetPropertyValue(_requiresUpperLowerCase, false); }
            set { SetPropertyValue(_requiresUpperLowerCase, value); }
        }

        // CSS class to apply to the control
        [DefaultValue(null)]
        [ExtenderControlProperty()]
        public string TextCssClass {
            get { return GetPropertyValue(_txtPasswordCssClass, (string)null); }
            set { SetPropertyValue(_txtPasswordCssClass, value); }
        }

        [DefaultValue(null)]
        [ExtenderControlProperty()]
        public string BarBorderCssClass {
            get { return GetPropertyValue(_barBorderCssClass, (string)null); }
            set { SetPropertyValue(_barBorderCssClass, value); }
        }

        [DefaultValue(null)]
        [ExtenderControlProperty()]
        public string BarIndicatorCssClass {
            get { return GetPropertyValue(_barIndicatorCssClass, (string)null); }
            set { SetPropertyValue(_barIndicatorCssClass, value); }
        }

        // The text prefixed to the password strength display value when using text display mode
        [DefaultValue(_prefixTextDefault)]
        [ExtenderControlProperty()]
        public string PrefixText {
            get { return GetPropertyValue(_prefixText, _prefixTextDefault); }
            set { SetPropertyValue(_prefixText, value); }
        }

        [DefaultValue(DisplayPosition.RightSide)]
        [ExtenderControlProperty()]
        public DisplayPosition DisplayPosition {
            get { return GetPropertyValue(_displayPosition, DisplayPosition.RightSide); }
            set { SetPropertyValue(_displayPosition, value); }
        }

        // A property that is either Bar (as in progress bar indicating password strength) or
        // text (i.e. low, medium, high, excellent for strength).
        [DefaultValue(StrengthIndicatorTypes.Text)]
        [ExtenderControlProperty()]
        public StrengthIndicatorTypes StrengthIndicatorType {
            get { return GetPropertyValue(_strengthIndicatorType, StrengthIndicatorTypes.Text); }
            set { SetPropertyValue(_strengthIndicatorType, value); }
        }

        // The Calculation ratios or "weightings" used when calculating a passwords strength.
        // Must be a string with 4 elements separated by a semi colon.
        // Default is '50;15;15;20' which represents
        // ... Password Length: 50%
        // ... Meets Numerics requirements : 15%
        // ... Meets Casing requirements: 15%
        // ... Meets Symbol character requirements: 20%
        // Total of 4 elements must equal 100
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string CalculationWeightings {
            get { return GetPropertyValue(_calcWeightings, ""); }
            set {

                if(String.IsNullOrEmpty(value)) {
                    SetPropertyValue(_calcWeightings, value);
                } else {
                    int total = 0;
                    if(null != value) {
                        string[] tmpList = value.Split(';');
                        foreach(string val in tmpList) {
                            int tmpVal;

                            if(int.TryParse(val, NumberStyles.Integer, CultureInfo.InvariantCulture, out tmpVal))
                                total += tmpVal;
                        }
                    }


                    if(total == 100)
                        SetPropertyValue(_calcWeightings, value);
                    else
                        throw new ArgumentException("There must be 4 Calculation Weighting items which must total 100");

                }

            }
        }

        // A semi-colon delimited string that specifies the string descriptions for the password strength when using a textual display.
        // Example: None;Weak;Medium;Strong;Excellent
        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string TextStrengthDescriptions {
            get { return GetPropertyValue(_txtDisplayIndicators, ""); }
            set {
                bool valid = false;
                if(!string.IsNullOrEmpty(value)) {
                    string[] txtItems = value.Split(TXT_INDICATOR_DELIMITER);
                    if(txtItems.Length >= TXT_INDICATORS_MIN_COUNT && txtItems.Length <= TXT_INDICATORS_MAX_COUNT) {
                        valid = true;
                    }
                }


                if(valid) {
                    SetPropertyValue(_txtDisplayIndicators, value);
                } else {
                    string msg = string.Format(CultureInfo.CurrentCulture, "Invalid property specification for TextStrengthDescriptions property. Must be a string delimited with '{0}', contain a minimum of {1} entries, and a maximum of {2}.", TXT_INDICATOR_DELIMITER, TXT_INDICATORS_MIN_COUNT, TXT_INDICATORS_MAX_COUNT);
                    throw new ArgumentException(msg);
                }
            }
        }

        // A semi-colon delimited string that specifies the styles applicable to each
        // string descriptions for the password strength when using a textual display.
        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string StrengthStyles {
            get { return GetPropertyValue(_strengthStyles, ""); }
            set {
                bool valid = false;
                if(!string.IsNullOrEmpty(value)) {
                    string[] styleItems = value.Split(TXT_INDICATOR_DELIMITER);

                    if(styleItems.Length <= TXT_INDICATORS_MAX_COUNT) {
                        valid = true;
                    }
                }


                if(valid) {
                    SetPropertyValue(_strengthStyles, value);
                } else {
                    string msg = string.Format(CultureInfo.CurrentCulture, "Invalid property specification for TextStrengthDescriptionStyles property. Must match the number of entries for the TextStrengthDescriptions property.");
                    throw new ArgumentException(msg);
                }
            }
        }

        // If the RequiresUpperAndLowerCaseCharacters property is true, then this property determines the
        // minimum lower case characters that are required. The default value is 0 which means this property is not
        // in effect and there is no minimum limit.
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int MinimumLowerCaseCharacters {
            get { return GetPropertyValue(_minLowerCaseChars, 0); }
            set { SetPropertyValue(_minLowerCaseChars, value); }
        }

        // If the RequiresUpperAndLowerCaseCharacters property is true, then this property determines the
        // minimum upper case characters that are required. The default value is 0 which means this property is not
        // in effect and there is no minimum limit.
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int MinimumUpperCaseCharacters {
            get { return GetPropertyValue(_minUpperCaseChars, 0); }
            set { SetPropertyValue(_minUpperCaseChars, value); }
        }

        // A semi-colon delimited string that specifies the styles applicable to each
        // string descriptions for the password strength when using a textual display.
        [Obsolete("This property has been deprecated. Please use the StrengthStyles property instead.")]
        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string TextStrengthDescriptionStyles {
            get { return StrengthStyles; }
            set { StrengthStyles = value; }
        }
    }
}
