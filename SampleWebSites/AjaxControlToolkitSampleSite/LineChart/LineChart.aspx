<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true"
    CodeFile="LineChart.aspx.cs" Inherits="LineChart_LineChart" Title="LineChart Sample"
    Culture="auto" UICulture="auto" 
    Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />    
    <div class="demoarea">
        <div class="demoheading">
            LineChart Demonstration</div>
        <br />        
        <ajaxToolkit:LineChart ID="LineChart1" runat="server" ChartHeight="300" ChartWidth="450" ChartTitle="Test Title" CategoriesAxis="1999,2000,2001,2002,2003,2004" ChartType="Stacked"
         ChartTitleColor="red" CategoryAxisLineColor="red" ValueAxisLineColor="blue" BaseLineColor="green">
        <Series>
            <ajaxToolkit:LineChartSeries Name="World" LineColor="purple" Data="90, 235, 75, 115, 84, 101" />                
            <ajaxToolkit:LineChartSeries Name="United States"  LineColor="green" Data="50.45, 15.15, -11.12, 13.5, 10.05, 11.0" />                
        </Series>
        </ajaxToolkit:LineChart>
        <br />        
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            LineChart Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            LineChart control creates the line charts with the specified values. Chart control 
            uses SVG to draw the charts so these are compatible with all latest browsers and 
            multiple plateforms. User can take the advantage of LineChart control to display 
            information in more representative way.
        </p>
            <br />
        <p>
            LineCharts are of two types - Basic, Stacked.
        </p>
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            LineChart Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <p>
            The control above is initialized with this code. The <em>italic</em> properties
            are optional:</p>
        <pre>
&lt;ajaxToolkit:LineChart ID="Chart1" runat="server" 
<em>ChartHeight</em>="300" <em>
ChartWidth</em>="450" <em>
ChartTitle</em>=&quot;Test Title&quot; 
CategoriesAxis=&quot;1999,2000,2001,2002,2003,2004&quot;
ChartType=&quot;Stacked&quot; <em>
TitleColor</em>="red" <em>
CategoryAxisLineColor</em>="red" <em>
ValueAxisLineColor</em>="blue" <em>
BaseLineColor</em>=&quot;green&quot; &gt;
&lt;Series&gt;
&lt;ajaxToolkit:LineChartSeries Name=&quot;World&quot; <em>LineColor</em>=&quot;purple&quot; &gt;
&lt;DataValues&gt;
    &lt;ajaxToolkit:DataValue Data=&quot;90&quot; /&gt;
    &lt;ajaxToolkit:DataValue Data=&quot;235&quot; /&gt;
    &lt;ajaxToolkit:DataValue Data=&quot;75&quot; /&gt;
    &lt;ajaxToolkit:DataValue Data=&quot;115&quot; /&gt;
    &lt;ajaxToolkit:DataValue Data=&quot;84&quot; /&gt;
    &lt;ajaxToolkit:DataValue Data=&quot;-101&quot; /&gt;
&lt;/DataValues&gt;
&lt;/ajaxToolkit:LineChartSeries&gt;
&lt;ajaxToolkit:LineChartSeries Name=&quot;United States&quot;  <em>LineColor</em>="green" &gt;
&lt;DataValues&gt;
    &lt;ajaxToolkit:DataValue Data="50.45" /&gt;
    &lt;ajaxToolkit:DataValue Data="15.15" /&gt;
    &lt;ajaxToolkit:DataValue Data="11.12" /&gt;
    &lt;ajaxToolkit:DataValue Data="13.5" /&gt;
    &lt;ajaxToolkit:DataValue Data="10.05" /&gt;
    &lt;ajaxToolkit:DataValue Data="11.0" /&gt;
&lt;/DataValues&gt;
&lt;/ajaxToolkit:LineChartSeries&gt;
&lt;/Series&gt;
&lt;/ajaxToolkit:LineChart&gt;
    </pre>                
        <b>Properties</b>
        <ul>
            <li><strong>ChartHeight</strong> - This property enables you to customize the height of chart.</li>
            <li><strong>ChartWidth</strong> - This property enables you to customize the width of chart.</li>
            <li><strong>ChartTitle</strong> - This property enables you to set the title of chart.</li>
            <li><strong>CategoryAxis</strong> - This is required property and you need to set the values
            for category axis to create the line chart.</li>
            <li><strong>ChartType</strong> - This property enables you to create type of linechart. 
            You can set two types of ChartTypes - 1. Basic 2. Stacked.</li>
            <li><strong>TitleColor</strong> - This enables you to set the font color of title of
            chart.</li>
            <li><strong>CategoryAxisLineColor</strong> - This enables you to set the color of background lines 
            of category axis of chart.</li>
            <li><strong>ValueAxisLineColor</strong> - This enables you to set the color of background lines 
            of value axis of chart.</li>            
            <li><strong>BaseLineColor</strong> - This enables you to set the color of base lines of chart.</li>
            <li><strong>Name</strong> - This is required and you need to provide the name of series.</li>
            <li><strong>LineColor</strong> - This enables you to set the color of line and dot for 
            the series.</li>
            <li><strong>Theme</strong> - This enables you to set the theme of the chart. By default a theme
            is provided with control and default value is set from the theme if you does not set a 
            property provided for formatting.
            </li>
        </ul>
        <br />        
    </asp:Panel>
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" />
</asp:Content>