using System;
using System.Collections.Generic;
using System.Text;

namespace AjaxControlToolkit
{
    [Flags]
    public enum BoxCorners
    {
        None        = 0x00,
        
        TopLeft     = 0x01,
        TopRight    = 0x02,
        BottomRight = 0x04,
        BottomLeft  = 0x08,

        Top         = TopLeft | TopRight,
        Right       = TopRight | BottomRight,
        Bottom      = BottomRight | BottomLeft,
        Left        = BottomLeft | TopLeft,
        All         = TopLeft | TopRight | BottomRight | BottomLeft
    }
}
