<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Tabs.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.Tabs.Tabs" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body onload="onLoad()">
    <form id="TestForm" runat="server">
        <asp:ScriptManager ID="MainScriptManager" runat="server"></asp:ScriptManager>

        <act:TabContainer ID="TestTabContainer" runat="server">
            <act:TabPanel ID="ActiveTabPanel" runat="server" HeaderText="Active Tab Panel"></act:TabPanel>
            <act:TabPanel ID="DisabledTabPanel" runat="server" HeaderText="Disabled Tab Panel" Enabled="false"></act:TabPanel>
        </act:TabContainer>
    </form>
</body>
</html>

<script>
    function onLoad() {
        parent.Testing.Component = $find("<%= TestTabContainer.ClientID %>");
        parent.Testing.Sys = Sys;
        parent.Testing.LoadSpecCallback();
    }
</script>
