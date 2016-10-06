<%@ Page Title="BarChart Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="BarChart.aspx.cs" Inherits="BarChart_BarChart" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    BarChart Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <br />
    <strong>Column Chart:</strong>
    <br />
    <ajaxToolkit:BarChart
        ID="BarChart1" 
        runat="server" 
        ChartHeight="300" 
        ChartWidth="450"
        ChartTitle="United States versus European Widget Production" 
        CategoriesAxis="2007,2008,2009,2010,2011,2012"
        ChartType="Column" 
        ChartTitleColor="#0E426C" 
        CategoryAxisLineColor="#D08AD9"
        ValueAxisLineColor="#D08AD9" 
        BaseLineColor="#A156AB">
        <series>
            <ajaxToolkit:BarChartSeries 
                Name="United States" 
                BarColor="#6C1E83" 
                Data="110, 189, 255, 95, 107, 140" />
            <ajaxToolkit:BarChartSeries 
                Name="Europe"
                BarColor="#D08AD9" 
                Data="49, 77, 95, 68, 70, 79" />
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
            <p>
                The BarChart control enables you to render a bar chart from one or more series of
                values. This control is compatible with any browser which supports SVG including
                Internet Explorer 9 and above.
            </p>
            <br />
            <p>
                This control can display four types of BarCharts: Column, StackedColumn, Bar and StackedBar.
            </p>
            <br />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" ID="codeInfoBlock">
        <Header>BarChart Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code.
            </p>
            <div runat="server" id="codeBlock" />
            <br />
            <strong>BarChart Properties</strong>
            <ul>
                <li><strong>ChartHeight</strong> - This property enables you to customize the height of the chart.</li>
                <li><strong>ChartWidth</strong> - This property enables you to customize the width of the chart.</li>
                <li><strong>ChartTitle</strong> - This property enables you to set the title of the chart.</li>
                <li><strong>CategoryAxis</strong> - This is a required property. You need to provide a set of values for the category axis to create a bar chart.</li>
                <li><strong>ChartType</strong> - This property enables you to render different types of bar charts including Column, StackedColumn, Bar, and StackedBar.</li>
                <li><strong>Theme</strong> - This property enables you to control the appearance of the bar chart with a Cascading Style Sheet file.</li>
                <li><strong>ValueAxisLines</strong> - This property enables you to set the interval size for the value axis line.</li>
                <li><strong>ChartTitleColor</strong> - This property enables you to set the font color of the chart title.</li>
                <li><strong>CategoryAxisLineColor</strong> - This property enables you to set the color of the category axis lines.</li>
                <li><strong>ValueAxisLineColor</strong> - This property enables you to set the the color of the value axis lines.</li>
                <li><strong>BaseLineColor</strong> - This property enables you to set the color of the base lines of the chart.</li>
            </ul>
            <br />
            <strong>BarChartSeries Properties:</strong>
            <ul>
                <li><strong>Name</strong> - This property is required.</li>
                <li><strong>Data</strong> - This property is required and provides data for a particular series.</li>
                <li><strong>BarColor</strong> - This property enables you to set the color of bar for a particular series.</li>
            </ul>
            <br />
        </Content>
    </samples:InfoBlock>
</asp:Content>

