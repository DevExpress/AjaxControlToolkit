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

[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.ColorSelector.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.ColorSelector.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.ToolbarButton
{
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector", "HTMLEditor.Toolbar_buttons.ColorSelector.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1501:AvoidExcessiveInheritance")]
    public abstract class ColorSelector : Selector
    {
        #region [ Fields ]

        private string _fixedColorButtonId = "";

        #endregion

        #region [ Properties ]

        [DefaultValue("")]
        public string FixedColorButtonId
        {
            get { return _fixedColorButtonId; }
            set { _fixedColorButtonId = value;}
        }

        #endregion

        #region [ Methods ]

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            RelatedPopup = new Popups.BaseColorsPopup();
        }

        protected override void OnPreRender(EventArgs e)
        {
            if (FixedColorButtonId.Length > 0 && !IsDesign)
            {
                FixedColorButton but = this.Parent.FindControl(FixedColorButtonId) as FixedColorButton;
                if (but != null)
                    this.ToolTip = but.ToolTip;
            }
            base.OnPreRender(e);
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            if (FixedColorButtonId.Length > 0 && !IsDesign)
            {
                FixedColorButton but = this.Parent.FindControl(FixedColorButtonId) as FixedColorButton;
                if (but != null)
                    descriptor.AddComponentProperty("fixedColorButton", but.ClientID);
                else
                    throw new ArgumentException("FixedColorButton control's ID expected");
            }
        }

        #endregion
    }
}
