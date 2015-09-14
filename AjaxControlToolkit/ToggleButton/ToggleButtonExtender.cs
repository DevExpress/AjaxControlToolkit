using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;

namespace AjaxControlToolkit {

    /// <summary>
    /// ToggleButton is an ASP.NET AJAX extender that can be attached to an ASP.NET CheckBox control.
    /// ToggleButton enables the use of custom images to show the state of the CheckBox.
    /// The behavior of the CheckBox is unaffected.
    /// </summary>
    [Designer(typeof(ToggleButtonExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.ToggleButtonBehavior", Constants.ToggleButtonName)]
    [TargetControlType(typeof(ICheckBoxControl))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.ToggleButtonName + Constants.IconPostfix)]
    public class ToggleButtonExtender : ExtenderControlBase {
        const string stringImageWidth = "ImageWidth";
        const string stringImageHeight = "ImageHeight";
        const string stringUncheckedImageUrl = "UncheckedImageUrl";
        const string stringCheckedImageUrl = "CheckedImageUrl";
        const string stringDisabledUncheckedImageUrl = "DisabledUncheckedImageUrl";
        const string stringDisabledCheckedImageUrl = "DisabledCheckedImageUrl";
        const string stringCheckedImageOverUrl = "CheckedImageOverUrl";
        const string stringUncheckedImageOverUrl = "UncheckedImageOverUrl";
        const string stringUncheckedImageAlternateText = "UncheckedImageAlternateText";
        const string stringCheckedImageAlternateText = "CheckedImageAlternateText";
        const string stringCheckedImageOverAlternateText = "CheckedImageOverAlternateText";
        const string stringUncheckedImageOverAlternateText = "UncheckedImageOverAlternateText";

        /// <summary>
        /// The width of an image
        /// </summary>
        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue(0)]
        [ClientPropertyName("imageWidth")]
        public int ImageWidth {
            get { return GetPropertyValue(stringImageWidth, 0); }
            set { SetPropertyValue(stringImageWidth, value); }
        }

        /// <summary>
        /// The height of an image
        /// </summary>
        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue(0)]
        [ClientPropertyName("imageHeight")]
        public int ImageHeight {
            get { return GetPropertyValue(stringImageHeight, 0); }
            set { SetPropertyValue(stringImageHeight, value); }
        }

        /// <summary>
        /// The URL of an image to show when the toggle button is in the unchecked state
        /// </summary>
        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue("")]
        [UrlProperty()]
        [ClientPropertyName("uncheckedImageUrl")]
        public string UncheckedImageUrl {
            get { return GetPropertyValue(stringUncheckedImageUrl, String.Empty); }
            set { SetPropertyValue(stringUncheckedImageUrl, value); }
        }

        /// <summary>
        /// The URL of an image to show when the toggle button is in the checked state
        /// </summary>
        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue("")]
        [UrlProperty()]
        [ClientPropertyName("checkedImageUrl")]
        public string CheckedImageUrl {
            get { return GetPropertyValue(stringCheckedImageUrl, String.Empty); }
            set { SetPropertyValue(stringCheckedImageUrl, value); }
        }

        /// <summary>
        /// The URL of an image to show when the toggle button is disabled and in the unchecked state
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [UrlProperty]
        [ClientPropertyName("disabledUncheckedImageUrl")]
        public string DisabledUncheckedImageUrl {
            get { return GetPropertyValue(stringDisabledUncheckedImageUrl, String.Empty); }
            set { SetPropertyValue(stringDisabledUncheckedImageUrl, value); }
        }

        /// <summary>
        /// The URL of an image to show when the toggle button is disabled and in the checked state
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [UrlProperty]
        [ClientPropertyName("disabledCheckedImageUrl")]
        public string DisabledCheckedImageUrl {
            get { return GetPropertyValue(stringDisabledCheckedImageUrl, String.Empty); }
            set { SetPropertyValue(stringDisabledCheckedImageUrl, value); }
        }

        /// <summary>
        /// The URL of an image to show when the toggle button is in the checked
        /// state and the mouse is over the button
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [UrlProperty]
        [ClientPropertyName("checkedImageOverUrl")]
        public string CheckedImageOverUrl {
            get { return GetPropertyValue(stringCheckedImageOverUrl, String.Empty); }
            set { SetPropertyValue(stringCheckedImageOverUrl, value); }
        }

        /// <summary>
        /// The URL of an image to show when the toggle button is in the unchecked state and
        /// the mouse is over the button
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [UrlProperty]
        [ClientPropertyName("uncheckedImageOverUrl")]
        public string UncheckedImageOverUrl {
            get { return GetPropertyValue(stringUncheckedImageOverUrl, String.Empty); }
            set { SetPropertyValue(stringUncheckedImageOverUrl, value); }
        }

        /// <summary>
        /// The alt text to show when the toggle button is in the unchecked state
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("uncheckedImageAlternateText")]
        public string UncheckedImageAlternateText {
            get { return GetPropertyValue(stringUncheckedImageAlternateText, String.Empty); }
            set { SetPropertyValue(stringUncheckedImageAlternateText, value); }
        }

        /// <summary>
        /// The alt text to show when the toggle button is in the checked state
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("checkedImageAlternateText")]
        public string CheckedImageAlternateText {
            get { return GetPropertyValue(stringCheckedImageAlternateText, String.Empty); }
            set { SetPropertyValue(stringCheckedImageAlternateText, value); }
        }

        /// <summary>
        /// The alt text to show when the toggle button is in the checked state and the mouse is over the button
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("checkedImageOverAlternateText")]
        public string CheckedImageOverAlternateText {
            get { return GetPropertyValue(stringCheckedImageOverAlternateText, String.Empty); }
            set { SetPropertyValue(stringCheckedImageOverAlternateText, value); }
        }

        /// <summary>
        /// The alt text to show when the toggle button is in the unchecked state and the mouse is over the button
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("uncheckedImageOverAlternateText")]
        public string UncheckedImageOverAlternateText {
            get { return GetPropertyValue(stringUncheckedImageOverAlternateText, String.Empty); }
            set { SetPropertyValue(stringUncheckedImageOverAlternateText, value); }
        }
    }

}