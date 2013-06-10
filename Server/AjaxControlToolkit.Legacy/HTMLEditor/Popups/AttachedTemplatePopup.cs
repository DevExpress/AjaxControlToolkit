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

[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.AttachedTemplatePopup.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.AttachedTemplatePopup.debug.js", "application/x-javascript")]
[assembly: WebResource("HTMLEditor.Popups.AttachedTemplatePopup.css", "text/css", PerformSubstitution = true)]
[assembly: WebResource("HTMLEditor.Images.BgiButton.gif", "image/gif")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.Popups
{
    [ToolboxItem(false)]
    [ParseChildren(true)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.Popups.AttachedTemplatePopup", "HTMLEditor.Popups.AttachedTemplatePopup.js")]
    public class AttachedTemplatePopup : AttachedPopup
    {
        #region [ Fields ]

        private ITemplate _contentTemplate;
        private HtmlGenericControl _contentDiv;
        private Collection<Control> _content;
        private string _containerCSSClass = "ajax__htmleditor_attachedpopup_default";

        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new AttachedTemplatePopup
        /// </summary>
        public AttachedTemplatePopup() : base()
        {
        }

        #endregion

        #region [ Properties ]

        [DefaultValue("ajax__htmleditor_attachedpopup_default")]
        [Category("Appearance")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        public string ContainerCSSClass
        {
            get { return _containerCSSClass; }
            set { _containerCSSClass = value; }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateInstance(TemplateInstance.Single)]
        [Browsable(false)]
        [MergableProperty(false)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        public ITemplate ContentTemplate
        {
            get { return _contentTemplate; }
            set { _contentTemplate = value; }
        }

        protected Collection<Control> Content
        {
            get
            {
                if (_content == null)
                {
                    _content = new Collection<Control>();
                }
                return _content;
            }
        }

        #endregion

        #region [ Methods ]

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            if (this.CssPath.Length == 0)
            {
                this.CssPath = Page.ClientScript.GetWebResourceUrl(typeof(AttachedPopup), "HTMLEditor.Popups.AttachedTemplatePopup.css");
            }

            if (_contentTemplate != null)
            {
                Control c = new Control();
                _contentTemplate.InstantiateIn(c);
                Content.Add(c);
            }
        }

        protected override void CreateChildControls()
        {
            _contentDiv = new HtmlGenericControl("div");
            _contentDiv.Style[HtmlTextWriterStyle.Display] = "none";

            HtmlGenericControl container = new HtmlGenericControl("div");
            container.Attributes.Add("class", ContainerCSSClass);

            _contentDiv.Controls.Add(container);

            for (int i = 0; i < this.Content.Count; i++)
            {
                container.Controls.Add(this.Content[i]);
            }
            Controls.Add(_contentDiv);
            base.CreateChildControls();
        }

        protected override void OnPreRender(EventArgs e)
        {
            _contentDiv.Attributes.Add("id", _contentDiv.ClientID);
            base.OnPreRender(e);
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            descriptor.AddElementProperty("contentDiv", _contentDiv.ClientID);
        }

        #endregion
    }
}
