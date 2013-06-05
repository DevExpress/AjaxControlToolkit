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

[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.ModeButton.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.ModeButton.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.ToolbarButton
{
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(AjaxControlToolkit.HTMLEditor.Enums))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton", "HTMLEditor.Toolbar_buttons.ModeButton.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1012:AbstractTypesShouldNotHaveConstructors")]
    public abstract class ModeButton : ImageButton
    {
        #region [ Constructors ]

        public ModeButton()
            : base()
        {
            ActiveModes.Add(ActiveModeType.Design);
            ActiveModes.Add(ActiveModeType.Html);
            ActiveModes.Add(ActiveModeType.Preview);
        }

        #endregion

        #region [ Properties ]

        [DefaultValue(ActiveModeType.Design)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("activeMode")]
        public ActiveModeType ActiveMode
        {
            get { return (ActiveModeType)(ViewState["ActiveMode"] ?? ActiveModeType.Design); }
            set { ViewState["ActiveMode"] = value; }
        }
        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeActiveMode()
        {
            return IsRenderingScript;
        }

        #endregion
    }
}
