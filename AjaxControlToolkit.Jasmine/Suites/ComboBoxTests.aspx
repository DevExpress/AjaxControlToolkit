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
        function parseStyle(style) {
            var styleObject = {};

            var elements = style.split(";");
            for(var i = 0; i < elements.length; i++) {
                var styleKeyValue = elements[i].trim().split(":");

                if(styleKeyValue[0])
                    styleObject[styleKeyValue[0].trim()] = styleKeyValue[1].trim();
            }

            return styleObject;
        }

        function areEqual(obj1, obj2) {
            if(!compareFields(obj1, obj2))
                return false;

            if(!compareFields(obj2, obj1))
                return false;

            return true;
        }

        function compareFields(obj1, obj2) {
            for(var key in obj1)
                if(obj1[key] != obj2[key]) 
                    return false;

            return true;
        }

        describe("ComboBox", function() {

            var COMBOBOX_CLIENT_ID = "<%= TargetExtender.ClientID %>";

            var COMBOBOX_INPUT_CONTAINER_CLASS_NAME = "ajax__combobox_inputcontainer",
                COMBOBOX_TEXTBOX_CONTAINER_CLASS_NAME = "ajax__combobox_textboxcontainer",
                COMBOBOX_BUTTON_CONTAINER_CLASS_NAME = "ajax__combobox_buttoncontainer",
                COMBOBOX_ITEM_LIST_CLASS_NAME = "ajax__combobox_itemlist";

            var COMBOBOX_LIST_ITEM_HIGHLIGHT_STYLE = { "color": "highlighttext", "background-color": "highlight" };

            describe("Rendering", function() {

                beforeEach(function() {
                    this.extender = $find(COMBOBOX_CLIENT_ID);

                    this.$element = $(this.extender._element);
                    this.$itemsContainer = $(this.extender._optionListControl);

                    this.keyDownEvent = new Sys.UI.DomEvent({
                        keyCode: 40,
                        type: "keydown"
                    });
                    this.keyUpEvent = new Sys.UI.DomEvent({
                        keyCode: 38,
                        type: "keyup"
                    });

                    this.keyPressEvent = new Sys.UI.DomEvent({
                        keyCode: 97,
                        type: "keypress",
                        shiftKey: false,
                        rawEvent: {
                            code: 46
                        }
                    });

                    this.f5KeyPressEvent = new Sys.UI.DomEvent({
                        charCode: 0,
                        type: "keypress",
                        shiftKey: false
                    });

                    this.f5KeyPressEvent.charCode = 116;

                    this.enterPressEvent = new Sys.UI.DomEvent({
                        keyCode: 13,
                        type: "keypress",
                        shiftKey: false
                    });
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

                it("button has no explicit visibility set", function() {
                    var $buttonContainer = this.$element.find(COMBOBOX_BUTTON_CONTAINER_CLASS_NAME.toClassSelector());
                    var button = $buttonContainer.children("button[type=button]").get(0);
                    expect(button.style.visibility).toBe("");
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

                    this.$inputContainer = this.$element.children(COMBOBOX_INPUT_CONTAINER_CLASS_NAME.toClassSelector());
                })

                it("items container is visible after clicking on dropdown button", function() {
                    this.$button.click();

                    expect(this.$itemsContainer.is(":visible")).toBeTruthy();
                });

                it("input container hasn't cellpadding attribute", function() {
                    expect(this.$inputContainer.attr("cellpadding")).toBeFalsy();
                });

                it("input container cell has proper padding", function() {
                    var $cell = this.$inputContainer.find("td").first();

                    expect($cell.css("padding-top")).toBeAnyOf(["0", "0px"]);
                    expect($cell.css("padding-left")).toBeAnyOf(["0", "0px"]);
                    expect($cell.css("padding-bottom")).toBeAnyOf(["0", "0px"]);
                    expect($cell.css("padding-left")).toBeAnyOf(["0", "0px"]);
                });

                it("input container hasn't cellspacing attribute", function() {
                    expect(this.$inputContainer.attr("cellspacing")).toBeFalsy();
                });

                it("input container has proper border spacing", function() {
                    expect(this.$inputContainer.css("border-spacing")).toBeAnyOf(["0 0", "0px 0px"]);
                });

                it("items container is shown after keydown/keyup events", function() {
                    this.extender._handleArrowKey(this.keyDownEvent);
                    expect(this.$itemsContainer.is(":visible")).toBeTruthy();

                    this.extender._handleArrowKey(this.keyUpEvent);
                    expect(this.$itemsContainer.is(":visible")).toBeTruthy();
                });

                it("items container isn't shown after keydown/keyup events with shift key", function() {
                    this.extender._handleArrowKey($.extend(this.keyDownEvent, { shiftKey: true }));
                    expect(this.$itemsContainer.is(":visible")).toBeFalsy();

                    this.extender._handleArrowKey($.extend(this.keyUpEvent, { shiftKey: true }));
                    expect(this.$itemsContainer.is(":visible")).toBeFalsy();
                });

                it("first list item is selected after first keydown", function() {
                    this.extender._handleArrowKey(this.keyDownEvent);
                    var styleObject = parseStyle(this.$itemsContainer.children("li").first().attr("style"));
                    var stylesEqual = areEqual(styleObject, COMBOBOX_LIST_ITEM_HIGHLIGHT_STYLE);
                    expect(stylesEqual).toBe(true);
                });

                it("first list item is selected after first alphabetic keypress", function() {
                    this.extender._onTextBoxKeyPress(this.keyPressEvent);
                    var styleObject = parseStyle(this.$itemsContainer.children("li").first().attr("style"));
                    var stylesEqual = areEqual(styleObject, COMBOBOX_LIST_ITEM_HIGHLIGHT_STYLE);
                    expect(stylesEqual).toBe(true);
                });

                it("appropriate list item is selected after some keydowns", function() {
                    var itemsCount = this.extender._optionListItems.length;

                    for(var i = 0; i < itemsCount; i += 1) {
                        this.extender._handleArrowKey(this.keyDownEvent);
                    }

                    var styleObject = parseStyle(this.$itemsContainer.children("li").eq(itemsCount - 1).attr("style"));
                    var stylesEqual = areEqual(styleObject, COMBOBOX_LIST_ITEM_HIGHLIGHT_STYLE);
                    expect(stylesEqual).toBe(true);
                });

                it("highlight list item is not changed after keyup, if it were the first one", function() {
                    this.extender._handleArrowKey(this.keyDownEvent);
                    this.extender._handleArrowKey(this.keyUpEvent);

                    var styleObject = parseStyle(this.$itemsContainer.children("li").eq(0).attr("style"));
                    var stylesEqual = areEqual(styleObject, COMBOBOX_LIST_ITEM_HIGHLIGHT_STYLE);
                    expect(stylesEqual).toBe(true);
                });

                it("highlight list item is not changed after keydown, if it were the last one", function() {
                    var itemsCount = this.extender._optionListItems.length;

                    for(var i = 0; i < itemsCount; i += 1) {
                        this.extender._handleArrowKey(this.keyDownEvent);
                    }

                    var styleObject = parseStyle(this.$itemsContainer.children("li").eq(itemsCount - 1).attr("style"));
                    var stylesEqual = areEqual(styleObject, COMBOBOX_LIST_ITEM_HIGHLIGHT_STYLE);
                    expect(stylesEqual).toBe(true);
                });

                it("F5 handles correctly (CodePlex item 27480)", function() {
                    var info = this.extender._getTextSelectionInfo(this.extender.get_textBoxControl(), this.f5KeyPressEvent);

                    expect(info.typedCharacter).toBe(String.fromCharCode(0));
                });

                it("dropdown button has no tabbing", function() {
                    expect(this.$button.attr("tabindex")).toBe("-1");
                });

                it("does not postback on item Enter press", function() {
                    spyOn(window, '__doPostBack').and.callFake(function() { });
                    this.extender._handleArrowKey(this.keyDownEvent);
                    this.extender._handleEnterKey(this.enterPressEvent);
                    expect(__doPostBack).not.toHaveBeenCalled();
                });
            });
        });
    </script>

</asp:Content>
