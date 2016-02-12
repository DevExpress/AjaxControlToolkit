#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// MaskedEdit is an ASP.NET AJAX extender that attaches to the TextBox control to restrict what text that
    /// can be entered. MaskedEdit applies a mask to the input that permits only certain types of characters/text
    /// to be entered. The supported data formats are: Number, Date, Time, and DateTime.
    /// </summary>
    /// <remarks>
    /// MaskedEdit uses culture settings specified in the CultureName property. If none of these settings is specified,
    /// the culture setting will be the same as the page: English (United States).
    /// </remarks>
    [Designer(typeof(MaskedEditExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.MaskedEditBehavior", Constants.MaskedEditValidatorName)]
    [ClientScriptResource("Sys.Extended.UI.MaskedEditBehavior", Constants.MaskedEditName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(TimerScript))]
    [TargetControlType(typeof(TextBox))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.MaskedEditName + Constants.IconPostfix)]
    public class MaskedEditExtender : ExtenderControlBase {
        // Enable client state for communicating default focus
        public MaskedEditExtender() {
            EnableClientState = true;
        }

        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            switch(MaskType) {
                case MaskedEditType.Date: {
                        AcceptAMPM = false;
                        AcceptNegative = MaskedEditShowSymbol.None;
                        DisplayMoney = MaskedEditShowSymbol.None;
                        InputDirection = MaskedEditInputDirection.LeftToRight;
                        break;
                    }
                case MaskedEditType.Time: {
                        AcceptNegative = MaskedEditShowSymbol.None;
                        DisplayMoney = MaskedEditShowSymbol.None;
                        InputDirection = MaskedEditInputDirection.LeftToRight;
                        break;
                    }
                case MaskedEditType.DateTime: {
                        AcceptNegative = MaskedEditShowSymbol.None;
                        DisplayMoney = MaskedEditShowSymbol.None;
                        InputDirection = MaskedEditInputDirection.LeftToRight;
                        break;
                    }
                case MaskedEditType.Number: {
                        AcceptAMPM = false;
                        break;
                    }
                case MaskedEditType.None: {
                        AcceptAMPM = false;
                        AcceptNegative = MaskedEditShowSymbol.None;
                        DisplayMoney = MaskedEditShowSymbol.None;
                        InputDirection = MaskedEditInputDirection.LeftToRight;
                        break;
                    }
            }
            //We Can't rely on the culturename because custom changes may have been made
            // to the culture settings for the page. Only use the CultureName if it is 
            // specified in the control
            if(String.IsNullOrEmpty(CultureName)) {
                CultureName = String.Empty;
            }
        }

        // If this textbox has default focus, use ClientState to let it know
        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);
            ((TextBox)this.FindControl(TargetControlID)).MaxLength = 0;
            ClientState = (string.Compare(Page.Form.DefaultFocus, TargetControlID, StringComparison.OrdinalIgnoreCase) == 0) ? "Focused" : null;
        }

        /// <summary>
        /// A mask to be applied to the target TextBox
        /// </summary>
        [RequiredProperty()]
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("mask")]
        public string Mask {
            get { return GetPropertyValue<string>("Mask", ""); }
            set {
                if(!validateMaskType()) {
                    throw new ArgumentException("Validate Type and/or Mask is invalid!");
                }
                SetPropertyValue<string>("Mask", value);
            }
        }

        /// <summary>
        /// Prompt text to use when the clipboard paste is performed
        /// </summary>
        [DefaultValue("Your browser security settings don't permit the automatic execution of paste operations. Please use the keyboard shortcut Ctrl+V instead.")]
        [ExtenderControlProperty]
        [ClientPropertyName("clipboardText")]
        public string ClipboardText {
            get { return GetPropertyValue<string>("ClipboardText", "Your browser security settings don't permit the automatic execution of paste operations. Please use the keyboard shortcut Ctrl+V instead."); }
            set { SetPropertyValue<string>("ClipboardText", value); }
        }

        /// <summary>
        /// A type of validation to perform
        /// </summary>
        /// <remarks>
        /// Possible values:
        /// None - No validation
        /// Number - Number validation
        /// Date - Date validation
        /// Time - Time validation
        /// DateTime - Date and time validation
        /// </remarks>
        [DefaultValue(MaskedEditType.None)]
        [ExtenderControlProperty]
        [RefreshProperties(RefreshProperties.All)]
        [ClientPropertyName("maskType")]
        public MaskedEditType MaskType {
            get { return GetPropertyValue<MaskedEditType>("MaskType", MaskedEditType.None); }
            set {
                SetPropertyValue<MaskedEditType>("MaskType", value);
                switch(value) {
                    case MaskedEditType.Date: {
                            AcceptAMPM = false;
                            AcceptNegative = MaskedEditShowSymbol.None;
                            DisplayMoney = MaskedEditShowSymbol.None;
                            InputDirection = MaskedEditInputDirection.LeftToRight;
                            break;
                        }
                    case MaskedEditType.Time: {
                            AcceptNegative = MaskedEditShowSymbol.None;
                            DisplayMoney = MaskedEditShowSymbol.None;
                            InputDirection = MaskedEditInputDirection.LeftToRight;
                            break;
                        }
                    case MaskedEditType.DateTime: {
                            AcceptNegative = MaskedEditShowSymbol.None;
                            DisplayMoney = MaskedEditShowSymbol.None;
                            InputDirection = MaskedEditInputDirection.LeftToRight;
                            break;
                        }
                    case MaskedEditType.Number: {
                            AcceptAMPM = false;
                            break;
                        }
                    case MaskedEditType.None: {
                            AcceptAMPM = false;
                            AcceptNegative = MaskedEditShowSymbol.None;
                            DisplayMoney = MaskedEditShowSymbol.None;
                            InputDirection = MaskedEditInputDirection.LeftToRight;
                            break;
                        }
                }
            }
        }

        /// <summary>
        /// A message displayed when editing in the TextBox
        /// </summary>
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("messageValidatorTip")]
        public bool MessageValidatorTip {
            get { return GetPropertyValue<bool>("MessageValidatorTip", true); }
            set { SetPropertyValue<bool>("MessageValidatorTip", value); }
        }

        /// <summary>
        /// Set to True to show a tooltip message when the mouse hovers over an invalid TextBox
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("errorTooltipEnabled")]
        public bool ErrorTooltipEnabled {
            get { return GetPropertyValue<bool>("ErrorTooltipEnabled", false); }
            set { SetPropertyValue<bool>("ErrorTooltipEnabled", value); }
        }

        /// <summary>
        /// A CSS class for the tooltip message
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("errorTooltipCssClass")]
        public string ErrorTooltipCssClass {
            get { return GetPropertyValue<string>("ErrorTooltipCssClass", ""); }
            set { SetPropertyValue<string>("ErrorTooltipCssClass", value); }
        }

        /// <summary>
        /// Set to True to allow the copy/paste operation with the clipboard
        /// </summary>
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("clipboardEnabled")]
        public bool ClipboardEnabled {
            get { return GetPropertyValue<bool>("ClipboardEnabled", true); }
            set { SetPropertyValue<bool>("ClipboardEnabled", value); }
        }

        /// <summary>
        /// Set to True to automatically fill in empty mask characters not specified by a user
        /// </summary>
        /// <remarks>
        /// MaskType=Number - Empty mask characters will be filled with zeros
        /// MaskType=Time - Empty mask characters will be filled with the current time
        /// MaskType=Date - Empty mask characters will be filled with the current date
        /// MaskType=DateTime - Empty mask characters will be filled with the current date/time
        /// </remarks>
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("autoComplete")]
        public bool AutoComplete {
            get { return GetPropertyValue<bool>("AutoComplete", true); }
            set { SetPropertyValue<bool>("AutoComplete", value); }
        }

        /// <summary>
        /// Set to True to clear the TextBox when invalid text is entered
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("clearTextOnInvalid")]
        public bool ClearTextOnInvalid {
            get { return GetPropertyValue<bool>("ClearTextOnInvalid", false); }
            set { SetPropertyValue<bool>("ClearTextOnInvalid", value); }
        }

        /// <summary>
        /// A Default character to use when AutoComplete is enabled
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("autoCompleteValue")]
        public string AutoCompleteValue {
            get { return GetPropertyValue<string>("AutoCompleteValue", ""); }
            set { SetPropertyValue<string>("AutoCompleteValue", value); }
        }

        /// <summary>
        ///  Valid characters for mask type C (case-sensitive)
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("filtered")]
        public string Filtered {
            get { return GetPropertyValue<string>("Filtered", ""); }
            set { SetPropertyValue<string>("Filtered", value); }
        }

        /// <summary>
        /// Text input direction
        /// </summary>
        /// <remarks>
        /// Possible values:
        /// LeftToRight - Left to Right
        /// RightToLeft - Right to left
        /// </remarks>
        [DefaultValue(MaskedEditInputDirection.LeftToRight)]
        [ExtenderControlProperty]
        [ClientPropertyName("inputDirection")]
        public MaskedEditInputDirection InputDirection {
            get { return GetPropertyValue<MaskedEditInputDirection>("InputDirection", MaskedEditInputDirection.LeftToRight); }
            set { SetPropertyValue<MaskedEditInputDirection>("InputDirection", value); }
        }

        /// <summary>
        /// Prompt character
        /// </summary>
        [DefaultValue("_")]
        [ExtenderControlProperty]
        [ClientPropertyName("promptCharacter")]
        public string PromptCharacter {
            get { return GetPropertyValue<string>("PromptCharacter", "_"); }
            set { SetPropertyValue<string>("PromptCharacter", value); }
        }

        /// <summary>
        /// A CSS class used when the TextBox receives focus
        /// </summary>
        [DefaultValue("MaskedEditFocus")]
        [ExtenderControlProperty]
        [ClientPropertyName("onFocusCssClass")]
        public string OnFocusCssClass {
            get { return GetPropertyValue<string>("OnFocusCssClass", "MaskedEditFocus"); }
            set { SetPropertyValue<string>("OnFocusCssClass", value); }
        }

        /// <summary>
        /// A CSS class used when the text is not valid
        /// </summary>
        [DefaultValue("MaskedEditError")]
        [ExtenderControlProperty]
        [ClientPropertyName("onInvalidCssClass")]
        public string OnInvalidCssClass {
            get { return GetPropertyValue<string>("OnInvalidCssClass", "MaskedEditError"); }
            set { SetPropertyValue<string>("OnInvalidCssClass", value); }
        }

        /// <summary>
        /// A custom date format
        /// </summary>
        [DefaultValue(MaskedEditUserDateFormat.None)]
        [ExtenderControlProperty]
        [ClientPropertyName("userDateFormat")]
        public MaskedEditUserDateFormat UserDateFormat {
            get { return GetPropertyValue<MaskedEditUserDateFormat>("UserDateFormat", MaskedEditUserDateFormat.None); }
            set { SetPropertyValue<MaskedEditUserDateFormat>("UserDateFormat", value); }
        }

        /// <summary>
        /// A custom time format
        /// </summary>
        [DefaultValue(MaskedEditUserTimeFormat.None)]
        [ExtenderControlProperty]
        [ClientPropertyName("userTimeFormat")]
        public MaskedEditUserTimeFormat UserTimeFormat {
            get { return GetPropertyValue<MaskedEditUserTimeFormat>("UserTimeFormat", MaskedEditUserTimeFormat.None); }
            set { SetPropertyValue<MaskedEditUserTimeFormat>("UserTimeFormat", value); }
        }

        /// <summary>
        /// Set to True to remove a mask when the TextBox loses focus
        /// </summary>
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("clearMaskOnLostFocus")]
        public bool ClearMaskOnLostFocus {
            get { return GetPropertyValue<bool>("ClearMaskOnLostfocus", true); }
            set { SetPropertyValue<bool>("ClearMaskOnLostfocus", value); }
        }

        /// <summary>
        /// The name of a culture to use (overrides the default page culture)
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [RefreshProperties(RefreshProperties.All)]
        [ClientPropertyName("cultureName")]
        public string CultureName {
            get { return GetPropertyValue<string>("CultureName", ""); }
            set {
                CultureInfo сontrolCulture = null;
                if(String.IsNullOrEmpty(value)) {
                    сontrolCulture = CultureInfo.CurrentCulture;
                    OverridePageCulture = false;
                }
                else {
                    сontrolCulture = CultureInfo.GetCultureInfo(value);
                    //If the Culturename is ACTUALLY set in the control, use it
                    OverridePageCulture = true;
                }
                SetPropertyValue<string>("CultureName", сontrolCulture.Name);
                CultureDatePlaceholder = сontrolCulture.DateTimeFormat.DateSeparator;
                CultureTimePlaceholder = сontrolCulture.DateTimeFormat.TimeSeparator;
                CultureDecimalPlaceholder = сontrolCulture.NumberFormat.NumberDecimalSeparator;
                CultureThousandsPlaceholder = сontrolCulture.NumberFormat.NumberGroupSeparator;
                var arrDate = сontrolCulture.DateTimeFormat.ShortDatePattern.Split(new string[] { сontrolCulture.DateTimeFormat.DateSeparator }, StringSplitOptions.None);
                var ret = arrDate[0].Substring(0, 1).ToUpper(сontrolCulture);
                ret += arrDate[1].Substring(0, 1).ToUpper(сontrolCulture);
                ret += arrDate[2].Substring(0, 1).ToUpper(сontrolCulture);
                CultureDateFormat = ret;
                CultureCurrencySymbolPlaceholder = сontrolCulture.NumberFormat.CurrencySymbol;
                if(String.IsNullOrEmpty(сontrolCulture.DateTimeFormat.AMDesignator + сontrolCulture.DateTimeFormat.PMDesignator))
                    CultureAMPMPlaceholder = "";
                else
                    CultureAMPMPlaceholder = сontrolCulture.DateTimeFormat.AMDesignator + ";" + сontrolCulture.DateTimeFormat.PMDesignator;
            }
        }

        internal bool OverridePageCulture {
            get { return GetPropertyValue<bool>("OverridePageCulture", false); }
            set { SetPropertyValue<bool>("OverridePageCulture", value); }
        }

        /// <summary>
        /// Culture override
        /// </summary>
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        [ClientPropertyName("cultureDatePlaceholder")]
        public string CultureDatePlaceholder {
            get { return GetPropertyValue<string>("CultureDatePlaceholder", ""); }
            set { SetPropertyValue<string>("CultureDatePlaceholder", value); }
        }

        /// <summary>
        /// Culture override
        /// </summary>
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        [ClientPropertyName("cultureTimePlaceholder")]
        public string CultureTimePlaceholder {
            get { return GetPropertyValue<string>("CultureTimePlaceholder", ""); }
            set { SetPropertyValue<string>("CultureTimePlaceholder", value); }
        }

        /// <summary>
        /// Culture override
        /// </summary>
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        [ClientPropertyName("cultureDecimalPlaceholder")]
        public string CultureDecimalPlaceholder {
            get { return GetPropertyValue<string>("CultureDecimalPlaceholder", ""); }
            set { SetPropertyValue<string>("CultureDecimalPlaceholder", value); }
        }

        /// <summary>
        /// Culture override
        /// </summary>
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        [ClientPropertyName("cultureThousandsPlaceholder")]
        public string CultureThousandsPlaceholder {
            get { return GetPropertyValue<string>("CultureThousandsPlaceholder", ""); }
            set { SetPropertyValue<string>("CultureThousandsPlaceholder", value); }
        }

        /// <summary>
        /// Culture override
        /// </summary>
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        [ClientPropertyName("cultureDateFormat")]
        public string CultureDateFormat {
            get { return GetPropertyValue<string>("CultureDateFormat", ""); }
            set { SetPropertyValue<string>("CultureDateFormat", value); }
        }

        /// <summary>
        /// Culture override
        /// </summary>
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        [ClientPropertyName("cultureCurrencySymbolPlaceholder")]
        public string CultureCurrencySymbolPlaceholder {
            get { return GetPropertyValue<string>("CultureCurrencySymbolPlaceholder", ""); }
            set { SetPropertyValue<string>("CultureCurrencySymbolPlaceholder", value); }
        }

        /// <summary>
        /// Culture override
        /// </summary>
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        [ClientPropertyName("cultureAMPMPlaceholder")]
        public string CultureAMPMPlaceholder {
            get { return GetPropertyValue<string>("CultureAMPMPlaceholder", ""); }
            set { SetPropertyValue<string>("CultureAMPMPlaceholder", value); }
        }

        /// <summary>
        /// Determines whether or not AM/PM is accepted on time. The default value is false
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("acceptAMPM")]
        public bool AcceptAMPM {
            get { return GetPropertyValue<bool>("AcceptAmPm", false); }
            set { SetPropertyValue<bool>("AcceptAmPm", value); }
        }

        /// <summary>
        /// Set to True if the negative sign (-) is allowed
        /// </summary>
        /// <remarks>
        /// Possible values:
        /// None - Do not show the negative sign
        /// Left- Show the negative sign on the left of the mask
        /// Right - Show the negative sign on the right of the mask
        /// </remarks>
        [DefaultValue(MaskedEditShowSymbol.None)]
        [ExtenderControlProperty]
        [ClientPropertyName("acceptNegative")]
        public MaskedEditShowSymbol AcceptNegative {
            get { return GetPropertyValue<MaskedEditShowSymbol>("AcceptNegative", MaskedEditShowSymbol.None); }
            set { SetPropertyValue<MaskedEditShowSymbol>("AcceptNegative", value); }
        }

        /// <summary>
        /// A CSS class used when the TextBox gets focus with a negative value
        /// </summary>
        [DefaultValue("MaskedEditFocusNegative")]
        [ExtenderControlProperty]
        [ClientPropertyName("onFocusCssNegative")]
        public string OnFocusCssNegative {
            get { return GetPropertyValue<string>("OnFocusCssNegative", "MaskedEditFocusNegative"); }
            set { SetPropertyValue<string>("OnFocusCssNegative", value); }
        }

        /// <summary>
        /// A CSS class used when the TextBox loses focus with a negative value
        /// </summary>
        [DefaultValue("MaskedEditBlurNegative")]
        [ExtenderControlProperty]
        [ClientPropertyName("onBlurCssNegative")]
        public string OnBlurCssNegative {
            get { return GetPropertyValue<string>("OnBlurCssNegative", "MaskedEditBlurNegative"); }
            set { SetPropertyValue<string>("OnBlurCssNegative", value); }
        }

        /// <summary>
        /// Specifies how the currency symbol is displayed
        /// </summary>
        /// <remarks>
        /// Possible values:
        /// None - Do not show the currency symbol
        /// Left - Show the currency symbol on the left of the mask
        /// Right - Show the currency symbol on the right of the mask
        /// </remarks>
        [DefaultValue(MaskedEditShowSymbol.None)]
        [ExtenderControlProperty]
        [ClientPropertyName("displayMoney")]
        public MaskedEditShowSymbol DisplayMoney {
            get { return GetPropertyValue<MaskedEditShowSymbol>("DisplayMoney", MaskedEditShowSymbol.None); }
            set { SetPropertyValue<MaskedEditShowSymbol>("DisplayMoney", value); }
        }

        /// <summary>
        /// A default century used when a date mask only has two digits for the year
        /// </summary>
        [DefaultValue(1900)]
        [ExtenderControlProperty]
        [ClientPropertyName("century")]
        public int Century {
            get {
                var century = int.Parse(DateTime.Now.Year.ToString().Substring(0, 2)) * 100;
                return GetPropertyValue<int>("Century", century);
            }
            set {
                if(value.ToString(CultureInfo.InvariantCulture).Length != 4)
                    throw new ArgumentException("The Century must have 4 digits.");
                else
                    SetPropertyValue<int>("Century", value);
            }
        }

        bool validateMaskType() {
            var mask = Mask;
            var maskType = MaskType;

            if(!string.IsNullOrEmpty(mask) && (maskType == MaskedEditType.Date || maskType == MaskedEditType.Time)) {
                var validMask = MaskedEditCommon.GetValidMask(mask);
                switch(maskType) {
                    case MaskedEditType.Date:
                        return Array.IndexOf(new string[] { "99/99/9999", "99/9999/99", "9999/99/99", "99/99/99" }, validMask) >= 0;
                    case MaskedEditType.Time:
                        return Array.IndexOf(new string[] { "99:99:99", "99:99" }, validMask) >= 0;
                    case MaskedEditType.DateTime:
                        return Array.IndexOf(new string[] { "99/99/9999 99:99:99", "99/99/9999 99:99", "99/9999/99 99:99:99", "99/9999/99 99:99", "9999/99/99 99:99:99", "9999/99/99 99:99", "99/99/99 99:99:99", "99/99/99 99:99" }, validMask) >= 0;
                    case MaskedEditType.Number:
                        foreach(char ch in validMask) {
                            if(ch != '9' && ch != '.' && ch != ',')
                                return false;
                        }
                        break;
                }
            }
            return true;
        }
    }

}

#pragma warning restore 1591