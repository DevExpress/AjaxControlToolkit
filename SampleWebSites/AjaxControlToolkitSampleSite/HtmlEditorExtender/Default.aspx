<%@ Page Title="" Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true"
    CodeFile="Default.aspx.cs" Inherits="HtmlEditorExtender_Default" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" runat="Server">
    <asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
    </asp:ToolkitScriptManager>
    <div>
        <asp:TextBox ID="txtbox1" runat="server" Text="test test"></asp:TextBox>
        <asp:HtmlEditorExtender ID="HtmlEditorExtender1" runat="server">
        </asp:HtmlEditorExtender>
    </div>
</asp:Content>
