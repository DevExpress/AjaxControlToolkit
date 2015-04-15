describe("ToolkitResourceManager", function() {

    beforeEach(function(done) {
        Testing.LoadSpec("ToolkitResourceManager", done);
    });

    it("has embedded script loaded", function() {
        expect(Testing.TestExtenderBehavior).not.toBeUndefined();
    });
});