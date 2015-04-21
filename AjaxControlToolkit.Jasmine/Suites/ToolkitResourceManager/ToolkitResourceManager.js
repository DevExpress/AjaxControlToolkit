describe("ToolkitResourceManager", function() {

    describe("in Release mode", function() {
        beforeEach(function(done) {
            Testing.LoadSpec(done, "ToolkitResourceManager", "Specs/Release_Embedded");
        });

        it("has embedded script loaded", function() {
            expect(Testing.TestExtender.Release.Embedded).not.toBeUndefined();
        });

    });

    describe("in Release mode", function() {
        beforeEach(function(done) {
            Testing.LoadSpec(done, "ToolkitResourceManager", "Specs/Release_Static");
        });

        it("has static script loaded", function() {
            expect(Testing.TestExtender.Release.Static).not.toBeUndefined();
        });


    });

    describe("in Release mode", function() {
        beforeEach(function(done) {
            Testing.LoadSpec(done, "ToolkitResourceManager", "Specs/Release_Cdn");
        });

        it("has CDN script loaded", function() {
            expect(Testing.TestExtender.Release.Cdn).not.toBeUndefined();
        });

    });

    describe("in Debug mode", function() {
        beforeEach(function(done) {
            Testing.LoadSpec(done, "ToolkitResourceManager", "Specs/Debug_Embedded");
        });

        it("has embedded script loaded", function() {
            expect(Testing.TestExtender.Debug.Embedded).not.toBeUndefined();
        });
    });

    describe("in Debug mode", function() {
        beforeEach(function(done) {
            Testing.LoadSpec(done, "ToolkitResourceManager", "Specs/Debug_Static");
        });

        it("has static script loaded", function() {
            expect(Testing.TestExtender.Debug.Static).not.toBeUndefined();
        });
    });

    describe("in Debug mode", function() {
        beforeEach(function(done) {
            Testing.LoadSpec(done, "ToolkitResourceManager", "Specs/Debug_Cdn");
        });

        it("has CDN script loaded", function() {
            expect(Testing.TestExtender.Debug.Cdn).not.toBeUndefined();
        });
    });
});