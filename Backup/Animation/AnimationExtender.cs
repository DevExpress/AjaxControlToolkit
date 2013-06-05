

using System;
using System.Web.UI;
using System.ComponentModel;
using System.Drawing;

[assembly: System.Web.UI.WebResource("Animation.AnimationBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Animation.AnimationBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// Extender used to play animations when a control's events fire
    /// </summary>
    [Designer("AjaxControlToolkit.AnimationExtenderDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(AnimationScripts))]
    [ClientScriptResource("Sys.Extended.UI.Animation.AnimationBehavior", "Animation.AnimationBehavior.js")]
    [TargetControlType(typeof(Control))]
    [ToolboxItem(Utility.ToolBoxItemTypeName)]
    [ToolboxBitmap(typeof(AnimationExtender), "Animation.Animation.ico")]
    public class AnimationExtender : AnimationExtenderControlBase
    {
        // OnLoad Animation
        private Animation _onLoad;

        // OnClick Animation
        private Animation _onClick;

        // OnMouseOver Animation
        private Animation _onMouseOver;

        // OnMouseOut Animation
        private Animation _onMouseOut;

        // OnHoverOver Animation
        private Animation _onHoverOver;

        // OnHoverOut Animation
        private Animation _onHoverOut;

        /// <summary>
        /// OnLoad Animation
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public new Animation OnLoad
        {
            get { return GetAnimation(ref _onLoad, "OnLoad"); }
            set { SetAnimation(ref _onLoad, "OnLoad", value); }
        }

        /// <summary>
        /// OnClick Animation
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnClick
        {
            get { return GetAnimation(ref _onClick, "OnClick"); }
            set { SetAnimation(ref _onClick, "OnClick", value); }
        }

        /// <summary>
        /// OnMouseOver Animation
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnMouseOver
        {
            get { return GetAnimation(ref _onMouseOver, "OnMouseOver"); }
            set { SetAnimation(ref _onMouseOver, "OnMouseOver", value); }
        }

        /// <summary>
        /// OnMouseOut Animation
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnMouseOut
        {
            get { return GetAnimation(ref _onMouseOut, "OnMouseOut"); }
            set { SetAnimation(ref _onMouseOut, "OnMouseOut", value); }
        }

        /// <summary>
        /// OnHoverOver Animation
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHoverOver
        {
            get { return GetAnimation(ref _onHoverOver, "OnHoverOver"); }
            set { SetAnimation(ref _onHoverOver, "OnHoverOver", value); }
        }

        /// <summary>
        /// OnHoverOut Animation
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHoverOut
        {
            get { return GetAnimation(ref _onHoverOut, "OnHoverOut"); }
            set { SetAnimation(ref _onHoverOut, "OnHoverOut", value); }
        }

        /// <summary>
        /// Change any AnimationTarget references from server control IDs into the ClientIDs
        /// that the animation scripts are expecting.
        /// </summary>
        /// <param name="e">EventArgs</param>
        protected override void OnPreRender(EventArgs e)
        {
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