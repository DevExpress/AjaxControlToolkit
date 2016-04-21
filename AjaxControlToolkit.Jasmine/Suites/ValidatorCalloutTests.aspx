<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="ValidatorCalloutTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ValidatorCalloutTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    ValidatorCallout
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:TextBox runat="server"
        ID="TestTextBox">
    </asp:TextBox>

    <asp:RequiredFieldValidator runat="server"
        ID="TestRequiredFieldValidator"
        ControlToValidate="TestTextBox"
        ErrorMessage="<b>Required field missing</b> <br> Text required"
        Display="None">
    </asp:RequiredFieldValidator>
    <act:ValidatorCalloutExtender runat="server"
        ID="TargetExtender"
        TargetControlID="TestRequiredFieldValidator">
    </act:ValidatorCalloutExtender>

    <script>
        describe("ValidatorCallout", function() {

            var VALIDATOR_CALLOUT_EXTENDER_CLIENT_ID = "<%= TargetExtender.ClientID %>",
                REQUIRED_FIELD_VALIDATOR_ERROR_MESSAGE = "<%= TestRequiredFieldValidator.ErrorMessage %>";

            var VALIDATOR_CALLOUT_POPUP_TABLE_CLASS_NAME = "ajax__validatorcallout_popup_table",
                VALIDATOR_CALLOUT_CALLOUT_TABLE_CLASS_NAME = "ajax__validatorcallout_callout_table",
                VALIDATOR_CALLOUT_CALLOUT_TABLE_ROW_CLASS_NAME = "ajax__validatorcallout_callout_table_row",
                VALIDATOR_CALLOUT_CALLOUT_ARROW_CELL_CLASS_NAME = "ajax__validatorcallout_callout_arrow_cell",
                VALIDATOR_CALLOUT_POPUP_TABLE_ROW_CLASS_NAME = "ajax__validatorcallout_popup_table_row",
                VALIDATOR_CALLOUT_CALLOUT_CELL_CLASS_NAME = "ajax__validatorcallout_callout_cell",
                VALIDATOR_CALLOUT_ICON_CELL_CLASS_NAME = "ajax__validatorcallout_icon_cell",
                VALIDATOR_CALLOUT_ERROR_MESSAGE_CELL_CLASS_NAME = "ajax__validatorcallout_error_message_cell",
                VALIDATOR_CALLOUT_CLOSE_BUTTON_CELL_CLASS_NAME = "ajax__validatorcallout_close_button_cell";

            var VALIDATOR_CALLOUT_ERROR_IMAGE_WIDTH = 31,
            	VALIDATOR_CALLOUT_ERROR_IMAGE_HEIGHT = 32,
            	VALIDATOR_CALLOUT_CLOSE_BUTTON_IMAGE_WIDTH = 6,
            	VALIDATOR_CALLOUT_CLOSE_BUTTON_IMAGE_HEIGHT = 6;

            describe("Rendering", function() {
                beforeEach(function() {
                    this.extender = $find(VALIDATOR_CALLOUT_EXTENDER_CLIENT_ID);

                    this.extender._ensureCallout();
                    this.extender.show();

                    this.$container = $(this.extender._popupTable);
                });

                it("contains row element", function() {
                    expect(this.$container.find(VALIDATOR_CALLOUT_POPUP_TABLE_ROW_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("row element contains callout cell", function() {
                    var $row = this.$container.find(VALIDATOR_CALLOUT_POPUP_TABLE_ROW_CLASS_NAME.toClassSelector());

                    expect($row.find(VALIDATOR_CALLOUT_CALLOUT_CELL_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("row element contains icon cell", function() {
                    var $row = this.$container.find(VALIDATOR_CALLOUT_POPUP_TABLE_ROW_CLASS_NAME.toClassSelector());

                    expect($row.find(VALIDATOR_CALLOUT_ICON_CELL_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("row element contains error message cell", function() {
                    var $row = this.$container.find(VALIDATOR_CALLOUT_POPUP_TABLE_ROW_CLASS_NAME.toClassSelector());

                    expect($row.find(VALIDATOR_CALLOUT_ERROR_MESSAGE_CELL_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("row element contains close button cell", function() {
                    var $row = this.$container.find(VALIDATOR_CALLOUT_POPUP_TABLE_ROW_CLASS_NAME.toClassSelector());

                    expect($row.find(VALIDATOR_CALLOUT_CLOSE_BUTTON_CELL_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("callout cell contains callout table", function() {
                    var $calloutCell = this.$container.find(VALIDATOR_CALLOUT_CALLOUT_CELL_CLASS_NAME.toClassSelector());

                    expect($calloutCell.find(VALIDATOR_CALLOUT_CALLOUT_TABLE_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("callout table contains callout table row", function() {
                    var $calloutTable = this.$container.find(VALIDATOR_CALLOUT_CALLOUT_TABLE_CLASS_NAME.toClassSelector());

                    expect($calloutTable.find(VALIDATOR_CALLOUT_CALLOUT_TABLE_ROW_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("callout table row contains arrow cell", function() {
                    var $calloutTableRow = this.$container.find(VALIDATOR_CALLOUT_CALLOUT_TABLE_ROW_CLASS_NAME.toClassSelector());

                    expect($calloutTableRow.find(VALIDATOR_CALLOUT_CALLOUT_ARROW_CELL_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("icon cell contains img", function() {
                    var $iconCell = this.$container.find(VALIDATOR_CALLOUT_ICON_CELL_CLASS_NAME.toClassSelector());

                    expect($iconCell.find("img").length).toBe(1);
                });

                it("icon cell image has proper width and height", function(done) {
                    var self = this;
                    
                    setTimeout(function() {
                        var $iconCellImage = self.$container.find(VALIDATOR_CALLOUT_ICON_CELL_CLASS_NAME.toClassSelector()).children("img");

                        setTimeout(function() {
                            expect($iconCellImage.width()).toBe(VALIDATOR_CALLOUT_ERROR_IMAGE_WIDTH);
                            expect($iconCellImage.height()).toBe(VALIDATOR_CALLOUT_ERROR_IMAGE_HEIGHT);
                            done();
                        }, 500);
                    }, 500);
                });

                it("error message cell contains proper html", function() {
                    var $errorMessageCell = this.$container.find(VALIDATOR_CALLOUT_ERROR_MESSAGE_CELL_CLASS_NAME.toClassSelector());

                    expect($errorMessageCell.html()).toBe(REQUIRED_FIELD_VALIDATOR_ERROR_MESSAGE);
                });

                it("close button cell contains close image", function() {
                    var $closeButtonCell = this.$container.find(VALIDATOR_CALLOUT_CLOSE_BUTTON_CELL_CLASS_NAME.toClassSelector());

                    expect($closeButtonCell.find("img").length).toBe(1)
                });

                it("close button cell image has proper width and height", function(done) {
                    var self = this;
                    setTimeout(function() {
                        var $closeButtonImage = self.$container.find(VALIDATOR_CALLOUT_CLOSE_BUTTON_CELL_CLASS_NAME.toClassSelector()).find("img");
                        setTimeout(function() {
                            var width = $closeButtonImage.width();
                            var height = $closeButtonImage.height();
                            expect(width).toBe(VALIDATOR_CALLOUT_CLOSE_BUTTON_IMAGE_WIDTH);
                            expect(height).toBe(VALIDATOR_CALLOUT_CLOSE_BUTTON_IMAGE_HEIGHT);
                            done();
                        }, 500);
                    }, 500);
                });

                it("popup table hasn't cellpadding attribute", function() {
                    expect(this.$container.attr("cellpadding")).toBeFalsy();
                });

                it("callout cell has proper padding", function() {
                    var $calloutCell = this.$container.find(VALIDATOR_CALLOUT_CALLOUT_CELL_CLASS_NAME.toClassSelector());

                    //expect($calloutCell.css("padding")).toBeAnyOf(["0", "0px"]);
                    expect($calloutCell.css("padding-top")).toBeAnyOf(["0", "0px"]);
                    expect($calloutCell.css("padding-right")).toBeAnyOf(["0", "0px"]);
                    expect($calloutCell.css("padding-bottom")).toBeAnyOf(["0", "0px"]);
                    expect($calloutCell.css("padding-left")).toBeAnyOf(["0", "0px"]);
                });

                it("icon cell has proper padding", function() {
                    var $iconCell = this.$container.find(VALIDATOR_CALLOUT_ICON_CELL_CLASS_NAME.toClassSelector());

                    expect($iconCell.css("padding-top")).toBe("5px");
                    expect($iconCell.css("padding-right")).toBe("5px");
                    expect($iconCell.css("padding-bottom")).toBe("5px");
                    expect($iconCell.css("padding-left")).toBe("5px");
                });

                it("error message cell has proper padding", function() {
                    var $errorMessageCell = this.$container.find(VALIDATOR_CALLOUT_ERROR_MESSAGE_CELL_CLASS_NAME.toClassSelector());

                    expect($errorMessageCell.css("padding-top")).toBe("5px");
                    expect($errorMessageCell.css("padding-right")).toBe("5px");
                    expect($errorMessageCell.css("padding-bottom")).toBe("5px");
                    expect($errorMessageCell.css("padding-left")).toBe("5px");
                });

                it("close button cell has proper padding", function() {
                    var $closeButtonCell = this.$container.find(VALIDATOR_CALLOUT_CLOSE_BUTTON_CELL_CLASS_NAME.toClassSelector());

                    expect($closeButtonCell.css("padding-top")).toBeAnyOf(["0", "0px"]);
                    expect($closeButtonCell.css("padding-right")).toBeAnyOf(["0", "0px"]);
                    expect($closeButtonCell.css("padding-bottom")).toBeAnyOf(["0", "0px"]);
                    expect($closeButtonCell.css("padding-left")).toBeAnyOf(["0", "0px"]);
                });

                it("popup table hasn't cellspacing attribute", function() {
                    expect(this.$container.attr("cellspacing")).toBeFalsy();
                });

                it("popup table has proper border spacing", function() {
                    expect(this.$container.css("border-spacing")).toBeAnyOf(["0 0", "0px 0px"]);
                });

                it("popup table hasn't border attribute", function() {
                    expect(this.$container.attr("border")).toBeFalsy();
                });

                it("popup table has proper border width", function() {
                    expect(this.$container.css("border-top-width")).toBeAnyOf(["0", "0px"]);
                    expect(this.$container.css("border-right-width")).toBeAnyOf(["0", "0px"]);
                    expect(this.$container.css("border-bottom-width")).toBeAnyOf(["0", "0px"]);
                    expect(this.$container.css("border-left-width")).toBeAnyOf(["0", "0px"]);
                });

                it("callout table hasn't cellpadding attribute", function() {
                    var $calloutTable = this.$container.find(VALIDATOR_CALLOUT_CALLOUT_TABLE_CLASS_NAME.toClassSelector());

                    expect($calloutTable.attr("cellpadding")).toBeFalsy();
                });

                it("callout arrow cell has proper paddings", function() {
                    var $calloutArrowCell = this.$container.find(VALIDATOR_CALLOUT_CALLOUT_ARROW_CELL_CLASS_NAME.toClassSelector());

                    expect($calloutArrowCell.css("padding-top")).toBe("8px");
                    expect($calloutArrowCell.css("padding-right")).toBeAnyOf(["0", "0px"]);
                    expect($calloutArrowCell.css("padding-bottom")).toBeAnyOf(["0", "0px"]);
                    expect($calloutArrowCell.css("padding-left")).toBeAnyOf(["0", "0px"]);
                });

                it("callout table hasn't cellspacing attribute", function() {
                    var $calloutTable = this.$container.find(VALIDATOR_CALLOUT_CALLOUT_TABLE_CLASS_NAME.toClassSelector());

                    expect($calloutTable.attr("cellspacing")).toBeFalsy();
                });

                it("callout table has proper border spacing", function() {
                    var $calloutTable = this.$container.find(VALIDATOR_CALLOUT_CALLOUT_TABLE_CLASS_NAME.toClassSelector());

                    expect($calloutTable.css("border-spacing")).toBeAnyOf(["0 0", "0px 0px"]);
                });

                it("callout table hasn't border attribute", function() {
                    var $calloutTable = this.$container.find(VALIDATOR_CALLOUT_CALLOUT_TABLE_CLASS_NAME.toClassSelector());

                    expect($calloutTable.attr("border")).toBeFalsy();
                });

                it("callout table has proper border width", function() {
                    var $calloutTable = this.$container.find(VALIDATOR_CALLOUT_CALLOUT_TABLE_CLASS_NAME.toClassSelector());

                    expect($calloutTable.css("border-top-width")).toBeAnyOf(["0", "0px"]);
                    expect($calloutTable.css("border-right-width")).toBeAnyOf(["0", "0px"]);
                    expect($calloutTable.css("border-bottom-width")).toBeAnyOf(["0", "0px"]);
                    expect($calloutTable.css("border-left-width")).toBeAnyOf(["0", "0px"]);
                });
            });
        });
    </script>

</asp:Content>
