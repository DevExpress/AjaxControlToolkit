


using System.Web.UI.WebControls;
using System.Web.UI;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit
{
    [TargetControlType(typeof(WebControl))]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2117:AptcaTypesShouldOnlyExtendAptcaBaseTypes", Justification = "Security handled by base class")]
    public class DynamicPopulateDesigner : ExtenderControlBaseDesigner<DynamicPopulateExtender>
    {
        /// <summary>
        /// Signature of the page method for DynamicPopulate's web service that
        /// is used to support adding/navigating to the page method from the designer
        /// </summary>
        /// <param name="contextKey">User specific context</param>
        /// <returns>Dynamically generated content</returns>
        [PageMethodSignature("Dynamic Populate", "ServicePath", "ServiceMethod")]
        private delegate string GetDynamicContent(string contextKey);
    }
}