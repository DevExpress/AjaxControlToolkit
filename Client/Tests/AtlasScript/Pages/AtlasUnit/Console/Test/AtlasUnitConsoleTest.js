/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\AtlasUnit.js"/>
/// <reference path="..\..\..\AtlasUnitConsole.js"/>

Type.registerNamespace("AtlasUnit.Console.Test");

AtlasUnit.Console.Test.ResultSummaryGeneratorTest = function() {
    var _resultCollector;

    this.setUp = function() {
        var suiteBuilder = new AtlasUnit.TestSuiteBuilder();
        suiteBuilder.addFixture(AtlasUnit.Console.Test.TestFixture);
        suiteBuilder.addFixture(AtlasUnit.Console.Test.TestFixture2);
        var suite = suiteBuilder.build();

        var runner = new AtlasUnit.TestRunner();
        suite.accept(runner);

        _resultCollector = new AtlasUnit.ResultCollector();
        suite.accept(_resultCollector);
    }

    this.testSummary = function() {
        var sb = new Sys.StringBuilder();
        sb.appendLine(".FFF.");
        sb.appendLine("Tests Run: 5, Failures: 3, Time: 1.234 seconds");
        sb.appendLine();
        sb.appendLine("Failures:");
        sb.appendLine("1) AtlasUnit.Console.Test.TestFixture.testBrokenMethod: testBrokenMethod exception message");
        sb.appendLine("2) AtlasUnit.Console.Test.TestFixture.testNullException: ");
        sb.appendLine("3) AtlasUnit.Console.Test.TestFixture.testStringException: testStringException string");
        sb.appendLine();
        sb.appendLine("Tests Run:");
        sb.appendLine("AtlasUnit.Console.Test.TestFixture.testMethod");
        sb.appendLine("AtlasUnit.Console.Test.TestFixture.testBrokenMethod");
        sb.appendLine("AtlasUnit.Console.Test.TestFixture.testNullException");
        sb.appendLine("AtlasUnit.Console.Test.TestFixture.testStringException");
        sb.appendLine("AtlasUnit.Console.Test.TestFixture2.testMethod");

        var expectedSummary = sb.toString();
        var actualSummary = AtlasUnit.Console.ResultSummaryGenerator.generateSummary(
            _resultCollector.get_runTestCases(), _resultCollector.get_failedTestCases(), false, 1234);

        AtlasUnit.Assert.areEqual(expectedSummary, actualSummary);
    }

    this.testSummaryPlainLog = function() {
        var sb = new Sys.StringBuilder();
        sb.appendLine("AtlasUnit.Console.Test.TestFixture.testBrokenMethod FAILED");
        sb.appendLine("AtlasUnit.Console.Test.TestFixture.testMethod Pass");
        sb.appendLine("AtlasUnit.Console.Test.TestFixture.testNullException FAILED");
        sb.appendLine("AtlasUnit.Console.Test.TestFixture.testStringException FAILED");
        sb.append("AtlasUnit.Console.Test.TestFixture2.testMethod Pass");

        var expectedSummary = sb.toString();
        var actualSummary = AtlasUnit.Console.ResultSummaryGenerator.generateSummary(
            _resultCollector.get_runTestCases(), _resultCollector.get_failedTestCases(), true, 1234);

        AtlasUnit.Assert.areEqual(expectedSummary, actualSummary);
    }
}
AtlasUnit.Console.Test.ResultSummaryGeneratorTest.registerClass("AtlasUnit.Console.Test.ResultSummaryGeneratorTest");
AtlasUnit.Console.Test.ResultSummaryGeneratorTest["AtlasUnit.IsTestFixture"] = true;


AtlasUnit.Console.Test.TestFixture = function() {
    this.log = "";

    this.setUp = function() {
        this.log = "setUp ";
    }

    this.testMethod = function() {
        this.log += "testMethod ";
    }

    this.testBrokenMethod = function() {
        this.log += "testBrokenMethod ";
        throw new Error("testBrokenMethod exception message");
    }

    this.testNullException = function() {
        this.log += "testNullException ";
        throw null;
    }

    this.testStringException = function() {
        this.log += "testStringException ";
        throw "testStringException string";
    }

    this.tearDown = function() {
        this.log += "tearDown ";
    }
}
AtlasUnit.Console.Test.TestFixture.registerClass("AtlasUnit.Console.Test.TestFixture");


AtlasUnit.Console.Test.TestFixture2 = function() {
    this.testMethod = function() {
    }
}
AtlasUnit.Console.Test.TestFixture2.registerClass("AtlasUnit.Console.Test.TestFixture2");

Sys.Application.notifyScriptLoaded();