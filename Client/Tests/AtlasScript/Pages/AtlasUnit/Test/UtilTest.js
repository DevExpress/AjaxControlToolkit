/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Test");

AtlasUnit.Test.UtilTest = function() {
    this.testConvertToStringArray = function() {
        AtlasUnit.Assert.areEqual("[undefined,null,foo]", AtlasUnit.Util.convertToString([undefined, null, "foo"]));
    }

    this.testConvertToStringDomElement = function() {
        var elem = document.createElement("div");
        var str = AtlasUnit.Util.convertToString(elem);
        AtlasUnit.Assert.areEqual("{DIV}", str);
    }

    this.testFormatPlainTextAsHtml = function() {
        var str = '<div id="foo">Hello &  World\r\nHello';
        var expected = '&lt;div id=&quot;foo&quot;&gt;Hello &amp; &nbsp;World\r\n<br />\r\nHello';

        var actual = AtlasUnit.Util.formatPlainTextAsHtml(str);
        AtlasUnit.Assert.areEqual(expected, actual);
    }

    this.testFireMouseEvent = function() {
        var elem = document.createElement("div");
        var docFrag = document.createDocumentFragment();

        docFrag.appendChild(elem);

        var eventFired = false;
        var handler = function() {
            eventFired = true;
        };

        // TODO: Replace this logic when events are implemented in compat layer
        if (elem.attachEvent) {
            elem.attachEvent("onmousedown", handler);
        }
        else {
           elem.addEventListener("mousedown", handler, false);
        }

        AtlasUnit.Util.fireMouseEvent(elem, "mousedown");

        AtlasUnit.Assert.isTrue(eventFired, "Event was not fired");
    }

    this.testIntersect = function() {
        AtlasUnit.Assert.isEmpty(AtlasUnit.Util.intersect(null, null));
        AtlasUnit.Assert.isEmpty(AtlasUnit.Util.intersect(null, ["foo"]));
        AtlasUnit.Assert.isEmpty(AtlasUnit.Util.intersect(["foo"], null));

        AtlasUnit.Assert.isEmpty(AtlasUnit.Util.intersect([], []));
        AtlasUnit.Assert.isEmpty(AtlasUnit.Util.intersect([], ["foo"]));
        AtlasUnit.Assert.isEmpty(AtlasUnit.Util.intersect(["foo"], []));

        AtlasUnit.Assert.elementsEqual(["foo"], AtlasUnit.Util.intersect(["foo"], ["foo"]));
        AtlasUnit.Assert.elementsEqual(["foo"], AtlasUnit.Util.intersect(["foo"], ["foo", "bar"]));
        AtlasUnit.Assert.elementsEqual(["foo"], AtlasUnit.Util.intersect(["foo", "bar"], ["foo"]));

        AtlasUnit.Assert.elementsEqual(["foo", "bar"], AtlasUnit.Util.intersect(["foo", "bar"], ["foo", "bar"]));
    }

    this.testMap = function() {
        var nums = [1, 2, 3];
        var square = function(x) {
            return x * x;
        }

        AtlasUnit.Assert.elementsEqual([1, 4, 9], AtlasUnit.Util.map(square, nums));
    }
}
AtlasUnit.Test.UtilTest.registerClass("AtlasUnit.Test.UtilTest");
AtlasUnit.Test.UtilTest["AtlasUnit.IsTestFixture"] = true;

Sys.Application.notifyScriptLoaded();
