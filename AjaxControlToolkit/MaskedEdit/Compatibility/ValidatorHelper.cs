using System;
using System.Collections;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;
using WhidbeyBaseValidator = System.Web.UI.WebControls.BaseValidator;

namespace AjaxControlToolkit.MaskedEditValidatorCompatibility {

    internal static class ValidatorHelper {
        const string ValidatorFileName = "WebUIValidation.js";
        const string ValidatorIncludeScriptKey = "ValidatorIncludeScript";
        const string ValidatorStartupScript = @"
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

        public static void DoBaseValidatorAddAttributes(WhidbeyBaseValidator validator, IBaseValidatorAccessor validatorAccessor, HtmlTextWriter writer) {
            var disabled = !validator.Enabled;
            if(disabled)
                validator.Enabled = true;

            try {
                if(validatorAccessor.RenderUpLevel) {
                    validatorAccessor.EnsureID();
                    var id = validator.ClientID;

                    if(validator.ControlToValidate.Length > 0)
                        AddExpandoAttribute(validator, id, "controltovalidate", validatorAccessor.GetControlRenderID(validator.ControlToValidate));

                    if(validator.SetFocusOnError)
                        AddExpandoAttribute(validator, id, "focusOnError", "t", false);

                    if(validator.ErrorMessage.Length > 0)
                        AddExpandoAttribute(validator, id, "errormessage", validator.ErrorMessage);

                    var display = validator.Display;
                    if(display != ValidatorDisplay.Static)
                        AddExpandoAttribute(validator, id, "display", PropertyConverter.EnumToString(typeof(ValidatorDisplay), display), false);

                    if(!validator.IsValid)
                        AddExpandoAttribute(validator, id, "isvalid", "False", false);

                    if(disabled)
                        AddExpandoAttribute(validator, id, "enabled", "False", false);

                    if(validator.ValidationGroup.Length > 0)
                        AddExpandoAttribute(validator, id, "validationGroup", validator.ValidationGroup);

                }

                DoWebControlAddAttributes(validator, validatorAccessor, writer);
            }
            finally {
                if(disabled)
                    validator.Enabled = false;
            }
        }

        public static void DoWebControlAddAttributes(WebControl webControl, IWebControlAccessor webControlAccessor, HtmlTextWriter writer) {
            if(webControl.ID != null)
                writer.AddAttribute(HtmlTextWriterAttribute.Id, webControl.ClientID);

            var s = webControl.AccessKey;
            if(!String.IsNullOrEmpty(s))
                writer.AddAttribute(HtmlTextWriterAttribute.Accesskey, s);

            if(!webControl.Enabled)
                writer.AddAttribute(HtmlTextWriterAttribute.Disabled, "disabled");

            var n = webControl.TabIndex;
            if(n != 0)
                writer.AddAttribute(HtmlTextWriterAttribute.Tabindex, n.ToString(NumberFormatInfo.InvariantInfo));

            s = webControl.ToolTip;
            if(!String.IsNullOrEmpty(s))
                writer.AddAttribute(HtmlTextWriterAttribute.Title, s);

            if(webControlAccessor.TagKey == HtmlTextWriterTag.Span || webControlAccessor.TagKey == HtmlTextWriterTag.A) {
                if((webControl.BorderStyle != BorderStyle.NotSet || !webControl.BorderWidth.IsEmpty || !webControl.Height.IsEmpty || !webControl.Width.IsEmpty))
                    writer.AddStyleAttribute(HtmlTextWriterStyle.Display, "inline-block");
            }

            if(webControl.ControlStyleCreated && !webControl.ControlStyle.IsEmpty)
                webControl.ControlStyle.AddAttributesToRender(writer, webControl);

            var atrColl = webControl.Attributes;
            var keys = atrColl.Keys.GetEnumerator();
            while(keys.MoveNext()) {
                var attrName = (string)(keys.Current);
                writer.AddAttribute(attrName, atrColl[attrName]);
            }
        }

        public static void DoInitRegistration(Page page) {
            page.ClientScript.RegisterClientScriptBlock(typeof(WhidbeyBaseValidator), ValidatorIncludeScriptKey, String.Empty);
        }

        public static void DoValidatorArrayDeclaration(WhidbeyBaseValidator validator, Type validatorType) {
            var element = "document.getElementById(\"" + validator.ClientID + "\")";
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
            if(validatorAccessor.RenderUpLevel) {
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
    }

}
