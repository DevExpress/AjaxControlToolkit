

using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: System.Web.UI.WebResource("TextboxWatermark.TextboxWatermark.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("TextboxWatermark.TextboxWatermark.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// TextBoxWatermark extender class definition
    /// </summary>
    [Designer("AjaxControlToolkit.TextBoxWatermarkExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.TextBoxWatermarkBehavior", "TextboxWatermark.TextboxWatermark.js")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(TextBox))]
    [System.Drawing.ToolboxBitmap(typeof(TextBoxWatermarkExtender), "TextboxWatermark.TextboxWatermark.ico")]
    public class TextBoxWatermarkExtender : ExtenderControlBase
    {
        public TextBoxWatermarkExtender()
        {
            EnableClientState = true;
        }

        /// <summary>
        /// OnLoad override to register a submit script for each TextBoxWatermark behavior as well as check
        /// to see if it's focused by default
        /// </summary>
        /// <param name="e">arguments</param>
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            // Register an empty OnSubmit statement so the ASP.NET WebForm_OnSubmit method will be automatically
            // created and our behavior will be able to wrap it for watermark removal prior to submission
            ScriptManager.RegisterOnSubmitStatement(this, typeof(TextBoxWatermarkExtender), "TextBoxWatermarkExtenderOnSubmit", "null;");

            // If this textbox has default focus, use ClientState to let it know
            ClientState = (string.Compare(Page.Form.DefaultFocus, TargetControlID, StringComparison.OrdinalIgnoreCase) == 0) ? "Focused" : null;
        }

        // Constant strings for each property name
        private const string stringWatermarkText = "WatermarkText";
        private const string stringWatermarkCssClass = "WatermarkCssClass";

        /// <summary>
        /// Text to place in the control when watermarked
        /// </summary>
        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue("")]
        public string WatermarkText
        {
            get
            {
                return GetPropertyValue(stringWatermarkText, "");
            }
            set
            {
                SetPropertyValue(stringWatermarkText, value);
            }
        }

        /// <summary>
        /// CSS class to apply to the control when watermarked
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string WatermarkCssClass
        {
            get
            {
                return GetPropertyValue(stringWatermarkCssClass, "");
            }
            set
            {
                SetPropertyValue(stringWatermarkCssClass, value);
            }
        }
    }
}
