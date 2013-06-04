


using System.Web.UI.WebControls;
using System.Web.UI;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit
{
    /// <summary>
    /// AutoComplete Designer class
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2117:AptcaTypesShouldOnlyExtendAptcaBaseTypes", Justification = "Security handled by base class")]
    public class AutoCompleteDesigner : ExtenderControlBaseDesigner<AutoCompleteExtender>
    {
        /// <summary>
        /// Signature of the page method for AutoComplete's web service that
        /// is used to support adding/navigating to the page method from the designer
        /// </summary>
        /// <param name="prefixText">Text already entered</param>
        /// <param name="count">Number of items to return</param>
        /// <param name="contextKey">Optional user specific context</param>
        /// <returns>Possible completions of the prefix text</returns>
        [PageMethodSignature("AutoComplete", "ServicePath", "ServiceMethod", "UseContextKey")]
        private delegate string[] GetCompletionList(string prefixText, int count, string contextKey);
    }
}