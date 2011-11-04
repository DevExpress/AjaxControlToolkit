<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._25762.WebForm1" %>

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
        <act:TabContainer ID="TabContainer1" runat="server" ActiveTabIndex="0">
            <act:TabPanel ID="TabPanel1" runat="server" HeaderText="TabPanel1">
                <contenttemplate>
                    Some Content
                </contenttemplate>
            </act:TabPanel>
            <act:TabPanel ID="TabPanel2" runat="server" HeaderText="TabPanel2">
                <contenttemplate>
                    Some more content.
                    <act:HoverMenuExtender ID="HoverMenuExtender1" runat="server" PopupControlID="Panel1"
                        TargetControlID="DropDownList1">
                    </act:HoverMenuExtender>
                    <asp:DropDownList ID="DropDownList1" runat="server">
                        <asp:ListItem>Item1</asp:ListItem>
                        <asp:ListItem>Item2</asp:ListItem>
                    </asp:DropDownList>
                    <asp:Panel ID="Panel1" runat="server">
                        <asp:Table ID="Table1" runat="server" BackColor="White" BorderColor="Black" BorderWidth="1"
                            BorderStyle="Solid">
                            <asp:TableRow>
                                <asp:TableCell>Term 1 :</asp:TableCell>
                                <asp:TableCell>This is the definition.</asp:TableCell>
                            </asp:TableRow>
                            <asp:TableRow>
                                <asp:TableCell>Term 2 :</asp:TableCell>
                                <asp:TableCell>This is the definition.</asp:TableCell>
                            </asp:TableRow>
                        </asp:Table>
                    </asp:Panel>
                </contenttemplate>
            </act:TabPanel>
        </act:TabContainer>
    </div>
    </form>
</body>
</html>
