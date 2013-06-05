


using System;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit
{
    /// <summary>
    /// CascadingDropDown designer class definition
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2117:AptcaTypesShouldOnlyExtendAptcaBaseTypes", Justification = "Security handled by base class")]
    public class CascadingDropDownDesigner : ExtenderControlBaseDesigner<CascadingDropDown>
    {
        /// <summary>
        /// Signature of the page method for CascadingDropDown's web service that
        /// is used to support adding/navigating to the page method from the designer
        /// </summary>
        /// <param name="knownCategoryValues">Seperated string containing the category values already known</param>
        /// <param name="category">Current category</param>
        /// <returns>CacadingDropDownNameValue pairs</returns>
        [PageMethodSignature("CascadingDropDown", "ServicePath", "ServiceMethod", "UseContextKey")]
        private delegate CascadingDropDownNameValue[] GetDropDownContents(string knownCategoryValues, string category);
    }
}