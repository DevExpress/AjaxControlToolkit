/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Test");

AtlasUnit.Test.TestCaseTest = function() {
    this.testAccept = function() {
        var testFixture = new AtlasUnit.Test.TestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testMethod");
        var visitor = new AtlasUnit.Test.LogVisitor();
        test.accept(visitor);

        AtlasUnit.Assert.areEqual("visit(testMethod) ", visitor.log);
    }

    this.testName = function() {
        var testFixture = new AtlasUnit.Test.TestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testMethod");

        AtlasUnit.Assert.areEqual("testMethod", test.get_name());
    }

    this.testNotRun = function() {
        var testFixture = new AtlasUnit.Test.TestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testMethod");

        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.NotExecuted, result.get_executionStatus(),
            AtlasUnit.ExecutionStatus);
    }

    this.testRunPass = function() {
        var testFixture = new AtlasUnit.Test.TestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testMethod");
        test.run();

        AtlasUnit.Assert.areEqual("setUp testMethod tearDown ", testFixture.log);
        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.Succeeded, result.get_executionStatus(),
            AtlasUnit.ExecutionStatus);
    }

    this.testRunFail = function() {
        var testFixture = new AtlasUnit.Test.TestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testBrokenMethod");
        test.run();

        AtlasUnit.Assert.areEqual("setUp testBrokenMethod tearDown ", testFixture.log);
        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.Failed, result.get_executionStatus(),
			AtlasUnit.ExecutionStatus);
        AtlasUnit.Assert.areEqual("testBrokenMethod exception message", result.get_exception().message);
    }

    this.testRunFailThrowOnFail = function() {
        var testFixture = new AtlasUnit.Test.TestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testBrokenMethod");

        try {
            test.run(true);
            AtlasUnit.Assert.fail("test.run() did not throw exception");
        }
        catch (ex) {
            AtlasUnit.Assert.instanceOfType(Error, ex);
            AtlasUnit.Assert.areEqual("testBrokenMethod exception message", ex.message);

            AtlasUnit.Assert.areEqual("setUp testBrokenMethod ", testFixture.log);
            var result = test.get_result();
            AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.NotExecuted, result.get_executionStatus(),
			    AtlasUnit.ExecutionStatus);
        }
    }

    this.testRunNoSetUpOrTeardown = function() {
        var testFixtureNoSetUpOrTearDown = new AtlasUnit.Test.TestCaseTest.TestFixtureNoSetUpOrTearDown();
        var test = new AtlasUnit.TestCase(testFixtureNoSetUpOrTearDown, "testMethod");
        test.run();

        AtlasUnit.Assert.areEqual("testMethod ", testFixtureNoSetUpOrTearDown.log);
    }

    this.testRunExpectedExceptionAnyBaseErrorPass = function() {
        var testFixture = new AtlasUnit.Test.TestCaseTest.ExpectedExceptionsTestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testBaseError");
        test.set_expectedException({});
        test.run();

        AtlasUnit.Assert.areEqual("setUp testBaseError tearDown ", testFixture.log);
        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.Succeeded, result.get_executionStatus(),
			AtlasUnit.ExecutionStatus);
    }

    this.testRunExpectedExceptionAnyStringExceptionFail = function() {
        var testFixture = new AtlasUnit.Test.TestCaseTest.ExpectedExceptionsTestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testStringException");
        test.set_expectedException({});
        test.run();

        AtlasUnit.Assert.areEqual("setUp testStringException tearDown ", testFixture.log);
        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.Failed, result.get_executionStatus(),
			AtlasUnit.ExecutionStatus);
        AtlasUnit.Assert.areEqual(
            "\r\nExpected: Exception of type Error" +
            "\r\nActual: Exception of type String",
            result.get_exception().message);
    }

    this.testRunExpectedExceptionAnyObjectExceptionFail = function() {
        var testFixture = new AtlasUnit.Test.TestCaseTest.ExpectedExceptionsTestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testObjectException");
        test.set_expectedException({});
        test.run();

        AtlasUnit.Assert.areEqual("setUp testObjectException tearDown ", testFixture.log);
        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.Failed, result.get_executionStatus(),
			AtlasUnit.ExecutionStatus);
        AtlasUnit.Assert.areEqual(
            "\r\nExpected: Exception of type Error" +
            "\r\nActual: Exception of type Object",
            result.get_exception().message);
    }

    this.testRunExpectedExceptionAnyNullExceptionFail = function() {
        var testFixture = new AtlasUnit.Test.TestCaseTest.ExpectedExceptionsTestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testNullException");
        test.set_expectedException({});
        test.run();

        AtlasUnit.Assert.areEqual("setUp testNullException tearDown ", testFixture.log);
        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.Failed, result.get_executionStatus(),
			AtlasUnit.ExecutionStatus);
        AtlasUnit.Assert.areEqual(
            "\r\nExpected: Exception of type Error" +
            "\r\nActual: Null exception",
            result.get_exception().message);
    }

    this.testRunExpectedExceptionAnyUndefinedExceptionFail = function() {
        var testFixture = new AtlasUnit.Test.TestCaseTest.ExpectedExceptionsTestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testUndefinedException");
        test.set_expectedException({});
        test.run();

        AtlasUnit.Assert.areEqual("setUp testUndefinedException tearDown ", testFixture.log);
        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.Failed, result.get_executionStatus(),
			AtlasUnit.ExecutionStatus);
        AtlasUnit.Assert.areEqual(
            "\r\nExpected: Exception of type Error" +
            "\r\nActual: Undefined exception",
            result.get_exception().message);
    }

    this.testRunExpectedExceptionAnyFailNoException = function() {
        var testFixture = new AtlasUnit.Test.TestCaseTest.ExpectedExceptionsTestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testNoException");
        test.set_expectedException({});
        test.run();

        AtlasUnit.Assert.areEqual("setUp testNoException tearDown ", testFixture.log);
        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.Failed, result.get_executionStatus(),
			AtlasUnit.ExecutionStatus);
        AtlasUnit.Assert.areEqual("Exception was expected", result.get_exception().message);
    }

    this.testRunExpectedExceptionSpecificNamedErrorPass = function() {
        var testFixture = new AtlasUnit.Test.TestCaseTest.ExpectedExceptionsTestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testNamedError");
        test.set_expectedException({name: "NamedError", message: "testNamedError exception message\n"});
        test.run();

        AtlasUnit.Assert.areEqual("setUp testNamedError tearDown ", testFixture.log);
        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.Succeeded, result.get_executionStatus(),
			AtlasUnit.ExecutionStatus);
    }

    this.testRunExpectedExceptionSpecificNamedErrorFailName = function() {
        var testFixture = new AtlasUnit.Test.TestCaseTest.ExpectedExceptionsTestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testNamedError");
        test.set_expectedException({name: "WrongError", message: "testNamedError exception message\n"});
        test.run();

        AtlasUnit.Assert.areEqual("setUp testNamedError tearDown ", testFixture.log);
        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.Failed, result.get_executionStatus(),
			AtlasUnit.ExecutionStatus);
        AtlasUnit.Assert.areEqual(
            "\r\nExpected: Exception with name <WrongError>" +
            "\r\nActual: Exception with name <NamedError>",
            result.get_exception().message);
    }

    this.testRunExpectedExceptionSpecificNamedErrorFailMessage = function() {
        var testFixture = new AtlasUnit.Test.TestCaseTest.ExpectedExceptionsTestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testNamedError");
        test.set_expectedException({name: "NamedError", message: "wrong exception message\n"});
        test.run();

        AtlasUnit.Assert.areEqual("setUp testNamedError tearDown ", testFixture.log);
        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.Failed, result.get_executionStatus(),
			AtlasUnit.ExecutionStatus);
        AtlasUnit.Assert.areEqual(
            "\r\nExpected: Exception with message <wrong exception message\\n>" +
            "\r\nActual: Exception with message <testNamedError exception message\\n>",
            result.get_exception().message);
    }

    this.testRunExpectedExceptionSpecificFailNoException = function() {
        var testFixture = new AtlasUnit.Test.TestCaseTest.ExpectedExceptionsTestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testNoException");
        test.set_expectedException({name: "NamedError"});
        test.run();

        AtlasUnit.Assert.areEqual("setUp testNoException tearDown ", testFixture.log);
        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.Failed, result.get_executionStatus(),
			AtlasUnit.ExecutionStatus);
        AtlasUnit.Assert.areEqual("Exception was expected", result.get_exception().message);
    }

    this.testSetUpThrowsException = function() {
        testExceptions(true, false, false, "setUp tearDown ", "setUp exception message");
    }

    this.testTearDownThrowsException = function() {
        testExceptions(false, false, true, "setUp testMethod tearDown ", "tearDown exception message");
    }

    this.testSetUpAndTearDownThrowsException = function() {
        testExceptions(true, false, true, "setUp tearDown ", "tearDown exception message");
    }

    this.testTestMethodAndTearDownThrowsException = function() {
        testExceptions(false, true, true, "setUp testMethod tearDown ", "tearDown exception message");
    }

    var testExceptions = function(throwFromSetUp, throwFromTestMethod, throwFromTearDown, expectedLog, expectedMessage) {
        var testFixture = new AtlasUnit.Test.TestCaseTest.ExceptionTestFixture(
            throwFromSetUp, throwFromTestMethod, throwFromTearDown);
        var test = new AtlasUnit.TestCase(testFixture, "testMethod");

        test.run();

        AtlasUnit.Assert.areEqual(expectedLog, testFixture.log);
        var result = test.get_result();
        AtlasUnit.Assert.enumEqual(AtlasUnit.ExecutionStatus.Failed, result.get_executionStatus(),
			AtlasUnit.ExecutionStatus);
        AtlasUnit.Assert.areEqual(expectedMessage, result.get_exception().message);
    }

    this.testCategories = function() {
        var testFixture = new AtlasUnit.Test.TestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testMethod");

        AtlasUnit.Assert.isEmpty(test.get_categories());
        test.set_categories(["foo", "bar"]);
        AtlasUnit.Assert.elementsEqual(["foo", "bar"], test.get_categories());
        test.set_categories(null);
        AtlasUnit.Assert.isEmpty(test.get_categories());
    }

    this.testExpectedException = function() {
        var testFixture = new AtlasUnit.Test.TestFixture();
        var test = new AtlasUnit.TestCase(testFixture, "testMethod");

        AtlasUnit.Assert.isNull(test.get_expectedException());
        test.set_expectedException({name: "TestName", message: "TestMessage"});
        AtlasUnit.Assert.areEqual("TestName", test.get_expectedException().name);
        AtlasUnit.Assert.areEqual("TestMessage", test.get_expectedException().message);
        test.set_expectedException(null);
        AtlasUnit.Assert.isNull(test.get_expectedException());
    }
}
AtlasUnit.Test.TestCaseTest.registerClass("AtlasUnit.Test.TestCaseTest");
AtlasUnit.Test.TestCaseTest["AtlasUnit.IsTestFixture"] = true;


