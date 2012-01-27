<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.HtmlEditorExtender._27031.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
    </act:ToolkitScriptManager>
    <div>
        <h1>
            HTMLEditorExtender Errors</h1>
        <p>
            If you click this button with the collapsible panel extender collapsed, the HTML
            editor disappears:</p>
        <asp:UpdatePanel ID="Up" runat="server">
            <ContentTemplate>
                <p>
                    <asp:Button ID="Submit" runat="server" Text="Post Back" /></p>
                <asp:Panel ID="Pan_MoreHdr" runat="server">
                    <h5 class="collapse">
                        <asp:Label ID="Lbl_MoreHdr" runat="server" CssClass="plus-minus">+</asp:Label>Show
                        HTMLEditorExtender</h5>
                </asp:Panel>
                <asp:Panel ID="Pan_More" runat="server" CssClass="expand">
                    <asp:TextBox ID="MainDesc" runat="server" ToolTip="Enter the main description (formatting and inline objects apply here)"
                        TextMode="MultiLine" Width="500" Height="500"></asp:TextBox>
                    <act:HtmlEditorExtender ID="Html_MainDesc" runat="server" TargetControlID="MainDesc">
                    </act:HtmlEditorExtender>
                </asp:Panel>
                <act:CollapsiblePanelExtender ID="CpE" runat="Server" TargetControlID="Pan_More"
                    ExpandControlID="Pan_MoreHdr" CollapseControlID="Pan_MoreHdr" TextLabelID="Lbl_MoreHdr"
                    Collapsed="True" CollapsedText="+" ExpandedText="-" />
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    </form>
</body>
</html>
