<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._12648.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Untitled Page</title>
    <script type="text/javascript">
        function pageLoad() {
            ToggleTab(false, 1);
        }     
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <act:toolkitscriptmanager id="ToolkitScriptManager1" runat="server" ScriptMode="Debug">
        </act:toolkitscriptmanager>
        <script type="text/javascript">
            function EnableTab(tabNumber) {
                $find('<%=TabContainer1.ClientID%>').set_activeTabIndex(tabNumber);
            }
            function ToggleTab(enable, tabNumber) {
                $find('<%=TabContainer1.ClientID%>').get_tabs()[tabNumber].set_enabled(enable);
            } 
        </script>
        <a href="#" id="joinHyperLink" onclick="EnableTab(1)">join</a>
        <act:TabContainer ID="TabContainer1" runat="server">
            <act:TabPanel ID="first" HeaderText="first" runat="server">
                <ContentTemplate>
                    content of first</ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="second" HeaderText="second" runat="server">
                <ContentTemplate>
                    content of second tab
                    <asp:CreateUserWizard ID="CreateUserWizard1" runat="server">
                        <WizardSteps>
                            <asp:CreateUserWizardStep ID="CreateUserWizardStep1" runat="server">
                            </asp:CreateUserWizardStep>
                            <asp:CompleteWizardStep ID="CompleteWizardStep1" runat="server">
                            </asp:CompleteWizardStep>
                        </WizardSteps>
                    </asp:CreateUserWizard>
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="third" HeaderText="third" runat="server">
                <ContentTemplate>
                    content of third tab</ContentTemplate>
            </act:TabPanel>
        </act:TabContainer>
    </div>
    </form>
</body>
</html>
