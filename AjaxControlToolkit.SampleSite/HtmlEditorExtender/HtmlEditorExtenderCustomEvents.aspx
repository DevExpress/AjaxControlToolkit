<%@ Page Title="HTMLEditorExtender Custom events sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="HtmlEditorExtenderCustomEvents.aspx.cs" Inherits="HtmlEditorExtender_HtmlEditorExtenderCustomEvents" %>

<asp:Content ID="Content1" ContentPlaceHolderID="DemoHeading" runat="Server">
    HTMLEditorExtender Custom events demonstration
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="DemoContent" runat="Server">
    <script id="contentChangedScript">
        function onContentsChange() {
            alert('contents changed');
        }
    </script>
    <script>
        function windowUnload() {
            if(Sys.Extended.UI.HtmlEditorExtenderBehavior.IsDirty()) {
                alert('unsaved data');
            }
            var htmleditorextender = $find('<%=htmlEditorExtender1.ClientID%>');
            if(htmleditorextender.get_isDirty()) {
                alert('unsaved data in htmlEditorExtender1.');
            }
        }

    </script>
    <asp:UpdatePanel ID="updatePanel1" runat="server">
        <ContentTemplate>
            <asp:TextBox 
                runat="server" 
                ID="txtBox1" 
                TextMode="MultiLine" 
                Columns="50" 
                Rows="10"
                Text="Hello <b>world!</b>" /><br />
            <ajaxToolkit:HtmlEditorExtender 
                ID="htmlEditorExtender1" 
                TargetControlID="txtBox1"
                OnClientChange="onContentsChange" 
                runat="server" 
                DisplaySourceTab="true">
            </ajaxToolkit:HtmlEditorExtender>
            <br />
            <br />
            <asp:Button runat="server" Text="Submit content" ID="submit" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="InfoContent" runat="Server">
    <br />
    <p>The above example shows how to use onClientChange handler to get onChange event</p>
    <p>The Sample is initialized with this code.</p>
    <div runat="server" id="codeBlock1" />
    <div runat="server" id="codeBlock2" />
    <div runat="server" id="codeBlock3" />
</asp:Content>

