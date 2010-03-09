/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.ErrorTestHelper = function() {
}
AtlasScript.Test.ErrorTestHelper.createError = function() {
    return AtlasScript.Test.ErrorTestHelper.createErrorHelper();
}
AtlasScript.Test.ErrorTestHelper.createErrorHelper = function() {
    return new Error("test message");
}
AtlasScript.Test.ErrorTestHelper.registerClass("AtlasScript.Test.ErrorTestHelper");

