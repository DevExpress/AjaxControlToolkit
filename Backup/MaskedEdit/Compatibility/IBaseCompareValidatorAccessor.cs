namespace AjaxControlToolkit.MaskedEditValidatorCompatibility
{
    using System;

    internal interface IBaseCompareValidatorAccessor : IBaseValidatorAccessor {
        int CutoffYear {
            get;
        }
        string GetDateElementOrder();
    }
}
