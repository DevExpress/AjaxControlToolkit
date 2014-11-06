using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [ParseChildren(true)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(DynamicPopulateExtender))]
    [RequiredScript(typeof(TabContainer))]
    [ClientCssResource(Constants.TabsName)]
    [ClientScriptResource("Sys.Extended.UI.TabPanel", Constants.TabsName)]
    [ToolboxItem(false)]
    [Designer(typeof(TabPanelDesigner))]
    public class TabPanel : ScriptControlBase {
        bool _active;
        ITemplate _contentTemplate;
        ITemplate _headerTemplate;
        TabContainer _owner;
        Control _headerControl;

        public TabPanel()
            : base(false, HtmlTextWriterTag.Div) {
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public string HeaderText {
            get { return (string)(ViewState["HeaderText"] ?? string.Empty); }
            set { ViewState["HeaderText"] = value; }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateInstance(TemplateInstance.Single)]
        [Browsable(false)]
        [MergableProperty(false)]
        public ITemplate HeaderTemplate {
            get { return _headerTemplate; }
            set { _headerTemplate = value; }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateInstance(TemplateInstance.Single)]
        [Browsable(false)]
        [MergableProperty(false)]
        public ITemplate ContentTemplate {
            get { return _contentTemplate; }
            set { _contentTemplate = value; }
        }

        [DefaultValue(true)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("enabled")]
        public override bool Enabled {
            get { return base.Enabled; }
            set { base.Enabled = value; }
        }

        [DefaultValue(ScrollBars.None)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("scrollBars")]
        public ScrollBars ScrollBars {
            get { return (ScrollBars)(ViewState["ScrollBars"] ?? ScrollBars.None); }
            set { ViewState["ScrollBars"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("click")]
        public string OnClientClick {
            get { return (string)(ViewState["OnClientClick"] ?? string.Empty); }
            set { ViewState["OnClientClick"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("dynamicServicePath")]
        [UrlProperty]
        public string DynamicServicePath {
            get { return (string)(ViewState["DynamicServicePath"] ?? string.Empty); }
            set { ViewState["DynamicServicePath"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("dynamicServiceMethod")]
        public string DynamicServiceMethod {
            get { return (string)(ViewState["DynamicServiceMethod"] ?? string.Empty); }
            set { ViewState["DynamicServiceMethod"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("dynamicContextKey")]
        public string DynamicContextKey {
            get { return (string)(ViewState["DynamicContextKey"] ?? string.Empty); }
            set { ViewState["DynamicContextKey"] = value; }
        }

        [DefaultValue(OnDemandMode.Always)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("onDemandMode")]
        public OnDemandMode OnDemandMode {
            get { return (OnDemandMode)(ViewState["OnDemandMode"] ?? OnDemandMode.Always); }
            set { ViewState["OnDemandMode"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("populating")]
        public string OnClientPopulating {
            get { return (string)(ViewState["OnClientPopulating"] ?? string.Empty); }
            set { ViewState["OnClientPopulating"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("populated")]
        public string OnClientPopulated {
            get { return (string)(ViewState["OnClientPopulated"] ?? string.Empty); }
            set { ViewState["OnClientPopulated"] = value; }
        }

        internal bool Active {
            get { return _active; }
            set { _active = value; }
        }

        // Introduce UpdatePanelID to client side by prototyping it
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [ExtenderControlProperty]
        [ClientPropertyName("updatePanelID")]
        public string UpdatePanelID { get; set; }


        // Loading status of the tab if in Once demand mode
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [ExtenderControlProperty]
        [ClientPropertyName("wasLoadedOnce")]
        public bool WasLoadedOnce { get; set; }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);

            if(_headerTemplate != null) {
                _headerControl = new Control();
                _headerTemplate.InstantiateIn(_headerControl);
                Controls.Add(_headerControl);
            }

            if(_contentTemplate == null)
                return;
            var c = new Control();
            _contentTemplate.InstantiateIn(c);

            if(_owner.OnDemand && OnDemandMode != OnDemandMode.None) {
                var invisiblePanelID = ClientID + "_onDemandPanel";
                var invisiblePanel = new Panel() {
                    ID = invisiblePanelID,
                    Visible = false
                };
                invisiblePanel.Controls.Add(c);

                var updatePanel = new UpdatePanel() {
                    ID = ClientID + "_updatePanel",
                    UpdateMode = UpdatePanelUpdateMode.Conditional
                };
                updatePanel.Load += UpdatePanelOnLoad;
                updatePanel.ContentTemplateContainer.Controls.Add(invisiblePanel);
                Controls.Add(updatePanel);
                UpdatePanelID = updatePanel.ClientID;
            } else {
                Controls.Add(c);
            }
        }

        void UpdatePanelOnLoad(object sender, EventArgs e) {
            if(!(sender is UpdatePanel))
                return;

            var updatePanelID = (sender as UpdatePanel).ID;
            var tabID = updatePanelID.Substring(0, updatePanelID.Length - 12);
            if(!Active)
                return;

            var invisiblePanel = FindControl(tabID + "_onDemandPanel");
            if(invisiblePanel != null && invisiblePanel is Panel)
                invisiblePanel.Visible = true;
        }

        protected internal virtual void RenderHeader(HtmlTextWriter writer) {
            writer.AddAttribute(HtmlTextWriterAttribute.Id, ClientID + "_tab");
            RenderBeginTag(writer);

            writer.AddAttribute(HtmlTextWriterAttribute.Class, "ajax__tab_outer");
            RenderBeginTag(writer);

            writer.AddAttribute(HtmlTextWriterAttribute.Class, "ajax__tab_inner");
            RenderBeginTag(writer);

            writer.AddAttribute(HtmlTextWriterAttribute.Class, "ajax__tab_tab");
            writer.AddAttribute(HtmlTextWriterAttribute.Id, "__tab_" + ClientID);

            writer.AddAttribute(HtmlTextWriterAttribute.Href, "#");
            writer.AddStyleAttribute(HtmlTextWriterStyle.TextDecoration, "none");
            if(_owner.UseVerticalStripPlacement)
                writer.AddStyleAttribute(HtmlTextWriterStyle.Display, "block");
            writer.RenderBeginTag(HtmlTextWriterTag.A);

            RenderBeginTag(writer);

            if(_headerControl != null) {
                _headerControl.Visible = true;
                _headerControl.RenderControl(writer);
                _headerControl.Visible = false;
            } else {
                writer.Write(HeaderText);
            }
            writer.RenderEndTag();
            writer.RenderEndTag();
            writer.RenderEndTag();
            writer.RenderEndTag();
            writer.RenderEndTag();
        }

        public override void RenderBeginTag(HtmlTextWriter writer) {
            if(_owner.UseVerticalStripPlacement)
                writer.AddStyleAttribute(HtmlTextWriterStyle.Display, "block");
            writer.RenderBeginTag(HtmlTextWriterTag.Span);
        }

        protected override void Render(HtmlTextWriter writer) {
            if(_headerControl != null)
                _headerControl.Visible = false;

            base.AddAttributesToRender(writer);
            writer.AddAttribute(HtmlTextWriterAttribute.Id, ClientID);
            writer.AddAttribute(HtmlTextWriterAttribute.Class, "ajax__tab_panel");
            if(!Active || !Enabled) {
                writer.AddStyleAttribute(HtmlTextWriterStyle.Display, "none");
                writer.AddStyleAttribute(HtmlTextWriterStyle.Visibility, "hidden");
            }
            writer.RenderBeginTag(HtmlTextWriterTag.Div);
            RenderChildren(writer);
            writer.RenderEndTag();
            ScriptManager.RegisterScriptDescriptors(this);
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            descriptor.AddElementProperty("headerTab", "__tab_" + ClientID);
            if(_owner == null)
                return;

            descriptor.AddComponentProperty("owner", _owner.ClientID);
            descriptor.AddProperty("ownerID", _owner.ClientID);
        }

        internal void SetOwner(TabContainer owner) {
            _owner = owner;
        }
    }
}