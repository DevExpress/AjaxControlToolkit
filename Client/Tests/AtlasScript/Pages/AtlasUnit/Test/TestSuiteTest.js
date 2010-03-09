/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Test");

AtlasUnit.Test.TestSuiteTest = function() {
    var suite;

    this.testAccept = function() {
        var suiteBuilder = new AtlasUnit.TestSuiteBuilder();
        suiteBuilder.addFixture(AtlasUnit.Test.TestFixture);
        suiteBuilder.addFixture(AtlasUnit.Test.TestFixture2);
        suite = suiteBuilder.build();

        var visitor = new AtlasUnit.Test.LogVisitor();
        suite.accept(visitor);

        var expected = "visitEnter(root) visitEnter(AtlasUnit) visitEnter(Test) " +
            "visitEnter(TestFixture) visit(testMethod) visit(testBrokenMethod) visitLeave(TestFixture) " +
            "visitEnter(TestFixture2) visit(testMethod) visitLeave(TestFixture2) " +
            "visitLeave(Test) visitLeave(AtlasUnit) visitLeave(root) ";

        AtlasUnit.Assert.areEqual(expected, visitor.log);
    }

    this.testAddTestCase = function() {
        suite = new AtlasUnit.TestSuite("Suite1");
        var testFixture = new AtlasUnit.Test.TestFixture();
        var testCase = new AtlasUnit.TestCase(testFixture, "TestCase1");
        suite.add(testCase);

        var sb = new Sys.StringBuilder();
        sb.appendLine("Suite1");
        sb.appendLine("  TestCase1");
        var expected = sb.toString();
        var actual = AtlasUnit.Test.SuiteDumper.dump(suite);

        AtlasUnit.Assert.areEqual(expected, actual);
    }

    this.testAddDuplicateTestCase = function() {
        this.testAddTestCase();

        var testFixture = new AtlasUnit.Test.TestFixture();
        var testCase = new AtlasUnit.TestCase(testFixture, "TestCase1");
        suite.add(testCase);

        var sb = new Sys.StringBuilder();
        sb.appendLine("Suite1");
        sb.appendLine("  TestCase1");
        sb.appendLine("  TestCase1");
        var expected = sb.toString();
        var actual = AtlasUnit.Test.SuiteDumper.dump(suite);

        AtlasUnit.Assert.areEqual(expected, actual);
    }

    this.testAddMergeSuites = function() {
        suite = new AtlasUnit.TestSuite("Suite1");

        var childSuite = new AtlasUnit.TestSuite("ChildSuite1", "Suite1.ChildSuite1");
        var testFixture = new AtlasUnit.Test.TestFixture();
        var testCase = new AtlasUnit.TestCase(testFixture, "TestCase1");
        childSuite.add(testCase);
        suite.add(childSuite);

        childSuite = new AtlasUnit.TestSuite("ChildSuite1");
        testCase = new AtlasUnit.TestCase(testFixture, "TestCase2");
        childSuite.add(testCase);
        suite.add(childSuite);

        var sb = new Sys.StringBuilder();
        sb.appendLine("Suite1");
        sb.appendLine("  ChildSuite1");
        sb.appendLine("    TestCase1");
        sb.appendLine("    TestCase2");
        var expected = sb.toString();
        var actual = AtlasUnit.Test.SuiteDumper.dump(suite);

        AtlasUnit.Assert.areEqual(expected, actual);
    }

    this.testAddMergeNameConflict = function() {
        this.testAddMergeSuites();

        var childSuite = new AtlasUnit.TestSuite("ChildSuite1");
        var childChildSuite = new AtlasUnit.TestSuite("TestCase1");
        var testFixture = new AtlasUnit.Test.TestFixture();
        var testCase = new AtlasUnit.TestCase(testFixture, "ChildTestCase1");
        childChildSuite.add(testCase);
        childSuite.add(childChildSuite);
        suite.add(childSuite);

        var sb = new Sys.StringBuilder();
        sb.appendLine("Suite1");
        sb.appendLine("  ChildSuite1");
        sb.appendLine("    TestCase1");
        sb.appendLine("    TestCase2");
        sb.appendLine("    TestCase1");
        sb.appendLine("      ChildTestCase1");
        var expected = sb.toString();
        var actual = AtlasUnit.Test.SuiteDumper.dump(suite);

        AtlasUnit.Assert.areEqual(expected, actual);

    }
}
AtlasUnit.Test.TestSuiteTest.registerClass("AtlasUnit.Test.TestSuiteTest");
AtlasUnit.Test.TestSuiteTest["AtlasUnit.IsTestFixture"] = true;

Sys.Application.notifyScriptLoaded();
