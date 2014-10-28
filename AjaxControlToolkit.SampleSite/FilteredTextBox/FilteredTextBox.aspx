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
            <p>
                FilteredTextBox is an extender which prevents a user from entering invalid characters
                into a text box.  Note that since this effect can be avoided by deactivating JavaScript, 
                you should use this extender as a convenience for your users, but you must never expect
                that the data being sent to the server consists of "valid" chars only.
            </p>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>FilteredTextBox Properties</Header>
        <Content>
            <p>The math-symbols example above is initialized with this code:</p>
            <pre>
&lt;ajaxToolkit:FilteredTextBoxExtender ID="ftbe" runat="server"
    TargetControlID="TextBox3"
    FilterType="Custom, Numbers"
    <em>ValidChars</em>="+-=/*()." /&gt;
        </pre>
        <ul>
            <li><strong>TargetControlID</strong> - The ID of the text box for this extender to operate on</li>
            <li><strong>FilterType</strong> - A the type of filter to apply, as a comma-separated combination of
                <b>Numbers</b>, <b>LowercaseLetters</b>, <b>UppercaseLetters</b>, and <b>Custom</b>.  If Custom is
                specified, the ValidChars field will be used in addition to other settings such as Numbers.</li>
            <li><strong>FilterMode</strong> - A the filter mode to apply, either <b>ValidChars</b> (default) or 
                <b>InvalidChars</b>. If set to InvalidChars, FilterType must be set to Custom; if set to ValidChars,
                FilterType must contain Custom.</li>
            <li><strong>ValidChars</strong> - A string consisting of all characters considered valid for the text
                field, if "Custom" is specified as the filter type.  Otherwise this parameter is ignored.</li>
            <li><strong>InvalidChars</strong> - A string consisting of all characters considered invalid for the text
                field, if "Custom" is specified as the filter type and "InvalidChars" as the filter mode.  
                Otherwise this parameter is ignored.</li>
            <li><strong>FilterInterval</strong> - An integer containing the interval (in milliseconds) in which 
                the field's contents are filtered, defaults to 250.</li>
        </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
