#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    // The AccordionPane control represents a child header/content pair
    // of the AccordionControl.
    [ToolboxData("<{0}:AccordionPane runat=\"server\"></{0}:AccordionPane>")]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.AccordionName + Constants.IconPostfix)]
    public class AccordionPane : WebControl {
         AccordionContentPanel _header;
         ITemplate _headerTemplate;
         AccordionContentPanel _content;
         ITemplate _contentTemplate;

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public AccordionContentPanel HeaderContainer {
            get {
                EnsureChildControls();
                return _header;
            }
        }
        
        [Browsable(true)]
        [Category("Appearance")]
        [Description("CSS class for Accordion Pane Header")]
        public string HeaderCssClass {
            get {
                EnsureChildControls();
                return _header.CssClass;
            }
            set {
                EnsureChildControls();
                _header.CssClass = value;
            }
        }

        [Browsable(false)]
        [DefaultValue(null)]
        [Description("Accordion Pane Header")]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(AccordionContentPanel))]
        [TemplateInstance(TemplateInstance.Single)]
        public virtual ITemplate Header {
            get { return _headerTemplate; }
            set { _headerTemplate = value; }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public AccordionContentPanel ContentContainer {
            get {
                EnsureChildControls();
                return _content;
            }
        }

        [Browsable(true)]
        [Category("Appearance")]
        [Description("CSS class for Accordion Pane Content")]
        public string ContentCssClass {
            get {
                EnsureChildControls();
                return _content.CssClass;
            }
            set {
                EnsureChildControls();
                _content.CssClass = value;
            }
        }

        [Browsable(false)]
        [DefaultValue(null)]
        [Description("Accordion Pane Content")]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(AccordionContentPanel))]
        [TemplateInstance(TemplateInstance.Single)]
        public virtual ITemplate Content {
            get { return _contentTemplate; }
            set { _contentTemplate = value; }
        }

        // Wrap the Controls collection to always ensure they have
        // been generated before they're accessed
        public override ControlCollection Controls {
            get {
                EnsureChildControls();
                return base.Controls;
            }
        }

        // Instantiate the templates into new child controls
        protected override void CreateChildControls() {
            // Create the controls
            Controls.Clear();
            _header = new AccordionContentPanel(null, -1, AccordionItemType.Header);
            Controls.Add(_header);
            _content = new AccordionContentPanel(null, -1, AccordionItemType.Content);
            Controls.Add(_content);

            // By default, collapse the content sections so the
            // page loads without flicker (the selected section
            // will be expanded again in the parent Accordion's
            // OnPreRender)
            _content.Collapsed = true;

            // Load the templates into the controls
            if(_headerTemplate != null)
                _headerTemplate.InstantiateIn(_header);
            if(_contentTemplate != null)
                _contentTemplate.InstantiateIn(_content);
        }

        // Override FindControl to look first at this control, then the HeaderContainer,
        // and finally the ContentContainer when searching for controls
        public override Control FindControl(string id) {
            EnsureChildControls();
            return base.FindControl(id) ?? _header.FindControl(id) ?? _content.FindControl(id);
        }

        // Prevent the opening tag of the control from being rendered
        public override void RenderBeginTag(HtmlTextWriter writer) {
            // Do not call base.RenderBeginTag...
        }

        // Prevent the closing tag of the control from being rendered
        public override void RenderEndTag(HtmlTextWriter writer) {
            // Do not call base.RenderEndTag...
        }
    }

}
#pragma warning restore 1591