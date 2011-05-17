<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    CodeFile="TextBoxWatermark.aspx.cs"
    Inherits="TextBoxWatermark_TextBoxWatermark"
    Title="TextBoxWatermark Sample"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager EnablePartialRendering="true" runat="Server" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">TextBoxWatermark Demonstration</div>
        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
            <ContentTemplate>
                First name:
                <asp:TextBox ID="TextBox1" CssClass="unwatermarked" Width="150" runat="server" /><br />
                <ajaxToolkit:TextBoxWatermarkExtender ID="TextBoxWatermarkExtender1" runat="server"
                    TargetControlID="TextBox1"
                    WatermarkText="Type First Name Here"
                    WatermarkCssClass="watermarked" />
            
                Last name:
                <asp:TextBox ID="TextBox2" CssClass="unwatermarked" Width="150" runat="server" /><br /><br />
                <ajaxToolkit:TextBoxWatermarkExtender ID="TextBoxWatermarkExtender2" runat="server"
                    TargetControlID="TextBox2"
                    WatermarkText="Type Last Name Here"
                    WatermarkCssClass="watermarked" />
            
                <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="Submit" />
                <br /><br />
                <asp:Label ID="Label1" runat="server" />
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    <div class="demobottom"></div>

    <asp:Panel ID="Description_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
            TextBoxWatermark Description
        </div>
    </asp:Panel>
    <asp:Panel id="Description_ContentPanel" runat="server" style="overflow:hidden;">
        <p>
            TextBoxWatermark is an ASP.NET AJAX extender that can be attached to an ASP.NET TextBox
            control to get "watermark" behavior.  When a watermarked TextBox is empty, it displays a
            message to the user with a custom CSS style.  Once the user has typed some text into the
            TextBox, the watermarked appearance goes away.  The typical purpose of a watermark is to
            provide more information to the user about the TextBox itself without cluttering up the
            rest of the page.
        </p>
    </asp:Panel>

    <asp:Panel ID="Properties_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
            TextBoxWatermark Properties
        </div>
    </asp:Panel>
    <asp:Panel id="Properties_ContentPanel" runat="server" style="overflow:hidden;" Height="0px">
		<p>
            The control above is initialized with this code. The <em>italic</em> properties
            are optional:
        </p>
<pre>&lt;ajaxToolkit:TextBoxWatermarkExtender ID="TBWE2" runat="server"
    TargetControlID="TextBox1"
    WatermarkText="Type First Name Here"
    <em>WatermarkCssClass</em>="watermarked" /&gt;</pre>
        <ul>
            <li><strong>TargetControlID</strong> - The ID of the TextBox to operate on</li>
            <li><strong>WatermarkText</strong> - The text to show when the control has no value</li>
            <li><strong>WatermarkCssClass</strong> - The CSS class to apply to the TextBox when
                it has no value (e.g. the watermark text is shown).</li>
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