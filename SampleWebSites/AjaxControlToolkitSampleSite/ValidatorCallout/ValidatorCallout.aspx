<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    CodeFile="ValidatorCallout.aspx.cs"
    Inherits="ValidatorCallout_ValidatorCallout"
    Title="ValidatorCallout Sample"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">ValidatorCallout Demonstration</div>
        <table>
            <tr>
                <td>Name:</td>
                <td><asp:TextBox runat="server" ID="NameTextBox"
                    BorderStyle="solid" BorderWidth="1px" BorderColor="#a9a9a9" /></td>
            </tr>
            <tr>
                <td>Phone Number:</td>
                <td><asp:TextBox runat="server" ID="PhoneNumberTextBox"
                    BorderStyle="solid" BorderWidth="1px" BorderColor="#a9a9a9" /></td>
            </tr>
        </table>
        <br />
        
        <asp:RequiredFieldValidator runat="server" ID="NReq"
            ControlToValidate="NameTextBox"
            Display="None"
            ErrorMessage="<b>Required Field Missing</b><br />A name is required." />
        <ajaxToolkit:ValidatorCalloutExtender runat="Server" ID="NReqE"
            TargetControlID="NReq"
            HighlightCssClass="validatorCalloutHighlight" />
            
        <asp:RequiredFieldValidator runat="server" ID="PNReq"
            ControlToValidate="PhoneNumberTextBox"
            Display="None"
            ErrorMessage="<b>Required Field Missing</b><br />A phone number is required.<div style='margin-top:5px;padding:5px;border:1px solid #e9e9e9;background-color:white;'><b>Other Options:</b><br /><a href='javascript:alert(&quot;No phone number available in profile.&quot;);'>Extract from Profile</a></div>" />
        <ajaxToolkit:ValidatorCalloutExtender runat="Server" ID="PNReqE"
            TargetControlID="PNReq"
            HighlightCssClass="validatorCalloutHighlight"
            Width="350px" />
            
        <asp:RegularExpressionValidator runat="server" ID="PNRegEx"
            ControlToValidate="PhoneNumberTextBox"
            Display="None"
            ValidationExpression="((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}"
            ErrorMessage="<b>Invalid Field</b><br />Please enter a phone number in the format:<br />(###) ###-####" />
        <ajaxToolkit:ValidatorCalloutExtender runat="Server" ID="PNReqEx"
            TargetControlID="PNRegEx"
            HighlightCssClass="validatorCalloutHighlight" />
             
        <asp:Button ID="Button1" runat="server" Text="Submit" OnClick="Button1_OnClick" /><br /><br />
        <asp:UpdatePanel runat="server" ID="up1">
            <ContentTemplate>
                <asp:Label id="lblMessage" runat="server" />
            </ContentTemplate>
            <Triggers>
                <asp:AsyncPostBackTrigger ControlID="Button1" EventName="Click" />
            </Triggers>
        </asp:UpdatePanel>
    </div>
    <div class="demobottom"></div>
    
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
            ValidatorCallout Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            ValidatorCallout is an ASP.NET AJAX extender that enhances the functionality of existing ASP.NET
            validators.  To use this control, add an input field and a validator control as you normally would.
            Then add the ValidatorCallout and set its TargetControlID property to reference the validator control.
        </p>
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand"  />
            ValidatorCallout Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;" Height="0px">
        <p>
            The control above is initialized with this code. The <em>italic</em> properties
            are optional:
        </p>
