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
                    <act:AccordionPane ID="TestAccordionPane" runat="server" ContentCssClass="" HeaderCssClass="">
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
                </Panes>
            </act:Accordion>
        </ContentTemplate>
    </asp:UpdatePanel>

    <script>
        describe("Accordion", function() {
            var LINKBUTTON_UNIQUE_ID = "<%= TestLinkButton.UniqueID %>";

            it("renders correct child ID", function() {
                var parts = LINKBUTTON_UNIQUE_ID.split("$");

                expect(parts[1]).toBe("TestSuite");
                expect(parts[3]).toBe("TestLinkButton");
            });

        });
    </script>
</asp:Content>
