#pragma warning disable 1591
namespace AjaxControlToolkit.Design {

    public class NumericUpDownExtenderDesigner : ExtenderControlBaseDesigner<NumericUpDownExtender> {
        // Signature of the page method for NumericUpDown's web service that
        // is used to support adding/navigating to the page method from the designer
        [PageMethodSignature("\"Get Next\" NumericUpDown", "ServiceUpPath", "ServiceUpMethod")]
        delegate int GetNextValue(int current, string tag);

        // Signature of the page method for NumericUpDown's web service that
        // is used to support adding/navigating to the page method from the designer
        [PageMethodSignature("\"Get Previous\" NumericUpDown", "ServiceDownPath", "ServiceDownMethod")]
        delegate int GetPreviousValue(int current, string tag);
    }

}

#pragma warning restore 1591