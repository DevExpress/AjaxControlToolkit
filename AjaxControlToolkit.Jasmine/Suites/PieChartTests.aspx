<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="PieChartTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.PieChartTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    PieChart
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <act:PieChart ID="PieChartMutlipeSeries" runat="server" ChartHeight="300" ChartWidth="450">
        <PieChartValues>
            <act:PieChartValue Category="Category 1" Data="1" PieChartValueColor="#0E426C" />
            <act:PieChartValue Category="Category 2" Data="2" PieChartValueColor="#D08AD9" />
            <act:PieChartValue Category="Category 3" Data="3" PieChartValueColor="#B85B3E" />            
        </PieChartValues>
    </act:PieChart>
    <act:PieChart ID="PieChartSinleNonEmptySeries" runat="server" ChartHeight="300" ChartWidth="450">
        <PieChartValues>
            <act:PieChartValue Category="Category 1" Data="0" PieChartValueColor="#0E426C" />
            <act:PieChartValue Category="Category 2" Data="2" PieChartValueColor="#D08AD9" />
            <act:PieChartValue Category="Category 3" Data="0" PieChartValueColor="#B85B3E" />            
        </PieChartValues>
    </act:PieChart>
    <act:PieChart ID="PieChartSingleSeries" runat="server" ChartHeight="300" ChartWidth="450">
        <PieChartValues>
            <act:PieChartValue Category="Category 3" Data="1" PieChartValueColor="#0E426C" />            
        </PieChartValues>
    </act:PieChart>

    <script>
        describe("PieChart", function () {
            var circleRegex = /<circle.+?><\/circle>/;

            it("does not render circle when multiple non-zero series", function () {
                var chart = $find("<%= PieChartMutlipeSeries.ClientID %>");
                var html = chart.get_element().innerHTML;
                expect(circleRegex.test(html)).toBe(false);
            });

            it("renders circle when single non-zero series", function () {
                var chart = $find("<%= PieChartSinleNonEmptySeries.ClientID %>");
                var html = chart.get_element().innerHTML;
                expect(circleRegex.test(html)).toBe(true);
            });

            it("renders circle when single series", function () {
                var chart = $find("<%= PieChartSingleSeries.ClientID %>");
                var html = chart.get_element().innerHTML;
                expect(circleRegex.test(html)).toBe(true);
            });
        });
    </script>   
</asp:Content>
