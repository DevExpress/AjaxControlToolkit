

using System.Web.UI;
using System.ComponentModel;
using System.Drawing;

[assembly: System.Web.UI.WebResource("MutuallyExclusiveCheckBox.MutuallyExclusiveCheckBoxBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("MutuallyExclusiveCheckBox.MutuallyExclusiveCheckBoxBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    [TargetControlType(typeof(ICheckBoxControl))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior", "MutuallyExclusiveCheckBox.MutuallyExclusiveCheckBoxBehavior.js")]
    [Designer("AjaxControlToolkit.MutuallyExclusiveCheckBoxDesigner, AjaxControlToolkit")]
    [ToolboxBitmap(typeof(MutuallyExclusiveCheckBoxExtender), "MutuallyExclusiveCheckBox.MutuallyExclusiveCheckBox.ico")]
    public class MutuallyExclusiveCheckBoxExtender : ExtenderControlBase
    {
        /// <summary>
        /// The unique key to use to associate checkboxes. This key does
        /// not respect INamingContainer renaming.
        /// </summary>
        [ExtenderControlProperty]
        [RequiredProperty]
        public string Key
        {
            get { return GetPropertyValue("Key", string.Empty); }
            set { SetPropertyValue("Key", value); }
        }
    }
}