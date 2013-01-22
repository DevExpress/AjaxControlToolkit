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
            ChartTitle="Widget Production in the world %" ChartTitleColor="#0E426C">
            <PieChartValues>
                <ajaxToolkit:PieChartValue Category="United States" Data="30" PieChartValueColor="#0E426C" />
                <ajaxToolkit:PieChartValue Category="India" Data="5" PieChartValueColor="#D08AD9" />                
                <ajaxToolkit:PieChartValue Category="France" Data="8" PieChartValueColor="#B85B3E" />
                <ajaxToolkit:PieChartValue Category="Germany" Data="9" PieChartValueColor="#FFC652" />                
                <ajaxToolkit:PieChartValue Category="United Kingdom" Data="22" PieChartValueColor="#6586A7" />
                <ajaxToolkit:PieChartValue Category="Australia" Data="18" PieChartValueColor="#669900" />
                <ajaxToolkit:PieChartValue Category="Rusia" Data="8" PieChartValueColor="#4508A2" />
            </PieChartValues>
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
            The PieChart control enables you to render a pie chart from one or more PieChartValues.
            This control is compatible with any browser which supports SVG including Internet
            Explorer 9 and above.
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
        <strong>PieChartValue Properties:</strong>
        <ul>
            <li><strong>Category</strong> - This property is required and provides name for a particular
                PieChartValue.</li>
            <li><strong>Data</strong> - This property is required and provides Data for a particular
                PieChartValue.</li>
            <li><strong>PieChartValueColor</strong> - This property enables you to set the color
                of segment for a particular PieChartValue.</li>
            <li><strong>PieChartValueStrokeColor</strong> - This property enables you to set the
                stroke color of segment for a particular PieChartValue.</li>
        </ul>
    </asp:Panel>
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" />
</asp:Content>
