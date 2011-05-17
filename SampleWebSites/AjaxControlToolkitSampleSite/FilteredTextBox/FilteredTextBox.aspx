<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    Inherits="CommonPage"
    Title="FilteredTextBox Sample"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">FilteredTextBox Demonstration</div>
        <table border="0">
            <tr>
                <td>Only digits are allowed here:</td>
                <td><asp:TextBox ID="TextBox1" runat="server" /></td>
            </tr>
            <tr>
            <td>Only lower-case letters are allowed here:</td>
                <td><asp:TextBox ID="TextBox2" runat="server" /></td>
            </tr>
            <tr>
            <td>Only math symbols (+,-,*,/,=,.) and numbers:</td>
                <td><asp:TextBox ID="TextBox3" runat="server" /></td>
            </tr>
            <tr>
            <td>No digits allowed in this textbox:</td>
                <td><asp:TextBox ID="TextBox4" runat="server" /></td>
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
    </div>
    <div class="demobottom"></div>

    <asp:Panel ID="Description_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
            FilteredTextBox Description
        </div>
    </asp:Panel>
    <asp:Panel id="Description_ContentPanel" runat="server" style="overflow:hidden;">
            <p>
                FilteredTextBox is an extender which prevents a user from entering invalid characters
                into a text box.  Note that since this effect can be avoided by deactivating JavaScript, 
                you should use this extender as a convenience for your users, but you must never expect
                that the data being sent to the server consists of "valid" chars only.
            </p>
    </asp:Panel>

    <asp:Panel ID="Properties_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
            FilteredTextBox Properties
        </div>
    </asp:Panel>
    <asp:Panel id="Properties_ContentPanel" runat="server" style="overflow:hidden;" Height="0px">
        <p>The math-symbols example above is initialized with this code:</p>
<pre>&lt;ajaxToolkit:FilteredTextBoxExtender ID="ftbe" runat="server"
    TargetControlID="TextBox3"         
    FilterType="Custom, Numbers"
    <em>ValidChars</em>="+-=/*()." /&gt;</pre>    
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
    </asp:Panel>

    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server"
        TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel"
        CollapseControlID="Description_HeaderPanel"
        Collapsed="False"        
        ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server"
        TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel"
        CollapseControlID="Properties_HeaderPanel"
        Collapsed="True"        
        ImageControlID="Properties_ToggleImage" />
</asp:Content>