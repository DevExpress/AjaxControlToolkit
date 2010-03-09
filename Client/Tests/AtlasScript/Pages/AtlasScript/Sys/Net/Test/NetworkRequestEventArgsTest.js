/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.Net.Test");

Sys.Net.Test.NetworkRequestEventArgsTest = function() {

    this.setUp = function() {
    }

    this.testBadSetWebRequest = function() {
        new Sys.Net.NetworkRequestEventArgs([]);
    }
    this.testBadSetWebRequest["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testBadSetWebRequest["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentTypeException', paramName: 'webRequest' }

    this.testNullSetWebRequest = function() {
        new Sys.Net.NetworkRequestEventArgs(null);
    }
    this.testNullSetWebRequest["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testNullSetWebRequest["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentNullException', paramName: 'webRequest' }

}
Sys.Net.Test.NetworkRequestEventArgsTest.registerClass("Sys.Net.Test.NetworkRequestEventArgsTest");
Sys.Net.Test.NetworkRequestEventArgsTest["AtlasUnit.IsTestFixture"] = true;


