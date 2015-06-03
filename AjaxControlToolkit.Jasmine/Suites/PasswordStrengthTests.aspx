<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="PasswordStrengthTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.PasswordStrengthTests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">
    PasswordStrength
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">
    <asp:LinkButton 
        runat="server" 
        ID="LinkButton1" Text="test" />
    <asp:Panel 
        ID="Panel1" 
        runat="server">
        <asp:TextBox 
            runat="server" 
            ID="TextBox1" />
        <act:PasswordStrength 
            runat="server" 
            ID="PasswordStrength1"
            TargetControlID="TextBox1" />
    </asp:Panel>
    <act:ModalPopupExtender 
        runat="server" 
        ID="ModalPopup1"
        TargetControlID="LinkButton1" 
        PopupControlID="Panel1"
         />

    <script>
        describe("PasswordStrength", function() {
            beforeEach(function() {
                this.textBox = document.getElementById("<%= TextBox1.ClientID %>");
                this.passwordStrength =  $find("<%= PasswordStrength1.ClientID %>");
                this.modalPopupExtender = $find("<%= ModalPopup1.ClientID %>");
            });

            it("display text is over ModalPopup", function() {
                var displayText = document.getElementById("<%= TextBox1.ClientID %>" + "_PasswordStrength");
                expect(displayText.style.zIndex).toBeGreaterThan(this.modalPopupExtender.get_element().style.zIndex - 1);
            });
        });
    </script>
</asp:Content>
