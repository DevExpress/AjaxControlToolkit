<%@ Page Title="PieChart Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="PieChart.aspx.cs" Inherits="PieChart_PieChart" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    PieChart Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <br />
    <ajaxToolkit:PieChart 
        ID="pieChart1" 
        runat="server" 
        ChartHeight="300" 
        ChartWidth="450"
        ChartTitle="Widget Production in the world %" 
        ChartTitleColor="#0E426C">
        <PieChartValues>
            <ajaxToolkit:PieChartValue Category="United States"
                Data="30" PieChartValueColor="#0E426C" />
            <ajaxToolkit:PieChartValue Category="India"
                Data="5" PieChartValueColor="#D08AD9" />
            <ajaxToolkit:PieChartValue Category="France"
                Data="8" PieChartValueColor="#B85B3E" />
            <ajaxToolkit:PieChartValue Category="Germany" 
                Data="9" PieChartValueColor="#FFC652" />
            <ajaxToolkit:PieChartValue Category="United Kingdom" 
                Data="22" PieChartValueColor="#6586A7" />
            <ajaxToolkit:PieChartValue Category="Australia" 
                Data="18" PieChartValueColor="#669900" />
            <ajaxToolkit:PieChartValue Category="Russia" 
                Data="8" PieChartValueColor="#4508A2" />
        </PieChartValues>
    </ajaxToolkit:PieChart>
    <br />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>PieChart Description</Header>
        <Content>
            <p>
                The PieChart control enables you to render a pie chart from one or more PieChartValues.
                This control is compatible with any browser which supports SVG including Internet
                Explorer 9 and above.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" ID="codeInfoBlock">
        <Header>PieChart Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code.
            </p>
            <div runat="server" id="codeBlock" />
            <strong>PieChart Properties</strong>
            <ul>
                <li><strong>ChartHeight</strong> - This property enables you to customize the height of the chart.</li>
                <li><strong>ChartWidth</strong> - This property enables you to customize the width of the chart.</li>
                <li><strong>ChartTitle</strong> - This property enables you to set the title of the chart.</li>
                <li><strong>ChartTitleColor</strong> - This property enables you to set the font color of the chart title.</li>
            </ul>
            <br />
            <strong>PieChartValue Properties:</strong>
            <ul>
                <li><strong>Category</strong> - This property is required and provides name for a particular PieChartValue.</li>
                <li><strong>Data</strong> - This property is required and provides Data for a particular PieChartValue.</li>
                <li><strong>PieChartValueColor</strong> - This property enables you to set the color of segment for a particular PieChartValue.</li>
                <li><strong>PieChartValueStrokeColor</strong> - This property enables you to set the stroke color of segment for a particular PieChartValue.</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>

