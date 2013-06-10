

using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using System.Web.Script;
using System.Collections;
using System.Diagnostics;
using System.Drawing;

[assembly: System.Web.UI.WebResource(AjaxControlToolkit.Constants.BaseScriptResourceName, "text/javascript")]
[assembly: System.Web.UI.WebResource(AjaxControlToolkit.Constants.BaseScriptResourceNameDebug, "text/javascript")]
[assembly: ScriptResource(AjaxControlToolkit.Constants.BaseScriptResourceName, "ScriptResources.BaseScriptsResources.resources", "Sys.Extended.UI.Resources")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// This is the main class for extenders.  It has several main jobs:
    /// 
    /// 1) It performs the hookup between an Extender (server) control and the behavior it instantiates
    /// 2) It manages interacting with the ScriptManager to get the right scripts loaded
    /// 3) It adds some debugging features like ValidationScript and ScriptPath
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="C"></typeparam>
    /// 
    [ParseChildren(true)]
    [PersistChildren(false)]
    [ClientScriptResource(null, Constants.BaseScriptResourceName)]
    [Themeable(true)]
    public abstract class ExtenderControlBase : ExtenderControl, IControlResolver
    {
        private Dictionary<string, Control> _findControlHelperCache = new Dictionary<string, Control>();
        private bool _renderingScript;
        private bool _loadedClientStateValues;

        // Make SkinID browsable since Themeable(true) is set for this class
        [Browsable(true)]
        public override string SkinID
        {
            get { return base.SkinID; }
            set { base.SkinID = value; }
        }

        /// <summary>
        /// Called when the ExtenderControlBase fails to locate a control referenced by a TargetControlID.
        /// In this event, user code is given an opportunity to find the control.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public event ResolveControlEventHandler ResolveControlID;

        /// <summary>
        /// For debugging - set this to false if you don't want people being able to specify a script path
        /// to redirect the script loading for the extender.
        /// </summary>
        protected virtual bool AllowScriptPath
        {
            get
            {
                return true;
            }
        }
        
        /// <summary>
        /// The type of the client component - e.g. "ConfirmButtonBehavior"
        /// </summary>        
        protected virtual string ClientControlType
        {
            get
            {               
                ClientScriptResourceAttribute attr = (ClientScriptResourceAttribute)TypeDescriptor.GetAttributes(this)[typeof(ClientScriptResourceAttribute)];

                return attr.ComponentType;
            }
        }

        private bool _isDisposed;

        public bool Enabled {
            get {
                if (_isDisposed)
                    return false;

                return GetPropertyValue("Enabled", true);
            }
            set {
                SetPropertyValue("Enabled", value);
            }
        }

        /// <summary>
        /// Property for determining if script rendering is currently underway.  This is used to determine
        /// if Script or markup is being rendered.
        /// </summary>
        protected bool IsRenderingScript
        {
            get
            {
                return _renderingScript;
            }
        }
  

        /// <summary>
        /// For debugging - setting this causes the extender to load the specified script instead of the one out of the resources.  This
        /// lets you set breakpoints and modify the script without rebuilding, etc.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        public string ScriptPath
        {
            get
            {
                return GetPropertyValue("ScriptPath", (string)null);
            }
            set
            {
                if (!AllowScriptPath)
                {
                    throw new InvalidOperationException("This class does not allow setting of ScriptPath.");
                }

                SetPropertyValue("ScriptPath", value);
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1063:ImplementIDisposableCorrectly", Justification = "Using correct base class implementation and simply setting a flag on the way")]
        public override void Dispose()
        {
            this._isDisposed = true;
            base.Dispose();
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Walks the various script types and prepares to notify the ScriptManager to load them.
        /// 1) Required scripts such as ASP.NET AJAX Scripts or other components
        /// 2) Scripts for this Extender/Behavior
        /// </summary>
        internal IEnumerable<ScriptReference> EnsureScripts(/*ScriptManager scriptManager*/) {

            List<ScriptReference> scriptRefs = new List<ScriptReference>();

            scriptRefs.AddRange(ScriptObjectBuilder.GetScriptReferences(GetType(), (null != ScriptPath)));
            string scriptPath = ScriptPath;

            if (!string.IsNullOrEmpty(scriptPath))
            {
                scriptRefs.Add(new ScriptReference(scriptPath));
            }

            return scriptRefs;
        }
     
        /// <summary>
        /// This helper automates locating a control by ID.
        /// 
        /// It calls FindControl on the NamingContainer, then the Page.  If that fails,
        /// it fires the resolve event.
        /// </summary>
        /// <param name="id">The ID of the control to find</param>
        /// <param name="props">The TargetProperties class associated with that control</param>
        /// <returns></returns>
        protected Control FindControlHelper(string id)
        {
            Control c = null;
            if (_findControlHelperCache.ContainsKey(id))
            {
                c = _findControlHelperCache[id];
            }
            else
            {
                c = base.FindControl(id);  // Use "base." to avoid calling self in an infinite loop
                Control nc = NamingContainer;
                while ((null == c) && (null != nc))
                {
                    c = nc.FindControl(id);
                    nc = nc.NamingContainer;
                }
                if (null == c)
                {
                    // Note: props MAY be null, but we're firing the event anyway to let the user
                    // do the best they can
                    ResolveControlEventArgs args = new ResolveControlEventArgs(id);
                    
                    OnResolveControlID(args);
                    c = args.Control;
                
                }
                if (null != c)
                {
                    _findControlHelperCache[id] = c;
                }
            }
            return c;
        }

        public override Control FindControl(string id)
        {
            // Use FindControlHelper so that more complete searching and OnResolveControlID will be used
            return FindControlHelper(id);
        }

        protected Control TargetControl
        {
            get
            {
                return FindControlHelper(TargetControlID);
            }
        }
                
        [ExtenderControlProperty()]
        [ClientPropertyName("id")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string BehaviorID
        {
            get
            {
                string id = GetPropertyValue("BehaviorID", "");
                return (string.IsNullOrEmpty(id) ? ClientID : id);
            }
            set
            {
                SetPropertyValue("BehaviorID", value);
            }
        }

        /// <summary>
        /// Gets the ClientID for a given control, based on it's ID
        /// </summary>
        /// <param name="controlId">The ID of the Control</param>
        /// <param name="props">The associated TargetProperties object</param>
        /// <returns></returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        protected string GetClientID(string controlId)
        {
            Control c = FindControlHelper(controlId);

            if (c != null)
            {
                controlId = c.ClientID;
            }

            return controlId;
        }

        /// <summary>
        /// Helper to generate a clientState ID
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        private string GetClientStateFieldID()
        {
            return string.Format(CultureInfo.InvariantCulture, "{0}_ClientState", ID);
        }

        /// <summary>
        /// On Init we load target properties values and process data-binding handlers.
        /// </summary>
        /// <param name="e"></param>
        protected override void OnInit(EventArgs e)
        {
            if (EnableClientState)
            {
                CreateClientStateField();
            }
            Page.PreLoad += new EventHandler(Page_PreLoad);
            base.OnInit(e);
        }

        /// <summary>
        /// Event handler for the Page.PreLoad event
        /// </summary>
        void Page_PreLoad(object sender, EventArgs e)
        {
            // Needs to happen sometime after ASP.NET populates the control
            // values from the postback but sometime before Load so that
            // the values will be available to controls then. PreLoad is
            // therefore the obvious choice.
            LoadClientStateValues();
        }

        /// <summary>
        /// Override OnLoad to call LoadClientStateValues if it hasn't already been called
        /// </summary>
        /// <remarks>
        /// This can be the case if an extender is within a template - the page lifecycle
        /// catch-up seems to take place after Page.PreLoad has already fired
        /// </remarks>
        /// <param name="e">event args</param>
        protected override void OnLoad(EventArgs e)
        {
            if (!_loadedClientStateValues)
            {
                LoadClientStateValues();
            }
            base.OnLoad(e);

            ScriptObjectBuilder.RegisterCssReferences(this);
        }

        /// <summary>
        /// This creates the field for any client state and sets up
        /// it's name.
        /// </summary>
        /// <returns></returns>
        private HiddenField CreateClientStateField()
        {
            // add a hidden field so we'll pick up the value
            //
            HiddenField field = new HiddenField();
            field.ID = GetClientStateFieldID();
            Controls.Add(field);
            ClientStateFieldID = field.ID;
            return field;
        }

        /// <summary>
        /// Loads the values for each of the TargetProperties classes coming back from a postback.
        /// </summary>
        private void LoadClientStateValues()
        {
            if (EnableClientState && !string.IsNullOrEmpty(ClientStateFieldID))
            {
                HiddenField hiddenField = (HiddenField)NamingContainer.FindControl(ClientStateFieldID);

                if ((hiddenField != null) && !string.IsNullOrEmpty(hiddenField.Value))
                {
                    ClientState = hiddenField.Value;
                }
            }

            if (null != ClientStateValuesLoaded)
            {
                ClientStateValuesLoaded(this, EventArgs.Empty);
            }

            _loadedClientStateValues = true;
        }

        /// <summary>
        /// Fired when the ClientState values have been loaded from the page
        /// </summary>
        protected event EventHandler ClientStateValuesLoaded;

        protected override void Render(HtmlTextWriter writer)
        {
            // Use ASP.NET's mechanism for ensuring Controls are within a form
            // (since unexpected behavior can occur when ExtenderControls are not)
            if (null != Page)
            {
                Page.VerifyRenderingInServerForm(this);
            }
            base.Render(writer);
        }

        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);

            if (Enabled && TargetControl.Visible)
            {
                SaveClientStateValues();
            }
        }

        /// <summary>
        /// Fired when the extender can not locate it's target control. This may happen if the target control is in a different naming container.
        /// By handling this event, user code can locate the target and return it via the ResolveControlEventArgs.Control property.
        /// </summary>
        /// <param name="e"></param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        protected virtual void OnResolveControlID(ResolveControlEventArgs e)
        {
            if (ResolveControlID != null)
            {
                ResolveControlID(this, e);
            }
        }

        /// <summary>
        /// Allows generation of markup within the behavior declaration in XML script
        /// </summary>
        protected virtual void RenderInnerScript(ScriptBehaviorDescriptor descriptor)
        {
        }

        /// <summary>
        /// Walks each of the properties in the TargetProperties object and renders script for them.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1011:ConsiderPassingBaseTypesAsParameters", Justification = "Child classes may want to use ScriptBehaviorDescriptor")]
        protected virtual void RenderScriptAttributes(ScriptBehaviorDescriptor descriptor)
        {
            try
            {
                _renderingScript = true;
                ScriptObjectBuilder.DescribeComponent(this, descriptor, this, this);
            }
            finally
            {
                _renderingScript = false;
            }           
        }

        protected override IEnumerable<ScriptDescriptor> GetScriptDescriptors(Control targetControl)
        {
            if (!Enabled || !targetControl.Visible)
                return null;

            EnsureValid();

            ScriptBehaviorDescriptor descriptor =
                new ScriptBehaviorDescriptor(ClientControlType, targetControl.ClientID);

            // render the attributes for this element
            //
            RenderScriptAttributes(descriptor);

            // render profile bindings
            //
            //RenderProfileBindings(descriptor);

            // render any child scripts we need to.
            //
            RenderInnerScript(descriptor);

            return new List<ScriptDescriptor>(new ScriptDescriptor[] { descriptor });
        }

        protected override IEnumerable<ScriptReference> GetScriptReferences()
        {
            if (Enabled) {
                return EnsureScripts();
            }
            return null;
        }

        /// <summary>
        /// Save any values in the TargetProperties objects out to client state so they are available
        /// on the client side.
        /// </summary>
        private void SaveClientStateValues()
        {
            if (EnableClientState)
            {
                HiddenField hiddenField = null;

                // if we don't have a value here, this properties
                // object may have been created dynamically in code
                // so we create the field on demand.
                //
                if (string.IsNullOrEmpty(ClientStateFieldID))
                {
                    hiddenField = CreateClientStateField();
                }
                else
                {
                    hiddenField = (HiddenField)NamingContainer.FindControl(ClientStateFieldID);
                }

                if (hiddenField != null)
                {
                    hiddenField.Value = ClientState;
                }
            }
        }

        private bool ShouldSerializeBehaviorID()
        {
            return IsRenderingScript || 0 != String.Compare(ClientID, BehaviorID, StringComparison.OrdinalIgnoreCase);
        }        

        /// <summary>
        /// Serializes a single property value out to it's string representation.
        /// </summary>
        /// <param name="props">The TargetProperties object</param>
        /// <param name="prop">The property</param>
        /// <returns></returns>
        [Obsolete("Replaced by a call to ScriptObjectBuilder")]
        protected object SerializeProperty(PropertyDescriptor prop)
        {
            return SerializeProperty(prop, false);
        }

        /// <summary>
        /// Serializes a given property's value to a string.  This method owns checking
        /// that the property should actually be serialized, as well as doing the work
        /// to convert the value to a string using the appropriate TypeConverter.
        /// </summary>
        /// <param name="force">True to force serialization</param>
        /// <returns></returns>
        [Obsolete("Replaced by a call to ScriptObjectBuilder")]
        protected virtual object SerializeProperty(PropertyDescriptor prop, bool force)
        {
            if (prop == null) return null;

            // First, get the current value.
            //
            object val = prop.GetValue(this);

            // check to see if we should bother to serialize this.
            //
            if (val != null)
            {
                bool serialize = prop.ShouldSerializeValue(this);

                if (serialize)
                {
                    DesignerSerializationVisibilityAttribute sv = (DesignerSerializationVisibilityAttribute)prop.Attributes[typeof(DesignerSerializationVisibilityAttribute)];

                    if (sv != null && sv.Visibility == DesignerSerializationVisibility.Hidden)
                    {
                        // If a property is marked as hidden, we may just be hiding it from the ASPX serializer
                        // in the designer.  In that case, we've got a list of "forced" properties that will
                        // ignore that value.
                        //
                        serialize = (-1 != Array.IndexOf<string>(ForceSerializationProps, prop.Name));
                    }
                }

                if (force || serialize) {
                    bool convertToString = !prop.PropertyType.IsPrimitive && !(prop.PropertyType.IsEnum);

                    // Convert to a string via the TypeConverter.
                    // Use InvariantCulture so that properties always serialize the same regardless
                    // of the host web server's culture.
                    // 
                    // If the property type is a System.Drawing.Color, use the ColorTranslator to convert
                    // the value to an HTML color string (#rrggbb)
                    //
                    if (convertToString) {
                        if (prop.PropertyType == typeof(Color))
                        {
                            val = ColorTranslator.ToHtml((Color)val);
                        }
                        else
                        {
                            TypeConverter tc = prop.Converter;
                            val = tc.ConvertToString(null, CultureInfo.InvariantCulture, val);
                        }
                    }

                    // if this thing is a control reference,
                    // then switch the ID out for the client ID
                    //
                    if (prop.PropertyType == typeof(string)) {

                        // If the property has the ResolveClientUrlAttribute attribute,
                        // call ResolveClientUrl to fix up any virtual paths
                        if (null != prop.Attributes[typeof(UrlPropertyAttribute)]) {
                            val = ResolveClientUrl((string)val);
                        }
                    }
                } else {
                    return null;
                }
            }
            return val;
        }

        #region Extender Helper Methods
        internal static string[] ForceSerializationProps = new string[] { "ClientStateFieldID" };

        private bool _enableClientState;
        private string _clientState;
        private ProfilePropertyBindingCollection _profileBindings;

        [Browsable(false), Obsolete("WARNING: ProfileBindings are disabled for this Toolkit release pending technical issues.  We hope to re-enable this in an upcoming release")]        
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]        
        public ProfilePropertyBindingCollection ProfileBindings {
            get {
                if (_profileBindings == null) {
                    _profileBindings = new ProfilePropertyBindingCollection();
                }
                return _profileBindings;
            }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        private bool ShouldSerializeProfileBindings() {
            return false;
            //return _profileBindings != null &&  _profileBindings.Count > 0;
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string ClientState {
            get {
                return _clientState;
            }
            set {
                _clientState = value;
                //OnChanged(EventArgs.Empty);
            }
        }

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty()]
        [IDReferenceProperty(typeof(HiddenField))]
        [DefaultValue("")]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string ClientStateFieldID 
        {
            get { return GetPropertyValue("ClientStateFieldID", ""); }
            set { SetPropertyValue("ClientStateFieldID", value); }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool EnableClientState {
            get {
                return _enableClientState;
            }
            set {
                _enableClientState = value;
            }
        }


        [EditorBrowsable(EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public bool ShouldSerializeClientStateFieldID() {
            return EnableClientState;
        }

        /// <summary>
        /// Suppresses the "unused parameter" warning of code analysis for cases
        /// where a parameter is deliberately unused
        /// </summary>
        /// <param name="unused">unused parameter</param>
        protected static void SuppressUnusedParameterWarning(object unused) {
            if (null != unused)
            {
                unused.GetType();  // Do nothing assignment
            }
        }
        #endregion

        #region PropertySupportMethods
        /// <summary>
        /// Checks if all properties are valid
        /// </summary>
        /// <param name="throwException">true iff an exception is to be thrown for invalid parameters</param>
        /// <returns>true iff all parameters are valid</returns>
        protected virtual bool CheckIfValid(bool throwException) {
            bool valid = true;
            foreach (PropertyDescriptor prop in TypeDescriptor.GetProperties(this)) {
                // If the property is tagged with RequiredPropertyAttribute, but doesn't have a value, throw an exception
                if ((null != prop.Attributes[typeof(RequiredPropertyAttribute)]) && ((null == prop.GetValue(this)) || !prop.ShouldSerializeValue(this))) {
                    valid = false;
                    if (throwException) {
                        throw new ArgumentException(string.Format(CultureInfo.CurrentCulture, "{0} missing required {1} property value for {2}.", GetType().ToString(), prop.Name, ID), prop.Name);
                    }
                }
            }
            return valid;
        }

        /// <summary>
        /// Called during rendering to give derived classes a chance to validate their properties
        /// </summary>
        /// <remarks>
        /// If the properties aren't valid, an exception of type ArgumentException should be thrown
        /// </remarks>
        public virtual void EnsureValid() {
            CheckIfValid(true);
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "V", Justification="V stands for value")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1715:IdentifiersShouldHaveCorrectPrefix", MessageId = "T", Justification = "V stands for value")]
        protected V GetPropertyValue<V>(string propertyName, V nullValue)
        {
            if (ViewState[propertyName] == null)
            {
                return nullValue;
            }
            return (V)ViewState[propertyName];
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "V", Justification = "V stands for value")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1715:IdentifiersShouldHaveCorrectPrefix", MessageId = "T", Justification = "V stands for value")]
        protected void SetPropertyValue<V>(string propertyName, V value)
        {
            ViewState[propertyName] = value;
        }

        [Obsolete("Use GetPropertyValue<V> instead")]
        protected string GetPropertyStringValue(string propertyName)
        {
            return GetPropertyValue<string>(propertyName, "");
        }

        [Obsolete("Use SetPropertyValue<V> instead")]
        protected void SetPropertyStringValue(string propertyName, string value)
        {
            SetPropertyValue<string>(propertyName, value);
        }

        [Obsolete("Use GetPropertyValue<V> instead")]
        protected int GetPropertyIntValue(string propertyName)
        {
            return GetPropertyValue<int>(propertyName, 0);
        }

        [Obsolete("Use SetPropertyValue<V> instead")]
        protected void SetPropertyIntValue(string propertyName, int value)
        {
            SetPropertyValue<int>(propertyName, value);
        }

        [Obsolete("Use GetPropertyValue<V> instead")]
        protected bool GetPropertyBoolValue(string propertyName)
        {
            return GetPropertyValue<bool>(propertyName, false);
        }

        [Obsolete("Use SetPropertyValue<V> instead")]
        protected void SetPropertyBoolValue(string propertyName, bool value)
        {
            SetPropertyValue<bool>(propertyName, value);
        }

        #endregion

        #region [ IControlResolver Members ]

        public Control ResolveControl(string controlId)
        {
            return FindControl(controlId);
        }

        #endregion
    }
}
