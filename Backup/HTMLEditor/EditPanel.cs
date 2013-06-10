using System;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.ComponentModel.Design.Serialization;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Drawing.Design;
using System.Security.Permissions;
using System.Collections;
using System.Collections.ObjectModel;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Schema;
using System.Globalization;
using System.CodeDom;
using System.Drawing;
using System.IO;
using AjaxControlToolkit;

#region [ Resources ]

[assembly: System.Web.UI.WebResource("HTMLEditor.EditPanel.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.EditPanel.debug.js", "application/x-javascript")]
[assembly: WebResource("HTMLEditor.Document.css", "text/css", PerformSubstitution = true)]
[assembly: WebResource("HTMLEditor.DesignPanel.css", "text/css", PerformSubstitution = true)]
[assembly: WebResource("HTMLEditor.Images.ed_anchor.gif", "image/gif")]
[assembly: WebResource("HTMLEditor.Images.ed_1x1.gif", "image/gif")]
[assembly: WebResource("HTMLEditor.Images.ed_flash.gif", "image/gif")]
[assembly: WebResource("HTMLEditor.Images.ed_media.gif", "image/gif")]
[assembly: WebResource("HTMLEditor.Images.ed_placeHolder.gif", "image/gif")]

#endregion

namespace AjaxControlToolkit.HTMLEditor
{
    #region [ Delegates ]

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1003:UseGenericEventHandlerInstances", Justification = "Designer doesn't work with generic event handlers")]
    public delegate void ContentChangedEventHandler(object sender, EventArgs e);

    #endregion

