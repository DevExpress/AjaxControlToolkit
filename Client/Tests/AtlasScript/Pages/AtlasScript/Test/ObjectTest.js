/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.ObjectTest = function() {
}
AtlasScript.Test.ObjectTest.prototype = {

    testIsClass: function() {
        AtlasUnit.Assert.isTrue(Type.isClass(Object));
    },

    testTypeName: function() {
        AtlasUnit.Assert.areEqual("Object", Object.getTypeName({}));
    }

    // TODO: Add unit tests for getType(), getTypeName() including error cases
}
AtlasScript.Test.ObjectTest.registerClass("AtlasScript.Test.ObjectTest");
AtlasScript.Test.ObjectTest["AtlasUnit.IsTestFixture"] = true;

