


using System;
using System.Collections.Generic;
using System.Text;

namespace AjaxControlToolkit
{
    [Flags]
    public enum FilterTypes
    {
        Custom  =           0x1,
        Numbers =           0x2,
        UppercaseLetters =  0x4,
        LowercaseLetters =  0x8
    }
}
