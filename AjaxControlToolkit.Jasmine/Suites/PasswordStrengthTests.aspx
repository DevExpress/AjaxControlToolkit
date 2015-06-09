<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="PasswordStrengthTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.PasswordStrengthTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    PasswordStrength
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:LinkButton runat="server" 
        ID="Target"
        Text="Show Popup" />

    <asp:Panel runat="server" ID="PopupPanel">
        <asp:TextBox runat="server" 
            ID="PasswordTextBox" />
        <act:PasswordStrength runat="server" TargetControlID="PasswordTextBox" />
    </asp:Panel>

    <act:ModalPopupExtender runat="server" 
        ID="TestModalPopup"
        TargetControlID="Target"
        PopupControlID="PopupPanel" />

    <script>
        describe("PasswordStrength", function() {

            var PASSWORD_TEXTBOX_CLIENT_ID = "<%= PasswordTextBox.ClientID %>",
                PASSWORD_STRENGTH_LABEL_CLIENT_ID = PASSWORD_TEXTBOX_CLIENT_ID + "_PasswordStrength",
                MODAL_POPUP_EXTENDER_CLIENT_ID = "<%= TestModalPopup.ClientID %>";

            beforeEach(function() {
                this.$passwordTextBox = $(PASSWORD_TEXTBOX_CLIENT_ID.toIdSelector());
                this.$passwordStrengthLabel = $(PASSWORD_STRENGTH_LABEL_CLIENT_ID.toIdSelector());

                this.modalPopupExtender = $find(MODAL_POPUP_EXTENDER_CLIENT_ID);
                this.$modalPopupBackground = $(this.modalPopupExtender._backgroundElement);
            });

            it("displays text over modal popup", function() {
                expect(this.$passwordStrengthLabel.zIndex()).toBeGreaterThanOrEqualTo(this.$modalPopupBackground.zIndex());
            });
        });
    </script>

</asp:Content>
