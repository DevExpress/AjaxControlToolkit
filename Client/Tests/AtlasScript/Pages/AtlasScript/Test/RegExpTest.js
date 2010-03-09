/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.RegExpTest = function() {
}
AtlasScript.Test.RegExpTest.prototype = {

    testIsClass: function() {
        AtlasUnit.Assert.isTrue(Type.isClass(RegExp));
    },

    testTypeName: function() {
        AtlasUnit.Assert.areEqual("RegExp", Object.getTypeName(/foo/));
    }
}
AtlasScript.Test.RegExpTest.registerClass("AtlasScript.Test.RegExpTest");
AtlasScript.Test.RegExpTest["AtlasUnit.IsTestFixture"] = true;

