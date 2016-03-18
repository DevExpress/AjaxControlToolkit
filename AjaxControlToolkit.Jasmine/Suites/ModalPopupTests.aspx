<%@ Page Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="ModalPopupTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ModalPopupTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    ModalPopup
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:Panel
        ID="TestPanel"
        runat="server"
        Style="display: none;">
        <p>
            Popup text
        </p>
        <asp:Button
            ID="OKButton"
            runat="server"
            Text="Ok" />
        <asp:Button
            ID="CancelButton"
            runat="server"
            Text="Cancel" />
    </asp:Panel>
    <asp:Button
        ID="OpenButton"
        runat="server"
        Text="Open Modal" />

    <act:ModalPopupExtender
        ID="TargetExtender"
        runat="server"
        TargetControlID="OpenButton"
        PopupControlID="TestPanel"
        Enabled="True"
        OkControlID="OKButton"
        CancelControlID="CancelButton">
    </act:ModalPopupExtender>

    <asp:Panel
        ID="TestCssPanel"
        runat="server"
        Style="display: none;">
        <p>
            Popup text
        </p>
    </asp:Panel>
    <asp:Button
        ID="OpenCssButton"
        runat="server"
        Text="Open Modal" />
    <act:ModalPopupExtender
        ID="TargetCssExtender"
        runat="server"
        TargetControlID="OpenCssButton"
        PopupControlID="TestCssPanel"
        Enabled="True"
        BackgroundCssClass="cssextender">
    </act:ModalPopupExtender>

    <script>
        describe("ModalPopup", function() {
            var POPUP_EXTENDER_CLIENT_ID = "<%= TargetExtender.ClientID%>";
            var OPEN_BUTTON_CLIENT_ID = "<%= OpenButton.ClientID%>";

            var OK_BUTTON_CLIENT_ID = "<%= OKButton.ClientID%>";
            var CANCEL_BUTTON_CLIENT_ID = "<%= CancelButton.ClientID%>";

            var POPUP_CSS_EXTENDER_CLIENT_ID = "<%= TargetCssExtender.ClientID%>";

            describe("Initial rendering", function() {
                beforeEach(function() {
                    this.extender = $find(POPUP_EXTENDER_CLIENT_ID);
                });

                it("checks if popup panel is hidden", function() {
                    expect($(this.extender._popupElement).css("display")).toBe("none");
                });
                it("checks if popup foreground is hidden", function() {
                    expect($(this.extender._foregroundElement).css("display")).toBe("none");
                });
                it("checks if popup background is hidden", function() {
                    expect($(this.extender._backgroundElement).css("display")).toBe("none");
                });
            });

            describe("Display rendering", function() {
                beforeAll(function() {
                    this.extender = $find(POPUP_EXTENDER_CLIENT_ID);
                    this.extender.show();
                });

                it("shows popup panel", function() {
                    expect($(this.extender._popupElement).is(':visible')).toBe(true);
                });
                it("shows popup foreground", function() {
                    expect($(this.extender._foregroundElement).is(':visible')).toBe(true);
                });
                it("shows popup background", function() {
                    expect($(this.extender._backgroundElement).is(':visible')).toBe(true);
                });
            });

            describe("Display rendering with custom BackgroundCss", function() {
                beforeAll(function() {
                    this.extender = $find(POPUP_CSS_EXTENDER_CLIENT_ID);
                    this.extender.show();
                });

                it("shows popup background", function() {
                    expect($(this.extender._backgroundElement).is(':visible')).toBe(true);
                });
                it("shows popup background with custom color", function() {
                    expect($(this.extender._backgroundElement).attr('class')).toBe('cssextender');
                });
            });

            describe("Display on click", function() {
                beforeEach(function() {
                    this.extender = $find(POPUP_EXTENDER_CLIENT_ID);
                });

                it("shows popup panel on target control click", function() {
                    var openButton = $("#" + OPEN_BUTTON_CLIENT_ID);
                    $(openButton).click();

                    expect($(this.extender._popupElement).is(':visible')).toBe(true);
                    expect($(this.extender._foregroundElement).is(':visible')).toBe(true);
                    expect($(this.extender._backgroundElement).is(':visible')).toBe(true);
                });
            });

            describe("Hide on click", function() {
                beforeEach(function() {
                    this.extender = $find(POPUP_EXTENDER_CLIENT_ID);
                    this.extender.show();
                });

                it("hides popup panel on ok control click", function() {
                    var okButton = $("#" + OK_BUTTON_CLIENT_ID);                    
                    $(okButton).click();

                    expect($(this.extender._popupElement).css("display")).toBe("none");
                    expect($(this.extender._backgroundElement).css("display")).toBe("none");
                    expect($(this.extender._foregroundElement).css("display")).toBe("none");
                });
                it("hides popup panel on cancel control click", function() {
                    var cancelButton = $.find("#" + CANCEL_BUTTON_CLIENT_ID);
                    $(cancelButton).click();

                    expect($(this.extender._popupElement).css("display")).toBe("none");
                    expect($(this.extender._backgroundElement).css("display")).toBe("none");
                    expect($(this.extender._foregroundElement).css("display")).toBe("none");
                });
            });
        });
    </script>
</asp:Content>
