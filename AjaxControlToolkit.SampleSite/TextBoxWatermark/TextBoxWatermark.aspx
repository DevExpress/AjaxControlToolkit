<%@ Page Title="TextBoxWatermark Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="TextBoxWatermark.aspx.cs" Inherits="TextBoxWatermark_TextBoxWatermark" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    TextBoxWatermark Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
            First name:
            <asp:TextBox ID="TextBox1" CssClass="unwatermarked" Width="150" runat="server" /><br />
            <ajaxToolkit:TextBoxWatermarkExtender ID="TextBoxWatermarkExtender1" runat="server"
                TargetControlID="TextBox1"
                WatermarkText="Type First Name Here"
                WatermarkCssClass="watermarked" />

            Last name:
            <asp:TextBox ID="TextBox2" CssClass="unwatermarked" Width="150" runat="server" /><br />
            <br />
            <ajaxToolkit:TextBoxWatermarkExtender ID="TextBoxWatermarkExtender2" runat="server"
                TargetControlID="TextBox2"
                WatermarkText="Type Last Name Here"
                WatermarkCssClass="watermarked" />

            <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="Submit" />
            <br />
            <br />
            <asp:Label ID="Label1" runat="server" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>TextBoxWatermark Description</Header>
        <Content>
            <div runat="server" data-control-type="TextBoxWatermarkExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>TextBoxWatermark Properties</Header>
        <Content>
            <div runat="server" data-control-type="TextBoxWatermarkExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
