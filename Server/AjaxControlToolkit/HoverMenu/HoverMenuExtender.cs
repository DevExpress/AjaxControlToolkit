

using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: System.Web.UI.WebResource("HoverMenu.HoverMenuBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("HoverMenu.HoverMenuBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// Extender class for associating the HoverMenu behavior with a server element.
    /// The HoverMenuExtender allows a control to be shown as a popup next to another
    /// control when the mouse pointer is moved over it.  This popup control can have
    /// any server content in it.
    /// </summary>
    [ClientScriptResource("Sys.Extended.UI.HoverMenuBehavior", "HoverMenu.HoverMenuBehavior.js")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(HoverExtender))]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(AnimationExtender))]
    [TargetControlType(typeof(Control))]
    [ToolboxItem(Utility.ToolBoxItemTypeName)]
    [ToolboxBitmap(typeof(HoverMenuExtender), "HoverMenu.HoverMenu.ico")]
    [Designer("AjaxControlToolkit.HoverMenuDesigner, AjaxControlToolkit")]
    public class HoverMenuExtender : DynamicPopulateExtenderControlBase
    {
        /// <summary>
        /// The server ID of the control that will be displayed when the mouse hovers
        /// over the target element.
        /// </summary>
        [ExtenderControlProperty]
        [RequiredProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [ElementReference]
        [DefaultValue("")]
        [ClientPropertyName("popupElement")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string PopupControlID
        {
            get { return GetPropertyValue("PopupControlID", ""); }
            set { SetPropertyValue("PopupControlID", value); }
        }

        /// <summary>
        /// The CSS class to apply to the target element when the mouse is over it or
        /// the popup element.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string HoverCssClass
        {
            get { return GetPropertyValue("HoverCssClass", ""); }
            set { SetPropertyValue("HoverCssClass", value); }
        }

        /// <summary>
        /// The additional offset to apply between the target element and the popup
        /// element when it is displayed.  By default, the elements will be positioned
        /// with no space between them.  By specifying a value here, that amount of
        /// space, in pixels, will be added to the positioning.  The number can be
        /// negative to cause an overlap.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int OffsetX
        {
            get { return GetPropertyValue("OffsetX", 0); }
            set { SetPropertyValue("OffsetX", value); }
        }

        /// <summary>
        /// The additional offset to apply between the target element and the popup
        /// element when it is displayed.  By default, the elements will be positioned
        /// with no space between them.  By specifying a value here, that amount of
        /// space, in pixels, will be added to the positioning.  The number can be
        /// negative to cause an overlap.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int OffsetY
        {
            get { return GetPropertyValue("OffsetY", 0); }
            set { SetPropertyValue("OffsetY", value); }
        }

        /// <summary>
        /// The time, in milliseconds between then the mouse pointer exits the target
        /// element and when the popup element is hidden.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int PopDelay
        {
            get { return GetPropertyValue("PopDelay", 0); }
            set { SetPropertyValue("PopDelay", value); }
        }

        /// <summary>
        /// The time, in milliseconds, before the popup displays after hovering over the TargetControl
        /// </summary>
        [DefaultValue(0)]
        [ExtenderControlProperty()]
        public int HoverDelay
        {
            get { return GetPropertyValue("HoverDelay", 0); }
            set { SetPropertyValue("HoverDelay", value); }
        }

        /// <summary>
        /// The position of the popup element when it is shown.  This value can be any
        /// of the values in the HoverMenuPopupPosition enumeration, and the position
        /// can be modified by setting the OffsetX and/or OffsetY property.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(HoverMenuPopupPosition.Center)]
        public HoverMenuPopupPosition PopupPosition
        {
            get { return GetPropertyValue("Position", HoverMenuPopupPosition.Center); }
            set { SetPropertyValue("Position", value); }
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
        private Animation _onShow;

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
        private Animation _onHide;

        /// <summary>
        /// Convert server IDs into ClientIDs for animations
        /// </summary>
        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);

            ResolveControlIDs(_onShow);
            ResolveControlIDs(_onHide);
        }
    }
}