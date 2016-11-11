<%@ Page Title="BarChart Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="BarChart.aspx.cs" Inherits="BarChart_BarChart" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    BarChart Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <br />
    <strong>Column Chart:</strong>
    <br />
    <ajaxToolkit:BarChart ID="BarChart1" runat="server" ChartHeight="300" ChartWidth="450"
        ChartTitle="United States versus European Widget Production" CategoriesAxis="2007,2008,2009,2010,2011,2012"
        ChartType="Column" ChartTitleColor="#0E426C" CategoryAxisLineColor="#D08AD9"
        ValueAxisLineColor="#D08AD9" BaseLineColor="#A156AB">
        <series>
            <ajaxToolkit:BarChartSeries Name="United States" BarColor="#6C1E83" Data="110, 189, 255, 95, 107, 140" />
            <ajaxToolkit:BarChartSeries Name="Europe"  BarColor="#D08AD9" Data="49, 77, 95, 68, 70, 79" />
        </series>
    </ajaxToolkit:BarChart>
    <br />
    <strong>StackedColumn Chart:</strong>
    <br />
    <ajaxToolkit:BarChart ID="BarChart2" runat="server" ChartHeight="300" ChartWidth="450"
        ChartTitle="United States versus European Widget Production" CategoriesAxis="2007,2008,2009,2010,2011,2012"
        ChartType="StackedColumn" ChartTitleColor="#0E426C" CategoryAxisLineColor="#D08AD9"
        ValueAxisLineColor="#D08AD9" BaseLineColor="#A156AB">
        <series>
            <ajaxToolkit:BarChartSeries Name="United States" BarColor="#6C1E83" Data="110, 189, 255, 95, 107, 140" />
            <ajaxToolkit:BarChartSeries Name="Europe"  BarColor="#D08AD9" Data="49, 77, 95, 68, 70, 79" />
        </series>
    </ajaxToolkit:BarChart>
    <br />
    <strong>Bar Chart:</strong>
    <br />
    <ajaxToolkit:BarChart ID="BarChart3" runat="server" ChartHeight="300" ChartWidth="450"
        ChartTitle="United States versus European Widget Production" CategoriesAxis="2007,2008,2009,2010,2011,2012"
        ChartType="Bar" ChartTitleColor="#0E426C" CategoryAxisLineColor="#D08AD9" ValueAxisLineColor="#D08AD9"
        BaseLineColor="#A156AB">
        <series>
            <ajaxToolkit:BarChartSeries Name="United States" BarColor="#6C1E83" Data="110, 189, 255, 95, 107, 140" />
            <ajaxToolkit:BarChartSeries Name="Europe"  BarColor="#D08AD9" Data="49, 77, 95, 68, 70, 79" />
        </series>
    </ajaxToolkit:BarChart>
    <br />
    <strong>StackedBar Chart:</strong>
    <br />
    <ajaxToolkit:BarChart ID="BarChart4" runat="server" ChartHeight="300" ChartWidth="450"
        ChartTitle="United States versus European Widget Production" CategoriesAxis="2007,2008,2009,2010,2011,2012"
        ChartType="StackedBar" ChartTitleColor="#0E426C" CategoryAxisLineColor="#D08AD9"
        ValueAxisLineColor="#D08AD9" BaseLineColor="#A156AB">
        <series>
            <ajaxToolkit:BarChartSeries Name="United States" BarColor="#6C1E83" Data="110, 189, 255, 95, 107, 140" />
            <ajaxToolkit:BarChartSeries Name="Europe"  BarColor="#D08AD9" Data="49, 77, 95, 68, 70, 79" />
        </series>
    </ajaxToolkit:BarChart>
    <br />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>BarChart Description</Header>
        <Content>
            <div runat="server" data-control-type="BarChart" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>BarChart Properties</Header>
        <Content>
            <div runat="server" data-control-type="BarChart" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>

