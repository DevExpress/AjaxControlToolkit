using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor.Popups {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.Popups.PopupBoxButton", Constants.HtmlEditorPopupBoxButtonName)]
    internal class PopupBoxButton : PopupCommonButton {
        ITemplate _contentTemplate;
        Collection<Control> _content;

        public PopupBoxButton()
            : base(HtmlTextWriterTag.Div) {
            CssClass = "ajax__htmleditor_popup_boxbutton";
        }

        public PopupBoxButton(HtmlTextWriterTag tag)
            : base(tag) {
            CssClass = "ajax__htmleditor_popup_boxbutton";
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
