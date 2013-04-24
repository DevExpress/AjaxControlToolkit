<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="23023.aspx.cs"
    Inherits="AjaxControlToolkit.Tests.Bugs.Issue23023" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server" />
    <div>
         <strong>Enter a Number (format: <em>9,999,999.99</em>):</strong>
        <br />
        <asp:TextBox ID="TextBox2" runat="server" Width="130px" Height="16px" ValidationGroup="MKE" />
        <act:MaskedEditExtender ID="MaskedEditExtender2" runat="server"
            TargetControlID="TextBox2"
            Mask="9,999,999.99"
            MessageValidatorTip="true"
            OnFocusCssClass="MaskedEditFocus"
            OnInvalidCssClass="MaskedEditError"
            MaskType="Number"
            InputDirection="RightToLeft"
            AcceptNegative="Left"
            DisplayMoney="Left"
            ErrorTooltipEnabled="True" ClearMaskOnLostFocus="false" />
        <act:MaskedEditValidator ID="MaskedEditValidator2" runat="server"
            ControlExtender="MaskedEditExtender2"
            ControlToValidate="TextBox2"
            IsValidEmpty="False"
            MaximumValue="12000"
            EmptyValueMessage="Number is required"
            InvalidValueMessage="Number is invalid"
            MaximumValueMessage="Number &gt; 12000"
            MinimumValueMessage="Number &lt; -100"
            MinimumValue="-100"
            Display="Dynamic"
            TooltipMessage="Input a number from -100 to 12000"
            EmptyValueBlurredText="*"
            InvalidValueBlurredMessage="*"
            MaximumValueBlurredMessage="*"
            MinimumValueBlurredText="*"
            ValidationGroup="MKE" />
        <br />
        <em><span style="font-size: 8pt">Tip: Type '.' to switch</span></em>
        <br />

    </div>
    </form>
</body>
</html>
