<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="BalloonPopupTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.BalloonPopupTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    Tabs
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <act:TabContainer ID="tabDemograph" runat="server">
        <act:TabPanel ID="tabHotels" runat="server" HeaderText="Hotels">
            <ContentTemplate>
                <asp:ListBox ID="lbCity" runat="server" SelectionMode="Multiple" Height="100px"
                    Width="141px"></asp:ListBox>
                <act:BalloonPopupExtender ID="lbCity_BalloonPopupExtender" runat="server"
                    BalloonPopupControlID="Panel1" CustomCssUrl=""
                    Enabled="True" ExtenderControlID="" TargetControlID="lbCity">
                </act:BalloonPopupExtender>
                <asp:Panel ID="Panel1" runat="server">
                    welcome
                </asp:Panel>
            </ContentTemplate>
        </act:TabPanel>
    </act:TabContainer>

    <script>
        describe("BallonPopup", function() {
            var POPUP_CLASS_NAME = "ajax__balloon_popup";

            var TAB_CLIENT_ID = "<%= tabHotels.ClientID %>";

            describe("Rendering", function() {

                beforeEach(function() {
                    this.element = $find(TAB_CLIENT_ID)._element;
                });

                it("popup is hidden", function() {
                    var popup = $(this.element).find(POPUP_CLASS_NAME.toClassSelector());
                    expect(popup.css("visibility")).toBe("hidden");
                });
            });
        });
    </script>
</asp:Content>
