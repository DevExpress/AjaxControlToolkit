<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs.pullrequestFixes.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="tsm1" runat="server"></act:ToolkitScriptManager>
    <div>
        <act:TabContainer ID="tc" runat="server" ActiveTabIndex="0" Height="128px" Width="332px"
            OnDemand="true" OnActiveTabChanged="tc_ActiveTabChanged">
            <act:TabPanel ID="tp1" runat="server" HeaderText="TabPanel1" OnDemandMode="Once">
                <ContentTemplate>
                    OnDemandMode="Once"
                    <%= DateTime.Now.ToString("T") %><br />
                    <br />
                    <asp:LinkButton ID="lnk1" runat="server" Text="Test me" />
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="tp2" runat="server" HeaderText="TabPanel2" OnDemandMode="Always">
                <ContentTemplate>
                    OnDemandMode="Always"
                    <%= DateTime.Now.ToString("T") %><br />
                    <br />
                    <asp:LinkButton ID="lnk2" runat="server" Text="Test me" />
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="tp3" runat="server" HeaderText="TabPanel3" OnDemandMode="None">
                <ContentTemplate>
                    OnDemandMode="None"
                    <%= DateTime.Now.ToString("T") %><br />
                    <br />
                    <asp:LinkButton ID="lnk3" runat="server" Text="Test me" />
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="tp4" runat="server" HeaderText="TabPanel4" OnDemandMode="Once">
                <ContentTemplate>
                    OnDemandMode="Once"
                    <%= DateTime.Now.ToString("T") %><br />
                    <br />
                    <asp:LinkButton ID="lnk4" runat="server" Text="Test me" />
                </ContentTemplate>
            </act:TabPanel>
        </act:TabContainer>
    </div>
    </form>
</body>
</html>
