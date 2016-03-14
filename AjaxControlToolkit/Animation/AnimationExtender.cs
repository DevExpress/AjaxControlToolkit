#pragma warning disable 1591
using System;
using System.Web.UI;
using System.ComponentModel;
using System.Drawing;
using AjaxControlToolkit.Design;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// An extender used to play animations when a control's events fire.
    /// </summary>
    [Designer(typeof(AnimationExtenderDesigner))]
    [RequiredScript(typeof(AnimationScripts))]
    [ClientScriptResource("Sys.Extended.UI.Animation.AnimationBehavior", Constants.AnimationName)]
    [TargetControlType(typeof(WebControl))]
    [TargetControlType(typeof(HtmlControl))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.AnimationName + Constants.IconPostfix)]
    public class AnimationExtender : AnimationExtenderControlBase {
        Animation _onLoad;
        Animation _onClick;
        Animation _onMouseOver;
        Animation _onMouseOut;
        Animation _onHoverOver;
        Animation _onHoverOut;

        /// <summary>
        /// OnLoad animation
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [ClientPropertyName("onLoad")]
        public new Animation OnLoad {
            get { return GetAnimation(ref _onLoad, "OnLoad"); }
            set { SetAnimation(ref _onLoad, "OnLoad", value); }
        }

        /// <summary>
        /// OnClick animation
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [ClientPropertyName("onClick")]
        public Animation OnClick {
            get { return GetAnimation(ref _onClick, "OnClick"); }
            set { SetAnimation(ref _onClick, "OnClick", value); }
        }

        /// <summary>
        /// OnMouseOver animation
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [ClientPropertyName("onMouseOver")]
        public Animation OnMouseOver {
            get { return GetAnimation(ref _onMouseOver, "OnMouseOver"); }
            set { SetAnimation(ref _onMouseOver, "OnMouseOver", value); }
        }

        /// <summary>
        /// OnMouseOut animation
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [ClientPropertyName("onMouseOut")]
        public Animation OnMouseOut {
            get { return GetAnimation(ref _onMouseOut, "OnMouseOut"); }
            set { SetAnimation(ref _onMouseOut, "OnMouseOut", value); }
        }

        /// <summary>
        /// OnHoverOver animation
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [ClientPropertyName("onHoverOver")]
        public Animation OnHoverOver {
            get { return GetAnimation(ref _onHoverOver, "OnHoverOver"); }
            set { SetAnimation(ref _onHoverOver, "OnHoverOver", value); }
        }

        /// <summary>
        /// OnHoverOut animation
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [ClientPropertyName("onHoverOut")]
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

#pragma warning restore 1591