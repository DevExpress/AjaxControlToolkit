using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit {

    [TargetControlType(typeof(ListControl))]
    [ClientScriptResource("Sys.Extended.UI.ListSearchBehavior", Constants.ListSearchName)]
    [RequiredScript(typeof(CommonToolkitScripts), 0)]
    [RequiredScript(typeof(PopupControlExtender), 1)]
    [RequiredScript(typeof(AnimationExtender), 2)]
    [Designer(typeof(ListSearchExtenderDesigner))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.ListSearchName + Constants.IconPostfix)]
    public class ListSearchExtender : AnimationExtenderControlBase {

        public ListSearchExtender() {
            EnableClientState = true;
        }

        // OnLoad checks to see if it's focused by default
        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);

            // If this textbox has default focus, use ClientState to let it know
            ClientState = (String.Compare(Page.Form.DefaultFocus, TargetControlID, StringComparison.OrdinalIgnoreCase) == 0) ? "Focused" : null;
        }

        //The prompt text displayed when user clicks the list.
        [ExtenderControlProperty]
        [ClientPropertyName("promptText")]
        [DefaultValue("Type to search")]
        [Description("The prompt text displayed when user clicks the list")]
        public string PromptText {
            get { return GetPropertyValue("promptText", "Type to search"); }
            set { SetPropertyValue("promptText", value); }
        }

        // CSS class applied to prompt when user clicks list.
        [ExtenderControlProperty]
        [ClientPropertyName("promptCssClass")]
        [DefaultValue("")]
        [Description("CSS class applied to prompt when user clicks list")]
        public string PromptCssClass {
            get { return GetPropertyValue("promptCssClass", String.Empty); }
            set { SetPropertyValue("promptCssClass", value); }
        }

        // Indicates where you want the prompt message displayed when the user clicks on the list.
        [ExtenderControlProperty]
        [ClientPropertyName("promptPosition")]
        [DefaultValue(ListSearchPromptPosition.Top)]
        public ListSearchPromptPosition PromptPosition {
            get { return GetPropertyValue("promptPosition", ListSearchPromptPosition.Top); }
            set { SetPropertyValue("promptPosition", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("onShow")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnShow {
            get { return GetAnimation(ref _onShow, "OnShow"); }
            set { SetAnimation(ref _onShow, "OnShow", value); }
        }
        Animation _onShow;

        [ExtenderControlProperty]
        [ClientPropertyName("onHide")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHide {
            get { return GetAnimation(ref _onHide, "OnHide"); }
            set { SetAnimation(ref _onHide, "OnHide", value); }
        }
        Animation _onHide;

        // The timeout in milliseconds after which search query will be cleared.
        [ExtenderControlProperty]
        [DefaultValue(0)]
        [ClientPropertyName("queryTimeout")]
        public int QueryTimeout {
            get { return GetPropertyValue<int>("QueryTimeout", 0); }
            set { SetPropertyValue<int>("QueryTimeout", value); }
        }

        // Convert server IDs into ClientIDs for animations
        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            ResolveControlIDs(_onShow);
            ResolveControlIDs(_onHide);
        }

        // Indicates search query pattern to be used to find items.
        [ExtenderControlProperty]
        [ClientPropertyName("queryPattern")]
        [DefaultValue(ListSearchQueryPattern.StartsWith)]
        public ListSearchQueryPattern QueryPattern {
            get { return GetPropertyValue("QueryPattern", ListSearchQueryPattern.StartsWith); }
            set { SetPropertyValue("QueryPattern", value); }
        }

        // When setting this to true, we instruct search routines that
        // all values in List are already sorted on population,
        // so binary search can be used if on StartsWith criteria
        [ExtenderControlProperty]
        [ClientPropertyName("isSorted")]
        [DefaultValue(false)]
        public bool IsSorted {
            get { return GetPropertyValue<bool>("IsSorted", false); }
            set { SetPropertyValue<bool>("IsSorted", value); }
        }
    }

}