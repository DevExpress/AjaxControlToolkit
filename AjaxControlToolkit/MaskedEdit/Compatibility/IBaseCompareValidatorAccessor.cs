using System;

namespace AjaxControlToolkit.MaskedEditValidatorCompatibility {

    internal interface IBaseCompareValidatorAccessor : IBaseValidatorAccessor {
        int CutoffYear { get; }
        string GetDateElementOrder();
    }

}
