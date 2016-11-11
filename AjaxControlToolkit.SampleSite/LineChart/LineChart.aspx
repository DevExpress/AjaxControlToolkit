<%@ Page Title="LineChart Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="LineChart.aspx.cs" Inherits="LineChart_LineChart" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    LineChart Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <br />
    <strong>Basic Type:</strong>
    <ajaxToolkit:LineChart ID="LineChart1" runat="server" ChartHeight="300" ChartWidth="450"
        ChartTitle="United States versus European Widget Production" CategoriesAxis="2007,2008,2009,2010,2011,2012"
        ChartType="Basic" ChartTitleColor="#0E426C" CategoryAxisLineColor="#D08AD9" ValueAxisLineColor="#D08AD9"
        BaseLineColor="#A156AB" AreaDataLabel=" thousands">
        <series>
            <ajaxToolkit:LineChartSeries Name="United States" LineColor="#6C1E83" Data="110, 189, 255, 95, 107, 140" />
            <ajaxToolkit:LineChartSeries Name="Europe" LineColor="#D08AD9" Data="49, 77, 95, 68, 70, 79" />                
        </series>
    </ajaxToolkit:LineChart>
    <br />
    <strong>Stacked Type:</strong>
    <ajaxToolkit:LineChart ID="LineChart2" runat="server" ChartHeight="300" ChartWidth="450"
        ChartTitle="United States versus European Widget Production" CategoriesAxis="2007,2008,2009,2010,2011,2012"
        ChartType="Stacked" ChartTitleColor="#0E426C" CategoryAxisLineColor="#D08AD9"
        ValueAxisLineColor="#D08AD9" BaseLineColor="#A156AB" AreaDataLabel=" thousands">
        <series>
            <ajaxToolkit:LineChartSeries Name="United States" LineColor="#6C1E83" Data="110, 189, 255, 95, 107, 140" />
            <ajaxToolkit:LineChartSeries Name="Europe" LineColor="#D08AD9" Data="49, 77, 95, 68, 70, 79" />
        </series>
    </ajaxToolkit:LineChart>
    <br />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>LineChart Description</Header>
        <Content>
            <div runat="server" data-control-type="LineChart" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>LineChart Properties</Header>
        <Content>
            <div runat="server" data-control-type="LineChart" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
