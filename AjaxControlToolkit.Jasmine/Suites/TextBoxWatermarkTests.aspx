<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="TextBoxWatermarkTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.TextBoxWatermarkTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    TextBoxWatermark
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:TextBox runat="server" ID="TestTextBox" Width="150" AutoCompleteType="Email" CssClass="text" />
    <act:TextBoxWatermarkExtender runat="server" TargetControlID="TestTextBox" ID="TargetExtender" WatermarkText="Lorem ipsum" WatermarkCssClass="watermark"/>

    <script>
        describe("TextBoxWatermark", function() {

            var TEXTBOX_WATERMARK_CLIENT_ID = "<%= TargetExtender.ClientID %>";

            describe("Rendering", function() {
               
                beforeEach(function() {
                    this.extender = $find(TEXTBOX_WATERMARK_CLIENT_ID);
                    this.watermarkText = "<%= TargetExtender.WatermarkText %>";

                    this.$element = $(this.extender._element);
                });

                it("textinput has proper value", function() {
                    expect(this.$element.val()).toBe(this.watermarkText);
                });

                it("textinput hasn't autocomplete attribute", function() {
                    expect(this.$element.attr("autocomplete")).toBeFalsy();
                });

                it("preserves original textbox CSS class when watermark CSS class applied", function() {
                    expect(this.$element.hasClass("text")).toBeTruthy();
                });

                it("adds watermark CSS class to the textbox", function() {
                    expect(this.$element.hasClass("watermark")).toBeTruthy();
                });

            });
        });
    </script>

</asp:Content>
