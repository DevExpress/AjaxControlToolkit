

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

#region Assembly Resource Attributes

[assembly: System.Web.UI.WebResource("MultiHandleSlider.MultiHandleSliderBehavior.js", "text/javascript", PerformSubstitution = true)]
[assembly: System.Web.UI.WebResource("MultiHandleSlider.MultiHandleSliderBehavior.debug.js", "text/javascript", PerformSubstitution = true)]
[assembly: WebResource("MultiHandleSlider.MultiHandleSlider_resource.css", "text/css", PerformSubstitution = true)]
[assembly : WebResource("MultiHandleSlider.Images.slider_h_handle.gif", "img/gif")]
[assembly : WebResource("MultiHandleSlider.Images.slider_h_handle_hover.gif", "img/gif")]
[assembly : WebResource("MultiHandleSlider.Images.slider_h_handle_down.gif", "img/gif")]
[assembly : WebResource("MultiHandleSlider.Images.slider_h_rail.gif", "img/gif")]
[assembly : WebResource("MultiHandleSlider.Images.slider_h_rail_outer.gif", "img/gif")]
[assembly : WebResource("MultiHandleSlider.Images.slider_v_handle.gif", "img/gif")]
[assembly : WebResource("MultiHandleSlider.Images.slider_v_handle_hover.gif", "img/gif")]
[assembly : WebResource("MultiHandleSlider.Images.slider_v_handle_down.gif", "img/gif")]
[assembly : WebResource("MultiHandleSlider.Images.slider_v_rail.gif", "img/gif")]
[assembly : WebResource("MultiHandleSlider.Images.slider_v_rail_outer.gif", "img/gif")]

#endregion

namespace AjaxControlToolkit
{
    /// <summary>
    /// A multi-handled slider allowing selection of multiple point values on a graphical rail.
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Multi"), Description("A multi-handled slider allowing selection of multiple point values on a graphical rail.")]
    [Designer(typeof (MultiHandleSliderDesigner))]
    [ClientCssResource("MultiHandleSlider.MultiHandleSlider_resource.css")]
    [ClientScriptResource("Sys.Extended.UI.MultiHandleSliderBehavior",
        "MultiHandleSlider.MultiHandleSliderBehavior.js")]
    [TargetControlType(typeof (TextBox))]
    [RequiredScript(typeof (CommonToolkitScripts))]
    [RequiredScript(typeof (DragDropScripts))]
    [RequiredScript(typeof (AnimationScripts))]
    [RequiredScript(typeof (TimerScript))]
    [ToolboxBitmap(typeof (MultiHandleSliderExtender), "MultiHandleSlider.MultiHandleSlider.ico")]
    public class MultiHandleSliderExtender : ExtenderControlBase
    {
        #region Configuration

        /// <summary>
        /// The lowest value on the slider.
        /// </summary>
        [Description("The lowest value on the slider.")]
        [ExtenderControlProperty]
        [DefaultValue("0")]
        [ClientPropertyName("minimum")]
        public int Minimum
        {
            get { return GetPropertyValue("Minimum", 0); }
            set { SetPropertyValue("Minimum", value); }
        }

        /// <summary>
        /// The highest value on the slider.
        /// </summary>
        [Description("The highest value on the slider.")]
        [ExtenderControlProperty]
        [DefaultValue("100")]
        [ClientPropertyName("maximum")]
        public int Maximum
        {
            get { return GetPropertyValue("Maximum", 100); }
            set { SetPropertyValue("Maximum", value); }
        }

        /// <summary>
        /// The length of the slider rail in pixels.
        /// </summary>
        [Description("The length of the slider rail in pixels.")]
        [ExtenderControlProperty]
        [DefaultValue(150)]
        [ClientPropertyName("length")]
        public int Length
        {
            get { return GetPropertyValue("Length", 150); }
            set { SetPropertyValue("Length", value); }
        }

        /// <summary>
        /// Determines number of discrete locations on the slider; otherwise, the slider is continous.
        /// </summary>
        [Description("Determines number of discrete locations on the slider; otherwise, the slider is continous.")]
        [ExtenderControlProperty]
        [DefaultValue(0)]
        [ClientPropertyName("steps")]
        public int Steps
        {
            get { return GetPropertyValue("Steps", 0); }
            set { SetPropertyValue("Steps", value); }
        }

