using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;

namespace AjaxControlToolkit {

    [TargetControlType(typeof(ICheckBoxControl))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior", Constants.MutuallyExclusiveCheckBoxName)]
    [Designer(typeof(MutuallyExclusiveCheckBoxExtenderDesigner))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.MutuallyExclusiveCheckBoxName + Constants.IconPostfix)]
    public class MutuallyExclusiveCheckBoxExtender : ExtenderControlBase {
        /// <summary>
        /// The unique key to use to associate checkboxes.
        /// </summary>
        /// <remarks>
        /// This key does not respect INamingContainer renaming.
        /// </remarks>
        [ExtenderControlProperty]
        [RequiredProperty]
        [ClientPropertyName("key")]
        public string Key {
            get { return GetPropertyValue("Key", String.Empty); }
            set { SetPropertyValue("Key", value); }
        }
    }

}
