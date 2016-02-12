#pragma warning disable 1591
using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Globalization;
using System.IO;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;
using System.Web.UI.Design;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor {

    public delegate void ContentChangedEventHandler(object sender, EventArgs e);

    [ValidationPropertyAttribute("Content")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.Events))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.Enums))]
    [RequiredScript(typeof(AjaxControlToolkit.HtmlEditor.HtmlEditor))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.EditPanel", Constants.HtmlEditorEditPanelName)]
    [RequiredScript(typeof(DesignPanel))]
    [RequiredScript(typeof(HtmlPanel))]
    [RequiredScript(typeof(PreviewPanel))]

    public abstract class EditPanel : ScriptControlBase, IPostBackEventHandler {
        public static readonly object EventContentChanged = new Object();

        bool _contentChanged;
        readonly ModePanel[] ModePanels = new ModePanel[] { new DesignPanel(), new HtmlPanel(), new PreviewPanel() };
        Collection<Toolbar> _toolbars;
        ControlDesigner _designer;

        protected EditPanel()
            : base(false, HtmlTextWriterTag.Div) {
        }

        [Category("Behavior")]
        public event ContentChangedEventHandler ContentChanged {
            add { Events.AddHandler(EditPanel.EventContentChanged, value); }
            remove { Events.RemoveHandler(EditPanel.EventContentChanged, value); }
        }

        protected virtual void OnRaiseContentChanged(EventArgs e) {
            var ContentChangedHandler = (ContentChangedEventHandler)Events[EditPanel.EventContentChanged];
            if(ContentChangedHandler != null)
                ContentChangedHandler(this, e);
            else
                RaiseBubbleEvent(this, new CommandEventArgs("contentchanged", String.Empty));
        }

        protected override void RaisePostDataChangedEvent() {
            if(_contentChanged) {
                OnRaiseContentChanged(EventArgs.Empty);
                _contentChanged = false;
            }
        }

        protected override bool LoadPostData(string postDataKey, System.Collections.Specialized.NameValueCollection postCollection) {
            base.LoadPostData(postDataKey, postCollection);

            var contentForce = false;

            var post = postCollection[ContentForceId];
            if(!String.IsNullOrEmpty(post))
                contentForce = true;

            post = postCollection[ActiveModeId];
            if(!String.IsNullOrEmpty(post))
                ActiveMode = (ActiveModeType)(Int64.Parse(post, CultureInfo.InvariantCulture));

            _contentChanged = false;
            post = postCollection[ContentId];
            if(post != null && contentForce) {
                var cont = (String)post.Replace("&lt;", "<").Replace("&gt;", ">").Replace("&quot;", "\"").Replace("&amp;", "&");
                if(cont == "<br />")
                    cont = String.Empty;

                _contentChanged = (Content.Replace("\n", String.Empty).Replace("\r", String.Empty) != cont.Replace("\n", String.Empty).Replace("\r", String.Empty));
                Content = cont;
            }

            post = postCollection[ContentChangedId];
            if(!String.IsNullOrEmpty(post))
                _contentChanged = true;

            return (_contentChanged);
        }

        public void RaisePostBackEvent(string eventArgument) {
            // not needed.
        }

        protected override bool OnBubbleEvent(object source, EventArgs args) {
            return true;
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

        [DefaultValue(false)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("suppressTabInDesignMode")]
        public bool SuppressTabInDesignMode {
            get { return (bool)(ViewState["SuppressTabInDesignMode"] ?? false); }
            set { ViewState["SuppressTabInDesignMode"] = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public bool IgnoreTab {
            get { return (bool)(ViewState["IgnoreTab"] ?? false); }
            set { ViewState["IgnoreTab"] = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("noUnicode")]
        public bool NoUnicode {
            get { return (bool)(ViewState["NoUnicode"] ?? false); }
            set { ViewState["NoUnicode"] = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("noScript")]
        public bool NoScript {
            get { return (bool)(ViewState["NoScript"] ?? false); }
            set { ViewState["NoScript"] = value; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("initialCleanUp")]
        public bool InitialCleanUp {
            get { return (bool)(ViewState["InitialCleanUp"] ?? false); }
            set { ViewState["InitialCleanUp"] = value; }
        }

        [DefaultValue("ajax__htmleditor_htmlpanel_default")]
        [Category("Appearance")]
        public string HtmlPanelCssClass {
            get { return (string)(ViewState["HtmlPanelCssClass"] ?? "ajax__htmleditor_htmlpanel_default"); }
            set { ViewState["HtmlPanelCssClass"] = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public string DocumentCssPath {
            get { return (string)(ViewState["DocumentCssPath"] ?? String.Empty); }
            set { ViewState["DocumentCssPath"] = value; }
        }
        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("documentCssPath")]
        public string ClientDocumentCssPath {
            get { return getClientCSSPath(DocumentCssPath, "Document"); }
        }
        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeClientDocumentCssPath() {
            return IsRenderingScript;
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public string DesignPanelCssPath {
            get { return (string)(ViewState["DesignPanelCssPath"] ?? String.Empty); }
            set { ViewState["DesignPanelCssPath"] = value; }
        }
        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("designPanelCssPath")]
        public string ClientDesignPanelCssPath {
            get { return getClientCSSPath(DesignPanelCssPath, "DesignPanel"); }
        }
        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeClientDesignPanelCssPath() {
            return IsRenderingScript;
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("imagePath_1x1")]
        public string ImagePath_1X1 {
            get { return ToolkitResourceManager.GetImageHref(Constants.HtmlEditorEd1x1Image, this); }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeImagePath_1X1() {
            return IsRenderingScript;
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("imagePath_flash")]
        public string ImagePath_Flash {
            get { return ToolkitResourceManager.GetImageHref(Constants.HtmlEditorEdFlashImage, this); }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeImagePath_Flash() {
            return IsRenderingScript;
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("imagePath_media")]
        public string ImagePath_Media {
            get { return ToolkitResourceManager.GetImageHref(Constants.HtmlEditorEdMediaImage, this); }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeImagePath_Media() {
            return IsRenderingScript;
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("imagePath_anchor")]
        public string ImagePath_Anchor {
            get { return ToolkitResourceManager.GetImageHref(Constants.HtmlEditorEdAnchorImage, this); }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeImagePath_Anchor() {
            return IsRenderingScript;
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("imagePath_placeHolder")]
        public string ImagePath_Placeholder {
            get { return ToolkitResourceManager.GetImageHref(Constants.HtmlEditorEdPlaceHolderImage, this); }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeImagePath_Placeholder() {
            return IsRenderingScript;
        }

        [DefaultValue(true)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("autofocus")]
        public bool AutoFocus {
            get { return (bool)(ViewState["AutoFocus"] ?? true); }
            set { ViewState["AutoFocus"] = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public string Content {
            get { return (string)(ViewState["Content"] ?? String.Empty); }
            set { ViewState["Content"] = value; }
        }

        [DefaultValue(ActiveModeType.Design)]
        [Category("Behavior")]
        public ActiveModeType ActiveMode {
            get { return (ActiveModeType)(ViewState["ActiveMode"] ?? ActiveModeType.Design); }
            set {
                ViewState["ActiveMode"] = value;
                if(_designer != null && isDesign)
                    RefreshDesigner();
            }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("activeModeChanged")]
        public string OnClientActiveModeChanged {
            get { return (String)(ViewState["OnClientActiveModeChanged"] ?? String.Empty); }
            set { ViewState["OnClientActiveModeChanged"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("beforeActiveModeChanged")]
        public string OnClientBeforeActiveModeChanged {
            get { return (string)(ViewState["OnClientBeforeActiveModeChanged"] ?? String.Empty); }
            set { ViewState["OnClientBeforeActiveModeChanged"] = value; }
        }

        [DefaultValue(typeof(Unit), "100%")]
        [Category("Appearance")]
        public override Unit Height {
            get { return Unit.Percentage(100); }
        }

        [DefaultValue(typeof(Unit), "100%")]
        [Category("Appearance")]
        public override Unit Width {
            get { return Unit.Percentage(100); }
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("modePanelIds")]
        public string ClientModePanelIds {
            get {
                var result = String.Empty;
                for(var i = 0; i < ModePanels.Length; i++) {
                    if(i > 0)
                        result += ";";
                    result += ModePanels[i].ClientID;
                }
                return result;
            }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeClientModePanelIds() {
            return IsRenderingScript;
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        internal Collection<Toolbar> Toolbars {
            get {
                if(_toolbars == null)
                    _toolbars = new Collection<Toolbar>();
                return _toolbars;
            }
            set { _toolbars = value; }
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("toolbarIds")]
        public string ToolbarIds {
            get {
                var result = String.Empty;
                for(var i = 0; i < Toolbars.Count; i++) {
                    if(i > 0)
                        result += ";";
                    result += Toolbars[i].ClientID;
                }
                return result;
            }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeToolbarIds() {
            return IsRenderingScript;
        }

        internal new EventHandlerList Events {
            get { return base.Events; }
        }

        protected string ContentChangedId {
            get { return "_contentChanged_" + ClientID; }
        }

        protected string ContentId {
            get { return "_content_" + ClientID; }
        }

        protected string ContentForceId {
            get { return "_contentForce_" + ClientID; }
        }

        protected string ActiveModeId {
            get { return "_activeMode_" + ClientID; }
        }

        protected void RefreshDesigner() {
            if(_designer != null && isDesign)
                _designer.UpdateDesignTimeHtml();
        }

        public void SetDesigner(ControlDesigner designer) {
            _designer = designer;
        }

        protected string LocalResolveUrl(string path) {
            var temp = base.ResolveUrl(path);
            var _Regex = new Regex(@"(\(S\([A-Za-z0-9_]+\)\)/)", RegexOptions.Compiled);
            temp = _Regex.Replace(temp, String.Empty);
            return temp;
        }

        internal string getClientCSSPath(string pathN, string name) {
            var result = String.Empty;
            var fileName = String.Empty;
            var pathExists = false;
            var path = (pathN.Length > 0) ? LocalResolveUrl(pathN) : String.Empty;

            if(path.Length > 0) {
                try {
                    fileName = HttpContext.Current.Server.MapPath(path);
                    if(File.Exists(fileName))
                        pathExists = true;
                }
                catch { }
            }

            if(pathExists)
                result = path;
            else
                result = ResolveClientUrl(ToolkitResourceManager.GetStyleHref("HtmlEditor." + name, this));

            return result;
        }

        internal static bool IE(Page page) {
            try {
                if(page.Request.Browser.Browser.IndexOf("IE", StringComparison.OrdinalIgnoreCase) > -1)
                    return true;
                else
                    return false;
            }
            catch { return false; }
        }

        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);
            ScriptManager.RegisterHiddenField(this, ContentChangedId, String.Empty);
            ScriptManager.RegisterHiddenField(this, ContentForceId, "1");
            ScriptManager.RegisterHiddenField(this, ContentId, Content.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace("\"", "&quot;"));
            ScriptManager.RegisterHiddenField(this, ActiveModeId, ((int)ActiveMode).ToString(CultureInfo.InvariantCulture));
            Page.RegisterRequiresPostBack(this);

            for(var i = 0; i < Controls.Count; i++) {
                if(IgnoreTab) {
                    var panel = Controls[i] as ModePanel;
                    panel.Attributes.Add("tabindex", "-1");
                }
                if(Controls[i].GetType() == typeof(HtmlPanel)) {
                    (Controls[i] as HtmlPanel).CssClass = HtmlPanelCssClass;
                }
            }
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            descriptor.AddElementProperty("contentChangedElement", ContentChangedId);
            descriptor.AddElementProperty("contentForceElement", ContentForceId);
            descriptor.AddElementProperty("contentElement", ContentId);
            descriptor.AddElementProperty("activeModeElement", ActiveModeId);
        }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);

            Style.Add(HtmlTextWriterStyle.Height, Unit.Percentage(100).ToString());
            Style.Add(HtmlTextWriterStyle.Width, Unit.Percentage(100).ToString());

            if(!isDesign)
                for(var i = 0; i < ModePanels.Length; i++) {
                    ModePanels[i].setEditPanel(this);
                    Controls.Add(ModePanels[i]);
                }
            else
                Controls.Add(ModePanels[0]);
        }
    }

}

#pragma warning restore 1591