        /// <summary>
        /// Determines if the slider will show an inner selected range rail; otherwise, it will display as a uniform rail.
        /// </summary>
        [Description(
            "Determines if the slider will show an inner selected range rail; otherwise, it will display as a uniform rail."
            )]
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("showInnerRail")]
        public bool ShowInnerRail
        {
            get { return GetPropertyValue("ShowInnerRail", false); }
            set { SetPropertyValue("ShowInnerRail", value); }
        }

        /// <summary>
        /// Determines how the inner rail style is handled.
        /// </summary>
        [Description("Determines how the inner rail style is handled.")]
        [ExtenderControlProperty]
        [DefaultValue(MultiHandleInnerRailStyle.AsIs)]
        [ClientPropertyName("innerRailStyle")]
        public MultiHandleInnerRailStyle InnerRailStyle
        {
            get { return GetPropertyValue("InnerRailStyle", MultiHandleInnerRailStyle.AsIs); }
            set { SetPropertyValue("InnerRailStyle", value); }
        }

        /// <summary>
        /// Determines if the slider's orientation is horizontal or vertical.
        /// </summary>
        [ExtenderControlProperty]
        [Description("Determines if the slider's orientation is horizontal or vertical.")]
        [DefaultValue(SliderOrientation.Horizontal)]
        [ClientPropertyName("orientation")]
        public SliderOrientation Orientation
        {
            get { return GetPropertyValue("Orientation", SliderOrientation.Horizontal); }
            set { SetPropertyValue("Orientation", value); }
        }

