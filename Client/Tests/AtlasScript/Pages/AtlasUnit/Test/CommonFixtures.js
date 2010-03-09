/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Test");

AtlasUnit.Test.TestFixture = function() {
    this.log = "";

    this.setUp = function() {
        this.log = "setUp ";
    }

    this.testMethod = function() {
        this.log += "testMethod ";
    }

    this.testBrokenMethod = function() {
        this.log += "testBrokenMethod ";
        throw new Error("testBrokenMethod exception message");
    }

    this.tearDown = function() {
        this.log += "tearDown ";
    }
}
AtlasUnit.Test.TestFixture.registerClass("AtlasUnit.Test.TestFixture");


AtlasUnit.Test.TestFixture2 = function() {
    this.testMethod = function() {
    }
}
AtlasUnit.Test.TestFixture2.registerClass("AtlasUnit.Test.TestFixture2");

Type.registerNamespace("AtlasUnit.Test2");
AtlasUnit.Test2.TestFixture3 = function() {
    this.testMethod = function() {
    }
}
AtlasUnit.Test2.TestFixture3.registerClass("AtlasUnit.Test2.TestFixture3");
AtlasUnit.Test2.TestFixture3["AtlasUnit.IsTestFixture"] = true;

AtlasUnit.Test2.TestFixture4 = function() {
    this.testMethod = function() {
    }
}
AtlasUnit.Test2.TestFixture4.registerClass("AtlasUnit.Test2.TestFixture4");
AtlasUnit.Test2.TestFixture4["AtlasUnit.IsTestFixture"] = true;

AtlasUnit.Test2.NotTestFixture = function() {
    this.testMethod = function() {
    }
}
AtlasUnit.Test2.NotTestFixture.registerClass("AtlasUnit.Test2.NotTestFixture");

Sys.Application.notifyScriptLoaded();
