/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Test");

AtlasUnit.Test.CategoryCollectorTest = function() {
    var _suite;
    var _categoryCollector;

    this.setUp = function() {
        var suiteBuilder = new AtlasUnit.TestSuiteBuilder();
        suiteBuilder.addFixture(AtlasUnit.Test.CategoryCollectorTest.TestFixtureNoCategories);
        suiteBuilder.addFixture(AtlasUnit.Test.CategoryCollectorTest.TestFixture1);
        suiteBuilder.addFixture(AtlasUnit.Test.CategoryCollectorTest.TestFixture2);
        _suite = suiteBuilder.build();

        _categoryCollector = new AtlasUnit.CategoryCollector();
    }

    this.testGetCategories = function() {
        _suite.accept(_categoryCollector);
        AtlasUnit.Assert.elementsEqual(["Fixture1", "Fixture2", "Fixture3", "Method1"],
            _categoryCollector.get_categories());
    }
}
AtlasUnit.Test.CategoryCollectorTest.registerClass("AtlasUnit.Test.CategoryCollectorTest");
AtlasUnit.Test.CategoryCollectorTest["AtlasUnit.IsTestFixture"] = true;


AtlasUnit.Test.CategoryCollectorTest.TestFixtureNoCategories = function() {
    this.testMethod = function() {
    }
}
AtlasUnit.Test.CategoryCollectorTest.TestFixtureNoCategories.registerClass(
    "AtlasUnit.Test.CategoryCollectorTest.TestFixtureNoCategories");

AtlasUnit.Test.CategoryCollectorTest.TestFixture1 = function() {
    this.testMethod = function() {
    }

    this.testMethod1 = function() {
    }
    this.testMethod1["AtlasUnit.Categories"] = ["Method1"];
}
AtlasUnit.Test.CategoryCollectorTest.TestFixture1.registerClass(
    "AtlasUnit.Test.CategoryCollectorTest.TestFixture1");
AtlasUnit.Test.CategoryCollectorTest.TestFixture1["AtlasUnit.Categories"] = ["Fixture1"];

AtlasUnit.Test.CategoryCollectorTest.TestFixture2 = function() {
    this.testMethod = function() {
    }

    this.testMethod1 = function() {
    }
    // Test multiple uses of same category
    this.testMethod1["AtlasUnit.Categories"] = ["Method1"];
}
AtlasUnit.Test.CategoryCollectorTest.TestFixture2.registerClass(
    "AtlasUnit.Test.CategoryCollectorTest.TestFixture2");
// Test multiple categories in a single attribute
AtlasUnit.Test.CategoryCollectorTest.TestFixture2["AtlasUnit.Categories"] = ["Fixture2", "Fixture3"];

Sys.Application.notifyScriptLoaded();
