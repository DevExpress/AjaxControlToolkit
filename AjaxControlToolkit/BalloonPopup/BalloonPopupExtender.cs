#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// The BalloonPopupExtender control displays a popup which can contain any content.    
    /// </summary>
    [ClientScriptResource("Sys.Extended.UI.BalloonPopupControlBehavior", Constants.BalloonPopupName)]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(WebControl))]
    [ClientCssResource(Constants.BalloonPopupName + ".Cloud")]
    [ClientCssResource(Constants.BalloonPopupName + ".Rectangle")]
    [Designer(typeof(BalloonPopupExtenderDesigner))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.BalloonPopupName + Constants.IconPostfix)]
    public class BalloonPopupExtender : DynamicPopulateExtenderControlBase {
        Animation _onHide;
        Animation _onShow;

        /// <summary>
        /// Extender control ID
        /// </summary>
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public string ExtenderControlID {
            get { return GetPropertyValue("ExtenderControlID", String.Empty); }
            set { SetPropertyValue("ExtenderControlID", value); }
        }

        /// <summary>
        /// The ID of the control to display
        /// </summary>
        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [RequiredProperty]
        [DefaultValue("")]
        [ClientPropertyName("balloonPopupControlID")]
        public string BalloonPopupControlID {
            get { return GetPropertyValue("BalloonPopupControlID", String.Empty); }
            set { SetPropertyValue("BalloonPopupControlID", value); }
        }

        /// <summary>
        /// Optional setting specifying where the popup should be positioned relative to the target control
        /// </summary>
        /// <remarks>
        /// (TopRight, TopLeft, BottomRight, BottomLeft, Auto) Default value is Auto
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue(BalloonPopupPosition.Auto)]
        [ClientPropertyName("balloonPopupPosition")]
        public BalloonPopupPosition Position { get; set; }

        /// <summary>
        /// Optional setting specifying the theme of balloon popup.
        /// Default value is Rectangle
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(BalloonPopupStyle.Rectangle)]
        [ClientPropertyName("balloonPopupStyle")]
        public BalloonPopupStyle BalloonStyle { get; set; }

        /// <summary>
        /// Optional X (horizontal) offset for the popup window (relative to the target control).
        /// Default value is 0
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        [ClientPropertyName("offsetX")]
        public int OffsetX {
            get { return GetPropertyValue("OffsetX", 0); }
            set { SetPropertyValue("OffsetX", value); }
        }

        /// <summary>
        /// Optional Y (vertical) offset for the popup window (relative to the target control).
        /// Default value is 0
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        [ClientPropertyName("offsetY")]
        public int OffsetY {
            get { return GetPropertyValue("OffsetY", 0); }
            set { SetPropertyValue("OffsetY", value); }
        }

        /// <summary>
        /// The OnShow animation will be played each time the popup is displayed.
        /// The popup will be positioned correctly but hidden
        /// </summary>
        /// <remarks>
        /// The animation can use <HideAction Visible="true" /> to display the popup along with any other visual effects
        /// </remarks>
        [ExtenderControlProperty]
        [ClientPropertyName("onShow")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnShow {
            get { return GetAnimation(ref _onShow, "OnShow"); }
            set { SetAnimation(ref _onShow, "OnShow", value); }
        }

        /// <summary>
        /// The OnHide animation will be played each time the popup is hidden
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onHide")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHide {
            get { return GetAnimation(ref _onHide, "OnHide"); }
            set { SetAnimation(ref _onHide, "OnHide", value); }
        }

        /// <summary>
        /// Optional setting specifying whether to display balloon popup on the client onMouseOver event. Default value is false
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("displayOnMouseOver")]
        [DefaultValue(false)]
        public bool DisplayOnMouseOver {
            get { return GetPropertyValue("DisplayOnMouseOver", false); }
            set { SetPropertyValue("DisplayOnMouseOver", value); }
        }

        /// <summary>
        /// Optional setting specifying whether to display balloon popup on the client onFocus event. Default value is false
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("displayOnFocus")]
        [DefaultValue(false)]
        public bool DisplayOnFocus {
            get { return GetPropertyValue("DisplayOnFocus", false); }
            set { SetPropertyValue("DisplayOnFocus", value); }
        }

        /// <summary>
        /// Optional setting specifying whether to display balloon popup on the client onClick event. Default value is true
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("displayOnClick")]
        [DefaultValue(true)]
        public bool DisplayOnClick {
            get { return GetPropertyValue("DisplayOnClick", true); }
            set { SetPropertyValue("DisplayOnClick", value); }
        }

        /// <summary>
        /// Optional setting specifying the size of balloon popup. (Small, Medium and Large). Default value is Small
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("balloonSize")]
        [DefaultValue(BalloonPopupSize.Small)]
        public BalloonPopupSize BalloonSize {
            get { return GetPropertyValue("BalloonSize", BalloonPopupSize.Small); }
            set { SetPropertyValue("BalloonSize", value); }
        }

        /// <summary>
        /// Optional setting specifying whether to display shadow of balloon popup or not
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("useShadow")]
        [DefaultValue(true)]
        public bool UseShadow {
            get { return GetPropertyValue("UseShadow", true); }
            set { SetPropertyValue("UseShadow", value); }
        }

        /// <summary>
        /// This is required if user choose BalloonStyle to Custom. This specifies the url of custom css which will display custom theme
        /// </summary>
        [DefaultValue("")]
        public string CustomCssUrl { get; set; }

        /// <summary>
        /// Optional setting specifying whether to display scrollbar if contents are overflowing.
        /// Default value is Auto
        /// </summary>
        [DefaultValue(ScrollBars.Auto)]
        [Category("Behavior")]
        [ClientPropertyName("scrollBars")]
        [Description("Scroll bars behavior when content is overflow")]
        [ExtenderControlProperty]
        public ScrollBars ScrollBars {
            get { return GetPropertyValue("ScrollBars", ScrollBars.Auto); }
            set { SetPropertyValue("ScrollBars", value); }
        }

        /// <summary>
        /// This is required if user choose BalloonStyle to Custom. This specifies the name of the css class for the custom theme
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("customClassName")]
        [DefaultValue("")]
        public string CustomClassName {
            get { return GetPropertyValue("CustomClassName", String.Empty); }
            set { SetPropertyValue("CustomClassName", value); }
        }

        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            if(BalloonStyle == BalloonPopupStyle.Custom) {
                if(CustomCssUrl == String.Empty)
                    throw new ArgumentException("Must pass CustomCssUrl value.");
                if(CustomClassName == String.Empty)
                    throw new ArgumentException("Must pass CustomClassName value.");

                var isLinked = false;
                foreach(Control control in Page.Header.Controls) {
                    if(control.ID == "customCssUrl") {
                        isLinked = true;
                        break;
                    }
                }
                if(!isLinked) {
                    var css = new HtmlLink();
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

#pragma warning restore 1591