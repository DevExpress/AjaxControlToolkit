#pragma warning disable 1591
using System.ComponentModel;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(Enums))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ModeButton", Constants.HtmlEditorModeButtonName)]
    public abstract class ModeButton : ImageButton {
        public ModeButton()
            : base() {
            ActiveModes.Add(ActiveModeType.Design);
            ActiveModes.Add(ActiveModeType.Html);
            ActiveModes.Add(ActiveModeType.Preview);
        }

        [DefaultValue(ActiveModeType.Design)]
        [Category("Behavior")]
        [ExtenderControlProperty]
        [ClientPropertyName("activeMode")]
        public ActiveModeType ActiveMode {
            get { return (ActiveModeType)(ViewState["ActiveMode"] ?? ActiveModeType.Design); }
            set { ViewState["ActiveMode"] = value; }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeActiveMode() {
            return IsRenderingScript;
        }
    }

}

#pragma warning restore 1591