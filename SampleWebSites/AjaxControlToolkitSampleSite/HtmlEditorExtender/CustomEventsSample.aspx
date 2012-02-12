<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true"
    CodeFile="CustomEventsSample.aspx.cs" Inherits="HTMLEditorExtender" Title="HTMLEditorExtender Sample"
    Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">
    <script>
        function onContentsChange() {
            alert('contents changed');
        }

        function windowUnload() {
            if (Sys.Extended.UI.HtmlEditorExtenderBehavior.IsDirty()) {
                alert('unsaved data');
            }
            var htmleditorextender = $find('<%=htmlEditorExtender1.ClientID%>');
            if (htmleditorextender.get_isDirty()) {
                alert('unsaved data in htmlEditorExtender1.');
            }
        }

    </script>
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">
            HTMLEditorExtender Demonstration for Custom Events</div>
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
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            HTMLEditorExtender Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            The above example shows how to use onClientChange handler to get onChange event.
        </p>
        <br />
        <br />
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            Sample's Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <p>
            The Sample is initialized with this code.</p>
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
    </asp:Panel>
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="False" ImageControlID="Properties_ToggleImage" />
</asp:Content>
