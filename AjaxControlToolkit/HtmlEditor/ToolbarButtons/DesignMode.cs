#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Web.UI;
using System.Drawing.Design;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignMode", Constants.HtmlEditorDesignModeButtonName)]
    public class DesignMode : ModeButton {
        #region [ Methods ]

        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-Design");
            ActiveMode = ActiveModeType.Design;
            base.OnPreRender(e);
        }

        #endregion
    }
}

#pragma warning restore 1591