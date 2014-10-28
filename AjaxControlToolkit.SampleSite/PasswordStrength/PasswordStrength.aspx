<%@ Page Title="PasswordStrength Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="PasswordStrength.aspx.cs" Inherits="PasswordStrength_PasswordStrength" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    PasswordStrength Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    Simple Complexity, Text Indicator<br />
    <asp:TextBox ID="TextBox1" Width="150" runat="server" autocomplete="off" /><br />
    <asp:Label ID="TextBox1_HelpLabel" runat="server" /><br />
    <br />
    <ajaxToolkit:PasswordStrength ID="PasswordStrength1" runat="server" TargetControlID="TextBox1"
        DisplayPosition="RightSide"
        StrengthIndicatorType="Text"
        PreferredPasswordLength="10"
        PrefixText="Strength:"
        HelpStatusLabelID="TextBox1_HelpLabel"
        TextStrengthDescriptions="Very Poor;Weak;Average;Strong;Excellent"
        StrengthStyles="TextIndicator_TextBox1_Strength1;TextIndicator_TextBox1_Strength2;TextIndicator_TextBox1_Strength3;TextIndicator_TextBox1_Strength4;TextIndicator_TextBox1_Strength5"
        MinimumNumericCharacters="0"
        MinimumSymbolCharacters="0"
        RequiresUpperAndLowerCaseCharacters="false" />

    Average Complexity, Bar Indicator<br />
    <asp:TextBox ID="TextBox2" Width="150" TextMode="Password" runat="server" autocomplete="off" /><br />
    <asp:Label ID="TextBox2_HelpLabel" runat="server" /><br />
    <br />
    <ajaxToolkit:PasswordStrength ID="PasswordStrength2" runat="server" TargetControlID="TextBox2"
        DisplayPosition="RightSide"
        StrengthIndicatorType="BarIndicator"
        PreferredPasswordLength="15"
        HelpStatusLabelID="TextBox2_HelpLabel"
        StrengthStyles="BarIndicator_TextBox2_weak;BarIndicator_TextBox2_average;BarIndicator_TextBox2_good"
        BarBorderCssClass="BarBorder_TextBox2"
        MinimumNumericCharacters="1"
        MinimumSymbolCharacters="1"
        TextStrengthDescriptions="Very Poor;Weak;Average;Strong;Excellent"
        RequiresUpperAndLowerCaseCharacters="true" />

    High Complexity, Text Indicator, Help Indicator<br />
    <br />
    <asp:TextBox ID="TextBox3" Width="150" runat="server" autocomplete="off" />
    <ajaxToolkit:PasswordStrength ID="PasswordStrength3" runat="server" TargetControlID="TextBox3"
        DisplayPosition="BelowLeft"
        StrengthIndicatorType="Text"
        PreferredPasswordLength="20"
        PrefixText="Meets Policy? "
        TextCssClass="TextIndicator_TextBox3"
        MinimumNumericCharacters="2"
        MinimumSymbolCharacters="2"
        RequiresUpperAndLowerCaseCharacters="true"
        MinimumLowerCaseCharacters="2"
        MinimumUpperCaseCharacters="1"
        TextStrengthDescriptions="Not at all;Very Low compliance;Low Compliance;Average Compliance;Good Compliance;Very High Compliance;Yes"
        HelpHandleCssClass="TextIndicator_TextBox3_Handle"
        HelpHandlePosition="LeftSide" />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <strong>
        Note: Recent changes will cause the PasswordStrength control to render differently compared to previous releases.
        This will affect the padding attributes of the BarIndicator display type. To achieve the same style as previous releases,
        you will need to add the following to the style for that control.
    </strong>
    <pre>padding: 2px 2px 2px 2px;</pre>

    <samples:InfoBlock ID="InfoBlock1" runat="server" Collapsed="false">
        <Header>PasswordStrength Description</Header>
        <Content>
            <p>
                PasswordStrength is an ASP.NET AJAX extender that can be attached to an ASP.NET TextBox control
                used for the entry of passwords. The PasswordStrength extender shows the strength of the password
                in the TextBox and updates itself as the user types the password. The indicator can display the
                strength of the password as a text message or with a progress bar indicator. The styling and
                position of both types of indicators is configurable. The required strength of the password is
                also configurable, allowing the page author to tailor the password strength requirements to their
                needs. The text messages that describe the current strength of the password can also be
                configured and their default values have localization support built-in. The second and third extenders'
                strings are being pulled from Toolkit resources files. We do not 
                have strings for all languages currently so they may show non-localized values for some languages. 
                A help indicator can be used to provide explicit instructions about
                what changes are required to achieve a strong password.  The indicator is displayed when the user
                begins typing into the TextBox and is hidden from view once the TextBox loses focus.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock ID="InfoBlock2" runat="server">
        <Header>PasswordStrength Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties are optional:
            </p>
            <pre>
