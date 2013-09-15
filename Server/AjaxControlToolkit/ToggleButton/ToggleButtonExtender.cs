using System;
using System.ComponentModel;
using System.Web.UI;

[assembly: System.Web.UI.WebResource("jQuery.ToggleButton.ToggleButtonExtender.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("jQuery.ToggleButton.ToggleButtonExtender.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// ToggleButton extender class definition
    /// </summary>
    [Designer("AjaxControlToolkit.ToggleButtonExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource(null, "jQuery.ToggleButton.ToggleButtonExtender.js")]
    [TargetControlType(typeof(ICheckBoxControl))]
    [System.Drawing.ToolboxBitmap(typeof(ToggleButtonExtender), "ToggleButton.ToggleButton.ico")]    
    public class ToggleButtonExtender : JQueryExtenderControl
    {
        // Constant strings for each property name
        private const string stringImageWidth = "ImageWidth";
        private const string stringImageHeight = "ImageHeight";
        private const string stringUncheckedImageUrl = "UncheckedImageUrl";
        private const string stringCheckedImageUrl = "CheckedImageUrl";
        private const string stringDisabledUncheckedImageUrl = "DisabledUncheckedImageUrl";
        private const string stringDisabledCheckedImageUrl = "DisabledCheckedImageUrl";
        private const string stringCheckedImageOverUrl = "CheckedImageOverUrl"; 
        private const string stringUncheckedImageOverUrl = "UncheckedImageOverUrl"; 
        private const string stringUncheckedImageAlternateText = "UncheckedImageAlternateText";
        private const string stringCheckedImageAlternateText = "CheckedImageAlternateText";
        private const string stringCheckedImageOverAlternateText = "CheckedImageOverAlternateText"; 
        private const string stringUncheckedImageOverAlternateText = "UncheckedImageOverAlternateText";

        /// <summary>
        /// Width of the checkbox images
        /// </summary>
        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue(0)]
        public int ImageWidth
        {
            get
            {
                return GetPropertyValue(stringImageWidth, 0);
            }
            set
            {
                SetPropertyValue(stringImageWidth, value);
            }
        }

        /// <summary>
        /// Height of the checkbox images
        /// </summary>
        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue(0)]
        public int ImageHeight
        {
            get
            {
                return GetPropertyValue(stringImageHeight, 0);
            }
            set
            {
                SetPropertyValue(stringImageHeight, value);
            }
        }

        /// <summary>
        /// Location of the image for an unchecked checkbox
        /// </summary>
        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue("")]
        [UrlProperty()]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Using string to avoid Uri complications")]
        public string UncheckedImageUrl
        {
            get
            {
                return GetPropertyValue(stringUncheckedImageUrl, "");
            }
            set
            {
                SetPropertyValue(stringUncheckedImageUrl, value);
            }
        }

        /// <summary>
        /// Location of the image for a checked checkbox
        /// </summary>
        [ExtenderControlProperty()]
        [RequiredProperty()]
        [DefaultValue("")]
        [UrlProperty()]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Using string to avoid Uri complications")]
        public string CheckedImageUrl
        {
            get
            {
                return GetPropertyValue(stringCheckedImageUrl, "");
            }
            set
            {
                SetPropertyValue(stringCheckedImageUrl, value);
            }
        }

        /// <summary>
        /// Location of the image for an unchecked disabled checkbox
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [UrlProperty]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Using string to avoid Uri complications")]
        public string DisabledUncheckedImageUrl
        {
            get
            {
                return GetPropertyValue(stringDisabledUncheckedImageUrl, "");
            }
            set
            {
                SetPropertyValue(stringDisabledUncheckedImageUrl, value);
            }
        }

        /// <summary>
        /// Location of the image for a checked disabled checkbox
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [UrlProperty]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Using string to avoid Uri complications")]
        public string DisabledCheckedImageUrl
        {
            get
            {
                return GetPropertyValue(stringDisabledCheckedImageUrl, "");
            }
            set
            {
                SetPropertyValue(stringDisabledCheckedImageUrl, value);
            }
        }

        /// <summary>
        /// Location of the image for a moused-over checked checkbox
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [UrlProperty]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Using string to avoid Uri complications")]
        public string CheckedImageOverUrl
        {
            get
            {
                return GetPropertyValue(stringCheckedImageOverUrl, "");
            }
            set
            {
                SetPropertyValue(stringCheckedImageOverUrl, value);
            }
        }

        /// <summary>
        /// Location of the image for a moused-over unchecked checkbox
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [UrlProperty]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Using string to avoid Uri complications")]
        public string UncheckedImageOverUrl
        {
            get
            {
                return GetPropertyValue(stringUncheckedImageOverUrl, "");
            }
            set
            {
                SetPropertyValue(stringUncheckedImageOverUrl, value);
            }
        }

        /// <summary>
        /// Alternate Text for UncheckedImage (alt)
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string UncheckedImageAlternateText
        {
            get
            {
                return GetPropertyValue(stringUncheckedImageAlternateText, "");
            }
            set
            {
                SetPropertyValue(stringUncheckedImageAlternateText, value);
            }
        }

        /// <summary>
        /// Alternate Text for CheckedImage (alt)
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string CheckedImageAlternateText
        {
            get
            {
                return GetPropertyValue(stringCheckedImageAlternateText, "");
            }
            set
            {
                SetPropertyValue(stringCheckedImageAlternateText, value);
            }
        }

        /// <summary>
        /// Alternate Text for CheckedImageOver (alt)
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string CheckedImageOverAlternateText
        {
            get
            {
                return GetPropertyValue(stringCheckedImageOverAlternateText, "");
            }
            set
            {
                SetPropertyValue(stringCheckedImageOverAlternateText, value);
            }
        }

        /// <summary>
        /// Alternate Text for UncheckedImageOver (alt)
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string UncheckedImageOverAlternateText
        {
            get
            {
                return GetPropertyValue(stringUncheckedImageOverAlternateText, "");
            }
            set
            {
                SetPropertyValue(stringUncheckedImageOverAlternateText, value);
            }
        }
    }
}
