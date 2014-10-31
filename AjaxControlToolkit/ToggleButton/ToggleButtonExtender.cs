using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.ToggleButtonExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.ToggleButtonBehavior", Constants.ToggleButtonName)]
    [TargetControlType(typeof(ICheckBoxControl))]
    [ToolboxBitmap(typeof(ToggleButtonExtender), Constants.ToggleButtonName + Constants.IconPostfix)]
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

        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue(0)]
        public int ImageWidth {
            get { return GetPropertyValue(stringImageWidth, 0); }
            set { SetPropertyValue(stringImageWidth, value); }
        }

        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue(0)]
        public int ImageHeight {
            get { return GetPropertyValue(stringImageHeight, 0); }
            set { SetPropertyValue(stringImageHeight, value); }
        }

        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue("")]
        [UrlProperty()]
        public string UncheckedImageUrl {
            get { return GetPropertyValue(stringUncheckedImageUrl, String.Empty); }
            set { SetPropertyValue(stringUncheckedImageUrl, value); }
        }

        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue("")]
        [UrlProperty()]
        public string CheckedImageUrl {
            get { return GetPropertyValue(stringCheckedImageUrl, String.Empty); }
            set { SetPropertyValue(stringCheckedImageUrl, value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        [UrlProperty]
        public string DisabledUncheckedImageUrl {
            get { return GetPropertyValue(stringDisabledUncheckedImageUrl, String.Empty); }
            set { SetPropertyValue(stringDisabledUncheckedImageUrl, value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        [UrlProperty]
        public string DisabledCheckedImageUrl {
            get { return GetPropertyValue(stringDisabledCheckedImageUrl, String.Empty); }
            set { SetPropertyValue(stringDisabledCheckedImageUrl, value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        [UrlProperty]
        public string CheckedImageOverUrl {
            get { return GetPropertyValue(stringCheckedImageOverUrl, String.Empty); }
            set { SetPropertyValue(stringCheckedImageOverUrl, value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        [UrlProperty]
        public string UncheckedImageOverUrl {
            get { return GetPropertyValue(stringUncheckedImageOverUrl, String.Empty); }
            set { SetPropertyValue(stringUncheckedImageOverUrl, value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string UncheckedImageAlternateText {
            get { return GetPropertyValue(stringUncheckedImageAlternateText, String.Empty); }
            set { SetPropertyValue(stringUncheckedImageAlternateText, value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string CheckedImageAlternateText {
            get { return GetPropertyValue(stringCheckedImageAlternateText, String.Empty); }
            set { SetPropertyValue(stringCheckedImageAlternateText, value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string CheckedImageOverAlternateText {
            get { return GetPropertyValue(stringCheckedImageOverAlternateText, String.Empty); }
            set { SetPropertyValue(stringCheckedImageOverAlternateText, value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string UncheckedImageOverAlternateText {
            get { return GetPropertyValue(stringUncheckedImageOverAlternateText, String.Empty); }
            set { SetPropertyValue(stringUncheckedImageOverAlternateText, value); }
        }
    }

}