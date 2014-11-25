using System;

namespace AjaxControlToolkit {

    internal interface IBaseCompareValidatorAccessor : IBaseValidatorAccessor {
        int CutoffYear { get; }
        string GetDateElementOrder();
    }

}
