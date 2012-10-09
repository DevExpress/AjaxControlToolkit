<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="BalloonPopupTabIssue.aspx.cs"
    Inherits="AjaxControlToolkit.Tests.Bugs.BalloonPopupTabIssue" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server" />
    <div>
        <asp:TextBox ID="MessageTextBox" runat="server" Width="200" autocomplete="off" />
        <br />
        <br />
        <asp:Panel ID="Panel4" runat="server">
            some text some text some text some text some text some text some text some text
            some text some text some text some text
        </asp:Panel>
        <act:BalloonPopupExtender ID="PopupControlExtender2" runat="server" TargetControlID="MessageTextBox"
            BalloonPopupControlID="Panel4" Position="TopRight" BalloonStyle="Cloud" BalloonSize="Small"
            UseShadow="true" DisplayOnClick="true" DisplayOnFocus="true" ScrollBars="None" />
        <br />
        <br />
        <act:TabContainer ID="tabContainer1" runat="server" >
            <act:TabPanel ID="tabPanel1" HeaderText="First" >
                <ContentTemplate>
                    Signature_1:
                </ContentTemplate>
            </act:TabPanel> 
            <act:TabPanel ID="tabPanel2" HeaderText="First" >
                <ContentTemplate>
                    Signature_2:
                </ContentTemplate>
            </act:TabPanel> 
        </act:TabContainer>
    </div>
    </form>
</body>
</html>