&lt;ajaxToolkit:PasswordStrength ID="PS" runat="server"
    TargetControlID="TextBox1"
    <em>DisplayPosition="RightSide"</em>
    <em>StrengthIndicatorType="Text"</em>
    <em>PreferredPasswordLength="10"</em>
    <em>PrefixText="Strength:"</em>
    <em>TextCssClass="TextIndicator_TextBox1"</em>
    <em>MinimumNumericCharacters="0"</em>
    <em>MinimumSymbolCharacters="0"</em>
    <em>RequiresUpperAndLowerCaseCharacters="false"</em>
    <em>TextStrengthDescriptions="Very Poor;Weak;Average;Strong;Excellent"</em>
    <em>TextStrengthDescriptionStyles="cssClass1;cssClass2;cssClass3;cssClass4;cssClass5</em>
    <em>CalculationWeightings="50;15;15;20"</em> /&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - ID of the TextBox to attach to</li>
                <li><strong>DisplayPosition</strong> - Positioning of the strength indicator relative to the target control</li>
                <li><strong>StrengthIndicatorType</strong> - Strength indicator type (Text or BarIndicator)</li>
                <li><strong>PreferredPasswordLength</strong> - Preferred length of the password</li>
                <li><strong>PrefixText</strong> - Text prefixed to the display text when StrengthIndicatorType=Text</li>
                <li><strong>TextCssClass</strong> - CSS class applied to the text display when StrengthIndicatorType=Text</li>
                <li><strong>MinimumNumericCharacters</strong> - Minimum number of numeric characters</li>
                <li><strong>MinimumSymbolCharacters</strong> - Minimum number of symbol characters (ex: $ ^ *)</li>
                <li><strong>RequiresUpperAndLowerCaseCharacters</strong> - Specifies whether mixed case characters are required</li>
                <li><strong>MinimumLowerCaseCharacters</strong> - Only in effect if RequiresUpperAndLowerCaseCharacters property is true. Specifies the
                    minimum number of lowercase characters required when requiring mixed case characters as part of your password strength considerations.</li>
                <li><strong>MinimumUpperCaseCharacters</strong> - Only in effect if RequiresUpperAndLowerCaseCharacters property is true. Specifies the
                    minimum number of uppercase characters required when requiring mixed case characters as part of your password strength considerations.</li>
                <li><strong>TextStrengthDescriptions</strong> - List of semi-colon separated descriptions used when StrengthIndicatorType=Text (Minimum of 2, maximum of 10; order is weakest to strongest)</li>
                <li><strong>CalculationWeightings</strong> - List of semi-colon separated numeric values used to
                    determine the weighting of a strength characteristic. There must be 4 values specified which must
                    total 100. The default weighting values are defined as 50;15;15;20. This corresponds to password
                    length is 50% of the strength calculation, Numeric criteria is 15% of strength calculation,
                    casing criteria is 15% of calculation, and symbol criteria is 20% of calculation. So the format is
                    'A;B;C;D' where A = length weighting, B = numeric weighting, C = casing weighting, D = symbol weighting.</li>
                <li><strong>BarBorderCssClass</strong> - CSS class applied to the bar indicator's border when StrengthIndicatorType=BarIndicator</li>
                <li><strong>BarIndicatorCssClass</strong> - CSS class applied to the bar indicator's inner bar when StrengthIndicatorType=BarIndicator</li>
                <li><strong>StrengthStyles</strong> - List of semi-colon separated CSS classes that are used depending on the password's strength. This property will override
                    the BarIndicatorCssClass / TextIndicatorCssClass property if present. The BarIndicatorCssClass / TextIndicatorCssClass property differs in that it attributes one CSS style to the BarIndicator or Text Strength
                    indicator (depending on which type is chosen) regardless of password strength. This property will cause the style to change based on the password strength
                    and also to the number of styles specified in this property. For example, if 2 styles are defined like StrengthStyles="style1;style2" then style1 is applied when
                    the password strength is less than 50%, and style2 is applied when password strength is >= 50%. This property can have up to 10 styles.</li>
                <li><strong>HelpStatusLabelID</strong> - Control ID of the label used to display help text</li>
                <li><strong>HelpHandleCssClass</strong> - CSS class applied to the help element used to display a dialog box describing the password requirements</li>
                <li><strong>HelpHandlePosition</strong> - Positioning of the help handle element relative to the target control</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
