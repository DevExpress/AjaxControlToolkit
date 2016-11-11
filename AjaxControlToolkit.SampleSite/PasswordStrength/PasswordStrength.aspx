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
            <div runat="server" data-control-type="PasswordStrength" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock ID="InfoBlock2" runat="server">
        <Header>PasswordStrength Properties</Header>
        <Content>
            <div runat="server" data-control-type="PasswordStrength" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
