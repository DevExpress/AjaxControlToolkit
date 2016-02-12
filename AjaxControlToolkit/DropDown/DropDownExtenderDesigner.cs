#pragma warning disable 1591
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit.Design {

    public class DropDownExtenderDesigner : ExtenderControlBaseDesigner<DropDownExtender> {
        // Signature of the page method for DynamicPopulateExtenderControlBase's web
        // service that is used to support adding/navigating to the page method from
        // the designer     
        [PageMethodSignature("Dynamic Populate", "DynamicServicePath", "DynamicServiceMethod")]
        delegate string GetDynamicContent(string contextKey);
    }

}
#pragma warning restore 1591