#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// The Slider extender allows upgrading an asp:TextBox to a graphical slider that allows
    /// a user to choose a numeric value from a finite range.
    /// </summary>
    /// <remarks>
    /// By declaring the extended TextBox as a trigger for an UpdatePanel, the Slider can fire the
    /// update whenever the handle is released. By setting RaiseChangeOnlyOnMouseUp to false, the
    /// update will be fired as soon as the Slider's value changes. The TooltipText property allows
    /// displaying some text when the mouse pointer hovers the slider's handle. A {0} placeholder
    /// in the text is replaced by the current value of the slider.
    /// </remarks>
    [Designer(typeof(SliderDesigner))]
    [ClientCssResource(Constants.SliderName)]
    [ClientScriptResource("Sys.Extended.UI.SliderBehavior", Constants.SliderName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(DragDropScripts))]
    [RequiredScript(typeof(AnimationScripts))]
    [RequiredScript(typeof(TimerScript))]
    [TargetControlType(typeof(TextBox))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.SliderName + Constants.IconPostfix)]
    public class SliderExtender : ExtenderControlBase {
        readonly string[] _imageNames = new[] {
            Constants.SliderHorizontalHandleImage,
            Constants.SliderVerticalHandleImage,
            Constants.SliderHorizontalRailImage,
            Constants.SliderVerticalRailImage
        };

        /// <summary>
        /// Minimum value allowed
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        [ClientPropertyName("minimum")]
        public double Minimum {
            get { return GetPropertyValue<double>("Minimum", 0); }
            set { SetPropertyValue<double>("Minimum", value); }
        }

        /// <summary>
        /// Maximum value allowed
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(100)]
        [ClientPropertyName("maximum")]
        public double Maximum {
            get { return GetPropertyValue<double>("Maximum", 100); }
            set { SetPropertyValue<double>("Maximum", value); }
        }

        /// <summary>
        /// A CSS class for the slider's rail
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("railCssClass")]
        public string RailCssClass {
            get { return GetPropertyValue("RailCssClass", ""); }
            set { SetPropertyValue("RailCssClass", value); }
        }

        /// <summary>
        /// The URL of an image to display as the slider's handle
        /// </summary>
        [ExtenderControlProperty, UrlProperty]
        [DefaultValue("")]
        [Editor("System.Web.UI.Design.ImageUrlEditor, System.Design, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a", typeof(System.Drawing.Design.UITypeEditor))]
        [ClientPropertyName("handleImageUrl")]
        public string HandleImageUrl {
            get { return GetPropertyValue("HandleImageUrl", ""); }
            set { SetPropertyValue("HandleImageUrl", value); }
        }

        /// <summary>
        /// A CSS class for the slider's handle
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("handleCssClass")]
        public string HandleCssClass {
            get { return GetPropertyValue("HandleCssClass", ""); }
            set { SetPropertyValue("HandleCssClass", value); }
        }

        /// <summary>
        /// Enable/disable the handle animation
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("enableHandleAnimation")]
        public bool EnableHandleAnimation {
            get { return GetPropertyValue("EnableHandleAnimation", false); }
            set { SetPropertyValue("EnableHandleAnimation", value); }
        }

        /// <summary>
        /// A number of discrete values inside the slider's range
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        [ClientPropertyName("steps")]
        public int Steps {
            get { return GetPropertyValue("Steps", 0); }
            set { SetPropertyValue("Steps", value); }
        }

        /// <summary>
        /// Slider orientation
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(SliderOrientation.Horizontal)]
        [ClientPropertyName("orientation")]
        public SliderOrientation Orientation {
            get { return GetPropertyValue("Orientation", SliderOrientation.Horizontal); }
            set { SetPropertyValue("Orientation", value); }
        }

        /// <summary>
        /// A number of decimal digits for the value
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        [ClientPropertyName("decimals")]
        public int Decimals {
            get { return GetPropertyValue("Decimals", 0); }
            set { SetPropertyValue("Decimals", value); }
        }

        /// <summary>
        /// ID of the TextBox or Label that dynamically displays the slider's value
        /// </summary>
        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [DefaultValue("")]
        [ClientPropertyName("boundControlID")]
        public string BoundControlID {
            get { return GetPropertyValue("BoundControlID", ""); }
            set { SetPropertyValue("BoundControlID", value); }
        }

        /// <summary>
        /// Width/height of a horizontal/vertical slider when the default layout is used
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(150)]
        [ClientPropertyName("length")]
        public int Length {
            get { return GetPropertyValue("Length", 150); }
            set { SetPropertyValue("Length", value); }
        }

        /// <summary>
        /// If true, fires the change event on the extended TextBox only when the
        /// left mouse button is released
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("raiseChangeOnlyOnMouseUp")]
        public bool RaiseChangeOnlyOnMouseUp {
            get { return GetPropertyValue("RaiseChangeOnlyOnMouseUp", true); }
            set { SetPropertyValue("RaiseChangeOnlyOnMouseUp", value); }
        }

        /// <summary>
        /// Text to display in a tooltip when the handle is hovered
        /// </summary>
        /// <remarks>
        /// The {0} placeholder in the text is replaced with the current value of the slider
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("tooltipText")]
        public string TooltipText {
            get { return GetPropertyValue("TooltipText", String.Empty); }
            set { SetPropertyValue("TooltipText", value); }
        }

        /// <summary>
        /// Determines if the slider responds to arrow keys when it has focus
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("enableKeyboard")]
        [Description("Determines if the slider will respond to arrow keys when it has focus.")]
        public bool EnableKeyboard {
            get { return GetPropertyValue("EnableKeyboard", true); }
            set { SetPropertyValue("EnableKeyboard", value); }
        }

        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);
            ToolkitResourceManager.RegisterImagePaths(_imageNames, this);
        }
    }

}
#pragma warning restore 1591