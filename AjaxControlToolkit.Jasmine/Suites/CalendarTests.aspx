<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="CalendarTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.CalendarTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    Calendar
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:TextBox runat="server"
        ID="TestTextBox" />

    <act:CalendarExtender runat="server"
        ID="TargetExtender"
        TargetControlID="TestTextBox"
        Animated="false"/>

    <asp:TextBox runat="server"
        ID="StartDateTextBox" />

    <act:CalendarExtender runat="server"
        ID="StartDateCalendarExtender"
        TargetControlID="StartDateTextBox"
        Animated="false"/>

    <asp:TextBox runat="server"
        ID="EndDateTextBox" />

    <act:CalendarExtender runat="server"
        ID="EndDateCalendarExtender"
        TargetControlID="EndDateTextBox"
        Animated="false"/>

    <asp:TextBox runat="server"
        ID="BothDatesTextBox" />

    <act:CalendarExtender runat="server"
        ID="BothDatesCalendarExtender"
        TargetControlID="BothDatesTextBox"
        Animated="false"/>

    <asp:TextBox runat="server"
        ID="SelectedDateTextBox" />

    <act:CalendarExtender runat="server"
        ID="SelectedDateCalendarExtender"
        TargetControlID="SelectedDateTextBox"
        Animated="false"/>

    <script>
        function getExpectedYearRangeText(year) {
            var yearText = year.toString();
            var startYearText = yearText.substring(3, 0) + "0";
            var endYearText = yearText.substring(3, 0) + "9";
            return startYearText + "-" + endYearText;
        }

        describe("Calendar", function() {

            var CALENDAR_EXTENDER_CLIENT_ID = "<%= TargetExtender.ClientID %>";
            var START_DATE_CALENDAR_EXTENDER_CLIENT_ID = "<%= StartDateCalendarExtender.ClientID %>";
            var END_DATE_CALENDAR_EXTENDER_CLIENT_ID = "<%= EndDateCalendarExtender.ClientID %>";
            var BOTH_DATES_CALENDAR_EXTENDER_CLIENT_ID = "<%= BothDatesCalendarExtender.ClientID %>";
            var SELECTED_DATE_CALENDAR_EXTENDER_CLIENT_ID = "<%= SelectedDateCalendarExtender.ClientID %>";

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

                it("can navigate years", function () {
                    var title = this.$header.find(CALENDAR_HEADER_TITLE_CLASS_NAME.toClassSelector());
                    var date = new Date();
                    title.click();
                    expect(title.text()).toBe(date.getFullYear().toString());

                    title.click();
                    var expectedYearsText = getExpectedYearRangeText(date.getFullYear());
                    expect(title.text()).toBe(expectedYearsText);

                    var next = this.$header.find(CALENDAR_HEADER_NEXT_CLASS_NAME.toClassSelector());
                    next.click();
                    var expectedYearsTextAfterNextClick = getExpectedYearRangeText(date.getFullYear() + 10);
                    expect(title.text()).toBe(expectedYearsTextAfterNextClick);

                    var prev = this.$header.find(CALENDAR_HEADER_PREV_CLASS_NAME.toClassSelector());
                    prev.click();
                    expect(title.text()).toBe(expectedYearsText);

                    var expectedYearsTextAfterPrevClick = getExpectedYearRangeText(date.getFullYear() - 10);
                    prev.click();
                    expect(title.text()).toBe(expectedYearsTextAfterPrevClick);
                });

                it("shows today date with no start and end date", function () {
                    var testDate = new Date();

                    spyOn(this.extender, "get_visibleDate").and.callFake(function () {
                        return testDate;
                    });

                    var visibleDate = this.extender._getEffectiveVisibleDate();
                    expect(visibleDate.getTime()).toBe(this.extender.getMonthStartDate(testDate).getTime());
                });

                it("shows today date with end date", function () {
                    var testDate = new Date(2000, 1, 1);
                    this.extender._endDate = new Date(1999, 1, 1);

                    spyOn(this.extender, "get_visibleDate").and.callFake(function () {
                        return testDate;
                    });

                    var visibleDate = this.extender._getEffectiveVisibleDate();
                    expect(visibleDate.getTime()).toBe(this.extender.getMonthStartDate(this.extender._endDate).getTime());
                });

                it("shows today date with start date", function () {
                    var testDate = new Date(2000, 1, 1);
                    this.extender._startDate = new Date(2001, 1, 1);

                    spyOn(this.extender, "get_visibleDate").and.callFake(function () {
                        return testDate;
                    });

                    var visibleDate = this.extender._getEffectiveVisibleDate();
                    expect(visibleDate.getTime()).toBe(this.extender.getMonthStartDate(this.extender._startDate).getTime());
                });

                beforeEach(function () {
                    this.startDateExtender = $find(START_DATE_CALENDAR_EXTENDER_CLIENT_ID);

                    this.startDateExtender.show();

                    this.$startDateCalendar = $(this.startDateExtender._container);
                    this.$startDateContainer = this.$startDateCalendar.children(CALENDAR_CONTAINER_CLASS_NAME.toClassSelector());
                    this.$startDateHeader = this.$startDateContainer.children(CALENDAR_HEADER_CLASS_NAME.toClassSelector());
                });

                it("can navigate years with start date", function () {
                    var title = this.$startDateHeader.find(CALENDAR_HEADER_TITLE_CLASS_NAME.toClassSelector());
                    var date = new Date(2015, 1, 1);
                    title.click();
                    expect(title.text()).toBe(date.getFullYear().toString());

                    title.click();
                    var expectedYearsText = getExpectedYearRangeText(date.getFullYear());
                    expect(title.text()).toBe(expectedYearsText);

                    var next = this.$startDateHeader.find(CALENDAR_HEADER_NEXT_CLASS_NAME.toClassSelector());
                    next.click();
                    var expectedYearsTextAfterNextClick = getExpectedYearRangeText(date.getFullYear() + 10);
                    expect(title.text()).toBe(expectedYearsTextAfterNextClick);

                    var prev = this.$startDateHeader.find(CALENDAR_HEADER_PREV_CLASS_NAME.toClassSelector());
                    prev.click();
                    expect(title.text()).toBe(expectedYearsText);

                    prev.click();
                    expect(title.text()).toBe(expectedYearsText);
                });

                beforeEach(function () {
                    this.endDateExtender = $find(END_DATE_CALENDAR_EXTENDER_CLIENT_ID);

                    this.endDateExtender.show();

                    this.$endDateCalendar = $(this.endDateExtender._container);
                    this.$endDateContainer = this.$endDateCalendar.children(CALENDAR_CONTAINER_CLASS_NAME.toClassSelector());
                    this.$endDateHeader = this.$endDateContainer.children(CALENDAR_HEADER_CLASS_NAME.toClassSelector());
                });

                it("can navigate years with end date", function () {
                    var title = this.$endDateHeader.find(CALENDAR_HEADER_TITLE_CLASS_NAME.toClassSelector());
                    var date = new Date(2015, 1, 1);
                    title.click();
                    expect(title.text()).toBe(date.getFullYear().toString());

                    title.click();
                    var expectedYearsText = getExpectedYearRangeText(date.getFullYear());
                    expect(title.text()).toBe(expectedYearsText);

                    var prev = this.$endDateHeader.find(CALENDAR_HEADER_PREV_CLASS_NAME.toClassSelector());
                    prev.click();
                    var expectedYearsTextAfterPrevClick = getExpectedYearRangeText(date.getFullYear() - 10);
                    expect(title.text()).toBe(expectedYearsTextAfterPrevClick);

                    var next = this.$endDateHeader.find(CALENDAR_HEADER_NEXT_CLASS_NAME.toClassSelector());
                    next.click();
                    expect(title.text()).toBe(expectedYearsText);

                    next.click();
                    expect(title.text()).toBe(expectedYearsText);
                });

                beforeEach(function () {
                    this.bothDatesExtender = $find(BOTH_DATES_CALENDAR_EXTENDER_CLIENT_ID);

                    this.bothDatesExtender.show();

                    this.$bothDatesCalendar = $(this.bothDatesExtender._container);
                    this.$bothDatesContainer = this.$bothDatesCalendar.children(CALENDAR_CONTAINER_CLASS_NAME.toClassSelector());
                    this.$bothDatesHeader = this.$bothDatesContainer.children(CALENDAR_HEADER_CLASS_NAME.toClassSelector());
                });

                it("can navigate years with start and end date", function () {
                    var title = this.$bothDatesHeader.find(CALENDAR_HEADER_TITLE_CLASS_NAME.toClassSelector());
                    var startDate = new Date(2015, 1, 1);
                    title.click();
                    expect(title.text()).toBe(startDate.getFullYear().toString());

                    title.click();
                    var expectedYearsText = getExpectedYearRangeText(startDate.getFullYear());
                    expect(title.text()).toBe(expectedYearsText);

                    var prev = this.$bothDatesHeader.find(CALENDAR_HEADER_PREV_CLASS_NAME.toClassSelector());
                    prev.click();
                    expect(title.text()).toBe(expectedYearsText);

                    var next = this.$bothDatesHeader.find(CALENDAR_HEADER_NEXT_CLASS_NAME.toClassSelector());
                    next.click();
                    expect(title.text()).toBe(expectedYearsText);
                });

                beforeEach(function () {
                    this.selectedDateExtender = $find(SELECTED_DATE_CALENDAR_EXTENDER_CLIENT_ID);
                });

                it("sets selected date", function () {
                    expect(this.selectedDateExtender._selectedDate.localeFormat(this.selectedDateExtender._format)).toBe(this.selectedDateExtender._textbox.get_Value());
                });
            });
        });
    </script>

</asp:Content>
