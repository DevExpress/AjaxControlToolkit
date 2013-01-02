<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true"
    CodeFile="PieChart.aspx.cs" Inherits="PieChart_PieChart" Title="PieChart Sample"
    Culture="auto" UICulture="auto" Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">
            PieChart Demonstration</div>
        <br />
        <ajaxToolkit:PieChart ID="pieChart1" runat="server" ChartHeight="300" ChartWidth="450"
            ChartTitle="Widget Production in the world" ChartTitleColor="#0E426C">
            <Series>
                <ajaxToolkit:PieChartSeries Category="United States" Data="45" SeriesColor="#6C1E83" />
                <ajaxToolkit:PieChartSeries Category="Europe" Data="25" SeriesColor="#D08AD9" />
                <ajaxToolkit:PieChartSeries Category="Asia" Data="17" SeriesColor="#6586A7" />
                <ajaxToolkit:PieChartSeries Category="Australia" Data="13" SeriesColor="#0E426C" />
            </Series>
        </ajaxToolkit:PieChart>
        <br />
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            PieChart Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            The PieChart control enables you to render a pie chart from one or more series of
            values. This control is compatible with any browser which supports SVG including
            Internet Explorer 9 and above.
        </p>
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            PieChart Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <p>
            The control above is initialized with this code. The <em>italic</em> properties
            are optional:</p>
        <pre>
&lt;ajaxToolkit:PieChart 
ID=&quot;pieChart1&quot; 
runat=&quot;server&quot; 
<em>ChartHeight</em>=&quot;300&quot; 
<em>ChartWidth</em>=&quot;450&quot; 
<em>ChartTitle</em>=&quot;Widget Production in the world&quot; 
<em>ChartTitleColor</em>=&quot;#0E426C&quot;&gt;
&lt;Series&gt;
&lt;ajaxToolkit:PieChartSeries 
Category=&quot;United States&quot; 
Data=&quot;45&quot; 
<em>SeriesColor</em>=&quot;#6C1E83&quot; /&gt;
&lt;ajaxToolkit:PieChartSeries 
Category=&quot;Europe&quot; 
Data=&quot;25&quot; 
<em>SeriesColor</em>=&quot;#D08AD9&quot; /&gt;
&lt;ajaxToolkit:PieChartSeries 
Category=&quot;Asia&quot; 
Data=&quot;17&quot; 
<em>SeriesColor</em>=&quot;#6586A7&quot; /&gt;
&lt;ajaxToolkit:PieChartSeries 
Category=&quot;Australia&quot; 
Data=&quot;13&quot; 
<em>SeriesColor</em>=&quot;#0E426C&quot; /&gt;
&lt;/Series&gt;
&lt;/ajaxToolkit:PieChart &gt;
    </pre>
        <b>Properties</b>
        <ul>
            <li><strong>ChartHeight</strong> - This property enables you to customize the height
                of the chart.</li>
            <li><strong>ChartWidth</strong> - This property enables you to customize the width of
                the chart.</li>
            <li><strong>ChartTitle</strong> - This property enables you to set the title of the
                chart.</li>
            <li><strong>ChartTitleColor</strong> - This property enables you to set the font color
                of the chart title.</li>
        </ul>
        <br />
        <strong>PieChart Series Properties:</strong>
        <ul>
            <li><strong>Category</strong> - This property is required and provides name for a particular
                series.</li>
            <li><strong>Data</strong> - This property is required and provides Data for a particular
                series.</li>
            <li><strong>SeriesColor</strong> - This property enables you to set the color of segment
                for a particular series.</li>
        </ul>
    </asp:Panel>
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" />
</asp:Content>
