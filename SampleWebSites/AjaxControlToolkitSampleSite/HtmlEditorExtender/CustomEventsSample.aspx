<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true"
    CodeFile="CustomEventsSample.aspx.cs" Inherits="HTMLEditorExtender" Title="HTMLEditorExtender Sample"
    Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" runat="Server">
    <script>
        function onContentsChange() {
            alert('contents changed');
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
                <ajaxToolkit:HtmlEditorExtender ID="htmlEditorExtender1" TargetControlID="txtBox1" OnClientChange="onContentsChange"
                    runat="server">
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
            The above example shows how to use custom handler to get onChange event. 
        </p>
        <br />

        <br />
    </asp:Panel>   

</asp:Content>