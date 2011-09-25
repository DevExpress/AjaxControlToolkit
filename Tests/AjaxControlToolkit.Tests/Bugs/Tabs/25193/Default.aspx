<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._25193._Default" %>

<%@ Register Src="~/Bugs/Tabs/25193/UserControls/Example1.ascx" TagName="Example1" TagPrefix="uc1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnableHistory="true" OnNavigate="ScriptManager1_Navigate">
    </asp:ScriptManager>
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
            <act:TabContainer ID="TabContainer1" runat="server" ActiveTabIndex="0">
                <act:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel1">
                    <HeaderTemplate>
                        TabPanel1
                    </HeaderTemplate>
                    <ContentTemplate>
                        <asp:DropDownList ID="DropDownList1" runat="server" OnSelectedIndexChanged="DropDownList1_SelectedIndexChanged"
                            AutoPostBack="True">
                            <asp:ListItem Text="One" Value="One" Selected="True"></asp:ListItem>
                            <asp:ListItem Text="Two" Value="Two"></asp:ListItem>
                            <asp:ListItem Text="Three" Value="Three"></asp:ListItem>
                        </asp:DropDownList>
                        <uc1:Example1 ID="Example11" runat="server" />
                    </ContentTemplate>
                </act:TabPanel>
                <act:TabPanel runat="server" HeaderText="TabPanel2" ID="TabPanel2">
                    <ContentTemplate>
                        two
                    </ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel3" runat="server" HeaderText="TabPanel3">
                    <ContentTemplate>
                        three
                    </ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel4" runat="server" HeaderText="TabPanel4">
                    <ContentTemplate>
                        four
                    </ContentTemplate>
                </act:TabPanel>
            </act:TabContainer>
        </ContentTemplate>
    </asp:UpdatePanel>
    <asp:UpdateProgress ID="UpdateProgress1" runat="server" AssociatedUpdatePanelID="UpdatePanel1">
        <ProgressTemplate>
            Please wait....
        </ProgressTemplate>
    </asp:UpdateProgress>
    
    <asp:HyperLink ID="HyperLink1" runat="server" NavigateUrl="PageOne.aspx">Press me.</asp:HyperLink>
    
    </form>
</body>
</html>
