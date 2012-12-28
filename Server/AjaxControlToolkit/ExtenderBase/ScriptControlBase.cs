

using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.Script.Serialization;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Reflection;
using System.Security;

namespace AjaxControlToolkit
{
    /// <summary>
    /// ScriptControl is used to define complex custom controls which support ASP.NET AJAX script extensions
    /// </summary>
    [ClientScriptResource(null, Constants.BaseScriptResourceName)]
    public class ScriptControlBase : ScriptControl, INamingContainer, IControlResolver, IPostBackDataHandler, ICallbackEventHandler, IClientStateManager
    {
        #region [ Fields ]

        private ScriptManager _scriptManager;
        private bool _enableClientState;
        private string _cachedClientStateFieldID;
        private string _callbackArgument;
        private string _tagName;
        private HtmlTextWriterTag _tagKey;
        private bool _renderingScript;

        #endregion

        #region [ Constructor ]

        /// <summary>
        /// Initializes a new ScriptControl
        /// </summary>
        /// <param name="tag"></param>
        public ScriptControlBase(HtmlTextWriterTag tag)
            : this(false, tag)
        {
        }

        /// <summary>
        /// Initializes a new ScriptControl
        /// </summary>
        protected ScriptControlBase()
            : this(false)
        {
        }

        /// <summary>
        /// Initializes a new ScriptControl
        /// </summary>
        /// <param name="tag"></param>
        protected ScriptControlBase(string tag)
            : this(false, tag)
        {
        }

        /// <summary>
        /// Initializes a new ScriptControl
        /// </summary>
        /// <param name="enableClientState"></param>
        protected ScriptControlBase(bool enableClientState)
        {
            _enableClientState = enableClientState;
        }

        /// <summary>
        /// Initializes a new ScriptControl
        /// </summary>
        /// <param name="enableClientState"></param>
        /// <param name="tag"></param>
        protected ScriptControlBase(bool enableClientState, HtmlTextWriterTag tag)
        {
            _tagKey = tag;
            _enableClientState = enableClientState;
        }

        /// <summary>
        /// Initializes a new ScriptControl
        /// </summary>
        /// <param name="enableClientState"></param>
        /// <param name="tag"></param>
        protected ScriptControlBase(bool enableClientState, string tag)
        {
            _tagKey = HtmlTextWriterTag.Unknown;
            _tagName = tag;
            _enableClientState = enableClientState;
        }

        #endregion

        #region [ Properties ]

        /// <summary>
        /// For debugging - setting this causes the extender to load the specified script instead of the one out of the resources.  This
        /// lets you set breakpoints and modify the script without rebuilding, etc.
        /// </summary>
        /// <remarks>
        /// Note to inheritors: If you do not wish the user to set the script path, override script path and throw a NotSupportedException on set.  Also decorate the ScriptPath attribute with a [Browsable(false)] and [EditorBrowsableState(EditorBrowsableState.Never)]
        /// </remarks>
        [DefaultValue("")]
        public virtual string ScriptPath
        {
            get { return (string)(ViewState["ScriptPath"] ?? string.Empty); }
            set { ViewState["ScriptPath"] = value; }
        }

        /// <summary>
        /// The script type to use for the ScriptControl
        /// </summary>
        protected virtual string ClientControlType
        {
            get
            {
                ClientScriptResourceAttribute attr = (ClientScriptResourceAttribute)TypeDescriptor.GetAttributes(this)[typeof(ClientScriptResourceAttribute)];
                return attr.ComponentType;
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
        /// Whether this control supports ClientState
        /// </summary>
        /// <remarks>
        /// Note to inheritors: You should either pass true to the constructor for enableClientState or override this property to enable client state for inherited controls.
        /// </remarks>
        protected virtual bool SupportsClientState
        {
            get { return _enableClientState; }
        }

        /// <summary>
        /// Gets the ScriptManager for the page
        /// </summary>
        protected ScriptManager ScriptManager
        {
            get
            {
                EnsureScriptManager();
                return _scriptManager;
            }
        }

        /// <summary>
        /// The ID of the ClientState field
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        protected string ClientStateFieldID
        {
            get
            {
                if (_cachedClientStateFieldID == null)
                {
                    _cachedClientStateFieldID = ClientID + "_ClientState";
                }
                return _cachedClientStateFieldID;
            }
        }

        /// <summary>
        /// Gets the tag key used when rendering the outer wrapper element for this user control
        /// </summary>
        protected override HtmlTextWriterTag TagKey
        {
            get { return _tagKey; }
        }

        /// <summary>
        /// Gets the tag name used when rendering the outer wrapper element for this user control
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase", Justification="Avoiding possibly breaking change")]
        protected override string TagName
        {
            get
            {
                if (_tagName == null && TagKey != HtmlTextWriterTag.Unknown)
                {
                    _tagName = Enum.Format(typeof(HtmlTextWriterTag), TagKey, "G").ToLower(CultureInfo.InvariantCulture);
                }
                return _tagName;
            }
        }

        #endregion

        #region [ Methods ]

        /// <summary>
        /// Ensures a ScriptManager exists on the Page for this Control
        /// </summary>
        private void EnsureScriptManager()
        {
            if (_scriptManager == null)
            {
                _scriptManager = ScriptManager.GetCurrent(Page);
                if (_scriptManager == null)
                {
#if NET4 || NET45
                    throw new HttpException(Properties.Resources_NET4.E_NoScriptManager);
#else
                    throw new HttpException(Properties.Resources.E_NoScriptManager);
#endif
                }
            }
        }

        /// <summary>
        /// Finds a control reference by its ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public override Control FindControl(string id)
        {
            Control control = base.FindControl(id);
            if (control != null)
            {
                return control;
            }
            for (Control container = NamingContainer; container != null; container = container.NamingContainer)
            {
                control = container.FindControl(id);
                if (control != null)
                {
                    return control;
                }
            }
            // NOTE: [rb] I'm not implementing ResolveControlID just yet. I prefer to use a colon (:) seperated ID name to get to controls inside of a naming container
            // e.g. TargetControlID="LoginView1:LoginButton" works just as well
            return null;
        }

        /// <summary>
        /// Handles OnLoad
        /// </summary>
        /// <param name="e">event args</param>
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            ScriptObjectBuilder.RegisterCssReferences(this);
        }

        /// <summary>
        /// Fires the PreRender event
        /// </summary>
        /// <param name="e"></param>
        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);

