using System.Web.UI;
using System.ComponentModel;
using System.Drawing;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.RoundedCornersExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.RoundedCornersBehavior", Constants.RoundedCornersName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(Control))]
    [ToolboxBitmap(typeof(RoundedCornersExtender), "RoundedCorners.ico")]
    public class RoundedCornersExtender : ExtenderControlBase {
        [DefaultValue(5)]
        [ExtenderControlProperty()]
        public int Radius {
            get { return GetPropertyValue("Radius", 5); }
            set { SetPropertyValue("Radius", value); }
        }

        [DefaultValue(BoxCorners.All)]
        [ExtenderControlProperty]
        public BoxCorners Corners {
            get { return GetPropertyValue("Corners", BoxCorners.All); }
            set { SetPropertyValue("Corners", value); }
        }

        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        public Color Color {
            get { return GetPropertyValue("Color", Color.Empty); }
            set { SetPropertyValue("Color", value); }
        }

        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        public Color BorderColor {
            get { return GetPropertyValue("BorderColor", Color.Empty); }
            set { SetPropertyValue("BorderColor", value); }
        }
    }

}
