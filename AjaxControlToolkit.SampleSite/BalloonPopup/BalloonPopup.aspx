<%@ Page Title="BalloonPopup Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="BalloonPopup.aspx.cs" Inherits="BaloonPopup_BaloonPopup" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    BalloonPopup Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <p>
        Click inside either of the two TextBox controls below or click the link to see
        a demonstration of the BalloonPopupExtender control.
    </p>

    <asp:TextBox ID="MessageTextBox" runat="server" Width="200" autocomplete="off" />
    <br /><br />
    <asp:Panel ID="Panel2" runat="server">
        This Balloon Popup uses the Cloud style.
    </asp:Panel>
    <ajaxToolkit:BalloonPopupExtender ID="PopupControlExtender2" runat="server" TargetControlID="MessageTextBox"
        BalloonPopupControlID="Panel2" Position="BottomRight" BalloonStyle="Cloud" BalloonSize="Small"
        UseShadow="false" DisplayOnClick="true" DisplayOnFocus="true" />
    <br /><br />
    <asp:HyperLink ID="link1" runat="server">Click Here to Show the Balloon Popup</asp:HyperLink>
    <br /><br />
    <asp:Panel ID="Panel1" runat="server">
        This Balloon Popup appears when you click the link. It uses a Rectangle style and it is set to 
        appear at the top-right of the link.
    </asp:Panel>
    <ajaxToolkit:BalloonPopupExtender ID="BalloonPopupExtender1" runat="server" TargetControlID="link1"
        BalloonPopupControlID="Panel1" Position="TopRight" BalloonStyle="Rectangle" BalloonSize="Small"
        UseShadow="true" />
    <br /><br />
    <asp:TextBox ID="txtCustom" runat="server" Width="200" autocomplete="off" />
    <br /><br />
    <asp:Panel ID="Panel3" runat="server">
        This is a custom BalloonPopupExtender style created with a custom Cascading Style Sheet. 
    </asp:Panel>
    <ajaxToolkit:BalloonPopupExtender ID="BalloonPopupExtender2" runat="server" TargetControlID="txtCustom"
        BalloonPopupControlID="Panel3" Position="BottomRight" BalloonStyle="Custom" CustomCssUrl="CustomStyle/BalloonPopupOvalStyle.css"
        CustomClassName="oval" BalloonSize="Medium" UseShadow="true" />
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>BalloonPopupExtender Description</Header>
        <Content>
            <div runat="server" data-control-type="BalloonPopupExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>BalloonPopupExtender Properties</Header>
        <Content>
            <div runat="server" data-control-type="BalloonPopupExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>

