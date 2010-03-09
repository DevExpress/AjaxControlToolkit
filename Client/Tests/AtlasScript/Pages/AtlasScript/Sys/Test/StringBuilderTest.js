/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.Test");

Sys.Test.StringBuilderTest = function() {
    this.setUp = function() {
        this._sb = new Sys.StringBuilder();
    }

    this.testCtorNoParam = function() {
        var sb = new Sys.StringBuilder();
        AtlasUnit.Assert.areEqual("", sb.toString());
    }

    this.testCtorUndefined = function() {
        var sb = new Sys.StringBuilder(undefined);
        AtlasUnit.Assert.areEqual("", sb.toString());
    }

    this.testCtorNull = function() {
        var sb = new Sys.StringBuilder(null);
        AtlasUnit.Assert.areEqual("", sb.toString());
    }

    this.testCtorString = function() {
        var sb = new Sys.StringBuilder("InitialText");
        AtlasUnit.Assert.areEqual("InitialText", sb.toString());
    }

    this.testCtorNumber = function() {
        var sb = new Sys.StringBuilder(0);
        AtlasUnit.Assert.areEqual("0", sb.toString());
    }

    this.testCtorFalse = function() {
        var sb = new Sys.StringBuilder(false);
        AtlasUnit.Assert.areEqual("false", sb.toString());
    }

    this.testAppendUndefined = function() {
        this._sb.append(undefined);
        AtlasUnit.Assert.areEqual("", this._sb.toString());
    }

    this.testAppendNull = function() {
        this._sb.append(null);
        AtlasUnit.Assert.areEqual("", this._sb.toString());
    }

    this.testAppendString = function() {
        this._sb.append("Hello");
        AtlasUnit.Assert.areEqual("Hello", this._sb.toString());
        AtlasUnit.Assert.areNotEqual("hello", this._sb.toString(), "StringBuilder is not case sensitive.");

        this._sb.append(" World");
        AtlasUnit.Assert.areEqual("Hello World", this._sb.toString());
    }

    this.testAppendNumber = function() {
        this._sb.append(0);
        AtlasUnit.Assert.areEqual("0", this._sb.toString());
    }

    this.testAppendFalse = function() {
        this._sb.append(false);
        AtlasUnit.Assert.areEqual("false", this._sb.toString());
    }

    this.testAppendLineNoParam = function() {
        this._sb.appendLine();
        AtlasUnit.Assert.areEqual("\r\n", this._sb.toString());
    }

    this.testAppendLineUndefined = function() {
        this._sb.appendLine(undefined);
        AtlasUnit.Assert.areEqual("\r\n", this._sb.toString());
    }

    this.testAppendLineNull = function() {
        this._sb.appendLine(null);
        AtlasUnit.Assert.areEqual("\r\n", this._sb.toString());
    }

    this.testAppendLineString = function() {
        this._sb.appendLine("Hello world");
        AtlasUnit.Assert.areEqual("Hello world\r\n", this._sb.toString());

        this._sb.appendLine("Goodbye world");
        AtlasUnit.Assert.areEqual("Hello world\r\nGoodbye world\r\n", this._sb.toString());
    }

    this.testAppendLineNumber = function() {
        this._sb.appendLine(0);
        AtlasUnit.Assert.areEqual("0\r\n", this._sb.toString());
    }

    this.testAppendLineFalse = function() {
        this._sb.appendLine(false);
        AtlasUnit.Assert.areEqual("false\r\n", this._sb.toString());
    }

    this.testClear = function() {
        this._sb.append("Hello world");
        AtlasUnit.Assert.areEqual("Hello world", this._sb.toString());

        this._sb.clear();
        AtlasUnit.Assert.areEqual("", this._sb.toString());
    }

    this.testIsEmpty = function() {
        AtlasUnit.Assert.isTrue(this._sb.isEmpty());

        // Appending null or undefined does not cause isEmpty() to return false
        this._sb.append(undefined);
        AtlasUnit.Assert.isTrue(this._sb.isEmpty());
        this._sb.append(null);
        AtlasUnit.Assert.isTrue(this._sb.isEmpty());

        // But appending anything else, except an empty string, causes isEmpty() to return false
        this._sb.append("");
        AtlasUnit.Assert.isTrue(this._sb.isEmpty());

        this._sb.append(" ");
        AtlasUnit.Assert.isFalse(this._sb.isEmpty());

        this._sb.clear();
        AtlasUnit.Assert.isTrue(this._sb.isEmpty());
    }

    this.testToString = function() {
        AtlasUnit.Assert.areEqual("", this._sb.toString(""));
        this._sb.append("first");
        AtlasUnit.Assert.areEqual("first", this._sb.toString(""));
        AtlasUnit.Assert.areEqual("first", this._sb.toString("|"));
        this._sb.appendLine("second");
        AtlasUnit.Assert.areEqual("firstsecond\r\n", this._sb.toString(""));
        AtlasUnit.Assert.areEqual("first|second\r\n", this._sb.toString("|"));
        this._sb.append("third");

        AtlasUnit.Assert.areEqual("firstsecond\r\nthird", this._sb.toString());
        AtlasUnit.Assert.areEqual("firstsecond\r\nthird", this._sb.toString(undefined));
        AtlasUnit.Assert.areEqual("firstsecond\r\nthird", this._sb.toString(null));
        AtlasUnit.Assert.areEqual("firstsecond\r\nthird", this._sb.toString(""));
        AtlasUnit.Assert.areEqual("first|second\r\n|third", this._sb.toString("|"));
        AtlasUnit.Assert.areEqual("firstsecond\r\nthird", this._sb.toString(""));
        AtlasUnit.Assert.areEqual("first|second\r\n|third", this._sb.toString("|"));
    }

    this.testToStringWithEmpty = function() {
        this._sb.append(null);
        this._sb.append("foo");
        this._sb.append('');
        this._sb.append("bar");
        this._sb.append(undefined);
        AtlasUnit.Assert.areEqual("foobar", this._sb.toString());
        AtlasUnit.Assert.areEqual("foo|bar", this._sb.toString("|"));
    }
}
Sys.Test.StringBuilderTest.registerClass("Sys.Test.StringBuilderTest");
Sys.Test.StringBuilderTest["AtlasUnit.IsTestFixture"] = true;

