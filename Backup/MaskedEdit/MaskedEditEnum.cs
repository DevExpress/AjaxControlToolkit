
// 
// Product      : MaskedEdit Extend Control
// Version      : 1.0.0.0
// Date         : 10/23/2006
// Development  : Fernando Cerqueira 
// Version      : 1.0.0.1
// Development  : 02/22/2007 Fernando Cerqueira 
// 
using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using AjaxControlToolkit;

namespace AjaxControlToolkit
{
    public enum MaskedEditType
    {
        None = 0,
        Date = 1,
        Number = 2,
        Time = 3,
        DateTime = 4
    }
    public enum MaskedEditUserDateFormat
    {
        None = 0,
        DayMonthYear = 1,
        DayYearMonth = 2,
        MonthDayYear = 3,
        MonthYearDay = 4,
        YearDayMonth = 5,
        YearMonthDay = 6
    }
    public enum MaskedEditUserTimeFormat
    {
        None = 0,
        TwentyFourHour = 1
    }
    public enum MaskedEditInputDirection
    {
        LeftToRight = 0,
        RightToLeft = 1
    }
    public enum MaskedEditShowSymbol
    {
        None = 0,
        Left = 1,
        Right = 2
    }
}

