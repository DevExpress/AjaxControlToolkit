

using System;
using System.ComponentModel;
using System.Web.UI;

[assembly: System.Web.UI.WebResource("PopupExtender.PopupBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("PopupExtender.PopupBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// The PopupExtender is used to show/hide an element at a position
    /// relative to another element
    /// </summary>
    [ClientScriptResource("Sys.Extended.UI.PopupBehavior", "PopupExtender.PopupBehavior.js")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(AnimationExtender))]
    [TargetControlType(typeof(Control))]
    [Designer("AjaxControlToolkit.PopupExtenderDesigner, AjaxControlToolkit")]
    public class PopupExtender : AnimationExtenderControlBase
    {
        /// <summary>
        /// Position the target with respect to this element
        /// </summary>
        [ExtenderControlProperty]
        [IDReferenceProperty]
        [RequiredProperty]
        [ClientPropertyName("parentElement")]
        [ElementReference]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string ParentElementID
        {
            get { return GetPropertyValue("ParentElementID", ""); }
            set { SetPropertyValue("ParentElementID", value); }
        }

        /// <summary>
        /// X coordinate
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("x")]
        [DefaultValue(0)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "X", Justification = "Common term")]
        public int X
        {
            get { return GetPropertyValue("X", 0); }
            set { SetPropertyValue("X", value); }
        }

        /// <summary>
        /// Y coordinate
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("y")]
        [DefaultValue(0)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Y", Justification = "Common term")]
        public int Y
        {
            get { return GetPropertyValue("Y", 0); }
            set { SetPropertyValue("Y", value); }
        }

        /// <summary>
        /// Positioning mode
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("positioningMode")]
        [DefaultValue(PositioningMode.Absolute)]
        public PositioningMode PositioningMode
        {
            get { return GetPropertyValue("PositioningMode", PositioningMode.Absolute); }
            set { SetPropertyValue("PositioningMode", value); }
        }

// TODO: Does this property exist on the client?
        [ExtenderControlProperty]
        [ClientPropertyName("reparent")]
        [DefaultValue(false)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Reparent", Justification = "Common term")]
        public bool Reparent
        {
            get { return GetPropertyValue("Reparent", false); }
            set { SetPropertyValue("Reparent", value); }
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