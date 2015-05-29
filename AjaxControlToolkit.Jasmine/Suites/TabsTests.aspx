<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="TabsTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.TabsTests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">
    Tabs
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">
    <act:TabContainer ID="TestTabContainer" runat="server">
        <act:TabPanel ID="ActiveTabPanel" runat="server" HeaderText="Active Tab Panel"></act:TabPanel>
        <act:TabPanel ID="DisabledTabPanel" runat="server" HeaderText="Disabled Tab Panel" Enabled="false"></act:TabPanel>
    </act:TabContainer>
    <script>
        describe("Tabs", function() {
            var TABS_COUNT = 2,

                TAB_HEADER_CLASS_NAME = "ajax__tab_header",
                TAB_BODY_CLASS_NAME = "ajax__tab_body",

                ACTIVE_TAB_CLASS_NAME = "ajax__tab_active",
                DISABLED_TAB_CLASS_NAME = "ajax__tab_disabled",

                ACTIVE_TAB_PANEL_CLASS_NAME = "ajax__tab_panel",
                DISABLED_TAB_PANEL_CLASS_NAME = "aspNetDisabled",

                TAB_OUTER_CLASS_NAME = "ajax__tab_outer",
                TAB_INNER_CLASS_NAME = "ajax__tab_inner";

            var toClassSelector = function(className) {
                return "." + className;
            }

            beforeEach(function() {
                this.element = $find("<%= TestTabContainer.ClientID %>")._element;

                jasmine.addMatchers({
                    toBeAnyOf: function() {
                        return {
                            compare: function(actual, expected) {
                                var result = { pass: false }

                                for(var i = 0, length = expected.length; i < length; i++) {
                                    if(actual === expected[i]) {
                                        result.pass = true;
                                        break;
                                    }
                                }

                                return result;
                            }
                        }
                    }
                });
            });

            it("root div has proper classes", function() {
                var classList = this.element.classList,
                    expectedClassList = ["ajax__tab_xp", "ajax__tab_container", "ajax__tab_default"];

                for(var i = 0; i < expectedClassList.length; i++)
                    expect(expectedClassList[i]).toBeAnyOf(classList);
            });

            it("root div contains 2 div elements", function() {
                var $element = $(this.element),
                    innerElements = $element.children();

                expect(innerElements.length).toBe(2);

                expect($(innerElements).first().is("div")).toBeTruthy();
                expect($(innerElements).last().is("div")).toBeTruthy();
            });

            it("header div has proper id and class", function() {
                var headerElements = $(this.element).find(toClassSelector(TAB_HEADER_CLASS_NAME));
                expect(headerElements.length).toBe(1);

                var headerId = headerElements[0].id;
                expect(headerId).toBe(this.element.id + "_header");
            });

            it("body div has proper id and class", function() {
                var bodyElements = $(this.element).find(toClassSelector(TAB_BODY_CLASS_NAME));
                expect(bodyElements.length).toBe(1);

                var bodyId = bodyElements[0].id;
                expect(bodyId).toBe(this.element.id + "_body");
            });

            it("header div contains " + TABS_COUNT + " span elements", function() {
                var header = $(this.element).find(toClassSelector(TAB_HEADER_CLASS_NAME));

                expect($(header).children().length).toBe(TABS_COUNT);
                expect($(header).children().eq(0).is("span")).toBeTruthy();
                expect($(header).children().eq(1).is("span")).toBeTruthy();
            });

            it("first(active) tab header has proper id and class", function() {
                var header = $(this.element).find(toClassSelector(TAB_HEADER_CLASS_NAME)),
                    firstHeader = header.children()[0];

                expect(firstHeader.id).toBe(this.element.id + "_ActiveTabPanel_tab");
                expect(ACTIVE_TAB_CLASS_NAME).toBeAnyOf(firstHeader.classList);
            });

            it("second(disabled) tab header has proper id and class", function() {
                var header = $(this.element).find(toClassSelector(TAB_HEADER_CLASS_NAME)),
                    secondHeader = header.children()[1];

                expect(secondHeader.id).toBe(this.element.id + "_DisabledTabPanel_tab");
                expect(DISABLED_TAB_CLASS_NAME).toBeAnyOf(secondHeader.classList);
            });

            it("boby div contains " + TABS_COUNT + " div elements", function() {
                var body = $(this.element).find(toClassSelector(TAB_BODY_CLASS_NAME));

                expect($(body).children().length).toBe(TABS_COUNT);
                expect($(body).children().eq(0).is("div")).toBeTruthy();
                expect($(body).children().eq(1).is("div")).toBeTruthy();
            });

            it("first(active) tab body has proper id and class", function() {
                var body = $(this.element).find(toClassSelector(TAB_BODY_CLASS_NAME)),
                    firstTabBody = body.children()[0];

                expect(firstTabBody.id).toBe(this.element.id + "_ActiveTabPanel");
                expect(ACTIVE_TAB_PANEL_CLASS_NAME).toBeAnyOf(firstTabBody.classList);
            });

            it("second(disabled) tab body has proper id and class", function() {
                var body = $(this.element).find(toClassSelector(TAB_BODY_CLASS_NAME)),
                    secondTabBody = body.children()[1];

                expect(secondTabBody.id).toBe(this.element.id + "_DisabledTabPanel");
                expect(DISABLED_TAB_PANEL_CLASS_NAME).toBeAnyOf(secondTabBody.classList);
            });

            it("any tab header contains outer and inner inserted spans", function() {
                var header = $(this.element).find(toClassSelector(TAB_HEADER_CLASS_NAME)),
                    $headerTab = header.children("span").eq(0);

                expect($headerTab.children().length).toBe(1);
                expect($headerTab.children().eq(0).is("span")).toBeTruthy();
                expect($headerTab.children().eq(0).attr("class")).toBe(TAB_OUTER_CLASS_NAME);

                expect($headerTab.children().children().length).toBe(1);
                expect($headerTab.children().children().eq(0).is("span")).toBeTruthy();
                expect($headerTab.children().children().eq(0).attr("class")).toBe(TAB_INNER_CLASS_NAME);
            });
        });
    </script>
</asp:Content>
