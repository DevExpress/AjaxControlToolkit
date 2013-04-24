
// Product      : MaskedEdit Extender
// Version      : 1.0.0.0
// Date         : 11/08/2006
// Development  : Fernando Cerqueira 
// Version      : 1.0.0.1
// Development  : 02/22/2007 Fernando Cerqueira 

using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: System.Web.UI.WebResource("MaskedEdit.MaskedEditBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("MaskedEdit.MaskedEditBehavior.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("MaskedEdit.MaskedEditValidator.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("MaskedEdit.MaskedEditValidator.debug.js", "text/javascript")]
namespace AjaxControlToolkit
{

    [Designer("AjaxControlToolkit.MaskedEditDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.MaskedEditBehavior", "MaskedEdit.MaskedEditValidator.js")]
    [ClientScriptResource("Sys.Extended.UI.MaskedEditBehavior", "MaskedEdit.MaskedEditBehavior.js")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(TimerScript))]
    [TargetControlType(typeof(TextBox))]
    [System.Drawing.ToolboxBitmap(typeof(MaskedEditExtender), "MaskedEdit.MaskedEdit.ico")]
    public class MaskedEditExtender : ExtenderControlBase
    {

        /// <summary>
        /// Enable client state for communicating default focus
        /// </summary>
        public MaskedEditExtender()
        {
            EnableClientState = true;
        }
        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);
            switch (MaskType)
            {
                case MaskedEditType.Date:
                    {
                        AcceptAMPM = false;
                        AcceptNegative = MaskedEditShowSymbol.None;
                        DisplayMoney = MaskedEditShowSymbol.None;
                        InputDirection = MaskedEditInputDirection.LeftToRight;
                        break;
                    }
                case MaskedEditType.Time:
                    {
                        AcceptNegative = MaskedEditShowSymbol.None;
                        DisplayMoney = MaskedEditShowSymbol.None;
                        InputDirection = MaskedEditInputDirection.LeftToRight;
                        break;
                    }
                case MaskedEditType.DateTime:
                    {
                        AcceptNegative = MaskedEditShowSymbol.None;
                        DisplayMoney = MaskedEditShowSymbol.None;
                        InputDirection = MaskedEditInputDirection.LeftToRight;
                        break;
                    }
                case MaskedEditType.Number:
                    {
                        AcceptAMPM = false;
                        break;
                    }
                case MaskedEditType.None:
                    {
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
            if (String.IsNullOrEmpty(CultureName))
            {
                CultureName = "";
            }
        }
        // If this textbox has default focus, use ClientState to let it know
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            ((TextBox)this.FindControl(TargetControlID)).MaxLength = 0;
            ClientState = (string.Compare(Page.Form.DefaultFocus, TargetControlID, StringComparison.OrdinalIgnoreCase) == 0) ? "Focused" : null;
        }

        [RequiredProperty()]
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string Mask
        {
            get
            {
                return GetPropertyValue<string>("Mask", "");
            }
            set
            {
                if (!validateMaskType())
                {
                    throw new ArgumentException("Validate Type and/or Mask is invalid!");
                }
                SetPropertyValue<string>("Mask", value);
            }
        }
        [DefaultValue("Your browser security settings don't permit the automatic execution of paste operations. Please use the keyboard shortcut Ctrl+V instead.")]
        [ExtenderControlProperty]
        public string ClipboardText
        {
            get
            {
                return GetPropertyValue<string>("ClipboardText", "Your browser security settings don't permit the automatic execution of paste operations. Please use the keyboard shortcut Ctrl+V instead.");
            }
            set
            {
                SetPropertyValue<string>("ClipboardText", value);
            }
        }
        [DefaultValue(MaskedEditType.None)]
        [ExtenderControlProperty]
        [RefreshProperties(RefreshProperties.All)]
        public MaskedEditType MaskType
        {
            get
            {
                return GetPropertyValue<MaskedEditType>("MaskType", MaskedEditType.None);
            }
            set
            {
                SetPropertyValue<MaskedEditType>("MaskType", value);
                switch (value)
                {
                    case MaskedEditType.Date:
                        {
                            AcceptAMPM = false;
                            AcceptNegative = MaskedEditShowSymbol.None;
                            DisplayMoney = MaskedEditShowSymbol.None;
                            InputDirection = MaskedEditInputDirection.LeftToRight;
                            break;
                        }
                    case MaskedEditType.Time:
                        {
                            AcceptNegative = MaskedEditShowSymbol.None;
                            DisplayMoney = MaskedEditShowSymbol.None;
                            InputDirection = MaskedEditInputDirection.LeftToRight;
                            break;
                        }
                    case MaskedEditType.DateTime:
                        {
                            AcceptNegative = MaskedEditShowSymbol.None;
                            DisplayMoney = MaskedEditShowSymbol.None;
                            InputDirection = MaskedEditInputDirection.LeftToRight;
                            break;
                        }
                    case MaskedEditType.Number:
                        {
                            AcceptAMPM = false;
                            break;
                        }
                    case MaskedEditType.None:
                        {
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
        public bool MessageValidatorTip
        {
            get
            {
                return GetPropertyValue<bool>("MessageValidatorTip", true);
            }
            set
            {
                SetPropertyValue<bool>("MessageValidatorTip", value);
            }
        }
        [DefaultValue(false)]
        [ExtenderControlProperty]
        public bool ErrorTooltipEnabled
        {
            get
            {
                return GetPropertyValue<bool>("ErrorTooltipEnabled", false);
            }
            set
            {
                SetPropertyValue<bool>("ErrorTooltipEnabled", value);
            }
        }
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string ErrorTooltipCssClass
        {
            get
            {
                return GetPropertyValue<string>("ErrorTooltipCssClass", "");
            }
            set
            {
                SetPropertyValue<string>("ErrorTooltipCssClass", value);
            }
        }
        [DefaultValue(true)]
        [ExtenderControlProperty]
        public bool ClipboardEnabled
        {
            get
            {
                return GetPropertyValue<bool>("ClipboardEnabled", true);
            }
            set
            {
                SetPropertyValue<bool>("ClipboardEnabled", value);
            }
        }
        [DefaultValue(true)]
        [ExtenderControlProperty]
        public bool AutoComplete
        {
            get
            {
                return GetPropertyValue<bool>("AutoComplete", true);
            }
            set
            {
                SetPropertyValue<bool>("AutoComplete", value);
            }
        }
        [DefaultValue(false)]
        [ExtenderControlProperty]
        public bool ClearTextOnInvalid
        {
            get
            {
                return GetPropertyValue<bool>("ClearTextOnInvalid", false);
            }
            set
            {
                SetPropertyValue<bool>("ClearTextOnInvalid", value);
            }
        }
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string AutoCompleteValue
        {
            get
            {
                return GetPropertyValue<string>("AutoCompleteValue", "");
            }
            set
            {
                SetPropertyValue<string>("AutoCompleteValue", value);
            }
        }
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string Filtered
        {
            get
            {
                return GetPropertyValue<string>("Filtered", "");
            }
            set
            {
                SetPropertyValue<string>("Filtered", value);
            }
        }
        [DefaultValue(MaskedEditInputDirection.LeftToRight)]
        [ExtenderControlProperty]
        public MaskedEditInputDirection InputDirection
        {
            get
            {
                return GetPropertyValue<MaskedEditInputDirection>("InputDirection", MaskedEditInputDirection.LeftToRight);
            }
            set
            {
                SetPropertyValue<MaskedEditInputDirection>("InputDirection", value);
            }
        }
        [DefaultValue("_")]
        [ExtenderControlProperty]
        public string PromptCharacter
        {
            get
            {
                return GetPropertyValue<string>("PromptChar", "_");
            }
            set
            {
                SetPropertyValue<string>("PromptChar", value);
            }
        }
        [DefaultValue("MaskedEditFocus")]
        [ExtenderControlProperty]
        public string OnFocusCssClass
        {
            get
            {
                return GetPropertyValue<string>("OnFocusCssClass", "MaskedEditFocus");
            }
            set
            {
                SetPropertyValue<string>("OnFocusCssClass", value);
            }
        }

        [DefaultValue("MaskedEditError")]
        [ExtenderControlProperty]
        public string OnInvalidCssClass
        {
            get
            {
                return GetPropertyValue<string>("OnInvalidCssClass", "MaskedEditError");
            }
            set
            {
                SetPropertyValue<string>("OnInvalidCssClass", value);
            }
        }
        [DefaultValue(MaskedEditUserDateFormat.None)]
        [ExtenderControlProperty]
        public MaskedEditUserDateFormat UserDateFormat
        {
            get
            {
                return GetPropertyValue<MaskedEditUserDateFormat>("UserDateFormat", MaskedEditUserDateFormat.None);
            }
            set
            {
                SetPropertyValue<MaskedEditUserDateFormat>("UserDateFormat", value);
            }
        }
        [DefaultValue(MaskedEditUserTimeFormat.None)]
        [ExtenderControlProperty]
        public MaskedEditUserTimeFormat UserTimeFormat
        {
            get
            {
                return GetPropertyValue<MaskedEditUserTimeFormat>("UserTimeFormat", MaskedEditUserTimeFormat.None);
            }
            set
            {
                SetPropertyValue<MaskedEditUserTimeFormat>("UserTimeFormat", value);
            }
        }

        [DefaultValue(true)]
        [ExtenderControlProperty]
        public bool ClearMaskOnLostFocus
        {
            get
            {
                return GetPropertyValue<bool>("ClearMaskOnLostfocus", true);
            }
            set
            {
                SetPropertyValue<bool>("ClearMaskOnLostfocus", value);
            }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [RefreshProperties(RefreshProperties.All)]
        public string CultureName
        {
            get
            {
                return GetPropertyValue<string>("CultureName", "");
            }
            set
            {
                System.Globalization.CultureInfo ControlCulture = null;
                if (String.IsNullOrEmpty(value))
                {
                    ControlCulture = System.Globalization.CultureInfo.CurrentCulture;
                    OverridePageCulture = false;
                }
                else
                {
                    ControlCulture = System.Globalization.CultureInfo.GetCultureInfo(value);
                    //If the Culturename is ACTUALLY set in the control, use it
                    OverridePageCulture = true;
                }
                SetPropertyValue<string>("CultureName", ControlCulture.Name);
                CultureDatePlaceholder = ControlCulture.DateTimeFormat.DateSeparator;
                CultureTimePlaceholder = ControlCulture.DateTimeFormat.TimeSeparator;
                CultureDecimalPlaceholder = ControlCulture.NumberFormat.NumberDecimalSeparator;
                CultureThousandsPlaceholder = ControlCulture.NumberFormat.NumberGroupSeparator;
                string[] arrDate = ControlCulture.DateTimeFormat.ShortDatePattern.Split(new string[] { ControlCulture.DateTimeFormat.DateSeparator }, StringSplitOptions.None);
                string ret = arrDate[0].Substring(0, 1).ToUpper(ControlCulture);
                ret += arrDate[1].Substring(0, 1).ToUpper(ControlCulture);
                ret += arrDate[2].Substring(0, 1).ToUpper(ControlCulture);
                CultureDateFormat = ret;
                CultureCurrencySymbolPlaceholder = ControlCulture.NumberFormat.CurrencySymbol;
                if (String.IsNullOrEmpty(ControlCulture.DateTimeFormat.AMDesignator + ControlCulture.DateTimeFormat.PMDesignator))
                {
                    CultureAMPMPlaceholder = "";
                }
                else
                {
                    CultureAMPMPlaceholder = ControlCulture.DateTimeFormat.AMDesignator + ";" + ControlCulture.DateTimeFormat.PMDesignator;
                }
            }
        }

        internal bool OverridePageCulture
        {
            get
            {
                return GetPropertyValue<bool>("OverridePageCulture", false);
            }
            set
            {
                SetPropertyValue<bool>("OverridePageCulture", value);
            }
        }

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        public string CultureDatePlaceholder
        {
            get
            {
                return GetPropertyValue<string>("CultureDatePlaceholder", "");
            }
            set
            {
                SetPropertyValue<string>("CultureDatePlaceholder", value);
            }
        }
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        public string CultureTimePlaceholder
        {
            get
            {
                return GetPropertyValue<string>("CultureTimePlaceholder", "");
            }
            set
            {
                SetPropertyValue<string>("CultureTimePlaceholder", value);
            }

        }
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        public string CultureDecimalPlaceholder
        {
            get
            {
                return GetPropertyValue<string>("CultureDecimalPlaceholder", "");
            }
            set
            {
                SetPropertyValue<string>("CultureDecimalPlaceholder", value);
            }
        }
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        public string CultureThousandsPlaceholder
        {
            get
            {
                return GetPropertyValue<string>("CultureThousandsPlaceholder", "");
            }
            set
            {
                SetPropertyValue<string>("CultureThousandsPlaceholder", value);
            }
        }
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        public string CultureDateFormat
        {
            get
            {
                return GetPropertyValue<string>("CultureDateFormat", "");
            }
            set
            {
                SetPropertyValue<string>("CultureDateFormat", value);
            }
        }
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        public string CultureCurrencySymbolPlaceholder
        {
            get
            {
                return GetPropertyValue<string>("CultureCurrencySymbolPlaceholder", "");
            }
            set
            {
                SetPropertyValue<string>("CultureCurrencySymbolPlaceholder", value);
            }
        }
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1705:LongAcronymsShouldBePascalCased", MessageId = "Member", Justification = "Alternative of AmPm violates another rule")]
        public string CultureAMPMPlaceholder
        {
            get
            {
                return GetPropertyValue<string>("CultureAMPMPlaceholder", "");
            }
            set
            {
                SetPropertyValue<string>("CultureAMPMPlaceholder", value);
            }
        }

        [DefaultValue(false)]
        [ExtenderControlProperty]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1705:LongAcronymsShouldBePascalCased", MessageId = "Member", Justification = "Alternative of AmPm violates another rule")]
        public bool AcceptAMPM
        {
            get
            {
                return GetPropertyValue<bool>("AcceptAmPm", false);
            }
            set
            {
                SetPropertyValue<bool>("AcceptAmPm", value);
            }
        }
        [DefaultValue(MaskedEditShowSymbol.None)]
        [ExtenderControlProperty]
        public MaskedEditShowSymbol AcceptNegative
        {
            get
            {
                return GetPropertyValue<MaskedEditShowSymbol>("AcceptNegative", MaskedEditShowSymbol.None);
            }
            set
            {
                SetPropertyValue<MaskedEditShowSymbol>("AcceptNegative", value);
            }
        }
        [DefaultValue("MaskedEditFocusNegative")]
        [ExtenderControlProperty]
        public string OnFocusCssNegative
        {
            get
            {
                return GetPropertyValue<string>("OnFocusCssNegative", "MaskedEditFocusNegative");
            }
            set
            {
                SetPropertyValue<string>("OnFocusCssNegative", value);
            }
        }
        [DefaultValue("MaskedEditBlurNegative")]
        [ExtenderControlProperty]
        public string OnBlurCssNegative
        {
            get
            {
                return GetPropertyValue<string>("OnBlurCssNegative", "MaskedEditBlurNegative");
            }
            set
            {
                SetPropertyValue<string>("OnBlurCssNegative", value);
            }
        }
        [DefaultValue(MaskedEditShowSymbol.None)]
        [ExtenderControlProperty]
        public MaskedEditShowSymbol DisplayMoney
        {
            get
            {
                return GetPropertyValue<MaskedEditShowSymbol>("DisplayMoney", MaskedEditShowSymbol.None);
            }
            set
            {
                SetPropertyValue<MaskedEditShowSymbol>("DisplayMoney", value);
            }
        }
        [DefaultValue(1900)]
        [ExtenderControlProperty]
        public int Century
        {
            get
            {
                int century = int.Parse(DateTime.Now.Year.ToString().Substring(0, 2)) * 100;
                return GetPropertyValue<int>("Century", century);
            }
            set
            {
                if (value.ToString(CultureInfo.InvariantCulture).Length != 4)
                {
                    throw new ArgumentException("The Century must have 4 digits.");
                }
                else
                {
                    SetPropertyValue<int>("Century", value);
                }
            }
        }

        private bool validateMaskType()
        {
            string mask = Mask;
            MaskedEditType maskType = MaskType;
            if (!string.IsNullOrEmpty(mask) && (maskType == MaskedEditType.Date || maskType == MaskedEditType.Time))
            {
                string validMask = MaskedEditCommon.GetValidMask(mask);
                switch (maskType)
                {
                    case MaskedEditType.Date:
                        return Array.IndexOf(new string[] { "99/99/9999", "99/9999/99", "9999/99/99", "99/99/99" }, validMask) >= 0;
                    case MaskedEditType.Time:
                        return Array.IndexOf(new string[] { "99:99:99", "99:99" }, validMask) >= 0;
                    case MaskedEditType.DateTime:
                        return Array.IndexOf(new string[] { "99/99/9999 99:99:99", "99/99/9999 99:99", "99/9999/99 99:99:99", "99/9999/99 99:99", "9999/99/99 99:99:99", "9999/99/99 99:99", "99/99/99 99:99:99", "99/99/99 99:99" }, validMask) >= 0;
                    case MaskedEditType.Number:
                        foreach (char ch in validMask)
                        {
                            if (ch != '9' && ch != '.' && ch != ',')
                            {
                                return false;
                            }
                        }
                        break;
                }
            }
            return true;
        }
    }
}