        /// <summary>
        /// Determines if changes to the slider's values are raised as an event when dragging; otherwise, they are raised on drag end.
        /// </summary>
        [Description(
            "Determines if changes to the slider's values are raised as an event when dragging; otherwise, they are raised on drag end."
            )]
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("raiseChangeOnlyOnMouseUp")]
        public bool RaiseChangeOnlyOnMouseUp
        {
            get { return GetPropertyValue("RaiseChangeOnlyOnMouseUp", true); }
            set { SetPropertyValue("RaiseChangeOnlyOnMouseUp", value); }
        }

        /// <summary>
        /// Determines if the inner rail range can be dragged as a whole, moving both handles defining it.
        /// </summary>
        [Description("Determines if the inner rail range can be dragged as a whole, moving both handles defining it.")]
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("enableInnerRangeDrag")]
        public bool EnableInnerRangeDrag
        {
            get { return GetPropertyValue("EnableInnerRangeDrag", false); }
            set { SetPropertyValue("EnableInnerRangeDrag", value); }
        }

        /// <summary>
        /// Determines if clicking on the rail will detect and move the closest handle.
        /// </summary>
        [Description("Determines if clicking on the rail will detect and move the closest handle.")]
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("enableRailClick")]
        public bool EnableRailClick
        {
            get { return GetPropertyValue("EnableRailClick", true); }
            set { SetPropertyValue("EnableRailClick", value); }
        }

        /// <summary>
        /// Determines if the slider and its values can be manipulated.
        /// </summary>
        [Description("Determines if the slider and its values can be manipulated.")]
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("isReadOnly")]
        public bool IsReadOnly
        {
            get { return GetPropertyValue("IsReadOnly", false); }
            set { SetPropertyValue("IsReadOnly", value); }
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

        /// <summary>
        /// Determines if the slider will respond to the mouse wheel when it has focus.
        /// </summary>
        [Description("Determines if the slider will respond to the mouse wheel when it has focus.")]
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("enableMouseWheel")]
        public bool EnableMouseWheel
        {
            get { return GetPropertyValue("EnableMouseWheel", true); }
            set { SetPropertyValue("EnableMouseWheel", value); }
        }

        /// <summary>
        /// Determines the number of points to increment or decrement the slider using the keyboard or mousewheel; ignored if steps is used.
        /// </summary>
        [Description(
            "Determines the number of points to increment or decrement the slider using the keyboard or mousewheel; ignored if steps is used."
            )]
        [ExtenderControlProperty]
        [DefaultValue(1)]
        [ClientPropertyName("increment")]
        public int Increment
        {
            get { return GetPropertyValue("Increment", 1); }
            set { SetPropertyValue("Increment", value); }
        }

        #endregion

        #region Binding
        [ExtenderControlProperty(true, true)]
        [ClientPropertyName("_isServerControl")]
        public bool IsServerControl {
            get {
                return true;
            }
        }

        /// <summary>
        /// The list of controls used to bind slider handle values. These should be <see cref="Label"/> or <see cref="TextBox"/> controls.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Multi")]
        [Description("The list of controls used to bind slider handle values. These should be Label or TextBox controls.")]
        [ExtenderControlProperty(true, true)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        [NotifyParentProperty(true)]
        [ClientPropertyName("multiHandleSliderTargets")]
        public Collection<MultiHandleSliderTarget> MultiHandleSliderTargets
        {
            get { return GetPropertyValue<Collection<MultiHandleSliderTarget>>("MultiHandleSliderTargets", null); }
            set { SetPropertyValue<Collection<MultiHandleSliderTarget>>("MultiHandleSliderTargets", value); }
        }

        #endregion

        #region Effects

        /// <summary>
        /// Determines if the slider handles display an animation effect when changing position.
        /// </summary>
        [Description("Determines if the slider handles display an animation effect when changing position.")]
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("enableHandleAnimation")]
        public bool EnableHandleAnimation
        {
            get { return GetPropertyValue("EnableHandleAnimation", false); }
            set { SetPropertyValue("EnableHandleAnimation", value); }
        }

        /// <summary>
        /// Determines if the slider handles will show a style effect when they are hovered over.
        /// </summary>
        [Description("Determines if the slider handles will show a style effect when they are hovered over.")]
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("showHandleHoverStyle")]
        public bool ShowHandleHoverStyle
        {
            get { return GetPropertyValue("ShowHandleHoverStyle", false); }
            set { SetPropertyValue("ShowHandleHoverStyle", value); }
        }

        /// <summary>
        /// Determines if the slider handles will show a style effect when they are being dragged.
        /// </summary>
        [Description("Determines if the slider handles will show a style effect when they are being dragged.")]
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("showHandleDragStyle")]
        public bool ShowHandleDragStyle
        {
            get { return GetPropertyValue("ShowHandleDragStyle", false); }
            set { SetPropertyValue("ShowHandleDragStyle", value); }
        }

        /// <summary>
        /// Determines the total duration of the animation effect, in seconds.
        /// </summary>
        [Description("Determines the total duration of the animation effect, in seconds.")]
        [ExtenderControlProperty]
        [DefaultValue(0.02f)]
        [ClientPropertyName("handleAnimationDuration")]
        public float HandleAnimationDuration
        {
            get { return GetPropertyValue("HandleAnimationDuration", 0.1f); }
            set { SetPropertyValue("HandleAnimationDuration", value); }
        }

        /// <summary>
        /// Determines the text to display as the tooltip; {0} denotes the current handle's value in the format string.
        /// </summary>
        [Description(
            "Determines the text to display as the tooltip; {0} denotes the current handle's value in the format string."
            )]
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("tooltipText")]
        public string TooltipText
        {
            get { return GetPropertyValue("TooltipText", String.Empty); }
            set { SetPropertyValue("TooltipText", value); }
        }

        #endregion

        #region Custom Styles

        /// <summary>
        /// The master style to apply to slider graphical elements.
        /// </summary>
        [Description("The master style to apply to slider graphical elements.")]
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("cssClass")]
        public string CssClass
        {
            get { return GetPropertyValue("CssClass", String.Empty); }
            set { SetPropertyValue("CssClass", value); }
        }

        #endregion

        #region Events

        /// <summary>
        /// The event raised when the slider is completely loaded on the page.
        /// </summary>
        [ExtenderControlEvent]
        [Description("The event raised when the slider is completely loaded on the page.")]
        [ClientPropertyName("load")]
        [DefaultValue("")]
        public string OnClientLoad
        {
            get { return GetPropertyValue("OnClientLoad", String.Empty); }
            set { SetPropertyValue("OnClientLoad", value); }
        }

        /// <summary>
        /// The event raised when the user initiates a drag operation on the slider.
        /// </summary>
        [ExtenderControlEvent]
        [Description("The event raised when the user initiates a drag operation on the slider.")]
        [ClientPropertyName("dragStart")]
        [DefaultValue("")]
        public string OnClientDragStart
        {
            get { return GetPropertyValue("OnClientDragStart", String.Empty); }
            set { SetPropertyValue("OnClientDragStart", value); }
        }

        /// <summary>
        /// The event raised when the user drags the slider.
        /// </summary>
        [ExtenderControlEvent]
        [Description("The event raised when the user drags the slider.")]
        [ClientPropertyName("drag")]
        [DefaultValue("")]
        public string OnClientDrag
        {
            get { return GetPropertyValue("OnClientDrag", String.Empty); }
            set { SetPropertyValue("OnClientDrag", value); }
        }

        /// <summary>
        /// The event raised when the user drops the slider.
        /// </summary>
        [ExtenderControlEvent]
        [Description("The event raised when the user drops the slider.")]
        [ClientPropertyName("dragEnd")]
        [DefaultValue("")]
        public string OnClientDragEnd
        {
            get { return GetPropertyValue("OnClientDragEnd", String.Empty); }
            set { SetPropertyValue("OnClientDragEnd", value); }
        }

        /// <summary>
        /// The event raised when the slider changes its state.
        /// </summary>
        [ExtenderControlEvent]
        [Description("The event raised when the slider changes its state.")]
        [ClientPropertyName("valueChanged")]
        [DefaultValue("")]
        public string OnClientValueChanged
        {
            get { return GetPropertyValue("OnClientValueChanged", String.Empty); }
            set { SetPropertyValue("OnClientValueChanged", value); }
        }

        #endregion

        #region CTOR

        /// <summary>
        /// Initializes a new instance of a <see cref="MultiHandleSliderExtender"/>.
        /// </summary>
        public MultiHandleSliderExtender()
        {
            EnableClientState = true;
        }

        #endregion

        #region Backwards Compatibility

        /// <summary>
        /// Gets or sets the ID of a control to use for a single handle. Only
        /// used as a backwards compatibility feature for users wishing to upgrade
        /// their existing <see cref="SliderExtender" /> controls.
        /// </summary>
        /// <remarks>
        /// The server control should be a TextBox or Label control.
        /// </remarks>
        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [DefaultValue("")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        [ClientPropertyName("boundControlID")]
        public string BoundControlID
        {
            get { return GetPropertyValue("BoundControlID", String.Empty); }
            set { SetPropertyValue("BoundControlID", value); }
        }

        /// <summary>
        /// Get/Set the number of decimal digits in a single slider's value. A value 
        /// of 0 means an integer value.  Only
        /// used as a backwards compatibility feature for users wishing to upgrade
        /// their existing <see cref="SliderExtender" /> controls.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("decimals")]
        [DefaultValue(0)]
        public int Decimals
        {
            get { return GetPropertyValue("Decimals", 0); }
            set { SetPropertyValue("Decimals", value); }
        }

        /// <summary>
        /// Gets or sets the CSS class of a single handle. Only
        /// used as a backwards compatibility feature for users wishing to upgrade
        /// their existing <see cref="SliderExtender" /> controls.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("handleCssClass")]
        public string HandleCssClass
        {
            get { return GetPropertyValue("HandleCssClass", String.Empty); }
            set { SetPropertyValue("HandleCssClass", value); }
        }

        /// <summary>
        /// Gets or set the CSS class for the slider's rail element. Only
        /// used as a backwards compatibility feature for users wishing to upgrade
        /// their existing <see cref="SliderExtender" /> controls.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("railCssClass")]
        public string RailCssClass
        {
            get { return GetPropertyValue("RailCssClass", String.Empty); }
            set { SetPropertyValue("RailCssClass", value); }
        }

        /// <summary>
        /// Gets or sets the URL for the image to display in the slider's handle. Only
        /// used as a backwards compatibility feature for users wishing to upgrade
        /// their existing <see cref="SliderExtender" /> controls.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(""),
         Editor("System.Web.UI.Design.ImageUrlEditor, System.Design, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a", typeof(System.Drawing.Design.UITypeEditor)),
         UrlProperty,
         System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Following ASP.NET pattern")]
        [ClientPropertyName("handleImageUrl")]
        public string HandleImageUrl
        {
            get { return GetPropertyValue("HandleImageUrl", ""); }
            set { SetPropertyValue("HandleImageUrl", value); }
        }

        #endregion
    }
}