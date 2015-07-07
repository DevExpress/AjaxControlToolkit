<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="NumericUpDownTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.NumericUpDownTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    NumericUpDown
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:TextBox runat="server" 
        ID="TestTextBox"
        Text="0">
    </asp:TextBox>

    <act:NumericUpDownExtender runat="server" 
        TargetControlID="TestTextBox"
        ID="TargetExtender"
        Minimum="-10"
        Maximum="10"
        Width="120"/>

    <script>
        describe("NumericUpDown", function() {

            var NUMERIC_UP_DOWN_EXTENDER_CLIENT_ID = "<%= TargetExtender.ClientID %>";

            var TEXT_BOX_INITIAL_VALUE = "<%= TestTextBox.Text %>";

            describe("Rendering", function() {
               
                beforeEach(function() {
                    this.extender = $find(NUMERIC_UP_DOWN_EXTENDER_CLIENT_ID);

                    this.$container = $(this.extender._element).parents("table");
                });

                it("contains text input element", function() {
                    expect(this.$container.find("input[type=text]").length).toBe(1);
                });

                it("contains button(up and down) input elements", function() {
                    expect(this.$container.find("input[type=button]").length).toBe(2);
                });

                it("text input element has proper initial value", function() {
                    expect(this.$container.find("input[type=text]").val()).toBe(TEXT_BOX_INITIAL_VALUE);
                });
            });
        });
    </script>

</asp:Content>
