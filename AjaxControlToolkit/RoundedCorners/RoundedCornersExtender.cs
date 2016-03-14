using System.Web.UI;
using System.ComponentModel;
using System.Drawing;
using AjaxControlToolkit.Design;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// The RoundedCorners extender applies rounded corners to existing elements.
    /// </summary>
    [Designer(typeof(RoundedCornersExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.RoundedCornersBehavior", Constants.RoundedCornersName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(WebControl))]
    [TargetControlType(typeof(HtmlControl))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.RoundedCornersName + Constants.IconPostfix)]
    public class RoundedCornersExtender : ExtenderControlBase {
        /// <summary>
        /// Radius of the corners (and height of the added area). The default is 5
        /// </summary>
        [DefaultValue(5)]
        [ExtenderControlProperty()]
        [ClientPropertyName("radius")]
        public int Radius {
            get { return GetPropertyValue("Radius", 5); }
            set { SetPropertyValue("Radius", value); }
        }

        /// <summary>
        /// The corners of the target panel that should be rounded
        /// </summary>
        /// <remarks>
        /// Possible values:
        /// * None
        /// * TopLeft
        /// * TopRight
        /// * BottomRight
        /// * BottomLeft
        /// * Top
        /// * Right
        /// * Bottom
        /// * Left
        /// * All
        /// </remarks>
        [DefaultValue(BoxCorners.All)]
        [ExtenderControlProperty]
        [ClientPropertyName("corners")]
        public BoxCorners Corners {
            get { return GetPropertyValue("Corners", BoxCorners.All); }
            set { SetPropertyValue("Corners", value); }
        }

        /// <summary>
        /// Background color of the rounded corner areas
        /// </summary>
        /// <remarks>
        /// By default, this property gets the background color of the panel that it is attached to
        /// </remarks>
        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("color")]
        public Color Color {
            get { return GetPropertyValue("Color", Color.Empty); }
            set { SetPropertyValue("Color", value); }
        }

        /// <summary>
        /// Color of the border
        /// </summary>
        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("borderColor")]
        public Color BorderColor {
            get { return GetPropertyValue("BorderColor", Color.Empty); }
            set { SetPropertyValue("BorderColor", value); }
        }
    }

}
