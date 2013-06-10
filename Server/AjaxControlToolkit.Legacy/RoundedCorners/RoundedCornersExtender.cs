

using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.Drawing;

#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("RoundedCorners.RoundedCornersBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("RoundedCorners.RoundedCornersBehavior.debug.js", "text/javascript")]
#endregion

namespace AjaxControlToolkit
{
    [Designer("AjaxControlToolkit.RoundedCornersDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.RoundedCornersBehavior", "RoundedCorners.RoundedCornersBehavior.js")]
    [TargetControlType(typeof(Control))]
    [System.Drawing.ToolboxBitmap(typeof(RoundedCornersExtender), "RoundedCorners.RoundedCorners.ico")]
    public class RoundedCornersExtender : ExtenderControlBase
    {
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

        [DefaultValue(BoxCorners.All)]
        [ExtenderControlProperty]
        public BoxCorners Corners
        {
            get { 
                return GetPropertyValue("Corners", BoxCorners.All); 
            }
            set { 
                SetPropertyValue("Corners", value); 
            }
        }

        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        public Color Color {
            get {
                return GetPropertyValue("Color", Color.Empty);
            }
            set {
                SetPropertyValue("Color", value);
            }
        }

        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        public Color BorderColor
        {
            get { return GetPropertyValue("BorderColor", Color.Empty); }
            set { SetPropertyValue("BorderColor", value); }
        }
    }
}
