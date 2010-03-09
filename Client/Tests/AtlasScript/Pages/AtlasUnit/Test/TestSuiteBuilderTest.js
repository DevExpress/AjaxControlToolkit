/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Test");

AtlasUnit.Test.TestSuiteBuilderTest = function() {
    var builder;

    this.setUp = function() {
        builder = new AtlasUnit.TestSuiteBuilder();
    }

    this.testAddFixture = function() {
        builder.addFixture(AtlasUnit.Test.TestFixture);
        builder.addFixture(AtlasUnit.Test.TestFixture2);
        builder.addFixture(AtlasUnit.Test2.TestFixture3);

        var root = builder.build();

        var sb = new Sys.StringBuilder();
        sb.appendLine("root");
        sb.appendLine("  AtlasUnit");
        sb.appendLine("    Test");
        sb.appendLine("      TestFixture");
        sb.appendLine("        testMethod");
        sb.appendLine("        testBrokenMethod");
        sb.appendLine("      TestFixture2");
        sb.appendLine("        testMethod");
        sb.appendLine("    Test2");
        sb.appendLine("      TestFixture3");
        sb.appendLine("        testMethod");
        var expected = sb.toString();

        var actual = AtlasUnit.Test.SuiteDumper.dump(root);
        AtlasUnit.Assert.areEqual(expected, actual);

        var fixture = root.get_tests()[0].get_tests()[0].get_tests()[0];
        AtlasUnit.Assert.areEqual("AtlasUnit.Test.TestFixture", fixture.get_fullName());
    }

    this.testAddNamespace = function() {
        builder.addNameSpace(AtlasUnit.Test2);

        var root = builder.build();

        var sb = new Sys.StringBuilder();
        sb.appendLine("root");
        sb.appendLine("  AtlasUnit");
        sb.appendLine("    Test2");
        sb.appendLine("      TestFixture3");
        sb.appendLine("        testMethod");
        sb.appendLine("      TestFixture4");
        sb.appendLine("        testMethod");
        var expected = sb.toString();

        var actual = AtlasUnit.Test.SuiteDumper.dump(root);

        AtlasUnit.Assert.areEqual(expected, actual);
    }

    this.testNonMethodStartsWithTest = function() {
        builder.addFixture(AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureNonMethodStartsWithTest);

        var root = builder.build();

        var sb = new Sys.StringBuilder();
        sb.appendLine("root");
        sb.appendLine("  AtlasUnit");
        sb.appendLine("    Test");
        sb.appendLine("      TestSuiteBuilderTest");
        sb.appendLine("        TestFixtureNonMethodStartsWithTest");
        sb.appendLine("          testMethod");
        var expected = sb.toString();

        var actual = AtlasUnit.Test.SuiteDumper.dump(root);

        AtlasUnit.Assert.areEqual(expected, actual);
    }

    this.testCategories = function() {
        builder.addFixture(AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureNoCategories);
        builder.addFixture(AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureCategory1MethodCategory2);

        var root = builder.build();

        var temp = root.get_tests()[0].get_tests()[0].get_tests()[0];

        var noCategoriesSuite = temp.get_tests()[0];
        AtlasUnit.Assert.areEqual("TestFixtureNoCategories", noCategoriesSuite.get_name());
        AtlasUnit.Assert.isEmpty(noCategoriesSuite.get_categories());
        var noCategoriesTest = noCategoriesSuite.get_tests()[0];
        AtlasUnit.Assert.areEqual("testMethod", noCategoriesTest.get_name());
        AtlasUnit.Assert.isEmpty(noCategoriesTest.get_categories());

        var categoriesSuite = temp.get_tests()[1];
        AtlasUnit.Assert.areEqual("TestFixtureCategory1MethodCategory2", categoriesSuite.get_name());
        AtlasUnit.Assert.elementsEqual(["Category1"], categoriesSuite.get_categories());
        var categoriesTest = categoriesSuite.get_tests()[0];
        AtlasUnit.Assert.areEqual("testMethod", categoriesTest.get_name());
        AtlasUnit.Assert.elementsEqual(["Category2"], categoriesTest.get_categories());
    }

    this.testExpectedException = function() {
        builder.addFixture(AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureExpectedException);

        var root = builder.build();

        var suite = root.get_tests()[0].get_tests()[0].get_tests()[0].get_tests()[0];
        AtlasUnit.Assert.areEqual("TestFixtureExpectedException", suite.get_name());

        var expectedExceptionNoneTest = suite.get_tests()[0];
        AtlasUnit.Assert.areEqual("testExpectedExceptionNone", expectedExceptionNoneTest.get_name());
        AtlasUnit.Assert.isNull(expectedExceptionNoneTest.get_expectedException());

        var expectedExceptionAnyTest = suite.get_tests()[1];
        AtlasUnit.Assert.areEqual("testExpectedExceptionAny", expectedExceptionAnyTest.get_name());
        assertMembersEqual({}, expectedExceptionAnyTest.get_expectedException());

        var expectedExceptionSpecificTest = suite.get_tests()[2];
        AtlasUnit.Assert.areEqual("testExpectedExceptionSpecific", expectedExceptionSpecificTest.get_name());
        var expected = {
            name: "NullArgument",
            message: "Argument arg1 is null.",
            argumentName: "arg1"
        };
        assertMembersEqual(expected, expectedExceptionSpecificTest.get_expectedException());
    }

    // Asserts that expected and actual have the exact same members
    var assertMembersEqual = function(expected, actual) {
        for (var member in expected) {
            AtlasUnit.Assert.areEqual(expected[member], actual[member]);
        }

        for (var member in actual) {
            AtlasUnit.Assert.areEqual(actual[member], expected[member]);
        }
    }
}
AtlasUnit.Test.TestSuiteBuilderTest.registerClass("AtlasUnit.Test.TestSuiteBuilderTest");
AtlasUnit.Test.TestSuiteBuilderTest["AtlasUnit.IsTestFixture"] = true;


AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureNonMethodStartsWithTest = function() {
    this.testMethod = function() {
    }

    this.testField = 0;
}
AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureNonMethodStartsWithTest.registerClass(
    "AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureNonMethodStartsWithTest");

AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureNoCategories = function() {
    this.testMethod = function() {
    }
}
AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureNoCategories.registerClass(
    "AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureNoCategories");

AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureCategory1MethodCategory2 = function() {
    this.testMethod = function() {
    }
    this.testMethod["AtlasUnit.Categories"] = ["Category2"];
}
AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureCategory1MethodCategory2.registerClass(
    "AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureCategory1MethodCategory2");
AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureCategory1MethodCategory2["AtlasUnit.Categories"] =
    ["Category1"];

AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureExpectedException = function() {
    this.testExpectedExceptionNone = function() {
    }

    this.testExpectedExceptionAny = function() {
    }
    this.testExpectedExceptionAny["AtlasUnit.ExpectedException"] = {};

    this.testExpectedExceptionSpecific = function() {
    }
    this.testExpectedExceptionSpecific["AtlasUnit.ExpectedException"] = {
        name: "NullArgument",
        message: "Argument arg1 is null.",
        argumentName: "arg1"
    };
}
AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureExpectedException.registerClass(
    "AtlasUnit.Test.TestSuiteBuilderTest.TestFixtureExpectedException");

Sys.Application.notifyScriptLoaded();
