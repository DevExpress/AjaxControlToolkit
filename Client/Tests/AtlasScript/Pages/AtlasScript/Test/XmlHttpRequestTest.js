/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.XMLHttpRequestTest = function() {
    this.testWindowXMLHttpRequestExists = function() {
        AtlasUnit.Assert.isFalse(typeof(window.XMLHttpRequest) == "undefined", "Window.XMLHttpRequest should be defined.");
    }

    this.testXMLHttpRequestReadyState = function() {
        var xmlHttp = new XMLHttpRequest();
        AtlasUnit.Assert.areEqual(0, xmlHttp.readyState, "The readyState of a newly created XMLHttpRequest object should be 0.");
    }
}
AtlasScript.Test.XMLHttpRequestTest.registerClass("AtlasScript.Test.XMLHttpRequestTest");
AtlasScript.Test.XMLHttpRequestTest["AtlasUnit.IsTestFixture"] = true;

