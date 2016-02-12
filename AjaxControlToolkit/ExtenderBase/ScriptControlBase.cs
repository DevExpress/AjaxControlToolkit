#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;

namespace AjaxControlToolkit {

    [ClientScriptResource(null, Constants.BaseScriptName)]
    public class ScriptControlBase : ScriptControl, INamingContainer, IControlResolver, IPostBackDataHandler, ICallbackEventHandler, IClientStateManager {

        HtmlTextWriterTag _tagKey;
        bool _enableClientState;
        string _cachedClientStateFieldID;
        string _callbackArgument;
        ScriptManager _scriptManager;
        bool _renderingScript;


        public bool IsRenderingScript {
            get { return _renderingScript; }
        }

        public ScriptControlBase(HtmlTextWriterTag tag)
            : this(false, tag) {
        }

        protected ScriptControlBase(bool enableClientState, HtmlTextWriterTag tag) {
            _tagKey = tag;
            _enableClientState = enableClientState;
        }

        protected virtual bool SupportsClientState {
            get { return _enableClientState; }
        }

        protected virtual string SaveClientState() {
            return null;
        }

        protected override HtmlTextWriterTag TagKey {
            get { return _tagKey; }
        }

        protected string ClientStateFieldID {
            get {
                if(_cachedClientStateFieldID == null) {
                    _cachedClientStateFieldID = ClientID + "_ClientState";
                }
                return _cachedClientStateFieldID;
            }
        }

        protected virtual string ClientControlType {
            get {
                var attr = (ClientScriptResourceAttribute)TypeDescriptor.GetAttributes(this)[typeof(ClientScriptResourceAttribute)];
                return attr.ComponentType;
            }
        }

        protected ScriptManager ScriptManager {
            get {
                EnsureScriptManager();
                return _scriptManager;
            }
        }

        public override Control FindControl(string id) {
            var control = base.FindControl(id);
            if(control != null)
                return control;

            for(var container = NamingContainer; container != null; container = container.NamingContainer) {
                control = container.FindControl(id);
                if(control != null)
                    return control;
            }
            // NOTE: [rb] I'm not implementing ResolveControlID just yet. I prefer to use a colon (:) separated ID name to get to controls inside of a naming container
            // e.g. TargetControlID="LoginView1:LoginButton" works just as well
            return null;
        }

        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);

