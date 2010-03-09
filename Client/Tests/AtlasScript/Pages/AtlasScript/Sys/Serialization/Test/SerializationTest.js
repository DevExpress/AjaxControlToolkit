/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.Serialization.Test");

Sys.Serialization.Test.SerializationTest = function() {

    this.setUp = function() {
    }

    this.testSerialization = function() {
        AtlasUnit.Assert.areEqual('"hi"', Sys.Serialization.JavaScriptSerializer.serialize("hi"));
        AtlasUnit.Assert.areEqual('"hi"', Sys.Serialization.JavaScriptSerializer.serialize(new String("hi")));
        AtlasUnit.Assert.areEqual('"1"', Sys.Serialization.JavaScriptSerializer.serialize("1"));
        AtlasUnit.Assert.areEqual('"1"', Sys.Serialization.JavaScriptSerializer.serialize(new String("1")));
        AtlasUnit.Assert.areEqual('1', Sys.Serialization.JavaScriptSerializer.serialize(1));
        AtlasUnit.Assert.areEqual('1', Sys.Serialization.JavaScriptSerializer.serialize(new Number(1)));
        AtlasUnit.Assert.areEqual('[1,2,3,{"1":[3]}]', Sys.Serialization.JavaScriptSerializer.serialize([1,2,3,{1:[3]}]));
        AtlasUnit.Assert.areEqual('{"foo":"bar","baz":2,"array":[1,"bar",2]}', Sys.Serialization.JavaScriptSerializer.serialize({foo: 'bar', baz: 2, array: [1, "bar", 2]}));
        AtlasUnit.Assert.areEqual('{"foo":"bar","baz":2,"array":[1,"bar",2]}', Sys.Serialization.JavaScriptSerializer.serialize({foo: new String('bar'), baz: new Number(2), array: [ new Number(1), new String("bar"), new Number(2)]}));
        AtlasUnit.Assert.areEqual('"hi"', Sys.Serialization.JavaScriptSerializer.serialize("hi"));
        AtlasUnit.Assert.areEqual('{"1":1,"2":2,"3":"three","four":"four","five":5,"array":[1,2,3]}', Sys.Serialization.JavaScriptSerializer.serialize({1:1,2:2,3:'three','four':'four',"five":5,array:[1,2,3]}));
        AtlasUnit.Assert.areEqual('"\u00ab"', Sys.Serialization.JavaScriptSerializer.serialize(Sys.Serialization.JavaScriptSerializer.deserialize('"\u00ab"')));
        AtlasUnit.Assert.areEqual('"\\u000b"', Sys.Serialization.JavaScriptSerializer.serialize(Sys.Serialization.JavaScriptSerializer.deserialize('"\u000b"')));
        AtlasUnit.Assert.areEqual('"\\u001b"', Sys.Serialization.JavaScriptSerializer.serialize(Sys.Serialization.JavaScriptSerializer.deserialize('"\u001b"')));
        AtlasUnit.Assert.areEqual('"test\\f\\r\\b\\"\\t\\n"', Sys.Serialization.JavaScriptSerializer.serialize("test\f\r\b\"\t\n"));

        AtlasUnit.Assert.areEqual('"\\\\/Date(123)\\\\/"', Sys.Serialization.JavaScriptSerializer.serialize("\\/Date(123)\\/"));
        AtlasUnit.Assert.areEqual('true', Sys.Serialization.JavaScriptSerializer.serialize(true));
        AtlasUnit.Assert.areEqual('true', Sys.Serialization.JavaScriptSerializer.serialize(new Boolean(true)));
        AtlasUnit.Assert.areEqual('false', Sys.Serialization.JavaScriptSerializer.serialize(false));
        AtlasUnit.Assert.areEqual('false', Sys.Serialization.JavaScriptSerializer.serialize(new Boolean(false)));
    }

    this.testSpecialCharSerialization = function() {
        AtlasUnit.Assert.areEqual('"\\u0000"', Sys.Serialization.JavaScriptSerializer.serialize("\u0000"));
        AtlasUnit.Assert.areEqual('"\\u0001"', Sys.Serialization.JavaScriptSerializer.serialize("\u0001"));
        AtlasUnit.Assert.areEqual('"foo\\u0002bar"', Sys.Serialization.JavaScriptSerializer.serialize("foo\u0002bar"));
        AtlasUnit.Assert.areEqual('["foo\\u0003bar"]', Sys.Serialization.JavaScriptSerializer.serialize(["foo\u0003bar"]));
        AtlasUnit.Assert.areEqual('["foo\\u0004bar","a\\u0005b","c\\u0006","\\u0007d"]', Sys.Serialization.JavaScriptSerializer.serialize(["foo\u0004bar", "a\u0005b", "c\u0006", "\u0007d"]));
        AtlasUnit.Assert.areEqual('{"a":"foo\\bbar","b":"a\\tb","c":"c\\n","d":"\\nd","e":"u\\u000ba"}',
            Sys.Serialization.JavaScriptSerializer.serialize({"a" : "foo\u0008bar", "b":"a\u0009b","c":"c\u000A","d":"\u000ad", "e":"u\u000ba"}));
        AtlasUnit.Assert.areEqual('{"a":"foo\\bbar","b":"a\\tb","c":"c\\n","d":"\\nd","e":"u\\u000ba"}',
            Sys.Serialization.JavaScriptSerializer.serialize({"a" : "foo\u0008bar", "b":"a\u0009b","c":"c\u000A","d":"\u000ad", "e":"u\u000ba"}));

        AtlasUnit.Assert.areEqual('["a\\fa","a\\ra","a\\u000ea","a\\u000fa","a\\u0010a","a\\u0011a","a\\u0012a","a\\u0013a","a\\u0014a","a\\u0015a","a\\u0016a","a\\u0017a","a\\u0018a","a\\u0019a","a\\u001aa","a\\u001ba","a\\u001cA","a\\u001da","a\\u001eA","a\\u001fA","a a"]',
            Sys.Serialization.JavaScriptSerializer.serialize(
                ["a\u000ca", "a\u000da", "a\u000ea", "a\u000fa", "a\u0010a", "a\u0011a", "a\u0012a", "a\u0013a", "a\u0014a", "a\u0015a", "a\u0016a", "a\u0017a", "a\u0018a","a\u0019a", "a\u001Aa", "a\u001ba", "a\u001CA", "a\u001Da", "a\u001EA", "a\u001FA", "a\u0020a"]));
    }

    function testNoEscapedLongStringSerialization() {
        var testString = " !#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
        testString = testString + testString + testString;
        var resultString = '"' + testString + '"';
        AtlasUnit.Assert.areEqual(resultString, Sys.Serialization.JavaScriptSerializer.serialize(testString));
    }

    this.testNoEscapedLongStringSerializationOnAllBrowsers = function() {
        AtlasUnit.Util.execInAllBrowsers(testNoEscapedLongStringSerialization);
    }

    function testEscapedLongStringLessThan128CharSerialization() {
        var testString = "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\u000a\u000b\u000c\u000d" +
                         "\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b" +
                         "\u001c\u001d\u001e\u001f\\\" !#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWX" +
                         "YZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
        var resultString = '"\\u0000\\u0001\\u0002\\u0003\\u0004\\u0005\\u0006\\u0007\\b\\t\\n\\u000b\\f\\r' + 
                           '\\u000e\\u000f\\u0010\\u0011\\u0012\\u0013\\u0014\\u0015\\u0016\\u0017\\u0018\\u0019' +
                           '\\u001a\\u001b\\u001c\\u001d\\u001e\\u001f\\\\\\" !#$%&\'()*+,-./0123456789:;<=>?@AB' +
                           'CDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~"';
        AtlasUnit.Assert.areEqual(resultString, Sys.Serialization.JavaScriptSerializer.serialize(testString));
    }

    this.testEscapedLongStringLessThan128CharSerializationOnAllBrowsers = function() {
        AtlasUnit.Util.execInAllBrowsers(testEscapedLongStringLessThan128CharSerialization);
    }

    function testEscapedLongStringMoreThan128CharSerialization() {
        var testString = "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\u000a\u000b\u000c\u000d" +
                         "\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b" +
                         "\u001c\u001d\u001e\u001f\\\" !#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWX" +
                         "YZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~\u007f";
        testString = testString + testString + testString;
        var resultString = '\\u0000\\u0001\\u0002\\u0003\\u0004\\u0005\\u0006\\u0007\\b\\t\\n\\u000b\\f\\r' + 
                           '\\u000e\\u000f\\u0010\\u0011\\u0012\\u0013\\u0014\\u0015\\u0016\\u0017\\u0018\\u0019' +
                           '\\u001a\\u001b\\u001c\\u001d\\u001e\\u001f\\\\\\" !#$%&\'()*+,-./0123456789:;<=>?@AB' +
                           'CDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~\u007f';
        resultString = '"' + resultString + resultString + resultString + '"';
        AtlasUnit.Assert.areEqual(resultString, Sys.Serialization.JavaScriptSerializer.serialize(testString));
    }

    this.testEscapedLongStringMoreThan128SerializationOnAllBrowsers = function() {
        AtlasUnit.Util.execInAllBrowsers(testEscapedLongStringMoreThan128CharSerialization);
    }

    this.testSetNaN = function() {
        Sys.Serialization.JavaScriptSerializer.serialize(Number.NaN);
    }
    this.testSetNaN["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testSetNegativeInfinity = function() {
        Sys.Serialization.JavaScriptSerializer.serialize(Number.NEGATIVE_INFINITY);
    }
    this.testSetNegativeInfinity["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testSetPositiveInfinity = function() {
        Sys.Serialization.JavaScriptSerializer.serialize(Number.POSITIVE_INFINITY);
    }
    this.testSetPositiveInfinity["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testNull = function() {
        Sys.Serialization.JavaScriptSerializer.deserialize(null);
    }
    this.testNull["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentNullException', paramName: 'data' }
    this.testNull["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testEmptyString = function() {
        Sys.Serialization.JavaScriptSerializer.deserialize("");
    }
    this.testEmptyString["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentException', paramName: 'data' }

    this.testDate = function() {
        var date = new Date();
        date.setTime(100000);
        AtlasUnit.Assert.areEqual('"\\/Date(100000)\\/"', Sys.Serialization.JavaScriptSerializer.serialize(date));
        AtlasUnit.Assert.areEqual(100000, Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize(date)).getTime());
        date.setTime(-1000000);
        AtlasUnit.Assert.areEqual('"\\/Date(-1000000)\\/"', Sys.Serialization.JavaScriptSerializer.serialize(date));
        AtlasUnit.Assert.areEqual(-1000000, Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize(date)).getTime());
//        date.setTime(Date.parse("Jan 1, 100")); // this gives a different result on Opera than on other browsers.
        date.setTime(-59011430400000);
        AtlasUnit.Assert.areEqual('"\\/Date(-59011430400000)\\/"', Sys.Serialization.JavaScriptSerializer.serialize(date));
        AtlasUnit.Assert.areEqual(-59011430400000, Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize(date)).getTime());
        date.setTime(59011430400000);
        AtlasUnit.Assert.areEqual('"\\/Date(59011430400000)\\/"', Sys.Serialization.JavaScriptSerializer.serialize(date));
        AtlasUnit.Assert.areEqual(59011430400000, Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize(date)).getTime());
        var jsonText = "\"\\/Date(-62135568000000)\\/\"";
        date = Sys.Serialization.JavaScriptSerializer.deserialize(jsonText );
        AtlasUnit.Assert.areEqual(-62135568000000, date.getTime());
        AtlasUnit.Assert.areEqual(jsonText, Sys.Serialization.JavaScriptSerializer.serialize(date));
        var obj = Sys.Serialization.JavaScriptSerializer.deserialize('[{"dt":"\\/Date(10000)\\/"}, {"dt":"\\/Date(20000)\\/"},{"dt":"\\/Date(30000)\\/"}, ["\\/Date(40000)\\/", "\\/Date(50000)\\/", {"a":{"b":"\\/Date(-60000)\\/","c":"\\/Date(-70000)\\/"}}], "\\/Date(90000)\\/"]');
        AtlasUnit.Assert.areEqual(10000, obj[0].dt.getTime());
        AtlasUnit.Assert.areEqual(20000, obj[1].dt.getTime());
        AtlasUnit.Assert.areEqual(30000, obj[2].dt.getTime());
        AtlasUnit.Assert.areEqual(40000, obj[3][0].getTime());
        AtlasUnit.Assert.areEqual(50000, obj[3][1].getTime());
        AtlasUnit.Assert.areEqual(-60000, obj[3][2].a.b.getTime());
        AtlasUnit.Assert.areEqual(-70000, obj[3][2].a.c.getTime());
        AtlasUnit.Assert.areEqual(90000, obj[4].getTime());
        // test that timezone info is ignored during deserialzation
        AtlasUnit.Assert.areEqual(100000, Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(100000A)\\/"').getTime());
        AtlasUnit.Assert.areEqual(100000, Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(100000z)\\/"').getTime());
        AtlasUnit.Assert.areEqual(-100000, Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(-100000U)\\/"').getTime());
        AtlasUnit.Assert.areEqual(100000, Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(100000+1234)\\/"').getTime());
        AtlasUnit.Assert.areEqual(100000, Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(100000-0987)\\/"').getTime());
        AtlasUnit.Assert.areEqual(-100000, Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(-100000+9876)\\/"').getTime());
        AtlasUnit.Assert.areEqual(-100000, Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(-100000-2345)\\/"').getTime());
    }

    this.testDeserialize = function() {
        AtlasUnit.Assert.areEqual("hi", Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize("hi")));
        AtlasUnit.Assert.areEqual(1, Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize(1)));
        AtlasUnit.Assert.areEqual("1", Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize("1")));
        var array = [1,2,3,{1:[3]}];
        AtlasUnit.Assert.areEqual(Sys.Serialization.JavaScriptSerializer.serialize(Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize(array))), Sys.Serialization.JavaScriptSerializer.serialize(array));
        var obj = Sys.Serialization.JavaScriptSerializer.deserialize('{"1":1,"2":2,"3":"three","four":"four","five":5,"array":[1,2,3]}');
        AtlasUnit.Assert.areEqual(1, obj["1"]);
        AtlasUnit.Assert.areEqual(2, obj["2"]);
        AtlasUnit.Assert.areEqual('three', obj["3"]);
        AtlasUnit.Assert.areEqual('four', obj["four"]);
        AtlasUnit.Assert.areEqual(5, obj["five"]);
        AtlasUnit.Assert.areEqual(3, obj["array"].length);
        AtlasUnit.Assert.areEqual(2, obj["array"][1]);
        
        // test for string/date collisions
        AtlasUnit.Assert.areEqual("@123@", Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize("@123@")));
        AtlasUnit.Assert.areEqual("@123", Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize("@123")));
        AtlasUnit.Assert.areEqual("123@", Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize("123@")));
        AtlasUnit.Assert.areEqual("\\/Date(123)\\/", Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize("\\/Date(123)\\/")));
        AtlasUnit.Assert.areEqual("\\/Date(123)", Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize("\\/Date(123)")));       
        AtlasUnit.Assert.areEqual("Date(123)\\/", Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize("Date(123)\\/")));       
        AtlasUnit.Assert.areEqual("/Date(123)/", Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize("/Date(123)/")));       
        AtlasUnit.Assert.areEqual("\\/Date(123)/", Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize("\\/Date(123)/")));       
        AtlasUnit.Assert.areEqual("/Date(123)\\/", Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize("/Date(123)\\/")));       
        AtlasUnit.Assert.areEqual("/Date(123a+1234)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123a+1234)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123a-1234)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123a-1234)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123+456)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123+456)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123-456)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123-456)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123+45678)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123+45678)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123-45678)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123-45678)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123+12a4)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123+12a4)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123-12a4)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123-12a4)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123:+1234)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123:+1234)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123:-1234)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123:-1234)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123++1234)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123++1234)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123--1234)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123--1234)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123-+1234)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123-+1234)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123+)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123+)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123-)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123-)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123?+1234)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123?+1234)\\/"'));
        AtlasUnit.Assert.areEqual("/Date(123?-1234)/", Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123?-1234)\\/"'));

        // ensure a serialized string that looks like: "<whatever>\"\/Date(123)\/" does not deserialize as "<whatever>new Date(123)".
        // We can't use our serializer to simulate a string like that since forward slashes are not escaped.

        // serialized string: "abc\"\/Date(123)\/"      escaped: "abc\\"\\/Date(123)\\/"
        AtlasUnit.Assert.areEqual('abc"/Date(123)/', Sys.Serialization.JavaScriptSerializer.deserialize('"abc\\"\\/Date(123)\\/"'));

        // serialized string: "\/Date(123)\/\"abc"      escaped: "\\/Date(123)\\/\\"abc"
        AtlasUnit.Assert.areEqual('/Date(123)/"abc', Sys.Serialization.JavaScriptSerializer.deserialize('"\\/Date(123)\\/\\"abc"'));
    }

    function TestFoo(i, s, ar) {
        this.i = i;
        this.s = s;
        this.ar = ar;
    }

    this.testCustomObject = function() {
        var foo = new TestFoo(1, "Hi", [1, true, "Whatever"]);
        var foo2 = Sys.Serialization.JavaScriptSerializer.deserialize(Sys.Serialization.JavaScriptSerializer.serialize(foo));
        AtlasUnit.Assert.areEqual(foo.i, foo2.i);
        AtlasUnit.Assert.areEqual(foo.s, foo2.s);
        AtlasUnit.Assert.areEqual(foo.ar[0], foo2.ar[0]);
        AtlasUnit.Assert.areEqual(foo.ar[1], foo2.ar[1]);
        AtlasUnit.Assert.areEqual(foo.ar[2], foo2.ar[2]);
    }

}
Sys.Serialization.Test.SerializationTest.registerClass("Sys.Serialization.Test.SerializationTest");
Sys.Serialization.Test.SerializationTest["AtlasUnit.IsTestFixture"] = true;

