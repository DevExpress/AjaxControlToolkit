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

            <b>HtmlEditorExtender with a custom toolbar which includes support for uploading an image:</b>
            <br />
            <asp:TextBox runat="server" ID="txtBox2" TextMode="MultiLine" Columns="50" Rows="10"
                Text="Hello <b>world!</b>" /><br />
            <ajaxToolkit:HtmlEditorExtender ID="htmlEditorExtender2" TargetControlID="txtBox2"
                runat="server" DisplaySourceTab="True" OnImageUploadComplete="ajaxFileUpload_OnUploadComplete">
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
            <p>
                The HtmlEditorExtender is an ASP.NET AJAX Control that enables you to extend the
                standard ASP.NET TextBox control with support for rich formatting. For example,
                the HtmlEditorExtender enables users to apply bold, italic, underline, subscript,
                superscript, and different foreground and background color to text.
            </p>
            <br />
            <p>
                The HtmlEditorExtender
                control is very lightweight and takes advantage of HTML5. The new HtmlEditorExtender
                is compatible with IE6 and newer, and the latest versions of Mozilla Firefox, Google
                Chrome, and Apple Safari.
            </p>
            <br />
            <p>
                Furthermore, you can easily customize the
                toolbar buttons displayed by the HtmlEditorExtender. For example, you can customize
                the HtmlEditorExtender so that it displays only bold and italic buttons and no other
                buttons. Same way you can display Add image button and take the advantage to upload
                and insert images from the HtmlEditorExtender.
            </p>
            <p>
                &nbsp;
            </p>
            <p>
                By default user has to configure sanitizer provider in the web.config file as described 
                in the below security section. If user does not want to use sanitizer provider
                then user must set EnableSanitization property to false.
            </p>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>HTMLEditorExtender Properties</Header>
        <Content>
            <p>
                The HtmlEditorExtender is initialized with this code. The <em>italic</em> properties
                are optional:
            </p>
            <pre>
&lt;ajaxToolkit:HtmlEditorExtender ID=&quot;HtmlEditorExtender1&quot; 
    TargetControlID=&quot;TextBox1&quot; DisplaySourceTab=&quot;true&quot; 
    runat=&quot;server&quot;/&gt;<em>
    &lt;Toolbar&gt; 
        &lt;ajaxToolkit:Undo /&gt;
        &lt;ajaxToolkit:Redo /&gt;
        &lt;ajaxToolkit:Bold /&gt;
        &lt;ajaxToolkit:Italic /&gt;
        &lt;ajaxToolkit:Underline /&gt;
        &lt;ajaxToolkit:StrikeThrough /&gt;
        &lt;ajaxToolkit:Subscript /&gt;
        &lt;ajaxToolkit:Superscript /&gt;
        &lt;ajaxToolkit:JustifyLeft /&gt;
        &lt;ajaxToolkit:JustifyCenter /&gt;
        &lt;ajaxToolkit:JustifyRight /&gt;
        &lt;ajaxToolkit:JustifyFull /&gt;
        &lt;ajaxToolkit:InsertOrderedList /&gt;
        &lt;ajaxToolkit:InsertUnorderedList /&gt;
        &lt;ajaxToolkit:CreateLink /&gt;
        &lt;ajaxToolkit:UnLink /&gt;
        &lt;ajaxToolkit:RemoveFormat /&gt;
        &lt;ajaxToolkit:SelectAll /&gt;
        &lt;ajaxToolkit:UnSelect /&gt;
        &lt;ajaxToolkit:Delete /&gt;
        &lt;ajaxToolkit:Cut /&gt;
        &lt;ajaxToolkit:Copy /&gt;
        &lt;ajaxToolkit:Paste /&gt;
        &lt;ajaxToolkit:BackgroundColorSelector /&gt;
        &lt;ajaxToolkit:ForeColorSelector /&gt;
        &lt;ajaxToolkit:FontNameSelector /&gt;
        &lt;ajaxToolkit:FontSizeSelector /&gt;
        &lt;ajaxToolkit:Indent /&gt;
        &lt;ajaxToolkit:Outdent /&gt;
        &lt;ajaxToolkit:InsertHorizontalRule /&gt;
        &lt;ajaxToolkit:HorizontalSeparator /&gt;
        &lt;ajaxToolkit:InsertImage /&gt;
    &lt;/Toolbar&gt;</em>
&lt;/ajaxToolkit:HtmlEditorExtender&gt;
            </pre>
            <b>Events</b>
            <ul>
                <li><strong>ImageUploadComplete</strong> - Raised on the server when an image is uploaded successfully. In this event an instance of AjaxFileUploadEventArgs is passed in the argument that contains file name, size and content type.</li>
            </ul>
            <br />
            <b>Properties</b>
            <ul>
                <li><strong>TargetControlId</strong> - ID of textbox to extend with htmlEditor.</li>
                <li><strong>Toolbar</strong> - This provides facility to customize toolbar as per requirement. This tag is optional and if user does not provide toolbar tag then by default all buttons will be populated in the toolbar. User must add at least 1 button in the toolbar tag.</li>
                <li><strong>Sanitizer</strong> - Returns the Sanitizer or null when no Sanitizer is configured.</li>
                <li><strong>DisplaySourceTab</strong> - Whether to display source tab to switch to Source view to see html contents.</li>
                <li><strong>EnableSanitization</strong> - Whether to use sanitizer provider or not. By default value of this property is true.</li>
            </ul>
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
