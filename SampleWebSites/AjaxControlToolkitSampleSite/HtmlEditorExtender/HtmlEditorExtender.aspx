<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" Title="HtmlExtender Sample"
    Culture="auto" UICulture="auto" Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">    
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnableScriptGlobalization="true"
        EnableScriptLocalization="true" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">
            HtmlExtender Demonstration</div>
        <div>
            <br />            
            <asp:TextBox runat="server" ID="txtBox1" TextMode="MultiLine" Columns="50" Rows="10" Text="Hello <b>world</b>" /><br />
            <ajaxToolkit:HtmlEditorExtender ID="htmlExtender1" TargetControlID="txtBox1" runat="server">
            </ajaxToolkit:HtmlEditorExtender>            
            <br />
            <br />

            <asp:TextBox runat="server" ID="txtBox2" TextMode="MultiLine" Columns="50" Rows="10" Text="Hello <b>world2</b>" /><br />
            <ajaxToolkit:HtmlEditorExtender ID="HtmlEditorExtender2" TargetControlID="txtBox2" runat="server">
            </ajaxToolkit:HtmlEditorExtender>            

            <br />
            <br />
            <asp:Button ID="btnSubmit" Text="Submit" runat="server" />
        </div>
    </div>    
</asp:Content>
