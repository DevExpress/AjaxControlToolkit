

using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Globalization;

[assembly: System.Web.UI.WebResource("Accordion.AccordionBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Accordion.AccordionBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// Given a proper hierarchy of elements (see AccordionBehavior.js for details),
    /// turn it into an Accordion
    /// </summary>
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(AnimationScripts))]
    [ClientScriptResource("Sys.Extended.UI.AccordionBehavior", "Accordion.AccordionBehavior.js")]
    [ToolboxItem(false)]
    [Designer("AjaxControlToolkit.AccordionExtenderDesigner, AjaxControlToolkit")]
    [TargetControlType(typeof(Accordion))]
    public class AccordionExtender : ExtenderControlBase
    {
        /// <summary>
        /// Enable ClientState
        /// </summary>
        public AccordionExtender()
        {
            EnableClientState = true;
        }

        /// <summary>
        /// Determine how growth of the Accordion will be controlled.  If it is set to
        /// None, then the Accordion can grow as large or as small as necessary.  If it is
        /// set to Limit, then the Accordion will always be less than or equal to its
        /// Height.  If it is set to Fill then it will always be equal to its height.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(AutoSize.None)]
        public AutoSize AutoSize
        {
            get { return GetPropertyValue<AutoSize>("AutoSize", AutoSize.None); }
            set { SetPropertyValue<AutoSize>("AutoSize", value); }
        }

        /// <summary>
        /// Length of transition between accordion panes in milliseconds
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(250)]
        public int TransitionDuration
        {
            get { return GetPropertyValue<int>("TransitionDuration", 250); }
            set { SetPropertyValue("TransitionDuration", value); }
        }

        /// <summary>
        /// Whether or not to use a fade effect when transitioning between selected
        /// Accordion Panes
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        public bool FadeTransitions
        {
            get { return GetPropertyValue<bool>("FadeTransitions", false); }
            set { SetPropertyValue("FadeTransitions", value); }
        }

        /// <summary>
        /// The number of frames per second used in the transition animation effects.
        /// This is used to tune performance when using FadeTransition, a large number
        /// of Accordion Panes, etc.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(30)]
        public int FramesPerSecond
        {
            get { return GetPropertyValue<int>("FramesPerSecond", 30); }
            set { SetPropertyValue<int>("FramesPerSecond", value); }
        }

        /// <summary>
        /// Index of the AccordionPane that is currently selected for display
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int SelectedIndex
        {
            get
            {
                int index;
                return (!string.IsNullOrEmpty(ClientState) && int.TryParse(ClientState, NumberStyles.Integer, CultureInfo.InvariantCulture, out index)) ? index : 0;
            }
            set { ClientState = value.ToString(CultureInfo.InvariantCulture); }
        }

        /// <summary>
        /// Whether or not clicking the header will close the currently opened pane (which leaves
        /// all the Accordion's panes closed)
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("requireOpenedPane")]
        public bool RequireOpenedPane
        {
            get { return GetPropertyValue<bool>("RequireOpenedPane", true); }
            set { SetPropertyValue("RequireOpenedPane", value); }
        }

        /// <summary>
        /// Whether or not we suppress the client-side click handlers of any elements (including server
        /// controls like Button or HTML elements like anchor) in the header sections of the Accordion.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("suppressHeaderPostbacks")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Postbacks", Justification = "ASP.NET term")]
        public bool SuppressHeaderPostbacks
        {
            get { return GetPropertyValue<bool>("SuppressHeaderPostbacks", false); }
            set { SetPropertyValue("SuppressHeaderPostbacks", value); }
        }

        /// <summary>
        /// Default Header CSS Class
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string HeaderCssClass
        {
            get { return GetPropertyValue<String>("HeaderCssClass", String.Empty); }
            set { SetPropertyValue<String>("HeaderCssClass", value); }
        }

        /// <summary>
        /// Default selected Header CSS Class
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string HeaderSelectedCssClass
        {
            get { return GetPropertyValue<String>("HeaderSelectedCssClass", String.Empty); }
            set { SetPropertyValue<String>("HeaderSelectedCssClass", value); }
        }

        /// <summary>
        /// Default Content CSS Class
        /// </summary>
        [DefaultValue("")]
        public string ContentCssClass
        {
            get { return GetPropertyValue<String>("ContentCssClass", String.Empty); }
            set { SetPropertyValue<String>("ContentCssClass", value); }
        }
    }
}