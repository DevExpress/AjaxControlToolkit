#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ColorSelector", Constants.HtmlEditorColorSelectorName)]
    public abstract class ColorSelector : Selector {
        string _fixedColorButtonId = String.Empty;

        [DefaultValue("")]
        public string FixedColorButtonId {
            get { return _fixedColorButtonId; }
            set { _fixedColorButtonId = value; }
        }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            RelatedPopup = new Popups.BaseColorsPopup();
        }

        protected override void OnPreRender(EventArgs e) {
            if(FixedColorButtonId.Length > 0 && !IsDesign) {
                var but = Parent.FindControl(FixedColorButtonId) as FixedColorButton;
                if(but != null)
                    ToolTip = but.ToolTip;
            }
            base.OnPreRender(e);
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            if(FixedColorButtonId.Length > 0 && !IsDesign) {
                var but = Parent.FindControl(FixedColorButtonId) as FixedColorButton;
                if(but != null)
                    descriptor.AddComponentProperty("fixedColorButton", but.ClientID);
                else
                    throw new ArgumentException("FixedColorButton control's ID expected");
            }
        }
    }

}

#pragma warning restore 1591