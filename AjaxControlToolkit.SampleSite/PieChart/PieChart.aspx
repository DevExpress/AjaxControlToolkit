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
            <p>
                The PieChart control enables you to render a pie chart from one or more PieChartValues.
                This control is compatible with any browser which supports SVG including Internet
                Explorer 9 and above.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>PieChart Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties are optional:
            </p>
            <pre>
&lt;ajaxToolkit:PieChart ID=&quot;pieChart1&quot; runat=&quot;server&quot; <em>ChartHeight</em>=&quot;300&quot; 
<em>ChartWidth</em>=&quot;450&quot; <em>ChartTitle</em>=&quot;Widget Production in the world&quot; 
<em>ChartTitleColor</em>=&quot;#0E426C&quot;&gt; 
&lt;PieChartValues&gt;
    &lt;ajaxToolkit:PieChartValue Category=&quot;United States&quot; Data=&quot;45&quot; 
    <em>PieChartValueColor</em>=&quot;#6C1E83&quot; <em>PieChartValueStrokeColor</em>=&quot;black&quot; /&gt;
    &lt;ajaxToolkit:PieChartValue Category=&quot;Europe&quot; Data=&quot;25&quot; 
    <em>PieChartValueColor</em>=&quot;#D08AD9&quot; <em>PieChartValueStrokeColor</em>=&quot;black&quot; /&gt;
    &lt;ajaxToolkit:PieChartValue Category=&quot;Asia&quot; Data=&quot;17&quot; 
    <em>PieChartValueColor</em>=&quot;#6586A7&quot; <em>PieChartValueStrokeColor</em>=&quot;black&quot; /&gt;
    &lt;ajaxToolkit:PieChartValue Category=&quot;Australia&quot; Data=&quot;13&quot; 
    <em>PieChartValueColor</em>=&quot;#0E426C&quot; <em>PieChartValueStrokeColor</em>=&quot;black&quot; /&gt;
&lt;/PieChartValues&gt;
&lt;/ajaxToolkit:PieChart &gt;
        </pre>
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

