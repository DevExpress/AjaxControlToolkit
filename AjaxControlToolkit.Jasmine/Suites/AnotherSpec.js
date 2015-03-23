describe("Another suite", function () {

    beforeEach(function (done) {
        Testing.LoadSpec("AnotherSpec", done);
    });

    it("must have 'Bingo' button", function () {
        expect(Testing.Target.value).toBe("Bingo");
    });

});