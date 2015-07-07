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

                it("icon cell image has proper width and height", function() {
                	var $iconCellImage = this.$container.find(VALIDATOR_CALLOUT_ICON_CELL_CLASS_NAME.toClassSelector()).children("img");

                	expect($iconCellImage.width()).toBe(VALIDATOR_CALLOUT_ERROR_IMAGE_WIDTH);
                	expect($iconCellImage.height()).toBe(VALIDATOR_CALLOUT_ERROR_IMAGE_HEIGHT);
                });

                it("error message cell contains proper html", function() {
                	var $errorMessageCell = this.$container.find(VALIDATOR_CALLOUT_ERROR_MESSAGE_CELL_CLASS_NAME.toClassSelector());

                	expect($errorMessageCell.html()).toBe(REQUIRED_FIELD_VALIDATOR_ERROR_MESSAGE);
                });

                it("close button cell contains close image", function() {
                	var $closeButtonCell = this.$container.find(VALIDATOR_CALLOUT_CLOSE_BUTTON_CELL_CLASS_NAME.toClassSelector());

                	expect($closeButtonCell.find("img").length).toBe(1)
                });

                it("close button cell image has proper width and height", function() {
                	var $closeButtonImage = this.$container.find(VALIDATOR_CALLOUT_CLOSE_BUTTON_CELL_CLASS_NAME.toClassSelector()).find("img");

                	expect($closeButtonImage.width()).toBe(VALIDATOR_CALLOUT_CLOSE_BUTTON_IMAGE_WIDTH);
                	expect($closeButtonImage.height()).toBe(VALIDATOR_CALLOUT_CLOSE_BUTTON_IMAGE_HEIGHT);
                });
            });
        });
    </script>

</asp:Content>
