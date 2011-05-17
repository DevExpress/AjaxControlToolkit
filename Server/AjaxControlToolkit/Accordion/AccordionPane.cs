

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit
{
    /// <summary>
    /// The AccordionPane control represents a child header/content pair
    /// of the AccordionControl.
    /// </summary>
    [ParseChildren(true)]
    [PersistChildren(false)]
    [ToolboxData("<{0}:AccordionPane runat=\"server\"></{0}:AccordionPane>")]
    [System.Drawing.ToolboxBitmap(typeof(AccordionPane), "Accordion.Accordion.ico")]
    public class AccordionPane : WebControl
    {
        /// <summary>
        /// Header Container
        /// </summary>
        private AccordionContentPanel _header;

        /// <summary>
        /// Header Template
        /// </summary>
        private ITemplate _headerTemplate;

        /// <summary>
        /// Content Container
        /// </summary>
        private AccordionContentPanel _content;

        /// <summary>
        /// Content Template
        /// </summary>
        private ITemplate _contentTemplate;

        /// <summary>
        /// Header Container
        /// </summary>
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public AccordionContentPanel HeaderContainer
        {
            get
            {
                EnsureChildControls();
                return _header;
            }
        }

        /// <summary>
        /// Header CSS Class
        /// </summary>
        [Browsable(true)]
        [Category("Appearance")]
        [Description("CSS class for Accordion Pane Header")]
        public string HeaderCssClass
        {
            get
            {
                EnsureChildControls();
                return _header.CssClass;
            }
            set
            {
                EnsureChildControls();
                _header.CssClass = value;
            }
        }

        /// <summary>
        /// Header Template
        /// </summary>
        [Browsable(false)]
        [DefaultValue(null)]
        [Description("Accordion Pane Header")]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(AccordionContentPanel))]
        [TemplateInstance(TemplateInstance.Single)]
        public virtual ITemplate Header
        {
            get { return _headerTemplate; }
            set { _headerTemplate = value; }
        }

        /// <summary>
        /// Content Container
        /// </summary>
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public AccordionContentPanel ContentContainer
        {
            get
            {
                EnsureChildControls();
                return _content;
            }
        }

        /// <summary>
        /// Content CSS Class
        /// </summary>
        [Browsable(true)]
        [Category("Appearance")]
        [Description("CSS class for Accordion Pane Content")]
        public string ContentCssClass
        {
            get
            {
                EnsureChildControls();
                return _content.CssClass;
            }
            set
            {
                EnsureChildControls();
                _content.CssClass = value;
            }
        }

        /// <summary>
        /// Content Template
        /// </summary>
        [Browsable(false)]
        [DefaultValue(null)]
        [Description("Accordion Pane Content")]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(AccordionContentPanel))]
        [TemplateInstance(TemplateInstance.Single)]
        public virtual ITemplate Content
        {
            get { return _contentTemplate; }
            set { _contentTemplate = value; }
        }

        /// <summary>
        /// Wrap the Controls collection to always ensure they have
        /// been generated before they're accessed
        /// </summary>
        public override ControlCollection Controls
        {
            get
            {
                EnsureChildControls();
                return base.Controls;
            }
        }

        /// <summary>
        /// Instantiate the templates into new child controls
        /// </summary>
        protected override void CreateChildControls()
        {
            // Create the controls
            Controls.Clear();
            _header = new AccordionContentPanel(null, -1, AccordionItemType.Header);
            _header.ID = string.Format(System.Globalization.CultureInfo.InvariantCulture, "{0}_header", this.ID);
            Controls.Add(_header);
            _content = new AccordionContentPanel(null, -1, AccordionItemType.Content);
            _content.ID = string.Format(System.Globalization.CultureInfo.InvariantCulture, "{0}_content", this.ID);
            Controls.Add(_content);

            // By default, collapse the content sections so the
            // page loads without flicker (the selected section
            // will be expanded again in the parent Accordion's
            // OnPreRender)
            _content.Collapsed = true;

            // Load the templates into the controls
            if (_headerTemplate != null)
                _headerTemplate.InstantiateIn(_header);
            if (_contentTemplate != null)
                _contentTemplate.InstantiateIn(_content);
        }

        /// <summary>
        /// Override FindControl to look first at this control, then the HeaderContainer,
        /// and finally the ContentContainer when searching for controls
        /// </summary>
        /// <param name="id">ID of the control</param>
        /// <returns>Control</returns>
        public override Control FindControl(string id)
        {
            EnsureChildControls();
            return base.FindControl(id) ?? _header.FindControl(id) ?? _content.FindControl(id);
        }

        /// <summary>
        /// Prevent the opening tag of the control from being rendered
        /// </summary>
        /// <param name="writer">HtmlTextWriter</param>
        public override void RenderBeginTag(HtmlTextWriter writer)
        {
            // Do not call base.RenderBeginTag...
        }

        /// <summary>
        /// Prevent the closing tag of the control from being rendered
        /// </summary>
        /// <param name="writer">HtmlTextWriter</param>
        public override void RenderEndTag(HtmlTextWriter writer)
        {
            // Do not call base.RenderEndTag...
        }
    }
}