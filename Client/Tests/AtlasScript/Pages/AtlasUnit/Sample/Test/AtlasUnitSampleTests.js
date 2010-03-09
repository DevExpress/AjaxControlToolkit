/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Sample.Test");

AtlasUnit.Sample.Test.TestFixture = function() {
    this.testMethod = function() {
    }

    this.testBrokenMethod1 = function() {
        AtlasUnit.Assert.areEqual(1, 2);
    }
    this.testBrokenMethod1["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testBrokenMethod2 = function() {
        throw new Error();
    }
    this.testBrokenMethod2["AtlasUnit.Categories"] = ["ReleaseOnly"];

    this.testExpectedExceptionPass = function() {
        throw new Error("testExpectedExceptionPass message");
    }
    this.testExpectedExceptionPass["AtlasUnit.ExpectedException"] = {message: "testExpectedExceptionPass message"};

    this.testExpectedExceptionFailNone = function() {
    }
    this.testExpectedExceptionFailNone["AtlasUnit.ExpectedException"] = {message: "testExpectedExceptionPass message"};

    this.testExpectedExceptionFailWrongMessage = function() {
        throw new Error("testExpectedExceptionFailWrongMessage message");
    }
    this.testExpectedExceptionFailWrongMessage["AtlasUnit.ExpectedException"] = {message: "testExpectedExceptionPass message"};

    function oneParam(param1) {
        var e;

        e = Function._validateParams(arguments, [
            { name: "param1", type: String }
        ]);
        if (e) throw e;

        if (param1 === undefined) {
            e = Error.argumentUndefined("param1");
            throw e;
        }

        if (param1 === null) {
            var e = Error.argumentNull("param1");
            throw e;
        }

        return param1;
    }

    this.testValidateParamsPass = function() {
        AtlasUnit.Assert.areEqual("param1", oneParam("param1"));
    }

    this.testValidateParamsTooFew = function() {
        oneParam();
    }

    this.testValidateParamsTooMany = function() {
        oneParam("param1", "param2");
    }

    this.testValidateParamsUndefined = function() {
        oneParam(undefined);
    }

    this.testValidateParamsNull = function() {
        oneParam(null);
    }

    this.testValidateParamsInvalidType = function() {
        oneParam(0);
    }
}
AtlasUnit.Sample.Test.TestFixture.registerClass("AtlasUnit.Sample.Test.TestFixture");
AtlasUnit.Sample.Test.TestFixture["AtlasUnit.IsTestFixture"] = true;

AtlasUnit.Sample.Test.TestFixture2 = function() {
    this.testMethod = function() {
    }
}
AtlasUnit.Sample.Test.TestFixture2.registerClass("AtlasUnit.Sample.Test.TestFixture2");
AtlasUnit.Sample.Test.TestFixture2["AtlasUnit.IsTestFixture"] = true;

Type.registerNamespace("AtlasUnit.Sample.Test2");
AtlasUnit.Sample.Test2.TestFixture3 = function() {
    this.testMethod = function() {
    }
}
AtlasUnit.Sample.Test2.TestFixture3.registerClass("AtlasUnit.Sample.Test2.TestFixture3");
AtlasUnit.Sample.Test2.TestFixture3["AtlasUnit.IsTestFixture"] = true;

AtlasUnit.Sample.Test2.TestFixture4 = function() {
    this.testMethod = function() {
    }
}
AtlasUnit.Sample.Test2.TestFixture4.registerClass("AtlasUnit.Sample.Test2.TestFixture4");
AtlasUnit.Sample.Test2.TestFixture4["AtlasUnit.IsTestFixture"] = true;

Sys.Application.notifyScriptLoaded();