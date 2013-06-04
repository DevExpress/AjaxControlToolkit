

using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Globalization;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Serialization;
using System.Drawing;

namespace AjaxControlToolkit
{
    /// <summary>
    /// ScriptUserControl is used to define complex user controls which support ASP.NET AJAX script extensions
    /// </summary>
    [ClientScriptResource(null, Constants.BaseScriptResourceName)]
    public class ScriptUserControl : UserControl, IScriptControl, IControlResolver, IPostBackDataHandler, ICallbackEventHandler, IClientStateManager
    {
        #region [ Fields ]

        private ScriptManager _scriptManager;
        private bool _enableClientState;
        private string _cachedClientStateFieldID;
        private string _callbackArgument;
        private HtmlTextWriterTag _tagKey;
        private string _tagName;
        private Style _controlStyle;

        #endregion

        #region [ Constructor ]

        /// <summary>
        /// Initializes a new ScriptUserControl
        /// </summary>
        /// <param name="tag"></param>
        public ScriptUserControl(HtmlTextWriterTag tag)
            : this(false, tag)
        {
        }

        /// <summary>
        /// Initializes a new ScriptUserControl
        /// </summary>
        protected ScriptUserControl()
            : this(false)
        {
        }

        /// <summary>
        /// Initializes a new ScriptUserControl
        /// </summary>
        /// <param name="tag"></param>
        protected ScriptUserControl(string tag)
            : this(false, tag)
        {
        }

        /// <summary>
        /// Initializes a new ScriptUserControl
        /// </summary>
        /// <param name="enableClientState"></param>
        protected ScriptUserControl(bool enableClientState)
        {
            _enableClientState = enableClientState;
        }

        /// <summary>
        /// Initializes a new ScriptUserControl
        /// </summary>
        /// <param name="enableClientState"></param>
        /// <param name="tag"></param>
        protected ScriptUserControl(bool enableClientState, HtmlTextWriterTag tag)
        {
            _enableClientState = enableClientState;
            _tagKey = tag;
        }

        /// <summary>
        /// Initializes a new ScriptUserControl
        /// </summary>
        /// <param name="enableClientState"></param>
        /// <param name="tag"></param>
        protected ScriptUserControl(bool enableClientState, string tag)
        {
            _enableClientState = enableClientState;
            _tagKey = HtmlTextWriterTag.Unknown;
            _tagName = tag;
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

        [DefaultValue(typeof(Color), "")]
        [TypeConverter(typeof(WebColorConverter))]
        public virtual Color BackColor
        {
            get
            {
                if (!ControlStyleCreated)
                {
                    return Color.Empty;
                }
                return _controlStyle.BackColor;
            }
            set
            {
                ControlStyle.BackColor = value;
            }
        }

        [DefaultValue(typeof(Color), "")]
        [TypeConverter(typeof(WebColorConverter))]
        public virtual Color BorderColor
        {
            get
            {
                if (!ControlStyleCreated)
                {
                    return Color.Empty;
                }
                return _controlStyle.BorderColor;
            }
            set
            {
                ControlStyle.BorderColor = value;
            }
        }

        [DefaultValue(BorderStyle.None)]
        public virtual BorderStyle BorderStyle
        {
            get
            {
                if (!ControlStyleCreated)
                {
                    return BorderStyle.None;
                }
                return _controlStyle.BorderStyle;
            }
            set
            {
                ControlStyle.BorderStyle = value;
            }
        }

        [DefaultValue(typeof(Unit), "")]
        public virtual Unit BorderWidth
        {
            get
            {
                if (!ControlStyleCreated)
                {
                    return Unit.Empty;
                }
                return _controlStyle.BorderWidth;
            }
            set
            {
                ControlStyle.BorderWidth = value;
            }
        }

        [DefaultValue("")]
        public virtual string CssClass
        {
            get
            {
                if (!ControlStyleCreated)
                {
                    return string.Empty;
                }
                return _controlStyle.CssClass;
            }
            set
            {
                ControlStyle.CssClass = value;
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        [NotifyParentProperty(true)]
        public virtual FontInfo Font
        {
            get
            {
                return ControlStyle.Font;
            }
        }

        [DefaultValue(typeof(Color), "")]
        [TypeConverter(typeof(WebColorConverter))]
        public virtual Color ForeColor
        {
            get
            {
                if (!ControlStyleCreated)
                {
                    return Color.Empty;
                }
                return ControlStyle.ForeColor;
            }
            set
            {
                ControlStyle.ForeColor = value;
            }
        }

        [DefaultValue(typeof(Unit), "")]
        public virtual Unit Height
        {
            get
            {
                if (!ControlStyleCreated)
                {
                    return Unit.Empty;
                }
                return ControlStyle.Height;
            }
            set
            {
                ControlStyle.Height = value;
            }
        }

        [DefaultValue(typeof(Unit), "")]
        public virtual Unit Width
        {
            get
            {
                if (!ControlStyleCreated)
                {
                    return Unit.Empty;
                }
                return ControlStyle.Width;
            }
            set
            {
                ControlStyle.Width = value;
            }
        }



        /// <summary>
        /// The Style for this control
        /// </summary>
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Style ControlStyle
        {
            get
            {
                if (_controlStyle == null)
                {
                    _controlStyle = CreateControlStyle();
                    if (IsTrackingViewState)
                    {
                        ((IStateManager)_controlStyle).TrackViewState();
                    }
                }
                return _controlStyle;
            }
        }

        /// <summary>
        /// Whether the control's style has been created
        /// </summary>
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool ControlStyleCreated
        {
            get { return _controlStyle != null; }
        }

        /// <summary>
        /// The Css Style for this control
        /// </summary>
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public CssStyleCollection Style
        {
            get { return Attributes.CssStyle; }
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
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden), Browsable(false)]
        protected virtual HtmlTextWriterTag TagKey
        {
            get
            {
                return _tagKey;
            }
        }

        /// <summary>
        /// Gets the tag name used when rendering the outer wrapper element for this user control
        /// </summary>
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden), Browsable(false)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase", Justification = "Avoiding possibly breaking change")]
        protected virtual string TagName
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
                    throw new HttpException(Legacy.Properties.Resources_NET4.E_NoScriptManager);
#else
                    throw new HttpException(Legacy.Properties.Resources.E_NoScriptManager);
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
        /// Render's the begin tag of the control
        /// </summary>
        /// <param name="writer"></param>
        public virtual void RenderBeginTag(HtmlTextWriter writer)
        {
            if (null == writer)
            {
                throw new ArgumentNullException("writer");
            }
            AddAttributesToRender(writer);
            HtmlTextWriterTag tagKey = TagKey;
            if (tagKey != HtmlTextWriterTag.Unknown)
            {
                writer.RenderBeginTag(tagKey);
            }
            else
            {
                writer.RenderBeginTag(TagName);
            }
        }

        /// <summary>
        /// Renders the end tag of the control
        /// </summary>
        /// <param name="writer"></param>
        public virtual void RenderEndTag(HtmlTextWriter writer)
        {
            if (null == writer)
            {
                throw new ArgumentNullException("writer");
            }
            writer.RenderEndTag();
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
        /// Fires the PreREnder event
        /// </summary>
        /// <param name="e"></param>
        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);

            EnsureScriptManager();

            ScriptManager.RegisterScriptControl(this);

            EnsureID();

            if (SupportsClientState)
            {
				ScriptManager.RegisterHiddenField(this, ClientStateFieldID, SaveClientState());
                Page.RegisterRequiresPostBack(this);
            }
        }

