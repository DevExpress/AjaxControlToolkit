#pragma warning disable 1591
using System;

namespace AjaxControlToolkit {

    [Flags]
    public enum FilterTypes {
        Custom = 0x1,
        Numbers = 0x2,
        UppercaseLetters = 0x4,
        LowercaseLetters = 0x8
    }

}

#pragma warning restore 1591