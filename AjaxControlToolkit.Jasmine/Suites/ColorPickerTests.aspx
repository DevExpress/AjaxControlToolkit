﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="ColorPickerTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ColorPickerTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    ColorPicker
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:TextBox runat="server"
        ID="TestTextBox"
        MaxLength="6"
        AutoCompleteType="None"/>

    <act:ColorPickerExtender runat="server"
        TargetControlID="TestTextBox"
        ID="TargetExtender" />

    <asp:TextBox runat="server"
        ID="TestTextBox2"
        MaxLength="6"
        AutoCompleteType="None"/>

    <act:ColorPickerExtender runat="server"
        TargetControlID="TestTextBox2"
        ID="TargetExtenderRgb"
        PaletteStyle="Continuous" />

    <script>
        describe("ColorPicker", function() {

            var COLOR_PICKER_EXTENDER_CLIENT_ID = "<%= TargetExtender.ClientID %>";
            var COLOR_PICKER_RGB_EXTENDER_CLIENT_ID = "<%= TargetExtenderRgb.ClientID %>";

            var COLOR_PICKER_CONTAINER_CLASS_NAME = "ajax__colorPicker_container",
                COLOR_PICKER_ROW_COUNT = 12,
                COLOR_PICKER_COLUMN_COUNT = 18;

            describe("Rendering", function() {
               
                beforeEach(function() {
                    this.extender = $find(COLOR_PICKER_EXTENDER_CLIENT_ID);
                    this.rgbExtender = $find(COLOR_PICKER_RGB_EXTENDER_CLIENT_ID);

                    this.extender.show();

                    this.$container = $(this.extender._container);
                    this.$rgbContainer = $(this.rgbExtender._container);
                });

                it("container contains popup div", function() {
                    expect(this.$container.find(COLOR_PICKER_CONTAINER_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("container popup contains table", function() {
                    var $popup = this.$container.find(COLOR_PICKER_CONTAINER_CLASS_NAME.toClassSelector());

                    expect($popup.find("table").length).toBe(1);
                });

                it("table contains proper count of rows and columns", function() {
                    var $colorPickerTable = this.$container.find("table");

                    expect($colorPickerTable.find("tr").length).toBe(COLOR_PICKER_ROW_COUNT);
                    expect($colorPickerTable.find("td").length).toBe(COLOR_PICKER_ROW_COUNT * COLOR_PICKER_COLUMN_COUNT);
                });

                it("table hasn't cellpadding attribute", function() {
                    var $colorPickerTable = this.$container.find("table");

                    expect($colorPickerTable.attr("cellpadding")).toBeFalsy();
                });

                it("table cell has proper padding", function() {
                    var $colorPickerTableCell = this.$container.find("table td").first();

                    expect($colorPickerTableCell.css("padding-top")).toBeAnyOf(["0", "0px"]);
                    expect($colorPickerTableCell.css("padding-right")).toBeAnyOf(["0", "0px"]);
                    expect($colorPickerTableCell.css("padding-bottom")).toBeAnyOf(["0", "0px"]);
                    expect($colorPickerTableCell.css("padding-left")).toBeAnyOf(["0", "0px"]);
                });

                it("table hasn't cellspacing attribute", function() {
                    var $colorPickerTable = this.$container.find("table");

                    expect($colorPickerTable.attr("cellspacing")).toBeFalsy();
                });

                it("table has proper border spacing", function() {
                    var $colorPickerTable = this.$container.find("table");

                    expect($colorPickerTable.css("border-spacing")).toBe("1px 1px");
                });

                it("table hasn't border attribute", function() {
                    var $colorPickerTable = this.$container.find("table");

                    expect($colorPickerTable.attr("border")).toBeFalsy();
                });

                it("table has proper border width", function() {
                    var $colorPickerTable = this.$container.find("table");

                    expect($colorPickerTable.css("border-top-width")).toBe("1px");
                    expect($colorPickerTable.css("border-right-width")).toBe("1px");
                    expect($colorPickerTable.css("border-bottom-width")).toBe("1px");
                    expect($colorPickerTable.css("border-left-width")).toBe("1px");
                });

                it("uses continuous rgb palette", function () {
                    var $rgbColorPickerTable = this.$rgbContainer.find("table");
                    var rowCount = $rgbColorPickerTable.find("tr").length;
                    var columnCount = $rgbColorPickerTable.find("td").length / rowCount;
                    var tableBody = $rgbColorPickerTable.find("tbody")[0];

                    for(var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
                        var lastColor = undefined;

                        for(var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                            var cell = tableBody.rows[rowIndex].cells[columnIndex];
                            var hexColor = $(cell).find("div").attr("title").replace("#", "0x");
                            var colorValue = parseInt(hexColor);
                            var isNotDecreases = !lastColor ? true : colorValue >= lastColor;

                            if(!isNotDecreases)
                                fail();

                            lastColor = colorValue;
                        }
                    }

                    expect(1).toBe(1);
                });
            });
        });
    </script>

</asp:Content>
