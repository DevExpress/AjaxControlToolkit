using System;
using System.Web.UI;
using System.ComponentModel;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.HoverExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.HoverBehavior", Constants.HoverName)]
    [TargetControlType(typeof(Control))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ToolboxItem(false)]
    public class HoverExtender : ExtenderControlBase {
        [ExtenderControlProperty]
        [ClientPropertyName("hoverDelay")]
        [DefaultValue(0)]
        public int HoverDelay {
            get { return GetPropertyValue("hoverDelay", 0); }
            set { SetPropertyValue("hoverDelay", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("hoverScript")]
        public string HoverScript {
            get { return GetPropertyValue("HoverScript", ""); }
            set { SetPropertyValue("HoverScript", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("unhoverDelay")]
        [DefaultValue(0)]
        public int UnhoverDelay {
            get { return GetPropertyValue("UnhoverDelay", 0); }
            set { SetPropertyValue("UnhoverDelay", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("unhoverScript")]
        public string UnhoverScript {
            get { return GetPropertyValue("UnhoverScript", ""); }
            set { SetPropertyValue("UnhoverScript", value); }
        }
    }

}