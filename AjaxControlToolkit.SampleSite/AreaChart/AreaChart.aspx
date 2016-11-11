<%@ Page Title="AreaChart Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="AreaChart.aspx.cs" Inherits="AreaChart_AreaChart" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    AreaChart Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <strong>Basic Type:</strong>
    <br />
    <ajaxToolkit:AreaChart ID="AreaChart1" runat="server" ChartHeight="300" ChartWidth="450"
        ChartTitle="United States versus European Widget Production" CategoriesAxis="2007,2008,2009,2010,2011,2012"
        ChartType="Basic" ChartTitleColor="#0E426C" CategoryAxisLineColor="#D08AD9" ValueAxisLineColor="#D08AD9"
        BaseLineColor="#A156AB">
        <series>
            <ajaxToolkit:AreaChartSeries Name="United States" AreaColor="#6C1E83" Data="110, 189, 255, 95, 107, 140" />
            <ajaxToolkit:AreaChartSeries Name="Europe" AreaColor="#669900" Data="49, 77, 95, 68, 70, 79" />
        </series>
    </ajaxToolkit:AreaChart>
    <br />
    <strong>Stacked Type:</strong>
    <br />
    <ajaxToolkit:AreaChart ID="AreaChart2" runat="server" ChartHeight="300" ChartWidth="450"
        ChartTitle="United States versus European Widget Production" CategoriesAxis="2007,2008,2009,2010,2011,2012"
        ChartType="Stacked" ChartTitleColor="#0E426C" CategoryAxisLineColor="#D08AD9"
        ValueAxisLineColor="#D08AD9" BaseLineColor="#A156AB">
        <series>
            <ajaxToolkit:AreaChartSeries Name="United States" AreaColor="#6C1E83" Data="110, 189, 255, 95, 107, 140" />
            <ajaxToolkit:AreaChartSeries Name="Europe" AreaColor="#D08AD9" Data="49, 77, 95, 68, 70, 79" />
        </series>
    </ajaxToolkit:AreaChart>
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>AreaChart Description</Header>
        <Content>
            <div runat="server" data-control-type="AreaChart" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>AreaChart Properties</Header>
        <Content>
            <div runat="server" data-control-type="AreaChart" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>

