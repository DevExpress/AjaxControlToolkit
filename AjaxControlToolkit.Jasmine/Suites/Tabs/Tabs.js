describe("Tabs", function () {
    var TABS_COUNT = 2,

        TAB_HEADER_CLASS_NAME = "ajax__tab_header",
        TAB_BODY_CLASS_NAME = "ajax__tab_body",

        ACTIVE_TAB_CLASS_NAME = "ajax__tab_active",
        DISABLED_TAB_CLASS_NAME = "ajax__tab_disabled",

        ACTIVE_TAB_PANEL_CLASS_NAME = "ajax__tab_panel",
        DISABLED_TAB_PANEL_CLASS_NAME = "aspNetDisabled",

        TAB_OUTER_CLASS_NAME = "ajax__tab_outer",
        TAB_INNER_CLASS_NAME = "ajax__tab_inner";

    var toClassSelector = function(className) {
        return "." + className;
    }

    beforeEach(function (done) {
        var that = this;

        Testing.LoadSpec(function () {
            that.element = Testing.Component._element;
            done();
        }, "Tabs");
    });

    it("base div element should have proper classes", function() {
        var classList = this.element.classList,
            expectedClassList = ["ajax__tab_xp", "ajax__tab_container", "ajax__tab_default"];

        for(var i = 0; i < expectedClassList.length; i++) {
            expect($.inArray(expectedClassList[i], classList) != -1).toBeTruthy();
        }
    });

    it("base div should contains 2 div elements", function () {
        var $element = $(this.element),
            innerElements = $element.children();

        expect(innerElements.length).toBe(2);

        expect($(innerElements).first().is("div")).toBeTruthy();
        expect($(innerElements).last().is("div")).toBeTruthy();
    });

    it("header div should have correct ID and class", function() {
        var headerElements = $(this.element).find(toClassSelector(TAB_HEADER_CLASS_NAME));
        expect(headerElements.length).toBe(1);

        var headerId = headerElements[0].id;
        expect(headerId).toBe(this.element.id + "_header");
    });

    it("body div should have correct ID and class", function() {
        var bodyElements = $(this.element).find(toClassSelector(TAB_BODY_CLASS_NAME));
        expect(bodyElements.length).toBe(1);

        var bodyId = bodyElements[0].id;
        expect(bodyId).toBe(this.element.id + "_body");
    });

    it("header div should contain " + TABS_COUNT + " span elements", function() {
        var header = $(this.element).find(toClassSelector(TAB_HEADER_CLASS_NAME));

        expect($(header).children().length).toBe(TABS_COUNT);
        expect($(header).children().eq(0).is("span")).toBeTruthy();
        expect($(header).children().eq(1).is("span")).toBeTruthy();
    });

    it("first(active) tab header should have proper ID and class", function() {
        var header = $(this.element).find(toClassSelector(TAB_HEADER_CLASS_NAME)),
            firstHeader = header.children()[0];

        expect(firstHeader.id).toBe(this.element.id + "_ActiveTabPanel_tab");
        expect($.inArray(ACTIVE_TAB_CLASS_NAME, firstHeader.classList) != -1).toBeTruthy();
    });

    it("second(disabled) tab header should have proper ID and class", function() {
        var header = $(this.element).find(toClassSelector(TAB_HEADER_CLASS_NAME)),
            secondHeader = header.children()[1];

        expect(secondHeader.id).toBe(this.element.id + "_DisabledTabPanel_tab");
        expect($.inArray(DISABLED_TAB_CLASS_NAME, secondHeader.classList) != -1).toBeTruthy();
    });

    it("boby div should contain " + TABS_COUNT + " div elements", function() {
        var body = $(this.element).find(toClassSelector(TAB_BODY_CLASS_NAME));

        expect($(body).children().length).toBe(TABS_COUNT);
        expect($(body).children().eq(0).is("div")).toBeTruthy();
        expect($(body).children().eq(1).is("div")).toBeTruthy();
    });

    it("first(active) tab body should have proper ID and class", function() {
        var body = $(this.element).find(toClassSelector(TAB_BODY_CLASS_NAME)),
            firstTabBody = body.children()[0];

        expect(firstTabBody.id).toBe(this.element.id + "_ActiveTabPanel");
        expect($.inArray(ACTIVE_TAB_PANEL_CLASS_NAME, firstTabBody.classList) != -1).toBeTruthy();
    });

    it("second(disabled) tab body should have proper ID and class", function() {
        var body = $(this.element).find(toClassSelector(TAB_BODY_CLASS_NAME)),
            secondTabBody = body.children()[1];

        expect(secondTabBody.id).toBe(this.element.id + "_DisabledTabPanel");
        expect($.inArray(DISABLED_TAB_PANEL_CLASS_NAME, secondTabBody.classList) != -1).toBeTruthy();
    });

    it("any tab header should contain outer and inner inserted spans", function() {
        var header = $(this.element).find(toClassSelector(TAB_HEADER_CLASS_NAME)),
            $headerTab = header.children("span").eq(0);

        expect($headerTab.children().length).toBe(1);
        expect($headerTab.children().eq(0).is("span")).toBeTruthy();
        expect($headerTab.children().eq(0).attr("class")).toBe(TAB_OUTER_CLASS_NAME);

        expect($headerTab.children().children().length).toBe(1);
        expect($headerTab.children().children().eq(0).is("span")).toBeTruthy();
        expect($headerTab.children().children().eq(0).attr("class")).toBe(TAB_INNER_CLASS_NAME);
    });
});