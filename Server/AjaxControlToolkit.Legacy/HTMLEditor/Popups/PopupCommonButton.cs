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

[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.PopupCommonButton.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.PopupCommonButton.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.Popups
{
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.Popups.PopupCommonButton", "HTMLEditor.Popups.PopupCommonButton.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1012:AbstractTypesShouldNotHaveConstructors")]
    public abstract class PopupCommonButton : ScriptControlBase
    {
        #region [ Fields ]

        private Collection<Control> _exportedControls;
        private string _name = String.Empty;

        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new PopupCommonButton
        /// </summary>
        protected PopupCommonButton(HtmlTextWriterTag tag)
            : base(false, tag)
        {
        }
        protected PopupCommonButton()
            : base(false, HtmlTextWriterTag.Div)
        {
        }

        #endregion

        #region [ Properties ]

        protected bool IsDesign
        {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "Exception is caught only for debugging purposes")]
            get
            {
                try
                {
                    bool isd = false;
                    if (this.Context == null)
                    {
                        isd = true;
                    }
                    else if (this.Site != null)
                    {
                        isd = this.Site.DesignMode;
                    }
                    else
                    {
                        isd = false;
                    }
                    return isd;
                }
                catch { return true; }
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Collection<Control> ExportedControls
        {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
            get
            {
                if (_exportedControls == null)
                {
                    _exportedControls = new Collection<Control>();
                }
                return _exportedControls;
            }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("name")]
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        #endregion

        #region [ Methods ]


        #endregion
    }
}
