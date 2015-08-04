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
        Step="25"
        Maximum="30"
        Width="120" />

    <script>
        describe("NumericUpDown", function() {

            var NUMERIC_UP_DOWN_EXTENDER_CLIENT_ID = "<%= TargetExtender.ClientID %>";
            var TEXT_BOX_CLIENT_ID = "<%= TestTextBox.ClientID  %>";

            var TEXT_BOX_INITIAL_VALUE = "<%= TestTextBox.Text %>";

            describe("Rendering", function() {

                beforeEach(function() {
                    this.extender = $find(NUMERIC_UP_DOWN_EXTENDER_CLIENT_ID);

                    this.$container = $(this.extender._element).parents("table");
                    this.$buttonUp = $("#" + TEXT_BOX_CLIENT_ID + "_bUp");
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

                it("container hasn't cellpadding attribute", function() {
                    expect(this.$container.attr("cellpadding")).toBeFalsy();
                });

                it("container hasn't cellspacing attribute", function() {
                    expect(this.$container.attr("cellspacing")).toBeFalsy();
                });

                it("container has proper border spacing", function() {
                    expect(this.$container.css("border-spacing")).toBeAnyOf(["0 0", "0px 0px"]);
                });

                it("container cells has proper padding", function() {
                    var cells = this.$container.find("td");

                    for(var i = 0; i < cells.length; i++) {
                        expect($(cells[i]).css("padding-top")).toBeAnyOf(["0", "0px"]);
                        expect($(cells[i]).css("padding-right")).toBeAnyOf(["0", "0px"]);
                        expect($(cells[i]).css("padding-bottom")).toBeAnyOf(["0", "0px"]);
                        expect($(cells[i]).css("padding-left")).toBeAnyOf(["0", "0px"]);
                    }
                });

                it("large increment does not fail", function() {
                    var pass = true;

                    window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
                        pass = false;
                        return true;
                    }

                    this.$buttonUp.click();

                    expect(pass).toBe(true);
                });
            });
        });
    </script>

</asp:Content>
