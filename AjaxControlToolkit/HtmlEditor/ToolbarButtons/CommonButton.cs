#pragma warning disable 1591
using AjaxControlToolkit.Design;
using AjaxControlToolkit.HtmlEditor;
using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Globalization;
using System.Reflection;
using System.Resources;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.CommonButton", Constants.HtmlEditorCommonButtonName)]
    [ToolboxItem(false)]
    public abstract class CommonButton : ScriptControlBase {
        Collection<ActiveModeType> _activeModes;
        Collection<Control> _exportedControls;
        bool _wasPreRender;
        bool _ignoreTab;
        internal DesignerWithMapPath _designer;

        protected CommonButton(HtmlTextWriterTag tag)
            : base(false, tag) {
            base.CssClass = "ajax__htmleditor_toolbar_button";
        }
        protected CommonButton()
            : base(false, HtmlTextWriterTag.Div) {
        }

        protected bool IsDesign {
            get {
                try {
                    var isd = false;
                    if(Context == null)
                        isd = true;
                    else if(Site != null)
                        isd = Site.DesignMode;
                    else
                        isd = false;

                    return isd;
                }
                catch { return true; }
            }
        }

        internal new Page Page {
            get { return base.Page; }
            set { base.Page = value; }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public Collection<ActiveModeType> ActiveModes {
            get {
                if(_activeModes == null)
                    _activeModes = new Collection<ActiveModeType>();
                return _activeModes;
            }
        }

        internal Collection<Control> ExportedControls {
            get {
                if(_exportedControls == null)
                    _exportedControls = new Collection<Control>();
                return _exportedControls;
            }
        }

        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("preservePlace")]
        public bool PreservePlace {
            get { return (bool)(ViewState["PreservePlace"] ?? false); }
            set { ViewState["PreservePlace"] = value; }
        }

        [DefaultValue("ajax__htmleditor_toolbar_button")]
        public override string CssClass {
            get { return "ajax__htmleditor_toolbar_button"; }
        }

        [DefaultValue(false)]
        [Category("Behavior")]
        public bool IgnoreTab {
            get { return _ignoreTab; }
            set { _ignoreTab = value; }
        }

        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("activeModesIds")]
        public string ActiveModesIds {
            get {
                var result = String.Empty;
                for(var i = 0; i < ActiveModes.Count; i++) {
                    if(i > 0) result += ";";
                    result += ((Int32)ActiveModes[i]).ToString(CultureInfo.InvariantCulture).ToLowerInvariant(); ;
                }
                return result;
            }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeActiveModesIds() {
            return IsRenderingScript;
        }

        protected string GetFromResource(string name) {
            //return _rm.GetString("HtmlEditor_toolbar_button_" + GetType().Name + "_" + name); //TODO: resources
            return "";
        }

        protected override void OnInit(EventArgs e) {
            //_rm = new ResourceManager("ScriptResources.BaseScriptsResources", Assembly.GetExecutingAssembly());
            //ToolTip = _rm.GetString("HtmlEditor_toolbar_button_" + GetType().Name + "_title"); //TODO: resources
            base.OnInit(e);
        }

        protected override void OnPreRender(EventArgs e) {
            try {
                base.OnPreRender(e);
            }
            catch { }
            _wasPreRender = true;
        }

        protected override void Render(HtmlTextWriter writer) {
            if(!_wasPreRender) OnPreRender(new EventArgs());
            base.Render(writer);
        }

        internal virtual void CreateChilds(DesignerWithMapPath designer) {
            _designer = designer;
            Controls.Clear();
            CreateChildControls();
        }
    }

}

#pragma warning restore 1591