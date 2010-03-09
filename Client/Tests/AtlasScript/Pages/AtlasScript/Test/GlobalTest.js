/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.GlobalTest = function() {
    this.testNoSimpleGlobals = function() {
        // checks for the letters a-z defined as global variables.
        // this can catch accidental for loops that do not declare 'i', for example.
        var list = "abcdefghijklmnopqrstuvwxyz";
        var violations = [];
        for (var i = 0, l = list.length; i < l; i++) {
            var char = list.charAt(i);
            var val = window[char];
            if (val && val.id === "_firebugConsole") continue;
            if (typeof(val) !== "undefined") {
                violations.push("Found variable named '" + char + "', " +
                (val ? val.toString() : "")) + ((val && val.innerHTML) ? (" innerhtml:" + val.innerHTML.replace(/\</g,"&lt;")) : "(not a dom element)");
            }
        }
        if (violations.length > 0) {
            AtlasUnit.Assert.fail(violations.join("\n"));
        }
    }
}
AtlasScript.Test.GlobalTest.registerClass("AtlasScript.Test.GlobalTest");
AtlasScript.Test.GlobalTest["AtlasUnit.IsTestFixture"] = true;


