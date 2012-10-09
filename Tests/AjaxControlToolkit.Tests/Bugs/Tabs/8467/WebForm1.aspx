<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._8467.WebForm1" %>

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
        <act:tabcontainer runat="server" id="Tabs" height="138px" autopostback="true"
            width="100%">
            <act:TabPanel runat="server" ID="Panel1" Font-Size="X-Large" ForeColor="Green" HeaderText="Signature and Bio_1">
                <ContentTemplate>
                    Signature_1:
                </ContentTemplate>
            </act:TabPanel>

            <act:TabPanel runat="server" ID="TabPanel1" HeaderText="Signature and Bio_2">
                <ContentTemplate>
                    Signature_2:
                </ContentTemplate>
            </act:TabPanel>

            <act:TabPanel runat="server" ID="Panel3" HeaderText="Email" ForeColor="Blue">
                <ContentTemplate>
                    Email: <asp:TextBox ID="emailText" runat="server" />
                    <br /><br />
                    <asp:Button ID="Button1" runat="server" Text="Save" />
                    <br /><br />
                    Hit Save to cause a full postback.
                </ContentTemplate>
            </act:TabPanel>
        </act:tabcontainer>
    </div>
    </form>
</body>
</html>
