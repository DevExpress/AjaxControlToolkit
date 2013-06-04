

using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

[assembly: System.Web.UI.WebResource("BalloonPopup.BalloonPopupExtenderBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("BalloonPopup.BalloonPopupExtenderBehavior.debug.js", "text/javascript")]
[assembly: WebResource("BalloonPopup.Rectangle.BalloonPopup_resource.css", "text/css", PerformSubstitution = true)]
[assembly: WebResource("BalloonPopup.Rectangle.sprite.png", "img/png")]
[assembly: WebResource("BalloonPopup.Rectangle.sprite.gif", "img/gif")]
[assembly: WebResource("BalloonPopup.Cloud.BalloonPopup_resource.css", "text/css", PerformSubstitution = true)]
[assembly: WebResource("BalloonPopup.Cloud.sprite.png", "img/png")]
[assembly: WebResource("BalloonPopup.Cloud.sprite.gif", "img/gif")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// Extender for the BallonPopup
    /// </summary>
    [ClientScriptResource("Sys.Extended.UI.BalloonPopupControlBehavior", "BalloonPopup.BalloonPopupExtenderBehavior.js")]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(Control))]
    [ClientCssResource("BalloonPopup.Rectangle.BalloonPopup_resource.css")]
    [ClientCssResource("BalloonPopup.Cloud.BalloonPopup_resource.css")]    
    [Designer("AjaxControlToolkit.BalloonPopupDesigner, AjaxControlToolkit")]
    [ToolboxItem(Utility.ToolBoxItemTypeName)]
    [ToolboxBitmap(typeof(BalloonPopupExtender), "BalloonPopup.BalloonPopup.ico")]
    public class BalloonPopupExtender : DynamicPopulateExtenderControlBase
    {
        // Variables
        private Animation _onHide;
        private Animation _onShow;

        /// <summary>
        /// Id of target control on which balloon popup will be displayed.
        /// </summary>
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string ExtenderControlID
        {
            get { return GetPropertyValue("ExtenderControlID", ""); }
            set { SetPropertyValue("ExtenderControlID", value); }
        }

        /// <summary>
        /// ID of the control which will be displayed in the Balloon popup.
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

        /// <summary>
        /// Position of Balloon popup control whether to display on TopLeft, TopRight,
        /// BottomLeft, BottomRight or Auto.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(BalloonPopupPosition.Auto)]
        [ClientPropertyName("balloonPopupPosition")]
        public BalloonPopupPosition Position
        {
            get;
            set;
        }

        /// <summary>
        /// Theme of Balloon popup whether to display Cloud or Rectangle or Custom.
        /// </summary>
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

        /// <summary>
        /// Size of Popup whether Small, Medium or Large. 
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("balloonSize")]
        [DefaultValue(BalloonPopupSize.Small)]
        public BalloonPopupSize BalloonSize
        {
            get { return GetPropertyValue("BalloonSize", BalloonPopupSize.Small); }
            set { SetPropertyValue("BalloonSize", value); }
        }

        /// <summary>
        /// Display popup on OnClick or not 
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("useShadow")]
        [DefaultValue(true)]
        public bool UseShadow
        {
            get { return GetPropertyValue("UseShadow", true); }
            set { SetPropertyValue("UseShadow", value); }
        }

        /// <summary>
        /// Url of custom css that is required to display custom theme of Balloon Popup.
        /// </summary>
        [DefaultValue("")]
        public string CustomCssUrl
        {
            get;
            set;
        }

        /// <summary>
        /// Scroll bars behavior when content is overflow
        /// </summary>
        [DefaultValue(ScrollBars.Auto)]
        [Category("Behavior")]
        [ClientPropertyName("scrollBars")]
        [Description("Scroll bars behavior when content is overflow")]
        [ExtenderControlProperty]
        public ScrollBars ScrollBars
        {
            get { return GetPropertyValue("ScrollBars", ScrollBars.Auto); }
            set { SetPropertyValue("ScrollBars", value); }
        }

        /// <summary>
        /// Name of the css class that will be used in custom css code.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("customClassName")]
        [DefaultValue("")]
        public string CustomClassName
        {
            get { return GetPropertyValue("CustomClassName", ""); }
            set { SetPropertyValue("CustomClassName", value); }
        }
        
        /// <summary>
        /// This event fires before rendering of control.
        /// </summary>
        /// <param name="e"></param>
        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);

            if (BalloonStyle == BalloonPopupStyle.Custom)
            {                
                if (CustomCssUrl == "")
                    throw new ArgumentException("Must pass CustomCssUrl value.");
                if (CustomClassName == "")
                    throw new ArgumentException("Must pass CustomClassName value.");                

                var isLinked = false;
                foreach (Control c in Page.Header.Controls)
                {
                    if (c.ID == "customCssUrl")
                    {
                        isLinked = true;
                        break;
                    }
                }
                if (!isLinked)
                {
                    HtmlLink css = new HtmlLink();
                    css.Href = ResolveUrl(CustomCssUrl);
                    css.Attributes["id"] = "customCssUrl";
                    css.Attributes["rel"] = "stylesheet";
                    css.Attributes["type"] = "text/css";
                    css.Attributes["media"] = "all";
                    Page.Header.Controls.Add(css);
                }
            }
        }
    }
}
