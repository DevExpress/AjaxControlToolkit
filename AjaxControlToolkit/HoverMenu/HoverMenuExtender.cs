#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    // Extender class for associating the HoverMenu behavior with a server element.
    // The HoverMenuExtender allows a control to be shown as a popup next to another
    // control when the mouse pointer is moved over it.  This popup control can have
    // any server content in it.

    /// <summary>
    /// HoverMenu is an ASP.NET AJAX Control Toolkit extender that can be attached to any 
    /// ASP.NET WebControl and associates that control with a popup panel to display additional content.
    /// </summary>
    [ClientScriptResource("Sys.Extended.UI.HoverMenuBehavior", Constants.HoverMenuName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(HoverExtender))]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(AnimationExtender))]
    [TargetControlType(typeof(WebControl))]
    [TargetControlType(typeof(HtmlControl))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.HoverMenuName + Constants.IconPostfix)]
    [Designer(typeof(HoverMenuExtenderDesigner))]
    public class HoverMenuExtender : DynamicPopulateExtenderControlBase {
        /// <summary>
        /// A control's ID to display when the mouse is over the target control. 
        /// </summary>
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

        /// <summary>
        /// A CSS class to apply to the target when the hover menu popup is visible
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("hoverCssClass")]
        public string HoverCssClass {
            get { return GetPropertyValue("HoverCssClass", String.Empty); }
            set { SetPropertyValue("HoverCssClass", value); }
        }

        // The additional offset to apply between the target element and the popup
        // element when it is displayed.  By default, the elements will be positioned
        // with no space between them.  By specifying a value here, that amount of
        // space, in pixels, will be added to the positioning.  The number can be
        // negative to cause an overlap.

        /// <summary>
        /// The number of pixels to offset the popup from its default position as specified by PopupPosition. Default is 0 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        [ClientPropertyName("offsetX")]
        public int OffsetX {
            get { return GetPropertyValue("OffsetX", 0); }
            set { SetPropertyValue("OffsetX", value); }
        }

        // The additional offset to apply between the target element and the popup
        // element when it is displayed.  By default, the elements will be positioned
        // with no space between them.  By specifying a value here, that amount of
        // space, in pixels, will be added to the positioning.  The number can be
        // negative to cause an overlap.

        /// <summary>
        /// The number of pixels to offset the popup from its default position as specified by PopupPosition. Default is 0 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        [ClientPropertyName("offsetY")]
        public int OffsetY {
            get { return GetPropertyValue("OffsetY", 0); }
            set { SetPropertyValue("OffsetY", value); }
        }

        /// <summary>
        ///  Time in milliseconds for the popup to remain visible after the mouse moves away from the target control. 
        /// </summary>
        /// <remarks>
        /// Default is 0.
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        [ClientPropertyName("popDelay")]
        public int PopDelay {
            get { return GetPropertyValue("PopDelay", 0); }
            set { SetPropertyValue("PopDelay", value); }
        }

        /// <summary>
        /// Time in milliseconds before the popup is displayed after hovering over the target control. 
        /// </summary>
        /// <remarks>
        /// Default is 0.
        /// </remarks>
        [DefaultValue(0)]
        [ExtenderControlProperty()]
        [ClientPropertyName("hoverDelay")]
        public int HoverDelay {
            get { return GetPropertyValue("HoverDelay", 0); }
            set { SetPropertyValue("HoverDelay", value); }
        }

        /// <summary>
        /// The popup element position when it is shown. 
        /// </summary>
        /// <remarks>
        /// This can be any value from the HoverMenuPopupPosition enumeration, 
        /// and the position can be modified by setting the OffsetX and/or OffsetY properties. 
        /// Can be Left, Right, Top, Bottom, Center. Center is default. 
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue(HoverMenuPopupPosition.Center)]
        [ClientPropertyName("popupPosition")]
        public HoverMenuPopupPosition PopupPosition {
            get { return GetPropertyValue("Position", HoverMenuPopupPosition.Center); }
            set { SetPropertyValue("Position", value); }
        }

        /// <summary>
        /// OnShow animation will be played each time the hover menu is displayed. 
        /// </summary>
        /// <remarks>
        ///  The hover menu will be positioned correctly but hidden. Animation can be used to display the hover menu with other visual effects.
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
        Animation _onShow;

        /// <summary>
        /// OnHide animation will be played each time the hover menu is hidden. 
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
        Animation _onHide;

        // Convert server IDs into ClientIDs for animations
        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            ResolveControlIDs(_onShow);
            ResolveControlIDs(_onHide);
        }
    }

}

#pragma warning restore 1591