<%@ Page Title="PieChart Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="PieChart.aspx.cs" Inherits="PieChart_PieChart" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    PieChart Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <br />
    <ajaxToolkit:PieChart ID="pieChart1" runat="server" ChartHeight="300" ChartWidth="450"
        ChartTitle="Widget Production in the world %" ChartTitleColor="#0E426C">
        <PieChartValues>
            <ajaxToolkit:PieChartValue Category="United States" Data="30" PieChartValueColor="#0E426C" />
            <ajaxToolkit:PieChartValue Category="India" Data="5" PieChartValueColor="#D08AD9" />
            <ajaxToolkit:PieChartValue Category="France" Data="8" PieChartValueColor="#B85B3E" />
            <ajaxToolkit:PieChartValue Category="Germany" Data="9" PieChartValueColor="#FFC652" />
            <ajaxToolkit:PieChartValue Category="United Kingdom" Data="22" PieChartValueColor="#6586A7" />
            <ajaxToolkit:PieChartValue Category="Australia" Data="18" PieChartValueColor="#669900" />
            <ajaxToolkit:PieChartValue Category="Russia" Data="8" PieChartValueColor="#4508A2" />
        </PieChartValues>
    </ajaxToolkit:PieChart>
    <br />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>PieChart Description</Header>
        <Content>
            <div runat="server" data-control-type="PieChart" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>PieChart Properties</Header>
        <Content>
            <div runat="server" data-control-type="PieChart" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>

