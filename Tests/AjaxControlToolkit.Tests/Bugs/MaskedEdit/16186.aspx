<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="16186.aspx.cs"
    Inherits="AjaxControlToolkit.Tests.Bugs.Issue16186" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server" />
    <div>
         <strong>Enter Date (format: <em>99/99/9999</em>):</strong>
        <br />
        <asp:TextBox ID="TextBox5" runat="server" Width="130px" MaxLength="1" style="text-align:justify" ValidationGroup="MKE" />
        <asp:ImageButton ID="ImgBntCalc" runat="server" ImageUrl="~/images/Calendar_scheduleHS.png" CausesValidation="false" />
        <act:MaskedEditExtender ID="MaskedEditExtender5" runat="server"
            TargetControlID="TextBox5"
            Mask="99/99/9999"
            MessageValidatorTip="true"
            OnFocusCssClass="MaskedEditFocus"
            OnInvalidCssClass="MaskedEditError"
            MaskType="Date"
            DisplayMoney="Left"
            AcceptNegative="Left"
            ErrorTooltipEnabled="True" />
        <act:MaskedEditValidator ID="MaskedEditValidator5" runat="server"
            ControlExtender="MaskedEditExtender5"
            ControlToValidate="TextBox5"
            EmptyValueMessage="Date is required"
            InvalidValueMessage="Date is invalid"
            Display="Dynamic"
            TooltipMessage="Input a date"
            EmptyValueBlurredText="*"
            InvalidValueBlurredMessage="*"
            ValidationGroup="MKE" />
         <act:CalendarExtender ID="CalendarExtender1" runat="server" TargetControlID="TextBox5" PopupButtonID="ImgBntCalc" />
        <br />
        <em><span style="font-size: 8pt">Tip: The date format is mm/dd/yyyy for this example and a Calendar is also available for date selection</span></em>
        <br />       
    </div>
    </form>
</body>
</html>
