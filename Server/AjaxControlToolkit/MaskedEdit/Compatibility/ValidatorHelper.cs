namespace AjaxControlToolkit.MaskedEditValidatorCompatibility
{
    using System;
    using System.Collections;
    using System.Diagnostics;
    using System.Globalization;
    using System.Web.UI;
    using System.Web.UI.WebControls;
    using WhidbeyBaseCompareValidator = System.Web.UI.WebControls.BaseCompareValidator;
    using WhidbeyBaseValidator = System.Web.UI.WebControls.BaseValidator;

    internal static class ValidatorHelper {
        private const string ValidatorFileName = "WebUIValidation.js";
        private const string ValidatorIncludeScriptKey = "ValidatorIncludeScript";
        private const string ValidatorStartupScript = @"
var Page_ValidationActive = false;
if (typeof(ValidatorOnLoad) == ""function"") {
    ValidatorOnLoad();
}

function ValidatorOnSubmit() {
    if (Page_ValidationActive) {
        return ValidatorCommonOnSubmit();
    }
    else {
        return true;
    }
}
";

        //public static void DoBaseCompareValidatorAddAttributes(WhidbeyBaseCompareValidator validator, IBaseCompareValidatorAccessor validatorAccessor) {
        //    if (validatorAccessor.RenderUpLevel) {
        //        ValidationDataType type = validator.Type;
        //        if (type != ValidationDataType.String) {
        //            string id = validator.ClientID;

        //            ValidatorHelper.AddExpandoAttribute(validator, id, "type", PropertyConverter.EnumToString(typeof(ValidationDataType), type), false);

        //            NumberFormatInfo info = NumberFormatInfo.CurrentInfo;
        //            if (type == ValidationDataType.Double) {
        //                string decimalChar = info.NumberDecimalSeparator;
        //                ValidatorHelper.AddExpandoAttribute(validator, id, "decimalchar", decimalChar);
        //            }
        //            else if (type == ValidationDataType.Currency) {
        //                string decimalChar = info.CurrencyDecimalSeparator;
        //                ValidatorHelper.AddExpandoAttribute(validator, id, "decimalchar", decimalChar);

        //                string groupChar = info.CurrencyGroupSeparator;
        //                if (groupChar[0] == 160)
        //                    groupChar = " ";
        //                ValidatorHelper.AddExpandoAttribute(validator, id, "groupchar", groupChar);

        //                int digits = info.CurrencyDecimalDigits;
        //                ValidatorHelper.AddExpandoAttribute(validator, id, "digits", digits.ToString(NumberFormatInfo.InvariantInfo), false);

        //                int groupSize = GetCurrencyGroupSize(info);
        //                if (groupSize > 0) {
        //                    ValidatorHelper.AddExpandoAttribute(validator, id, "groupsize", groupSize.ToString(NumberFormatInfo.InvariantInfo), false);
        //                }
        //            }
        //            else if (type == ValidationDataType.Date) {
        //                ValidatorHelper.AddExpandoAttribute(validator, id, "dateorder", validatorAccessor.GetDateElementOrder(), false);
        //                ValidatorHelper.AddExpandoAttribute(validator, id, "cutoffyear", validatorAccessor.CutoffYear.ToString(NumberFormatInfo.InvariantInfo), false);

        //                int currentYear = DateTime.Today.Year;
        //                int century = currentYear - (currentYear % 100);
        //                ValidatorHelper.AddExpandoAttribute(validator, id, "century", century.ToString(NumberFormatInfo.InvariantInfo), false);
        //            }
        //        }
        //    }
        //}

        public static void DoBaseValidatorAddAttributes(WhidbeyBaseValidator validator, IBaseValidatorAccessor validatorAccessor, HtmlTextWriter writer) {
            bool disabled = !validator.Enabled;
            if (disabled) {
                validator.Enabled = true;
            }

            try {
                if (validatorAccessor.RenderUpLevel) {
                    validatorAccessor.EnsureID();
                    string id = validator.ClientID;

                    if (validator.ControlToValidate.Length > 0) {
                        AddExpandoAttribute(validator, id, "controltovalidate", validatorAccessor.GetControlRenderID(validator.ControlToValidate));
                    }
                    if (validator.SetFocusOnError) {
                        AddExpandoAttribute(validator, id, "focusOnError", "t", false);
                    }
                    if (validator.ErrorMessage.Length > 0) {
                        AddExpandoAttribute(validator, id, "errormessage", validator.ErrorMessage);
                    }
                    ValidatorDisplay display = validator.Display;
                    if (display != ValidatorDisplay.Static) {
                        AddExpandoAttribute(validator, id, "display", PropertyConverter.EnumToString(typeof(ValidatorDisplay), display), false);
                    }
                    if (!validator.IsValid) {
                        AddExpandoAttribute(validator, id, "isvalid", "False", false);
                    }
                    if (disabled) {
                        AddExpandoAttribute(validator, id, "enabled", "False", false);
                    }
                    if (validator.ValidationGroup.Length > 0) {
                        AddExpandoAttribute(validator, id, "validationGroup", validator.ValidationGroup);
                    }
                }

                DoWebControlAddAttributes(validator, validatorAccessor, writer);
            }
            finally {
                if (disabled) {
                    validator.Enabled = false;
                }
            }

        }

        public static void DoWebControlAddAttributes(WebControl webControl, IWebControlAccessor webControlAccessor, HtmlTextWriter writer) {
            if (webControl.ID != null) {
                writer.AddAttribute(HtmlTextWriterAttribute.Id, webControl.ClientID);
            }

            string s = webControl.AccessKey;
            if (!String.IsNullOrEmpty(s)) {
                writer.AddAttribute(HtmlTextWriterAttribute.Accesskey, s);
            }
            if (!webControl.Enabled) {
                writer.AddAttribute(HtmlTextWriterAttribute.Disabled, "disabled");
            }

            int n = webControl.TabIndex;
            if (n != 0) {
                writer.AddAttribute(HtmlTextWriterAttribute.Tabindex, n.ToString(NumberFormatInfo.InvariantInfo));
            }
            s = webControl.ToolTip;
            if (!String.IsNullOrEmpty(s)) {
                writer.AddAttribute(HtmlTextWriterAttribute.Title, s);
            }

            if (webControlAccessor.TagKey == HtmlTextWriterTag.Span || webControlAccessor.TagKey == HtmlTextWriterTag.A) {
                if ((webControl.BorderStyle != BorderStyle.NotSet || !webControl.BorderWidth.IsEmpty || !webControl.Height.IsEmpty || !webControl.Width.IsEmpty)) {
                    writer.AddStyleAttribute(HtmlTextWriterStyle.Display, "inline-block");
                }
            }

            if (webControl.ControlStyleCreated && !webControl.ControlStyle.IsEmpty) {
                webControl.ControlStyle.AddAttributesToRender(writer, webControl);
            }

            AttributeCollection atrColl = webControl.Attributes;
            IEnumerator keys = atrColl.Keys.GetEnumerator();
            while (keys.MoveNext()) {
                string attrName = (string)(keys.Current);
                writer.AddAttribute(attrName, atrColl[attrName]);
            }
        }

        public static void DoInitRegistration(Page page) {
            page.ClientScript.RegisterClientScriptBlock(typeof(WhidbeyBaseValidator), ValidatorIncludeScriptKey, String.Empty);
        }

        public static void DoValidatorArrayDeclaration(WhidbeyBaseValidator validator, Type validatorType) {
            string element = "document.getElementById(\"" + validator.ClientID + "\")";
            ScriptManager.RegisterArrayDeclaration(validator, "Page_Validators", element);

            ScriptManager.RegisterStartupScript(validator, validatorType, validator.ClientID + "_DisposeScript",
                String.Format(
                    CultureInfo.InvariantCulture,
                    @"
document.getElementById('{0}').dispose = function() {{
    Array.remove(Page_Validators, document.getElementById('{0}'));
}}
",
                    validator.ClientID), true);
        }

        public static void DoPreRenderRegistration(WhidbeyBaseValidator validator, IBaseValidatorAccessor validatorAccessor) {
            if (validatorAccessor.RenderUpLevel) {
                ScriptManager.RegisterClientScriptResource(validator, typeof(WhidbeyBaseValidator), ValidatorFileName);
                ScriptManager.RegisterStartupScript(validator, typeof(WhidbeyBaseValidator), ValidatorIncludeScriptKey, ValidatorStartupScript, true);
                ScriptManager.RegisterOnSubmitStatement(validator,
                    typeof(WhidbeyBaseValidator),
                    "ValidatorOnSubmit",
                    "if (typeof(ValidatorOnSubmit) == \"function\" && ValidatorOnSubmit() == false) return false;");
            }
        }

        public static void AddExpandoAttribute(WebControl webControl, string controlId, string attributeName, string attributeValue) {
            AddExpandoAttribute(webControl, controlId, attributeName, attributeValue, true);
        }

        public static void AddExpandoAttribute(WebControl webControl, string controlId, string attributeName, string attributeValue, bool encode) {
            ScriptManager.RegisterExpandoAttribute(webControl, controlId, attributeName, attributeValue, encode);
        }

        //private static int GetCurrencyGroupSize(NumberFormatInfo info) {
        //    int[] groupSizes = info.CurrencyGroupSizes;
        //    if (groupSizes != null && groupSizes.Length == 1) {
        //        return groupSizes[0];
        //    }
        //    else {
        //        return -1;
        //    }
        //}
    }
}
