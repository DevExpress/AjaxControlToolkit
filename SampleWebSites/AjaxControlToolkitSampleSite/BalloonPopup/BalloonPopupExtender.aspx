<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true"
    CodeFile="BalloonPopupExtender.aspx.cs" Inherits="BalloonPopupSample" Title="BalloonPopupExtender Sample"
    Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">
            BalloonPopupExtender Demonstration</div>
        <asp:TextBox ID="MessageTextBox" runat="server" Width="200" autocomplete="off" />        
        <br />
        <br />
        <asp:Panel ID="Panel2" runat="server">            
                some text some text some text
                some text some text some text
                some text some text some text
                some text some text some text                            
        </asp:Panel>
        <ajaxToolkit:BalloonPopupExtender ID="PopupControlExtender2" runat="server" TargetControlID="MessageTextBox"
            BalloonPopupControlID="Panel2" Position="BottomLeft" BalloonStyle="Rectangle" Width="200" Height="75" />
<br />
<br />
        <asp:HyperLink ID="link1" runat="server">Show Balloon popup</asp:HyperLink>
        <br />
        <br />
        <asp:Panel ID="Panel1" runat="server">            
                These are some contents to display for Balloon popup
                These are some contents to display for Balloon popup
                These are some contents to display for Balloon popup
                These are some contents to display for Balloon popup                                           
        </asp:Panel>
        <ajaxToolkit:BalloonPopupExtender ID="BalloonPopupExtender1" runat="server" TargetControlID="link1"
            BalloonPopupControlID="Panel1" Position="BottomLeft" BalloonStyle="Rectangle" Width="200" Height="75" />

    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            BalloonPopupExtender Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            To do
        </p>
        <br />
        <p>
            
        </p>
        <br />
        <p>
            
        </p>
        <br />
        <br />
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            Balloon Popup Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <p>
            The Balloon Popup is initialized with this code. The <em>italic</em> properties
            are optional:</p>
                    
    </asp:Panel>
        
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="False" ImageControlID="Properties_ToggleImage" />   
</asp:Content>
