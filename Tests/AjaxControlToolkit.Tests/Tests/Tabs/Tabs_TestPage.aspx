<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Tabs_TestPage.aspx.cs"
    Inherits="AjaxControlToolkit.Tests.Tests.Tabs.Tabs_TestPage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server" ScriptMode=Debug CombineScripts=false />
        <div id="BeforeTabs"></div>
        <act:TabContainer runat="server" ID="TabContainer1" ActiveTabIndex="0">
            <act:TabPanel runat="server" ID="TabPanel1" HeaderText="One">
                <ContentTemplate>
                    One
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel runat="server" ID="TabPanel2" HeaderText="Two">
                <ContentTemplate>
                    Two
                </ContentTemplate>
            </act:TabPanel>
        </act:TabContainer>
    </div>
    </form>
</body>
</html>