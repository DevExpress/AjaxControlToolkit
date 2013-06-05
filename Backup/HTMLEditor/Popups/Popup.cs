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

[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.Popup.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Popups.Popup.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.Popups
{
    [ParseChildren(true)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.Popups.Popup", "HTMLEditor.Popups.Popup.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1012:AbstractTypesShouldNotHaveConstructors")]
    public abstract class Popup : ScriptControlBase
    {
        #region [ GetExistingPopup ]

        static public Popup GetExistingPopup(Control parent, Type type)
        {
            foreach (Control ctrl in parent.Controls)
            {
                if (ctrl.GetType().Equals(type))
                    return (ctrl as Popup);
                else
                {
                    Control foundControl = GetExistingPopup(ctrl, type);
                    if (foundControl != null)
                        return (foundControl as Popup);
                }
            }

            return null;
        }

        #endregion

        #region [ Fields ]

        private HtmlGenericControl _iframe;
        private string _savedCSS;
        private string _initialContent = "";
        private string _cssPath = "";
        private bool _autoDimensions = true;
        private Collection<RegisteredField> _registeredFields;
        private Collection<RegisteredField> _registeredHandlers;
        private ResourceManager _rm ;

        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new Popup
        /// </summary>
        protected Popup()
            : base(false, HtmlTextWriterTag.Div)
        {
        }

        #endregion

        #region [ Properties ]

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "Exception is caught only for debugging purposes")]
        private bool isDesign
        {
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

        [DefaultValue(true)]
        [Category("behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("autoDimensions")]
        public bool AutoDimensions
        {
            get { return (bool)_autoDimensions; }
            set { _autoDimensions = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        [ExtenderControlProperty]
        [ClientPropertyName("initialContent")]
        public string InitialContent
        {
            get { return (string)_initialContent; }
            set { _initialContent = value; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        [ExtenderControlProperty]
        [ClientPropertyName("cssPath")]
        public string CssPath
        {
            get { return (string)_cssPath; }
            set { _cssPath = value; }
        }

        public Collection<RegisteredField> RegisteredFields
        {
            get
            {
                if (_registeredFields == null)
                {
                    _registeredFields = new Collection<RegisteredField>();
                }
                return _registeredFields;
            }
        }

        private string RegisteredFieldsIds
        {
            get
            {
                string result = "[";
                for (int i = 0; i < RegisteredFields.Count; i++)
                {
                    if (i > 0) result += ",";
                    result += "{name: ";
                    result += "'"+RegisteredFields[i].Name+"'";
                    result += ", clientID: ";
                    result += "'" + RegisteredFields[i].Control.ClientID + "'";
                    result += "}";
                }
                result += "]";
                return result;
            }
        }

        public Collection<RegisteredField> RegisteredHandlers
        {
            get
            {
                if (_registeredHandlers == null)
                {
                    _registeredHandlers = new Collection<RegisteredField>();
                }
                return _registeredHandlers;
            }
        }

        private string RegisteredHandlersIds
        {
            get
            {
                string result = "[";
                for (int i = 0; i < RegisteredHandlers.Count; i++)
                {
                    if (i > 0) result += ",";
                    result += "{name: ";
                    result += "'" + RegisteredHandlers[i].Name + "'";
                    result += ", clientID: ";
                    result += "'" + RegisteredHandlers[i].Control.ClientID + "'";
                    result += ", callMethod: null";
                    result += "}";
                }
                result += "]";
                return result;
            }
        }

        #endregion

        #region [ Methods ]

        protected string GetButton(string name)
        {
            return _rm.GetString("HTMLEditor_toolbar_popup_" + this.GetType().Name + "_button_" + name);
        }

        protected string GetField(string name)
        {
            return _rm.GetString("HTMLEditor_toolbar_popup_" + this.GetType().Name + "_field_" + name);
        }

        protected string GetField(string name, string subName)
        {
            return GetField(name+"_"+subName);
        }

        protected override Style CreateControlStyle()
        {
            PopupStyle style = new PopupStyle(ViewState, this);
            return style;
        }

        protected override void OnInit(EventArgs e)
        {
            _rm = new ResourceManager("ScriptResources.BaseScriptsResources", Assembly.GetExecutingAssembly());
            base.OnInit(e);

            if (!isDesign)
            {
                _iframe = new HtmlGenericControl("iframe");
                _iframe.Attributes.Add("scrolling", "no");
                _iframe.Attributes.Add("marginHeight", "0");
                _iframe.Attributes.Add("marginWidth", "0");
                _iframe.Attributes.Add("frameborder", "0");
                _iframe.Attributes.Add("tabindex", "-1");
                Controls.Add(_iframe);
            }
        }

        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);

            if (_iframe != null)
            {
                string temp = (_savedCSS != null) ? _savedCSS : Style.Value;
                if(temp != null) if(temp.Length > 0) _iframe.Style.Value = temp;
                if (Height.ToString().Length> 0) _iframe.Style[HtmlTextWriterStyle.Height] = Height.ToString();
                if (Width.ToString().Length > 0) _iframe.Style[HtmlTextWriterStyle.Width] = Width.ToString();
                _iframe.Attributes.Add("id", _iframe.ClientID);
            }
            Height = Height;
        }

        protected override void Render(HtmlTextWriter writer)
        {
            if (!isDesign)
            {
                base.Render(writer);
            }
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            descriptor.AddElementProperty("iframe", _iframe.ClientID);
            descriptor.AddProperty("registeredFields", RegisteredFieldsIds);
            descriptor.AddProperty("registeredHandlers", RegisteredHandlersIds);
        }

        #endregion

        #region [ PopupStyle ]

        private sealed class PopupStyle : Style
        {
            private Popup _popup = null;
            public PopupStyle(StateBag state, Popup popup)
                : base(state)
            {
                _popup = popup;
            }

            protected override void FillStyleAttributes(CssStyleCollection attributes, IUrlResolutionService urlResolver)
            {
                _popup._savedCSS = attributes.Value;
                attributes.Add(HtmlTextWriterStyle.Position, "absolute");
                attributes.Add(HtmlTextWriterStyle.Top, "-2000px");
                attributes.Add(HtmlTextWriterStyle.Left, "-2000px");
            }
        }

        #endregion
    }

    #region [ RegisteredField ]

    [Serializable]
    public class RegisteredField
    {
        private string _name = "";
        [NonSerialized]
        private Control _control ;

        public RegisteredField()
        {
        }

        public RegisteredField( string name, Control control)
        {
            _name = name;
            _control = control;
        }

        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        public Control Control
        {
            get { return _control; }
            set { _control = value; }
        }
    }
    #endregion
}
