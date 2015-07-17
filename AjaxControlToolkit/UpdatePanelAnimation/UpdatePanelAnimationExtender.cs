using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Collections.Generic;

namespace AjaxControlToolkit {

    /// Extender used to play animations just before and after an UpdatePanel updates
    [Designer(typeof(UpdatePanelAnimationExtenderDesigner))]
    [RequiredScript(typeof(CommonToolkitScripts), 0)]
    [RequiredScript(typeof(AnimationScripts), 1)]
    [RequiredScript(typeof(AnimationExtender), 2)]
    [ClientScriptResource("Sys.Extended.UI.Animation.UpdatePanelAnimationBehavior", Constants.UpdatePanelAnimationName)]
    [TargetControlType(typeof(UpdatePanel))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.UpdatePanelAnimationName + Constants.IconPostfix)]
    public class UpdatePanelAnimationExtender : AnimationExtenderControlBase {
        // Animations
        Animation _updating;
        Animation _updated;
        List<string> _triggerControlsClientID = new List<string>();

        // Animation played when an update begins
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnUpdating {
            get { return GetAnimation(ref _updating, "OnUpdating"); }
            set { SetAnimation(ref _updating, "OnUpdating", value); }
        }

        // Animation played when an update completes
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnUpdated {
            get { return GetAnimation(ref _updated, "OnUpdated"); }
            set { SetAnimation(ref _updated, "OnUpdated", value); }
        }

        // Sets a value indicating whether the OnUpdating animation will always be allowed to finish
        // before the OnUpdated animation starts playing.
        [DefaultValue(false)]
        [Browsable(true)]
        [ExtenderControlProperty]
        public bool AlwaysFinishOnUpdatingAnimation {
            get { return GetPropertyValue<bool>("AlwaysFinishOnUpdatingAnimation", false); }
            set { SetPropertyValue("AlwaysFinishOnUpdatingAnimation", value); }
        }

        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty(true, true)]
        public string[] TriggerControlsClientID {
            get { return _triggerControlsClientID.ToArray(); }
        }

        // Change any AnimationTarget references from server control IDs into the ClientIDs
        // that the animation scripts are expecting.  We also replace any static AnimationTargets
        // of the Updated animation with dynamic properties.
        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            ResolveControlIDs(_updating);
            ResolveControlIDs(_updated);
            ReplaceStaticAnimationTargets(_updating);
            ReplaceStaticAnimationTargets(_updated);

            var targetPanel = TargetControl as UpdatePanel;
            var triggers = targetPanel.Triggers;
            foreach(var trigger in triggers) {
                var triggerControlClientID = FindControl((trigger as AsyncPostBackTrigger).ControlID).ClientID;
                _triggerControlsClientID.Add(triggerControlClientID);
            }
        }

        // Replace any statically defined AnimationTarget properties with a corresponding
        // TargetScript dynamic animation property
        void ReplaceStaticAnimationTargets(Animation animation) {
            if(animation == null)
                return;

            // Check if the Animation has an AnimationTarget property, but not AnimationTargetScript
            // or TargetScript properties
            string id;
            string script;

            if((animation.Properties.TryGetValue("AnimationTarget", out id) && !String.IsNullOrEmpty(id)) &&
                (!animation.Properties.TryGetValue("AnimationTargetScript", out script) || String.IsNullOrEmpty(script)) &&
                (!animation.Properties.TryGetValue("TargetScript", out script) || String.IsNullOrEmpty(script))) {
                // Remove the AnimationTarget property and replace it with a dynamic wrapper
                animation.Properties.Remove("AnimationTarget");
                animation.Properties["TargetScript"] = String.Format(CultureInfo.InvariantCulture, "$get('{0}')", id);
            }

            // Replace any static animation targets on this Animation's children
            foreach(Animation child in animation.Children)
                ReplaceStaticAnimationTargets(child);
        }

        public Control GetTargetControl() {
            return TargetControl;
        }

        public Control GetControl(string id) {
            return FindControl(id);
        }
    }

}
