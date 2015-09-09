using AjaxControlToolkit.Design;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// DropShadow is an extender that applies a drop shadow to an ASP.NET Panel control.    
    /// </summary>
    [Designer(typeof(DropShadowExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.DropShadowBehavior", Constants.DropShadowName)]
    [RequiredScript(typeof(CommonToolkitScripts), 1)]
    [RequiredScript(typeof(RoundedCornersExtender), 2)]
    [RequiredScript(typeof(TimerScript), 3)]
    [TargetControlType(typeof(WebControl))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.DropShadowName + Constants.IconPostfix)]
    public class DropShadowExtender : ExtenderControlBase {
        /// <summary>
        /// The opacity of the shadow, from 0 (transparent - no shadow rendered) to 1.0, which is fully opaque black
        /// </summary>
        /// <remarks>
        /// The default is .5
        /// </remarks>
        [DefaultValue(1.0f)]
        [ExtenderControlProperty()]
        [ClientPropertyName("opacity")]
        public float Opacity {
            get { return GetPropertyValue("Opacity", 1.0f); }
            set { SetPropertyValue("Opacity", value); }
        }

        /// <summary>
        /// The width of the shadow on each side, in pixels
        /// </summary>
        /// <remarks>
        /// The default is 5
        /// </remarks>
        [DefaultValue(5)]
        [ExtenderControlProperty()]
        [ClientPropertyName("width")]
        public int Width {
            get { return GetPropertyValue("Width", 5); }
            set { SetPropertyValue("Width", value); }
        }

        /// <summary>
        /// Determines whether the DropShadow tracks position or size changes of the panel it is targeting
        /// </summary>
        /// <remarks>
        /// This is false by default.  If true, the DropShadowBehavior uses a timer to
        /// poll for the position of it's target, so don't turn it on unless it's needed
        /// </remarks>
        [DefaultValue(false)]
        [ExtenderControlProperty()]
        [ClientPropertyName("trackPosition")]
        public bool TrackPosition {
            get { return GetPropertyValue("TrackPosition", false); }
            set { SetPropertyValue("TrackPosition", value); }
        }

        /// <summary>
        /// A Boolean value that specifies whether the corners of the target and drop shadow should be rounded
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty()]
        [ClientPropertyName("rounded")]
        public bool Rounded {
            get { return GetPropertyValue("Rounded", false); }
            set { SetPropertyValue("Rounded", value); }
        }

        /// <summary>
        /// Specifies the radius, in pixels, of the rounded corners
        /// </summary>
        [DefaultValue(5)]
        [ExtenderControlProperty()]
        [ClientPropertyName("radius")]
        public int Radius {
            get { return GetPropertyValue("Radius", 5); }
            set { SetPropertyValue("Radius", value); }
        }
    }

}
