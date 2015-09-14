using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// PasswordStrength is an ASP.NET AJAX extender that can be attached to an ASP.NET TextBox control used for the entry of passwords. 
    /// The PasswordStrength extender shows the strength of the password in the TextBox and updates itself as a user types the password.
    /// </summary>
    [TargetControlType(typeof(TextBox))]
    [Designer(typeof(PasswordStrengthExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.PasswordStrengthExtenderBehavior", Constants.PasswordStrengthName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.PasswordStrengthName + Constants.IconPostfix)]
    public class PasswordStrength : ExtenderControlBase {
        const string _txtPasswordCssClass = "TextCssClass";
        const string _barBorderCssClass = "BarBorderCssClass";
        const string _barIndicatorCssClass = "BarIndicatorCssClass";
        const string _strengthIndicatorType = "StrengthIndicatorType";
        const string _displayPosition = "DisplayPosition";
        const string _prefixText = "PrefixText";
        const string _txtDisplayIndicators = "TextStrengthDescriptions";
        const string _strengthStyles = "StrengthStyles";

        const int _txtIndicatorsMinCount = 2;  // Minimum number of textual descriptions
        const int _txtIndicatorsMaxCount = 10; // Maximum number of textual descriptions.
        const char _txtIndicatorDelimiter = ';'; // Text indicators are delimited with a semi colon

        const string _preferredPasswordLength = "PreferredPasswordLength";
        const string _minPasswordNumerics = "MinimumNumericCharacters";
        const string _minPasswordSymbols = "MinimumSymbolCharacters";
        const string _requiresUpperLowerCase = "RequiresUpperAndLowerCaseCharacters";

        const string _minLowerCaseChars = "MinimumLowerCaseCharacters";
        const string _minUpperCaseChars = "MinimumUpperCaseCharacters";


        const string _helpHandleCssClass = "HelpHandleCssClass";
        const string _helphandlePosition = "HelpHandlePosition";
        const string _helpStatusLabelID = "HelpStatusLabelID";
        const string _calcWeightings = "CalculationWeightings";

        const string _prefixTextDefault = "Strength: ";

        /// <summary>
        /// Preferred length of the password
        /// </summary>
        /// <remarks>
        /// Passwords could be less than this amount but wont reach the 100% calculation
        /// if less than this count. This is used to calculate 50% of the percentage strength of the password
        /// Ideally, a password should be 20 characters in length to be a strong password.
        /// </remarks>
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        [ClientPropertyName("preferredPasswordLength")]
        public int PreferredPasswordLength {
            get { return GetPropertyValue(_preferredPasswordLength, 0); }
            set { SetPropertyValue(_preferredPasswordLength, value); }
        }

        /// <summary>
        /// Minimum number of numeric characters
        /// </summary>
        /// <remarks>
        /// If there are less than this property, then the password is not
        /// considered strong. If there are equal to or more than this value,
        /// then this will contribute 15% to the overall password strength percentage value.
        /// </remarks>
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        [ClientPropertyName("minimumNumericCharacters")]
        public int MinimumNumericCharacters {
            get { return GetPropertyValue(_minPasswordNumerics, 0); }
            set { SetPropertyValue(_minPasswordNumerics, value); }
        }

        /// <summary>
        /// A CSS class applied to the help element used to display a dialog box describing password requirements
        /// </summary>
        /// <remarks>
        /// This is used so that the user can click on this image and get a display
        /// on what is required to make the password strong according to the current properties
        /// </remarks>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("helpHandleCssClass")]
        public string HelpHandleCssClass {
            get { return GetPropertyValue(_helpHandleCssClass, String.Empty); }
            set { SetPropertyValue(_helpHandleCssClass, value); }
        }

        /// <summary>
        /// Positioning of the help handle element relative to the target control
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(DisplayPosition.AboveRight)]
        [ClientPropertyName("helpHandlePosition")]
        public DisplayPosition HelpHandlePosition {
            get { return GetPropertyValue(_helphandlePosition, DisplayPosition.AboveRight); }
            set { SetPropertyValue(_helphandlePosition, value); }
        }

        /// <summary>
        /// Control ID of the label used to display help text
        /// </summary>
        [IDReferenceProperty(typeof(Label))]
        [DefaultValue("")]
        [ExtenderControlProperty()]
        [ClientPropertyName("helpStatusLabelID")]
        public string HelpStatusLabelID {
            get { return GetPropertyValue(_helpStatusLabelID, String.Empty); }
            set { SetPropertyValue(_helpStatusLabelID, value); }
        }

        /// <summary>
        /// Minimum number of symbol characters (ex. $ ^ *)
        /// </summary>
        /// <remarks>
        /// If there are less than this property, then the password is not considered strong.
        /// If there are equal to or more than this value, then this will contribute 15% to the overall
        /// password strength percentage value.
        /// </remarks>
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        [ClientPropertyName("minimumSymbolCharacters")]
        public int MinimumSymbolCharacters {
            get { return GetPropertyValue(_minPasswordSymbols, 0); }
            set { SetPropertyValue(_minPasswordSymbols, value); }
        }

        /// <summary>
        /// Specifies whether mixed case characters are required
        /// </summary>
        /// <remarks>
        /// Determines if mixed case passwords are required to be considered strong.
        /// If true, then there must be at least one occurrence of mixed case
        /// (upper and lower) letters in the password to be considered strong. If there is,
        /// this will contribute 20% to the overall password strength percentage value.
        /// </remarks>
        [ExtenderControlProperty()]
        [DefaultValue(false)]
        [ClientPropertyName("requiresUpperAndLowerCaseCharacters")]
        public bool RequiresUpperAndLowerCaseCharacters {
            get { return GetPropertyValue(_requiresUpperLowerCase, false); }
            set { SetPropertyValue(_requiresUpperLowerCase, value); }
        }

        /// <summary>
        /// CSS class applied to the text display when StrengthIndicatorType=Text
        /// </summary>
        [DefaultValue(null)]
        [ExtenderControlProperty()]
        [ClientPropertyName("textCssClass")]
        public string TextCssClass {
            get { return GetPropertyValue(_txtPasswordCssClass, (string)null); }
            set { SetPropertyValue(_txtPasswordCssClass, value); }
        }

        /// <summary>
        /// A CSS class applied to the bar indicator's border when StrengthIndicatorType=BarIndicator
        /// </summary>
        [DefaultValue(null)]
        [ExtenderControlProperty()]
        [ClientPropertyName("barBorderCssClass")]
        public string BarBorderCssClass {
            get { return GetPropertyValue(_barBorderCssClass, (string)null); }
            set { SetPropertyValue(_barBorderCssClass, value); }
        }

        /// <summary>
        /// A CSS class applied to the bar indicator's inner bar when StrengthIndicatorType=BarIndicator
        /// </summary>
        [DefaultValue(null)]
        [ExtenderControlProperty()]
        [ClientPropertyName("barIndicatorCssClass")]
        public string BarIndicatorCssClass {
            get { return GetPropertyValue(_barIndicatorCssClass, (string)null); }
            set { SetPropertyValue(_barIndicatorCssClass, value); }
        }

        /// <summary>
        /// Text prefixed to the display text when StrengthIndicatorType=Text
        /// </summary>
        [DefaultValue(_prefixTextDefault)]
        [ExtenderControlProperty()]
        [ClientPropertyName("prefixText")]
        public string PrefixText {
            get { return GetPropertyValue(_prefixText, _prefixTextDefault); }
            set { SetPropertyValue(_prefixText, value); }
        }

        /// <summary>
        /// Positioning of the strength indicator relative to the target control
        /// </summary>
        [DefaultValue(DisplayPosition.RightSide)]
        [ExtenderControlProperty()]
        [ClientPropertyName("displayPosition")]
        public DisplayPosition DisplayPosition {
            get { return GetPropertyValue(_displayPosition, DisplayPosition.RightSide); }
            set { SetPropertyValue(_displayPosition, value); }
        }

        /// <summary>
        /// Strength indicator type (Text or BarIndicator)
        /// </summary>
        /// <remarks>
        /// BarIndicator - progress bar indicating password strength
        /// Text - low, medium, high or excellent
        /// </remarks>
        [DefaultValue(StrengthIndicatorTypes.Text)]
        [ExtenderControlProperty()]
        [ClientPropertyName("strengthIndicatorType")]
        public StrengthIndicatorTypes StrengthIndicatorType {
            get { return GetPropertyValue(_strengthIndicatorType, StrengthIndicatorTypes.Text); }
            set { SetPropertyValue(_strengthIndicatorType, value); }
        }

        /// <summary>
        /// A list of semi-colon separated numeric values used to determine the weight of password strength's characteristic.
        /// </summary>
        /// <remarks>
        /// There must be 4 values specified which must total 100. 
        /// The default weighting values are defined as 50;15;15;20. 
        /// This corresponds to password length is 50% of the strength calculation, 
        /// Numeric criteria is 15% of strength calculation, casing criteria is 15% of calculation, 
        /// and symbol criteria is 20% of calculation. So the format is 'A;B;C;D' 
        /// where A = length weighting, B = numeric weighting, C = casing weighting, D = symbol weighting.
        /// </remarks>
        [DefaultValue("")]
        [ExtenderControlProperty()]
        [ClientPropertyName("calculationWeightings")]
        public string CalculationWeightings {
            get { return GetPropertyValue(_calcWeightings, String.Empty); }
            set {
                if(String.IsNullOrEmpty(value))
                    SetPropertyValue(_calcWeightings, value);
                else {
                    var total = 0;
                    if(value != null) {
                        var tmpList = value.Split(';');
                        foreach(var val in tmpList) {
                            int tmpVal;

                            if(Int32.TryParse(val, NumberStyles.Integer, CultureInfo.InvariantCulture, out tmpVal))
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

        /// <summary>
        /// List of semi-colon separated descriptions used when StrengthIndicatorType=Text
        /// (Minimum of 2, maximum of 10; order is weakest to strongest)
        /// </summary>
        /// <remarks>
        /// Example: None;Weak;Medium;Strong;Excellent
        /// </remarks>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("textStrengthDescriptions")]
        public string TextStrengthDescriptions {
            get { return GetPropertyValue(_txtDisplayIndicators, String.Empty); }
            set {
                var valid = false;
                if(!String.IsNullOrEmpty(value)) {
                    var txtItems = value.Split(_txtIndicatorDelimiter);
                    if(txtItems.Length >= _txtIndicatorsMinCount && txtItems.Length <= _txtIndicatorsMaxCount)
                        valid = true;
                }

                if(valid)
                    SetPropertyValue(_txtDisplayIndicators, value);
                else {
                    var msg = String.Format(CultureInfo.CurrentCulture, "Invalid property specification for TextStrengthDescriptions property. Must be a string delimited with '{0}', contain a minimum of {1} entries, and a maximum of {2}.", _txtIndicatorDelimiter, _txtIndicatorsMinCount, _txtIndicatorsMaxCount);
                    throw new ArgumentException(msg);
                }
            }
        }

        /// <summary>
        /// List of semi-colon separated CSS classes that are used depending on the password's strength.
        /// </summary>
        /// <remarks>
        /// This property will override the BarIndicatorCssClass / TextIndicatorCssClass property if present.
        /// The BarIndicatorCssClass / TextIndicatorCssClass property differs in that it attributes one
        /// CSS style to the BarIndicator or Text Strength indicator (depending on which type is chosen)
        /// regardless of password strength. This property will cause the style to change based on the password
        /// strength and also to the number of styles specified in this property. For example, if 2 styles are
        /// defined like StrengthStyles="style1;style2" then style1 is applied when the password strength is less
        /// than 50%, and style2 is applied when password strength is >= 50%. This property can have up to 10 styles.
        /// </remarks>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("strengthStyles")]
        public string StrengthStyles {
            get { return GetPropertyValue(_strengthStyles, String.Empty); }
            set {
                var valid = false;
                if(!String.IsNullOrEmpty(value)) {
                    var styleItems = value.Split(_txtIndicatorDelimiter);

                    if(styleItems.Length <= _txtIndicatorsMaxCount) {
                        valid = true;
                    }
                }

                if(valid)
                    SetPropertyValue(_strengthStyles, value);
                else {
                    var msg = String.Format(CultureInfo.CurrentCulture, "Invalid property specification for TextStrengthDescriptionStyles property. Must match the number of entries for the TextStrengthDescriptions property.");
                    throw new ArgumentException(msg);
                }
            }
        }

        /// <summary>
        /// A minimum number of lowercase characters required when requiring 
        /// mixed case characters as part of your password strength considerations
        /// </summary>
        /// <remarks>
        /// Only in effect if RequiresUpperAndLowerCaseCharacters property is true.
        /// The default value is 0 which means this property is not in effect and
        /// there is no minimum limit.
        /// </remarks>
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        [ClientPropertyName("minimumLowerCaseCharacters")]
        public int MinimumLowerCaseCharacters {
            get { return GetPropertyValue(_minLowerCaseChars, 0); }
            set { SetPropertyValue(_minLowerCaseChars, value); }
        }

        /// <summary>
        /// Minimum number of uppercase characters required when requiring mixed case
        /// characters as part of your password strength considerations.
        /// </summary>
        /// <remarks>
        /// Only in effect if RequiresUpperAndLowerCaseCharacters property is true.
        /// The default value is 0 which means this property is not in effect and
        /// there is no minimum limit.
        /// </remarks>
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        [ClientPropertyName("minimumUpperCaseCharacters")]
        public int MinimumUpperCaseCharacters {
            get { return GetPropertyValue(_minUpperCaseChars, 0); }
            set { SetPropertyValue(_minUpperCaseChars, value); }
        }

        /// <summary>
        /// A semi-colon delimited string that specifies the styles applicable to each
        /// string descriptions for the password strength when using a textual display
        /// </summary>
        /// <remarks>
        /// Deprecated. Use StrengthStyles instead
        /// </remarks>
        [Obsolete("This property has been deprecated. Please use the StrengthStyles property instead.")]
        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string TextStrengthDescriptionStyles {
            get { return StrengthStyles; }
            set { StrengthStyles = value; }
        }
    }

}
