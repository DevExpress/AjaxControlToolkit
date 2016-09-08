<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="AccordionTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.AccordionTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    Accordion
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

   <asp:UpdatePanel ID="TestUpdatePanel1" runat="server" UpdateMode="Conditional" ChildrenAsTriggers="False">
        <ContentTemplate>
            <act:Accordion ID="TestAccordion" runat="server" HeaderCssClass="accordionHeader" HeaderSelectedCssClass="accordionHeaderSelected"
                ContentCssClass="accordionContent" CssClass="accReports" TransitionDuration="250">
                <Panes>
                    <act:AccordionPane ID="TestAccordionPane" runat="server" ContentCssClass="" HeaderCssClass="A">
                        <Header>Employee Time</Header>
                        <Content>
                            <asp:Panel ID="TestPanel" runat="server">
                                <asp:UpdatePanel ID="TestUpdatePanel2" runat="server" UpdateMode="Conditional">
                                    <ContentTemplate>
                                        <asp:LinkButton ID="TestLinkButton" runat="server">LinkButton</asp:LinkButton>
                                    </ContentTemplate>
                                </asp:UpdatePanel>
                            </asp:Panel>
                        </Content>
                    </act:AccordionPane>
                    <act:AccordionPane ID="AccordionPane2" runat="server" ContentCssClass="" HeaderCssClass="B">
                        <Header>Header</Header>
                        <Content>Content</Content>
                    </act:AccordionPane>
                </Panes>
            </act:Accordion>
        </ContentTemplate>
    </asp:UpdatePanel>

    <script>
        describe("Accordion", function() {
            var LINKBUTTON_UNIQUE_ID = "<%= TestLinkButton.UniqueID %>";
            var ACCORDION_CLIENT_ID = "<%= TestAccordion.ClientID %>";

            it("renders correct child ID", function() {
                var parts = LINKBUTTON_UNIQUE_ID.split("$");

                expect(parts[1]).toBe("TestSuite");
                expect(parts[3]).toBe("TestLinkButton");
            });

            it("renders correct pane header class", function () {
                var pane = $("#" + ACCORDION_CLIENT_ID).find("div:nth-child(4)");
                expect(pane.attr("class")).toBe("B");                
            });

            it("renders correct pane header class after leaving it", function () {
                var pane1 = $("#" + ACCORDION_CLIENT_ID).find("div:nth-child(2)");
                var pane2 = $("#" + ACCORDION_CLIENT_ID).find("div:nth-child(4)");

                var firstClick = createMouseEvent("click", pane2[0]);
                pane2[0].dispatchEvent(firstClick);

                var secondClick = createMouseEvent("click", pane1[0]);
                pane1[0].dispatchEvent(secondClick);

                expect(pane2.attr("class")).toBe("B");
            });

        });
    </script>
</asp:Content>
