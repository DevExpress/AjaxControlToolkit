<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Example1.ascx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._25193.UserControls.Example1" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="cc1" %>
<cc1:TabContainer ID="TabContainer1" runat="server" ActiveTabIndex="0">
    <cc1:TabPanel ID="TabPanel1" runat="server" HeaderText="TabPanel1">
        <ContentTemplate>
            a</ContentTemplate>
    </cc1:TabPanel>
    <cc1:TabPanel ID="TabPanel2" runat="server" HeaderText="TabPanel2">
        <ContentTemplate>
            b</ContentTemplate>
    </cc1:TabPanel>
    <cc1:TabPanel ID="TabPanel3" runat="server" HeaderText="TabPanel3">
        <ContentTemplate>
            c</ContentTemplate>
    </cc1:TabPanel>
</cc1:TabContainer>
