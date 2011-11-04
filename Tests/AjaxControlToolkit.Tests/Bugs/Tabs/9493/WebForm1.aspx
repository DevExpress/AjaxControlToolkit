<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._9493.WebForm1" %>

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
        <act:TabContainer runat="server" ID="Tabs" Height="138px" AutoPostBack="true" Width="100%">
            <act:TabPanel runat="server" ID="Panel1" HeaderText="Signature and Bio_1">
                <ContentTemplate>
                    Signature_1:
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel runat="server" ID="TabPanel1" HeaderText="Signature and Bio_2">
                <ContentTemplate>
                    <asp:DropDownList ID="ddl1" runat="server" AutoPostBack="true">
                        <asp:ListItem Text="First" Value="First"></asp:ListItem>
                        <asp:ListItem Text="Second" Value="Second"></asp:ListItem>
                        <asp:ListItem Text="Third" Value="Third"></asp:ListItem>
                        <asp:ListItem Text="Fourth" Value="Fourth"></asp:ListItem>
                    </asp:DropDownList>
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel runat="server" ID="Panel3" HeaderText="Email">
                <ContentTemplate>
                    Email:
                    <asp:TextBox ID="emailText" runat="server" />
                    <br />
                    <br />
                    <asp:Button ID="Button1" runat="server" Text="Save" />
                    <br />
                    <br />
                    Hit Save to cause a full postback.
                </ContentTemplate>
            </act:TabPanel>
        </act:TabContainer>
    </div>
    </form>
</body>
</html>
