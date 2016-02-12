#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit {

    /// <summary>
    /// ListSearchExtender lets you search for items in the ListBox or DropDownList by typing.
    /// The extender performs an incremental search within the ListBox based on what has been typed
    /// so far. The prompt message that is displayed when you click the list can be customized along
    /// with its CSS class and position.
    /// </summary>
    [TargetControlType(typeof(ListControl))]
    [ClientScriptResource("Sys.Extended.UI.ListSearchBehavior", Constants.ListSearchName)]
    [RequiredScript(typeof(CommonToolkitScripts), 0)]
    [RequiredScript(typeof(PopupControlExtender), 1)]
    [RequiredScript(typeof(AnimationExtender), 2)]
    [Designer(typeof(ListSearchExtenderDesigner))]
    [Description("Lets users search incrementally within ListBoxes")]
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

        /// <summary>
        /// A message to display when the ListBox or DropDownList receives focus
        /// </summary>
        /// <remarks>
        /// The default value is 'Type to search'. The PromptText is replaced by the search text typed by a user
        /// </remarks>
        [ExtenderControlProperty]
        [ClientPropertyName("promptText")]
        [DefaultValue("Type to search")]
        [Description("The prompt text displayed when user clicks the list")]
        public string PromptText {
            get { return GetPropertyValue("promptText", "Type to search"); }
            set { SetPropertyValue("promptText", value); }
        }

        /// <summary>
        /// The name of a CSS class to apply to the prompt message
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("promptCssClass")]
        [DefaultValue("")]
        [Description("CSS class applied to prompt when user clicks list")]
        public string PromptCssClass {
            get { return GetPropertyValue("promptCssClass", String.Empty); }
            set { SetPropertyValue("promptCssClass", value); }
        }

        /// <summary>
        /// Indicates whether the message should appear at the Top or Bottom of the ListBox.
        /// The default is Top
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("promptPosition")]
        [DefaultValue(ListSearchPromptPosition.Top)]
        [Description("Indicates where you want the prompt message displayed when the user clicks on the list.")]
        public ListSearchPromptPosition PromptPosition {
            get { return GetPropertyValue("promptPosition", ListSearchPromptPosition.Top); }
            set { SetPropertyValue("promptPosition", value); }
        }

        /// <summary>
        /// OnShow animation will be played each time the extender's prompt is displayed
        /// </summary>
        /// <remarks>
        /// The prompt will be positioned correctly but hidden. Animation can be used to
        /// display the prompt with other visual effects
        /// </remarks>
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

        /// <summary>
        /// OnHide animation will be played each time the extender's prompt is hidden
        /// </summary>
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

        /// <summary>
        /// Indicates whether a search query should be reset after the timeout if no match is found.
        /// The default is 0 meaning no auto reset behavior
        /// </summary>
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

        /// <summary>
        /// Indicates how typed characters should be used in the search query
        /// </summary>
        /// <remarks>
        /// The default pattern queries for results that start with the typed word
        /// </remarks>
        [ExtenderControlProperty]
        [ClientPropertyName("queryPattern")]
        [DefaultValue(ListSearchQueryPattern.StartsWith)]
        [Description("Indicates search criteria to be used to find items.")]
        public ListSearchQueryPattern QueryPattern {
            get { return GetPropertyValue("QueryPattern", ListSearchQueryPattern.StartsWith); }
            set { SetPropertyValue("QueryPattern", value); }
        }

        /// <summary>
        /// Indicates if items added to the List are expected to be sorted
        /// </summary>
        /// <remarks>
        /// The default value is false. If it is set to true, it allows code to perform
        /// a faster search instead of performing the same operation before the search
        /// </remarks>
        [ExtenderControlProperty]
        [ClientPropertyName("isSorted")]
        [DefaultValue(false)]
        public bool IsSorted {
            get { return GetPropertyValue<bool>("IsSorted", false); }
            set { SetPropertyValue<bool>("IsSorted", value); }
        }
    }

}
#pragma warning restore 1591