

using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: System.Web.UI.WebResource("BalloonPopup.BalloonPopupExtenderBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("BalloonPopup.BalloonPopupExtenderBehavior.debug.js", "text/javascript")]
[assembly: WebResource("BalloonPopup.BalloonPopup_resource.css", "text/css", PerformSubstitution = true)]
[assembly: WebResource("BalloonPopup.act_down_left.png", "img/png")]
[assembly: WebResource("BalloonPopup.act_down_right.png", "img/png")]
[assembly: WebResource("BalloonPopup.act_up_left.png", "img/png")]
[assembly: WebResource("BalloonPopup.act_up_right.png", "img/png")]
[assembly: WebResource("BalloonPopup.corners-type2.gif", "img/gif")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// Extender for the BallonPopup
    /// </summary>
    [ClientScriptResource("Sys.Extended.UI.BalloonPopupControlBehavior", "BalloonPopup.BalloonPopupExtenderBehavior.js")]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(Control))]
    [ClientCssResource("BalloonPopup.BalloonPopup_resource.css")]
    [Designer("AjaxControlToolkit.BalloonPopupDesigner, AjaxControlToolkit")]
    [ToolboxItem(Utility.ToolBoxItemTypeName)]
    [ToolboxBitmap(typeof(BalloonPopupExtender), "BalloonPopup.BalloonPopup.ico")]
    public class BalloonPopupExtender : DynamicPopulateExtenderControlBase
    {
        // Variables
        private Animation _onHide;
        private Animation _onShow;

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string ExtenderControlID
        {
            get { return GetPropertyValue("ExtenderControlID", ""); }
            set { SetPropertyValue("ExtenderControlID", value); }
        }

        /// <summary>
        /// ID of the control that Balloon pops up
        /// </summary>
        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [RequiredProperty]
        [DefaultValue("")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string BalloonPopupControlID
        {
            get { return GetPropertyValue("BalloonPopupControlID", ""); }
            set { SetPropertyValue("BalloonPopupControlID", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(BalloonPopupPosition.Auto)]
        [ClientPropertyName("balloonPopupPosition")]
        public BalloonPopupPosition Position
        {
            get;
            set;
        }

        [ExtenderControlProperty]
        [DefaultValue(BalloonPopupStyle.Rectangle)]
        [ClientPropertyName("balloonPopupStyle")]
        public BalloonPopupStyle BalloonStyle
        {
            get;
            set;
        }

        /// <summary>
        /// Optional X (horizontal) offset for the popup window (relative to the target control)
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int OffsetX
        {
            get { return GetPropertyValue("OffsetX", 0); }
            set { SetPropertyValue("OffsetX", value); }
        }

        /// <summary>
        /// Optional Y (vertical) offset for the popup window (relative to the target control)
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int OffsetY
        {
            get { return GetPropertyValue("OffsetY", 0); }
            set { SetPropertyValue("OffsetY", value); }
        }

        /// <summary>
        /// Optional width for the balloon popup window
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(300)]
        public int Width
        {
            get { return GetPropertyValue("Width", 300); }
            set { SetPropertyValue("Width", value); }
        }

        /// <summary>
        /// Optional height for the balloon popup window
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(200)]
        public int Height
        {
            get { return GetPropertyValue("Height", 200); }
            set { SetPropertyValue("Height", value); }
        }

        /// <summary>
        /// OnShow animation
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onShow")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnShow
        {
            get { return GetAnimation(ref _onShow, "OnShow"); }
            set { SetAnimation(ref _onShow, "OnShow", value); }
        }

        /// <summary>
        /// OnHide animation
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onHide")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHide
        {
            get { return GetAnimation(ref _onHide, "OnHide"); }
            set { SetAnimation(ref _onHide, "OnHide", value); }
        }

        /// <summary>
        /// Display popup on OnMouseover or not 
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("displayOnMouseOver")]
        [DefaultValue(false)]
        public bool DisplayOnMouseOver
        {
            get { return GetPropertyValue("DisplayOnMouseOver", false); }
            set { SetPropertyValue("DisplayOnMouseOver", value); }
        }

        /// <summary>
        /// Display popup on OnFocus or not 
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("displayOnFocus")]
        [DefaultValue(false)]
        public bool DisplayOnFocus
        {
            get { return GetPropertyValue("DisplayOnFocus", false); }
            set { SetPropertyValue("DisplayOnFocus", value); }
        }

        /// <summary>
        /// Display popup on OnClick or not 
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("displayOnClick")]
        [DefaultValue(true)]
        public bool DisplayOnClick
        {
            get { return GetPropertyValue("DisplayOnClick", true); }
            set { SetPropertyValue("DisplayOnClick", value); }
        }

    }
}
