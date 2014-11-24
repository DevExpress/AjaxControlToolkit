<%@ Page Title="HTMLEditorExtender Custom events sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="HtmlEditorExtenderCustomEvents.aspx.cs" Inherits="HtmlEditorExtender_HtmlEditorExtenderCustomEvents" %>

<asp:Content ID="Content1" ContentPlaceHolderID="DemoHeading" runat="Server">
    HTMLEditorExtender Custom events demonstration
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="DemoContent" runat="Server">
    <script>
        function onContentsChange() {
            alert('contents changed');
        }

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
            <asp:TextBox runat="server" ID="txtBox1" TextMode="MultiLine" Columns="50" Rows="10"
                Text="Hello <b>world!</b>" /><br />
            <ajaxToolkit:HtmlEditorExtender ID="htmlEditorExtender1" TargetControlID="txtBox1"
                OnClientChange="onContentsChange" runat="server" DisplaySourceTab="true">
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
        <pre>
    &lt;script&gt;
        function onContentsChange() {
            alert('contents changed');
        }
    &lt;/script&gt;

    &lt;asp:TextBox runat="server"
        ID="txtBox1" 
        TextMode="MultiLine" 
        Columns="50" 
        Rows="10" 
        Text="Hello &lt;b&gt;world!&lt;/b&gt;" /&gt;
    
    &lt;ajaxToolkit:HtmlEditorExtender 
        ID="htmlEditorExtender1" 
        TargetControlID="txtBox1" 
        OnClientChange="onContentsChange" 
        runat="server" &gt;
    &lt;/ajaxToolkit:HtmlEditorExtender&gt;
        </pre>
</asp:Content>

