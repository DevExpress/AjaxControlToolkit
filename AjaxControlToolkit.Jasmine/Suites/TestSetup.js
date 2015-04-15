describe("TestSetup", function () {

    beforeEach(function (done) {
        Testing.LoadSpec("TestSetup", done);
    });

    it("must have init value", function () {
        expect(Testing.Target.value).toBe("ABC");
    });

    it("must have changed value", function () {
        Testing.Target.value = "DEF";
        expect(Testing.Target.value).toBe("DEF");
    });

    it("must have init value again", function () {
        expect(Testing.Target.value).toBe("ABC");
    });

});