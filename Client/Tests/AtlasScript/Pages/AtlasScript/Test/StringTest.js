/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.StringTest = function() {

    this.testEndsWith = function() {
        var s = "hello world";

        AtlasUnit.Assert.isTrue(s.endsWith(""));
        AtlasUnit.Assert.isTrue(s.endsWith("world"));
        AtlasUnit.Assert.isTrue(s.endsWith("hello world"));
        AtlasUnit.Assert.isFalse(s.endsWith("hello"));
        // Suffix longer than string
        AtlasUnit.Assert.isFalse(s.endsWith("hello hello world"));
    }

    this.testFormatBadIndex = function() {
        var formatted = String.format("This will fail because of a bad format expression. {a}", 1);
    }
    this.testFormatBadIndex["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: 'Sys.ArgumentException: The format string is invalid.\nParameter name: format',
        paramName: 'format'
    };
    this.testFormatBadIndex["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testFormatDoubleBrace = function() {
        AtlasUnit.Assert.areEqual("before { after } }{}. Number of the day: 1.",
            String.format("{0} {{ {1} }} }}{{}}. Number of the day: {2}.", "before", "after", 1));
    }

    this.testFormatUndefinedArgument = function() {
        AtlasUnit.Assert.areEqual("before  after", String.format("before {0} after", undefined));
    }

    this.testFormatNullArgument = function() {
        AtlasUnit.Assert.areEqual("before  after", String.format("before {0} after", null));
    }

    this.testFormatUnmatchedOpeningBrace = function() {
        var formatted = String.format("This {0} fail because of an unmatched {.", "will");
    }
    this.testFormatUnmatchedOpeningBrace["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: 'Sys.ArgumentException: The format string contains an unmatched opening or closing brace.' +
                 '\nParameter name: format',
        paramName: 'format'
    };
    this.testFormatUnmatchedOpeningBrace["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testFormatUnmatchedClosingBrace = function() {
        var formatted = String.format("This {0} fail because of an unmatched }. Number of the day: {1}.", "will", 1);
    }
    this.testFormatUnmatchedClosingBrace["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: 'Sys.ArgumentException: The format string contains an unmatched opening or closing brace.' +
                 '\nParameter name: format',
        paramName: 'format'
    };
    this.testFormatUnmatchedClosingBrace["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testFormatToFormattedString = function() {
        var o = new AtlasScript.Test.StringTest.ConvertableToFormattedString();

        AtlasUnit.Assert.areEqual("format: [000000]", String.format("{0:000000}", o));
        AtlasUnit.Assert.areEqual("format: []", String.format("{0}", o));
    }

    this.testIsClass = function() {
        AtlasUnit.Assert.isTrue(Type.isClass(String));
    }

    this.testStartsWith = function() {
        var s = "hello world";

        AtlasUnit.Assert.isTrue(s.startsWith(""));
        AtlasUnit.Assert.isTrue(s.startsWith("hello"));
        AtlasUnit.Assert.isTrue(s.startsWith("hello world"));
        AtlasUnit.Assert.isFalse(s.startsWith("world"));
        // Prefix longer than string
        AtlasUnit.Assert.isFalse(s.startsWith("hello world world"));
    }

    this.testTrim = function() {
        AtlasUnit.Assert.areEqual("", "".trim());
        AtlasUnit.Assert.areEqual("", " \r\n\t ".trim());
        AtlasUnit.Assert.areEqual("trim\r\nmed", "trim\r\nmed".trim());
        AtlasUnit.Assert.areEqual("trim\r\nmed", "\r\n\t trim\r\nmed \r\n\t".trim());
    }

    this.testTrimEnd = function() {
        AtlasUnit.Assert.areEqual("", "".trimEnd());
        AtlasUnit.Assert.areEqual("", " \r\n\t ".trimEnd());
        AtlasUnit.Assert.areEqual("trim\r\nmed", "trim\r\nmed".trimEnd());
        AtlasUnit.Assert.areEqual("\r\n\t trim\r\nmed", "\r\n\t trim\r\nmed \r\n\t".trimEnd());
    }

    this.testTrimStart = function() {
        AtlasUnit.Assert.areEqual("", "".trimStart());
        AtlasUnit.Assert.areEqual("", " \r\n\t ".trimStart());
        AtlasUnit.Assert.areEqual("trim\r\nmed", "trim\r\nmed".trimStart());
        AtlasUnit.Assert.areEqual("trim\r\nmed \r\n\t", "\r\n\t trim\r\nmed \r\n\t".trimStart());
    }

    this.testTypeName = function() {
        AtlasUnit.Assert.areEqual("String", Object.getTypeName("foo"));
    }
}
AtlasScript.Test.StringTest.registerClass("AtlasScript.Test.StringTest");
AtlasScript.Test.StringTest["AtlasUnit.IsTestFixture"] = true;

AtlasScript.Test.StringTest.ConvertableToFormattedString = function() {
}
AtlasScript.Test.StringTest.ConvertableToFormattedString.prototype = {
    toFormattedString: function(format) {
        return "format: [" + format + "]";
    }
}
AtlasScript.Test.StringTest.ConvertableToFormattedString.registerClass("AtlasScript.Test.StringTest.ConvertableToFormattedString");

