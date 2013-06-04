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
using System.Resources;
using AjaxControlToolkit;

#region [ Resources ]

[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.CommonButton.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.CommonButton.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.ToolbarButton
{
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.ToolbarButton.CommonButton", "HTMLEditor.Toolbar_buttons.CommonButton.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1012:AbstractTypesShouldNotHaveConstructors")]
    public abstract class CommonButton : ScriptControlBase
    {
        #region [ Fields ]

        private Collection<ActiveModeType> _activeModes ;
        private Collection<Control> _exportedControls;
        private bool _wasPreRender;
        private bool _IgnoreTab ;
        internal DesignerWithMapPath _designer ;
        private ResourceManager _rm ;

        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new CommonButton
        /// </summary>
        protected CommonButton(HtmlTextWriterTag tag)
            : base(false, tag)
        {
            base.CssClass = "ajax__htmleditor_toolbar_button";
        }
        protected CommonButton()
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

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2222:DoNotDecreaseInheritedMemberVisibility", Justification = "For future use in Design")]
        internal new Page Page
        {
            get { return base.Page; }
            set { base.Page = value; }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public Collection<ActiveModeType> ActiveModes
        {
            get
            {
                if (_activeModes == null)
                {
                    _activeModes = new Collection<ActiveModeType>();
                }
                return _activeModes;
            }
        }

        internal Collection<Control> ExportedControls
        {
            get
            {
                if (_exportedControls == null)
                {
                    _exportedControls = new Collection<Control>();
                }
                return _exportedControls;
            }
        }

        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("preservePlace")]
        public bool PreservePlace
        {
            get { return (bool)(ViewState["PreservePlace"] ?? false); }
            set { ViewState["PreservePlace"] = value; }
        }

        [DefaultValue("ajax__htmleditor_toolbar_button")]
        public override string CssClass
        {
            get { return "ajax__htmleditor_toolbar_button"; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public bool IgnoreTab
        {
            get { return _IgnoreTab; }
            set { _IgnoreTab = value; }
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("activeModesIds")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase", Justification = "Avoiding possibly breaking change")]
        public string ActiveModesIds
        {
            get
            {
                string result = "";
                for (int i = 0; i < ActiveModes.Count; i++)
                {
                    if (i > 0) result += ";";
                    result += ((Int32)ActiveModes[i]).ToString(CultureInfo.InvariantCulture).ToLowerInvariant(); ;
                }
                return result;
            }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeActiveModesIds()
        {
            return IsRenderingScript;
        }

        #endregion

        #region [ Methods ]

        protected string GetFromResource(string name)
        {
            return _rm.GetString("HTMLEditor_toolbar_button_" + this.GetType().Name + "_" + name);
        }

        protected override void OnInit(EventArgs e)
        {
            _rm = new ResourceManager("ScriptResources.BaseScriptsResources", Assembly.GetExecutingAssembly());
            ToolTip = _rm.GetString("HTMLEditor_toolbar_button_" + this.GetType().Name + "_title");
            base.OnInit(e);
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "Exception is caught only for debugging purposes")]
        protected override void OnPreRender(EventArgs e)
        {
            try
            {
                base.OnPreRender(e);
            }
            catch { }
            _wasPreRender = true;
        }

        protected override void Render(HtmlTextWriter writer)
        {
            if (!_wasPreRender) this.OnPreRender(new EventArgs());
            base.Render(writer);
        }

        internal virtual void CreateChilds(DesignerWithMapPath designer)
        {
            _designer = designer;
            this.Controls.Clear();
            this.CreateChildControls();
        }

        #endregion
    }
}
