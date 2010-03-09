/// <reference name="MicrosoftAjax.js" />
Type.registerNamespace("Sys.Test");

Sys.Test.SysTest = function() {
    function getDom(html) {
        var div = document.createElement("div");
        div.innerHTML = html;
        return div;
    }
    
    function verifyGet(selector, html) {
        var dom = getDom(html);
        var target = Sys.get(selector, dom);
        AtlasUnit.Assert.isNotNull(target, "'" + selector + "' not found in html: " + html);
        AtlasUnit.Assert.isTrue(!!target.getAttribute("target"), "'" + selector + "' should target '" + target.tagName + "' in html: " + html);
    }
    
    function verifyQuery(selector, html, expectedCount) {
        var i, dom = getDom(html);
        function test(api, msg) {
            var targets;
            if (api === jQuery && (selector instanceof Array)) {
                targets = [];
                for (i = 0; i < selector.length; i++) {
                    targets.push.apply(targets, api(selector[i], dom).get());
                }
            }
            else {
                targets = api(selector, dom).get();
            }
            AtlasUnit.Assert.areEqual(expectedCount, targets.length, (msg + ": Found incorrect number of elements for selector {" + selector + "} in html: " + html));
            for (i = 0; i < targets.length; i++) {
                var target = targets[i];
                AtlasUnit.Assert.isTrue(!!target.getAttribute("target"), (msg + ": {" + selector + "} should target '" + target.tagName + "' in html: " + html));
            }
        }
        test(Sys.query, "Sys.query");
        test(jQuery, "jQuery");
    }

    function verifyFilter(dom, selector, expectedCount) {
        var targets = Sys.query(dom).filter(selector).get();
        AtlasUnit.Assert.areEqual(expectedCount, targets.length, "Found incorrect number of elements for filter selector {" + selector + "}");
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            AtlasUnit.Assert.isTrue(!!target.getAttribute("target"), "{" + selector + "} should target '" + target.tagName + "'");
        }
    }
    
    function verifyFind(dom, selector, expectedCount) {
        var targets = Sys.query(dom).find(selector).get();
        AtlasUnit.Assert.areEqual(expectedCount, targets.length, "Found incorrect number of elements for 'find' selector {" + selector + "}");
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            AtlasUnit.Assert.isTrue(!!target.getAttribute("target"), "{" + selector + "} should target '" + target.tagName + "'");
        }
    }
    
    this.setUp = function() {
    }
    this.tearDown = function() {
    }
    
    this.testGet = function() {
        verifyGet("#foo", "<div id='foo' target='true'></div>");
        verifyGet("#foo", "<div><div id='foo' target='true'></div></div>");
        verifyGet("#foo", "<div></div><div id='foo' target='true'></div><div></div>");
        verifyGet(".foo", "<div class='foo' target='true'></div>");
        verifyGet(".foo", "<div class='foo' target='true'></div><div class='foo'></div>");
        verifyGet(".foo", "<div class='foo bar' target='true'></div>");
        verifyGet(".foo", "<div class='baz foo bar' target='true'></div>");
        verifyGet(".foo", "<div><div class='foo' target='true'></div></div>");
        verifyGet(".foo", "<div><div class='foo bar' target='true'></div></div>");
        verifyGet(".foo", "<div><div class='baz foo bar' target='true'></div></div>");
        verifyGet("pre", "<pre target='true'></pre>");
        verifyGet("pre", "<pre target='true'><pre></pre></pre>");
        verifyGet("pre", "<pre target='true'></pre><pre></pre>");
        verifyGet("pre", "<div><pre target='true'></pre></div>");
        verifyGet("pre", "<div></div><div><pre target='true'></pre></div>");
        verifyGet(".sys-template", "<div></div><div><pre class='sys-template' target='true'></pre></div>");
    }
    
    this.testQuerySimple = function() {
        verifyQuery("#foo", "<div id='foo' target='true'></div>", 1);
        verifyQuery("#foo", "<div><div id='foo' target='true'></div></div>", 1);
        verifyQuery("#foo", "<div></div><div id='foo' target='true'></div><div></div>", 1);
        verifyQuery(".foo", "<div class='foo' target='true'></div>", 1);
        verifyQuery(".foo", "<div class='foo' target='true'></div><div class='bar'></div>", 1);
        verifyQuery(".foo", "<div class='foo bar' target='true'></div>", 1);
        verifyQuery(".foo", "<div class='baz foo bar' target='true'></div>", 1);
        verifyQuery(".foo", "<div><div class='foo' target='true'></div></div>", 1);
        verifyQuery(".foo", "<div><div class='foo bar' target='true'></div></div>", 1);
        verifyQuery(".foo", "<div><div class='baz foo bar' target='true'></div></div>", 1);
        verifyQuery(".foo", "<div class='foo' target='true'></div><div class='foo' target='true'></div>", 2);
        verifyQuery(".foo", "<div class='foo' target='true'></div><div class='bar'></div><div class='foo' target='true'></div>", 2);
        verifyQuery(".foo", "<div class='foo bar' target='true'><div class='foo bar' target='true'></div></div>", 2);
        verifyQuery(".foo", "<div class='baz foo bar' target='true'></div><div class='baz foo bar' target='true'></div>", 2);
        verifyQuery(".foo", "<div><div class='foo' target='true'></div><div class='foo' target='true'></div></div>", 2);
        verifyQuery(".foo", "<div><div class='foo bar' target='true'></div><div class='foo bar' target='true'></div></div>", 2);
        verifyQuery(".foo", "<div><div class='baz foo bar' target='true'></div><div class='baz foo bar' target='true'></div></div>", 2);
        verifyQuery("pre", "<pre target='true'></pre>", 1);
        verifyQuery("pre", "<pre target='true'><span></span></pre>", 1);
        verifyQuery("pre", "<pre target='true'></pre><span></span>", 1);
        verifyQuery("pre", "<div><pre target='true'></pre></div>", 1);
        verifyQuery("pre", "<div></div><div><pre target='true'></pre></div>", 1);
        verifyQuery("pre", "<pre target='true'></pre><pre target='true'></pre>", 2);
        verifyQuery("pre", "<pre target='true'><span></span></pre><pre target='true'><span></span></pre>", 2);
        verifyQuery("pre", "<pre target='true'></pre><span></span><pre target='true'></pre>", 2);
        verifyQuery("pre", "<div><pre target='true'></pre><pre target='true'></pre></div>", 2);
        verifyQuery("pre", "<div></div><div><pre target='true'></pre></div><div></div><div><pre target='true'></pre></div>", 2);
        verifyQuery(["div","#foo"], "<div target='true'></div><span id='foo' target='true'></span>", 2);
    }

    this.testQueryDomElement = function() {
        var dom = getDom("<div id='div1' target='true'></div><div id='div2' target='true'></div>"),
            div1 = dom.childNodes[0],
            div2 = dom.childNodes[1];
        verifyQuery(div1, "", 1);
        verifyQuery([div1,div2], "", 2);
    }

    this.testQueryMixed = function() {
        var dom = getDom("<div id='div1' target='true'></div>"),
            div1 = dom.childNodes[0];
        verifyQuery(["#div2",div1], "<div id='div2' target='true'></div>", 2);
    }

    this.testFilter = function() {
        var dom = getDom("<div target='true'></div><span target='true'></span><pre target='true'></pre>").childNodes;
        verifyFilter(getDom("<div target='true'></div><span></span><pre></pre>").childNodes, "div", 1);
        verifyFilter(getDom("<div></div><span></span><pre target='true'></pre>").childNodes, "pre", 1);
        verifyFilter(getDom("<div></div><span target='true'></span><pre></pre>").childNodes, "span", 1);
        verifyFilter(getDom("<div target='true'></div><span target='true'></span><pre target='true'></pre>").childNodes, ["div", "pre", "span"], 3);
        verifyFilter(getDom("<div></div><span></span><pre></pre>").childNodes, "p", 0);
    }

    this.testFind = function() {
        verifyFind(getDom("<div><span class='target' target='true'></span><div><pre class='target' target='true'><span class='target' target='true'></span></pre></div></div>"), ".target", 3);
        verifyFind(getDom("<div><span target='true'></span><div><pre target='true'><span target='true'></span></pre></div></div>"), ["span", "pre"], 3);
        verifyFind(getDom("<div target='true'></div><div target='true'><div target='true'></div></div>"), "*", 3);
        verifyFind(getDom("<div></div><div><div></div></div>"), "#foo", 0);
        verifyFind(getDom("<div></div><div><div></div></div>"), "span", 0);
        verifyFind(getDom("<div></div><div><div></div></div>"), ".target", 0);
    }

    this.testGetComponent = function() {
        AtlasUnit.Assert.isNull(jQuery(null).component());
        AtlasUnit.Assert.isNull(Sys.query(null).component());
        var dom = getDom("<div sys:attach='foo' xmlns:foo='javascript:Sys.UI.Test.TemplateTest.FooControl'></div><div sys:attach='foo' xmlns:foo='javascript:Sys.UI.Test.TemplateTest.FooControl'></div>").childNodes;
        Sys.query(dom).activateElements();
        var c1 = dom[0].control;
        var c2 = dom[1].control;
        function test(elementSet, msg) {
            AtlasUnit.Assert.areEqual(c1, elementSet.component(), msg + ": component()");
            AtlasUnit.Assert.areEqual(c1, elementSet.component(null, 0), msg + ":component(null, 0)");
            AtlasUnit.Assert.areEqual(c2, elementSet.component(null, 1), msg + ":component(null, 1)");
            AtlasUnit.Assert.areEqual(c1, elementSet.component(Sys.UI.Test.TemplateTest.FooControl), msg + ":component(type)");
            AtlasUnit.Assert.areEqual(c2, elementSet.component(Sys.UI.Test.TemplateTest.FooControl, 1), msg + ":component(type, 1)");
            AtlasUnit.Assert.isNull(elementSet.component(Sys.UI.Test.TemplateTest.FooControl, 2), msg + ":component(type, 2)");
            AtlasUnit.Assert.isNull(elementSet.component(null, 2), msg + ":component(null, 2)");
        }
        test(Sys.query(dom), "Sys.query");
        test(jQuery(dom), "jQuery");
    }

    this.testGetComponents = function() {
        AtlasUnit.Assert.areEqual(0, jQuery(null).components().get().length);
        AtlasUnit.Assert.areEqual(0, Sys.query(null).components().get().length);
        var dom = getDom("<div sys:attach='foo' xmlns:foo='javascript:Sys.UI.Test.TemplateTest.FooControl'></div><div sys:attach='foo' xmlns:foo='javascript:Sys.UI.Test.TemplateTest.FooControl'></div>").childNodes;
        Sys.query(dom).activateElements();
        var c1 = dom[0].control;
        var c2 = dom[1].control;
        function test(elementSet, msg) {
            AtlasUnit.Assert.areEqual(c1, elementSet.components().get(0), msg + ": components()");
            AtlasUnit.Assert.areEqual(c1, elementSet.components(null, 0).get(0), msg + ":components(null, 0)");
            AtlasUnit.Assert.areEqual(c2, elementSet.components(null, 1).get(0), msg + ":components(null, 1)");
            AtlasUnit.Assert.areEqual(c1, elementSet.components(Sys.UI.Test.TemplateTest.FooControl).get(0), msg + ":components(type)");
            AtlasUnit.Assert.areEqual(c2, elementSet.components(Sys.UI.Test.TemplateTest.FooControl, 1).get(0), msg + ":component(type, 1)");
            AtlasUnit.Assert.areEqual(c2, elementSet.components(Sys.UI.Test.TemplateTest.FooControl).get(1), msg + ":component(type).get(1)");
            AtlasUnit.Assert.isNull(elementSet.components(Sys.UI.Test.TemplateTest.FooControl, 2).get(0), msg + ":components(type, 2)");
            AtlasUnit.Assert.isNull(elementSet.components(null, 2).get(0), msg + ":components(null, 2)");
        }
        test(Sys.query(dom), "Sys.query");
        test(jQuery(dom), "jQuery");
    }

    this.testGetComponentsjQueryIntegration = function() {
        var elementSet = jQuery(null);
        AtlasUnit.Assert.areEqual(elementSet, elementSet.components().elements(), "When using jQuery, ComponentSet.elements should return the jQuery wrapped set that was used to create it.");
    }
}
Sys.Test.SysTest.registerClass("Sys.Test.SysTest");
Sys.Test.SysTest["AtlasUnit.IsTestFixture"] = true;
