using System;
using System.Web.UI;
using System.ComponentModel;
using System.Drawing;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit {

    // Extender used to play animations when a control's events fire
    [Designer(typeof(AnimationExtenderDesigner))]
    [RequiredScript(typeof(AnimationScripts))]
    [ClientScriptResource("Sys.Extended.UI.Animation.AnimationBehavior", Constants.AnimationName)]
    [TargetControlType(typeof(Control))]
    [ToolboxItem("System.Web.UI.Design.WebControlToolboxItem, System.Design, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a")]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.AnimationName + Constants.IconPostfix)]
    public class AnimationExtender : AnimationExtenderControlBase {
        Animation _onLoad;
        Animation _onClick;
        Animation _onMouseOver;
        Animation _onMouseOut;
        Animation _onHoverOver;
        Animation _onHoverOut;

        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public new Animation OnLoad {
            get { return GetAnimation(ref _onLoad, "OnLoad"); }
            set { SetAnimation(ref _onLoad, "OnLoad", value); }
        }

        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnClick {
            get { return GetAnimation(ref _onClick, "OnClick"); }
            set { SetAnimation(ref _onClick, "OnClick", value); }
        }

        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnMouseOver {
            get { return GetAnimation(ref _onMouseOver, "OnMouseOver"); }
            set { SetAnimation(ref _onMouseOver, "OnMouseOver", value); }
        }

        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnMouseOut {
            get { return GetAnimation(ref _onMouseOut, "OnMouseOut"); }
            set { SetAnimation(ref _onMouseOut, "OnMouseOut", value); }
        }

        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHoverOver {
            get { return GetAnimation(ref _onHoverOver, "OnHoverOver"); }
            set { SetAnimation(ref _onHoverOver, "OnHoverOver", value); }
        }

        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHoverOut {
            get { return GetAnimation(ref _onHoverOut, "OnHoverOut"); }
            set { SetAnimation(ref _onHoverOut, "OnHoverOut", value); }
        }

        // Change any AnimationTarget references from server control IDs into the ClientIDs
        // that the animation scripts are expecting.
        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            ResolveControlIDs(_onLoad);
            ResolveControlIDs(_onClick);
            ResolveControlIDs(_onMouseOver);
            ResolveControlIDs(_onMouseOut);
            ResolveControlIDs(_onHoverOver);
            ResolveControlIDs(_onHoverOut);
        }
    }

}
