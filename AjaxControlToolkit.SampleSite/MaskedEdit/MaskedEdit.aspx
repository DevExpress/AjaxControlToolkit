<%@ Page Title="" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="MaskedEdit.aspx.cs" Inherits="MaskedEdit_MaskedEdit" Culture="auto"
    UICulture="auto" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="DemoHeading" runat="Server">
    MaskedEdit Demonstration
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="DemoContent" runat="Server">
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
<asp:Content ID="Content3" ContentPlaceHolderID="DescriptionHeaderPanelContent" runat="Server">
    <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
    MaskedEdit Description
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="DescriptionContentPanelContent" runat="Server">
    <p>
        MaskedEdit is an ASP.NET AJAX extender that attaches to a TextBox control to restrict the kind of text that can be entered.
        MaskedEdit applies a "mask" to the input that permits only certain types of characters/text to be entered.
        The supported data formats are: Number, Date, Time, and DateTime.
        MaskedEdit uses the culture settings specified in the CultureName property. If none is specified
        the culture setting will be the same as the page: <strong><%=  System.Threading.Thread.CurrentThread.CurrentCulture.NativeName %></strong>.
    </p>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="PropertiesHeaderPanelContent" runat="Server">
    <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
    MaskedEdit Properties
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="PropertiesContentPanelContent" runat="Server">
    <p>
        The number control above is initialized with this code. The <em>italic</em> properties are optional.
    </p>
    <pre>&lt;ajaxToolkit:MaskedEditExtender
    TargetControlID="TextBox2" 
    Mask="9,999,999.99"
    <em>MessageValidatorTip</em>="true" 
    <em>OnFocusCssClass</em>="MaskedEditFocus" 
    <em>OnInvalidCssClass</em>="MaskedEditError"
    <em>MaskType</em>="Number" 
    <em>InputDirection</em>="RightToLeft" 
    <em>AcceptNegative</em>="Left" 
    <em>DisplayMoney</em>="Left"
    <em>ErrorTooltipEnabled</em>="True"/&gt;</pre>
    <ul>
        <li><strong>MaskType</strong> - Type of validation to perform:<br />
            None - No validation<br />
            Number - Number validation<br />
            Date - Date validation<br />
            Time - Time validation<br />
            DateTime - Date and time validation</li>
        <li><strong>Mask Characters and Delimiters</strong><br />
            9 - Only a numeric character<br />
            L - Only a letter<br />
            $ - Only a letter or a space<br />
            C - Only a custom character (case sensitive)<br />
            A - Only a letter or a custom character<br />
            N - Only a numeric or custom character<br />
            ? - Any character<br />
            <br />
            / - Date separator<br />
            : - Time separator<br />
            . - Decimal separator<br />
            , - Thousand separator<br />
            \ - Escape character<br />
            { - Initial delimiter for repetition of masks<br />
            } - Final delimiter for repetition of masks<br />
            <br />
            <em>Examples:</em><br />
            9999999 - Seven numeric characters<br />
            99\/99 - Four numeric characters separated in the middle by a "/"</li>
        <li style="visibility: hidden;">&nbsp;</li>
        <li><strong>AcceptAMPM</strong> - True to display an AM/PM symbol</li>
        <li><strong>AcceptNegative</strong> - True if the negative sign (-) is allowed<br />
            None - Do not show the negative sign<br />
            Left - Show the negative sign on the left of the mask<br />
            Right - Show the negative sign on the right of the mask</li>
        <li><strong>AutoComplete</strong> - True to automatically fill in empty mask characters not specified by the user<br />
            MaskType=Number - Empty mask characters will be filled with zeros<br />
            MaskType=Time - Empty mask characters will be filled with the current time<br />
            MaskType=Date - Empty mask characters will be filled with the current date<br />
            MaskType=DateTime - Empty mask characters will be filled with the current date/time</li>
        <li><strong>AutoCompleteValue</strong> - Default character to use when AutoComplete is enabled</li>
        <li><strong>Century</strong> - Default century used when a date mask only has two digits for the year</li>
        <li><strong>ClearMaskOnLostFocus</strong> - True to remove the mask when the TextBox loses focus</li>
        <li><strong>ClearTextOnInvalid</strong> - True to clear the TextBox when invalid text is entered</li>
        <li><strong>ClipboardEnabled</strong>- True to allow copy/paste with the clipboard</li>
        <li><strong>ClipboardText</strong> - Prompt text to use when a clipboard paste is performed</li>
        <li><strong>DisplayMoney</strong> - Specifies how the currency symbol is displayed<br />
            None - Do not show the currency symbol<br />
            Left - Show the currency symbol on the left of the mask<br />
            Right - Show the currency symbol on the right of the mask</li>
        <li><strong>ErrorTooltipCssClass</strong> - CSS class for the tooltip message</li>
        <li><strong>ErrorTooltipEnabled</strong> - True to show a tooltip message when the mouse hovers over an invalid TextBox</li>
        <li><strong>Filtered</strong> - Valid characters for mask type "C" (case-sensitive)</li>
        <li><strong>InputDirection</strong> - Text input direction<br />
            LeftToRight - Left to Right<br />
            RightToLeft - Right to left</li>
        <li><strong>MessageValidatorTip</strong> - Message displayed when editing in TextBox</li>
        <li><strong>PromptChararacter</strong> - Prompt character for unspecified mask characters</li>
        <li><strong>UserDateFormat</strong> - Custom date format</li>
        <li><strong>UserTimeFormat</strong> - Custom time format</li>
        <li style="visibility: hidden;">&nbsp;</li>
        <li><strong>OnFocusCssClass</strong> - CSS class used when the TextBox receives focus</li>
        <li><strong>OnFocusCssNegative</strong> - CSS class used when the TextBox gets focus with a negative value</li>
        <li><strong>OnBlurCssNegative</strong> - CSS class used when the TextBox loses focus with a negative value</li>
        <li><strong>OnInvalidCssClass</strong> - CSS class used when the text is not valid.</li>
        <li style="visibility: hidden;">&nbsp;</li>
        <li><strong>CultureName </strong>- Name of culture to use (overrides the default page culture)</li>
        <li><strong>CultureAMPMPlaceholder</strong> - Culture override</li>
        <li><strong>CultureCurrencySymbolPlaceholder</strong> - Culture override</li>
        <li><strong>CultureDateFormat</strong> - Culture override</li>
        <li><strong>CultureDatePlaceholder</strong> - Culture override</li>
        <li><strong>CultureDecimalPlaceholder</strong> - Culture override</li>
        <li><strong>CultureThousandsPlaceholder</strong> - Culture override</li>
        <li><strong>CultureTimePlaceholder</strong> - Culture override</li>
    </ul>
</asp:Content>