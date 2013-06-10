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

[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.PopupBoxButton.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.PopupBoxButton.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.Popups
{
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.Popups.PopupBoxButton", "HTMLEditor.Popups.PopupBoxButton.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
    internal class PopupBoxButton : PopupCommonButton
    {
        #region [ Fields ]

        private ITemplate _contentTemplate;
        private Collection<Control> _content ;

        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new PopupBoxButton
        /// </summary>
        public PopupBoxButton()
            : base(HtmlTextWriterTag.Div)
        {
            CssClass = "ajax__htmleditor_popup_boxbutton";
        }

        public PopupBoxButton(HtmlTextWriterTag tag)
            : base(tag)
        {
            CssClass = "ajax__htmleditor_popup_boxbutton";
        }
        #endregion

        #region [ Properties ]

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

            if (_contentTemplate != null)
            {
                Control c = new Control();
                _contentTemplate.InstantiateIn(c);
                Content.Add(c);
            }
        }

        protected override void CreateChildControls()
        {
            for (int i = 0; i < this.Content.Count; i++)
            {
                Controls.Add(this.Content[i]);
            }

            base.CreateChildControls();
        }

        #endregion
    }
}
