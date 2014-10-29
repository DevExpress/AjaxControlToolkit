using System.ComponentModel;
using System.Drawing;
using System.Web.UI;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.DropShadowExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.DropShadowBehavior", Constants.DropShadowName)]
    [RequiredScript(typeof(CommonToolkitScripts), 1)]
    [RequiredScript(typeof(RoundedCornersExtender), 2)]
    [RequiredScript(typeof(TimerScript), 3)]
    [TargetControlType(typeof(Control))]
    [ToolboxBitmap(typeof(DropShadowExtender), Constants.DropShadowName + Constants.IconPostfix)]
    public class DropShadowExtender : ExtenderControlBase {
        // The opacity of the shadow, from 0 (transparent - no shadow rendered) to 1.0, which is fully opaque black.
        // The default is .5.
        [DefaultValue(1.0f)]
        [ExtenderControlProperty()]
        public float Opacity {
            get { return GetPropertyValue("Opacity", 1.0f); }
            set { SetPropertyValue("Opacity", value); }
        }

        // The width of the shadow on each side, in pixels.
        [DefaultValue(5)]
        [ExtenderControlProperty()]
        public int Width {
            get { return GetPropertyValue("Width", 5); }
            set { SetPropertyValue("Width", value); }
        }

        // Determines whether the DropShadow tracks position or size changes of the panel
        // it is targeting.  This is false by default.  If true, the DropShadowBehavior uses a timer to
        // poll for the position of it's target, so don't turn it on unless it's needed.
        [DefaultValue(false)]
        [ExtenderControlProperty()]
        public bool TrackPosition {
            get { return GetPropertyValue("TrackPosition", false); }
            set { SetPropertyValue("TrackPosition", value); }
        }

        [DefaultValue(false)]
        [ExtenderControlProperty()]
        public bool Rounded {
            get { return GetPropertyValue("Rounded", false); }
            set { SetPropertyValue("Rounded", value); }
        }

        [DefaultValue(5)]
        [ExtenderControlProperty()]
        public int Radius {
            get { return GetPropertyValue("Radius", 5); }
            set { SetPropertyValue("Radius", value); }
        }
    }

}
