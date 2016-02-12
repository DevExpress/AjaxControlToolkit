#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    // This just wraps the Ajax draggableListItem behavior.
    [ClientScriptResource("Sys.Extended.UI.DraggableListItem", Constants.DraggableListItemName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(ReorderListItem))]
    [ToolboxItem(false)]
    public class DraggableListItemExtender : ExtenderControlBase {
        [IDReferenceProperty(typeof(Control))]
        [ClientPropertyName("handle")]
        [ExtenderControlProperty()]
        [ElementReference()]
        [DefaultValue("")]
        public string Handle {
            get { return GetPropertyValue("handle", ""); }
            set { SetPropertyValue("handle", value); }
        }
    }

}

#pragma warning restore 1591