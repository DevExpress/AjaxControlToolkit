describe("CommonControl", function () {

    beforeEach(function (done) {
        Testing.LoadSpec("CommonControl", done);
    });

    it("must have init value", function () {
        expect(Testing.Target.value).toBe("ABC");
    });

    it("must have changed value", function () {
        Testing.Target.value = "DEF";
        expect(Testing.Target.value).toBe("DEF");
    });

    it("must have init value agin", function () {
        expect(Testing.Target.value).toBe("ABC");
    });

});