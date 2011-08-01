<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true"
    CodeFile="HTMLEditorExtender.aspx.cs" Inherits="HTMLEditorExtender" Title="HTMLEditorExtender Sample"
    Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">
            HTMLEditorExtender Demonstration</div>
        <asp:UpdatePanel ID="updatePanel1" runat="server">                    
            <ContentTemplate>                                
                <asp:TextBox runat="server" ID="txtBox1" TextMode="MultiLine" Columns="50" Rows="10"
                    Text="Hello <b>world1</b>" /><br />
                <ajaxToolkit:HtmlEditorExtender ID="htmlEditorExtender1" TargetControlID="txtBox1"
                    runat="server">
                </ajaxToolkit:HtmlEditorExtender>
                <br />
                <br />

                <b>Below example with configurable toolbar:</b>
                <br />                
                <asp:TextBox runat="server" ID="txtBox2" TextMode="MultiLine" Columns="50" Rows="10"
                    Text="Hello <b>world1</b>" /><br />
                <ajaxToolkit:HtmlEditorExtender ID="htmlEditorExtender2" TargetControlID="txtBox2"
                    runat="server">
                    <Toolbar>                        
                        <ajaxToolkit:Bold />
                        <ajaxToolkit:Italic />
                        <ajaxToolkit:Underline />
                        <ajaxToolkit:HorizontalSeparator />
                        <ajaxToolkit:JustifyLeft />
                        <ajaxToolkit:JustifyCenter />
                        <ajaxToolkit:JustifyRight />
                        <ajaxToolkit:JustifyFull />                                                
                        <ajaxToolkit:CreateLink />
                        <ajaxToolkit:UnLink />                                                
                    </Toolbar>
                </ajaxToolkit:HtmlEditorExtender>
                <br />
                <br />
                <asp:Button runat="server" Text="Submit content" ID="submit" />
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            HTMLEditorExtender Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            The HtmlEditorExtender is an ASP.NET AJAX Control that enables you to extend the
            standard ASP.NET TextBox control with support for rich formatting. For example,
            the HtmlEditorExtender enables users to apply bold, italic, underline, subscript,
            superscript, and different foreground and background color to text.
        </p>
        <br />
        <p>
            Unlike the existing HTMLEditor control (link to the old control), the new HtmlEditorExtender
            control is very lightweight and takes advantage of HTML5. The new HtmlEditorExtender
            is compatible with IE6 and newer, and the latest versions of Mozilla Firefox, Google
            Chrome, and Apple Safari.
        </p>
        <br />
        <p>
            Furthermore, unlike the existing HTMLEditor control, you can easily customize the
            toolbar buttons displayed by the HtmlEditorExtender. For example, you can customize
            the HtmlEditorExtender so that it displays only bold and italic buttons and no other
            buttons.
        </p>
        <br />
        <p>
            The HtmlEditorExtender is fully compatible with ASP.NET Request Validation security.
            The HtmlEditorExtender HTML encodes all content before submitting the content to
            the server. The HtmlEditorExtender then selectively decodes HTML content on the
            server.
        </p>
        <br />
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            HTMLEditorExtender Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <p>
            The HtmlEditorExtender is initialized with this code. The <em>italic</em> properties
            are optional:</p>
        <pre>
        &lt;ajaxToolkit:HtmlEditorExtender ID="HtmlEditorExtender1" 
            TargetControlID="TextBox1" runat="server"/&gt;
            <em>&lt;Toolbar&gt; 
                &lt;ajaxToolkit:Bold /&gt; 
                &lt;ajaxToolkit:Italic /&gt; 
                &lt;ajaxToolkit:Underline/&gt; 
                &lt;ajaxToolkit:HorizontalSeparator /&gt; 
            &lt;/Toolbar&gt;</em>
        &lt;/ajaxToolkit:HtmlEditorExtender&gt;
            </pre>
        <ul>
            <li><strong>TargetControlId</strong> - ID of textbox to extend with htmlEditor.</li>
            <li><strong>Toolbar</strong> - This provides facility to customize toolbar as per requirement.
                This tag is optional and if user does not provide toolbar tag then by default all
                buttons will be populated in the toolbar. User must add atleast 1 button in the
                toolbar tag. </li>
            <li><strong>ajaxToolkit:Bold</strong> - This is optional. This represent to Bold button.
                Same way other buttons can be added easily in the toolbar.</li>
            <li><strong>Height</strong> - It takes the Height of target textbox control.</li>
            <li><strong>Width</strong> - It takes the Width of target textbox control.</li>
            <li><strong>X, Y coordinates</strong> - It takes the X and Y coordinates of target textbox
                control.</li>
        </ul>
    </asp:Panel>
     <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />    
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" />    
</asp:Content>
