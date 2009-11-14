


using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.Script;
using System.ComponentModel;
using System.Collections.Generic;

namespace AjaxControlToolkit
{
    [ParseChildren(true)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(DynamicPopulateExtender))]
    [RequiredScript(typeof(TabContainer))]
    [ClientCssResource("Tabs.Tabs_resource.css")]
    [ClientScriptResource("Sys.Extended.UI.TabPanel", "Tabs.Tabs.js")]
    [ToolboxItem(false)]
    [Designer(typeof(TabPanelDesigner))]
    public class TabPanel : ScriptControlBase
    {
        #region [ Fields ]

        private bool _active ;
        private ITemplate _contentTemplate;
        private ITemplate _headerTemplate;
        private TabContainer _owner;
        private Control _headerControl;

        #endregion

        #region [ Constructors ]

        public TabPanel()
            : base(false)
        {
        }

        #endregion

        #region [ Properties ]

        [DefaultValue("")]
        [Category("Appearance")]
        public string HeaderText
        {
            get { return (string)(ViewState["HeaderText"] ?? string.Empty); }
            set { ViewState["HeaderText"] = value; }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateInstance(TemplateInstance.Single)]
        [Browsable(false)]
        [MergableProperty(false)]
        public ITemplate HeaderTemplate
        {
            get { return _headerTemplate; }
            set { _headerTemplate = value; }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateInstance(TemplateInstance.Single)]        
        [Browsable(false)]
        [MergableProperty(false)]
        public ITemplate ContentTemplate
        {
            get { return _contentTemplate; }
            set { _contentTemplate = value; }
        }

        [DefaultValue(true)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("enabled")]
        public override bool Enabled
        {
            get { return base.Enabled; }
            set { base.Enabled = value; }
        }

        [DefaultValue(ScrollBars.None)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("scrollBars")]
        public ScrollBars ScrollBars
        {
            get { return (ScrollBars)(ViewState["ScrollBars"] ?? ScrollBars.None); }
            set { ViewState["ScrollBars"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("click")]
        public string OnClientClick
        {
            get { return (string)(ViewState["OnClientClick"] ?? string.Empty); }
            set { ViewState["OnClientClick"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("dynamicServicePath")]
        [UrlProperty]
        public string DynamicServicePath
        {
            get { return (string)(ViewState["DynamicServicePath"] ?? string.Empty); }
            set { ViewState["DynamicServicePath"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("dynamicServiceMethod")]
        public string DynamicServiceMethod
        {
            get { return (string)(ViewState["DynamicServiceMethod"] ?? string.Empty); }
            set { ViewState["DynamicServiceMethod"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("dynamicContextKey")]
        public string DynamicContextKey
        {
            get { return (string)(ViewState["DynamicContextKey"] ?? string.Empty); }
            set { ViewState["DynamicContextKey"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("populating")]
        public string OnClientPopulating
        {
            get { return (string)(ViewState["OnClientPopulating"] ?? string.Empty); }
            set { ViewState["OnClientPopulating"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("populated")]
        public string OnClientPopulated
        {
            get { return (string)(ViewState["OnClientPopulated"] ?? string.Empty); }
            set { ViewState["OnClientPopulated"] = value; }
        }

        internal bool Active
        {
            get { return _active; }
            set { _active = value; }
        }

        #endregion

        #region [ Methods ]


        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Reliability", "CA2000:DisposeObjectsBeforeLosingScope", Justification="Local c is handed off to Controls collection")]
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            if (_headerTemplate != null)
            {
                _headerControl = new Control();
                _headerTemplate.InstantiateIn(_headerControl);
                Controls.Add(_headerControl);
            }
            if (_contentTemplate != null)
            {
                Control c = new Control();
                _contentTemplate.InstantiateIn(c);
                Controls.Add(c);
            }
        }

        protected internal virtual void RenderHeader(HtmlTextWriter writer)
        {
            writer.AddAttribute(HtmlTextWriterAttribute.Id, ClientID + "_tab");
            writer.RenderBeginTag(HtmlTextWriterTag.Span);
            writer.AddAttribute(HtmlTextWriterAttribute.Class, "ajax__tab_outer");
            writer.RenderBeginTag(HtmlTextWriterTag.Span);
            writer.AddAttribute(HtmlTextWriterAttribute.Class, "ajax__tab_inner");
            writer.RenderBeginTag(HtmlTextWriterTag.Span);
            writer.AddAttribute(HtmlTextWriterAttribute.Class, "ajax__tab_tab");
            writer.AddAttribute(HtmlTextWriterAttribute.Id, "__tab_" + ClientID);
            writer.RenderBeginTag(HtmlTextWriterTag.Span);
            if (_headerControl != null)
            {
                _headerControl.RenderControl(writer);
            }
            else
            {
                writer.Write(HeaderText);
            }
            writer.RenderEndTag();
            writer.RenderEndTag();
            writer.RenderEndTag();
            writer.RenderEndTag();
        }

        protected override void Render(HtmlTextWriter writer)
        {
            if (_headerControl != null)
            {
                _headerControl.Visible = false;
            }
            
            writer.AddAttribute(HtmlTextWriterAttribute.Id, ClientID);
            writer.AddAttribute(HtmlTextWriterAttribute.Class, "ajax__tab_panel");
            if (!Active || !Enabled)
            {
                writer.AddStyleAttribute(HtmlTextWriterStyle.Display, "none");
                writer.AddStyleAttribute(HtmlTextWriterStyle.Visibility, "hidden");
            }
            writer.RenderBeginTag(HtmlTextWriterTag.Div);
            RenderChildren(writer);
            writer.RenderEndTag();
            ScriptManager.RegisterScriptDescriptors(this);
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            descriptor.AddElementProperty("headerTab", "__tab_" + ClientID);
            if (_owner != null)
            {
                descriptor.AddComponentProperty("owner", _owner.ClientID);
                descriptor.AddProperty("ownerID", _owner.ClientID);
            }
        }

        internal void SetOwner(TabContainer owner)
        {
            _owner = owner; 
        }

        #endregion
    }
}
