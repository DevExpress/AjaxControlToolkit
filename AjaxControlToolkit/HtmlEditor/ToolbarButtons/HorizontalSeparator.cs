#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Drawing.Design;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.HorizontalSeparator", Constants.HtmlEditorHorizontalSepearatorButtonName)]
    public class HorizontalSeparator : DesignModeImageButton {
        protected override void OnPreRender(EventArgs e) {
            RegisterButtonImages("Ed-Separator");
            base.OnPreRender(e);
        }

        protected override Style CreateControlStyle() {
            var style = new HorizontalSeparatorStyle(ViewState);
            return style;
        }

        private sealed class HorizontalSeparatorStyle : Style {
            public HorizontalSeparatorStyle(StateBag state)
                : base(state) {
            }

            protected override void FillStyleAttributes(CssStyleCollection attributes, IUrlResolutionService urlResolver) {
                base.FillStyleAttributes(attributes, urlResolver);

                attributes.Add("background-color", "transparent");
                attributes.Add("cursor", "text");
                attributes.Add("width", "13px");
            }
        }
    }

}

#pragma warning restore 1591