<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Issue11101b.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.Tabs.Issue11101b" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
        </act:ToolkitScriptManager>
        <act:TabContainer ID="TabContainer1" runat="server" ActiveTabIndex="0" 
            Height="90px" Width="284px" OnDemand="true">
            <act:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel1">
                <ContentTemplate>
                    I was rendered at <%: DateTime.Now.ToString() %>
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="TabPanel2" runat="server" HeaderText="TabPanel2">
                <ContentTemplate>
                    I was rendered at <%: DateTime.Now.ToString() %>
                </ContentTemplate>
            </act:TabPanel>
        </act:TabContainer>    
    </div>
    </form>
</body>
</html>
