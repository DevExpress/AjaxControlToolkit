#pragma warning disable 1591
using AjaxControlToolkit.HtmlEditor.Popups;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModePopupImageButton", Constants.HtmlEditorDesignModePopupImageButtonName)]
    public abstract class DesignModePopupImageButton : MethodButton {
        Popup _popup;
        bool _autoClose = true;

        protected Popup RelatedPopup {
            get { return (Popups.Popup)_popup; }
            set {
                _popup = value;
                if(IsDesign)
                    return;

                Popup popup = Popup.GetExistingPopup(Parent, RelatedPopup.GetType());
                if(popup == null)
                    ExportedControls.Add(_popup);
                else
                    _popup = popup;
            }
        }

        protected bool AutoClose {
            get { return _autoClose; }
            set { _autoClose = value; }
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            if(RelatedPopup != null && !IsDesign)
                descriptor.AddComponentProperty("relatedPopup", RelatedPopup.ClientID);
            descriptor.AddProperty("autoClose", AutoClose);
        }
    }

}

#pragma warning restore 1591