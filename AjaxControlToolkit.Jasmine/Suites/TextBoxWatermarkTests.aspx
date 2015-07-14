<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="TextBoxWatermarkTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.TextBoxWatermarkTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    TextBoxWatermark
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:TextBox runat="server" ID="TestTextBox" Width="150" AutoCompleteType="Email" />
    <act:TextBoxWatermarkExtender runat="server" TargetControlID="TestTextBox" ID="TargetExtender" WatermarkText="Lorem ipsum"/>

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

            });
        });
    </script>

</asp:Content>
