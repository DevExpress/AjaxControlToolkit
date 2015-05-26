describe("Slider", function() {

    var SLIDER_HORIZONTAL_RAIL_CLASS_NAME = "ajax__slider_h_rail",
        SLIDER_HORIZONTAL_HANDLE_CLASS_NAME = "ajax__slider_h_handle",
        SLIDER_VERTICAL_RAIL_CLASS_NAME = "ajax__slider_v_rail",
        SLIDER_VERTICAL_HANDLE_CALSS_NAME = "ajax__slider_v_handle";

    beforeEach(function(done) {
        var that = this;

        Testing.LoadSpec(function() {
            that.hExtender = Testing.HorizontalExtender;
            that.hElement = Testing.HorizontalExtender._element;
            that.hRailElement = Testing.HorizontalExtender._railElement;
            that.hHandle = Testing.HorizontalExtender._handle;

            that.vExtender = Testing.VerticalExtender;
            that.vElement = Testing.VerticalExtender._element;
            that.vRailElement = Testing.VerticalExtender._railElement;
            that.vHandle = Testing.VerticalExtender._handle;

            done();
        }, "Slider");
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
});