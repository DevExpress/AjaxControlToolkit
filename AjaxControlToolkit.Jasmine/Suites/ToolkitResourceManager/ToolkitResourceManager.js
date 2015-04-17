describe("ToolkitResourceManager", function() {

    describe("in Release mode", function() {
        beforeEach(function(done) {
            Testing.LoadSpec(done, "ToolkitResourceManager", "Release");
        });

        it("has embedded script loaded", function() {
            expect(Testing.TestExtenderBehavior.Release.Embedded).not.toBeUndefined();
        });

        it("has static script loaded", function() {
            expect(Testing.TestExtenderBehavior.Release.Static).not.toBeUndefined();
        });
    });

    describe("in Debug mode", function() {
        beforeEach(function(done) {
            Testing.LoadSpec(done, "ToolkitResourceManager", "Debug");
        });

        it("has embedded script loaded", function() {
            expect(Testing.TestExtenderBehavior.Debug.Embedded).not.toBeUndefined();
        });

        it("has static script loaded", function() {
            expect(Testing.TestExtenderBehavior.Debug.Static).not.toBeUndefined();
        });
    });
});