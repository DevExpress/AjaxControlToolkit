<%@ Page Language="C#" MasterPageFile="~/DefaultTests.master" AutoEventWireup="true" CodeFile="5352.aspx.cs"
    Inherits="Patch5352" Title="Untitled Page" UICulture="en-US" Culture="en-US" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">
<%--    
    MaskType: Date, mask: DD/MM/YYYY (en-US)
    <br />
    <asp:TextBox ID="TextBox2" runat="server" ValidationGroup="Demo1" Width="328px"></asp:TextBox><br />
    <asp:MaskedEditExtender ID="MaskedEditExtender2" runat="server" AcceptNegative="Left"
        DisplayMoney="Left" Mask="99/99/9999" MaskType="Date" MessageValidatorTip="true"
        OnFocusCssClass="MaskedEditFocus" OnInvalidCssClass="MaskedEditError" TargetControlID="TextBox2" CultureName="en-US" AutoComplete="true" AutoCompleteValue="05/23/1964">
    </asp:MaskedEditExtender>
    <asp:MaskedEditValidator ID="MaskedEditValidator2" runat="server" ControlExtender="MaskedEditExtender2"
        ControlToValidate="TextBox2" Display="Dynamic" IsValidEmpty="False" MaximumValue="01/01/2010"
        EmptyValueMessage="ENGLISH Date is neccessary" InvalidValueMessage="Date is invalid" MaximumValueMessage="Message Max"
        MinimumValueMessage="Message Min" TooltipMessage="Input a Date" MinimumValue="02/02/1900" ValidationGroup="Demo1"></asp:MaskedEditValidator>
    <br />--%>


<%--    <strong>Enter Date and Time (format: <em>99/99/9999 99:99:99</em>)</strong>
        <br />
        <asp:TextBox ID="TextBox6" runat="server" Width="180px" ValidationGroup="Demo1" />
        <asp:MaskedEditExtender ID="MaskedEditExtender6" runat="server"
            TargetControlID="TextBox6" 
            Mask="99/99/9999 99:99:99"
            MessageValidatorTip="true"
            OnFocusCssClass="MaskedEditFocus"
            OnInvalidCssClass="MaskedEditError"
            MaskType="DateTime"
            AcceptAMPM="True"
            ErrorTooltipEnabled="True" />
        <asp:MaskedEditValidator ID="MaskedEditValidator6" runat="server"
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
--%>    
    <strong>Enter Date and Time (format: <em>99/99/9999 99:99:99</em>)</strong>
        <br />
        <asp:TextBox ID="TextBox5" runat="server" Width="180px" ValidationGroup="Demo1" />
        <asp:MaskedEditExtender ID="MaskedEditExtender5" runat="server"
            TargetControlID="TextBox5" 
            Mask="9999/99/99 99:99:99"
            MessageValidatorTip="true"
            OnFocusCssClass="MaskedEditFocus"
            OnInvalidCssClass="MaskedEditError"
            MaskType="DateTime"
            CultureName="hu-HU" 
            AcceptAMPM="True"
            ErrorTooltipEnabled="True" />
        <asp:MaskedEditValidator ID="MaskedEditValidator5" runat="server"
            ControlExtender="MaskedEditExtender5"
            ControlToValidate="TextBox5"
            IsValidEmpty="False"
            EmptyValueMessage="Date and time are required"
            InvalidValueMessage="Date and/or time is invalid"
            Display="Dynamic"
            TooltipMessage="Input a date and time"
            EmptyValueBlurredText="*"
            InvalidValueBlurredMessage="*"
            ValidationGroup="Demo1" />
        <br />
    
    <br />
    MaskType: Date, mask: YYYY. MM. DD (hu-HU)
    <br />
    <asp:TextBox ID="TextBox1" runat="server" ValidationGroup="Demo1" Width="328px"></asp:TextBox><br />
    
    <asp:MaskedEditExtender ID="MaskedEditExtender1" runat="server" 
        AcceptNegative="Left"
        DisplayMoney="Left" 
        Mask="9999/99/99" 
        MaskType="Date" 
        MessageValidatorTip="true"
        OnFocusCssClass="MaskedEditFocus" 
        OnInvalidCssClass="MaskedEditError" 
        TargetControlID="TextBox1" 
        CultureName="hu-HU" 
        AutoComplete="true" 
        AutoCompleteValue="2010. 05. 23"
        />
    
    <asp:MaskedEditValidator ID="MaskedEditValidator1" runat="server" ControlExtender="MaskedEditExtender1"
        ControlToValidate="TextBox1" Display="Dynamic" IsValidEmpty="False" MaximumValue="2080. 01. 01"
        EmptyValueMessage="HU Date is required" InvalidValueMessage="Date is invalid" MaximumValueMessage="Message Max"
        MinimumValueMessage="Message Min" TooltipMessage="Input a Date" MinimumValue="1900. 01. 01" ValidationGroup="Demo1"></asp:MaskedEditValidator>

</asp:Content>

