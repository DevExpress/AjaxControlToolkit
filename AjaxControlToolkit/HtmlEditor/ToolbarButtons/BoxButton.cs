#pragma warning disable 1591
using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.BoxButton", Constants.HtmlEditorBoxButtonName)]
    public abstract class BoxButton : CommonButton {
        ITemplate _contentTemplate;
        Collection<Control> _content;

        protected BoxButton()
            : base(HtmlTextWriterTag.Div) {
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

            if(_contentTemplate != null) {
                var c = new Control();
                _contentTemplate.InstantiateIn(c);
                Content.Add(c);
            }
        }

        protected override void CreateChildControls() {
            for(var i = 0; i < Content.Count; i++) {
                Controls.Add(Content[i]);
            }
            base.CreateChildControls();
        }
    }

}

#pragma warning restore 1591