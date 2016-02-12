#pragma warning disable 1591
using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.Popups {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.Popups.PopupCommonButton", Constants.HtmlEditorPopupCommandButtonName)]
    public abstract class PopupCommonButton : ScriptControlBase {
        Collection<Control> _exportedControls;
        string _name = String.Empty;

        protected PopupCommonButton(HtmlTextWriterTag tag)
            : base(false, tag) {
        }
        protected PopupCommonButton()
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

        internal Collection<Control> ExportedControls {
            get {
                if(_exportedControls == null)
                    _exportedControls = new Collection<Control>();
                return _exportedControls;
            }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("name")]
        public string Name {
            get { return _name; }
            set { _name = value; }
        }
    }

}

#pragma warning restore 1591