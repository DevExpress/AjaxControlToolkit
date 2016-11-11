<%@ Page Title="HTMLEditorExtender Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="HtmlEditorExtender.aspx.cs" Inherits="HtmlEditorExtender_HtmlEditorExtender" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit.HtmlEditor.Sanitizer" TagPrefix="ajaxToolkit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="DemoHeading" runat="Server">
    HTMLEditorExtender Demonstration
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="DemoContent" runat="Server">
    <asp:UpdatePanel ID="updatePanel1" runat="server">
        <ContentTemplate>
            <asp:TextBox runat="server" ID="txtBox1" TextMode="MultiLine" Columns="50" Rows="10"
                Text="Hello <b>world!</b>" /><br />
            <ajaxToolkit:HtmlEditorExtender ID="htmlEditorExtender1" TargetControlID="txtBox1" runat="server" DisplaySourceTab="true">
            </ajaxToolkit:HtmlEditorExtender>
            <br />

            <b>HtmlEditorExtender with a custom toolbar, which adds support for image uploading. The bottom toolbar also provides the source view and preview buttons changing the display mode to HTML markup and rendered HTML respectively:</b>
            <br />
            <asp:TextBox runat="server" ID="txtBox2" TextMode="MultiLine" Columns="50" Rows="10"
                Text="Hello <b>world!</b>" /><br />
            <ajaxToolkit:HtmlEditorExtender ID="htmlEditorExtender2" TargetControlID="txtBox2"
                runat="server" DisplaySourceTab="true" DisplayPreviewTab="true" OnImageUploadComplete="ajaxFileUpload_OnUploadComplete">
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
                    <ajaxToolkit:InsertImage />
                </Toolbar>
            </ajaxToolkit:HtmlEditorExtender>
            <br />
            <br />
            <asp:Button runat="server" Text="Submit content" ID="submit" OnClick="btnsubmit_click" />
        </ContentTemplate>
    </asp:UpdatePanel>
    <br />
    <br />
    <p>
        To see how to implement client side onchange event on HtmlEditorExtender see <a href="HtmlEditorExtenderCustomEvents.aspx">Custom events sample</a>
    </p>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>HTMLEditorExtender Description</Header>
        <Content>
            <div runat="server" data-control-type="HtmlEditorExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>HTMLEditorExtender Properties</Header>
        <Content>
            <div runat="server" data-control-type="HtmlEditorExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>HtmlEditorExtender Security</Header>
        <Content>
            <p>
               We strongly advise against using HtmlEditorExtender on a public website without the sanitizer. If you do not use a sanitizer, your website will be open to Cross-Site Scripting (XSS) Attacks.
            </p>
            <br />
            <p>
                To use the Toolkit Sanitizer, install the AjaxControlToolkit.HtmlEditor.Sanitizer NuGet package.
            </p>
            <br />
            <p>
                The AjaxControlToolkit.SampleSite is configured to use the HtmlAgilityPack Sanitizer Provider.
            </p>

            <p>
                &nbsp;
            </p>
            <p>
                <b>Disclaimer:</b>
            </p>
            <p>
                The HtmlEditorExtender allows posting an arbitrary HTML to the server. We have made this safe by following OWASP (Open Web Security Project) recommendations. However, we cannot guarantee 100% security of your site even with the enabled sanitizer.
            </p>
        </Content>
    </samples:InfoBlock>
</asp:Content>
