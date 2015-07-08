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
            });
        });
    </script>

</asp:Content>
