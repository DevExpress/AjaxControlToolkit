using System.Web.UI;
using System.ComponentModel;
using System.Drawing;
using AjaxControlToolkit.Design;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [Designer(typeof(RoundedCornersExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.RoundedCornersBehavior", Constants.RoundedCornersName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(WebControl))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.RoundedCornersName + Constants.IconPostfix)]
    public class RoundedCornersExtender : ExtenderControlBase {
        /// <summary>
        /// Gets or sets an integer value that specifies the radius of the corners (and the height of the added area). The default is 5.
        /// </summary>
        [DefaultValue(5)]
        [ExtenderControlProperty()]
        [ClientPropertyName("radius")]
        public int Radius {
            get { return GetPropertyValue("Radius", 5); }
            set { SetPropertyValue("Radius", value); }
        }

        /// <summary>
        /// Gets or sets a Sys.Extended.UI.BoxCorners object that specifies which corners should be rounded.
        /// </summary>
        [DefaultValue(BoxCorners.All)]
        [ExtenderControlProperty]
        [ClientPropertyName("corners")]
        public BoxCorners Corners {
            get { return GetPropertyValue("Corners", BoxCorners.All); }
            set { SetPropertyValue("Corners", value); }
        }

        /// <summary>
        /// Gets or sets a string that contains the background color of the rounded corner areas.
        /// By default, this property gets the background color of the panel that it is attached to.
        /// </summary>
        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("color")]
        public Color Color {
            get { return GetPropertyValue("Color", Color.Empty); }
            set { SetPropertyValue("Color", value); }
        }

        /// <summary>
        /// Gets or sets a string that contains the color of the border and therefore of the rounded corners.
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