    [ParseChildren(true)]
    [PersistChildren(false)]
    [ValidationPropertyAttribute("Content")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(AjaxControlToolkit.HTMLEditor.Events))]
    [RequiredScript(typeof(AjaxControlToolkit.HTMLEditor.Enums))]
    [RequiredScript(typeof(AjaxControlToolkit.HTMLEditor.HTMLEditor))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.EditPanel", "HTMLEditor.EditPanel.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1012:AbstractTypesShouldNotHaveConstructors")]
    public abstract class EditPanel : ScriptControlBase, IPostBackEventHandler
    {
        #region [ Static Fields ]

        public static readonly object EventContentChanged = new Object();

        #endregion

        #region [ Fields ]

        private bool _contentChanged;
        private readonly ModePanel[] ModePanels = new ModePanel[] { new DesignPanel(), new HtmlPanel(), new PreviewPanel() };
        private Collection<Toolbar> _toolbars;
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields", Justification = "Used for Design mode")]
        private System.Web.UI.Design.ControlDesigner _designer;

        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new EditPanel
        /// </summary>
        protected EditPanel()
            : base(false, HtmlTextWriterTag.Div)
        {
        }

        #endregion

        #region [ Events ]

        [Category("Behavior")]
        public event ContentChangedEventHandler ContentChanged
        {
            add
            {
                Events.AddHandler(EditPanel.EventContentChanged, value);
            }
            remove
            {
                Events.RemoveHandler(EditPanel.EventContentChanged, value);
            }
        }
        protected virtual void OnRaiseContentChanged(EventArgs e)
        {
            ContentChangedEventHandler ContentChangedHandler = (ContentChangedEventHandler)Events[EditPanel.EventContentChanged];
            if (ContentChangedHandler != null)
            {
                ContentChangedHandler(this, e);
            }
            else
            {
                RaiseBubbleEvent(this, new CommandEventArgs("contentchanged", ""));
            }
        }

        #endregion

        #region [ IPostBackDataHandler & IPostBackEventHandler Members ]

        protected override void RaisePostDataChangedEvent()
        {
            if (_contentChanged)
            {
                OnRaiseContentChanged(EventArgs.Empty);
                _contentChanged = false;
            }
        }

        protected override bool LoadPostData(string postDataKey, System.Collections.Specialized.NameValueCollection postCollection)
        {
            base.LoadPostData(postDataKey, postCollection);

            string post;
            bool contentForce = false;

            post = postCollection[ContentForceId];
            if (!string.IsNullOrEmpty(post))
            {
                contentForce = true;
            }

            post = postCollection[ActiveModeId];
            if (!string.IsNullOrEmpty(post))
            {
                ActiveMode = (ActiveModeType)(Int64.Parse(post, CultureInfo.InvariantCulture));
            }

            _contentChanged = false;
            post = postCollection[ContentId];
            if (post != null && contentForce)
            {
                string cont = (string)post.Replace("&lt;", "<").Replace("&gt;", ">").Replace("&quot;", "\"").Replace("&amp;", "&");
                if (cont == "<br />") cont = "";

                _contentChanged = (Content.Replace("\n", "").Replace("\r", "") != cont.Replace("\n", "").Replace("\r", ""));
                Content = cont;
            }

            post = postCollection[ContentChangedId];
            if (!string.IsNullOrEmpty(post))
            {
                _contentChanged = true;
            }

            return (_contentChanged);
        }

        public void RaisePostBackEvent(string eventArgument)
        {
            // not needed.
        }

        protected override bool OnBubbleEvent(object source, EventArgs args)
        {
            return true;
        }
        #endregion

        #region [ Properties ]

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "Exception is caught only for debugging purposes")]
        private bool isDesign
        {
            get
            {
                try
                {
                    bool isd = false;
                    if (this.Context == null)
                    {
                        isd = true;
                    }
                    else if (this.Site != null)
                    {
                        isd = this.Site.DesignMode;
                    }
                    else
                    {
                        isd = false;
                    }
                    return isd;
                }
                catch { return true; }
            }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("suppressTabInDesignMode")]
        public bool SuppressTabInDesignMode
        {
            get { return (bool)(ViewState["SuppressTabInDesignMode"] ?? false); }
            set { ViewState["SuppressTabInDesignMode"] = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public bool IgnoreTab
        {
            get { return (bool)(ViewState["IgnoreTab"] ?? false); }
            set { ViewState["IgnoreTab"] = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("noUnicode")]
        public bool NoUnicode
        {
            get { return (bool)(ViewState["NoUnicode"] ?? false); }
            set { ViewState["NoUnicode"] = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("noScript")]
        public bool NoScript
        {
            get { return (bool)(ViewState["NoScript"] ?? false); }
            set { ViewState["NoScript"] = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("initialCleanUp")]
        public bool InitialCleanUp
        {
            get { return (bool)(ViewState["InitialCleanUp"] ?? false); }
            set { ViewState["InitialCleanUp"] = value; }
        }

        [DefaultValue("ajax__htmleditor_htmlpanel_default")]
        [Category("Appearance")]
        public string HtmlPanelCssClass
        {
            get { return (string)(ViewState["HtmlPanelCssClass"] ?? "ajax__htmleditor_htmlpanel_default"); }
            set { ViewState["HtmlPanelCssClass"] = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public string DocumentCssPath
        {
            get { return (string)(ViewState["DocumentCssPath"] ?? string.Empty); }
            set { ViewState["DocumentCssPath"] = value; }
        }
        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("documentCssPath")]
        public string ClientDocumentCssPath
        {
            get { return getClientCSSPath(DocumentCssPath, "Document"); }
        }
        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeClientDocumentCssPath()
        {
            return IsRenderingScript;
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public string DesignPanelCssPath
        {
            get { return (string)(ViewState["DesignPanelCssPath"] ?? string.Empty); }
            set { ViewState["DesignPanelCssPath"] = value; }
        }
        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("designPanelCssPath")]
        public string ClientDesignPanelCssPath
        {
            get { return getClientCSSPath(DesignPanelCssPath, "DesignPanel"); }
        }
        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeClientDesignPanelCssPath()
        {
            return IsRenderingScript;
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("imagePath_1x1")]
        public string ImagePath_1X1
        {
            get { return Page.ClientScript.GetWebResourceUrl(typeof(EditPanel), "HTMLEditor.Images.ed_1x1.gif"); }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeImagePath_1X1()
        {
            return IsRenderingScript;
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("imagePath_flash")]
        public string ImagePath_Flash
        {
            get { return Page.ClientScript.GetWebResourceUrl(typeof(EditPanel), "HTMLEditor.Images.ed_flash.gif"); }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeImagePath_Flash()
        {
            return IsRenderingScript;
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("imagePath_media")]
        public string ImagePath_Media
        {
            get { return Page.ClientScript.GetWebResourceUrl(typeof(EditPanel), "HTMLEditor.Images.ed_media.gif"); }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeImagePath_Media()
        {
            return IsRenderingScript;
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("imagePath_anchor")]
        public string ImagePath_Anchor
        {
            get { return Page.ClientScript.GetWebResourceUrl(typeof(EditPanel), "HTMLEditor.Images.ed_anchor.gif"); }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeImagePath_Anchor()
        {
            return IsRenderingScript;
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("imagePath_placeHolder")]
        public string ImagePath_Placeholder
        {
            get { return Page.ClientScript.GetWebResourceUrl(typeof(EditPanel), "HTMLEditor.Images.ed_placeHolder.gif"); }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeImagePath_Placeholder()
        {
            return IsRenderingScript;
        }

        [DefaultValue(true)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("autofocus")]
        public bool AutoFocus
        {
            get { return (bool)(ViewState["AutoFocus"] ?? true); }
            set { ViewState["AutoFocus"] = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public string Content
        {
            get { return (string)(ViewState["Content"] ?? string.Empty); }
            set { ViewState["Content"] = value; }
        }

        [DefaultValue(ActiveModeType.Design)]
        [Category("Behavior")]
        public ActiveModeType ActiveMode
        {
            get { return (ActiveModeType)(ViewState["ActiveMode"] ?? ActiveModeType.Design); }
            set
            {
                ViewState["ActiveMode"] = value;
                if (_designer != null && isDesign)
                {
                    RefreshDesigner();
                }
            }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("activeModeChanged")]
        public string OnClientActiveModeChanged
        {
            get { return (string)(ViewState["OnClientActiveModeChanged"] ?? string.Empty); }
            set { ViewState["OnClientActiveModeChanged"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("beforeActiveModeChanged")]
        public string OnClientBeforeActiveModeChanged
        {
            get { return (string)(ViewState["OnClientBeforeActiveModeChanged"] ?? string.Empty); }
            set { ViewState["OnClientBeforeActiveModeChanged"] = value; }
        }

        [DefaultValue(typeof(Unit), "100%")]
        [Category("Appearance")]
        public override Unit Height
        {
            get { return Unit.Percentage(100); }
        }

        [DefaultValue(typeof(Unit), "100%")]
        [Category("Appearance")]
        public override Unit Width
        {
            get { return Unit.Percentage(100); }
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("modePanelIds")]
        public string ClientModePanelIds
        {
            get
            {
                string result = "";
                for (int i = 0; i < ModePanels.Length; i++)
                {
                    if (i > 0) result += ";";
                    result += ModePanels[i].ClientID;
                }
                return result;
            }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeClientModePanelIds()
        {
            return IsRenderingScript;
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        internal Collection<Toolbar> Toolbars
        {
            get
            {
                if (_toolbars == null)
                {
                    _toolbars = new Collection<Toolbar>();
                }
                return _toolbars;
            }
            set
            {
                _toolbars = value;
            }
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("toolbarIds")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "Toolbar")]
        public string ToolbarIds
        {
            get
            {
                string result = "";
                for (int i = 0; i < Toolbars.Count; i++)
                {
                    if (i > 0) result += ";";
                    result += Toolbars[i].ClientID;
                }
                return result;
            }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "Toolbar")]
        public bool ShouldSerializeToolbarIds()
        {
            return IsRenderingScript;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2222:DoNotDecreaseInheritedMemberVisibility", Justification = "It should be visible in Editor.cs")]
        internal new EventHandlerList Events
        {
            get { return base.Events; }
        }

        protected string ContentChangedId
        {
            get { return "_contentChanged_" + this.ClientID; }
        }

        protected string ContentId
        {
            get { return "_content_" + this.ClientID; }
        }

        protected string ContentForceId
        {
            get { return "_contentForce_" + this.ClientID; }
        }

        protected string ActiveModeId
        {
            get { return "_activeMode_" + this.ClientID; }
        }

        #endregion

        #region [ Methods ]

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        protected void RefreshDesigner()
        {
            if (_designer != null && isDesign)
            {
                _designer.UpdateDesignTimeHtml();
            }
        }

        public void SetDesigner(System.Web.UI.Design.ControlDesigner designer)
        {
            _designer = designer;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1055:UriReturnValuesShouldNotBeStrings")]
        protected string LocalResolveUrl(string path)
        {
            string temp = base.ResolveUrl(path);
            Regex _Regex = new Regex(@"(\(S\([A-Za-z0-9_]+\)\)/)", RegexOptions.Compiled);
            temp = _Regex.Replace(temp, "");
            return temp;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "Exception is caught only for debugging purposes")]
        internal string getClientCSSPath(string pathN, string name)
        {
            string result = "";
            string fileName = "";
            bool pathExists = false;
            string path = (pathN.Length > 0)?LocalResolveUrl(pathN):"";

            if (path.Length > 0)
            {
                try
                {
                    fileName = System.Web.HttpContext.Current.Server.MapPath(path);
                    if (File.Exists(fileName))
                    {
                        pathExists = true;
                    }
                }
                catch {}
            }

            if(pathExists)
            {
                result = path;
            }
            else
            {
                result = Page.ClientScript.GetWebResourceUrl(typeof(EditPanel), "HTMLEditor." + name + ".css");
            }
            return result;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "Exception is caught only for debugging purposes")]
        internal static bool IE(Page page)
        {
            try
            {
                if (page.Request.Browser.Browser.IndexOf("IE", StringComparison.OrdinalIgnoreCase) > -1) return true;
                else return false;
            }
            catch { return false; }
        }

        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);
            ScriptManager.RegisterHiddenField(this, this.ContentChangedId, string.Empty);
            ScriptManager.RegisterHiddenField(this, this.ContentForceId, "1");
            ScriptManager.RegisterHiddenField(this, this.ContentId, this.Content.Replace("&" ,"&amp;").Replace("<" ,"&lt;").Replace(">" ,"&gt;").Replace("\"","&quot;"));
            ScriptManager.RegisterHiddenField(this, this.ActiveModeId, ((int)this.ActiveMode).ToString(CultureInfo.InvariantCulture));
            Page.RegisterRequiresPostBack(this);

            for (int i = 0; i < Controls.Count; i++)
            {
                if (this.IgnoreTab)
                {
                    ModePanel panel = this.Controls[i] as ModePanel;
                    panel.Attributes.Add("tabindex", "-1");
                }
                if (this.Controls[i].GetType() == typeof(HtmlPanel))
                {
                    (this.Controls[i] as HtmlPanel).CssClass = this.HtmlPanelCssClass;
                }
            }
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            descriptor.AddElementProperty("contentChangedElement", this.ContentChangedId);
            descriptor.AddElementProperty("contentForceElement", this.ContentForceId);
            descriptor.AddElementProperty("contentElement", this.ContentId);
            descriptor.AddElementProperty("activeModeElement", this.ActiveModeId);
        }

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            Style.Add(HtmlTextWriterStyle.Height, Unit.Percentage(100).ToString());
            Style.Add(HtmlTextWriterStyle.Width, Unit.Percentage(100).ToString());

            if (!isDesign)
            {
                for (int i = 0; i < ModePanels.Length; i++)
                {
                    ModePanels[i].setEditPanel(this);
                    Controls.Add(ModePanels[i]);
                }
            }
            else
            {
                Controls.Add(ModePanels[0]);
            }
        }

        #endregion
    }
}
