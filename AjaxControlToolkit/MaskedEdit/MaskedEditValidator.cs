#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// MaskedEditValidator is a custom validator that attaches to the MaskedEdit extender and associates
    /// the TextBox and verifies that the input text matches the pattern specified in the MaskedEdit extender.
    /// Once associated with a validation group, server- and client-side validation can be performed and used
    /// to display messages.
    /// </summary>
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.MaskedEditName + Constants.IconPostfix)]
    public class MaskedEditValidator : BaseValidator {
        bool _isValidEmpty = true;
        string _messageTip = String.Empty;
        // error message
        string _messageInvalid = String.Empty;
        string _messageEmpty = String.Empty;
        string _messageMax = String.Empty;
        string _messageMin = String.Empty;
        // text message
        string _textInvalid = String.Empty;
        string _textEmpty = String.Empty;
        string _textMax = String.Empty;
        string _textMin = String.Empty;

        string _initialValue = String.Empty;
        string _validationExpression = String.Empty;
        string _clientValidationFunction = String.Empty;
        string _maximumValue = String.Empty;
        string _minimumValue = String.Empty;
        string _controlExtender = String.Empty;
        CultureInfo _culture;

        public event EventHandler<ServerValidateEventArgs> MaskedEditServerValidator;

        protected CultureInfo ControlCulture {
            get {
                if(_culture == null)
                    _culture = CultureInfo.CurrentCulture;

                return _culture;
            }
            set { _culture = value; }
        }

        new public string ErrorMessage {
            get {
                if(String.IsNullOrEmpty(base.ErrorMessage))
                    base.ErrorMessage = base.ID;

                return base.ErrorMessage;
            }
            set { base.ErrorMessage = value; }
        }

        /// <summary>
        /// Set to True if the TextBox can be empty
        /// </summary>
        [DefaultValue(true)]
        [Category("MaskedEdit")]
        public bool IsValidEmpty {
            get { return _isValidEmpty; }
            set { _isValidEmpty = value; }
        }

        /// <summary>
        /// A message displayed when the TextBox has focus with an empty value
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string TooltipMessage {
            get {
                if(_messageTip == null)
                    return String.Empty;

                return _messageTip;
            }
            set { _messageTip = value; }
        }

        /// <summary>
        /// A message displayed when test is empty and the TextBox has focus
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string EmptyValueMessage {
            get {
                if(_messageEmpty == null)
                    return String.Empty;

                return _messageEmpty;
            }
            set { _messageEmpty = value; }
        }

        /// <summary>
        /// A message displayed when text is empty and the TextBox does not have focus
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string EmptyValueBlurredText {
            get {
                if(_textEmpty == null)
                    return String.Empty;

                return _textEmpty;
            }
            set { _textEmpty = value; }
        }

        /// <summary>
        /// A message displayed when text is invalid and the TextBox has focus
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string InvalidValueMessage {
            get {
                if(_messageInvalid == null)
                    return String.Empty;

                return _messageInvalid;
            }
            set { _messageInvalid = value; }
        }

        /// <summary>
        /// A message displayed when text is invalid and the TextBox does not have focus
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string InvalidValueBlurredMessage {
            get {
                if(_textInvalid == null)
                    return String.Empty;

                return _textInvalid;
            }
            set { _textInvalid = value; }
        }

        /// <summary>
        /// A maximum value of the input
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string MaximumValue {
            get {
                if(_maximumValue == null)
                    return String.Empty;

                return _maximumValue;
            }
            set { _maximumValue = value; }
        }

        /// <summary>
        /// A message displayed when the maximum value is exceeded and the TextBox has focus
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string MaximumValueMessage {
            get {
                if(_messageMax == null)
                    return String.Empty;

                return _messageMax;
            }
            set { _messageMax = value; }
        }

        /// <summary>
        /// A message displayed when the maximum value is exceeded and the TextBox does not have focus
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string MaximumValueBlurredMessage {
            get {
                if(_textMax == null)
                    return String.Empty;

                return _textMax;
            }
            set { _textMax = value; }
        }

        /// <summary>
        /// A client script used for custom validation
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string ClientValidationFunction {
            get {
                if(_clientValidationFunction == null)
                    return String.Empty;

                return _clientValidationFunction;
            }
            set { _clientValidationFunction = value; }
        }

        /// <summary>
        /// The initial value of the TextBox
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string InitialValue {
            get {
                if(_initialValue == null)
                    return String.Empty;

                return _initialValue;
            }
            set { _initialValue = value; }
        }

        /// <summary>
        /// A regular expression used to validate the input
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string ValidationExpression {
            get {
                if(_validationExpression == null)
                    return String.Empty;

                return _validationExpression;
            }
            set { _validationExpression = value; }
        }

        /// <summary>
        /// A minimum value of the input
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string MinimumValue {
            get {
                if(_minimumValue == null)
                    return String.Empty;

                return _minimumValue;
            }
            set { _minimumValue = value; }
        }

        /// <summary>
        /// A message displayed when the minimum value is exceeded and the TextBox has focus
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string MinimumValueMessage {
            get {
                if(_messageMin == null)
                    return String.Empty;

                return _messageMin;
            }
            set { _messageMin = value; }
        }

        /// <summary>
        /// A message displayed when the minimum value is exceeded and the TextBox does not have focus
        /// </summary>
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string MinimumValueBlurredText {
            get {
                if(_textMin == null)
                    return String.Empty;

                return _textMin;
            }
            set { _textMin = value; }
        }

        /// <summary>
        /// ID of the MaskedEditExtender attached to the TextBox
        /// </summary>
        [DefaultValue("")]
        [TypeConverter(typeof(MaskedEditTypeConvert))]
        [RequiredProperty()]
        [Category("MaskedEdit")]
        public string ControlExtender {
            get {
                if(_controlExtender == null)
                    return String.Empty;

                return _controlExtender;
            }
            set { _controlExtender = value; }
        }

        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            if(EnableClientScript) {
                var maskExt = (MaskedEditExtender)FindControl(ControlExtender);
                var target = (TextBox)maskExt.FindControl(ControlToValidate);

                int firstMaskPos = -1;
                int lastMaskPosition = -1;

                if(maskExt.ClearMaskOnLostFocus) {
                    firstMaskPos = 0;
                    lastMaskPosition = MaskedEditCommon.GetValidMask(maskExt.Mask).Length + 1;
                }
                else {
                    firstMaskPos = MaskedEditCommon.GetFirstMaskPosition(maskExt.Mask);
                    lastMaskPosition = MaskedEditCommon.GetLastMaskPosition(maskExt.Mask) + 1;
                }

                ScriptManager.RegisterExpandoAttribute(this, ClientID, "IsMaskedEdit", true.ToString().ToLower(CultureInfo.InvariantCulture), true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "ValidEmpty", IsValidEmpty.ToString().ToLower(CultureInfo.InvariantCulture), true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "MaximumValue", MaximumValue, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "MinimumValue", MinimumValue, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "InitialValue", InitialValue, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "ValidationExpression", ValidationExpression, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "ClientValidationFunction", ClientValidationFunction, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "TargetValidator", target.ClientID, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "EmptyValueMessage", EmptyValueMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "EmptyValueText", EmptyValueBlurredText, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "MaximumValueMessage", MaximumValueMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "MaximumValueText", MaximumValueBlurredMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "MinimumValueMessage", MinimumValueMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "MinimumValueText", MinimumValueBlurredText, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "InvalidValueMessage", InvalidValueMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "InvalidValueText", InvalidValueBlurredMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "InvalidValueCssClass", maskExt.OnInvalidCssClass, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "CssBlurNegative", maskExt.OnBlurCssNegative, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "CssFocus", maskExt.OnFocusCssClass, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "CssFocusNegative", maskExt.OnFocusCssNegative, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "TooltipMessage", TooltipMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, ClientID, "FirstMaskPosition", firstMaskPos.ToString(CultureInfo.InvariantCulture), true);

                if(!String.IsNullOrEmpty(maskExt.CultureName) && maskExt.OverridePageCulture)
                    ControlCulture = CultureInfo.GetCultureInfo(maskExt.CultureName);
                else
                    ControlCulture = CultureInfo.CurrentCulture;

                switch(maskExt.MaskType) {
                    case MaskedEditType.None: {
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "evaluationfunction", "MaskedEditValidatorNone", true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "LastMaskPosition", lastMaskPosition.ToString(CultureInfo.InvariantCulture), true);
                            break;
                        }
                    case MaskedEditType.Number: {
                            var attibCu = ControlCulture.NumberFormat.CurrencySymbol;
                            var attibDc = ControlCulture.NumberFormat.CurrencyDecimalSeparator;
                            var attibTh = ControlCulture.NumberFormat.CurrencyGroupSeparator;

                            if(maskExt.DisplayMoney != MaskedEditShowSymbol.None)
                                lastMaskPosition += maskExt.CultureCurrencySymbolPlaceholder.Length + 1;

                            if(maskExt.AcceptNegative != MaskedEditShowSymbol.None)
                                if(maskExt.DisplayMoney != MaskedEditShowSymbol.None)
                                    lastMaskPosition++;
                                else
                                    lastMaskPosition += 2;

                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "Money", attibCu, true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "Decimal", attibDc, true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "Thousands", attibTh, true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "evaluationfunction", "MaskedEditValidatorNumber", true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "LastMaskPosition", lastMaskPosition.ToString(CultureInfo.InvariantCulture), true);
                            break;
                        }
                    case MaskedEditType.DateTime: {
                            //date
                            var attibSep = ControlCulture.DateTimeFormat.DateSeparator;
                            var arrDate = ControlCulture.DateTimeFormat.ShortDatePattern.Split(new string[] { ControlCulture.DateTimeFormat.DateSeparator }, StringSplitOptions.None);

                            var attibFmt = arrDate[0].Substring(0, 1).ToUpper(ControlCulture);
                            attibFmt += arrDate[1].Substring(0, 1).ToUpper(ControlCulture);
                            attibFmt += arrDate[2].Substring(0, 1).ToUpper(ControlCulture);

                            attibFmt = (maskExt.UserDateFormat == MaskedEditUserDateFormat.None ? attibFmt : maskExt.UserDateFormat.ToString());

                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "DateSeparator", attibSep, true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "DateFormat", attibFmt, true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "Century", maskExt.Century.ToString(CultureInfo.InvariantCulture), true);
                            //time
                            attibSep = ControlCulture.DateTimeFormat.TimeSeparator;
                            var attibSyb = String.Empty;
                            if(String.IsNullOrEmpty(ControlCulture.DateTimeFormat.AMDesignator + ControlCulture.DateTimeFormat.PMDesignator))
                                attibSyb = String.Empty;
                            else
                                attibSyb = ControlCulture.DateTimeFormat.AMDesignator + ";" + ControlCulture.DateTimeFormat.PMDesignator;

                            attibSyb = (maskExt.UserTimeFormat == MaskedEditUserTimeFormat.None ? attibSyb : String.Empty);

                            if(maskExt.AcceptAMPM)
                                if(!String.IsNullOrEmpty(attibSyb)) {
                                    var sep = Char.Parse(attibSep);
                                    var arrSyb = attibSyb.Split(sep);
                                    lastMaskPosition += arrSyb[0].Length + 1;
                                }

                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "TimeSeparator", attibSep, true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "AmPmSymbol", attibSyb, true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "evaluationfunction", "MaskedEditValidatorDateTime", true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "LastMaskPosition", lastMaskPosition.ToString(CultureInfo.InvariantCulture), true);
                            break;
                        }
                    case MaskedEditType.Date: {
                            var attibSep = ControlCulture.DateTimeFormat.DateSeparator;
                            var arrDate = ControlCulture.DateTimeFormat.ShortDatePattern.Split(new string[] { ControlCulture.DateTimeFormat.DateSeparator }, StringSplitOptions.None);

                            var attibFmt = arrDate[0].Substring(0, 1).ToUpper(ControlCulture);
                            attibFmt += arrDate[1].Substring(0, 1).ToUpper(ControlCulture);
                            attibFmt += arrDate[2].Substring(0, 1).ToUpper(ControlCulture);

                            attibFmt = (maskExt.UserDateFormat == MaskedEditUserDateFormat.None ? attibFmt : maskExt.UserDateFormat.ToString());

                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "DateSeparator", attibSep, true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "DateFormat", attibFmt, true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "Century", maskExt.Century.ToString(CultureInfo.InvariantCulture), true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "evaluationfunction", "MaskedEditValidatorDate", true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "LastMaskPosition", lastMaskPosition.ToString(CultureInfo.InvariantCulture), true);
                            break;
                        }
                    case MaskedEditType.Time: {
                            var attibSep = ControlCulture.DateTimeFormat.TimeSeparator;
                            var attibSyb = String.Empty;
                            if(String.IsNullOrEmpty(ControlCulture.DateTimeFormat.AMDesignator + ControlCulture.DateTimeFormat.PMDesignator))
                                attibSyb = String.Empty;
                            else
                                attibSyb = ControlCulture.DateTimeFormat.AMDesignator + ";" + ControlCulture.DateTimeFormat.PMDesignator;

                            attibSyb = (maskExt.UserTimeFormat == MaskedEditUserTimeFormat.None ? attibSyb : String.Empty);

                            if(maskExt.AcceptAMPM)
                                if(!String.IsNullOrEmpty(attibSyb)) {
                                    var sep = Char.Parse(attibSep);
                                    var arrSyb = attibSyb.Split(sep);
                                    lastMaskPosition += arrSyb[0].Length + 1;
                                }

                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "TimeSeparator", attibSep, true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "AmPmSymbol", attibSyb, true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "evaluationfunction", "MaskedEditValidatorTime", true);
                            ScriptManager.RegisterExpandoAttribute(this, ClientID, "LastMaskPosition", lastMaskPosition.ToString(CultureInfo.InvariantCulture), true);
                            break;
                        }
                }
            }
        }

        protected override bool ControlPropertiesValid() {
            return (FindControl(ControlToValidate) is System.Web.UI.WebControls.TextBox);
        }

        protected override bool EvaluateIsValid() {
            var maskExt = (MaskedEditExtender)FindControl(ControlExtender);
            var target = (TextBox)maskExt.FindControl(ControlToValidate);

            base.ErrorMessage = String.Empty;
            base.Text = String.Empty;

            var cssError = String.Empty;
            var ok = true;

            if(!IsValidEmpty)
                if(target.Text.Trim() == InitialValue) {
                    base.ErrorMessage = EmptyValueMessage;
                    if(String.IsNullOrEmpty(EmptyValueBlurredText))
                        base.Text = base.ErrorMessage;
                    else
                        base.Text = EmptyValueBlurredText;

                    cssError = maskExt.OnInvalidCssClass;
                    ok = false;
                }

            if(ok && target.Text.Length != 0 && ValidationExpression.Length != 0)
                try {
                    var regex = new Regex(ValidationExpression);
                    ok = regex.IsMatch(target.Text);
                }
                catch {
                    ok = false;
                }

            if(ok && target.Text.Length != 0) {
                var culture = maskExt.CultureName;
                if(String.IsNullOrEmpty(culture))
                    culture = CultureInfo.CurrentCulture.Name;

                ControlCulture = CultureInfo.GetCultureInfo(culture);
                var cultureAMPMP = String.Empty;

                if(!String.IsNullOrEmpty(ControlCulture.DateTimeFormat.AMDesignator) && !String.IsNullOrEmpty(ControlCulture.DateTimeFormat.PMDesignator))
                    cultureAMPMP = ControlCulture.DateTimeFormat.AMDesignator + ";" + ControlCulture.DateTimeFormat.PMDesignator;

                switch(maskExt.MaskType) {
                    case MaskedEditType.Number:
                        try {
                            var numval = Decimal.Parse(target.Text, ControlCulture);
                        }
                        catch {
                            ok = false;
                        }
                        break;
                    case MaskedEditType.DateTime:
                    case MaskedEditType.Date:
                    case MaskedEditType.Time:
                        var tamtext = target.Text.Length;
                        // gmorgan (25/06/2007) - Added check for AcceptAMPM in MaskedEditExtender to fix bug
                        // with validation in 24hr mode.
                        if(maskExt.AcceptAMPM &&
                            !String.IsNullOrEmpty(cultureAMPMP) &&
                            (maskExt.MaskType == MaskedEditType.Time || maskExt.MaskType == MaskedEditType.DateTime)) {

                            var charSeparators = new char[] { ';' };
                            var arrAMPM = cultureAMPMP.Split(charSeparators);
                            if(arrAMPM[0].Length != 0)
                                tamtext -= (arrAMPM[0].Length + 1);
                        }
                        var expectedLength = MaskedEditCommon.GetValidMask(maskExt.Mask).Length;
                        if(maskExt.MaskType != MaskedEditType.Time) {
                            var currentCultureDateSeparatorLength =
                                (String.IsNullOrEmpty(maskExt.CultureName) ? CultureInfo.CurrentCulture : CultureInfo.GetCultureInfo(maskExt.CultureName)).DateTimeFormat.DateSeparator.Length;
                            // there are always 2 separators, and each separator adds to the expected length by the amount over size 1 that it is.
                            expectedLength += (currentCultureDateSeparatorLength - 1) * 2;
                        }
                        if(expectedLength != tamtext)
                            ok = false;

                        if(ok)
                            try {
                                var dtval = DateTime.Parse(target.Text, ControlCulture);
                            }
                            catch {
                                ok = false;
                            }

                        break;
                }

                if(!ok) {
                    base.ErrorMessage = InvalidValueMessage;
                    if(String.IsNullOrEmpty(InvalidValueBlurredMessage))
                        base.Text = base.ErrorMessage;
                    else
                        base.Text = InvalidValueBlurredMessage;

                    cssError = maskExt.OnInvalidCssClass;
                }

                if(ok && (!String.IsNullOrEmpty(MaximumValue) || !String.IsNullOrEmpty(MinimumValue))) {
                    switch(maskExt.MaskType) {
                        case MaskedEditType.None: {
                                int lenvalue;
                                if(!String.IsNullOrEmpty(MaximumValue)) {
                                    try {
                                        lenvalue = Int32.Parse(MaximumValue, ControlCulture);
                                        ok = (lenvalue >= target.Text.Length);
                                    }
                                    catch {
                                        base.ErrorMessage = InvalidValueMessage;
                                        if(String.IsNullOrEmpty(InvalidValueBlurredMessage))
                                            base.Text = base.ErrorMessage;
                                        else
                                            base.Text = InvalidValueBlurredMessage;

                                        ok = false;
                                    }

                                    if(!ok) {
                                        base.ErrorMessage = MaximumValueMessage;
                                        if(String.IsNullOrEmpty(MaximumValueBlurredMessage))
                                            base.Text = base.ErrorMessage;
                                        else {
                                            base.Text = MaximumValueBlurredMessage;
                                        }

                                        cssError = maskExt.OnInvalidCssClass;
                                    }
                                }

                                if(ok && !String.IsNullOrEmpty(MinimumValue)) {
                                    try {
                                        lenvalue = Int32.Parse(MinimumValue, ControlCulture);
                                        ok = (lenvalue <= target.Text.Length);
                                    }
                                    catch {
                                        base.ErrorMessage = InvalidValueMessage;
                                        if(String.IsNullOrEmpty(InvalidValueBlurredMessage))
                                            base.Text = base.ErrorMessage;
                                        else
                                            base.Text = InvalidValueBlurredMessage;

                                        ok = false;
                                    }
                                    if(!ok) {
                                        base.ErrorMessage = MinimumValueMessage;
                                        if(String.IsNullOrEmpty(MinimumValueBlurredText))
                                            base.Text = base.ErrorMessage;
                                        else
                                            base.Text = MinimumValueBlurredText;

                                        cssError = maskExt.OnInvalidCssClass;
                                    }
                                }
                                break;
                            }
                        case MaskedEditType.Number: {
                                var numval = Decimal.Parse(target.Text, ControlCulture);
                                decimal compval;

                                if(!String.IsNullOrEmpty(MaximumValue)) {
                                    try {
                                        compval = Decimal.Parse(MaximumValue, ControlCulture);
                                        ok = (compval >= numval);
                                    }
                                    catch {
                                        ok = false;
                                    }
                                    if(!ok) {
                                        base.ErrorMessage = MaximumValueMessage;
                                        if(String.IsNullOrEmpty(MaximumValueBlurredMessage))
                                            base.Text = base.ErrorMessage;
                                        else
                                            base.Text = MaximumValueBlurredMessage;

                                        cssError = maskExt.OnInvalidCssClass;
                                    }
                                }

                                if(ok && !String.IsNullOrEmpty(MinimumValue)) {
                                    try {
                                        compval = Decimal.Parse(MinimumValue, ControlCulture);
                                        ok = (compval <= numval);
                                    }
                                    catch {
                                        ok = false;
                                    }

                                    if(!ok) {
                                        base.ErrorMessage = MinimumValueMessage;
                                        if(String.IsNullOrEmpty(MinimumValueBlurredText))
                                            base.Text = base.ErrorMessage;
                                        else
                                            base.Text = MinimumValueBlurredText;

                                        cssError = maskExt.OnInvalidCssClass;
                                    }
                                }
                                break;
                            }
                        case MaskedEditType.DateTime:
                        case MaskedEditType.Date:
                        case MaskedEditType.Time: {
                                var dtval = DateTime.Parse(target.Text, ControlCulture);
                                DateTime dtCompval;

                                if(!String.IsNullOrEmpty(MaximumValue)) {
                                    try {
                                        dtCompval = DateTime.Parse(MaximumValue, ControlCulture);
                                        ok = (dtCompval >= dtval);
                                    }
                                    catch {
                                        ok = false;
                                    }

                                    if(!ok) {
                                        base.ErrorMessage = MaximumValueMessage;
                                        if(String.IsNullOrEmpty(MaximumValueBlurredMessage))
                                            base.Text = base.ErrorMessage;
                                        else
                                            base.Text = MaximumValueBlurredMessage;

                                        cssError = maskExt.OnInvalidCssClass;
                                    }
                                }
                                if(ok && !String.IsNullOrEmpty(MinimumValue)) {
                                    try {
                                        dtCompval = DateTime.Parse(MinimumValue, ControlCulture);
                                        ok = (dtCompval <= dtval);
                                    }
                                    catch {
                                        ok = false;
                                    }
                                    if(!ok) {
                                        base.ErrorMessage = MinimumValueMessage;
                                        if(String.IsNullOrEmpty(MinimumValueBlurredText))
                                            base.Text = base.ErrorMessage;
                                        else
                                            base.Text = MinimumValueBlurredText;

                                        cssError = maskExt.OnInvalidCssClass;
                                    }
                                }
                                break;
                            }
                    }
                }
            }

            if(ok && MaskedEditServerValidator != null) {
                var serverValidateEventArgs = new ServerValidateEventArgs(target.Text, ok);
                MaskedEditServerValidator(target, serverValidateEventArgs);
                ok = serverValidateEventArgs.IsValid;
                if(!ok) {
                    cssError = maskExt.OnInvalidCssClass;
                    base.ErrorMessage = InvalidValueMessage;
                    if(String.IsNullOrEmpty(InvalidValueBlurredMessage))
                        base.Text = base.ErrorMessage;
                    else
                        base.Text = InvalidValueBlurredMessage;
                }
            }
            if(!ok) {
                // set CSS at server for browser with not implement client validator script (FF, others)   
                //MaskedEditSetCssClass(value,CSS)
                var script = "MaskedEditSetCssClass(" + ClientID + ",'" + cssError + "');";
                ScriptManager.RegisterStartupScript(this, typeof(MaskedEditValidator), "MaskedEditServerValidator_" + ID, script, true);
            }
            return ok;
        }
    }

}

#pragma warning restore 1591