<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="ModalPopupTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ModalPopupTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    ModalPopup
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:LinkButton
        ID="TestLinkButton"
        runat="server"
        Text="Click to show popup" />

    <asp:Panel
        ID="PopupPanel"
        runat="server"
        Style="display: none">
        <asp:Panel
            ID="HeaderPanel"
            runat="server"
            Style="cursor: move; background-color: #DDDDDD; border: solid 1px Gray; color: Black">
            Header
        </asp:Panel>
        Content
        <asp:Button
            ID="CancelButton"
            runat="server"
            Text="Cancel" />
    </asp:Panel>

    <asp:Panel
        ID="SecondPopupPanel"
        runat="server"
        Style="display: none">
        <asp:Panel
            ID="Panel2"
            runat="server"
            Style="cursor: move; background-color: #DDDDDD; border: solid 1px Gray; color: Black">
            Header
        </asp:Panel>
        Content2
        <asp:Button
            ID="CancelButton2"
            runat="server"
            Text="Cancel" />
    </asp:Panel>

    <act:ModalPopupExtender
        ID="TestExtender"
        runat="server"
        BehaviorID="TestBehavior"
        TargetControlID="TestLinkButton"
        PopupControlID="PopupPanel"
        CancelControlID="CancelButton"
        DropShadow="true"
        PopupDragHandleControlID="HeaderPanel" />

    <act:ModalPopupExtender
        ID="SecondExtender"
        runat="server"
        BehaviorID="SecondTestBehavior"
        TargetControlID="TestLinkButton"
        PopupControlID="SecondPopupPanel"
        CancelControlID="CancelButton2"
        DropShadow="true"/>

    <script>
        describe("BallonPopup", function () {
            var POPUP_CLIENT_ID = "<%= PopupPanel.ClientID %>";
            var BEHAVIOR_CLIENT_ID = "<%= TestExtender.BehaviorID %>";
            var SECOND_BEHAVIOR_CLIENT_ID = "<%= SecondExtender.BehaviorID %>";

            describe("Rendering", function () {

                beforeEach(function () {
                    this.$foregroundElement = $($find(BEHAVIOR_CLIENT_ID)._foregroundElement);
                    this.$backgroundElement = $($find(BEHAVIOR_CLIENT_ID)._backgroundElement);
                    this.$foregroundElement2 = $($find(SECOND_BEHAVIOR_CLIENT_ID)._foregroundElement);
                    this.$backgroundElement2 = $($find(SECOND_BEHAVIOR_CLIENT_ID)._backgroundElement);
                });

                it("popup is visible", function () {
                    var modalPopupBehavior = $find(BEHAVIOR_CLIENT_ID);
                    modalPopupBehavior.show();
                    expect(this.$foregroundElement.css("visibility")).toBe("visible");
                });

                it("second popup is over first", function () {
                    var modalPopupBehavior = $find(BEHAVIOR_CLIENT_ID);
                    modalPopupBehavior.show();

                    var modalPopupBehavior2 = $find(SECOND_BEHAVIOR_CLIENT_ID);
                    modalPopupBehavior2.show();

                    expect(this.$backgroundElement2.css("z-index")).toBeGreaterThan(this.$backgroundElement.css("z-index"));
                    expect(this.$foregroundElement2.css("z-index")).toBeGreaterThan(this.$foregroundElement.css("z-index"));
                });
            });
        });
    </script>
</asp:Content>
