describe("Slider", function() {

    var SLIDER_HORIZONTAL_RAIL_CLASS_NAME = "ajax__slider_h_rail",
        SLIDER_HORIZONTAL_HANDLE_CLASS_NAME = "ajax__slider_h_handle";

    beforeEach(function(done) {
        var that = this;

        Testing.LoadSpec(function() {
            that.element = Testing.Component._element;
            that.railElement = Testing.Component._railElement;
            that.handle = Testing.Component._handle;
            done();
        }, "Slider");
    });

    it("rail element has proper class and id", function() {
        expect($.inArray(SLIDER_HORIZONTAL_RAIL_CLASS_NAME, this.railElement.classList) != -1).toBeTruthy();
    });

    it("handle has proper class", function() {
        expect($.inArray(SLIDER_HORIZONTAL_HANDLE_CLASS_NAME, this.handle.classList) != -1).toBeTruthy();
    });
});