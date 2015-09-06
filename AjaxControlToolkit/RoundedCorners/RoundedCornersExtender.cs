using System.Web.UI;
using System.ComponentModel;
using System.Drawing;
using AjaxControlToolkit.Design;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// The RoundedCorners extender applies rounded corners to existing elements. To accomplish this,
    /// it inserts elements before and after the element that is selected, so the overall height
    /// of the element will change slightly. You can choose which corners of the target panel should
    /// be rounded by setting the "Corners" property.
    /// </summary>
    [Designer(typeof(RoundedCornersExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.RoundedCornersBehavior", Constants.RoundedCornersName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(WebControl))]
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
        /// Background color of the rounded corners areas
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
