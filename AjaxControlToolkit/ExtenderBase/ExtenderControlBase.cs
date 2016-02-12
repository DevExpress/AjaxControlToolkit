#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    // 1) It performs the hookup between an Extender (server) control and the behavior it instantiates
    // 2) It manages interacting with the ScriptManager to get the right scripts loaded
    // 3) It adds some debugging features like ValidationScript and ScriptPath
    [Themeable(true)]
    [ClientScriptResource(null, Constants.BaseScriptName)]
    public abstract class ExtenderControlBase : ExtenderControl, IControlResolver {
        private Dictionary<string, Control> _findControlHelperCache = new Dictionary<string, Control>();
        private string _clientState;
        private bool _enableClientState;
        private bool _loadedClientStateValues;

        // Called when the ExtenderControlBase fails to locate a control referenced by a TargetControlID.
        // In this event, user code is given an opportunity to find the control.        
        public event ResolveControlEventHandler ResolveControlID;

        [DefaultValue(true)]
        public bool Enabled {
            get {
                return GetPropertyValue("Enabled", true);
            }
            set {
                SetPropertyValue("Enabled", value);
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string ClientState {
            get { return _clientState; }
            set { _clientState = value; }
        }

        [ExtenderControlProperty()]
        [ClientPropertyName("id")]
        public string BehaviorID {
            get {
                string id = GetPropertyValue("BehaviorID", "");
                return (string.IsNullOrEmpty(id) ? ClientID : id);
            }
            set {
                SetPropertyValue("BehaviorID", value);
            }
        }

        private string GetClientStateFieldID() {
            return string.Format(CultureInfo.InvariantCulture, "{0}_ClientState", ID);
        }

        // On Init we load target properties values and process data-binding handlers.
        protected override void OnInit(EventArgs e) {
            if(EnableClientState) {
                CreateClientStateField();
            }
            Page.PreLoad += new EventHandler(Page_PreLoad);
            base.OnInit(e);
        }

        void Page_PreLoad(object sender, EventArgs e) {
            // Needs to happen sometime after ASP.NET populates the control
            // values from the postback but sometime before Load so that
            // the values will be available to controls then. PreLoad is
            // therefore the obvious choice.
            LoadClientStateValues();
        }

        private HiddenField CreateClientStateField() {
            // add a hidden field so we'll pick up the value
            HiddenField field = new HiddenField();
            field.ID = GetClientStateFieldID();
            Controls.Add(field);
            ClientStateFieldID = field.ID;
            return field;
        }

        // Loads the values for each of the TargetProperties classes coming back from a postback.
        private void LoadClientStateValues() {
            if(EnableClientState && !string.IsNullOrEmpty(ClientStateFieldID)) {
                HiddenField hiddenField = (HiddenField)NamingContainer.FindControl(ClientStateFieldID);

                if((hiddenField != null) && !string.IsNullOrEmpty(hiddenField.Value)) {
                    ClientState = hiddenField.Value;
                }
            }

            if(null != ClientStateValuesLoaded) {
                ClientStateValuesLoaded(this, EventArgs.Empty);
            }

            _loadedClientStateValues = true;
        }

        protected event EventHandler ClientStateValuesLoaded;

        // Save any values in the TargetProperties objects out to client state so they are available
        // on the client side.
        private void SaveClientStateValues() {
            if(EnableClientState) {
                HiddenField hiddenField = null;

                // if we don't have a value here, this properties
                // object may have been created dynamically in code
                // so we create the field on demand.
                //
                if(string.IsNullOrEmpty(ClientStateFieldID)) {
                    hiddenField = CreateClientStateField();
                } else {
                    hiddenField = (HiddenField)NamingContainer.FindControl(ClientStateFieldID);
                }

                if(hiddenField != null) {
                    hiddenField.Value = ClientState;
                }
            }
        }

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty()]
        [IDReferenceProperty(typeof(HiddenField))]
        [DefaultValue("")]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string ClientStateFieldID {
            get { return GetPropertyValue("ClientStateFieldID", ""); }
            set { SetPropertyValue("ClientStateFieldID", value); }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool EnableClientState {
            get { return _enableClientState; }
            set { _enableClientState = value; }
        }

        // The type of the client component - e.g. "ConfirmButtonBehavior"
        protected virtual string ClientControlType {
            get {
                ClientScriptResourceAttribute attr = (ClientScriptResourceAttribute)TypeDescriptor.GetAttributes(this)[typeof(ClientScriptResourceAttribute)];

                return attr.ComponentType;
            }
        }

        public Control ResolveControl(string controlId) {
            return FindControl(controlId);
        }

        public override Control FindControl(string id) {

            // Use FindControlHelper so that more complete searching and OnResolveControlID will be used
            return FindControlHelper(id);
        }

        protected Control TargetControl {
            get {
                return FindControlHelper(TargetControlID);
            }
        }

        // This helper automates locating a control by ID.
        // It calls FindControl on the NamingContainer, then the Page.  If that fails, it fires the resolve event.
        protected Control FindControlHelper(string id) {
            Control c = null;
            if(_findControlHelperCache.ContainsKey(id)) {
                c = _findControlHelperCache[id];
            } else {
                c = base.FindControl(id);  // Use "base." to avoid calling self in an infinite loop
                Control nc = NamingContainer;
                while((null == c) && (null != nc)) {
                    c = nc.FindControl(id);
                    nc = nc.NamingContainer;
                }
                if(null == c) {
                    // Note: props MAY be null, but we're firing the event anyway to let the user
                    // do the best they can
                    ResolveControlEventArgs args = new ResolveControlEventArgs(id);

                    OnResolveControlID(args);
                    c = args.Control;

                }
                if(null != c) {
                    _findControlHelperCache[id] = c;
                }
            }
            return c;
        }

        // Fired when the extender can not locate it's target control. This may happen if the 
        // target control is in a different naming container.
        // By handling this event, user code can locate the target and return it via the ResolveControlEventArgs.Control property.
        protected virtual void OnResolveControlID(ResolveControlEventArgs e) {
            if(ResolveControlID != null) {
                ResolveControlID(this, e);
            }
        }

        protected override IEnumerable<ScriptDescriptor> GetScriptDescriptors(Control targetControl) {
            if(!Enabled || !targetControl.Visible)
                return null;

            EnsureValid();

            ScriptBehaviorDescriptor descriptor = new ScriptBehaviorDescriptor(ClientControlType, targetControl.ClientID);

            // render the attributes for this element
            RenderScriptAttributes(descriptor);

            // render profile bindings
            //RenderProfileBindings(descriptor);

            // render any child scripts we need to.
            RenderInnerScript(descriptor);

            return new List<ScriptDescriptor>(new ScriptDescriptor[] { descriptor });
        }

        // Called during rendering to give derived classes a chance to validate their properties
        public virtual void EnsureValid() {
            CheckIfValid(true);
        }

        protected virtual bool CheckIfValid(bool throwException) {
            bool valid = true;
            foreach(PropertyDescriptor prop in TypeDescriptor.GetProperties(this)) {
                // If the property is tagged with RequiredPropertyAttribute, but doesn't have a value, throw an exception
                if((null != prop.Attributes[typeof(RequiredPropertyAttribute)]) && ((null == prop.GetValue(this)) || !prop.ShouldSerializeValue(this))) {
                    valid = false;
                    if(throwException) {
                        throw new ArgumentException(string.Format(CultureInfo.CurrentCulture, "{0} missing required {1} property value for {2}.", GetType().ToString(), prop.Name, ID), prop.Name);
                    }
                }
            }
            return valid;
        }

        // Walks each of the properties in the TargetProperties object and renders script for them.
        protected virtual void RenderScriptAttributes(ScriptBehaviorDescriptor descriptor) {
            try {
                ComponentDescriber.DescribeComponent(this, new ScriptComponentDescriptorWrapper(descriptor), this.Page, this);
            } finally { }
        }

        // Allows generation of markup within the behavior declaration in XML script
        protected virtual void RenderInnerScript(ScriptBehaviorDescriptor descriptor) {
        }

        protected override IEnumerable<ScriptReference> GetScriptReferences() {
            if(!Enabled)
                return null;

            return ToolkitResourceManager.GetControlScriptReferences(GetType());
        }

        protected V GetPropertyValue<V>(string propertyName, V nullValue) {
            if(ViewState[propertyName] == null) {
                return nullValue;
            }
            return (V)ViewState[propertyName];
        }

        protected void SetPropertyValue<V>(string propertyName, V value) {
            ViewState[propertyName] = value;
        }

        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            RegisterLocalization();

            if(Enabled && TargetControl.Visible) {
                SaveClientStateValues();
            }
        }

        void RegisterLocalization() {
            var localeKey = new Localization().GetLocaleKey();
            if(String.IsNullOrEmpty(localeKey))
                return;

            var script = String.Format(@"Sys.Extended.UI.Localization.SetLocale(""{0}"");", localeKey);
            Page.ClientScript.RegisterStartupScript(GetType(), "f93b988bab7e44ffbcff635ee599ade2", script, true);
        }

        protected override void OnLoad(EventArgs e) {
            if(!_loadedClientStateValues) {
                LoadClientStateValues();
            }

            base.OnLoad(e);

            ToolkitResourceManager.RegisterCssReferences(this);
        }
    }

}

#pragma warning restore 1591