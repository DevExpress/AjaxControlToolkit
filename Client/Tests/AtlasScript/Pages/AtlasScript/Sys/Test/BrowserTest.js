/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.Test");

Sys.Test.BrowserTest = function() {

    this.testIsBrowser = function() {
        if (navigator.userAgent.indexOf(' MSIE ') > -1) {
            AtlasUnit.Assert.areEqual(Sys.Browser.InternetExplorer, Sys.Browser.agent);
            AtlasUnit.Assert.areEqual("Microsoft Internet Explorer", Sys.Browser.name);
            if (Sys.Browser.version >= 8) {
                if (document.documentMode >= 7) {
                    AtlasUnit.Assert.areEqual(Sys.Browser.documentMode, document.documentMode);
                }
                else {
                    AtlasUnit.Assert.areEqual(Sys.Browser.documentMode, 0);
                }
            }
            else {
                AtlasUnit.Assert.areEqual(Sys.Browser.documentMode, 0);
            }
            AtlasUnit.Assert.isTrue(Sys.Browser.hasDebuggerStatement);
        }
        else if (navigator.userAgent.indexOf(' Firefox/') > -1) {
            AtlasUnit.Assert.areEqual(Sys.Browser.Firefox, Sys.Browser.agent);
            AtlasUnit.Assert.areEqual("Firefox", Sys.Browser.name);
            AtlasUnit.Assert.areEqual(Sys.Browser.documentMode, 0);
            AtlasUnit.Assert.isTrue(Sys.Browser.hasDebuggerStatement);
        }
        else if (navigator.userAgent.indexOf(' Safari/') > -1) {
            AtlasUnit.Assert.areEqual(Sys.Browser.Safari, Sys.Browser.agent);
            AtlasUnit.Assert.areEqual("Safari", Sys.Browser.name);
            AtlasUnit.Assert.areEqual(Sys.Browser.documentMode, 0);
            AtlasUnit.Assert.isFalse(Sys.Browser.hasDebuggerStatement);
        }
        else if (navigator.userAgent.indexOf('Opera/') > -1) {
            AtlasUnit.Assert.areEqual(Sys.Browser.Opera, Sys.Browser.agent);
            AtlasUnit.Assert.areEqual("Opera", Sys.Browser.name);
            AtlasUnit.Assert.areEqual(Sys.Browser.documentMode, 0);
            AtlasUnit.Assert.isFalse(Sys.Browser.hasDebuggerStatement);
        }
        else {
            AtlasUnit.Assert.areEqual(null, Sys.Browser.agent);
            AtlasUnit.Assert.isFalse(Sys.Browser.hasDebuggerStatement);
        }
    }
}
Sys.Test.BrowserTest.registerClass("Sys.Test.BrowserTest");
Sys.Test.BrowserTest["AtlasUnit.IsTestFixture"] = true;

