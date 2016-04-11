#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Reflection;
using System.Resources;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor.Popups {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.Popups.Popup", Constants.HtmlEditorPopupName)]
    public abstract class Popup : ScriptControlBase {
        public static Popup GetExistingPopup(Control parent, Type type) {
            foreach(Control ctrl in parent.Controls) {
                if(ctrl.GetType().Equals(type))
                    return (ctrl as Popup);
                else {
                    var foundControl = GetExistingPopup(ctrl, type);
                    if(foundControl != null)
                        return foundControl;
                }
            }

            return null;
        }

        ResourceManager _rm;
        HtmlGenericControl _iframe;
        Collection<RegisteredField> _registeredFields;
        Collection<RegisteredField> _registeredHandlers;
        string _savedCSS;
        string _initialContent = String.Empty;
        string _cssPath = String.Empty;
        bool _autoDimensions = true;

        protected Popup()
            : base(false, HtmlTextWriterTag.Div) {
        }

        bool isDesign {
            get {
                try {
                    var isd = false;
                    if(Context == null)
                        isd = true;
                    else if(Site != null)
                        isd = Site.DesignMode;
                    else
                        isd = false;

                    return isd;
                }
                catch { return true; }
            }
        }

        [DefaultValue(true)]
        [Category("behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("autoDimensions")]
        public bool AutoDimensions {
            get { return (bool)_autoDimensions; }
            set { _autoDimensions = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        [ExtenderControlProperty]
        [ClientPropertyName("initialContent")]
        public string InitialContent {
            get { return (string)_initialContent; }
            set { _initialContent = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        [ExtenderControlProperty]
        [ClientPropertyName("cssPath")]
        public string CssPath {
            get { return (string)_cssPath; }
            set { _cssPath = value; }
        }

        public Collection<RegisteredField> RegisteredFields {
            get {
                if(_registeredFields == null)
                    _registeredFields = new Collection<RegisteredField>();
                return _registeredFields;
            }
        }

        string RegisteredFieldsIds {
            get {
                var result = "[";
                for(var i = 0; i < RegisteredFields.Count; i++) {
                    if(i > 0) result += ",";
                    result += "{name: ";
                    result += "'" + RegisteredFields[i].Name + "'";
                    result += ", clientID: ";
                    result += "'" + RegisteredFields[i].Control.ClientID + "'";
                    result += "}";
                }
                result += "]";
                return result;
            }
        }

        public Collection<RegisteredField> RegisteredHandlers {
            get {
                if(_registeredHandlers == null)
                    _registeredHandlers = new Collection<RegisteredField>();
                return _registeredHandlers;
            }
        }

        string RegisteredHandlersIds {
            get {
                var result = "[";
                for(var i = 0; i < RegisteredHandlers.Count; i++) {
                    if(i > 0) result += ",";
                    result += "{name: ";
                    result += "'" + RegisteredHandlers[i].Name + "'";
                    result += ", clientID: ";
                    result += "'" + RegisteredHandlers[i].Control.ClientID + "'";
                    result += ", callMethod: null";
                    result += "}";
                }
                result += "]";
                return result;
            }
        }

        string GetResourceString(string key) {
            switch(key) {
                case "HtmlEditor_toolbar_popup_LinkProperties_button_Cancel":
                    return "Cancel";
                case "HtmlEditor_toolbar_popup_LinkProperties_button_OK":
                    return "OK";
                case "HtmlEditor_toolbar_popup_LinkProperties_field_URL":
                    return "URL";
                case "HtmlEditor_toolbar_popup_LinkProperties_field_Target":
                    return "Target";
                case "HtmlEditor_toolbar_popup_LinkProperties_field_Target_New":
                    return "New window";
                case "HtmlEditor_toolbar_popup_LinkProperties_field_Target_Current":
                    return "Current window";
                case "HtmlEditor_toolbar_popup_LinkProperties_field_Target_Parent":
                    return "Parent window";
                case "HtmlEditor_toolbar_popup_LinkProperties_field_Target_Top":
                    return "Top window";
                default:
                    throw new ArgumentOutOfRangeException("key", key, "Unknown resource key");
            }
        }

        protected string GetButton(string name) {
            return GetResourceString("HtmlEditor_toolbar_popup_" + GetType().Name + "_button_" + name); //TODO: resources
        }

        protected string GetField(string name) {
            return GetResourceString("HtmlEditor_toolbar_popup_" + GetType().Name + "_field_" + name); //TODO: resources
        }

        protected string GetField(string name, string subName) {
            return GetField(name + "_" + subName);
        }

        protected override Style CreateControlStyle() {
            var style = new PopupStyle(ViewState, this);
            return style;
        }

        protected override void OnInit(EventArgs e) {
            _rm = new ResourceManager("ScriptResources.BaseScriptsResources", Assembly.GetExecutingAssembly());
            base.OnInit(e);

            if(isDesign) return;

            _iframe = new HtmlGenericControl("iframe");
            _iframe.Attributes.Add("scrolling", "no");
            _iframe.Attributes.Add("marginHeight", "0");
            _iframe.Attributes.Add("marginWidth", "0");
            _iframe.Attributes.Add("frameborder", "0");
            _iframe.Attributes.Add("tabindex", "-1");
            Controls.Add(_iframe);
        }

        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            if(_iframe != null) {
                var temp = (_savedCSS != null) ? _savedCSS : Style.Value;
                if(temp != null)
                    if(temp.Length > 0) _iframe.Style.Value = temp;

                if(Height.ToString().Length > 0)
                    _iframe.Style[HtmlTextWriterStyle.Height] = Height.ToString();

                if(Width.ToString().Length > 0)
                    _iframe.Style[HtmlTextWriterStyle.Width] = Width.ToString();

                _iframe.Attributes.Add("id", _iframe.ClientID);
            }
            Height = Height;
        }

        protected override void Render(HtmlTextWriter writer) {
            if(!isDesign)
                base.Render(writer);
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            descriptor.AddElementProperty("iframe", _iframe.ClientID);
            descriptor.AddProperty("registeredFields", RegisteredFieldsIds);
            descriptor.AddProperty("registeredHandlers", RegisteredHandlersIds);
        }

        private sealed class PopupStyle : Style {
            Popup _popup = null;

            public PopupStyle(StateBag state, Popup popup)
                : base(state) {
                _popup = popup;
            }

            protected override void FillStyleAttributes(CssStyleCollection attributes, IUrlResolutionService urlResolver) {
                _popup._savedCSS = attributes.Value;
                attributes.Add(HtmlTextWriterStyle.Position, "absolute");
                attributes.Add(HtmlTextWriterStyle.Top, "-2000px");
                attributes.Add(HtmlTextWriterStyle.Left, "-2000px");
            }
        }
    }

    [Serializable]
    public class RegisteredField {
        string _name = String.Empty;

        [NonSerialized]
        Control _control;

        public RegisteredField() {
        }

        public RegisteredField(string name, Control control) {
            _name = name;
            _control = control;
        }

        public string Name {
            get { return _name; }
            set { _name = value; }
        }

        public Control Control {
            get { return _control; }
            set { _control = value; }
        }
    }

}

#pragma warning restore 1591