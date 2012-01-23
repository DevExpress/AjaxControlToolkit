<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="WebUserControl1.ascx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._26746.WebUserControl1" %>
<asp:Button ID="Button1" runat="server" Text="Button" />
<act:ToolkitScriptManager ID="tsmgr" runat="server">
</act:ToolkitScriptManager>
<act:TabContainer ID="container1" runat="server" AutoPostBack="true" ActiveTabIndex="1"
    OnActiveTabChanged="Tabs_ActiveTabChanged">
    <act:TabPanel ID="panel1" HeaderText="Tab1" runat="server">
        <HeaderTemplate>
            Tab1
        </HeaderTemplate>
        <ContentTemplate>
            Content1
        </ContentTemplate>
    </act:TabPanel>
    <act:TabPanel ID="panel2" HeaderText="Tab2" runat="server">
        <HeaderTemplate>
            Tab2
        </HeaderTemplate>
        <ContentTemplate>
            Content2
        </ContentTemplate>
    </act:TabPanel>
    <act:TabPanel ID="TabPanel1" HeaderText="Tab2" runat="server">
        <HeaderTemplate>
            Tab3
        </HeaderTemplate>
        <ContentTemplate>
            Content3
        </ContentTemplate>
    </act:TabPanel>
    <act:TabPanel ID="TabPanel2" HeaderText="Tab2" runat="server">
        <HeaderTemplate>
            Tab4
        </HeaderTemplate>
        <ContentTemplate>
            Content4
        </ContentTemplate>
    </act:TabPanel>
</act:TabContainer>
<div>
    Current Tab:
    <asp:Label runat="server" ID="tab1" /><br />
</div>
<%--<asp:UpdatePanel ID="UpdatePanel1" runat="server">
    <Triggers>
        <asp:AsyncPostBackTrigger ControlID="container1" EventName="ActiveTabChanged" />
    </Triggers>
</asp:UpdatePanel>--%>
<asp:Button ID="btn1" runat="server" OnClick="Button_Click" />
<asp:TextBox ID="txt1" runat="server"></asp:TextBox>