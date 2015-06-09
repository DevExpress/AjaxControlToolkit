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
            <p>
                MaskedEdit is an ASP.NET AJAX extender that attaches to a TextBox control to restrict the kind of text that can be entered.
                MaskedEdit applies a "mask" to the input that permits only certain types of characters/text to be entered.
                The supported data formats are: Number, Date, Time, and DateTime.
                MaskedEdit uses the culture settings specified in the CultureName property. If none is specified
                the culture setting will be the same as the page: <strong><%= System.Threading.Thread.CurrentThread.CurrentCulture.NativeName %></strong>.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>MaskedEdit Properties</Header>
        <Content>
            <p>
                The number control above is initialized with this code. The <em>italic</em> properties are optional.
            </p>
            <pre>
&lt;ajaxToolkit:MaskedEditExtender
    TargetControlID="TextBox2" 
    Mask="9,999,999.99"
    <em>MessageValidatorTip</em>="true" 
    <em>OnFocusCssClass</em>="MaskedEditFocus" 
    <em>OnInvalidCssClass</em>="MaskedEditError"
    <em>MaskType</em>="Number" 
    <em>InputDirection</em>="RightToLeft" 
    <em>AcceptNegative</em>="Left" 
    <em>DisplayMoney</em>="Left"
    <em>ErrorTooltipEnabled</em>="True"/&gt;
            </pre>
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
                <li style="visibility:hidden;">&nbsp;</li>
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
                <li style="visibility:hidden;">&nbsp;</li>
                <li><strong>OnFocusCssClass</strong> - CSS class used when the TextBox receives focus</li>
                <li><strong>OnFocusCssNegative</strong> - CSS class used when the TextBox gets focus with a negative value</li>
                <li><strong>OnBlurCssNegative</strong> - CSS class used when the TextBox loses focus with a negative value</li>
                <li><strong>OnInvalidCssClass</strong> - CSS class used when the text is not valid.</li>
                <li style="visibility:hidden;">&nbsp;</li>
                <li><strong>CultureName </strong>- Name of culture to use (overrides the default page culture)</li>
                <li><strong>CultureAMPMPlaceholder</strong> - Culture override</li>
                <li><strong>CultureCurrencySymbolPlaceholder</strong> - Culture override</li>
                <li><strong>CultureDateFormat</strong> - Culture override</li>
                <li><strong>CultureDatePlaceholder</strong> - Culture override</li>
                <li><strong>CultureDecimalPlaceholder</strong> - Culture override</li>
                <li><strong>CultureThousandsPlaceholder</strong> - Culture override</li>
                <li><strong>CultureTimePlaceholder</strong> - Culture override</li>
            </ul>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>MaskedEdit Validator Description</Header>
        <Content>
            <p>
                MaskedEditValidator is a custom validator which attaches to the MaskedEdit extender and its associated TextBox and verifies that the input text matches the pattern specified in the MaskedEdit extender. 
                Once associated with a validation group, server- and client-side validation can be performed and used to display messages.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>MaskedEditValidator Properties</Header>
        <Content>
        The control above is initialized with this code. The <em>italic</em> properties are optional.
        <pre>
&lt;ajaxToolkit:MaskedEditValidator
    ControlExtender="MaskedEditExtender2"
    <em>ControlToValidate</em>="TextBox2" 
    <em>IsValidEmpty</em>="False" 
    <em>MaximumValue</em>="12000" 
    <em>EmptyValueMessage</em>="Number is required"
    <em>InvalidValueMessage</em>="Number is invalid"
    <em>MaximumValueMessage</em>="Number &gt; 12000"
    <em>MinimumValueMessage</em>="Number &lt; -100"
    <em>MinimumValue</em>="-100" 
    <em>EmptyValueBlurredText</em>="*" 
    <em>InvalidValueBlurredMessage</em>="*" 
    <em>MaximumValueBlurredMessage</em>="*" 
    <em>MinimumValueBlurredText</em>="*"
    <em>Display</em>="Dynamic" 
    <em>TooltipMessage</em>="Input a number: -100 up to 12.000"/&gt;
            </pre>
            <ul>
                <li><strong>ControlToValidate</strong> - ID of the TextBox to validate</li>
                <li><strong>ControlExtender</strong> - ID of the MaskedEditExtender attached to the TextBox</li>
                <li style="visibility:hidden;">&nbsp;</li>
                <li><strong>AcceptAMPM</strong> - Whether or not AM/PM is accepted on times.<br />
                    The default value is false.</li>
                <li><strong>ClientValidationFunction</strong> - Client script used for custom validation</li>
                <li><strong>InitialValue </strong> - Initial value of the TextBox</li>
                <li><strong>IsValidEmpty</strong> - True if the TextBox can be empty</li>
                <li><strong>MaximumValue</strong> - Maximum value of the input</li>
                <li><strong>MinimumValue</strong> - Minimum value of the input</li>
                <li><strong>ValidationExpression</strong> - Regular expression used to validate the input</li>
                <li style="visibility:hidden;">&nbsp;</li>
                <li><strong>TooltipMessage</strong> - Message displayed when the TextBox has focus with an empty value</li>
                <li><strong>EmptyValueMessage</strong> - Message displayed when empty and TextBox has focus</li>
                <li><strong>EmptyValueBlurredText</strong> - Message displayed when empty and TextBox does not have focus</li>
                <li><strong>InvalidValueMessage</strong> - Message displayed when invalid and TextBox has focus</li>
                <li><strong>InvalidValueBlurredMessage</strong> - Message displayed when invalid and TextBox does not have focus</li>
                <li><strong>MaximumValueMessage</strong> - Message displayed when maximum value exceeded and TextBox has focus</li>
                <li><strong>MaximumValueBlurredMessage</strong> - Message displayed when maximum value exceeded and TextBox does not have focus</li>
                <li><strong>MinimumValueMessage</strong> - Message displayed when minimum value exceeded and TextBox has focus</li>
                <li><strong>MinimumValueBlurredText</strong> - Message displayed when minimum value exceeded and TextBox does not have focus</li>
            </ul>
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
