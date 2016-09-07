<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/BarChartMasterPage.master" AutoEventWireup="true" CodeBehind="BarChartTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.BarChartTests" %>

<asp:Content ContentPlaceHolderID="BarChartTestSuite" runat="server">

    <act:BarChart runat="server" ID="TargetControlWithAutoID"></act:BarChart>
    <act:BarChart runat="server" ID="TargetControlWithPredictableID"></act:BarChart>

    <script>
        describe("BarChart", function () {
            var CHART_WITH_AUTOID_CLIENT_ID = "<%= TargetControlWithAutoID.ClientID %>";
            var CHART_WITH_PREDICTABLEID_CLIENT_ID = "<%= TargetControlWithPredictableID.ClientID %>";

            describe("Rendering", function () {

                beforeEach(function () {
                    this.behaviorAutoID = $find(CHART_WITH_AUTOID_CLIENT_ID);
                    this.behaviorPredictableID = $find(CHART_WITH_PREDICTABLEID_CLIENT_ID);
                });

                it("renders chart with ClientIDMode.AutoID mode", function () {
                    expect(this.behaviorAutoID._parentDiv).not.toBe(null);
                });

                it("renders chart with ClientIDMode.PredictableID mode", function () {
                    expect(this.behaviorPredictableID._parentDiv).not.toBe(null);
                });
            });
        });
    </script>
</asp:Content>
