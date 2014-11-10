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
            <p>
                The BubbleChart control enables you to render a bubble chart from one or more series
                of values. This control is compatible with any browser which supports SVG including
                Internet Explorer 9 and above.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>BubbleChart Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties are optional:
            </p>
            <pre>
&lt;ajaxToolkit:BubbleChart ID=&quot;BubbleChart1&quot; runat=&quot;server&quot; 
<em>ChartHeight</em>=&quot;300&quot; <em>ChartWidth</em>=&quot;450&quot; 
<em>ChartTitle</em>=&quot;Industry share in Market&quot; 
<em>ChartTitleColor</em>=&quot;#0E426C&quot; <em>XAxisLineColor</em>=&quot;#D08AD9&quot; 
<em>YAxisLineColor</em>=&quot;#D08AD9&quot; <em>BaseLineColor</em>=&quot;#A156AB&quot; 
<em>YAxisLines</em>=&quot;6&quot; <em>XAxisLines</em>=&quot;6&quot; <em>BubbleSizes</em>=&quot;5&quot;
<em>XAxisLabel</em>=&quot;Market share of Industry&quot; 
<em>YAxisLabel</em>=&quot;Revenue of Industry&quot; <em>BubbleLabel</em>=&quot; (Growth in %)&quot;&gt;
&lt;BubbleChartValues&gt;
    &lt;ajaxToolkit:BubbleChartValue Category=&quot;Software&quot; 
    X=&quot;25&quot; Y=&quot;90000&quot; Data=&quot;7&quot; <em>BubbleColor</em>=&quot;#6C1E83&quot; /&gt;
    &lt;ajaxToolkit:BubbleChartValue Category=&quot;Foods&quot; 
    X=&quot;35&quot; Y=&quot;150000&quot; Data=&quot;5&quot; <em>BubbleColor</em>=&quot;#D08AD9&quot; /&gt;
    &lt;ajaxToolkit:BubbleChartValue Category=&quot;Health&quot; 
    X=&quot;32&quot; Y=&quot;140000&quot; Data=&quot;6&quot; <em>BubbleColor</em>=&quot;#990033&quot; /&gt;
    &lt;ajaxToolkit:BubbleChartValue Category=&quot;Manufacuring&quot; 
    X=&quot;22&quot; Y=&quot;84000&quot; Data=&quot;4&quot; <em>BubbleColor</em>=&quot;#6586A7&quot; /&gt;
    &lt;ajaxToolkit:BubbleChartValue Category=&quot;Travel&quot; 
    X=&quot;8&quot; Y=&quot;26000&quot; Data=&quot;7&quot; <em>BubbleColor</em>=&quot;#0E426C&quot; /&gt;
    &lt;ajaxToolkit:BubbleChartValue Category=&quot;Entertainment&quot; 
    X=&quot;28&quot; Y=&quot;97000&quot; Data=&quot;9&quot; <em>BubbleColor</em>=&quot;#A156AB&quot; /&gt;
    &lt;ajaxToolkit:BubbleChartValue Category=&quot;Construction&quot; 
    X=&quot;15&quot; Y=&quot;58000&quot; Data=&quot;5&quot; <em>BubbleColor</em>=&quot;#A156AB&quot; /&gt;
&lt;/BubbleChartValues&gt;
&lt;/ajaxToolkit:BubbleChart&gt;
        </pre>
            <b>Properties</b>
            <ul>
                <li><strong>ChartHeight</strong> - This property enables you to customize the height of the the chart.</li>
                <li><strong>ChartWidth</strong> - This property enables you to customize the width of the chart.</li>
                <li><strong>ChartTitle</strong> - This property enables you to set the title of the chart.</li>
                <li><strong>Theme</strong> - This property enables you to control the appearance of the bar chart with a Cascading Style Sheet file.</li>
                <li><strong>ChartTitleColor</strong> - This property enables you to set the font color of the chart title.</li>
                <li><strong>xAxisLineColor</strong> - This property enables you to set the color of the X axis lines of the chart.</li>
                <li><strong>YAxisLineColor</strong> - This property enables you to set the color of the Y axis lines of the chart.</li>
                <li><strong>BaseLineColor</strong> - This property enables you to set the color of the base lines of the chart.</li>
                <li><strong>YAxisLines</strong> - This property enables you to set the interval size for the Y axis line of the chart.</li>
                <li><strong>XAxisLines</strong> - This property enables you to set the interval size for the X axis line of the chart.</li>
                <li><strong>BubbleSizes</strong> - This property enables you to set the number of different sizes of the bubbles.</li>
                <li><strong>TooltipBackgroundColor</strong> - This property enables you to set the background color of the tooltip box.</li>
                <li><strong>TooltipFontColor</strong> - This property enables you to set the font color of the tooltip box.</li>
                <li><strong>TooltipBorderColor</strong> - This property enables you to set the border color of the tooltip box.</li>
                <li><strong>XAxisLabel</strong> - This property enables you to set the text/label to describe what data is at XAxis.</li>
                <li><strong>YAxisLabel</strong> - This property enables you to set the text/label to describe what data is at YAxis.</li>
                <li><strong>BubbleLabel</strong> - This property enables you to set the text/label that will be shown in the tooltip and describe about bubble value.</li>
            </ul>
            <br />
            <strong>BubbleChartValue properties:</strong>
            <ul>
                <li><strong>Category</strong> - This property is required.</li>
                <li><strong>X</strong> - This is required and provides X value for a particular BubbleChartValue.</li>
                <li><strong>Y</strong> - This is required and provides Y value for a particular BubbleChartValue.</li>
                <li><strong>Data</strong> - This is required and provides Data value for a particular BubbleChartValue.</li>
                <li><strong>BubbleColor</strong> - This property enables you to set the color of the bubble for a particular BubbleChartValue.</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>

