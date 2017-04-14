<%@ Page Title="FilteredTextBox Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="FilteredTextBox.aspx.cs" Inherits="FilteredTextBox_FilteredTextBox" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    FilteredTextBox Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <table border="0">
        <tr>
            <td>Only digits are allowed here:</td>
            <td>
                <asp:TextBox ID="TextBox1" runat="server" /></td>
        </tr>
        <tr>
            <td>Only lower-case letters are allowed here:</td>
            <td>
                <asp:TextBox ID="TextBox2" runat="server" /></td>
        </tr>
        <tr>
            <td>Only math symbols (+,-,*,/,=,.) and numbers:</td>
            <td>
                <asp:TextBox ID="TextBox3" runat="server" /></td>
        </tr>
        <tr>
            <td>No digits allowed in this textbox:</td>
            <td>
                <asp:TextBox ID="TextBox4" runat="server" /></td>
        </tr>
    </table>

    <ajaxToolkit:FilteredTextBoxExtender
        ID="FilteredTextBoxExtender1"
        runat="server"
        TargetControlID="TextBox1"
        FilterType="Numbers" />

    <ajaxToolkit:FilteredTextBoxExtender
        ID="FilteredTextBoxExtender2"
        runat="server"
        TargetControlID="TextBox2"
        FilterType="LowercaseLetters" />

    <ajaxToolkit:FilteredTextBoxExtender
        ID="FilteredTextBoxExtender3"
        runat="server"
        TargetControlID="TextBox3"
        FilterType="Custom, Numbers"
        ValidChars="+-=/*()." />

    <ajaxToolkit:FilteredTextBoxExtender
        ID="FilteredTextBoxExtender4"
        runat="server"
        TargetControlID="TextBox4"
        FilterType="Custom"
        FilterMode="InvalidChars"
        InvalidChars="1234567890" />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>FilteredTextBox Description</Header>
        <Content>
            <div runat="server" data-control-type="FilteredTextBoxExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>FilteredTextBox Properties</Header>
        <Content>
            <div runat="server" data-control-type="FilteredTextBoxExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
