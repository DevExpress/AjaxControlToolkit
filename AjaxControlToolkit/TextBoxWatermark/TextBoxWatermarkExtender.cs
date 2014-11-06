using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;
using System;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.TextBoxWatermarkExtenderDesigner, AjaxControlToolkit")]
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

        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue("")]
        public string WatermarkText {
            get { return GetPropertyValue(stringWatermarkText, String.Empty); }
            set { SetPropertyValue(stringWatermarkText, value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string WatermarkCssClass {
            get { return GetPropertyValue(stringWatermarkCssClass, String.Empty); }
            set { SetPropertyValue(stringWatermarkCssClass, value); }
        }
    }

}