<pre>&lt;ajaxToolkit:ValidatorCalloutExtender 
    runat="Server"
    ID="PNReqE"
    TargetControlID="PNReq" 
    <em>Width</em>="350px"
    <em>HighlightCssClass</em>="highlight" 
    <em>CssClass</em>="CustomValidatorCalloutStyle"
    <em>PopupPosition</em>="Right"
    <em>WarningIconImageUrl</em>="warning.gif"
    <em>CloseImageUrl</em>="close.gif" /&gt;</pre>
        <ul>
            <li><strong>TargetControlID</strong> - The ID of the Validator to extend</li>
            <li><strong>Width</strong> - The width of the callout</li>
            <li><strong>CssClass</strong> - Name of the CSS class used to style the ValidatorCallout. 
                See the ValidatorCallout Theming section for more information. </li>
            <li><strong>HighlightCssClass</strong> - A CssClass to apply to the invalid field</li>
            <li><strong>WarningIconImageUrl</strong> - The path to a custom warning icon image</li>
            <li><strong>CloseImageUrl</strong> - The path to a custom close image</li>
            <li><strong>PopupPosition</strong> - Indicates where the ValidatorCallout popup should appear 
                at the BottomLeft, BottomRight, TopLeft, TopRight, Left or Right (default) of the control to validate.</li>
            <li><strong>Animations</strong> - Generic animations for the ValidatorCallout extender.  See the
                <a href="../Walkthrough/UsingAnimations.aspx">Using Animations</a> walkthrough and
                <a href="../Walkthrough/AnimationReference.aspx">Animation Reference</a> for more details.
                <ul>
                    <li><strong>OnShow</strong> - The OnShow animation will be played each time the validation popup
                        is displayed.  The popup will be positioned correctly but hidden.  The animation can use
                        <span class="codeReference">&lt;HideAction Visible="true" /&gt;</span>
                        to display the popup along with any other visual effects.</li>
                    <li><strong>OnHide</strong> - The OnHide animation will be played each time the validation popup is hidden.</li>
                </ul>
            </li>
         </ul>
    </asp:Panel>
    <asp:Panel ID="KnownIssues_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="KnownIssues_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse"  />
            ValidatorCallout Known Issues
        </div>
    </asp:Panel>
    <asp:Panel ID="KnownIssues_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            The callouts do not currently display automatically after a server post-back and will only work for
            custom validators which utilize client-side validation. Even after a post-back the callout will
            display when the form is re-validated when a postback is attempted again.
        </p>
    </asp:Panel>
    <asp:Panel runat="server" ID="ValidatorCalloutCSS_HeaderPanel" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="ValidatorCalloutCSS_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            ValidatorCallout Theming
        </div>
    </asp:Panel>
    <asp:Panel runat="server" ID="ValidatorCalloutCSS_ContentPanel" Style="overflow: hidden;" Height="0px">
        You can change the look and feel of the ValidatorCallout using the ValidatorCallout CssClass property. The ValidatorCallout
        has a predefined set of CSS classes that can be overridden. It has a default style
        which is embedded as a WebResource and is a part of the Toolkit assembly that has
        styles set for all the sub-classes. You can find the default styles in the Toolkit
        solution in the <strong>"AjaxControlToolkit\ValidatorCallout\ValidatorCallout.css"</strong> file. If your
        CssClass does not provide values for any of those then it falls back to the default
        value. In the example above the default style is used. To customize the same the
        user would have to set the CssClass property to the name of the CSS style and define
        the styles for the individual classes so that the various elements in a ValidatorCallout control
        can be styled accordingly. For example, if the CssClass property was set to "CustomValidatorCalloutStyle",
        this is how the css to style the border and background color would look:
        <pre>
.CustomValidatorCalloutStyle div, 
.CustomValidatorCalloutStyle td { 
    border:solid 1px blue; background-color: #ADD8E6; 
}
        </pre>
        <strong>ValidatorCallout Css classes</strong>
        <br />
        <ul>
            <li><strong>.ajax__validatorcallout_popup_table:</strong>
                The popup table.</li>
            <li><strong>.ajax__validatorcallout_popup_table_row:</strong>
                The popup table row.</li>
            <li><strong>.ajax__validatorcallout_callout_cell:</strong>
                The callout cell.</li>
            <li><strong>.ajax__validatorcallout_callout_table:</strong>
                The table in the callout cell.</li>
            <li><strong>.ajax__validatorcallout_callout_table_row:</strong>
                The callout table row.</li>
            <li><strong>.ajax__validatorcallout_error_message_cell:</strong>
                The error message cell. </li>
            <li><strong>.ajax__validatorcallout_icon_cell:</strong> 
                The warning icon cell.</li>
            <li><strong>.ajax__validatorcallout_close_button_cell:</strong> 
                The close button cell. </li>
            <li><strong>.ajax__validatorcallout_arrow_cell</strong>: 
                The arror cell.</li>
            <li><strong>.ajax__validatorcallout_innerdiv:</strong> 
                Inner div of a cell. Used in the close button cell and the arrow cell.</li>
        </ul>
    </asp:Panel>  
    <ajaxToolkit:CollapsiblePanelExtender  ID="demoCpe0"  runat="Server" 
        TargetControlID="KnownIssues_ContentPanel"
        ExpandControlID="KnownIssues_HeaderPanel"
        CollapseControlID="KnownIssues_HeaderPanel"
        Collapsed="False"
        ImageControlID="KnownIssues_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="demoCpe1" runat="Server"
        TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel"
        CollapseControlID="Description_HeaderPanel"
        Collapsed="False"
        ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="demoCpe2" runat="Server"
        TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel"
        CollapseControlID="Properties_HeaderPanel"
        Collapsed="True"
        ImageControlID="Properties_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="demoCpe3" runat="Server" TargetControlID="ValidatorCalloutCSS_ContentPanel"
        ExpandControlID="ValidatorCalloutCSS_HeaderPanel" CollapseControlID="ValidatorCalloutCSS_HeaderPanel" Collapsed="True"
        ImageControlID="ValidatorCalloutCSS_ToggleImage" />
</asp:Content>