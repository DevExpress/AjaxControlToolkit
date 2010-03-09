/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.BooleanTest = function() {

    this.testIsClass = function() {
        AtlasUnit.Assert.isTrue(Type.isClass(Boolean));
    }

    this.testParse = function() {
        AtlasUnit.Assert.isTrue(Boolean.parse('true'));
        AtlasUnit.Assert.isFalse(Boolean.parse('false'));
        AtlasUnit.Assert.isTrue(Boolean.parse(' TrUe  '));
        AtlasUnit.Assert.isFalse(Boolean.parse('  FaLse '));
    }

    this.testParseExtraParamsIgnored = function() {
        AtlasUnit.Assert.isTrue(Boolean.parse('true', 1, 2, 3));
        AtlasUnit.Assert.isFalse(Boolean.parse('false', null, "hello"));
    }

    this.testParseEmptyString = function() {
        Boolean.parse('');
    }
    this.testParseEmptyString["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "value",
        message: 'Sys.ArgumentOutOfRangeException: Value must be \'true\' or \'false\'.\nParameter name: value\nActual value was .'
    }
    this.testParseEmptyString["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testParseNotBool = function() {
        Boolean.parse('ThisIsNotABoolValue');
    }
    this.testParseNotBool["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "value",
        message: 'Sys.ArgumentOutOfRangeException: Value must be \'true\' or \'false\'.\nParameter name: value\nActual value was ThisIsNotABoolValue.'
    }
    this.testParseNotBool["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testTypeName = function() {
        AtlasUnit.Assert.areEqual("Boolean", Object.getTypeName(true));
    }
}
AtlasScript.Test.BooleanTest.registerClass("AtlasScript.Test.BooleanTest");
AtlasScript.Test.BooleanTest["AtlasUnit.IsTestFixture"] = true;

