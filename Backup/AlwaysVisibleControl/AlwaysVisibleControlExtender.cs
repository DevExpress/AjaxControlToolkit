

using System;
using System.Globalization;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;

[assembly: System.Web.UI.WebResource("AlwaysVisibleControl.AlwaysVisibleControlBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("AlwaysVisibleControl.AlwaysVisibleControlBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// Extender used to add constant visibility to an ASP.NET control.  The control that is extended
    /// then always moves to fixed position in the page regardless of how the body is resized or scrolled.
    /// </summary>
    [Designer("AjaxControlToolkit.AlwaysVisibleControlDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.AlwaysVisibleControlBehavior", "AlwaysVisibleControl.AlwaysVisibleControlBehavior.js")]
    [RequiredScript(typeof(AnimationScripts))]
    [DefaultProperty("VerticalOffset")]
    [TargetControlType(typeof(Control))]
    [System.Drawing.ToolboxBitmap(typeof(AlwaysVisibleControlExtender), "AlwaysVisibleControl.AlwaysVisible.ico")]
    public class AlwaysVisibleControlExtender : ExtenderControlBase
    {
        /// <summary>
        /// Distance to the horizontal edge of the browser in pixels from the
        /// same side of the target control. The default is 0 pixels.
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int HorizontalOffset
        {
            get { return GetPropertyValue("HorizontalOffset", 0); }
            set { SetPropertyValue("HorizontalOffset", value); }
        }

        /// <summary>
        /// Horizontal side of the browser to anchor the control against.
        /// The default is the Left side.
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(HorizontalSide.Left)]
        public HorizontalSide HorizontalSide
        {
            get { return GetPropertyValue("HorizontalSide", HorizontalSide.Left); }
            set { SetPropertyValue("HorizontalSide", value); }
        }

        /// <summary>
        /// Distance to the vertical edge of the browser in pixels from the
        /// same side of the target control. The default is 0 pixels.
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int VerticalOffset
        {
            get { return GetPropertyValue("VerticalOffset", 0); }
            set { SetPropertyValue("VerticalOffset", value); }
        }

        /// <summary>
        /// Vertical side of the browser to anchor the control against.
        /// The default is the Top side.
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(VerticalSide.Top)]
        public VerticalSide VerticalSide
        {
            get { return (VerticalSide) GetPropertyValue("VerticalSide", VerticalSide.Top); }
            set { SetPropertyValue("VerticalSide", value); }
        }

        /// <summary>
        /// Length in seconds for the scrolling effect to last when the target
        /// control is repositioned. The default is .1 seconds.
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(0.1f)]
        public float ScrollEffectDuration
        {
            get { return (float) GetPropertyValue("ScrollEffectDuration", 0.1f); }
            set { SetPropertyValue("ScrollEffectDuration", value); }
        }

        /// <summary>
        /// Whether or not to animate the element into position.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("useAnimation")]
        public bool UseAnimation
        {
            get { return GetPropertyValue("UseAnimation", false); }
            set { SetPropertyValue("UseAnimation", value); }
        }

        /// <summary>
        /// Validate the offsets
        /// </summary>
        public override void EnsureValid()
        {
            base.EnsureValid();

            // Ensure the offsets are positive values
            if (VerticalOffset < 0)
                throw new ArgumentOutOfRangeException(string.Format(CultureInfo.CurrentCulture,
                    "AlwaysVisibleControlExtender on '{0}' cannot have a negative VerticalOffset value", TargetControlID));
            if (HorizontalOffset < 0)
                throw new ArgumentOutOfRangeException(string.Format(CultureInfo.CurrentCulture,
                    "AlwaysVisibleControlExtender on '{0}' cannot have a negative HorizontalOffset value", TargetControlID));
            if (ScrollEffectDuration <= 0)
                throw new ArgumentOutOfRangeException(string.Format(CultureInfo.CurrentCulture,
                    "AlwaysVisibleControlExtender on '{0}' must have a positive ScrollEffectDuration", TargetControlID));
        }
    }
}
