<%@ Page Title="ToggleButton Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="ToggleButton.aspx.cs" Inherits="ToggleButton_ToggleButton" %>

<asp:Content ID="Content1" ContentPlaceHolderID="DemoHeading" runat="Server">
    ToggleButton Demonstration
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="DemoContent" runat="Server">
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
            <asp:CheckBox ID="CheckBox1" Checked="true" Text="I like ASP.NET" runat="server" /><br />
            <ajaxToolkit:ToggleButtonExtender ID="ToggleButtonExtender1" runat="server"
                TargetControlID="CheckBox1"
                ImageWidth="19"
                ImageHeight="19"
                UncheckedImageUrl="ToggleButton_Unchecked.gif"
                CheckedImageUrl="ToggleButton_Checked.gif"
                CheckedImageAlternateText="It's really nice to hear from you that you like ASP.NET"
                UncheckedImageAlternateText="I don't understand why you don't like ASP.NET" />

            <asp:CheckBox ID="CheckBox2" Checked="true" Text='I like ASP.NET AJAX' runat="server" /><br />
            <br />
            <ajaxToolkit:ToggleButtonExtender ID="ToggleButtonExtender2" runat="server"
                TargetControlID="CheckBox2"
                ImageWidth="19"
                ImageHeight="19"
                UncheckedImageUrl="ToggleButton_Unchecked.gif"
                CheckedImageUrl="ToggleButton_Checked.gif"
                CheckedImageAlternateText="It's really nice to hear from you that you like ASP.NET AJAX"
                UncheckedImageAlternateText="I don't understand why you don't like ASP.NET AJAX" />

            <asp:Button ID="Button1" runat="server" Text="Submit" OnClick="Button1_Click" />
            <br />
            <br />
            <asp:Label ID="Label1" runat="server" Text="[No response provided yet]" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>ToggleButton Description</Header>
        <Content>
            <div runat="server" data-control-type="ToggleButtonExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>ToggleButton Properties</Header>
        <Content>
            <div runat="server" data-control-type="ToggleButtonExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>