        /// <summary>
        /// Creates a Style for this control
        /// </summary>
        /// <returns></returns>
        protected virtual Style CreateControlStyle()
        {
            return new Style(ViewState);
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
        /// Saves the ViewState for this control
        /// </summary>
        /// <returns></returns>
        protected override object SaveViewState()
        {
            if (ControlStyleCreated)
            {
                ((IStateManager)ControlStyle).SaveViewState();
            }
            return base.SaveViewState();
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
        /// Renders the control to the writer
        /// </summary>
        /// <param name="writer"></param>
        protected override void Render(HtmlTextWriter writer)
        {
            RenderBeginTag(writer);
            RenderContents(writer);
            RenderEndTag(writer);
            ScriptManager.RegisterScriptDescriptors(this);
        }

        /// <summary>
        /// Renders the contents of the control
        /// </summary>
        /// <param name="writer"></param>
        protected virtual void RenderContents(HtmlTextWriter writer)
        {
            base.Render(writer);
        }

        /// <summary>
        /// Adds attributes to the writer
        /// </summary>
        /// <param name="writer"></param>
        protected virtual void AddAttributesToRender(HtmlTextWriter writer)
        {
            if (ID != null)
            {
                writer.AddAttribute(HtmlTextWriterAttribute.Id, ClientID);
            }
            if (TagKey == HtmlTextWriterTag.Span || TagKey == HtmlTextWriterTag.A)
            {
                AddDisplayInlineBlockIfNeeded(writer);
            }
            if (ControlStyleCreated && !ControlStyle.IsEmpty)
            {
                // unfortunately since we're not a "WebControl" we can't pass ourselves as a UrlResolver
                ControlStyle.AddAttributesToRender(writer);
            }
            foreach (string key in Attributes.Keys)
            {
                writer.AddAttribute(key, Attributes[key]);
            }
        }

        private void AddDisplayInlineBlockIfNeeded(HtmlTextWriter writer)
        {
            if (BorderStyle != BorderStyle.NotSet || !BorderWidth.IsEmpty || !Height.IsEmpty || !Width.IsEmpty)
            {
                if (Request.Browser.IsBrowser("FireFox") || Request.Browser.IsBrowser("Mozilla"))
                {
                    writer.AddStyleAttribute(HtmlTextWriterStyle.Display, "-moz-inline-box");
                }
                else
                {
                    writer.AddStyleAttribute(HtmlTextWriterStyle.Display, "inline-block");
                }
            }
        }



        /// <summary>
        /// Gets the ScriptDescriptors that make up this control
        /// </summary>
        /// <returns></returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Method is expensive")]
        protected virtual IEnumerable<ScriptDescriptor> GetScriptDescriptors()
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
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Method is expensive")]
        protected virtual IEnumerable<ScriptReference> GetScriptReferences()
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
            ScriptObjectBuilder.DescribeComponent(this, descriptor, this, this);
            if (SupportsClientState)
            {
                descriptor.AddElementProperty("clientStateField", ClientStateFieldID);
            }
        }

        /// <summary>
        /// Handles a callback event
        /// </summary>
        /// <returns></returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification="Method has a side-effect")]
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

        #region [ IScriptControl Members ]

        IEnumerable<ScriptDescriptor> IScriptControl.GetScriptDescriptors()
        {
            return GetScriptDescriptors();
        }

        IEnumerable<ScriptReference> IScriptControl.GetScriptReferences()
        {
            return GetScriptReferences();
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
