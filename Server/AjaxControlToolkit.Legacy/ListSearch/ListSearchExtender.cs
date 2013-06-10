

using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: System.Web.UI.WebResource("ListSearch.ListSearchBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("ListSearch.ListSearchBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// ListSearch extender class definition
    /// </summary>
    [TargetControlType(typeof(ListControl))]
    [ClientScriptResource("Sys.Extended.UI.ListSearchBehavior", "ListSearch.ListSearchBehavior.js")]
    [RequiredScript(typeof(CommonToolkitScripts), 0)]
    [RequiredScript(typeof(PopupControlExtender), 1)]
    [RequiredScript(typeof(AnimationExtender), 2)]
    [Description("Lets users search incrementally within ListBoxes")]
    [Designer(typeof(ListSearchDesigner))]
    [ToolboxItem(Utility.ToolBoxItemTypeName)]
    [ToolboxBitmap(typeof(ListSearchExtender), "ListSearch.ListSearch.ico")]
    public class ListSearchExtender : AnimationExtenderControlBase
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public ListSearchExtender()
        {
            EnableClientState = true;
        }

        /// <summary>
        /// OnLoad checks to see if it's focused by default
        /// </summary>
        /// <param name="e">arguments</param>
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            // If this textbox has default focus, use ClientState to let it know
            ClientState = (string.Compare(Page.Form.DefaultFocus, TargetControlID, StringComparison.OrdinalIgnoreCase) == 0) ? "Focused" : null;
        }


        /// <summary>
        ///The prompt text displayed when user clicks the list.
        /// </summary>
        /// <value>The prompt text.</value>        
        [ExtenderControlProperty]
        [ClientPropertyName("promptText")]
        [DefaultValue("Type to search")]
        [Description("The prompt text displayed when user clicks the list")]
        public string PromptText
        {
            get { return GetPropertyValue("promptText", "Type to search"); }
            set { SetPropertyValue("promptText", value); }
        }

        /// <summary>
        /// CSS class applied to prompt when user clicks list.
        /// </summary>
        /// <value>The prompt CSS class.</value>
        [ExtenderControlProperty]
        [ClientPropertyName("promptCssClass")]
        [DefaultValue("")]
        [Description("CSS class applied to prompt when user clicks list")]
        public string PromptCssClass
        {
            get { return GetPropertyValue("promptCssClass", ""); }
            set { SetPropertyValue("promptCssClass", value); }
        }

        /// <summary>
        /// Indicates where you want the prompt message displayed when the user clicks on the list.
        /// </summary>
        /// <value>The prompt position.</value>
        [ExtenderControlProperty]
        [ClientPropertyName("promptPosition")]
        [DefaultValue(ListSearchPromptPosition.Top)]
        [Description("Indicates where you want the prompt message displayed when the user clicks on the list.")]
        public ListSearchPromptPosition PromptPosition
        {
            get { return GetPropertyValue("promptPosition", ListSearchPromptPosition.Top); }
            set { SetPropertyValue("promptPosition", value); }
        }

        /// <summary>
        /// OnShow animation
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onShow")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnShow
        {
            get { return GetAnimation(ref _onShow, "OnShow"); }
            set { SetAnimation(ref _onShow, "OnShow", value); }
        }
        private Animation _onShow;

        /// <summary>
        /// OnHide animation
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onHide")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHide
        {
            get { return GetAnimation(ref _onHide, "OnHide"); }
            set { SetAnimation(ref _onHide, "OnHide", value); }
        }
        private Animation _onHide;

        /// <summary>
        /// The timeout in milliseconds after which search query will be cleared.
        /// </summary>
        /// <value>The query timeout in milliseconds.</value> 
        [ExtenderControlProperty]
        [DefaultValue(0)]
        [ClientPropertyName("queryTimeout")]
        public int QueryTimeout
        {
            get { return GetPropertyValue<int>("QueryTimeout", 0); }
            set
            {
                SetPropertyValue<int>("QueryTimeout", value);
            }
        }

        /// <summary>
        /// Convert server IDs into ClientIDs for animations
        /// </summary>
        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);

            ResolveControlIDs(_onShow);
            ResolveControlIDs(_onHide);
        }

        /// <summary>
        /// Indicates search query pattern to be used to find items.
        /// </summary>
        /// <value>The search pattern type.</value>
        [ExtenderControlProperty]
        [ClientPropertyName("queryPattern")]
        [DefaultValue(ListSearchQueryPattern.StartsWith)]
        [Description("Indicates search criteria to be used to find items.")]
        public ListSearchQueryPattern QueryPattern
        {
            get { return GetPropertyValue("QueryPattern", ListSearchQueryPattern.StartsWith); }
            set { SetPropertyValue("QueryPattern", value); }
        }

        /// <summary>
        /// When setting this to true, we instruct search routines that
        /// all values in List are already sorted on population,
        /// so binary search can be used if on StartsWith criteria
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("isSorted")]
        [DefaultValue(false)]
        public bool IsSorted
        {
            get { return GetPropertyValue<bool>("IsSorted", false); }
            set { SetPropertyValue<bool>("IsSorted", value); }
        }
    }
}