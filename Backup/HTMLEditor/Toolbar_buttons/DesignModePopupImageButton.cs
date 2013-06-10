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

[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.DesignModePopupImageButton.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.DesignModePopupImageButton.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.ToolbarButton
{
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModePopupImageButton", "HTMLEditor.Toolbar_buttons.DesignModePopupImageButton.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1501:AvoidExcessiveInheritance")]
    public abstract class DesignModePopupImageButton : MethodButton
    {
        #region [ Fields ]

        private Popups.Popup _popup ;
        private bool _autoClose = true;

        #endregion

        #region [ Properties ]

        protected Popups.Popup RelatedPopup
        {
            get { return (Popups.Popup)_popup; }
            set
            {
                _popup = value;
                if (!IsDesign)
                {
                    Popups.Popup popup = Popups.Popup.GetExistingPopup(this.Parent, RelatedPopup.GetType());
                    if (popup == null)
                    {
                        this.ExportedControls.Add(_popup);
                    }
                    else
                    {
                        _popup = popup;
                    }
                }
            }
        }

        protected bool AutoClose
        {
            get { return _autoClose; }
            set { _autoClose = value; }
        }

        #endregion

        #region [ Methods ]

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            if (RelatedPopup != null && !IsDesign)
            {
                descriptor.AddComponentProperty("relatedPopup", RelatedPopup.ClientID);
            }
            descriptor.AddProperty("autoClose", AutoClose);
        }

        #endregion
    }
}
