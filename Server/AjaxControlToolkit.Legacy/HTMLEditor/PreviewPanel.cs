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

[assembly: System.Web.UI.WebResource("HTMLEditor.PreviewPanel.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.PreviewPanel.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor
{
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(AjaxControlToolkit.HTMLEditor.HTMLEditor))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.PreviewPanel", "HTMLEditor.PreviewPanel.js")]
    internal class PreviewPanel : ModePanel
    {
        #region [ Constructors ]

        /// <summary>
        /// Initializes a new PreviewPanel
        /// </summary>
        public PreviewPanel()
            : base(HtmlTextWriterTag.Iframe)
        {
        }

        #endregion

        #region [ Methods ]

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            Attributes.Add("name", ClientID);
            Attributes.Add("marginheight", "0");
            Attributes.Add("marginwidth", "0");
            Attributes.Add("frameborder", "0");
            if (EditPanel.IE(Page))
            {
                Attributes.Add("src", "javascript:false;");
            }
            Style.Add(HtmlTextWriterStyle.BorderWidth, Unit.Pixel(0).ToString());
        }

        #endregion
    }
}
