<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="SliderTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.SliderTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    Slider
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:TextBox runat="server"
        ID="HorizontalTarget" />
    <act:SliderExtender runat="server"
        ID="HorizontalTargetExtender"
        TargetControlID="HorizontalTarget"
        Minimum="0"
        Maximum="100" />

    <asp:TextBox runat="server"
        ID="VerticalTarget" />
    <act:SliderExtender runat="server"
        ID="VerticalTargetExtender"
        TargetControlID="VerticalTarget"
        Orientation="Vertical"
        Minimum="0"
        Maximum="100" />

    <script>
        describe("Slider", function() {

            var SLIDER_HORIZONTAL_RAIL_CLASS_NAME = "ajax__slider_h_rail",
                SLIDER_HORIZONTAL_HANDLE_CLASS_NAME = "ajax__slider_h_handle",
                SLIDER_VERTICAL_RAIL_CLASS_NAME = "ajax__slider_v_rail",
                SLIDER_VERTICAL_HANDLE_CALSS_NAME = "ajax__slider_v_handle";

            beforeEach(function() {
                this.hExtender = $find("<%= HorizontalTargetExtender.ClientID %>");
                this.hElement = this.hExtender._element;
                this.hRailElement = this.hExtender._railElement;
                this.hHandle = this.hExtender._handle;

                this.vExtender = $find("<%= VerticalTargetExtender.ClientID %>");
                this.vElement = this.vExtender._element;
                this.vRailElement = this.vExtender._railElement;
                this.vHandle = this.vExtender._handle;
            });

            it("horizontal and vertical rail elements have proper class and id", function() {
                expect($.inArray(SLIDER_HORIZONTAL_RAIL_CLASS_NAME, this.hRailElement.classList) != -1).toBeTruthy();
                expect($.inArray(SLIDER_VERTICAL_RAIL_CLASS_NAME, this.vRailElement.classList) != -1).toBeTruthy();
            });

            it("horizontal and vertical handles have proper class", function() {
                expect($.inArray(SLIDER_HORIZONTAL_HANDLE_CLASS_NAME, this.hHandle.classList) != -1).toBeTruthy();
                expect($.inArray(SLIDER_VERTICAL_HANDLE_CALSS_NAME, this.vHandle.classList) != -1).toBeTruthy();
            });

            it("horizontal handle has proper styles", function() {
                var $handle = $(this.hHandle);

                expect($handle.css("position")).toBe("absolute");
                expect($handle.css("left")).toBeAnyOf(["0", "0px"]);
                expect($handle.css("top")).toBeAnyOf(["0", "0px", "auto"]);
                expect($handle.css("overflow")).toBe("hidden");
            });

            it("vertical handle has proper styles", function() {
                var $handle = $(this.vHandle);

                expect($handle.css("position")).toBe("absolute");
                expect($handle.css("left")).toBeAnyOf(["0", "0px", "auto"]);
                expect($handle.css("top")).toBeAnyOf(["0", "0px"]);
                expect($handle.css("overflow")).toBe("hidden");
            });

            it("horizontal handle changes left position and does not change top position on drag", function() {
                var $handle = $(this.hHandle);

                $handle.simulate("drag", {
                    dx: 100,
                    dy: 20
                });

                expect($handle.css("left")).toBeAnyOf(["100", "100px"]);
                expect($handle.css("top")).toBeAnyOf(["0", "0px"]);
            });

            it("vertical handle changes top position and does not change left position on drag", function() {
                var $handle = $(this.vHandle);

                $handle.simulate("drag", {
                    dx: 20,
                    dy: 100
                });

                expect($handle.css("left")).toBeAnyOf(["0", "0px"]);
                expect($handle.css("top")).toBeAnyOf(["100", "100px"]);
            });

            it("horizontal handle stays at zero position when trying to drag it left overly", function() {
                var $handle = $(this.hHandle);

                $handle.simulate("drag", {
                    dx: -100,
                    dy: 0
                });

                expect($handle.css("left")).toBeAnyOf(["0", "0px"]);
            });

            it("vertical handle stays at zero position when trying to drag it top overly", function() {
                var $handle = $(this.vHandle);

                $handle.simulate("drag", {
                    dx: 0,
                    dy: -100
                });

                expect($handle.css("top")).toBeAnyOf(["0", "0px"]);
            });

            // CodePlex item 27857
            it("vertical handle css property 'display' is 'block'", function() {
                var $handle = $(this.vHandle);

                expect($handle.css("display")).toBe("block");
            });
        });

    </script>
</asp:Content>
