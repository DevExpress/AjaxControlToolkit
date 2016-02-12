#pragma warning disable 1591
using System.Web.UI.WebControls;
using System.Web.UI;

namespace AjaxControlToolkit.Design {

    public class AutoCompleteExtenderDesigner : ExtenderControlBaseDesigner<AutoCompleteExtender> {
        // Signature of the page method for AutoComplete's web service that
        // is used to support adding/navigating to the page method from the designer        
        [PageMethodSignature("AutoComplete", "ServicePath", "ServiceMethod", "UseContextKey")]
        delegate string[] GetCompletionList(string prefixText, int count, string contextKey);
    }

}
#pragma warning restore 1591