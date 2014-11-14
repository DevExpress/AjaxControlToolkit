using System;
using System.ComponentModel;
using System.Web.UI;
using System.Drawing.Design;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ToolboxItem(false)]
    [ParseChildren(true)]
    [PersistChildren(false)]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignMode", Constants.HtmlEditorDesignModeButtonName)]
    public class DesignMode : ModeButton {
        #region [ Methods ]

        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("EdDesign");
            ActiveMode = ActiveModeType.Design;
            base.OnPreRender(e);
        }

        #endregion
    }
}
