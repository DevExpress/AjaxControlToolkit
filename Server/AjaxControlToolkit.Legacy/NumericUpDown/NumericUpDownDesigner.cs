


using System;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2117:AptcaTypesShouldOnlyExtendAptcaBaseTypes", Justification = "Security handled by base class")]
    public class NumericUpDownDesigner : ExtenderControlBaseDesigner<NumericUpDownExtender>
    {
        /// <summary>
        /// Signature of the page method for NumericUpDown's web service that
        /// is used to support adding/navigating to the page method from the designer
        /// </summary>
        /// <param name="current">Current value</param>
        /// <param name="tag">User specific context</param>
        /// <returns>Value</returns>
        [PageMethodSignature("\"Get Next\" NumericUpDown", "ServiceUpPath", "ServiceUpMethod")]
        private delegate int GetNextValue(int current, string tag);

        /// <summary>
        /// Signature of the page method for NumericUpDown's web service that
        /// is used to support adding/navigating to the page method from the designer
        /// </summary>
        /// <param name="current">Current value</param>
        /// <param name="tag">User specific context</param>
        /// <returns>Value</returns>
        [PageMethodSignature("\"Get Previous\" NumericUpDown", "ServiceDownPath", "ServiceDownMethod")]
        private delegate int GetPreviousValue(int current, string tag);
    }
}