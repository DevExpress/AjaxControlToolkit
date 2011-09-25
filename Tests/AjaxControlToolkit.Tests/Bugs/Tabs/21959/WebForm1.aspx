<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._21959.WebForm1" %>

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
        <act:TabContainer ID="TabContainer1" runat="server" Width="100%">
            <act:TabPanel runat="server" ID="TabPanel1" HeaderText="Tab1">
                <ContentTemplate>
                    
                </ContentTemplate>
            </act:TabPanel>

        </act:TabContainer>          
    </div>
    </form>
</body>
</html>
