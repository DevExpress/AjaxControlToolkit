using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

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

        [ExtenderControlProperty]
        [DefaultValue(0)]
        public double Minimum {
            get { return GetPropertyValue<double>("Minimum", 0); }
            set { SetPropertyValue<double>("Minimum", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(100)]
        public double Maximum {
            get { return GetPropertyValue<double>("Maximum", 100); }
            set { SetPropertyValue<double>("Maximum", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue("")]
        public string RailCssClass {
            get { return GetPropertyValue("RailCssClass", ""); }
            set { SetPropertyValue("RailCssClass", value); }
        }

        [ExtenderControlProperty, UrlProperty]
        [DefaultValue("")]
        [Editor("System.Web.UI.Design.ImageUrlEditor, System.Design, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a", typeof(System.Drawing.Design.UITypeEditor))]
        public string HandleImageUrl {
            get { return GetPropertyValue("HandleImageUrl", ""); }
            set { SetPropertyValue("HandleImageUrl", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue("")]
        public string HandleCssClass {
            get { return GetPropertyValue("HandleCssClass", ""); }
            set { SetPropertyValue("HandleCssClass", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(false)]
        public bool EnableHandleAnimation {
            get { return GetPropertyValue("EnableHandleAnimation", false); }
            set { SetPropertyValue("EnableHandleAnimation", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int Steps {
            get { return GetPropertyValue("Steps", 0); }
            set { SetPropertyValue("Steps", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(SliderOrientation.Horizontal)]
        public SliderOrientation Orientation {
            get { return GetPropertyValue("Orientation", SliderOrientation.Horizontal); }
            set { SetPropertyValue("Orientation", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int Decimals {
            get { return GetPropertyValue("Decimals", 0); }
            set { SetPropertyValue("Decimals", value); }
        }

        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [DefaultValue("")]
        public string BoundControlID {
            get { return GetPropertyValue("BoundControlID", ""); }
            set { SetPropertyValue("BoundControlID", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(150)]
        public int Length {
            get { return GetPropertyValue("Length", 150); }
            set { SetPropertyValue("Length", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(true)]
        public bool RaiseChangeOnlyOnMouseUp {
            get { return GetPropertyValue("RaiseChangeOnlyOnMouseUp", true); }
            set { SetPropertyValue("RaiseChangeOnlyOnMouseUp", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue("")]
        public string TooltipText {
            get { return GetPropertyValue("TooltipText", String.Empty); }
            set { SetPropertyValue("TooltipText", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("enableKeyboard")]
        [Description("Determines if the slider will respond to arrow keys when it has focus.")]
        public bool EnableKeyboard {
            get { return GetPropertyValue("EnableKeyboard", true); }
            set { SetPropertyValue("EnableKeyboard", value); }
        }

        protected override IEnumerable<string> GetImageNames() {
            return new[] {
                Constants.SliderHorizontalHandleImage,
                Constants.SliderVerticalHandleImage,
                Constants.SliderHorizontalRailImage,
                Constants.SliderVerticalRailImage
            };
        }
    }

}