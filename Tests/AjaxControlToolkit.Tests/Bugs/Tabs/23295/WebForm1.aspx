<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._23295.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <asp:UpdatePanel ID="UpdatePanel1" runat="server" EnableViewState="False">
            <ContentTemplate>
                <act:tabcontainer id="TabContainer1" runat="server" activetabindex="2" autopostback="True"
                    onactivetabchanged="TabContainer1_ActiveTabChanged" width="600px">
                    <act:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel1" Visible="false">
                        <HeaderTemplate>home</HeaderTemplate>
                        <ContentTemplate><asp:Panel ID="TabPanel1Panel" runat="server"></asp:Panel></ContentTemplate>
                    </act:TabPanel>
                    <act:TabPanel runat="server" HeaderText="TabPanel2" ID="TabPanel2">
                        <HeaderTemplate>settings</HeaderTemplate>
                        <ContentTemplate><asp:Panel ID="TabPanel2Panel" runat="server"></asp:Panel></ContentTemplate>
                    </act:TabPanel>
                    <act:TabPanel runat="server" HeaderText="TabPanel3" ID="TabPanel3">
                        <HeaderTemplate>Analysis</HeaderTemplate>
                        <ContentTemplate><asp:Panel ID="TabPanel3Panel" runat="server"></asp:Panel></ContentTemplate>
                    </act:TabPanel>
                </act:tabcontainer>
            </ContentTemplate>
        </asp:UpdatePanel>
        <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
        <act:BalloonPopupExtender ID="TextBox1_BalloonPopupExtender" runat="server" 
            BalloonPopupControlID="Panel1" CustomCssUrl="" DynamicServicePath="" 
            Enabled="True" ExtenderControlID="" Position="TopRight" 
            TargetControlID="TextBox1">
        </act:BalloonPopupExtender>
        <asp:Panel ID="Panel1" runat="server" Visible="true">
            Test baloon popup</asp:Panel>
    </div>
    </form>
</body>
</html>
