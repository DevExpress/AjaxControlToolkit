#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    // The PopupExtender is used to show/hide an element at a position
    // relative to another element
    [ClientScriptResource("Sys.Extended.UI.PopupBehavior", Constants.PopupName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(AnimationExtender))]
    [TargetControlType(typeof(WebControl))]
    [TargetControlType(typeof(HtmlControl))]
    [ToolboxItem(false)]
    [Designer(typeof(PopupExtenderDesigner))]
    public class PopupExtender : AnimationExtenderControlBase {
        // Position the target with respect to this element
        [ExtenderControlProperty]
        [IDReferenceProperty]
        [RequiredProperty]
        [ClientPropertyName("parentElement")]
        [ElementReference]
        public string ParentElementID {
            get { return GetPropertyValue("ParentElementID", ""); }
            set { SetPropertyValue("ParentElementID", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("x")]
        [DefaultValue(0)]
        public int X {
            get { return GetPropertyValue("X", 0); }
            set { SetPropertyValue("X", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("y")]
        [DefaultValue(0)]
        public int Y {
            get { return GetPropertyValue("Y", 0); }
            set { SetPropertyValue("Y", value); }
        }

        // Positioning mode
        [ExtenderControlProperty]
        [ClientPropertyName("positioningMode")]
        [DefaultValue(PositioningMode.Absolute)]
        public PositioningMode PositioningMode {
            get { return GetPropertyValue("PositioningMode", PositioningMode.Absolute); }
            set { SetPropertyValue("PositioningMode", value); }
        }

        // TODO: Does this property exist on the client?
        [ExtenderControlProperty]
        [ClientPropertyName("reparent")]
        [DefaultValue(false)]
        public bool Reparent {
            get { return GetPropertyValue("Reparent", false); }
            set { SetPropertyValue("Reparent", value); }
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
#pragma warning restore 1591