

using System;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Diagnostics.CodeAnalysis;
using System.Drawing.Design;
using System.Web.UI;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Extender that provides support for generic animations.  It includes an Animations
    /// property that will be filled with the markup for all of its child Animations.
    /// </summary>
    [ParseChildren(true)]
    [PersistChildren(false)]
    [DefaultProperty("Animations")]
    [ToolboxItem(false)]
    public class AnimationExtenderControlBase : ExtenderControlBase
    {
        // Animation descriptions
        private string _animations;

        /// <summary>
        /// Sequence of animation descriptions
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        [Editor(typeof(MultilineStringEditor), typeof(UITypeEditor))]
        [TypeConverter(typeof(MultilineStringConverter))]
        [ExtenderControlProperty()]
        public string Animations
        {
            get { return _animations ?? string.Empty; }
            set
            {
                if (value != null)
                    value = TrimForDesigner(value);
                if (_animations != value)
                {
                    _animations = value;
                    Animation.Parse(_animations, this);
                }
            }
        }
        
        /// <summary>
        /// We have to trim the Animations string that we expose in the designer
        /// or else it will end up inserting a new blank line at the top of the
        /// string every time we make a change.  However, we only want to trim the
        /// blank lines off the top and leave any other leading whitespace on the
        /// line with the first content.  For an example of what happens if we
        /// don't do this, change the XmlDataSource.Data property in the designer.
        /// </summary>
        /// <param name="value">String to trim</param>
        /// <returns>Trimmed string</returns>
        private static string TrimForDesigner(string value)
        {
            if (string.IsNullOrEmpty(value))
                return value;

            // Get the index of the first non-whitespace character
            int i;
            for (i = 0; i < value.Length; i++)
                if (!Char.IsWhiteSpace(value[i]))
                    break;

            // Remove any lines of just whitespace from the top
            i = value.LastIndexOf('\n', i);
            if (i >= 0)
                value = value.Substring(i + 1);

            // Trim anything else off the bottom
            return value.TrimEnd();
        }

        /// <summary>
        /// This will prevent serializing the Animations property to the Xml-Script
        /// </summary>
        /// <returns>True when we have content in DesignMode, false otherwise</returns>
        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeAnimations()
        {
            if (DesignMode)
                return !string.IsNullOrEmpty(_animations);
            return false;
        }

        /// <summary>
        /// Get an animation (which is a helper for Animation properties in other extenders)
        /// </summary>
        /// <param name="animation">Animation instance</param>
        /// <param name="name">Name of the property</param>
        /// <returns>Animation instance</returns>
        [SuppressMessage("Microsoft.Design", "CA1045:DoNotPassTypesByReference", Justification = "Passing by reference prevents copying this code for each animation")]
        protected Animation GetAnimation(ref Animation animation, string name)
        {
            if (animation == null)
                animation = Animation.Deserialize(GetPropertyValue(name, ""));
            return animation;
        }

        /// <summary>
        /// Set an animation (which is a helper for Animation properties in other extenders)
        /// </summary>
        /// <param name="animation">Animation instance</param>
        /// <param name="name">Name of the property</param>
        /// <param name="value">New value</param>
        [SuppressMessage("Microsoft.Design", "CA1045:DoNotPassTypesByReference", Justification = "Passing by reference prevents copying this code for each animation")]
        protected void SetAnimation(ref Animation animation, string name, Animation value)
        {
            animation = value;
            SetPropertyValue(name,
                animation != null ? animation.ToString() : string.Empty);
        }

        /// <summary>
        /// Change any AnimationTarget references from server control IDs into the ClientIDs
        /// that the animation scripts are expecting.
        /// </summary>
        /// <param name="animation">Animation</param>
        [SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "IDs", Justification="ASP.NET convention")]
        protected void ResolveControlIDs(Animation animation)
        {
            if (animation == null)
            {
                return;
            }

            // See if the animation had a target
            string id;
            if (animation.Properties.TryGetValue("AnimationTarget", out id) && !string.IsNullOrEmpty(id))
            {
                // Try to find a control with the target's id by walking up the NamingContainer tree
                Control control = null;
                Control container = NamingContainer;
                while ((container != null) && ((control = container.FindControl(id)) == null))
                {
                    container = container.Parent;
                }

                // If we found a control
                if (control != null)
                {
                    // Map the server ID to the client ID
                    animation.Properties["AnimationTarget"] = control.ClientID;
                }
            }

            // Resolve any server control IDs in the animation's children
            foreach (Animation child in animation.Children)
            {
                ResolveControlIDs(child);
            }
        }
    }
}