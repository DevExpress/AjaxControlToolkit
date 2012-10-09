<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Issue11101b.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.Tabs.Issue11101b" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
&nbsp;<form id="form1" runat="server">
    <div>
        <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
        </act:ToolkitScriptManager>
        Custom state of OnDemand=True<act:TabContainer ID="TabContainer1" 
            runat="server" ActiveTabIndex="0" 
            Height="128px" Width="332px" OnDemand="true">
            <act:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel1" OnDemandMode="Once">
                <ContentTemplate>
                    I was rendered at <%: DateTime.Now.ToString() %>
                    <br />
                    My OnDemandMode is &#39;Once&#39;
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="TabPanel2" runat="server" HeaderText="TabPanel2" OnDemandMode="Always">
                <ContentTemplate>
                    I'm tab 2, I was rendered at <%: DateTime.Now.ToString() %>
                    <br />
                    <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
                    <asp:CheckBox ID="CheckBox1" runat="server" />
                    <br />
                    My OnDemandMode is &#39;Always&#39;
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="TabPanel3" runat="server" HeaderText="TabPanel3" OnDemandMode="None">
                <ContentTemplate>
                    I'm tab 3, I was rendered at <%: DateTime.Now.ToString() %>
                    <br />
                    My OnDemandMode is &#39;None&#39;
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="TabPanel4" runat="server" HeaderText="TabPanel4" OnDemandMode="Once">
                <ContentTemplate>
                    Hey, I&#39;m should loaded only for once too! as tab1<br />
                    I was rendered at <%: DateTime.Now.ToString() %>
                </ContentTemplate>
            </act:TabPanel>
        </act:TabContainer>    
        <br />
        Defaults state of OnDemand=True<br />
        <act:TabContainer ID="TabContainer2" runat="server" ActiveTabIndex="0" 
            Height="141px" Width="338px" ondemand="True">
            <act:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel1a">
                <ContentTemplate>
                    I was rendered at <%: DateTime.Now.ToString() %>
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="TabPanel2a" runat="server" HeaderText="TabPanel2a">
                <ContentTemplate>
                    I was rendered at <%: DateTime.Now.ToString() %>
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel ID="TabPanel3a" runat="server" HeaderText="TabPanel3a">
                <ContentTemplate>
                    I was rendered at <%: DateTime.Now.ToString() %>
                </ContentTemplate>
            </act:TabPanel>
        </act:TabContainer>
        <br />
    </div>
    </form>
</body>
</html>
