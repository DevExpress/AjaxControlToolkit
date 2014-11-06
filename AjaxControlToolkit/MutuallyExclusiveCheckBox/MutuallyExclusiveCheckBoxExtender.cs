using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;

namespace AjaxControlToolkit {

    [TargetControlType(typeof(ICheckBoxControl))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior", Constants.MutuallyExclusiveCheckBoxName)]
    [Designer("AjaxControlToolkit.Design.MutuallyExclusiveCheckBoxExtenderDesigner, AjaxControlToolkit")]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.MutuallyExclusiveCheckBoxName + Constants.IconPostfix)]
    public class MutuallyExclusiveCheckBoxExtender : ExtenderControlBase {
        // The unique key to use to associate checkboxes. This key does
        // not respect INamingContainer renaming.
        [ExtenderControlProperty]
        [RequiredProperty]
        public string Key {
            get { return GetPropertyValue("Key", String.Empty); }
            set { SetPropertyValue("Key", value); }
        }
    }

}
