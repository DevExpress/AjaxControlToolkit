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
            <p>
                TextBoxWatermark is an ASP.NET AJAX extender that can be attached to an ASP.NET TextBox
                control to get "watermark" behavior.  When a watermarked TextBox is empty, it displays a
                message to the user with a custom CSS style.  Once the user has typed some text into the
                TextBox, the watermarked appearance goes away.  The typical purpose of a watermark is to
                provide more information to the user about the TextBox itself without cluttering up the
                rest of the page.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>TextBoxWatermark Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties
                are optional:
            </p>
            <pre>
&lt;ajaxToolkit:TextBoxWatermarkExtender ID="TBWE2" runat="server"
    TargetControlID="TextBox1"
    WatermarkText="Type First Name Here"
    <em>WatermarkCssClass</em>="watermarked" /&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - The ID of the TextBox to operate on</li>
                <li><strong>WatermarkText</strong> - The text to show when the control has no value</li>
                <li><strong>WatermarkCssClass</strong> - The CSS class to apply to the TextBox when it has no value (e.g. the watermark text is shown).</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