            ToolkitResourceManager.RegisterCssReferences(this);
        }

        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            EnsureID();
            EnsureScriptManager();

            if(SupportsClientState) {
                ScriptManager.RegisterHiddenField(this, ClientStateFieldID, SaveClientState());

                Page.RegisterRequiresPostBack(this);
            }
        }

        void EnsureScriptManager() {
            if(_scriptManager == null) {
                _scriptManager = ScriptManager.GetCurrent(Page);
                if(_scriptManager == null)
                    throw new HttpException("A ScriptManager is required on the page to use ASP.NET AJAX Script Components.");
            }
        }

        protected virtual bool LoadPostData(string postDataKey, NameValueCollection postCollection) {
            if(SupportsClientState) {
                var clientState = postCollection[ClientStateFieldID];
                if(!String.IsNullOrEmpty(clientState))
                    LoadClientState(clientState);
            }
            return false;
        }

        protected virtual void LoadClientState(string clientState) {
        }

        protected override IEnumerable<ScriptDescriptor> GetScriptDescriptors() {
            if(!Visible)
                return null;

            EnsureID();

            var descriptors = new List<ScriptDescriptor>();

            // build the default description
            var descriptor = new ScriptControlDescriptor(ClientControlType, ClientID);
            DescribeComponent(descriptor);
            descriptors.Add(descriptor);

            return descriptors;
        }

        protected virtual void DescribeComponent(ScriptComponentDescriptor descriptor) {
            try {
                _renderingScript = true;
                ComponentDescriber.DescribeComponent(this, new ScriptComponentDescriptorWrapper(descriptor), this.Page, this);
            } finally {
                _renderingScript = false;
            }

            if(SupportsClientState)
                descriptor.AddElementProperty("clientStateField", ClientStateFieldID);
        }

        protected override IEnumerable<ScriptReference> GetScriptReferences() {
            if(!Visible)
                return null;

            return ToolkitResourceManager.GetControlScriptReferences(GetType());
        }

        public Control ResolveControl(string controlId) {
            return FindControl(controlId);
        }

        bool IPostBackDataHandler.LoadPostData(string postDataKey, NameValueCollection postCollection) {
            return LoadPostData(postDataKey, postCollection);
        }

        void IPostBackDataHandler.RaisePostDataChangedEvent() {
            RaisePostDataChangedEvent();
        }

        protected virtual void RaisePostDataChangedEvent() {
        }

        string ICallbackEventHandler.GetCallbackResult() {
            return GetCallbackResult();
        }

        protected virtual string GetCallbackResult() {
            var argument = _callbackArgument;
            _callbackArgument = null;
            return ExecuteCallbackMethod(argument);
        }

        string ExecuteCallbackMethod(string callbackArgument) {
            var controlType = GetType();

            // Deserialize the callback JSON into CLR objects
            var js = new JavaScriptSerializer();
            var callInfo = js.DeserializeObject(callbackArgument) as Dictionary<string, object>;

            // Get the call information
            var methodName = (string)callInfo["name"];
            var args = (object[])callInfo["args"];
            var clientState = (string)callInfo["state"];

            // Attempt to load the client state
            var csm = this as IClientStateManager;
            if(csm != null && csm.SupportsClientState)
                csm.LoadClientState(clientState);

            // call the method
            object result = null;
            string error = null;
            try {
                // Find a matching static or instance method.  Only public methods can be invoked
                var mi = controlType.GetMethod(methodName, BindingFlags.Public | BindingFlags.Static | BindingFlags.Instance);
                if(mi == null)
                    throw new MissingMethodException(controlType.FullName, methodName);

                // Verify that the method has the corrent number of parameters as well as the ExtenderControlMethodAttribute
                var methodParams = mi.GetParameters();
                var methAttr = (ExtenderControlMethodAttribute)Attribute.GetCustomAttribute(mi, typeof(ExtenderControlMethodAttribute));
                if(methAttr == null || !methAttr.IsScriptMethod || args.Length != methodParams.Length)
                    throw new MissingMethodException(controlType.FullName, methodName);

                // Convert each argument to the parameter type if possible
                // NOTE: I'd rather have the ObjectConverter from within System.Web.Script.Serialization namespace for this
                var targetArgs = new object[args.Length];
                for(var i = 0; i < targetArgs.Length; i++) {
                    if(args[i] == null)
                        continue;
                    targetArgs[i] = Convert.ChangeType(args[i], methodParams[i].ParameterType, CultureInfo.InvariantCulture);
                }
                result = mi.Invoke(this, targetArgs);
            } catch(Exception ex) {
                // Catch the exception information to relay back to the client
                if(ex is TargetInvocationException) {
                    ex = ex.InnerException;
                }
                error = ex.GetType().FullName + ":" + ex.Message;
            }

            // return the result
            var resultInfo = new Dictionary<string, object>();
            if(error == null) {
                resultInfo["result"] = result;
                if(csm != null && csm.SupportsClientState)
                    resultInfo["state"] = csm.SaveClientState();
            } else {
                resultInfo["error"] = error;
            }

            // Serialize the result info into JSON
            return js.Serialize(resultInfo);
        }

        void ICallbackEventHandler.RaiseCallbackEvent(string eventArgument) {
            RaiseCallbackEvent(eventArgument);
        }

        protected virtual void RaiseCallbackEvent(string eventArgument) {
            _callbackArgument = eventArgument;
        }

        bool IClientStateManager.SupportsClientState {
            get { return SupportsClientState; }
        }

        void IClientStateManager.LoadClientState(string clientState) {
            LoadClientState(clientState);
        }

        string IClientStateManager.SaveClientState() {
            return SaveClientState();
        }
    }
}

#pragma warning restore 1591