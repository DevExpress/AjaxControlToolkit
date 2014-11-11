using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [ClientScriptResource("Sys.Extended.UI.BalloonPopupControlBehavior", Constants.BalloonPopupName)]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(Control))]
    [ClientCssResource(Constants.BalloonPopupName + ".Cloud")]
    [ClientCssResource(Constants.BalloonPopupName + ".Rectangle")]
    [Designer(typeof(BalloonPopupExtenderDesigner))]
    [ToolboxItem("System.Web.UI.Design.WebControlToolboxItem, System.Design, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a")]
    [ToolboxBitmap(typeof(BalloonPopupExtender), Constants.BalloonPopupName + Constants.IconPostfix)]
    public class BalloonPopupExtender : DynamicPopulateExtenderControlBase {
        Animation _onHide;
        Animation _onShow;

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public string ExtenderControlID {
            get { return GetPropertyValue("ExtenderControlID", String.Empty); }
            set { SetPropertyValue("ExtenderControlID", value); }
        }

        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [RequiredProperty]
        [DefaultValue("")]
        public string BalloonPopupControlID {
            get { return GetPropertyValue("BalloonPopupControlID", String.Empty); }
            set { SetPropertyValue("BalloonPopupControlID", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(BalloonPopupPosition.Auto)]
        [ClientPropertyName("balloonPopupPosition")]
        public BalloonPopupPosition Position { get; set; }

        [ExtenderControlProperty]
        [DefaultValue(BalloonPopupStyle.Rectangle)]
        [ClientPropertyName("balloonPopupStyle")]
        public BalloonPopupStyle BalloonStyle { get; set; }

        // Optional X (horizontal) offset for the popup window (relative to the target control)
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int OffsetX {
            get { return GetPropertyValue("OffsetX", 0); }
            set { SetPropertyValue("OffsetX", value); }
        }

        // Optional Y (vertical) offset for the popup window (relative to the target control)
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int OffsetY {
            get { return GetPropertyValue("OffsetY", 0); }
            set { SetPropertyValue("OffsetY", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("onShow")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnShow {
            get { return GetAnimation(ref _onShow, "OnShow"); }
            set { SetAnimation(ref _onShow, "OnShow", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("onHide")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHide {
            get { return GetAnimation(ref _onHide, "OnHide"); }
            set { SetAnimation(ref _onHide, "OnHide", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("displayOnMouseOver")]
        [DefaultValue(false)]
        public bool DisplayOnMouseOver {
            get { return GetPropertyValue("DisplayOnMouseOver", false); }
            set { SetPropertyValue("DisplayOnMouseOver", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("displayOnFocus")]
        [DefaultValue(false)]
        public bool DisplayOnFocus {
            get { return GetPropertyValue("DisplayOnFocus", false); }
            set { SetPropertyValue("DisplayOnFocus", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("displayOnClick")]
        [DefaultValue(true)]
        public bool DisplayOnClick {
            get { return GetPropertyValue("DisplayOnClick", true); }
            set { SetPropertyValue("DisplayOnClick", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("balloonSize")]
        [DefaultValue(BalloonPopupSize.Small)]
        public BalloonPopupSize BalloonSize {
            get { return GetPropertyValue("BalloonSize", BalloonPopupSize.Small); }
            set { SetPropertyValue("BalloonSize", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("useShadow")]
        [DefaultValue(true)]
        public bool UseShadow {
            get { return GetPropertyValue("UseShadow", true); }
            set { SetPropertyValue("UseShadow", value); }
        }

        [DefaultValue("")]
        public string CustomCssUrl { get; set; }

        [DefaultValue(ScrollBars.Auto)]
        [Category("Behavior")]
        [ClientPropertyName("scrollBars")]
        [Description("Scroll bars behavior when content is overflow")]
        [ExtenderControlProperty]
        public ScrollBars ScrollBars {
            get { return GetPropertyValue("ScrollBars", ScrollBars.Auto); }
            set { SetPropertyValue("ScrollBars", value); }
        }

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
