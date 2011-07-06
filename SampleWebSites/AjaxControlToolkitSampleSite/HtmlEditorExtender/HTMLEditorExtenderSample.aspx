<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true"
    CodeFile="HTMLEditorExtenderSample.aspx.cs" Inherits="HTMLEditorExtenderSample" Title="HTMLEditorExtender Sample"
    Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>    

<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">
            HTMLEditorExtender Demonstration</div>
        <asp:UpdatePanel ID="updatePanel1" runat="server">
            <ContentTemplate>
            <asp:TextBox runat="server" ID="txtBox" TextMode="MultiLine" Columns="50" Rows="10" Text="Hello <b>world1</b>" /><br />
            <ajaxToolkit:HtmlEditorExtender ID="htmlEditorExtender" TargetControlID="txtBox" runat="server">
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
            HTMLEditorExtender is an ASP.NET AJAX Control that allows you to easily create 
            and edit HTML contents.
        </p>
        <p>
            &nbsp;</p>
        <p>
            It uses HTML5 standards to achieve functionality provided by various buttons on 
            the toolbar. Latest versions of most of the browsers supports HTML5 standards so 
            this is also a big advantage to use HTML5 standards. It does not use view state 
            so it is very light weight.
        </p>
    </asp:Panel>    
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            HTMLEditor Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <p>
            The HtmlEditorExtender is initialized with this code. The <em>italic</em> properties
            are optional:</p>
        <pre>
            &lt;ajaxToolkit:HtmlEditorExtender 
                    ID="HtmlEditorExtender1" 
                    TargetControlID="TextBox1" 
                    runat="server"/&gt;
                    <em>&lt;Toolbar&gt;
                        &lt;ajaxToolkit:Bold /&gt;
                        &lt;ajaxToolkit:Italic /&gt;
                        &lt;ajaxToolkit:Underline /&gt;
                        &lt;ajaxToolkit:HorizontalSeparator /&gt;                    
                    &lt;/Toolbar&gt;</em>
            &lt;/ajaxToolkit:HtmlEditorExtender&gt;
            </pre>
        <ul>
            <li><strong>TargetControlId</strong> - ID of textbox to extend with htmlEditor.</li>
            <li><strong>Toolbar</strong> - This provides facility to customize toolbar as per 
                requirement. This tag is optional and if user does not provide toolbar tag then 
                by default all buttons will be populated in the toolbar. User must add atleast 1 
                button in the toolbar tag.
            </li>
            <li><strong>ajaxToolkit:Bold</strong> - This is optional. This represent to Bold button.</li>
            <li><strong>Height</strong> - It takes the Height of target textbox control.</li>        
            <li><strong>Width</strong> - It takes the Width of target textbox control.</li>
        </ul>
    </asp:Panel>        
</asp:Content>
