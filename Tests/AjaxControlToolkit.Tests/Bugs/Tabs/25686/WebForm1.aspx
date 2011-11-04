<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._25686.WebForm1" %>

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
        <act:TabContainer ID="tabControl" runat="server" AutoPostBack="true" OnActiveTabChanged="tabControl_ActiveTabChanged">
            <act:TabPanel ID="tabContainerChain" runat="server" HeaderText="Search By Chain">
                <ContentTemplate>
                    <b>Search By Chain</b>
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="tabContainerLocation" runat="server" HeaderText="Search By Location">
                <ContentTemplate>
                    <b>Search By Location</b>
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="tabContainerAddChain" runat="server" HeaderText="Add Quota Data for Chain">
                <ContentTemplate>
                    <b>Add Quota Data for Chain</b>
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="tabContainerAddLocation" runat="server" HeaderText="Add Quota Data for Location">
                <ContentTemplate>
                    <b>Add Quota Data for Location</b>
                </ContentTemplate>
            </act:TabPanel>
        </act:TabContainer>
        <asp:Label ID="lblActiveIndex" runat="server"></asp:Label>
    </div>
    </form>
</body>
</html>
