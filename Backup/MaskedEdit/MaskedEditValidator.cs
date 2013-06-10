
// Product      : MaskedEdit Validator Control
// Version      : 1.0.0.0
// Date         : 10/23/2006
// Development  : Fernando Cerqueira 
// Version      : 1.0.0.1
// Development  : 02/22/2007 Fernando Cerqueira 
// 
using System;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.ComponentModel;
using System.Collections;
using System.Globalization;

[assembly: System.Web.UI.WebResource("MaskedEdit.MaskedEditValidator.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("MaskedEdit.MaskedEditValidator.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    [System.Drawing.ToolboxBitmap(typeof(MaskedEditValidator), "MaskedEdit.MaskedEdit.ico")]
    public class MaskedEditValidator : BaseValidator //obsolet AjaxControlToolkit.MaskedEditValidatorCompatibility.BaseValidator
    {
        bool _IsValidEmpty = true;
        string _MessageTip = "";
        // erro message
        string _MessageInvalid = "";
        string _MessageEmpty = "";
        string _MessageMax = "";
        string _MessageMin = "";
        // Text message
        string _TextInvalid = "";
        string _TextEmpty = "";
        string _TextMax = "";
        string _TextMin = "";

        string _InitialValue = "";
        string _ValidationExpression = "";
        string _ClientValidationFunction = "";
        string _MaximumValue = "";
        string _MinimumValue = "";
        string _ControlExtender = "";
        System.Globalization.CultureInfo _Culture; 
        public event EventHandler<ServerValidateEventArgs> MaskedEditServerValidator;

        protected System.Globalization.CultureInfo ControlCulture
        {
            get
            {
                if (_Culture == null)
                {
                    _Culture = System.Globalization.CultureInfo.CurrentCulture;
                }
                return _Culture;
            }
            set
            {
                _Culture = value;
            }
        }

        new public string ErrorMessage
        {
            get
            {
                if (string.IsNullOrEmpty(base.ErrorMessage))
                {
                    base.ErrorMessage = base.ID;
                }
                return base.ErrorMessage;
            }
            set
            {
                base.ErrorMessage = value;
            }
        }
        [DefaultValue(true)]
        [Category("MaskedEdit")]
        public bool IsValidEmpty
        {
            get
            {
                return _IsValidEmpty;
            }
            set
            {
                _IsValidEmpty = value;
            }
        }
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string TooltipMessage
        {
            get
            {
                if (_MessageTip == null)
                {
                    return string.Empty;
                }
                return _MessageTip;
            }
            set
            {
                _MessageTip = value;
            }
        }
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string EmptyValueMessage
        {
            get
            {
                if (_MessageEmpty == null)
                {
                    return string.Empty;
                }
                return _MessageEmpty;
            }
            set
            {
                _MessageEmpty = value;
            }
        }
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string EmptyValueBlurredText
        {
            get
            {
                if (_TextEmpty == null)
                {
                    return string.Empty;
                }
                return _TextEmpty;
            }
            set
            {
                _TextEmpty = value;
            }
        }
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string InvalidValueMessage
        {
            get
            {
                if (_MessageInvalid == null)
                {
                    return string.Empty;
                }
                return _MessageInvalid;
            }
            set
            {
                _MessageInvalid = value;
            }
        }
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string InvalidValueBlurredMessage
        {
            get
            {
                if (_TextInvalid == null)
                {
                    return string.Empty;
                }
                return _TextInvalid;
            }
            set
            {
                _TextInvalid = value;
            }
        }
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string MaximumValue
        {
            get
            {
                if (_MaximumValue == null)
                {
                    return string.Empty;
                }
                return _MaximumValue;
            }
            set
            {
                _MaximumValue = value;
            }
        }
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string MaximumValueMessage
        {
            get
            {
                if (_MessageMax == null)
                {
                    return string.Empty;
                }
                return _MessageMax;
            }
            set
            {
                _MessageMax = value;
            }
        }
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string MaximumValueBlurredMessage
        {
            get
            {
                if (_TextMax == null)
                {
                    return string.Empty;
                }
                return _TextMax;
            }
            set
            {
                _TextMax = value;
            }
        }

        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string ClientValidationFunction
        {
            get
            {
                if (_ClientValidationFunction == null)
                {
                    return string.Empty;
                }
                return _ClientValidationFunction;
            }
            set
            {
                _ClientValidationFunction = value;
            }
        }
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string InitialValue
        {
            get
            {
                if (_InitialValue == null)
                {
                    return string.Empty;
                }
                return _InitialValue;
            }
            set
            {
                _InitialValue = value;
            }
        }
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string ValidationExpression
        {
            get
            {
                if (_ValidationExpression == null)
                {
                    return string.Empty;
                }
                return _ValidationExpression;
            }
            set
            {
                _ValidationExpression = value;
            }
        }
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string MinimumValue
        {
            get
            {
                if (_MinimumValue == null)
                {
                    return string.Empty;
                }
                return _MinimumValue;
            }
            set
            {
                _MinimumValue = value;
            }
        }
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string MinimumValueMessage
        {
            get
            {
                if (_MessageMin == null)
                {
                    return string.Empty;
                }
                return _MessageMin;
            }
            set
            {
                _MessageMin = value;
            }
        }
        [DefaultValue("")]
        [Category("MaskedEdit")]
        public string MinimumValueBlurredText
        {
            get
            {
                if (_TextMin == null)
                {
                    return string.Empty;
                }
                return _TextMin;
            }
            set
            {
                _TextMin = value;
            }
        }
        [DefaultValue("")]
        [TypeConverter(typeof(MaskedEditTypeConvert))]
        [RequiredProperty()]
        [Category("MaskedEdit")]
        public string ControlExtender
        {
            get
            {
                if (_ControlExtender == null)
                {
                    return string.Empty;
                }
                return _ControlExtender;
            }
            set
            {
                _ControlExtender = value;
            }
        }
        [System.Diagnostics.CodeAnalysis.SuppressMessage ("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase", Justification="Don't want to change interaction with ScriptManager")]
        protected override void OnPreRender(System.EventArgs e)
        {
            base.OnPreRender(e);
            if (this.EnableClientScript)
            {
                // register Script Resource at current page
                ScriptManager.RegisterClientScriptResource(this, typeof(MaskedEditValidator), "MaskedEdit.MaskedEditValidator.js");

                MaskedEditExtender MaskExt = (MaskedEditExtender)FindControl(ControlExtender);
                TextBox Target = (TextBox)MaskExt.FindControl(ControlToValidate);

                int FirstMaskPos = -1;
                int LastMaskPosition = -1;
                if (MaskExt.ClearMaskOnLostFocus)
                {
                    FirstMaskPos = 0;
                    LastMaskPosition = MaskedEditCommon.GetValidMask(MaskExt.Mask).Length + 1;
                }
                else
                {
                    FirstMaskPos = MaskedEditCommon.GetFirstMaskPosition(MaskExt.Mask);
                    LastMaskPosition = MaskedEditCommon.GetLastMaskPosition(MaskExt.Mask) + 1;
                }
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "IsMaskedEdit", true.ToString().ToLower(CultureInfo.InvariantCulture), true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "ValidEmpty", this.IsValidEmpty.ToString().ToLower(CultureInfo.InvariantCulture), true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "MaximumValue", this.MaximumValue, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "MinimumValue", this.MinimumValue, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "InitialValue", this.InitialValue, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "ValidationExpression", this.ValidationExpression, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "ClientValidationFunction", this.ClientValidationFunction, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "TargetValidator", Target.ClientID, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "EmptyValueMessage", this.EmptyValueMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "EmptyValueText", this.EmptyValueBlurredText, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "MaximumValueMessage", this.MaximumValueMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "MaximumValueText", this.MaximumValueBlurredMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "MinimumValueMessage", this.MinimumValueMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "MinimumValueText", this.MinimumValueBlurredText, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "InvalidValueMessage", this.InvalidValueMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "InvalidValueText", this.InvalidValueBlurredMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "InvalidValueCssClass", MaskExt.OnInvalidCssClass, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "CssBlurNegative", MaskExt.OnBlurCssNegative, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "CssFocus", MaskExt.OnFocusCssClass, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "CssFocusNegative", MaskExt.OnFocusCssNegative, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "TooltipMessage", this.TooltipMessage, true);
                ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "FirstMaskPosition", FirstMaskPos.ToString(CultureInfo.InvariantCulture), true);

                if (!String.IsNullOrEmpty(MaskExt.CultureName) && MaskExt.OverridePageCulture)
                {
                    ControlCulture = System.Globalization.CultureInfo.GetCultureInfo(MaskExt.CultureName);
                }
                else
                {
                    ControlCulture = System.Globalization.CultureInfo.CurrentCulture;
                }

                switch (MaskExt.MaskType)
                {
                    case MaskedEditType.None:
                        {
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "evaluationfunction", "MaskedEditValidatorNone", true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "LastMaskPosition", LastMaskPosition.ToString(CultureInfo.InvariantCulture), true);
                            break;
                        }
                    case MaskedEditType.Number:
                        {
                            string AttibCu = ControlCulture.NumberFormat.CurrencySymbol;
                            string AttibDc = ControlCulture.NumberFormat.CurrencyDecimalSeparator;
                            string AttibTh = ControlCulture.NumberFormat.CurrencyGroupSeparator;
                            if (MaskExt.DisplayMoney != MaskedEditShowSymbol.None)
                            {
                                LastMaskPosition += MaskExt.CultureCurrencySymbolPlaceholder.Length + 1;
                            }
                            if (MaskExt.AcceptNegative != MaskedEditShowSymbol.None)
                            {
                                if (MaskExt.DisplayMoney != MaskedEditShowSymbol.None)
                                {
                                    LastMaskPosition++;
                                }
                                else
                                {
                                    LastMaskPosition += 2;
                                }
                            }
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "Money", AttibCu, true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "Decimal", AttibDc, true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "Thousands", AttibTh, true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "evaluationfunction", "MaskedEditValidatorNumber", true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "LastMaskPosition", LastMaskPosition.ToString(CultureInfo.InvariantCulture), true);
                            break;
                        }
                    case MaskedEditType.DateTime:
                        { 
                            //date
                            string AttibSep = ControlCulture.DateTimeFormat.DateSeparator;
                            string[] arrDate = ControlCulture.DateTimeFormat.ShortDatePattern.Split(new string[] { ControlCulture.DateTimeFormat.DateSeparator }, StringSplitOptions.None);
                           
                            string AttibFmt = arrDate[0].Substring(0, 1).ToUpper(ControlCulture);
                            AttibFmt += arrDate[1].Substring(0, 1).ToUpper(ControlCulture);
                            AttibFmt += arrDate[2].Substring(0, 1).ToUpper(ControlCulture);

                            AttibFmt = (MaskExt.UserDateFormat == MaskedEditUserDateFormat.None ? AttibFmt : MaskExt.UserDateFormat.ToString());

                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "DateSeparator", AttibSep, true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "DateFormat", AttibFmt, true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "Century", MaskExt.Century.ToString(CultureInfo.InvariantCulture), true);
                            //time
                            AttibSep = ControlCulture.DateTimeFormat.TimeSeparator;
                            string AttibSyb = "";
                            if (String.IsNullOrEmpty(ControlCulture.DateTimeFormat.AMDesignator + ControlCulture.DateTimeFormat.PMDesignator))
                            {
                                AttibSyb = "";
                            }
                            else
                            {
                                AttibSyb = ControlCulture.DateTimeFormat.AMDesignator + ";" + ControlCulture.DateTimeFormat.PMDesignator;
                            }

                            AttibSyb = (MaskExt.UserTimeFormat == MaskedEditUserTimeFormat.None ? AttibSyb : "");

                            if (MaskExt.AcceptAMPM)
                            {
                                if (!String.IsNullOrEmpty(AttibSyb))
                                {
                                    char sep = System.Char.Parse(AttibSep);
                                    string[] arrSyb = AttibSyb.Split(sep);
                                    LastMaskPosition += arrSyb[0].Length + 1;
                                }
                            }
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "TimeSeparator", AttibSep, true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "AmPmSymbol", AttibSyb, true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "evaluationfunction", "MaskedEditValidatorDateTime", true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "LastMaskPosition", LastMaskPosition.ToString(CultureInfo.InvariantCulture), true);
                            break;
                        }
                    case MaskedEditType.Date:
                        {
                            string AttibSep = ControlCulture.DateTimeFormat.DateSeparator;
                            string[] arrDate = ControlCulture.DateTimeFormat.ShortDatePattern.Split(new string[] { ControlCulture.DateTimeFormat.DateSeparator }, StringSplitOptions.None);
                           
                            string AttibFmt = arrDate[0].Substring(0, 1).ToUpper(ControlCulture);
                            AttibFmt += arrDate[1].Substring(0, 1).ToUpper(ControlCulture);
                            AttibFmt += arrDate[2].Substring(0, 1).ToUpper(ControlCulture);

                            AttibFmt = (MaskExt.UserDateFormat == MaskedEditUserDateFormat.None ? AttibFmt : MaskExt.UserDateFormat.ToString());

                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "DateSeparator", AttibSep, true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "DateFormat", AttibFmt, true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "Century", MaskExt.Century.ToString(CultureInfo.InvariantCulture), true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "evaluationfunction", "MaskedEditValidatorDate", true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "LastMaskPosition", LastMaskPosition.ToString(CultureInfo.InvariantCulture), true);
                            break;
                        }
                    case MaskedEditType.Time:
                        {
                            string AttibSep = ControlCulture.DateTimeFormat.TimeSeparator;
                            string AttibSyb = "";
                            if (String.IsNullOrEmpty(ControlCulture.DateTimeFormat.AMDesignator + ControlCulture.DateTimeFormat.PMDesignator))
                            {
                                AttibSyb = "";
                            }
                            else
                            {
                                AttibSyb = ControlCulture.DateTimeFormat.AMDesignator + ";" + ControlCulture.DateTimeFormat.PMDesignator;
                            }

                            AttibSyb = (MaskExt.UserTimeFormat == MaskedEditUserTimeFormat.None ? AttibSyb : "");
                            
                            if (MaskExt.AcceptAMPM)
                            {
                                if (!String.IsNullOrEmpty(AttibSyb))
                                {
                                    char sep = System.Char.Parse(AttibSep);
                                    string[] arrSyb = AttibSyb.Split(sep);
                                    LastMaskPosition += arrSyb[0].Length + 1;
                                }
                            }
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "TimeSeparator", AttibSep, true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "AmPmSymbol", AttibSyb, true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "evaluationfunction", "MaskedEditValidatorTime", true);
                            ScriptManager.RegisterExpandoAttribute(this, this.ClientID, "LastMaskPosition", LastMaskPosition.ToString(CultureInfo.InvariantCulture), true);
                            break;
                        }
                }
            }
        }
        protected override bool ControlPropertiesValid()
        {
            return (FindControl(ControlToValidate) is System.Web.UI.WebControls.TextBox);
        }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "Control author's attempt to simplify the catching of numerous isolated parsing exceptions")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity", Justification = "Cyclomatic complexity issues not currently being addressed")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1505:AvoidUnmaintainableCode", Justification = "Maintainability index issues not currently being addressed")]
        protected override bool EvaluateIsValid()
        {
            MaskedEditExtender MaskExt = (MaskedEditExtender)FindControl(ControlExtender);
            TextBox Target = (TextBox)MaskExt.FindControl(ControlToValidate);
            base.ErrorMessage = "";
            base.Text = "";
            string cssError = "";
            bool ok = true;
            if (!this.IsValidEmpty)
            {
                if (Target.Text.Trim() == this.InitialValue)
                {
                    base.ErrorMessage = this.EmptyValueMessage;
                    if (string.IsNullOrEmpty(this.EmptyValueBlurredText))
                    {
                        base.Text = base.ErrorMessage;
                    }
                    else
                    {
                        base.Text = this.EmptyValueBlurredText;
                    }
                    cssError = MaskExt.OnInvalidCssClass;
                    ok = false;
                }
            }
            if (ok && Target.Text.Length != 0 && this.ValidationExpression.Length != 0)
            {
                try
                {
                    System.Text.RegularExpressions.Regex Regex = new System.Text.RegularExpressions.Regex(this.ValidationExpression);
                    ok = Regex.IsMatch(Target.Text);
                }
                catch
                {
                    ok = false;
                }
            }
            if (ok && Target.Text.Length != 0)
            {
                string Culture = MaskExt.CultureName;
                if (string.IsNullOrEmpty(Culture))
                {
                    Culture = System.Globalization.CultureInfo.CurrentCulture.Name;
                }
                ControlCulture = System.Globalization.CultureInfo.GetCultureInfo(Culture);
                string CultureAMPMP = "";
                if (!string.IsNullOrEmpty(ControlCulture.DateTimeFormat.AMDesignator) && !string.IsNullOrEmpty(ControlCulture.DateTimeFormat.PMDesignator))
                {
                    CultureAMPMP = ControlCulture.DateTimeFormat.AMDesignator + ";" + ControlCulture.DateTimeFormat.PMDesignator;
                }
                switch (MaskExt.MaskType)
                {
                    case MaskedEditType.Number:
                        try
                        {
                            decimal numval = System.Decimal.Parse(Target.Text, ControlCulture);
                        }
                        catch
                        {
                            ok = false;
                        }
                        break;
                    case MaskedEditType.DateTime:
                    case MaskedEditType.Date:
                    case MaskedEditType.Time:
                        int tamtext = Target.Text.Length;
                        // gmorgan (25/06/2007) - Added check for AcceptAMPM in MaskedEditExtender to fix bug
                        // with validation in 24hr mode.
                        if (MaskExt.AcceptAMPM &&
                            !string.IsNullOrEmpty(CultureAMPMP) &&
                            (MaskExt.MaskType == MaskedEditType.Time || MaskExt.MaskType == MaskedEditType.DateTime))
                        {

                            char[] charSeparators = new char[] { ';' };
                            string[] ArrAMPM = CultureAMPMP.Split(charSeparators);
                            if (ArrAMPM[0].Length != 0)
                            {
                                tamtext -= (ArrAMPM[0].Length + 1);
                            }
                        }
                        int expectedLength = MaskedEditCommon.GetValidMask(MaskExt.Mask).Length;
                        if (MaskExt.MaskType != MaskedEditType.Time)
                        {
                            int currentCultureDateSeparatorLength =
                                (String.IsNullOrEmpty(MaskExt.CultureName) ? CultureInfo.CurrentCulture : CultureInfo.GetCultureInfo(MaskExt.CultureName)).DateTimeFormat.DateSeparator.Length;
                            // there are always 2 separators, and each separator adds to the expected length by the amount over size 1 that it is.
                            expectedLength += (currentCultureDateSeparatorLength - 1) * 2;
                        }
                        if (expectedLength != tamtext)
                        {
                            ok = false;
                        }
                        if (ok)
                        {
                            try
                            {
                                DateTime dtval = System.DateTime.Parse(Target.Text, ControlCulture);
                            }
                            catch
                            {
                                ok = false;
                            }
                        }
                        break;
                }
                if (!ok)
                {
                    base.ErrorMessage = this.InvalidValueMessage;
                    if (string.IsNullOrEmpty(this.InvalidValueBlurredMessage))
                    {
                        base.Text = base.ErrorMessage;
                    }
                    else
                    {
                        base.Text = this.InvalidValueBlurredMessage;
                    }
                    cssError = MaskExt.OnInvalidCssClass;
                }
                if (ok && (!string.IsNullOrEmpty(this.MaximumValue) || !string.IsNullOrEmpty(this.MinimumValue)))
                {
                    switch (MaskExt.MaskType)
                    {
                        case MaskedEditType.None:
                            {
                                System.Int32 lenvalue;
                                if (!string.IsNullOrEmpty(this.MaximumValue))
                                {
                                    try
                                    {
                                        lenvalue = System.Int32.Parse(this.MaximumValue, ControlCulture);
                                        ok = (lenvalue >= Target.Text.Length);
                                    }
                                    catch
                                    {
                                        base.ErrorMessage = this.InvalidValueMessage;
                                        if (string.IsNullOrEmpty(this.InvalidValueBlurredMessage))
                                        {
                                            base.Text = base.ErrorMessage;
                                        }
                                        else
                                        {
                                            base.Text = this.InvalidValueBlurredMessage;
                                        }
                                        ok = false;
                                    }
                                    if (!ok)
                                    {
                                        base.ErrorMessage = this.MaximumValueMessage;
                                        if (string.IsNullOrEmpty(this.MaximumValueBlurredMessage))
                                        {
                                            base.Text = base.ErrorMessage;
                                        }
                                        else
                                        {
                                            base.Text = this.MaximumValueBlurredMessage;
                                        }
                                        cssError = MaskExt.OnInvalidCssClass;
                                    }
                                }
                                if (ok && !string.IsNullOrEmpty(this.MinimumValue))
                                {
                                    try
                                    {
                                        lenvalue = System.Int32.Parse(this.MinimumValue, ControlCulture);
                                        ok = (lenvalue <= Target.Text.Length);
                                    }
                                    catch
                                    {
                                        base.ErrorMessage = this.InvalidValueMessage;
                                        if (string.IsNullOrEmpty(this.InvalidValueBlurredMessage))
                                        {
                                            base.Text = base.ErrorMessage;
                                        }
                                        else
                                        {
                                            base.Text = this.InvalidValueBlurredMessage;
                                        }
                                        ok = false;
                                    }
                                    if (!ok)
                                    {
                                        base.ErrorMessage = this.MinimumValueMessage;
                                        if (string.IsNullOrEmpty(this.MinimumValueBlurredText))
                                        {
                                            base.Text = base.ErrorMessage;
                                        }
                                        else
                                        {
                                            base.Text = this.MinimumValueBlurredText;
                                        }
                                        cssError = MaskExt.OnInvalidCssClass;
                                    }
                                }
                                break;
                            }
                        case MaskedEditType.Number:
                            {
                                decimal numval = System.Decimal.Parse(Target.Text, ControlCulture);
                                decimal Compval;
                                if (!string.IsNullOrEmpty(this.MaximumValue))
                                {
                                    try
                                    {
                                        Compval = System.Decimal.Parse(this.MaximumValue, ControlCulture);
                                        ok = (Compval >= numval);
                                    }
                                    catch
                                    {
                                        ok = false;
                                    }
                                    if (!ok)
                                    {
                                        base.ErrorMessage = this.MaximumValueMessage;
                                        if (string.IsNullOrEmpty(this.MaximumValueBlurredMessage))
                                        {
                                            base.Text = base.ErrorMessage;
                                        }
                                        else
                                        {
                                            base.Text = this.MaximumValueBlurredMessage;
                                        }
                                        cssError = MaskExt.OnInvalidCssClass;
                                    }
                                }
                                if (ok && !string.IsNullOrEmpty(this.MinimumValue))
                                {
                                    try
                                    {
                                        Compval = System.Decimal.Parse(this.MinimumValue, ControlCulture);
                                        ok = (Compval <= numval);
                                    }
                                    catch
                                    {
                                        ok = false;
                                    }
                                    if (!ok)
                                    {
                                        base.ErrorMessage = this.MinimumValueMessage;
                                        if (string.IsNullOrEmpty(this.MinimumValueBlurredText))
                                        {
                                            base.Text = base.ErrorMessage;
                                        }
                                        else
                                        {
                                            base.Text = this.MinimumValueBlurredText;
                                        }
                                        cssError = MaskExt.OnInvalidCssClass;
                                    }
                                }
                                break;
                            }
                        case MaskedEditType.DateTime:
                        case MaskedEditType.Date:
                        case MaskedEditType.Time:
                            {
                                DateTime dtval = System.DateTime.Parse(Target.Text, ControlCulture);
                                DateTime dtCompval;
                                if (!string.IsNullOrEmpty(this.MaximumValue))
                                {
                                    try
                                    {
                                        dtCompval = System.DateTime.Parse(this.MaximumValue, ControlCulture);
                                        ok = (dtCompval >= dtval);
                                    }
                                    catch
                                    {
                                        ok = false;
                                    }
                                    if (!ok)
                                    {
                                        base.ErrorMessage = this.MaximumValueMessage;
                                        if (string.IsNullOrEmpty(this.MaximumValueBlurredMessage))
                                        {
                                            base.Text = base.ErrorMessage;
                                        }
                                        else
                                        {
                                            base.Text = this.MaximumValueBlurredMessage;
                                        }
                                        cssError = MaskExt.OnInvalidCssClass;
                                    }
                                }
                                if (ok && !string.IsNullOrEmpty(this.MinimumValue))
                                {
                                    try
                                    {
                                        dtCompval = System.DateTime.Parse(this.MinimumValue, ControlCulture);
                                        ok = (dtCompval <= dtval);
                                    }
                                    catch
                                    {
                                        ok = false;
                                    }
                                    if (!ok)
                                    {
                                        base.ErrorMessage = this.MinimumValueMessage;
                                        if (string.IsNullOrEmpty(this.MinimumValueBlurredText))
                                        {
                                            base.Text = base.ErrorMessage;
                                        }
                                        else
                                        {
                                            base.Text = this.MinimumValueBlurredText;
                                        }
                                        cssError = MaskExt.OnInvalidCssClass;
                                    }
                                }
                                break;
                            }
                    }
                }
            }
            if (ok && MaskedEditServerValidator != null)
            {
                ServerValidateEventArgs serverValidateEventArgs = new ServerValidateEventArgs(Target.Text, ok);
                MaskedEditServerValidator(Target, serverValidateEventArgs);
                ok = serverValidateEventArgs.IsValid;
                if (!ok)
                {
                    cssError = MaskExt.OnInvalidCssClass;
                    base.ErrorMessage = this.InvalidValueMessage;
                    if (string.IsNullOrEmpty(this.InvalidValueBlurredMessage))
                    {
                        base.Text = base.ErrorMessage;
                    }
                    else
                    {
                        base.Text = this.InvalidValueBlurredMessage;
                    }
                }
            }
            if (!ok)
            {
                // set CSS at server for browser with not implement client validator script (FF, others)   
                //MaskedEditSetCssClass(value,CSS)
                string Script = "MaskedEditSetCssClass(" + this.ClientID + ",'" + cssError + "');";
                ScriptManager.RegisterStartupScript(this, typeof(MaskedEditValidator), "MaskedEditServerValidator_" + this.ID, Script, true);
            }
            return ok;
        }
    }
}
