using System.Web.UI;
using System.ComponentModel;
using System.Drawing;

namespace AjaxControlToolkit {

    [TargetControlType(typeof(ICheckBoxControl))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior", Constants.MutuallyExclusiveCheckBoxName)]
    [Designer("AjaxControlToolkit.Design.MutuallyExclusiveCheckBoxExtenderDesigner, AjaxControlToolkit")]
    [ToolboxBitmap(typeof(MutuallyExclusiveCheckBoxExtender), "MutuallyExclusiveCheckBox.ico")]
    public class MutuallyExclusiveCheckBoxExtender : ExtenderControlBase {
        // The unique key to use to associate checkboxes. This key does
        // not respect INamingContainer renaming.
        [ExtenderControlProperty]
        [RequiredProperty]
        public string Key {
            get { return GetPropertyValue("Key", string.Empty); }
            set { SetPropertyValue("Key", value); }
        }
    }
}