using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.MaskedEditExtenderDesigner, AjaxControlToolkit")]
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

        [RequiredProperty()]
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string Mask {
            get { return GetPropertyValue<string>("Mask", ""); }
            set {
                if(!validateMaskType()) {
                    throw new ArgumentException("Validate Type and/or Mask is invalid!");
                }
                SetPropertyValue<string>("Mask", value);
            }
        }

        [DefaultValue("Your browser security settings don't permit the automatic execution of paste operations. Please use the keyboard shortcut Ctrl+V instead.")]
        [ExtenderControlProperty]
        public string ClipboardText {
            get { return GetPropertyValue<string>("ClipboardText", "Your browser security settings don't permit the automatic execution of paste operations. Please use the keyboard shortcut Ctrl+V instead."); }
            set { SetPropertyValue<string>("ClipboardText", value); }
        }

        [DefaultValue(MaskedEditType.None)]
        [ExtenderControlProperty]
        [RefreshProperties(RefreshProperties.All)]
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

        [DefaultValue(true)]
        [ExtenderControlProperty]
        public bool MessageValidatorTip {
            get { return GetPropertyValue<bool>("MessageValidatorTip", true); }
            set { SetPropertyValue<bool>("MessageValidatorTip", value); }
        }

        [DefaultValue(false)]
        [ExtenderControlProperty]
        public bool ErrorTooltipEnabled {
            get { return GetPropertyValue<bool>("ErrorTooltipEnabled", false); }
            set { SetPropertyValue<bool>("ErrorTooltipEnabled", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        public string ErrorTooltipCssClass {
            get { return GetPropertyValue<string>("ErrorTooltipCssClass", ""); }
            set { SetPropertyValue<string>("ErrorTooltipCssClass", value); }
        }

        [DefaultValue(true)]
        [ExtenderControlProperty]
        public bool ClipboardEnabled {
            get { return GetPropertyValue<bool>("ClipboardEnabled", true); }
            set { SetPropertyValue<bool>("ClipboardEnabled", value); }
        }

        [DefaultValue(true)]
        [ExtenderControlProperty]
        public bool AutoComplete {
            get { return GetPropertyValue<bool>("AutoComplete", true); }
            set { SetPropertyValue<bool>("AutoComplete", value); }
        }

        [DefaultValue(false)]
        [ExtenderControlProperty]
        public bool ClearTextOnInvalid {
            get { return GetPropertyValue<bool>("ClearTextOnInvalid", false); }
            set { SetPropertyValue<bool>("ClearTextOnInvalid", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        public string AutoCompleteValue {
            get { return GetPropertyValue<string>("AutoCompleteValue", ""); }
            set { SetPropertyValue<string>("AutoCompleteValue", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        public string Filtered {
            get { return GetPropertyValue<string>("Filtered", ""); }
            set { SetPropertyValue<string>("Filtered", value); }
        }

        [DefaultValue(MaskedEditInputDirection.LeftToRight)]
        [ExtenderControlProperty]
        public MaskedEditInputDirection InputDirection {
            get { return GetPropertyValue<MaskedEditInputDirection>("InputDirection", MaskedEditInputDirection.LeftToRight); }
            set { SetPropertyValue<MaskedEditInputDirection>("InputDirection", value); }
        }

        [DefaultValue("_")]
        [ExtenderControlProperty]
        public string PromptCharacter {
            get { return GetPropertyValue<string>("PromptChar", "_"); }
            set { SetPropertyValue<string>("PromptChar", value); }
        }

        [DefaultValue("MaskedEditFocus")]
        [ExtenderControlProperty]
        public string OnFocusCssClass {
            get { return GetPropertyValue<string>("OnFocusCssClass", "MaskedEditFocus"); }
            set { SetPropertyValue<string>("OnFocusCssClass", value); }
        }

        [DefaultValue("MaskedEditError")]
        [ExtenderControlProperty]
        public string OnInvalidCssClass {
            get { return GetPropertyValue<string>("OnInvalidCssClass", "MaskedEditError"); }
            set { SetPropertyValue<string>("OnInvalidCssClass", value); }
        }

        [DefaultValue(MaskedEditUserDateFormat.None)]
        [ExtenderControlProperty]
        public MaskedEditUserDateFormat UserDateFormat {
            get { return GetPropertyValue<MaskedEditUserDateFormat>("UserDateFormat", MaskedEditUserDateFormat.None); }
            set { SetPropertyValue<MaskedEditUserDateFormat>("UserDateFormat", value); }
        }

        [DefaultValue(MaskedEditUserTimeFormat.None)]
        [ExtenderControlProperty]
        public MaskedEditUserTimeFormat UserTimeFormat {
            get { return GetPropertyValue<MaskedEditUserTimeFormat>("UserTimeFormat", MaskedEditUserTimeFormat.None); }
            set { SetPropertyValue<MaskedEditUserTimeFormat>("UserTimeFormat", value); }
        }

        [DefaultValue(true)]
        [ExtenderControlProperty]
        public bool ClearMaskOnLostFocus {
            get { return GetPropertyValue<bool>("ClearMaskOnLostfocus", true); }
            set { SetPropertyValue<bool>("ClearMaskOnLostfocus", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [RefreshProperties(RefreshProperties.All)]
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

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        public string CultureDatePlaceholder {
            get { return GetPropertyValue<string>("CultureDatePlaceholder", ""); }
            set { SetPropertyValue<string>("CultureDatePlaceholder", value); }
        }

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        public string CultureTimePlaceholder {
            get { return GetPropertyValue<string>("CultureTimePlaceholder", ""); }
            set { SetPropertyValue<string>("CultureTimePlaceholder", value); }
        }

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        public string CultureDecimalPlaceholder {
            get { return GetPropertyValue<string>("CultureDecimalPlaceholder", ""); }
            set { SetPropertyValue<string>("CultureDecimalPlaceholder", value); }
        }

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        public string CultureThousandsPlaceholder {
            get { return GetPropertyValue<string>("CultureThousandsPlaceholder", ""); }
            set { SetPropertyValue<string>("CultureThousandsPlaceholder", value); }
        }

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        public string CultureDateFormat {
            get { return GetPropertyValue<string>("CultureDateFormat", ""); }
            set { SetPropertyValue<string>("CultureDateFormat", value); }
        }

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        public string CultureCurrencySymbolPlaceholder {
            get { return GetPropertyValue<string>("CultureCurrencySymbolPlaceholder", ""); }
            set { SetPropertyValue<string>("CultureCurrencySymbolPlaceholder", value); }
        }

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        public string CultureAMPMPlaceholder {
            get { return GetPropertyValue<string>("CultureAMPMPlaceholder", ""); }
            set { SetPropertyValue<string>("CultureAMPMPlaceholder", value); }
        }

        [DefaultValue(false)]
        [ExtenderControlProperty]
        public bool AcceptAMPM {
            get { return GetPropertyValue<bool>("AcceptAmPm", false); }
            set { SetPropertyValue<bool>("AcceptAmPm", value); }
        }

        [DefaultValue(MaskedEditShowSymbol.None)]
        [ExtenderControlProperty]
        public MaskedEditShowSymbol AcceptNegative {
            get { return GetPropertyValue<MaskedEditShowSymbol>("AcceptNegative", MaskedEditShowSymbol.None); }
            set { SetPropertyValue<MaskedEditShowSymbol>("AcceptNegative", value); }
        }
        [DefaultValue("MaskedEditFocusNegative")]
        [ExtenderControlProperty]
        public string OnFocusCssNegative {
            get { return GetPropertyValue<string>("OnFocusCssNegative", "MaskedEditFocusNegative"); }
            set { SetPropertyValue<string>("OnFocusCssNegative", value); }
        }

        [DefaultValue("MaskedEditBlurNegative")]
        [ExtenderControlProperty]
        public string OnBlurCssNegative {
            get { return GetPropertyValue<string>("OnBlurCssNegative", "MaskedEditBlurNegative"); }
            set { SetPropertyValue<string>("OnBlurCssNegative", value); }
        }

        [DefaultValue(MaskedEditShowSymbol.None)]
        [ExtenderControlProperty]
        public MaskedEditShowSymbol DisplayMoney {
            get { return GetPropertyValue<MaskedEditShowSymbol>("DisplayMoney", MaskedEditShowSymbol.None); }
            set { SetPropertyValue<MaskedEditShowSymbol>("DisplayMoney", value); }
        }

        [DefaultValue(1900)]
        [ExtenderControlProperty]
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
