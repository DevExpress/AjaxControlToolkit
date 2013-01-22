

using System;
using System.Text;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;
using AjaxControlToolkit;
using System.Collections;

#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("Slider.SliderBehavior_resource.js", "text/javascript", PerformSubstitution = true)]
[assembly: System.Web.UI.WebResource("Slider.SliderBehavior_resource.debug.js", "text/javascript", PerformSubstitution = true)]
[assembly: System.Web.UI.WebResource("Slider.Slider_resource.css", "text/css", PerformSubstitution = true)]
[assembly: System.Web.UI.WebResource("Slider.Images.slider_h_handle.gif", "img/gif")]
[assembly: System.Web.UI.WebResource("Slider.Images.slider_h_rail.gif", "img/gif")]
[assembly: System.Web.UI.WebResource("Slider.Images.slider_v_handle.gif", "img/gif")]
[assembly: System.Web.UI.WebResource("Slider.Images.slider_v_rail.gif", "img/gif")]
#endregion

namespace AjaxControlToolkit
{
    [Designer("AjaxControlToolkit.SliderDesigner, AjaxControlToolkit")]
    [ClientCssResource("Slider.Slider_resource.css")]
    [ClientScriptResource("Sys.Extended.UI.SliderBehavior", "Slider.SliderBehavior_resource.js")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(DragDropScripts))]
    [RequiredScript(typeof(AnimationScripts))]
    [RequiredScript(typeof(TimerScript))]
    [TargetControlType(typeof(TextBox))]
    [System.Drawing.ToolboxBitmap(typeof(SliderExtender), "Slider.Slider.ico")]
    public class SliderExtender : ExtenderControlBase
    {
        /// <summary>
        ///  Get/Set the minimum value available for input.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public double Minimum
        {
            get { return GetPropertyValue<double>("Minimum", 0); }
            set { SetPropertyValue<double>("Minimum", value); }
        }

        /// <summary>
        /// Get/Set the maximum value available for input.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(100)]
        public double Maximum
        {
            get { return GetPropertyValue<double>("Maximum", 100); }
            set { SetPropertyValue<double>("Maximum", value); }
        }

        /// <summary>
        /// Get/Set the CSS class for the slider's rail element.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string RailCssClass
        {
            get { return GetPropertyValue("RailCssClass", ""); }
            set { SetPropertyValue("RailCssClass", value); }
        }

        /// <summary>
        /// Get/Set the URL for the image to display in the slider's handle.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(""),
#if NET4 || NET45
 Editor("System.Web.UI.Design.ImageUrlEditor, System.Design, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a", typeof(System.Drawing.Design.UITypeEditor)),
#else
         Editor("System.Web.UI.Design.ImageUrlEditor, System.Design, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a", typeof(System.Drawing.Design.UITypeEditor)),
#endif
         UrlProperty,
         System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Following ASP.NET pattern")]
        public string HandleImageUrl
        {
            get { return GetPropertyValue("HandleImageUrl", ""); }
            set { SetPropertyValue("HandleImageUrl", value); }
        }

        /// <summary>
        /// Get/Set the CSS class for the handle element.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string HandleCssClass
        {
            get { return GetPropertyValue("HandleCssClass", ""); }
            set { SetPropertyValue("HandleCssClass", value); }
        }

        /// <summary>
        /// Enable/disable the handle animation played when the user clicks
        /// on the slider's rail.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        public bool EnableHandleAnimation
        {
            get { return GetPropertyValue("EnableHandleAnimation", false); }
            set { SetPropertyValue("EnableHandleAnimation", value); }
        }

        /// <summary>
        /// Get/Set the number of discrete values available for input. The steps are equi-spaced
        /// within the slider's range of values.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int Steps
        {
            get { return GetPropertyValue("Steps", 0); }
            set { SetPropertyValue("Steps", value); }
        }

        /// <summary>
        /// The orientation of the slider. A slider can be rendered horizontally or vertically.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(SliderOrientation.Horizontal)]
        public SliderOrientation Orientation
        {
            get { return GetPropertyValue("Orientation", SliderOrientation.Horizontal); }
            set { SetPropertyValue("Orientation", value); }
        }

        /// <summary>
        /// Get/Set the number of decimal digits in the slider's value. A value 
        /// of 0 means an integer value.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int Decimals
        {
            get { return GetPropertyValue("Decimals", 0); }
            set { SetPropertyValue("Decimals", value); }
        }

        /// <summary>
        /// Get/Set the ID of the server control to which the slider's value is bound.
        /// </summary>
        /// <remarks>
        /// The server control should be a TextBox or Label control.
        /// </remarks>
        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [DefaultValue("")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string BoundControlID
        {
            get { return GetPropertyValue("BoundControlID", ""); }
            set { SetPropertyValue("BoundControlID", value); }
        }

        /// <summary>
        /// This property allows to specify a width (or an height, in case of a vertical slider)
        /// when using the slider's default layout.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(150)]
        public int Length
        {
            get { return GetPropertyValue("Length", 150); }
            set { SetPropertyValue("Length", value); }
        }

        /// <summary>
        /// This property allows to raise a client-side change event on the
        /// extended TextBox. This is useful for example to trigger an UpdatePanel's update
        /// when the slider's value changes.
        /// If set to true, the change event will be raised only when the user releases the 
        /// left mouse button on the slider. 
        /// If set to false, the change event will be raised whenever the slider's value
        /// changes.
        /// This property is set to true by default to prevent flooding of requests to 
        /// the web server.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(true)]
        public bool RaiseChangeOnlyOnMouseUp
        {
            get { return GetPropertyValue("RaiseChangeOnlyOnMouseUp", true); }
            set { SetPropertyValue("RaiseChangeOnlyOnMouseUp", value); }
        }

        /// <summary>
        /// This property allows to specify some text to display in the tooltip of 
        /// the slider's handle. If the text contains the {0} placeholder, it will 
        /// be replaced by the current value of the slider.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string TooltipText
        {
            get { return GetPropertyValue("TooltipText", String.Empty); }
            set { SetPropertyValue("TooltipText", value); }
        }

        /// <summary>
        /// Determines if the slider will respond to arrow keys when it has focus.
        /// </summary>
        [Description("Determines if the slider will respond to arrow keys when it has focus.")]
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("enableKeyboard")]
        public bool EnableKeyboard
        {
            get { return GetPropertyValue("EnableKeyboard", true); }
            set { SetPropertyValue("EnableKeyboard", value); }
        }
    }
}