using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit;

#region [ Resources ]

[assembly: WebResource("ColorPicker.ColorPicker.css", "text/css", PerformSubstitution = true)]
[assembly: System.Web.UI.WebResource("ColorPicker.ColorPickerBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("ColorPicker.ColorPickerBehavior.debug.js", "text/javascript")]

#endregion

namespace AjaxControlToolkit
{
    [RequiredScript(typeof (CommonToolkitScripts), 0)]
    [RequiredScript(typeof (PopupExtender), 1)]
    [RequiredScript(typeof (ThreadingScripts), 2)]
    [TargetControlType(typeof (TextBox))]
    [ClientCssResource("ColorPicker.ColorPicker.css")]
    [ClientScriptResource("Sys.Extended.UI.ColorPickerBehavior", "ColorPicker.ColorPickerBehavior.js")]
    [ToolboxBitmap(typeof(ColorPickerExtender), "ColorPicker.ColorPicker.ico")]
    [Designer(typeof(ColorPickerDesigner))]
    public class ColorPickerExtender : ExtenderControlBase
    {
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("enabled")]
        public virtual bool EnabledOnClient
        {
            get { return GetPropertyValue("EnabledOnClient", true); }
            set { SetPropertyValue("EnabledOnClient", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("button")]
        [ElementReference]
        [IDReferenceProperty]
        [SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase",
            Justification = "Following ASP.NET AJAX pattern")]
        public virtual string PopupButtonID
        {
            get { return GetPropertyValue("PopupButtonID", string.Empty); }
            set { SetPropertyValue("PopupButtonID", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("sample")]
        [ElementReference]
        [IDReferenceProperty]
        [SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase",
            Justification = "Following ASP.NET AJAX pattern")]
        public virtual string SampleControlID
        {
            get { return GetPropertyValue("SampleControlID", string.Empty); }
            set { SetPropertyValue("SampleControlID", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("popupPosition")]
        [DefaultValue(PositioningMode.BottomLeft)]
        [Description("Indicates where you want the color picker displayed relative to the textbox.")]
        public virtual PositioningMode PopupPosition
        {
            get { return GetPropertyValue("PopupPosition", PositioningMode.BottomLeft); }
            set { SetPropertyValue("PopupPosition", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("selectedColor")]
        public string SelectedColor
        {
            get { return GetPropertyValue("SelectedColor", string.Empty); }
            set { SetPropertyValue("SelectedColor", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("showing")]
        public virtual string OnClientShowing
        {
            get { return GetPropertyValue("OnClientShowing", string.Empty); }
            set { SetPropertyValue("OnClientShowing", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("shown")]
        public virtual string OnClientShown
        {
            get { return GetPropertyValue("OnClientShown", string.Empty); }
            set { SetPropertyValue("OnClientShown", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hiding")]
        public virtual string OnClientHiding
        {
            get { return GetPropertyValue("OnClientHiding", string.Empty); }
            set { SetPropertyValue("OnClientHiding", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hidden")]
        public virtual string OnClientHidden
        {
            get { return GetPropertyValue("OnClientHidden", string.Empty); }
            set { SetPropertyValue("OnClientHidden", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("colorSelectionChanged")]
        public virtual string OnClientColorSelectionChanged
        {
            get { return GetPropertyValue("OnClientColorSelectionChanged", string.Empty); }
            set { SetPropertyValue("OnClientColorSelectionChanged", value); }
        }
    }
}