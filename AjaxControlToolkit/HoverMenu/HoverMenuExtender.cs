using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    // Extender class for associating the HoverMenu behavior with a server element.
    // The HoverMenuExtender allows a control to be shown as a popup next to another
    // control when the mouse pointer is moved over it.  This popup control can have
    // any server content in it.
    [ClientScriptResource("Sys.Extended.UI.HoverMenuBehavior", Constants.HoverMenuName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(HoverExtender))]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(AnimationExtender))]
    [TargetControlType(typeof(Control))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.HoverMenuName + Constants.IconPostfix)]
    [Designer(typeof(HoverMenuExtenderDesigner))]
    public class HoverMenuExtender : DynamicPopulateExtenderControlBase {
        [ExtenderControlProperty]
        [RequiredProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [ElementReference]
        [DefaultValue("")]
        [ClientPropertyName("popupElement")]
        public string PopupControlID {
            get { return GetPropertyValue("PopupControlID", String.Empty); }
            set { SetPropertyValue("PopupControlID", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue("")]
        public string HoverCssClass {
            get { return GetPropertyValue("HoverCssClass", String.Empty); }
            set { SetPropertyValue("HoverCssClass", value); }
        }

        // The additional offset to apply between the target element and the popup
        // element when it is displayed.  By default, the elements will be positioned
        // with no space between them.  By specifying a value here, that amount of
        // space, in pixels, will be added to the positioning.  The number can be
        // negative to cause an overlap.
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int OffsetX {
            get { return GetPropertyValue("OffsetX", 0); }
            set { SetPropertyValue("OffsetX", value); }
        }

        // The additional offset to apply between the target element and the popup
        // element when it is displayed.  By default, the elements will be positioned
        // with no space between them.  By specifying a value here, that amount of
        // space, in pixels, will be added to the positioning.  The number can be
        // negative to cause an overlap.
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int OffsetY {
            get { return GetPropertyValue("OffsetY", 0); }
            set { SetPropertyValue("OffsetY", value); }
        }

        // The time, in milliseconds between then the mouse pointer exits the target
        // element and when the popup element is hidden.
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int PopDelay {
            get { return GetPropertyValue("PopDelay", 0); }
            set { SetPropertyValue("PopDelay", value); }
        }

        // The time, in milliseconds, before the popup displays after hovering over the TargetControl
        [DefaultValue(0)]
        [ExtenderControlProperty()]
        public int HoverDelay {
            get { return GetPropertyValue("HoverDelay", 0); }
            set { SetPropertyValue("HoverDelay", value); }
        }

        // The position of the popup element when it is shown.  This value can be any
        // of the values in the HoverMenuPopupPosition enumeration, and the position
        // can be modified by setting the OffsetX and/or OffsetY property.
        [ExtenderControlProperty]
        [DefaultValue(HoverMenuPopupPosition.Center)]
        public HoverMenuPopupPosition PopupPosition {
            get { return GetPropertyValue("Position", HoverMenuPopupPosition.Center); }
            set { SetPropertyValue("Position", value); }
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
        Animation _onShow;

        [ExtenderControlProperty]
        [ClientPropertyName("onHide")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHide {
            get { return GetAnimation(ref _onHide, "OnHide"); }
            set { SetAnimation(ref _onHide, "OnHide", value); }
        }
        Animation _onHide;

        // Convert server IDs into ClientIDs for animations
        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            ResolveControlIDs(_onShow);
            ResolveControlIDs(_onHide);
        }
    }

}
