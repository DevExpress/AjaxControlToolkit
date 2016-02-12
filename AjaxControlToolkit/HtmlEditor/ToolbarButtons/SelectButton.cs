#pragma warning disable 1591
using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.SelectButton", Constants.HtmlEditorSelectButtonName)]
    public abstract class SelectButton : CommonButton {
        Collection<SelectOption> _options;

        public SelectButton()
            : base(HtmlTextWriterTag.Div) {
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        public Collection<SelectOption> Options {
            get {
                if(_options == null)
                    _options = new Collection<SelectOption>();
                return _options;
            }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public virtual string SelectWidth {
            get { return String.Empty; }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        public virtual string DefaultValue {
            get { return String.Empty; }
        }

        [DefaultValue(true)]
        [Category("Appearance")]
        public virtual bool UseDefaultValue {
            get { return true; }
        }

        protected override void CreateChildControls() {
            var nobr = new HtmlGenericControl("nobr");
            var label = new HtmlGenericControl("span");

            label.Attributes.Add("class", "ajax__htmleditor_toolbar_selectlable");
            label.ID = "label";
            label.Controls.Add(new LiteralControl(GetFromResource("label") + "&nbsp;"));

            nobr.Controls.Add(label);
            var select = new HtmlGenericControl("select");
            select.Attributes.Add("class", "ajax__htmleditor_toolbar_selectbutton");
            select.ID = "select";

            if(!String.IsNullOrEmpty(SelectWidth))
                select.Style[HtmlTextWriterStyle.Width] = SelectWidth;
            if(IgnoreTab)
                select.Attributes.Add("tabindex", "-1");
            nobr.Controls.Add(select);
            if(UseDefaultValue)
                select.Controls.Add(new LiteralControl("<option value=\"" + DefaultValue + "\">" + GetFromResource("defaultValue") + "</option>"));
            for(var i = 0; i < Options.Count; i++)
                select.Controls.Add(new LiteralControl("<option value=\"" + Options[i].Value + "\">" + Options[i].Text + "</option>"));
            Controls.Add(nobr);
        }

        protected override Style CreateControlStyle() {
            return new SelectButtonStyle(ViewState);
        }

        private sealed class SelectButtonStyle : Style {
            public SelectButtonStyle(StateBag state)
                : base(state) {
            }

            protected override void FillStyleAttributes(CssStyleCollection attributes, IUrlResolutionService urlResolver) {
                base.FillStyleAttributes(attributes, urlResolver);

                attributes.Add("background-color", "transparent");
                attributes.Add("cursor", "text");
            }
        }
    }

    public class SelectOption {
        string _value = String.Empty;
        string _text = String.Empty;

        public string Value {
            get { return _value; }
            set { _value = value; }
        }

        public string Text {
            get { return _text; }
            set { _text = value; }
        }
    }

}

#pragma warning restore 1591