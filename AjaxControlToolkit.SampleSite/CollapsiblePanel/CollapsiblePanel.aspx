<%@ Page Title="CollapsiblePanel Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="CollapsiblePanel.aspx.cs" Inherits="CollapsiblePanel_CollapsiblePanel" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    CollapsiblePanel Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <asp:Panel ID="Panel2" runat="server" CssClass="collapsePanelHeader" Height="30px">
        <div style="padding: 5px; cursor: pointer; vertical-align: middle;">
            <div style="float: left;">What is ASP.NET AJAX?</div>
            <div style="float: left; margin-left: 20px;">
                <asp:Label ID="Label1" runat="server">(Show Details...)</asp:Label>
            </div>
            <div style="float: right; vertical-align: middle;">
                <asp:ImageButton ID="Image1" runat="server" ImageUrl="~/images/expand_blue.jpg" AlternateText="(Show Details...)" />
            </div>
        </div>
    </asp:Panel>
    <asp:Panel ID="Panel1" runat="server" CssClass="collapsePanel" Height="0">
        <br />
        <p>
            <asp:ImageButton ID="Image2" runat="server" ImageUrl="~/Images/AJAX.gif"
                AlternateText="ASP.NET AJAX" ImageAlign="right" />
            <%= DemoData.ContentFillerText %>
        </p>
    </asp:Panel>

    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDemo" runat="Server"
        TargetControlID="Panel1"
        ExpandControlID="Panel2"
        CollapseControlID="Panel2"
        Collapsed="True"
        TextLabelID="Label1"
        ImageControlID="Image1"
        ExpandedText="(Hide Details...)"
        CollapsedText="(Show Details...)"
        ExpandedImage="~/Images/collapse_blue.jpg"
        CollapsedImage="~/Images/expand_blue.jpg"
        SuppressPostBack="true"
        SkinID="CollapsiblePanelDemo" />

</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>CollapsiblePanel Description</Header>
        <Content>
            <div runat="server" ControlType="CollapsiblePanelExtender" ContentType="description" />
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>CollapsiblePanel Properties</Header>
        <Content>
            <div runat="server" ControlType="CollapsiblePanelExtender" ContentType="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
