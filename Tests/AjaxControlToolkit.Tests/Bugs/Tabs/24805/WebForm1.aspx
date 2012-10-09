<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._24805.WebForm1" %>

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
            <act:TabPanel runat="server" ID="Panel1" HeaderText="Panel1">
                <ContentTemplate>
                    Panel1
                </ContentTemplate>
            </act:TabPanel>

            <act:TabPanel runat="server" ID="TabPanel1" HeaderText="Panel2">
                <ContentTemplate>
                    Panel2
                </ContentTemplate>
            </act:TabPanel>

            <act:TabPanel runat="server" ID="Panel3" HeaderText="Panel3" >
                <ContentTemplate>
                    <br />                    
                    <asp:Button ID="Button1" runat="server" Text="Display Alert" OnClick="Button1_click" />
                    <br />                    
                </ContentTemplate>
            </act:TabPanel>
        </act:tabcontainer>
    </div>
    </form>
</body>
</html>
