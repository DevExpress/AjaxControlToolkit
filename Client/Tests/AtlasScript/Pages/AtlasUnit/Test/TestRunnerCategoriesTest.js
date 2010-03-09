/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Test");

AtlasUnit.Test.TestRunnerCategoriesTest = function() {
    var suite;
    var runner;
    var resultCollector;

    this.setUp = function() {
        var suiteBuilder = new AtlasUnit.TestSuiteBuilder();
        suiteBuilder.addFixture(AtlasUnit.Test.TestRunnerCategoriesTest.TestFixtureNoCategories);
        suiteBuilder.addFixture(AtlasUnit.Test.TestRunnerCategoriesTest.TestFixture1);
        suite = suiteBuilder.build();

        runner = new AtlasUnit.TestRunner();
        resultCollector = new AtlasUnit.ResultCollector();
    }

    this.testExcludedCategories = function() {
        AtlasUnit.Assert.isEmpty(runner.get_excludedCategories());
        runner.set_excludedCategories(["foo", "bar"]);
        AtlasUnit.Assert.elementsEqual(["foo", "bar"], runner.get_excludedCategories());
        runner.set_excludedCategories(null);
        AtlasUnit.Assert.isEmpty(runner.get_excludedCategories());
    }

    this.testIncludedCategories = function() {
        AtlasUnit.Assert.isEmpty(runner.get_includedCategories());
        runner.set_includedCategories(["foo", "bar"]);
        AtlasUnit.Assert.elementsEqual(["foo", "bar"], runner.get_includedCategories());
        runner.set_includedCategories(null);
        AtlasUnit.Assert.isEmpty(runner.get_includedCategories());
    }

    function testCategories(includedCategories, excludedCategories, expectedRunNames) {
        runner.set_includedCategories(includedCategories);
        runner.set_excludedCategories(excludedCategories);

        suite.accept(runner);
        suite.accept(resultCollector);

        AtlasUnit.Assert.elementsEqual(expectedRunNames, resultCollector.get_runTestNames(), "Incorrect run tests");
        AtlasUnit.Assert.isEmpty(resultCollector.get_failedTestNames(), "Incorrect failed tests");
    }

    this.testNoCategories = function() {
        var runNames = ["root", "AtlasUnit", "Test", "TestRunnerCategoriesTest",
            "TestFixtureNoCategories", "testMethod",
            "TestFixture1", "testMethod", "testMethod1"];
        testCategories(null, null, runNames);
    }

    this.testIncludeFixture1 = function() {
        var runNames = ["root", "AtlasUnit", "Test", "TestRunnerCategoriesTest",
            "TestFixture1", "testMethod", "testMethod1"];
        testCategories(["Fixture1"], null, runNames);
    }

    this.testIncludeMethod1 = function() {
        var runNames = ["root", "AtlasUnit", "Test", "TestRunnerCategoriesTest",
            "TestFixture1", "testMethod1"];
        testCategories(["Method1"], null, runNames);
    }

    this.testExcludeFixture1 = function() {
        var runNames = ["root", "AtlasUnit", "Test", "TestRunnerCategoriesTest",
            "TestFixtureNoCategories", "testMethod"];
        testCategories(null, ["Fixture1"], runNames);
    }

    this.testExcludeMethod1 = function() {
        var runNames = ["root", "AtlasUnit", "Test", "TestRunnerCategoriesTest",
            "TestFixtureNoCategories", "testMethod",
            "TestFixture1", "testMethod"];
        testCategories(null, ["Method1"], runNames);
    }

    this.testIncludeMethod1ExcludeFixture1 = function() {
        var runNames = [];
        testCategories(["Method1"], ["Fixture1"], runNames);
    }

}
AtlasUnit.Test.TestRunnerCategoriesTest.registerClass("AtlasUnit.Test.TestRunnerCategoriesTest");
AtlasUnit.Test.TestRunnerCategoriesTest["AtlasUnit.IsTestFixture"] = true;


AtlasUnit.Test.TestRunnerCategoriesTest.TestFixtureNoCategories = function() {
    this.testMethod = function() {
    }
}
AtlasUnit.Test.TestRunnerCategoriesTest.TestFixtureNoCategories.registerClass(
    "AtlasUnit.Test.TestRunnerCategoriesTest.TestFixtureNoCategories");

AtlasUnit.Test.TestRunnerCategoriesTest.TestFixture1 = function() {
    this.testMethod = function() {
    }

    this.testMethod1 = function() {
    }
    this.testMethod1["AtlasUnit.Categories"] = ["Method1"];
}
AtlasUnit.Test.TestRunnerCategoriesTest.TestFixture1.registerClass(
    "AtlasUnit.Test.TestRunnerCategoriesTest.TestFixture1");
AtlasUnit.Test.TestRunnerCategoriesTest.TestFixture1["AtlasUnit.Categories"] = ["Fixture1"];

Sys.Application.notifyScriptLoaded();
