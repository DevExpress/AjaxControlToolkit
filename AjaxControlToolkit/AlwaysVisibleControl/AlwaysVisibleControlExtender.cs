using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// An extender used to add constant visibility to an ASP.NET control. 
    /// The control that is extended then always moves to a fixed position 
    /// in the page regardless of how the body is resized or scrolled.
    /// </summary>
    [Designer(typeof(AlwaysVisibleControlExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.AlwaysVisibleControlBehavior", Constants.AlwaysVisibleControlName)]
    [RequiredScript(typeof(AnimationScripts))]
    [DefaultProperty("VerticalOffset")]
    [TargetControlType(typeof(WebControl))]
    [TargetControlType(typeof(HtmlControl))]
    [TargetControlType(typeof(UpdateProgress))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.AlwaysVisibleControlName + Constants.IconPostfix)]
    public class AlwaysVisibleControlExtender : ExtenderControlBase {

        /// <summary>
        /// A distance to the horizontal edge of the browser in pixels from the same side of the target control. 
        /// The default is 0.
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        [ClientPropertyName("horizontalOffset")]
        public int HorizontalOffset {
            get { return GetPropertyValue("HorizontalOffset", 0); }
            set { SetPropertyValue("HorizontalOffset", value); }
        }

        /// <summary>
        /// A horizontal side of the browser to anchor the control against.
        /// The default is the Left.
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(HorizontalSide.Left)]
        [ClientPropertyName("horizontalSide")]
        public HorizontalSide HorizontalSide {
            get { return GetPropertyValue("HorizontalSide", HorizontalSide.Left); }
            set { SetPropertyValue("HorizontalSide", value); }
        }

        /// <summary>
        /// A distance to the vertical edge of the browser in pixels from the same side of the target control.
        /// The default is 0.
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        [ClientPropertyName("verticalOffset")]
        public int VerticalOffset {
            get { return GetPropertyValue("VerticalOffset", 0); }
            set { SetPropertyValue("VerticalOffset", value); }
        }

        /// <summary>
        /// A vertical side of the browser to anchor the control against.
        /// The default is the Top.
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(VerticalSide.Top)]
        [ClientPropertyName("verticalSide")]
        public VerticalSide VerticalSide {
            get { return (VerticalSide)GetPropertyValue("VerticalSide", VerticalSide.Top); }
            set { SetPropertyValue("VerticalSide", value); }
        }

        /// <summary>
        /// Length of the scrolling effectn seconds when the target control is repositioned.
        /// The default is 1.
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(0.1f)]
        [ClientPropertyName("scrollEffectDuration")]
        public float ScrollEffectDuration {
            get { return (float)GetPropertyValue("ScrollEffectDuration", 0.1f); }
            set { SetPropertyValue("ScrollEffectDuration", value); }
        }

        /// <summary>
        /// Whether or not to animate the element's transposition.
        /// The default is false.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("useAnimation")]
        public bool UseAnimation {
            get { return GetPropertyValue("UseAnimation", false); }
            set { SetPropertyValue("UseAnimation", value); }
        }

        /// <summary>
        /// Validates offsets.
        /// </summary>
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
