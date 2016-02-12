#pragma warning disable 1591
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;
using System;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit {


    /// <summary>
    /// TextBoxWatermark is an ASP.NET AJAX extender that can be attached to an ASP.NET TextBox control
    /// to get watermark behavior. When a watermarked TextBox is empty, it displays a message to a user
    /// with a custom CSS style. Once the user has typed text into the TextBox, the watermarked appearance
    /// disappears. The watermark is intended to provide more information to a user about the TextBox without
    /// cluttering up the rest of the page.
    /// </summary>
    [Designer(typeof(TextBoxWatermarkExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.TextBoxWatermarkBehavior", Constants.TextBoxWatermarkName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(TextBox))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.TextBoxWatermarkName + Constants.IconPostfix)]
    public class TextBoxWatermarkExtender : ExtenderControlBase {

        const string stringWatermarkText = "WatermarkText";
        const string stringWatermarkCssClass = "WatermarkCssClass";

        public TextBoxWatermarkExtender() {
            EnableClientState = true;
        }

        // OnLoad override to register a submit script for each TextBoxWatermark behavior as well as check
        // to see if it's focused by default 
        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);

            // Register an empty OnSubmit statement so the ASP.NET WebForm_OnSubmit method will be automatically
            // created and our behavior will be able to wrap it for watermark removal prior to submission
            ScriptManager.RegisterOnSubmitStatement(this, typeof(TextBoxWatermarkExtender), "TextBoxWatermarkExtenderOnSubmit", "null;");

            // If this textbox has default focus, use ClientState to let it know
            ClientState = (string.Compare(Page.Form.DefaultFocus, TargetControlID, StringComparison.OrdinalIgnoreCase) == 0) ? "Focused" : null;
        }

        /// <summary>
        /// Text to show when the control has no value
        /// </summary>
        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue("")]
        [ClientPropertyName("watermarkText")]
        public string WatermarkText {
            get { return GetPropertyValue(stringWatermarkText, String.Empty); }
            set { SetPropertyValue(stringWatermarkText, value); }
        }

        /// <summary>
        /// A CSS class to apply to the TextBox when it has no value (e.g. watermark text is shown)
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("watermarkCssClass")]
        public string WatermarkCssClass {
            get { return GetPropertyValue(stringWatermarkCssClass, String.Empty); }
            set { SetPropertyValue(stringWatermarkCssClass, value); }
        }
    }

}

#pragma warning restore 1591