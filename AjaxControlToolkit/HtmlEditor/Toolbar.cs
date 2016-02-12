#pragma warning disable 1591
using AjaxControlToolkit.Design;
using AjaxControlToolkit.HtmlEditor.ToolbarButtons;
using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Text.RegularExpressions;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.Toolbar", Constants.HtmlEditorToolbarName)]
    public abstract class Toolbar : ScriptControlBase {
        Collection<CommonButton> _buttons;
        bool _wasPreRender;

        protected Toolbar()
            : base(false, HtmlTextWriterTag.Div) {
        }

        protected bool IsDesign {
            get {
                try {
                    var isd = false;
                    if(Context == null)
                        isd = true;
                    else if(Site != null)
                        isd = this.Site.DesignMode;
                    else
                        isd = false;

                    return isd;
                }
                catch { return true; }
            }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("alwaysVisible")]
        public bool AlwaysVisible {
            get { return (bool)(ViewState["AlwaysVisible"] ?? false); }
            set { ViewState["AlwaysVisible"] = value; }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        public Collection<CommonButton> Buttons {
            get {
                if(_buttons == null)
                    _buttons = new Collection<CommonButton>();
                return _buttons;
            }

            internal set {
                _buttons = value;
            }
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("buttonIds")]
        public string ButtonIds {
            get {
                var result = String.Empty;
                for(var i = 0; i < Buttons.Count; i++) {
                    if(i > 0) result += ";";
                    result += Buttons[i].ClientID;
                }
                return result;
            }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeButtonIds() {
            return IsRenderingScript;
        }

        [DefaultValue("")]
        [Category("Appearance")]
        [Description("Folder used for toolbar's buttons' images")]
        public string ButtonImagesFolder {
            get { return (String)(ViewState["ButtonImagesFolder"] ?? String.Empty); }
            set {
                var temp = LocalResolveUrl(value);
                if(temp.Length > 0) {
                    var lastCh = temp.Substring(temp.Length - 1, 1);
                    if(lastCh != "\\" && lastCh != "/") temp += "/";
                    ViewState["ButtonImagesFolder"] = temp;
                }
            }
        }

        protected string LocalResolveUrl(string path) {
            var temp = base.ResolveUrl(path);
            var _Regex = new Regex(@"(\(S\([A-Za-z0-9_]+\)\)/)", RegexOptions.Compiled);
            temp = _Regex.Replace(temp, String.Empty);
            return temp;
        }

        protected override void CreateChildControls() {
            for(var i = 0; i < Buttons.Count; i++) {
                Controls.Add(Buttons[i]);

                if(!AlwaysVisible && !IsDesign)
                    if(!Buttons[i].PreservePlace)
                        Buttons[i].Style[HtmlTextWriterStyle.Display] = "none";
                    else
                        Buttons[i].Style[HtmlTextWriterStyle.Visibility] = "hidden";

                for(var j = 0; j < Buttons[i].ExportedControls.Count; j++)
                    Controls.Add(Buttons[i].ExportedControls[j]);
            }
        }

        protected override void OnPreRender(EventArgs e) {
            try {
                base.OnPreRender(e);
            }
            catch { }
            _wasPreRender = true;
            for(var i = 0; i < Controls.Count; i++) {
                var button = Controls[i] as CommonButton;
                if(button != null) {
                    if(!IsDesign) {
                        if(!button.PreservePlace)
                            button.Style[HtmlTextWriterStyle.Display] = "none";
                        else
                            button.Style[HtmlTextWriterStyle.Visibility] = "hidden";
                    }
                    else {
                        button.Style.Remove(HtmlTextWriterStyle.Display);
                        button.Style.Remove(HtmlTextWriterStyle.Visibility);
                    }
                }
            }
        }

        protected override void Render(HtmlTextWriter writer) {
            if(!_wasPreRender)
                OnPreRender(new EventArgs());
            base.Render(writer);
        }

        internal void CreateChilds(DesignerWithMapPath designer) {
            Controls.Clear();
            CreateChildControls();

            for(var i = 0; i < Controls.Count; i++) {
                var button = Controls[i] as CommonButton;
                if(button != null)
                    button.CreateChilds(designer);
            }
        }
    }

}

#pragma warning restore 1591