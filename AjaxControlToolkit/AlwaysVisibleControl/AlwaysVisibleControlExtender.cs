using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;

namespace AjaxControlToolkit {

    // Extender used to add constant visibility to an ASP.NET control.  The control that is extended
    // then always moves to fixed position in the page regardless of how the body is resized or scrolled.
    [Designer("AjaxControlToolkit.Design.AlwaysVisibleControlExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.AlwaysVisibleControlBehavior", Constants.AlwaysVisibleControlName)]
    [RequiredScript(typeof(AnimationScripts))]
    [DefaultProperty("VerticalOffset")]
    [TargetControlType(typeof(Control))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.AlwaysVisibleControlName + Constants.IconPostfix)]
    public class AlwaysVisibleControlExtender : ExtenderControlBase {
        // Distance to the horizontal edge of the browser in pixels from the
        // same side of the target control. The default is 0 pixels.
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int HorizontalOffset {
            get { return GetPropertyValue("HorizontalOffset", 0); }
            set { SetPropertyValue("HorizontalOffset", value); }
        }

        // Horizontal side of the browser to anchor the control against.
        // The default is the Left side.
        [ExtenderControlProperty()]
        [DefaultValue(HorizontalSide.Left)]
        public HorizontalSide HorizontalSide {
            get { return GetPropertyValue("HorizontalSide", HorizontalSide.Left); }
            set { SetPropertyValue("HorizontalSide", value); }
        }

        // Distance to the vertical edge of the browser in pixels from the
        // same side of the target control. The default is 0 pixels.
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int VerticalOffset {
            get { return GetPropertyValue("VerticalOffset", 0); }
            set { SetPropertyValue("VerticalOffset", value); }
        }

        // Vertical side of the browser to anchor the control against.
        // The default is the Top side.
        [ExtenderControlProperty()]
        [DefaultValue(VerticalSide.Top)]
        public VerticalSide VerticalSide {
            get { return (VerticalSide)GetPropertyValue("VerticalSide", VerticalSide.Top); }
            set { SetPropertyValue("VerticalSide", value); }
        }

        // Length in seconds for the scrolling effect to last when the target
        // control is repositioned. The default is .1 seconds.
        [ExtenderControlProperty()]
        [DefaultValue(0.1f)]
        public float ScrollEffectDuration {
            get { return (float)GetPropertyValue("ScrollEffectDuration", 0.1f); }
            set { SetPropertyValue("ScrollEffectDuration", value); }
        }

        // Whether or not to animate the element into position.
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("useAnimation")]
        public bool UseAnimation {
            get { return GetPropertyValue("UseAnimation", false); }
            set { SetPropertyValue("UseAnimation", value); }
        }

        // Validate the offsets
        public override void EnsureValid() {
            base.EnsureValid();

            // Ensure the offsets are positive values
            if(VerticalOffset < 0)
                throw new ArgumentOutOfRangeException(string.Format(CultureInfo.CurrentCulture,
                    "AlwaysVisibleControlExtender on '{0}' cannot have a negative VerticalOffset value", TargetControlID));
            if(HorizontalOffset < 0)
                throw new ArgumentOutOfRangeException(string.Format(CultureInfo.CurrentCulture,
                    "AlwaysVisibleControlExtender on '{0}' cannot have a negative HorizontalOffset value", TargetControlID));
            if(ScrollEffectDuration <= 0)
                throw new ArgumentOutOfRangeException(string.Format(CultureInfo.CurrentCulture,
                    "AlwaysVisibleControlExtender on '{0}' must have a positive ScrollEffectDuration", TargetControlID));
        }
    }
    
}
