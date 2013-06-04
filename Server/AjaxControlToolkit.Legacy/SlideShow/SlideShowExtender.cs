

using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Drawing.Design;


#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("SlideShow.SlideShowBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("SlideShow.SlideShowBehavior.debug.js", "text/javascript")]
#endregion

namespace AjaxControlToolkit
{
    /// <summary>
    /// 
    /// </summary>
    [Designer("AjaxControlToolkit.SlideShowDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.SlideShowBehavior", "SlideShow.SlideShowBehavior.js")]
    [TargetControlType(typeof(Image))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(TimerScript))]
    [System.Drawing.ToolboxBitmap(typeof(SlideShowExtender), "SlideShow.SlideShow.ico")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "SlideShow", Justification = "Avoiding a breaking change")]
    public class SlideShowExtender : ExtenderControlBase
    {
        /// <summary>
        /// The webservice method that will be called to supply images. 
        /// </summary>
        [ExtenderControlProperty]
        [RequiredProperty]
        [DefaultValue("")]
        [ClientPropertyName("slideShowServiceMethod")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "SlideShow", Justification = "Avoiding a breaking change")]
        public string SlideShowServiceMethod
        {
            get { return GetPropertyValue("SlideShowServiceMethod", ""); }
            set { SetPropertyValue("SlideShowServiceMethod", value); }
        }

        /// <summary>
        /// Path to the webservice that the extender will pull the images from.
        /// </summary>
        [UrlProperty()]
        [ExtenderControlProperty()]
        [TypeConverter(typeof(ServicePathConverter))]
        [ClientPropertyName("slideShowServicePath")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "SlideShow", Justification = "Avoiding a breaking change")]
        public string SlideShowServicePath
        {
            get { return GetPropertyValue("SlideShowServicePath", ""); }
            set { SetPropertyValue("SlideShowServicePath", value); }
        }

        /// <summary>
        /// User/page specific context provided to an optional overload of the
        /// web method described by ServiceMethod/ServicePath.  If the context
        /// key is used, it should have the same signature with an additional
        /// parameter named contextKey of type string.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("contextKey")]
        [DefaultValue(null)]
        public string ContextKey
        {
            get { return GetPropertyValue<string>("ContextKey", null); }
            set
            {
                SetPropertyValue<string>("ContextKey", value);
                UseContextKey = true;
            }
        }

        /// <summary>
        /// Whether or not the ContextKey property should be used.  This will be
        /// automatically enabled if the ContextKey property is ever set
        /// (on either the client or the server).  If the context key is used,
        /// it should have the same signature with an additional parameter
        /// named contextKey of type string.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("useContextKey")]
        [DefaultValue(false)]
        public bool UseContextKey
        {
            get { return GetPropertyValue<bool>("UseContextKey", false); }
            set { SetPropertyValue<bool>("UseContextKey", value); }
        }

        /// <summary>
        /// ID of the control that will move the slide show to the next slide.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(WebControl))]
        [ClientPropertyName("nextButtonID")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string NextButtonID
        {
            get { return GetPropertyValue("NextButtonID", ""); }
            set { SetPropertyValue("NextButtonID", value); }
        }

        /// <summary>
        /// ID of the control that will play the slide show.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(WebControl))]
        [ClientPropertyName("playButtonID")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string PlayButtonID
        {
            get { return GetPropertyValue("PlayButtonID", ""); }
            set { SetPropertyValue("PlayButtonID", value); }
        }

        /// <summary>
        /// Text to display in the play button if the slide show is not playing.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("playButtonText")]
        public string PlayButtonText
        {
            get { return GetPropertyValue("PlayButtonText", ""); }
            set { SetPropertyValue("PlayButtonText", value); }
        }

        /// <summary>
        /// Text to display in the play button if the slide show is in play mode.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("stopButtonText")]
        public string StopButtonText
        {
            get { return GetPropertyValue("StopButtonText", ""); }
            set { SetPropertyValue("StopButtonText", value); }
        }

        /// <summary>
        /// Interval in milliseconds before switching to the next slide is playing.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(3000)]
        [ClientPropertyName("playInterval")]
        public int PlayInterval
        {
            get { return GetPropertyValue("PlayInterval", 3000); }
            set { SetPropertyValue("PlayInterval", value); }
        }

        /// <summary>
        /// ID of the label that will display the current slide's title.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(WebControl))]
        [ClientPropertyName("imageTitleLabelID")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string ImageTitleLabelID
        {
            get { return GetPropertyValue("ImageTitleLabelID", ""); }
            set { SetPropertyValue("ImageTitleLabelID", value); }
        }

        /// <summary>
        /// ID of the label that will display the current slide's description.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(WebControl))]
        [ClientPropertyName("imageDescriptionLabelID")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string ImageDescriptionLabelID
        {
            get { return GetPropertyValue("ImageDescriptionLabelID", ""); }
            set { SetPropertyValue("ImageDescriptionLabelID", value); }
        }

        /// <summary>
        /// ID of the control that will move the slide show to the previous slide.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(WebControl))]
        [ClientPropertyName("previousButtonID")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string PreviousButtonID
        {
            get { return GetPropertyValue("PreviousButtonID", ""); }
            set { SetPropertyValue("PreviousButtonID", value); }
        }

        /// <summary>
        /// Boolean to determine if the slide show loops around if you hit the first or last slide.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("loop")]
        public bool Loop
        {
            get { return GetPropertyValue("Loop", false); }
            set { SetPropertyValue("Loop", value); }
        }
        
        /// <summary>
        /// Boolean to determine if the slide show will play automatically on render.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("autoPlay")]
        public bool AutoPlay
        {
            get { return GetPropertyValue("AutoPlay", false); }
            set { SetPropertyValue("AutoPlay", value); }
        }
    }
}