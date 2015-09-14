using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;

namespace AjaxControlToolkit {

    /// <summary>
    /// MutuallyExclusiveCheckBox is an ASP.NET AJAX extender that can be attached to any ASP.NET CheckBox control.
    /// By adding a number of checkboxes to the same Key, only one check box with the specified key can be checked
    /// at a time. This extender is useful when a number of choices are available but only one can be chosen,
    /// similar to a radio button. The use of checkboxes however allows you to choose to uncheck a value,
    /// which is not possible normally with radio buttons. This also provides a more consistent and expected
    /// interface than using JavaScript to allow de-selection of a RadioButton item.
    /// </summary>
    [TargetControlType(typeof(ICheckBoxControl))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior", Constants.MutuallyExclusiveCheckBoxName)]
    [Designer(typeof(MutuallyExclusiveCheckBoxExtenderDesigner))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.MutuallyExclusiveCheckBoxName + Constants.IconPostfix)]
    public class MutuallyExclusiveCheckBoxExtender : ExtenderControlBase {

        /// <summary>
        /// A unique key to use to associate check boxes
        /// </summary>
        /// <remarks>
        /// This key does not respect INamingContainer renaming
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
