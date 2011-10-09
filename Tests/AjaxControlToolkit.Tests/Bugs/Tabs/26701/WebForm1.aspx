<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._26701.WebForm1" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="act" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <act:toolkitscriptmanager id="p_scriptManager" runat="server" />
        <asp:Repeater ID="DynamicContainer" runat="server">
            <ItemTemplate>
                <act:tabcontainer ID="tabContainer1" runat="server" autopostback="true" onactivetabchanged="ProcessActiveTabChanged">
                <act:TabPanel ID="tab1" runat="server" HeaderText="Tab 1">
                    <ContentTemplate>
                        Tab 1 content
                    </ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="tab2" runat="server" HeaderText="Tab 2">
                    <ContentTemplate>
                        Tab 2 content
                    </ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="tab3" runat="server" HeaderText="Tab 3">
                    <ContentTemplate>
                        Tab 3 content
                    </ContentTemplate>
                </act:TabPanel>
            </act:tabcontainer>
            </ItemTemplate>
        </asp:Repeater>
        <asp:Label ID="StatusTab" runat="server" Text="No tab selected yet" />
        <br />
        <asp:Label ID="StatusButton" runat="server" Text="Button not pressed yet" />
        <br />
        <asp:Button ID="Button1" runat="server" OnCommand="ProcessButtonCommand" Text="Click Me" />
    </div>
    </form>
</body>
</html>
