#pragma warning disable 1591
using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor.Popups {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.Popups.AttachedTemplatePopup", Constants.HtmlEditorAttachedTemplatePopupName)]
    public class AttachedTemplatePopup : AttachedPopup {
        ITemplate _contentTemplate;
        HtmlGenericControl _contentDiv;
        Collection<Control> _content;
        string _containerCSSClass = "ajax__htmleditor_attachedpopup_default";

        public AttachedTemplatePopup()
            : base() {
        }

        [DefaultValue("ajax__htmleditor_attachedpopup_default")]
        [Category("Appearance")]
        public string ContainerCSSClass {
            get { return _containerCSSClass; }
            set { _containerCSSClass = value; }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateInstance(TemplateInstance.Single)]
        [Browsable(false)]
        [MergableProperty(false)]
        public ITemplate ContentTemplate {
            get { return _contentTemplate; }
            set { _contentTemplate = value; }
        }

        protected Collection<Control> Content {
            get {
                if(_content == null)
                    _content = new Collection<Control>();
                return _content;
            }
        }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            if(CssPath.Length == 0)
                CssPath = ResolveClientUrl(ToolkitResourceManager.GetStyleHref(Constants.HtmlEditorAttachedTemplatePopupName, this));

            if(_contentTemplate != null) {
                var c = new Control();
                _contentTemplate.InstantiateIn(c);
                Content.Add(c);
            }
        }

        protected override void CreateChildControls() {
            _contentDiv = new HtmlGenericControl("div");
            _contentDiv.Style[HtmlTextWriterStyle.Display] = "none";

            var container = new HtmlGenericControl("div");
            container.Attributes.Add("class", ContainerCSSClass);

            _contentDiv.Controls.Add(container);

            for(var i = 0; i < Content.Count; i++)
                container.Controls.Add(Content[i]);

            Controls.Add(_contentDiv);
            base.CreateChildControls();
        }

        protected override void OnPreRender(EventArgs e) {
            _contentDiv.Attributes.Add("id", _contentDiv.ClientID);
            base.OnPreRender(e);
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            descriptor.AddElementProperty("contentDiv", _contentDiv.ClientID);
        }
    }

}

#pragma warning restore 1591