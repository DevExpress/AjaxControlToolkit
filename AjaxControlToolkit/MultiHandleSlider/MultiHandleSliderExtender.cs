#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Design;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// The MultiHandleSlider extender provides a feature-rich extension to a regular asp:Textbox control.
    /// It allows you to choose a single value or multiple values in a range through a graphical slider
    /// interface. It supports one handle, dual handles, or any number of handles bound to values of the
    /// asp:TextBox or asp:Label controls. It also provides options for read-only access, custom graphic
    /// styling, hover and drag handle styles, as well as the mouse and keyboard support for accessibility.
    /// </summary>
    [Designer(typeof(MultiHandleSliderExtenderDesigner))]
    [ClientCssResource(Constants.MultiHandleSliderName)]
    [ClientScriptResource("Sys.Extended.UI.MultiHandleSliderBehavior", Constants.MultiHandleSliderName)]
    [TargetControlType(typeof(TextBox))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(DragDropScripts))]
    [RequiredScript(typeof(AnimationScripts))]
    [RequiredScript(typeof(TimerScript))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.MultiHandleSliderName + Constants.IconPostfix)]
    public class MultiHandleSliderExtender : ExtenderControlBase {
        /// <summary>
        /// The lowest value on the slider
        /// </summary>
        [Description("The lowest value on the slider.")]
        [ExtenderControlProperty]
        [DefaultValue("0")]
        [ClientPropertyName("minimum")]
        public int Minimum {
            get { return GetPropertyValue("Minimum", 0); }
            set { SetPropertyValue("Minimum", value); }
        }

        /// <summary>
        /// The highest value on the slider
        /// </summary>
        [Description("The highest value on the slider.")]
        [ExtenderControlProperty]
        [DefaultValue("100")]
        [ClientPropertyName("maximum")]
        public int Maximum {
            get { return GetPropertyValue("Maximum", 100); }
            set { SetPropertyValue("Maximum", value); }
        }

        /// <summary>
        /// The slider rail length in pixels
        /// </summary>
        [Description("The length of the slider rail in pixels.")]
        [ExtenderControlProperty]
        [DefaultValue(150)]
        [ClientPropertyName("length")]
        public int Length {
            get { return GetPropertyValue("Length", 150); }
            set { SetPropertyValue("Length", value); }
        }

        /// <summary>
        /// Determines the number of discrete locations on the slider. Otherwise, the slider is continous
        /// </summary>
        [Description("Determines number of discrete locations on the slider; otherwise, the slider is continous.")]
        [ExtenderControlProperty]
        [DefaultValue(0)]
        [ClientPropertyName("steps")]
        public int Steps {
            get { return GetPropertyValue("Steps", 0); }
            set { SetPropertyValue("Steps", value); }
        }

        /// <summary>
        /// Determines if the slider will show an inner selected range rail. Otherwise, it will be displayed as a uniform rail
        /// </summary>
        [Description("Determines if the slider will show an inner selected range rail; otherwise, it will display as a uniform rail.")]
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("showInnerRail")]
        public bool ShowInnerRail {
            get { return GetPropertyValue("ShowInnerRail", false); }
            set { SetPropertyValue("ShowInnerRail", value); }
        }

        /// <summary>
        /// Determines how the inner rail style is handled
        /// </summary>
        [Description("Determines how the inner rail style is handled.")]
        [ExtenderControlProperty]
        [DefaultValue(MultiHandleInnerRailStyle.AsIs)]
        [ClientPropertyName("innerRailStyle")]
        public MultiHandleInnerRailStyle InnerRailStyle {
            get { return GetPropertyValue("InnerRailStyle", MultiHandleInnerRailStyle.AsIs); }
            set { SetPropertyValue("InnerRailStyle", value); }
        }

        /// <summary>
        /// Determines if the slider's orientation is horizontal or vertical
        /// </summary>
        [ExtenderControlProperty]
        [Description("Determines if the slider's orientation is horizontal or vertical.")]
        [DefaultValue(SliderOrientation.Horizontal)]
        [ClientPropertyName("orientation")]
        public SliderOrientation Orientation {
            get { return GetPropertyValue("Orientation", SliderOrientation.Horizontal); }
            set { SetPropertyValue("Orientation", value); }
        }

        /// <summary>
        /// Determines if changes events to the slider's values are raised during dragging.
        /// Otherwise, they are raised when dragging is completed
        /// </summary>
        [Description("Determines if changes to the slider's values are raised as an event when dragging; otherwise, they are raised on drag end.")]
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("raiseChangeOnlyOnMouseUp")]
        public bool RaiseChangeOnlyOnMouseUp {
            get { return GetPropertyValue("RaiseChangeOnlyOnMouseUp", true); }
            set { SetPropertyValue("RaiseChangeOnlyOnMouseUp", value); }
        }

        /// <summary>
        /// Determines if the inner rail range can be dragged as a whole, moving both handles defining it
        /// </summary>
        [Description("Determines if the inner rail range can be dragged as a whole, moving both handles defining it.")]
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("enableInnerRangeDrag")]
        public bool EnableInnerRangeDrag {
            get { return GetPropertyValue("EnableInnerRangeDrag", false); }
            set { SetPropertyValue("EnableInnerRangeDrag", value); }
        }

        /// <summary>
        /// Determines if clicking the rail will detect and move the closest handle
        /// </summary>
        [Description("Determines if clicking on the rail will detect and move the closest handle.")]
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("enableRailClick")]
        public bool EnableRailClick {
            get { return GetPropertyValue("EnableRailClick", true); }
            set { SetPropertyValue("EnableRailClick", value); }
        }

        /// <summary>
        /// Determines if the slider and its values can be manipulated
        /// </summary>
        [Description("Determines if the slider and its values can be manipulated.")]
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("isReadOnly")]
        public bool IsReadOnly {
            get { return GetPropertyValue("IsReadOnly", false); }
            set { SetPropertyValue("IsReadOnly", value); }
        }

        /// <summary>
        /// Determines if the slider will respond to arrow keys when it has focus
        /// </summary>
        [Description("Determines if the slider will respond to arrow keys when it has focus.")]
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("enableKeyboard")]
        public bool EnableKeyboard {
            get { return GetPropertyValue("EnableKeyboard", true); }
            set { SetPropertyValue("EnableKeyboard", value); }
        }

        /// <summary>
        /// Determines if the slider will respond to the mouse wheel when it has focus
        /// </summary>
        [Description("Determines if the slider will respond to the mouse wheel when it has focus.")]
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("enableMouseWheel")]
        public bool EnableMouseWheel {
            get { return GetPropertyValue("EnableMouseWheel", true); }
            set { SetPropertyValue("EnableMouseWheel", value); }
        }

        /// <summary>
        /// Determines the number of slider points to increment or decrement using the
        /// keyboard or mouse wheel. It is ignored if the steps property is used
        /// </summary>
        [Description("Determines the number of points to increment or decrement the slider using the keyboard or mousewheel; ignored if steps is used.")]
        [ExtenderControlProperty]
        [DefaultValue(1)]
        [ClientPropertyName("increment")]
        public int Increment {
            get { return GetPropertyValue("Increment", 1); }
            set { SetPropertyValue("Increment", value); }
        }

        /// <summary>
        /// Determines if a control is server-side
        /// </summary>
        [ExtenderControlProperty(true, true)]
        [ClientPropertyName("_isServerControl")]
        public bool IsServerControl {
            get { return true; }
        }

        /// <summary>
        /// The list of controls used to bind slider handle values. These should be Label or TextBox controls
        /// </summary>
        [Description("The list of controls used to bind slider handle values. These should be Label or TextBox controls.")]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(MultiHandleSliderTargetsEditor), typeof(UITypeEditor))]
        public Collection<MultiHandleSliderTarget> MultiHandleSliderTargets {
            get {
                if(DesignMode)
                    return new Collection<MultiHandleSliderTarget>();

                if(ClientMultiHandleSliderTargets == null)
                    ClientMultiHandleSliderTargets = new Collection<MultiHandleSliderTarget>();

                return ClientMultiHandleSliderTargets;
            }
        }

        /// <summary>
        /// The list of controls used to bind slider handle values. These should be Label or TextBox controls
        /// </summary>
        [Description("The list of controls used to bind slider handle values. These should be Label or TextBox controls.")]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        [ClientPropertyName("multiHandleSliderTargets")]
        public Collection<MultiHandleSliderTarget> ClientMultiHandleSliderTargets {
            get { return GetPropertyValue<Collection<MultiHandleSliderTarget>>("MultiHandleSliderTargets", null); }
            set { SetPropertyValue<Collection<MultiHandleSliderTarget>>("MultiHandleSliderTargets", value); }
        }

        /// <summary>
        /// Determines if the slider handles display of an animation effect when the position is changed
        /// </summary>
        [Description("Determines if the slider handles display an animation effect when changing position.")]
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("enableHandleAnimation")]
        public bool EnableHandleAnimation {
            get { return GetPropertyValue("EnableHandleAnimation", false); }
            set { SetPropertyValue("EnableHandleAnimation", value); }
        }

        /// <summary>
        /// Determines if the slider handles will show a style effect when they are hovered over
        /// </summary>
        [Description("Determines if the slider handles will show a style effect when they are hovered over.")]
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("showHandleHoverStyle")]
        public bool ShowHandleHoverStyle {
            get { return GetPropertyValue("ShowHandleHoverStyle", false); }
            set { SetPropertyValue("ShowHandleHoverStyle", value); }
        }

        /// <summary>
        /// Determines if the slider handles will show a style effect when they are being dragged
        /// </summary>
        [Description("Determines if the slider handles will show a style effect when they are being dragged.")]
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("showHandleDragStyle")]
        public bool ShowHandleDragStyle {
            get { return GetPropertyValue("ShowHandleDragStyle", false); }
            set { SetPropertyValue("ShowHandleDragStyle", value); }
        }

        /// <summary>
        /// Determines the total duration of an animation effect in seconds
        /// </summary>
        [Description("Determines the total duration of the animation effect, in seconds.")]
        [ExtenderControlProperty]
        [DefaultValue(0.02f)]
        [ClientPropertyName("handleAnimationDuration")]
        public float HandleAnimationDuration {
            get { return GetPropertyValue("HandleAnimationDuration", 0.1f); }
            set { SetPropertyValue("HandleAnimationDuration", value); }
        }

        /// <summary>
        /// Determines text to display as a tooltip; {0} denotes the current handle's value in the format string
        /// </summary>
        [Description("Determines the text to display as the tooltip; {0} denotes the current handle's value in the format string.")]
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("tooltipText")]
        public string TooltipText {
            get { return GetPropertyValue("TooltipText", String.Empty); }
            set { SetPropertyValue("TooltipText", value); }
        }

        /// <summary>
        /// A master style to apply to slider graphical elements
        /// </summary>
        [Description("The master style to apply to slider graphical elements.")]
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("cssClass")]
        public string CssClass {
            get { return GetPropertyValue("CssClass", String.Empty); }
            set { SetPropertyValue("CssClass", value); }
        }

        /// <summary>
        /// An event raised when the slider is completely loaded on the page
        /// </summary>
        [ExtenderControlEvent]
        [Description("The event raised when the slider is completely loaded on the page.")]
        [ClientPropertyName("load")]
        [DefaultValue("")]
        public string OnClientLoad {
            get { return GetPropertyValue("OnClientLoad", String.Empty); }
            set { SetPropertyValue("OnClientLoad", value); }
        }

        /// <summary>
        /// An event raised when a user initiates the drag operation on the slider
        /// </summary>
        [ExtenderControlEvent]
        [Description("The event raised when the user initiates a drag operation on the slider.")]
        [ClientPropertyName("dragStart")]
        [DefaultValue("")]
        public string OnClientDragStart {
            get { return GetPropertyValue("OnClientDragStart", String.Empty); }
            set { SetPropertyValue("OnClientDragStart", value); }
        }

        /// <summary>
        /// An event raised when a user drags the slider
        /// </summary>
        [ExtenderControlEvent]
        [Description("The event raised when the user drags the slider.")]
        [ClientPropertyName("drag")]
        [DefaultValue("")]
        public string OnClientDrag {
            get { return GetPropertyValue("OnClientDrag", String.Empty); }
            set { SetPropertyValue("OnClientDrag", value); }
        }

        /// <summary>
        /// An event raised when a user drops the slider
        /// </summary>
        [ExtenderControlEvent]
        [Description("The event raised when the user drops the slider.")]
        [ClientPropertyName("dragEnd")]
        [DefaultValue("")]
        public string OnClientDragEnd {
            get { return GetPropertyValue("OnClientDragEnd", String.Empty); }
            set { SetPropertyValue("OnClientDragEnd", value); }
        }

        /// <summary>
        /// An event raised when the slider changes its state
        /// </summary>
        [ExtenderControlEvent]
        [Description("The event raised when the slider changes its state.")]
        [ClientPropertyName("valueChanged")]
        [DefaultValue("")]
        public string OnClientValueChanged {
            get { return GetPropertyValue("OnClientValueChanged", String.Empty); }
            set { SetPropertyValue("OnClientValueChanged", value); }
        }

        public MultiHandleSliderExtender() {
            EnableClientState = true;
        }

        /// <summary>
        /// ID of a control to use for a single handle
        /// </summary>
        /// <remarks>
        /// Only used as a backward-compatibility feature for users that wish to upgrade
        /// their existing controls. The server control should be a TextBox or Label control
        /// </remarks>
        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [DefaultValue("")]
        [ClientPropertyName("boundControlID")]
        public string BoundControlID {
            get { return GetPropertyValue("BoundControlID", String.Empty); }
            set { SetPropertyValue("BoundControlID", value); }
        }

        /// <summary>
        /// The number of decimal digits in a single slider's value
        /// </summary>
        /// <remarks>
        /// 0 means an integer value. Only used as a backward-compatibility feature
        /// for users wishing to upgrade their existing controls
        /// </remarks>
        [ExtenderControlProperty]
        [ClientPropertyName("decimals")]
        [DefaultValue(0)]
        public int Decimals {
            get { return GetPropertyValue("Decimals", 0); }
            set { SetPropertyValue("Decimals", value); }
        }

        /// <summary>
        /// A CSS class of a single handle
        /// </summary>
        /// <remarks>
        ///  Only used as a backward-compatibility feature for users wishing to
        /// upgrade their existing controls
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("handleCssClass")]
        public string HandleCssClass {
            get { return GetPropertyValue("HandleCssClass", String.Empty); }
            set { SetPropertyValue("HandleCssClass", value); }
        }

        /// <summary>
        /// A CSS class for the slider's rail element
        /// </summary>
        /// <remarks>
        /// Only used as a backward-compatibility feature for users
        /// wishing to upgrade their existing controls
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("railCssClass")]
        public string RailCssClass {
            get { return GetPropertyValue("RailCssClass", String.Empty); }
            set { SetPropertyValue("RailCssClass", value); }
        }

        /// <summary>
        /// URL for an image to display in the slider's handle
        /// </summary>
        /// <remarks>
        /// Only used as a backward-compatibility feature for users wishing to
        /// upgrade their existing controls
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue(""),
         Editor("System.Web.UI.Design.ImageUrlEditor, System.Design, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a", typeof(System.Drawing.Design.UITypeEditor)),
         UrlProperty]
        [ClientPropertyName("handleImageUrl")]
        public string HandleImageUrl {
            get { return GetPropertyValue("HandleImageUrl", String.Empty); }
            set { SetPropertyValue("HandleImageUrl", value); }
        }
    }

}

#pragma warning restore 1591