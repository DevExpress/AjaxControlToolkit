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

[assembly: WebResource("HTMLEditor.Images.ed_align_left_n.gif", "image/gif")]
[assembly: WebResource("HTMLEditor.Images.ed_align_left_a.gif", "image/gif")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.JustifyLeft.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.JustifyLeft.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.ToolbarButton
{
    [ToolboxItem(false)]
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyLeft", "HTMLEditor.Toolbar_buttons.JustifyLeft.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1501:AvoidExcessiveInheritance")]
    public class JustifyLeft : EditorToggleButton
    {
        #region [ Methods ]

        protected override void OnPreRender(EventArgs e)
        {
            RegisterButtonImages("ed_align_left");
            base.OnPreRender(e);
        }

        #endregion
    }
}
