using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Design {

    [TargetControlType(typeof(WebControl))]
    public class BalloonPopupExtenderDesigner : ExtenderControlBaseDesigner<BalloonPopupExtender> {
        // Signature of the page method for DynamicPopulateExtenderControlBase's web
        // service that is used to support adding/navigating to the page method from
        // the designer
        [PageMethodSignature("Dynamic Populate", "DynamicServicePath", "DynamicServiceMethod")]
        delegate string GetDynamicContent(string contextKey);
    }

}