            EnsureID();

            EnsureScriptManager();

            if (SupportsClientState)
            {
                ScriptManager.RegisterHiddenField(this, ClientStateFieldID, SaveClientState());

                Page.RegisterRequiresPostBack(this);
            }
        }

        /// <summary>
        /// Loads the client state data
        /// </summary>
        /// <param name="clientState"></param>
        protected virtual void LoadClientState(string clientState)
        {
        }

        /// <summary>
        /// Saves the client state data
        /// </summary>
        /// <returns></returns>
        protected virtual string SaveClientState()
        {
            return null;
        }

        /// <summary>
        /// Executed when post data is loaded from the request
        /// </summary>
        /// <param name="postDataKey"></param>
        /// <param name="postCollection"></param>
        /// <returns></returns>
        protected virtual bool LoadPostData(string postDataKey, NameValueCollection postCollection)
        {
            if (SupportsClientState)
            {
                string clientState = postCollection[ClientStateFieldID];
                if (!string.IsNullOrEmpty(clientState))
                {
                    LoadClientState(clientState);
                }
            }
            return false;
        }

        /// <summary>
        /// Executed when post data changes should invoke a chagned event
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1030:UseEventsWhereAppropriate", Justification = "Maintaining consistency with IPostBackDataHandler")]
        protected virtual void RaisePostDataChangedEvent()
        {
        }

        /// <summary>
        /// Gets the ScriptDescriptors that make up this control
        /// </summary>
        /// <returns></returns>
        protected override IEnumerable<ScriptDescriptor> GetScriptDescriptors()
        {
            if (!Visible) return null;

            EnsureID();

            // store descriptors for this object
            List<ScriptDescriptor> descriptors = new List<ScriptDescriptor>();

            // build the default description
            ScriptControlDescriptor descriptor = new ScriptControlDescriptor(ClientControlType, ClientID);
            DescribeComponent(descriptor);
            descriptors.Add(descriptor);

            // return the description
            return descriptors;
        }

        /// <summary>
        /// Gets the script references for this control
        /// </summary>
        /// <returns></returns>
        protected override IEnumerable<ScriptReference> GetScriptReferences()
        {
            if (!Visible) return null;

            List<ScriptReference> refs = new List<ScriptReference>();
            refs.AddRange(ScriptObjectBuilder.GetScriptReferences(GetType()));
            if (ScriptPath.Length > 0)
            {
                refs.Add(new ScriptReference(ScriptPath));
            }
            return refs;
        }

        /// <summary>
        /// Describes the settings for this control.
        /// </summary>
        /// <param name="descriptor"></param>
        protected virtual void DescribeComponent(ScriptComponentDescriptor descriptor)
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
            if (SupportsClientState)
            {
                descriptor.AddElementProperty("clientStateField", ClientStateFieldID);
            }
        }

        /// <summary>
        /// Handles a callback event
        /// </summary>
        /// <returns></returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Method has a side-effect")]
        protected virtual string GetCallbackResult()
        {
            string argument = _callbackArgument;
            _callbackArgument = null;
            return ScriptObjectBuilder.ExecuteCallbackMethod(this, argument);
        }

        /// <summary>
        /// Raises a callback event
        /// </summary>
        /// <param name="eventArgument"></param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1030:UseEventsWhereAppropriate", Justification = "Maintaining consistency with ICallbackEventHandler")]
        protected virtual void RaiseCallbackEvent(string eventArgument)
        {
            _callbackArgument = eventArgument;
        }

        #endregion

        #region [ IControlResolver Members ]

        public Control ResolveControl(string controlId)
        {
            return FindControl(controlId);
        }

        #endregion

        #region [ IPostBackDataHandler Members ]

        bool IPostBackDataHandler.LoadPostData(string postDataKey, NameValueCollection postCollection)
        {
            return LoadPostData(postDataKey, postCollection);
        }

        void IPostBackDataHandler.RaisePostDataChangedEvent()
        {
            RaisePostDataChangedEvent();
        }

        #endregion

        #region [ ICallbackEventHandler Members ]

        string ICallbackEventHandler.GetCallbackResult()
        {
            return GetCallbackResult();
        }

        void ICallbackEventHandler.RaiseCallbackEvent(string eventArgument)
        {
            RaiseCallbackEvent(eventArgument);
        }

        #endregion

        #region [ IClientStateManager Members ]

        bool IClientStateManager.SupportsClientState
        {
            get { return SupportsClientState; }
        }

        void IClientStateManager.LoadClientState(string clientState)
        {
            LoadClientState(clientState);
        }

        string IClientStateManager.SaveClientState()
        {
            return SaveClientState();
        }

        #endregion
    }
}
