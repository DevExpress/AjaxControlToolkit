using AjaxControlToolkit.Design;
using AjaxControlToolkit.ToolboxIcons;
using System;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [RequiredScript(typeof(CommonToolkitScripts), 0)]
    [RequiredScript(typeof(PopupExtender), 1)]
    [RequiredScript(typeof(ThreadingScripts), 2)]
    [TargetControlType(typeof(TextBox))]
    [ClientCssResource(Constants.ColorPickerName)]
    [ClientScriptResource("Sys.Extended.UI.ColorPickerBehavior", Constants.ColorPickerName)]
    [ToolboxBitmap(typeof(Accessor), Constants.ColorPickerName + Constants.IconPostfix)]
    [Designer(typeof(ColorPickerExtenderDesigner))]
    public class ColorPickerExtender : ExtenderControlBase {
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("enabled")]
        public virtual bool EnabledOnClient {
            get { return GetPropertyValue("EnabledOnClient", true); }
            set { SetPropertyValue("EnabledOnClient", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("button")]
        [ElementReference]
        [IDReferenceProperty]
        public virtual string PopupButtonID {
            get { return GetPropertyValue("PopupButtonID", String.Empty); }
            set { SetPropertyValue("PopupButtonID", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("sample")]
        [ElementReference]
        [IDReferenceProperty]
        public virtual string SampleControlID {
            get { return GetPropertyValue("SampleControlID", String.Empty); }
            set { SetPropertyValue("SampleControlID", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("popupPosition")]
        [DefaultValue(PositioningMode.BottomLeft)]
        [Description("Indicates where you want the color picker displayed relative to the textbox.")]
        public virtual PositioningMode PopupPosition {
            get { return GetPropertyValue("PopupPosition", PositioningMode.BottomLeft); }
            set { SetPropertyValue("PopupPosition", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("selectedColor")]
        public string SelectedColor {
            get { return GetPropertyValue("SelectedColor", String.Empty); }
            set { SetPropertyValue("SelectedColor", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("showing")]
        public virtual string OnClientShowing {
            get { return GetPropertyValue("OnClientShowing", String.Empty); }
            set { SetPropertyValue("OnClientShowing", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("shown")]
        public virtual string OnClientShown {
            get { return GetPropertyValue("OnClientShown", String.Empty); }
            set { SetPropertyValue("OnClientShown", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hiding")]
        public virtual string OnClientHiding {
            get { return GetPropertyValue("OnClientHiding", String.Empty); }
            set { SetPropertyValue("OnClientHiding", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hidden")]
        public virtual string OnClientHidden {
            get { return GetPropertyValue("OnClientHidden", String.Empty); }
            set { SetPropertyValue("OnClientHidden", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("colorSelectionChanged")]
        public virtual string OnClientColorSelectionChanged {
            get { return GetPropertyValue("OnClientColorSelectionChanged", String.Empty); }
            set { SetPropertyValue("OnClientColorSelectionChanged", value); }
        }
    }

}
