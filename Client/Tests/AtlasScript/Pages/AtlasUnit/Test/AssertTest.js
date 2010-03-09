/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Test");

AtlasUnit.Test.AssertTest = function() {
    this.testFail = function() {
        AtlasUnit.Assert.fail();
    }
    this.testFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: ""
    }

    this.testFailMessage = function() {
        AtlasUnit.Assert.fail("message");
    }
    this.testFailMessage["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "message"
    }

    this.testAreEqualPass = function() {
        AtlasUnit.Assert.areEqual(undefined, undefined);
        AtlasUnit.Assert.areEqual(null, null);
        AtlasUnit.Assert.areEqual("foo\r\nbar", "foo\r\nbar");
    }

    this.testAreEqualFailStrings = function() {
        AtlasUnit.Assert.areEqual("foo\r\nbar", "bar\r\nbar");
    }
    this.testAreEqualFailStrings["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<foo\\r\\nbar>\r\nActual:<bar\\r\\nbar>"
    }

    this.testAreEqualFailUndefinedNull = function() {
        AtlasUnit.Assert.areEqual(undefined, null);
    }
    this.testAreEqualFailUndefinedNull["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<undefined>\r\nActual:<null>"
    }

    this.testAreEqualPassUndefined = function() {
        var expected;
        var actual;
        AtlasUnit.Assert.areEqual(expected, actual);
    }

    this.testAreEqualFailUndefinedActual = function() {
        AtlasUnit.Assert.areEqual("expected", undefined);
    }
    this.testAreEqualFailUndefinedActual["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<expected>\r\nActual:<undefined>"
    }

    this.testAreEqualFailUndefinedExpected = function() {
        AtlasUnit.Assert.areEqual(undefined, "actual");
    }
    this.testAreEqualFailUndefinedExpected["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<undefined>\r\nActual:<actual>"
    }

    this.testAreEqualFailNullActual = function() {
        AtlasUnit.Assert.areEqual("expected", null);
    }
    this.testAreEqualFailNullActual["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<expected>\r\nActual:<null>"
    }

    this.testAreEqualFailNullExpected = function() {
        AtlasUnit.Assert.areEqual(null, "actual");
    }
    this.testAreEqualFailNullExpected["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<null>\r\nActual:<actual>"
    }

    this.testAreEqualFailEnum = function() {
        AtlasUnit.Assert.areEqual(AtlasUnit.Test.AssertTest.TestEnum.value1, AtlasUnit.Test.AssertTest.TestEnum.value2);
    }
    this.testAreEqualFailEnum["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<0>\r\nActual:<1>"
    }

    this.testAreEqualFailMessage = function() {
        AtlasUnit.Assert.areEqual("foo\r\nbar", "bar\r\nbar", "message");
    }
    this.testAreEqualFailMessage["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "message\r\nExpected:<foo\\r\\nbar>\r\nActual:<bar\\r\\nbar>"
    }

    this.testAreNotEqualPass = function() {
        AtlasUnit.Assert.areNotEqual(undefined, null);
        AtlasUnit.Assert.areNotEqual("expected", "actual");
    }

    this.testAreNotEqualFail = function() {
        AtlasUnit.Assert.areNotEqual("expected", "expected");
    }
    this.testAreNotEqualFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: ""
    }

    this.testElementsEqualPass = function() {
        AtlasUnit.Assert.elementsEqual(undefined, undefined);
        AtlasUnit.Assert.elementsEqual(null, null);
        AtlasUnit.Assert.elementsEqual(["foo", "bar"], ["foo", "bar"]);
    }

    this.testElementsEqualUndefinedNullFail = function() {
        AtlasUnit.Assert.elementsEqual(undefined, null);
    }
    this.testElementsEqualUndefinedNullFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<undefined>\r\nActual:<null>"
    }

    this.testElementsEqualFail = function() {
        AtlasUnit.Assert.elementsEqual(["foo", "bar"], ["foo", "baz"]);
    }
    this.testElementsEqualFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<[foo,bar]>\r\nActual:<[foo,baz]>"
    }

    this.testElementsEqualFailElementUndefinedNull = function() {
        AtlasUnit.Assert.elementsEqual(["foo", undefined], ["foo", null]);
    }
    this.testElementsEqualFailElementUndefinedNull["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<[foo,undefined]>\r\nActual:<[foo,null]>"
    }

    this.testElementsEqualFailLength = function() {
        AtlasUnit.Assert.elementsEqual(["foo", "bar"], ["foo", "bar", "baz"]);
    }
    this.testElementsEqualFailLength["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<[foo,bar]>\r\nActual:<[foo,bar,baz]>"
    }

    this.testElementsEqualUndefinedFail = function() {
        AtlasUnit.Assert.elementsEqual(["foo", "bar"], undefined);
    }
    this.testElementsEqualUndefinedFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<[foo,bar]>\r\nActual:<undefined>"
    }

    this.testElementsEqualNullFail = function() {
        AtlasUnit.Assert.elementsEqual(["foo", "bar"], null);
    }
    this.testElementsEqualNullFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<[foo,bar]>\r\nActual:<null>"
    }

    this.testEnumEqualPass = function() {
        AtlasUnit.Assert.enumEqual(AtlasUnit.Test.AssertTest.TestEnum.value1, AtlasUnit.Test.AssertTest.TestEnum.value1,
            AtlasUnit.Test.AssertTest.TestEnum);
    }

    this.testEnumEqualFail = function() {
        AtlasUnit.Assert.enumEqual(AtlasUnit.Test.AssertTest.TestEnum.value1, AtlasUnit.Test.AssertTest.TestEnum.value2,
            AtlasUnit.Test.AssertTest.TestEnum);
    }
    this.testEnumEqualFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<AtlasUnit.Test.AssertTest.TestEnum.value1>" +
                 "\r\nActual:<AtlasUnit.Test.AssertTest.TestEnum.value2>"
    }

    this.testEnumEqualExpectedInvalidFail = function() {
        AtlasUnit.Assert.enumEqual("invalid enum value", AtlasUnit.Test.AssertTest.TestEnum.value2,
            AtlasUnit.Test.AssertTest.TestEnum);
    }
    this.testEnumEqualExpectedInvalidFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<invalid enum value>" +
                 "\r\nActual:<AtlasUnit.Test.AssertTest.TestEnum.value2>"
    }

    this.testEnumEqualActualInvalidFail = function() {
        AtlasUnit.Assert.enumEqual(AtlasUnit.Test.AssertTest.TestEnum.value1, "invalid enum value",
            AtlasUnit.Test.AssertTest.TestEnum);
    }
    this.testEnumEqualActualInvalidFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<AtlasUnit.Test.AssertTest.TestEnum.value1>" +
                 "\r\nActual:<invalid enum value>"
    }

    // The testExpectException*() tests are analagous to the testRunExpectedException*() tests in TestCaseTest.js
    this.testExpectExceptionAnyBaseErrorPass = function() {
        // The expectedException parameter is optional.  The behavior should be the same if it is not specified,
        // null, undefined, or a bare object.
        AtlasUnit.Assert.expectException(
            function() {
                throw new Error("testBaseError exception message");
            });

        AtlasUnit.Assert.expectException(
            function() {
                throw new Error("testBaseError exception message");
            },
            null);

        AtlasUnit.Assert.expectException(
            function() {
                throw new Error("testBaseError exception message");
            },
            undefined);

        AtlasUnit.Assert.expectException(
            function() {
                throw new Error("testBaseError exception message");
            },
            { });
    }

    this.testExpectExceptionAnyStringExceptionFail = function() {
        AtlasUnit.Assert.expectException(
            function() {
                throw "testStringException exception message";
            });
    }
    this.testExpectExceptionAnyStringExceptionFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected: Exception of type Error" +
                 "\r\nActual: Exception of type String"
    }

    this.testExpectExceptionAnyObjectExceptionFail = function() {
        AtlasUnit.Assert.expectException(
            function() {
                throw { message: "testObjectException exception message" };
            });
    }
    this.testExpectExceptionAnyObjectExceptionFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected: Exception of type Error" +
                 "\r\nActual: Exception of type Object"
    }

    this.testExpectExceptionAnyNullExceptionFail = function() {
        AtlasUnit.Assert.expectException(
            function() {
                throw null;
            });
    }
    this.testExpectExceptionAnyNullExceptionFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected: Exception of type Error" +
                 "\r\nActual: Null exception"
    }

    this.testExpectExceptionAnyUndefinedExceptionFail = function() {
        AtlasUnit.Assert.expectException(
            function() {
                throw undefined;
            });
    }
    this.testExpectExceptionAnyUndefinedExceptionFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected: Exception of type Error" +
                 "\r\nActual: Undefined exception"
    }

    this.testExpectExceptionAnyFailNoException = function() {
        AtlasUnit.Assert.expectException(
            function() {
            });
    }
    this.testExpectExceptionAnyFailNoException["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "Exception was expected"
    }

    this.testExpectExceptionSpecificNamedErrorPass = function() {
        AtlasUnit.Assert.expectException(
            function() {
                var e = new Error("testNamedError exception message\n");
                e.name = "NamedError";
                throw e;
            },
            {
                name: "NamedError",
                message: "testNamedError exception message\n"
            });
    }

    this.testExpectExceptionSpecificNamedErrorFailName = function() {
        AtlasUnit.Assert.expectException(
            function() {
                var e = new Error("testNamedError exception message\n");
                e.name = "NamedError";
                throw e;
            },
            {
                name: "WrongError",
                message: "testNamedError exception message\n"
            });
    }
    this.testExpectExceptionSpecificNamedErrorFailName["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected: Exception with name <WrongError>" +
                 "\r\nActual: Exception with name <NamedError>"
    }

    this.testExpectExceptionSpecificNamedErrorFailMessage = function() {
        AtlasUnit.Assert.expectException(
            function() {
                var e = new Error("testNamedError exception message\n");
                e.name = "NamedError";
                throw e;
            },
            {
                name: "NamedError",
                message: "wrong exception message\n"
            });
    }
    this.testExpectExceptionSpecificNamedErrorFailMessage["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected: Exception with message <wrong exception message\\n>" +
                 "\r\nActual: Exception with message <testNamedError exception message\\n>"
    }

    this.testExpectExceptionSpecificFailNoException = function() {
        AtlasUnit.Assert.expectException(
            function() {
            },
            {
                name: "NamedError"
            });
    }
    this.testExpectExceptionSpecificFailNoException["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "Exception was expected"
    }

    this.testExpectExceptionSpecificTypePass = function() {
        AtlasUnit.Assert.expectException(
            function() {
                // Need to use "new Number()" rather than a number literal, as "1 instanceof Number" is false, while
                // "(new Number(1)) instanceof Number" is true;
                throw new Number(1);
            },
            {},
            Number);
    }

    this.testExpectExceptionSpecificTypeFail = function() {
        AtlasUnit.Assert.expectException(
            function() {
                throw new Error("testBaseError exception message");
            },
            {},
            Number);
    }
    this.testExpectExceptionSpecificTypeFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected: Exception of type Number" +
                 "\r\nActual: Exception of type Error"
    }

    this.testIsTruePass = function() {
        AtlasUnit.Assert.isTrue(true);
    }

    this.testIsTrueFail = function() {
        AtlasUnit.Assert.isTrue(false);
    }
    this.testIsTrueFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<true>\r\nActual:<false>"
    }

    this.testIsFalsePass = function() {
        AtlasUnit.Assert.isFalse(false);
    }

    this.testIsFalseFail = function() {
        AtlasUnit.Assert.isFalse(true);
    }
    this.testIsFalseFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<false>\r\nActual:<true>"
    }

    // The following values are equivalent to false: undefined, null, 0, "", Number.NaN.
    // However, they are not *equal* to false, so Assert.isFalse() should fail with these values.
    this.testIsFalseFailUndefined = function() {
        AtlasUnit.Assert.isFalse(undefined);
    }
    this.testIsFalseFailUndefined["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<false>\r\nActual:<undefined>"
    }

    this.testIsFalseFailNull = function() {
        AtlasUnit.Assert.isFalse(null);
    }
    this.testIsFalseFailNull["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<false>\r\nActual:<null>"
    }

    this.testIsFalseFailZero = function() {
        AtlasUnit.Assert.isFalse(0);
    }
    this.testIsFalseFailZero["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<false>\r\nActual:<0>"
    }

    this.testIsFalseFailEmptyString = function() {
        AtlasUnit.Assert.isFalse("");
    }
    this.testIsFalseFailEmptyString["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<false>\r\nActual:<>"
    }

    this.testIsFalseFailNaN = function() {
        AtlasUnit.Assert.isFalse(Number.NaN);
    }
    this.testIsFalseFailNaN["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<false>\r\nActual:<NaN>"
    }

    this.testIsEmptyPass = function() {
        AtlasUnit.Assert.isEmpty([]);
    }

    this.testIsEmptyFail = function() {
        AtlasUnit.Assert.isEmpty(["foo"]);
    }
    this.testIsEmptyFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<[]>\r\nActual:<[foo]>"
    }

    this.testIsNullPass = function() {
        AtlasUnit.Assert.isNull(null);
    }

    this.testIsNullFail = function() {
        AtlasUnit.Assert.isNull(undefined);
    }
    this.testIsNullFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected:<null>\r\nActual:<undefined>"
    }

    this.testIsNotNullPass = function() {
        AtlasUnit.Assert.isNotNull(undefined);
        AtlasUnit.Assert.isNotNull(0);
        AtlasUnit.Assert.isNotNull(false);
        AtlasUnit.Assert.isNotNull("");
    }

    this.testIsNotNullFail = function() {
        AtlasUnit.Assert.isNotNull(null);
    }
    this.testIsNotNullFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: ""
    }

    this.testInstanceOfTypePass = function() {
        AtlasUnit.Assert.instanceOfType(Number, 0);
    }

    this.testInstanceOfTypeFail = function() {
        AtlasUnit.Assert.instanceOfType(Number, "foo");
    }
    this.testInstanceOfTypeFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected: Object to be instance of Number\r\nActual: String"
    }

    this.testNotInstanceOfTypePass = function() {
        AtlasUnit.Assert.notInstanceOfType(Number, "foo");
    }

    this.testNotInstanceOfTypeFail = function() {
        AtlasUnit.Assert.notInstanceOfType(Number, 0);
    }
    this.testNotInstanceOfTypeFail["AtlasUnit.ExpectedException"] = {
        name: "AtlasUnit.Exception",
        message: "\r\nExpected: Object not an instance of Number\r\nActual: Number"
    }
}
AtlasUnit.Test.AssertTest.registerClass("AtlasUnit.Test.AssertTest");
AtlasUnit.Test.AssertTest["AtlasUnit.IsTestFixture"] = true;

AtlasUnit.Test.AssertTest.TestEnum = function() {
    throw Error.notImplemented();
}
AtlasUnit.Test.AssertTest.TestEnum.prototype = {
    value1: 0,
    value2: 1
}
AtlasUnit.Test.AssertTest.TestEnum.registerEnum("AtlasUnit.Test.AssertTest.TestEnum");

Sys.Application.notifyScriptLoaded();