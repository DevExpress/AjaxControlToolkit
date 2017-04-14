<%@ Page Title="BubbleChart Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="BubbleChart.aspx.cs" Inherits="BubbleChart_BubbleChart" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    BubbleChart Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <br />
    <ajaxToolkit:BubbleChart ID="BubbleChart1" runat="server" ChartHeight="300" ChartWidth="450"
        ChartTitle="Industry Share in Market and Growth" ChartTitleColor="#0E426C" XAxisLineColor="#D08AD9"
        YAxisLineColor="#D08AD9" BaseLineColor="#A156AB" YAxisLines="6" XAxisLines="6"
        BubbleSizes="5" XAxisLabel="Market share of Industry" YAxisLabel="Revenue of Industry" BubbleLabel=" (Growth in %)">
        <bubblechartvalues>
            <ajaxToolkit:BubbleChartValue Category="Software" X="0" Y="90000" Data="7" BubbleColor="#6C1E83" />
            <ajaxToolkit:BubbleChartValue Category="Foods" X="35" Y="150000" Data="5" BubbleColor="#D08AD9" />
            <ajaxToolkit:BubbleChartValue Category="Health" X="32" Y="140000" Data="6" BubbleColor="#6586A7" />
            <ajaxToolkit:BubbleChartValue Category="Manufacturing" X="22" Y="84000" Data="4" BubbleColor="#0E426C" />
            <ajaxToolkit:BubbleChartValue Category="Travel" X="8" Y="26000" Data="7" BubbleColor="#A156AB" />
            <ajaxToolkit:BubbleChartValue Category="Entertainment" X="28" Y="97000" Data="9" BubbleColor="#990033" />
            <ajaxToolkit:BubbleChartValue Category="Construction" X="15" Y="58000" Data="5" BubbleColor="#669900" />
        </bubblechartvalues>
    </ajaxToolkit:BubbleChart>
    <br />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>BubbleChart Description</Header>
        <Content>
            <div runat="server" data-control-type="BubbleChart" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>BubbleChart Properties</Header>
        <Content>
            <div runat="server" data-control-type="BubbleChart" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>

