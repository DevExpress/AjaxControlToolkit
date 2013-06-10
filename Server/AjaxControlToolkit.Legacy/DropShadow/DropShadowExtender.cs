

using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;

#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("DropShadow.DropShadowBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("DropShadow.DropShadowBehavior.debug.js", "text/javascript")]
#endregion

namespace AjaxControlToolkit
{
    [Designer("AjaxControlToolkit.DropShadowDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.DropShadowBehavior", "DropShadow.DropShadowBehavior.js")]
    [RequiredScript(typeof(CommonToolkitScripts), 1)]
    [RequiredScript(typeof(RoundedCornersExtender), 2)]
    [RequiredScript(typeof(TimerScript), 3)]
    [TargetControlType(typeof(Control))]
    [System.Drawing.ToolboxBitmap(typeof(DropShadowExtender), "DropShadow.DropShadow.ico")]
    public class DropShadowExtender : ExtenderControlBase
    {

        /// <summary>
        /// The opacity of the shadow, from 0 (transparent - no shadow rendered) to 1.0, which is fully opaque black.
        /// The default is .5.
        /// </summary>
        [DefaultValue(1.0f)]
        [ExtenderControlProperty()]
        public float Opacity {
            get {
                return GetPropertyValue("Opacity", 1.0f);
            }
            set {
                SetPropertyValue("Opacity", value);
            }
        }

        /// <summary>
        /// The width of the shadow on each side, in pixels.  Default is 5.
        /// </summary>
        [DefaultValue(5)]
        [ExtenderControlProperty()]
        public int Width {
            get {
                return GetPropertyValue("Width", 5);
            }
            set {
                SetPropertyValue("Width", value);
            }
        }

        /// <summary>
        /// Determines whether the DropShadow tracks position or size changes of the panel
        /// it is targeting.  This is false by default.  If true, the DropShadowBehavior uses a timer to
        /// poll for the position of it's target, so don't turn it on unless it's needed.
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty()]
        public bool TrackPosition {
            get {
                return GetPropertyValue("TrackPosition", false);
            }
            set {
                SetPropertyValue("TrackPosition", value);
            }
        }

        [DefaultValue(false)]
        [ExtenderControlProperty()]
        public bool Rounded {
            get {
                return GetPropertyValue("Rounded", false);
            }
            set {
                SetPropertyValue("Rounded", value);
            }
        }

        [DefaultValue(5)]
        [ExtenderControlProperty()]
        public int Radius {
            get {
                return GetPropertyValue("Radius", 5);
            }
            set {
                SetPropertyValue("Radius", value);
            }
        }
    }       
}
