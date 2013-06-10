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

[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.SelectButton.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.SelectButton.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.ToolbarButton
{
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.ToolbarButton.SelectButton", "HTMLEditor.Toolbar_buttons.SelectButton.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1012:AbstractTypesShouldNotHaveConstructors")]
    public abstract class SelectButton : CommonButton
    {
        #region [ Fields ]

        private Collection<SelectOption> _options ;

        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new SelectButton
        /// </summary>
        public SelectButton()
            : base(HtmlTextWriterTag.Div)
        {
        }

        #endregion

        #region [ Properties ]

        [PersistenceMode(PersistenceMode.InnerProperty)]
        public Collection<SelectOption> Options
        {
            get
            {
                if (_options == null)
                {
                    _options = new Collection<SelectOption>();
                }
                return _options;
            }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public virtual string SelectWidth
        {
            get { return string.Empty; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public virtual string DefaultValue
        {
            get { return string.Empty; }
        }

        [DefaultValue(true)]
        [Category("Appearance")]
        public virtual bool UseDefaultValue
        {
            get { return true; }
        }

        #endregion

        #region [ Methods ]

        protected override void CreateChildControls()
        {
            HtmlGenericControl nobr = new HtmlGenericControl("nobr");
            HtmlGenericControl label = new HtmlGenericControl("span");
            label.Attributes.Add("class", "ajax__htmleditor_toolbar_selectlable");
            label.ID = "label";
            label.Controls.Add(new LiteralControl(GetFromResource("label")+"&nbsp;"));
            nobr.Controls.Add(label);
            HtmlGenericControl select = new HtmlGenericControl("select");
            select.Attributes.Add("class", "ajax__htmleditor_toolbar_selectbutton");
            select.ID = "select";
            if (!String.IsNullOrEmpty(SelectWidth))
            {
                select.Style[HtmlTextWriterStyle.Width] = SelectWidth;
            }
            if (this.IgnoreTab)
            {
                select.Attributes.Add("tabindex", "-1");
            }
            nobr.Controls.Add(select);
            if (UseDefaultValue)
            {
                select.Controls.Add(new LiteralControl("<option value=\"" + DefaultValue + "\">" + GetFromResource("defaultValue") + "</option>"));
            }
            for (int i = 0; i < Options.Count; i++)
            {
                select.Controls.Add(new LiteralControl("<option value=\"" + Options[i].Value + "\">" + Options[i].Text + "</option>"));
            }
            Controls.Add(nobr);
        }

        protected override Style CreateControlStyle()
        {
            SelectButtonStyle style = new SelectButtonStyle(ViewState);
            return style;
        }

        #endregion

        #region [ SelectButtonStyle ]

        private sealed class SelectButtonStyle : Style
        {
            public SelectButtonStyle(StateBag state)
                : base(state)
            {
            }

            protected override void FillStyleAttributes(CssStyleCollection attributes, IUrlResolutionService urlResolver)
            {
                base.FillStyleAttributes(attributes, urlResolver);

                attributes.Add("background-color", "transparent");
                attributes.Add("cursor", "text");
            }
        }

        #endregion
    }

    public class SelectOption
    {
        private string _value = "";
        private string _text = "";

        public string Value
        {
            get { return _value; }
            set { _value = value; }
        }

        public string Text
        {
            get { return _text; }
            set { _text = value; }
        }
    }
}
