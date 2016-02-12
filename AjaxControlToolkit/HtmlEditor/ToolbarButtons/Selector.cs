#pragma warning disable 1591
using System;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Selector", Constants.HtmlEditorSelectorButtonName)]
    public abstract class Selector : DesignModePopupImageButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-Selector");
            base.OnPreRender(e);
        }

        protected override Style CreateControlStyle() {
            return new SelectorStyle(ViewState);
        }

        private sealed class SelectorStyle : Style {
            public SelectorStyle(StateBag state)
                : base(state) {
            }

            protected override void FillStyleAttributes(CssStyleCollection attributes, IUrlResolutionService urlResolver) {
                base.FillStyleAttributes(attributes, urlResolver);

                attributes.Add("width", "11px");
            }
        }
    }

}

#pragma warning restore 1591