describe("HtmlEditor", function () {

    beforeEach(function (done) {
        Testing.LoadSpec(done, "HtmlEditor");
    });

    it("should not throw exception on submit if text is empty", function () {
        expect(function() {
            Testing.Component._editableDiv_submit();
        }).not.toThrow();
    });
});