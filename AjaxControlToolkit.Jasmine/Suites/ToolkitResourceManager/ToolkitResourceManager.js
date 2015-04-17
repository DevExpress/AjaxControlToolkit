describe("ToolkitResourceManager", function() {

    beforeEach(function(done) {
        Testing.LoadSpec(done, "ToolkitResourceManager");
    });

    it("has embedded script loaded", function() {
        expect(Testing.TestExtenderBehavior).not.toBeUndefined();
    });
});