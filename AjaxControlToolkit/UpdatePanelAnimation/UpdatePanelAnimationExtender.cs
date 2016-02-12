#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Collections.Generic;

namespace AjaxControlToolkit {

    /// <summary>
    /// UpdatePanelAnimationExtender is an extender that allows you to play animations both while an UpdatePanel
    /// is updating and after its update is finished. The animations to be played are declaratively specified by using XML.
    /// </summary>
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

        /// <summary>
        /// Generic animation played as when any UpdatePanel begins updating
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [ClientPropertyName("onUpdating")]
        public Animation OnUpdating {
            get { return GetAnimation(ref _updating, "OnUpdating"); }
            set { SetAnimation(ref _updating, "OnUpdating", value); }
        }

        /// <summary>
        /// Generic animation played after the UpdatePanel has finished updating
        /// (but only if the UpdatePanel was changed)
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [ClientPropertyName("onUpdated")]
        public Animation OnUpdated {
            get { return GetAnimation(ref _updated, "OnUpdated"); }
            set { SetAnimation(ref _updated, "OnUpdated", value); }
        }

        /// <summary>
        /// An optional property that makes sure the OnUpdated event will fire
        /// only after the onUpdating event is completed
        /// </summary>
        [DefaultValue(false)]
        [Browsable(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("alwaysFinishOnUpdatingAnimation")]
        public bool AlwaysFinishOnUpdatingAnimation {
            get { return GetPropertyValue<bool>("AlwaysFinishOnUpdatingAnimation", false); }
            set { SetPropertyValue("AlwaysFinishOnUpdatingAnimation", value); }
        }

        /// <summary>
        /// ClientID's of the trigger controls
        /// </summary>
        [DefaultValue(null)]
        [Browsable(false)]
        [ExtenderControlProperty(true, true)]
        [ClientPropertyName("triggerControlsClientID")]
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
            foreach(var trigger in targetPanel.Triggers) {
                var asyncTrigger = trigger as AsyncPostBackTrigger;

                if (asyncTrigger == null)
                    continue;

                var triggerControlClientID = FindControl(asyncTrigger.ControlID).ClientID;
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

        /// <summary>
        /// Returns the UpdatePanel, whose updates are used to play animations
        /// (this is also the default target of animations)
        /// </summary>
        /// <returns>Target control</returns>
        public Control GetTargetControl() {
            return TargetControl;
        }

        /// <summary>
        /// Returns the control specified by its ID
        /// </summary>
        /// <param name="id" type="Number">ID of the control</param>
        /// <returns>Found control</returns>
        public Control GetControl(string id) {
            return FindControl(id);
        }
    }

}

#pragma warning restore 1591