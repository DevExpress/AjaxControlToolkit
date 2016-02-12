#pragma warning disable 1591
using System;

namespace AjaxControlToolkit.Design {

    public class CascadingDropDownExtenderDesigner : ExtenderControlBaseDesigner<CascadingDropDown> {
        // Signature of the page method for CascadingDropDown's web service that is used to support adding/navigating to the page method from the designer
        // KnownCategoryValues is a seperated string containing the category values already known
        [PageMethodSignature("CascadingDropDown", "ServicePath", "ServiceMethod", "UseContextKey")]
        delegate CascadingDropDownNameValue[] GetDropDownContents(string knownCategoryValues, string category);
    }

}

#pragma warning restore 1591