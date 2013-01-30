<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true"
    CodeFile="BarChart.aspx.cs" Inherits="BarChart_BarChart" Title="BarChart Sample"
    Culture="auto" UICulture="auto" 
    Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />    
    <div class="demoarea">
        <div class="demoheading">
            BarChart Demonstration</div>        
        <br />        
        <ajaxToolkit:BarChart ID="Chart1" runat="server" ChartHeight="300" ChartWidth="450" ChartTitle="Test Title" CategoriesAxis="2007,2008,2009,20010,20011,20012"
        ChartType="Column" TitleColor="red" CategoryAxisLineColor="red" ValueAxisLineColor="blue" BaseLineColor="green">
        <Series>
            <ajaxToolkit:BarChartSeries Name="World" BarColor="Pink" >
                <DataValues>
                    <ajaxToolkit:DataValue Data="110" />
                    <ajaxToolkit:DataValue Data="189" />
                    <ajaxToolkit:DataValue Data="255" />
                    <ajaxToolkit:DataValue Data="95" />
                    <ajaxToolkit:DataValue Data="107" />
                    <ajaxToolkit:DataValue Data="140" />
                </DataValues>
            </ajaxToolkit:BarChartSeries>
            <ajaxToolkit:BarChartSeries Name="United States"  BarColor="Yellow" >
                <DataValues>
                    <ajaxToolkit:DataValue Data="49" />
                    <ajaxToolkit:DataValue Data="77" />
                    <ajaxToolkit:DataValue Data="95" />
                    <ajaxToolkit:DataValue Data="68" />
                    <ajaxToolkit:DataValue Data="70" />
                    <ajaxToolkit:DataValue Data="79" />
                </DataValues>
            </ajaxToolkit:BarChartSeries>
        </Series>
        </ajaxToolkit:BarChart>
        <br />        
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            BarChart Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            BarChart control creates the bar charts with the specified values. Chart control 
            uses SVG to draw the charts so these are compatible with all latest browsers and 
            multiple plateforms. User can take the advantage of BarChart control to display 
            information in more representative way.
        </p>   
            <br />
        <p>
            BarCharts are of four types - Column, StackedColumn, Bar and StackedBar.
        </p>
            <br />        
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            BarChart Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <p>
            The control above is initialized with this code. The <em>italic</em> properties
            are optional:</p>
        <pre>
&lt;ajaxToolkit:BarChart ID="Chart1" runat="server" 
<em>ChartHeight</em>="300" <em>
ChartWidth</em>="450" <em>
ChartTitle</em>=&quot;Test Title&quot; 
CategoriesAxis=&quot;2007,2008,2009,20010,20011,20012&quot;
ChartType=&quot;StackedBar&quot; <em>
TitleColor</em>="red" <em>
CategoryAxisLineColor</em>="red" <em>
ValueAxisLineColor</em>="blue" <em>
BaseLineColor</em>=&quot;green&quot; &gt;
&lt;Series&gt;
&lt;ajaxToolkit:BarChartSeries Name=&quot;World&quot; <em>BarColor</em>=&quot;pink&quot; &gt;
&lt;DataValues&gt;
    &lt;ajaxToolkit:DataValue Data=&quot;110&quot; /&gt;
    &lt;ajaxToolkit:DataValue Data=&quot;189&quot; /&gt;
    &lt;ajaxToolkit:DataValue Data=&quot;255&quot; /&gt;
    &lt;ajaxToolkit:DataValue Data=&quot;95&quot; /&gt;
    &lt;ajaxToolkit:DataValue Data=&quot;107&quot; /&gt;
    &lt;ajaxToolkit:DataValue Data=&quot;140&quot; /&gt;
&lt;/DataValues&gt;
&lt;/ajaxToolkit:BarChartSeries&gt;
&lt;ajaxToolkit:BarChartSeries Name=&quot;United States&quot;  <em>BarColor</em>="yellow" &gt;
&lt;DataValues&gt;
    &lt;ajaxToolkit:DataValue Data="49" /&gt;
    &lt;ajaxToolkit:DataValue Data="77" /&gt;
    &lt;ajaxToolkit:DataValue Data="95" /&gt;
    &lt;ajaxToolkit:DataValue Data="68" /&gt;
    &lt;ajaxToolkit:DataValue Data="70" /&gt;
    &lt;ajaxToolkit:DataValue Data="79" /&gt;
&lt;/DataValues&gt;
&lt;/ajaxToolkit:BarChartSeries&gt;
&lt;/Series&gt;
&lt;/ajaxToolkit:BarChart&gt;
    </pre>
        <br />
        <b>Properties</b>
        <ul>
            <li><strong>ChartHeight</strong> - This property enables you to customize the height of the chart.</li>
            <li><strong>ChartWidth</strong> - This property enables you to customize the width of the chart.</li>
            <li><strong>ChartTitle</strong> - This property enables you to set the title of the chart.</li>
            <li><strong>CategoryAxis</strong> - This is required property and you need to set the values
            for category axis to create the bar chart.</li>
            <li><strong>ChartType</strong> - This property enables you to create type of the barchart.</li>
            <li><strong>Theme</strong> - This property enables you to set formatting of the chart through
            the css file.</li>
            <li><strong>ValueAxisLines</strong> - This property enables you to set number of intervals on
            value axis line.</li>
            <li><strong>TitleColor</strong> - This enables you to set the font color of title of the
            chart.</li>
            <li><strong>CategoryAxisLineColor</strong> - This enables you to set the color of background lines 
            of category axis of the chart.</li>
            <li><strong>ValueAxisLineColor</strong> - This enables you to set the color of background lines 
            of value axis of the chart.</li>
            <li><strong>CategoryAxisLineColor</strong> - This enables you to set the color of background lines 
            of category axis of the chart.</li>
            <li><strong>BaseLineColor</strong> - This enables you to set the color of base lines of the chart.</li>
            <li><strong>Name</strong> - This is required and you need to provide the name of series.</li>
            <li><strong>BarColor</strong> - This enables you to set the color of bar for the series.</li>            
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