AtlasUnit.Test.TestCaseTest.TestFixtureNoSetUpOrTearDown = function() {
    this.log = "";

    this.testMethod = function() {
        this.log += "testMethod ";
    }
}
AtlasUnit.Test.TestCaseTest.TestFixtureNoSetUpOrTearDown.registerClass("AtlasUnit.Test.TestCaseTest.TestFixtureNoSetUpOrTearDown");

AtlasUnit.Test.TestCaseTest.ExceptionTestFixture = function(throwFromSetUp, throwFromTestMethod, throwFromTearDown) {
    var _throwFromSetUp = throwFromSetUp;
    var _throwFromTestMethod = throwFromTestMethod;
    var _throwFromTearDown = throwFromTearDown;
    this.log = "";

    this.setUp = function() {
        this.log += "setUp ";
        if (_throwFromSetUp) {
           throw new Error("setUp exception message");
        }
    }

    this.testMethod = function() {
        this.log += "testMethod ";
        if (_throwFromTestMethod) {
            throw new Error("testMethod exception message");
        }
    }

    this.tearDown = function() {
        this.log += "tearDown ";
        if (_throwFromTearDown) {
            throw new Error("tearDown exception message");
        }
    }
}
AtlasUnit.Test.TestCaseTest.ExceptionTestFixture.registerClass("AtlasUnit.Test.TestCaseTest.ExceptionTestFixture");

AtlasUnit.Test.TestCaseTest.ExpectedExceptionsTestFixture = function() {
    this.log = "";

    this.setUp = function() {
        this.log = "setUp ";
    }

    this.testNoException = function() {
        this.log += "testNoException ";
    }

    this.testBaseError = function() {
        this.log += "testBaseError ";
        throw new Error("testBaseError exception message");
    }

    this.testNamedError = function() {
        this.log += "testNamedError ";
        var e = new Error("testNamedError exception message\n");
        e.name = "NamedError";
        throw e;
    }

    this.testStringException = function() {
        this.log += "testStringException ";
        throw "testStringException exception message";
    }

    this.testObjectException = function() {
        this.log += "testObjectException ";
        throw { message: "testObjectException exception message" };
    }

    this.testNullException = function() {
        this.log += "testNullException ";
        throw null;
    }

    this.testUndefinedException = function() {
        this.log += "testUndefinedException ";
        throw undefined;
    }

    this.tearDown = function() {
        this.log += "tearDown ";
    }
}
AtlasUnit.Test.TestCaseTest.ExpectedExceptionsTestFixture.registerClass(
    "AtlasUnit.Test.TestCaseTest.ExpectedExceptionsTestFixture");

Sys.Application.notifyScriptLoaded();
