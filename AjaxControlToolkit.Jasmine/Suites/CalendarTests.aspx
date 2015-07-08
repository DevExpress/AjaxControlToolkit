<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="CalendarTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.CalendarTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    Calendar
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:TextBox runat="server"
        ID="TestTextBox" />

    <act:CalendarExtender runat="server"
        ID="TargetExtender"
        TargetControlID="TestTextBox" />

    <script>
        describe("Calendar", function() {

            var CALENDAR_EXTENDER_CLIENT_ID = "<%= TargetExtender.ClientID %>";

            var CALENDAR_CLASS_NAME = "ajax__calendar",
                CALENDAR_CONTAINER_CLASS_NAME = "ajax__calendar_container",
                CALENDAR_HEADER_CLASS_NAME = "ajax__calendar_header",
                CALENDAR_BODY_CLASS_NAME = "ajax__calendar_body",
                CALENDAR_HEADER_PREV_CLASS_NAME = "ajax__calendar_prev",
                CALENDAR_HEADER_NEXT_CLASS_NAME = "ajax__calendar_next",
                CALENDAR_HEADER_TITLE_CLASS_NAME = "ajax__calendar_title",
                CALENDAR_BODY_DAYS_CLASS_NAME = "ajax__calendar_days",
                CALENDAR_BODY_MONTHS_CLASS_NAME = "ajax__calendar_months",
                CALENDAR_BODY_YEARS_CLASS_NAME = "ajax__calendar_years";

            describe("Rendering", function() {
               
                beforeEach(function() {
                    this.extender = $find(CALENDAR_EXTENDER_CLIENT_ID);

                    this.extender.show();

                    this.$calendar = $(this.extender._container);
                });

                it("has proper class", function() {
                    expect(this.$calendar.hasClass(CALENDAR_CLASS_NAME)).toBeTruthy();
                });

                it("has container element", function() {
                    var $container = this.$calendar.children(CALENDAR_CONTAINER_CLASS_NAME.toClassSelector());

                    expect($container.length).toBe(1);
                });

                beforeEach(function() {
                    this.$container = this.$calendar.children(CALENDAR_CONTAINER_CLASS_NAME.toClassSelector());
                });

                it("container contains header element", function() {
                    expect(this.$container.children(CALENDAR_HEADER_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("container contains body element", function() {
                    expect(this.$container.children(CALENDAR_BODY_CLASS_NAME.toClassSelector()).length).toBe(1);                    
                });

                beforeEach(function() {
                    this.$header = this.$container.children(CALENDAR_HEADER_CLASS_NAME.toClassSelector());
                    this.$body = this.$container.children(CALENDAR_BODY_CLASS_NAME.toClassSelector());
                });

                it("container header contains prev element", function() {
                    expect(this.$header.find(CALENDAR_HEADER_PREV_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("container header contains next element", function() {
                    expect(this.$header.find(CALENDAR_HEADER_NEXT_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("container header contains title element", function() {
                    expect(this.$header.find(CALENDAR_HEADER_TITLE_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("container body contains days element", function() {
                    expect(this.$body.children(CALENDAR_BODY_DAYS_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("container body contains months element", function() {
                    expect(this.$body.children(CALENDAR_BODY_MONTHS_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("container body contains years element", function() {
                    expect(this.$body.children(CALENDAR_BODY_YEARS_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                beforeEach(function() {
                    this.$daysTable = this.$body.children(CALENDAR_BODY_DAYS_CLASS_NAME.toClassSelector()).children("table");
                    this.$monthsTable = this.$body.children(CALENDAR_BODY_MONTHS_CLASS_NAME.toClassSelector()).children("table");
                    this.$yearsTable = this.$body.children(CALENDAR_BODY_YEARS_CLASS_NAME.toClassSelector()).children("table");
                });

                it("days table hasn't cellpadding attribute", function() {
                    expect(this.$daysTable.attr("cellpadding")).toBeFalsy();
                });

                it("days table cell has proper paddings", function() {
                    var $dayCell = this.$daysTable.find("td").first();

                    expect($dayCell.css("padding-top")).toBeAnyOf(["0", "0px"]);
                    expect($dayCell.css("padding-right")).toBeAnyOf(["0", "0px"]);
                    expect($dayCell.css("padding-bottom")).toBeAnyOf(["0", "0px"]);
                    expect($dayCell.css("padding-left")).toBeAnyOf(["0", "0px"]);
                });

                it("days table hasn't cellspacing attribute", function() {
                    expect(this.$daysTable.attr("cellspacing")).toBeFalsy();
                });

                it("days table has proper border spacing", function() {
                    expect(this.$daysTable.css("border-spacing")).toBeAnyOf(["0 0", "0px 0px"]);
                });

                it("days table hasn't border attribute", function() {
                    expect(this.$daysTable.attr("border")).toBeFalsy();
                });

                it("days table has proper border width", function() {
                    expect(this.$daysTable.css("border-top-width")).toBeAnyOf(["0", "0px"]);
                    expect(this.$daysTable.css("border-right-width")).toBeAnyOf(["0", "0px"]);
                    expect(this.$daysTable.css("border-bottom-width")).toBeAnyOf(["0", "0px"]);
                    expect(this.$daysTable.css("border-left-width")).toBeAnyOf(["0", "0px"]);
                });

                it("months table hasn't cellpadding attribute", function() {
                    expect(this.$monthsTable.attr("cellpadding")).toBeFalsy();
                });

                it("month table cells has proper paddings", function() {
                    var $monthCell = this.$monthsTable.find("td").first();

                    expect($monthCell.css("padding-top")).toBeAnyOf(["0", "0px"]);
                    expect($monthCell.css("padding-right")).toBeAnyOf(["0", "0px"]);
                    expect($monthCell.css("padding-bottom")).toBeAnyOf(["0", "0px"]);
                    expect($monthCell.css("padding-left")).toBeAnyOf(["0", "0px"]);
                });

                it("months table hasn't cellspacing attribute", function() {
                    expect(this.$monthsTable.attr("cellspacing")).toBeFalsy();
                });

                it("months table hasn proper border spacing", function() {
                    expect(this.$monthsTable.css("border-spacing")).toBeAnyOf(["0 0", "0px 0px"]);
                });

                it("months table hasn't border attribute", function() {
                    expect(this.$monthsTable.attr("border")).toBeFalsy();
                });

                it("months table has proper border width", function() {
                    expect(this.$monthsTable.css("border-top-width")).toBeAnyOf(["0", "0px"]);
                    expect(this.$monthsTable.css("border-right-width")).toBeAnyOf(["0", "0px"]);
                    expect(this.$monthsTable.css("border-bottom-width")).toBeAnyOf(["0", "0px"]);
                    expect(this.$monthsTable.css("border-left-width")).toBeAnyOf(["0", "0px"]);
                });

                it("years table hasn't cellpadding attribute", function() {
                    expect(this.$yearsTable.attr("cellpadding")).toBeFalsy();
                });

                it("years table cell has proper paddings", function() {
                    var $yearCell = this.$yearsTable.find("td").first();

                    expect($yearCell.css("padding-top")).toBeAnyOf(["0", "0px"]);
                    expect($yearCell.css("padding-right")).toBeAnyOf(["0", "0px"]);
                    expect($yearCell.css("padding-bottom")).toBeAnyOf(["0", "0px"]);
                    expect($yearCell.css("padding-left")).toBeAnyOf(["0", "0px"]);
                });

                it("years table hasn't cellspacing attribute", function() {
                    expect(this.$yearsTable.attr("cellspacing")).toBeFalsy();
                });

                it("years table has proper border spacing", function() {
                    expect(this.$yearsTable.css("border-spacing")).toBeAnyOf(["0 0", "0px 0px"]);
                });

                it("years table hasn't border attribute", function() {
                    expect(this.$yearsTable.attr("border")).toBeFalsy();
                });

                it("years table has proper border width", function() {
                    expect(this.$yearsTable.css("border-top-width")).toBeAnyOf(["0", "0px"]);
                    expect(this.$yearsTable.css("border-right-width")).toBeAnyOf(["0", "0px"]);
                    expect(this.$yearsTable.css("border-bottom-width")).toBeAnyOf(["0", "0px"]);
                    expect(this.$yearsTable.css("border-left-width")).toBeAnyOf(["0", "0px"]);
                });
            });
        });
    </script>

</asp:Content>
