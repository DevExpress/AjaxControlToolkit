/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Test");

AtlasUnit.Test.TestRunnerTest = function() {
    var suite;
    var runner;
    var resultCollector;

    this.setUp = function() {
        var suiteBuilder = new AtlasUnit.TestSuiteBuilder();
        suiteBuilder.addFixture(AtlasUnit.Test.TestFixture);
        suiteBuilder.addFixture(AtlasUnit.Test.TestFixture2);
        suiteBuilder.addFixture(AtlasUnit.Test2.TestFixture3);
        suiteBuilder.addFixture(AtlasUnit.Test2.TestFixture4);
        suite = suiteBuilder.build();

        runner = new AtlasUnit.TestRunner(AtlasUnit.RunMode.SelectedTests);
        resultCollector = new AtlasUnit.ResultCollector();
    }

    this.testRunAll = function() {
        runner.set_runMode(AtlasUnit.RunMode.AllTests);
        suite.accept(runner);

        var runNames = ["root", "AtlasUnit", "Test",
            "TestFixture", "testMethod", "testBrokenMethod",
            "TestFixture2", "testMethod",
            "Test2",
            "TestFixture3", "testMethod",
            "TestFixture4", "testMethod"];
        var failedNames = ["testBrokenMethod", "TestFixture", "Test", "AtlasUnit", "root"];

        suite.accept(resultCollector);
        AtlasUnit.Assert.elementsEqual(runNames, resultCollector.get_runTestNames(), "Incorrect run tests");
        AtlasUnit.Assert.elementsEqual(failedNames.reverse(), resultCollector.get_failedTestNames(),
            "Incorrect failed tests");
    }

    this.testRunAllThrowOnFail = function() {
        runner.set_runMode(AtlasUnit.RunMode.AllTests);
        runner.set_throwOnFail(true);
        suite.accept(runner);
    }
    this.testRunAllThrowOnFail["AtlasUnit.ExpectedException"] = {
        message: "testBrokenMethod exception message"
    }

    this.testRunSelectedNone = function() {
        suite.accept(runner);

        suite.accept(resultCollector);
        AtlasUnit.Assert.isEmpty(resultCollector.get_runTestNames());
        AtlasUnit.Assert.isEmpty(resultCollector.get_failedTestNames());
    }

    // Run all tests, then run selected tests on same suite with none selected.  Verify that all
    // test results are reset to NotExecuted.
    this.testRerunSelectedNone = function() {
        this.testRunAll();
        runner.set_runMode(AtlasUnit.RunMode.SelectedTests);
        resultCollector = new AtlasUnit.ResultCollector();
        this.testRunSelectedNone();
    }

    this.testRunSelectedTestCaseFail = function() {
        suite.get_tests()[0].get_tests()[0].get_tests()[0].get_tests()[1].set_selected(true);
        suite.accept(runner);

        suite.accept(resultCollector);
        AtlasUnit.Assert.elementsEqual(["testBrokenMethod"], resultCollector.get_runTestNames());
        AtlasUnit.Assert.elementsEqual(["testBrokenMethod"], resultCollector.get_failedTestNames());
    }

    this.testRunSelectedTestCasePass = function() {
        suite.get_tests()[0].get_tests()[0].get_tests()[0].get_tests()[0].set_selected(true);
        suite.accept(runner);

        suite.accept(resultCollector);
        AtlasUnit.Assert.elementsEqual(["testMethod"], resultCollector.get_runTestNames());
        AtlasUnit.Assert.isEmpty(resultCollector.get_failedTestNames());
    }

    this.testRunSelectedLeafSuitePass = function() {
        suite.get_tests()[0].get_tests()[0].get_tests()[1].set_selected(true);
        suite.accept(runner);

        var runNames = ["TestFixture2", "testMethod"];

        suite.accept(resultCollector);
        AtlasUnit.Assert.elementsEqual(runNames, resultCollector.get_runTestNames(), "Incorrect tests run");
        AtlasUnit.Assert.isEmpty(resultCollector.get_failedTestNames(), "Incorrect failed tests");
    }

    this.testRunSelectedLeafSuiteFail = function() {
        suite.get_tests()[0].get_tests()[0].get_tests()[0].set_selected(true);
        suite.accept(runner);

        var runNames = ["TestFixture", "testMethod", "testBrokenMethod"];
        var failedNames = ["testBrokenMethod", "TestFixture"];

        suite.accept(resultCollector);
        AtlasUnit.Assert.elementsEqual(runNames, resultCollector.get_runTestNames(), "Incorrect tests run");
        AtlasUnit.Assert.elementsEqual(failedNames.reverse(), resultCollector.get_failedTestNames(),
            "Incorrect failed tests");
    }

    this.testRunSelectedCompositeSuitePass = function() {
        suite.get_tests()[0].get_tests()[1].set_selected(true);
        suite.accept(runner);

        var runNames = ["Test2",
                        "TestFixture3", "testMethod",
                        "TestFixture4", "testMethod"];

        suite.accept(resultCollector);
        AtlasUnit.Assert.elementsEqual(runNames, resultCollector.get_runTestNames(), "Incorrect tests run");
        AtlasUnit.Assert.isEmpty(resultCollector.get_failedTestNames(), "Incorrect failed tests");
    }

    this.testRunSelectedCompositeSuiteFail = function() {
        suite.get_tests()[0].get_tests()[0].set_selected(true);
        suite.accept(runner);

        var runNames = ["Test",
            "TestFixture", "testMethod", "testBrokenMethod",
            "TestFixture2", "testMethod"];
        var failedNames = ["testBrokenMethod", "TestFixture", "Test"];

        suite.accept(resultCollector);
        AtlasUnit.Assert.elementsEqual(runNames, resultCollector.get_runTestNames(), "Incorrect tests run");
        AtlasUnit.Assert.elementsEqual(failedNames.reverse(), resultCollector.get_failedTestNames(),
            "Incorrect failed tests");
    }

    this.testRunSelectedCompositeAndLeafSuitesPass = function() {
        suite.get_tests()[0].get_tests()[1].get_tests()[0].set_selected(true);
        this.testRunSelectedCompositeSuitePass();
    }

    this.testRunSelectedCompositeAndLeafSuitesFail = function() {
        suite.get_tests()[0].get_tests()[0].get_tests()[0].set_selected(true);
        this.testRunSelectedCompositeSuiteFail();
    }
}
AtlasUnit.Test.TestRunnerTest.registerClass("AtlasUnit.Test.TestRunnerTest");
AtlasUnit.Test.TestRunnerTest["AtlasUnit.IsTestFixture"] = true;

Sys.Application.notifyScriptLoaded();
