<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="ComboBoxTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ComboBoxTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    ComboBox
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <act:ComboBox runat="server"
        ID="TargetExtender"
        DropDownStyle="DropDownList"
        AutoCompleteMode="SuggestAppend" />

    <script>
        describe("ComboBox", function() {

            var COMBOBOX_CLIENT_ID = "<%= TargetExtender.ClientID %>";

            var COMBOBOX_INPUT_CONTAINER_CLASS_NAME = "ajax__combobox_inputcontainer",
                COMBOBOX_TEXTBOX_CONTAINER_CLASS_NAME = "ajax__combobox_textboxcontainer",
                COMBOBOX_BUTTON_CONTAINER_CLASS_NAME = "ajax__combobox_buttoncontainer",
                COMBOBOX_ITEM_LIST_CLASS_NAME = "ajax__combobox_itemlist";

            describe("Rendering", function() {
               
                beforeEach(function() {
                    this.extender = $find(COMBOBOX_CLIENT_ID);

                    this.$element = $(this.extender._element);
                    this.$itemsContainer = $(this.extender._optionListControl);
                });

                it("contains input container", function() {
                    expect(this.$element.children(COMBOBOX_INPUT_CONTAINER_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("input container contains textbox container", function() {
                    var $inputContainer = this.$element.children(COMBOBOX_INPUT_CONTAINER_CLASS_NAME.toClassSelector());

                    expect($inputContainer.find(COMBOBOX_TEXTBOX_CONTAINER_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("input container contains button container", function() {
                    var $inputContainer = this.$element.children(COMBOBOX_INPUT_CONTAINER_CLASS_NAME.toClassSelector());

                    expect($inputContainer.find(COMBOBOX_BUTTON_CONTAINER_CLASS_NAME.toClassSelector()).length).toBe(1);
                });

                it("textbox container contains textbox", function() {
                    var $textBoxContainer = this.$element.find(COMBOBOX_TEXTBOX_CONTAINER_CLASS_NAME.toClassSelector());

                    expect($textBoxContainer.children("input[type=text]").length).toBe(1);
                });

                it("button container contains button", function() {
                    var $buttonContainer = this.$element.find(COMBOBOX_BUTTON_CONTAINER_CLASS_NAME.toClassSelector());

                    expect($buttonContainer.children("button[type=button]").length).toBe(1);
                });

                it("items container has proper class", function() {
                    expect(this.$itemsContainer.hasClass(COMBOBOX_ITEM_LIST_CLASS_NAME)).toBeTruthy();
                });

                it("items container is not visible", function() {
                    expect(this.$itemsContainer.is(":visible")).toBeFalsy();
                });

                it("items container elements correspond with items list", function() {
                    for(var i = 0; i < this.extender._optionListItems.length; i += 1) {
                        var text = this.extender._optionListItems[i].text;

                        expect(this.$itemsContainer.children("li").eq(i).text()).toBe(text);
                    }
                });

                beforeEach(function() {
                    this.$input = this.$element.find("input[type=text]");
                    this.$button = this.$element.find("button[type=button]");
                })

                it("items container is visible after clicking on dropdown button", function() {
                    this.$button.click();

                    expect(this.$itemsContainer.is(":visible")).toBeTruthy();
                });
            });
        });
    </script>

</asp:Content>
