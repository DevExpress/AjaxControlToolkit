/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Test");

AtlasUnit.Test.SuiteDumper = function() {
    var indent = "";
    var sb = new Sys.StringBuilder();

    this.toString = function() {
        return sb.toString();
    }

    this.visitEnter = function(testSuite) {
        sb.appendLine(indent + testSuite.get_name());
        indent += "  ";
    }

    this.visit = function(testCase) {
        sb.appendLine(indent + testCase.get_name());
    }

    this.visitLeave = function(testSuite) {
        indent = indent.substr(0, indent.length - 2);
    }
}
AtlasUnit.Test.SuiteDumper.registerClass("AtlasUnit.Test.SuiteDumper", AtlasUnit.Visitor);

AtlasUnit.Test.SuiteDumper.dump = function(testSuite) {
    var dumper = new AtlasUnit.Test.SuiteDumper();
    testSuite.accept(dumper);
    return dumper.toString();
}


AtlasUnit.Test.LogVisitor = function() {
    AtlasUnit.Test.LogVisitor.initializeBase(this);

    this.log = "";

    this.visitEnter = function(testSuite) {
        this.log += "visitEnter(" + testSuite.get_name() + ") "
    }

    this.visit = function(testCase) {
        this.log += "visit(" + testCase.get_name() + ") ";
    }

    this.visitLeave = function(testSuite) {
        this.log += "visitLeave(" + testSuite.get_name() + ") ";
    }
}
AtlasUnit.Test.LogVisitor.registerClass("AtlasUnit.Test.LogVisitor", AtlasUnit.Visitor);

Sys.Application.notifyScriptLoaded();
