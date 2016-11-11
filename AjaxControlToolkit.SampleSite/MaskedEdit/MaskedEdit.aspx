<%@ Page Title="MaskedEdit Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="MaskedEdit.aspx.cs" Inherits="MaskedEdit_MaskedEdit" Culture="auto" UICulture="auto" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    MaskedEdit Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <strong>Enter a Number (format: <em>9,999,999.99</em>):</strong>
    <br />
    <asp:TextBox ID="TextBox2" runat="server" Width="130px" Height="16px" ValidationGroup="MKE" />
    <ajaxToolkit:MaskedEditExtender ID="MaskedEditExtender2" runat="server"
        TargetControlID="TextBox2"
        Mask="9,999,999.99"
        MessageValidatorTip="true"
        OnFocusCssClass="MaskedEditFocus"
        OnInvalidCssClass="MaskedEditError"
        MaskType="Number"
        InputDirection="RightToLeft"
        AcceptNegative="Left"
        DisplayMoney="Left"
        ErrorTooltipEnabled="True" />
    <ajaxToolkit:MaskedEditValidator ID="MaskedEditValidator2" runat="server"
        ControlExtender="MaskedEditExtender2"
        ControlToValidate="TextBox2"
        IsValidEmpty="false"
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
    <br />

    <strong>Enter Time (format: <em>99:99:99</em>):</strong>
    <br />
    <asp:TextBox ID="TextBox3" runat="server" Width="130px" Height="16px" ValidationGroup="MKE" />
    <ajaxToolkit:MaskedEditExtender ID="MaskedEditExtender3" runat="server"
        TargetControlID="TextBox3"
        Mask="99:99:99"
        MessageValidatorTip="true"
        OnFocusCssClass="MaskedEditFocus"
        OnInvalidCssClass="MaskedEditError"
        MaskType="Time"
        AcceptAMPM="True"
        ErrorTooltipEnabled="True" />
    <ajaxToolkit:MaskedEditValidator ID="MaskedEditValidator3" runat="server"
        ControlExtender="MaskedEditExtender3"
        ControlToValidate="TextBox3"
        IsValidEmpty="False"
        EmptyValueMessage="Time is required"
        InvalidValueMessage="Time is invalid"
        Display="Dynamic"
        TooltipMessage="Input a time"
        EmptyValueBlurredText="*"
        InvalidValueBlurredMessage="*"
        ValidationGroup="MKE" />
    <br />
    <em><span style="font-size: 8pt">Tip: Type 'A' or 'P' to switch AM/PM</span></em>
    <br />
    <br />

    <strong>Enter Date (format: <em>99/99/9999</em>):</strong>
    <br />
    <asp:TextBox ID="TextBox5" runat="server" Width="130px" MaxLength="1" Style="text-align: justify" ValidationGroup="MKE" />
    <asp:ImageButton ID="ImgBntCalc" runat="server" ImageUrl="~/images/Calendar_scheduleHS.png" CausesValidation="False" />
    <ajaxToolkit:MaskedEditExtender ID="MaskedEditExtender5" runat="server"
        TargetControlID="TextBox5"
        Mask="99/99/9999"
        MessageValidatorTip="true"
        OnFocusCssClass="MaskedEditFocus"
        OnInvalidCssClass="MaskedEditError"
        MaskType="Date"
        DisplayMoney="Left"
        AcceptNegative="Left"
        ErrorTooltipEnabled="True" />
    <ajaxToolkit:MaskedEditValidator ID="MaskedEditValidator5" runat="server"
        ControlExtender="MaskedEditExtender5"
        ControlToValidate="TextBox5"
        EmptyValueMessage="Date is required"
        InvalidValueMessage="Date is invalid"
        Display="Dynamic"
        IsValidEmpty="false"
        TooltipMessage="Input a date"
        EmptyValueBlurredText="*"
        InvalidValueBlurredMessage="*"
        ValidationGroup="MKE" />
    <ajaxToolkit:CalendarExtender ID="CalendarExtender1" runat="server" TargetControlID="TextBox5" PopupButtonID="ImgBntCalc" />
    <br />
    <em><span style="font-size: 8pt">Tip: The date format is mm/dd/yyyy for this example and a Calendar is also available for date selection</span></em>
    <br />
    <br />

    <strong>Enter Date and Time (format: <em>99/99/9999 99:99:99</em>)</strong>
    <br />
    <asp:TextBox ID="TextBox6" runat="server" Width="180px" ValidationGroup="MKE" />
    <ajaxToolkit:MaskedEditExtender ID="MaskedEditExtender6" runat="server"
        TargetControlID="TextBox6"
        Mask="99/99/9999 99:99:99"
        MessageValidatorTip="true"
        OnFocusCssClass="MaskedEditFocus"
        OnInvalidCssClass="MaskedEditError"
        MaskType="DateTime"
        AcceptAMPM="True"
        ErrorTooltipEnabled="True" />
    <ajaxToolkit:MaskedEditValidator ID="MaskedEditValidator6" runat="server"
        ControlExtender="MaskedEditExtender6"
        ControlToValidate="TextBox6"
        IsValidEmpty="False"
        EmptyValueMessage="Date and time are required"
        InvalidValueMessage="Date and/or time is invalid"
        Display="Dynamic"
        TooltipMessage="Input a date and time"
        EmptyValueBlurredText="*"
        InvalidValueBlurredMessage="*"
        ValidationGroup="MKE" />
    <br />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>MaskedEdit Description</Header>
        <Content>
            <div runat="server" data-control-type="MaskedEditExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>MaskedEdit Properties</Header>
        <Content>
            <div runat="server" data-control-type="MaskedEditExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>MaskedEdit Validator Description</Header>
        <Content>
            <div runat="server" data-control-type="MaskedEditValidator" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>MaskedEditValidator Properties</Header>
        <Content>
        <div runat="server" data-control-type="MaskedEditValidator" data-content-type="members" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>MaskedEdit Known Issues</Header>
        <Content>
            <p>
                Opera's keyboard handling implementation causes the "." key to map to "Del" and the "Ins" key to map to "-".
            </p>
        </Content>
    </samples:InfoBlock>

</asp:Content>
