Type.registerNamespace("Sys.UI.Test");

Sys.UI.Test.TemplateTest = function() {
    this.setUp = function() {
        this._helper = Sys.UI.Test.TemplateHelper;
    }

    this.testElementProperty = function() {
        var div = document.createElement("div");
        var template = new Sys.UI.Template(div);
        AtlasUnit.Assert.areEqual(div, template.get_element());
    }

    this.testTemplateContext = function() {
        var result = this._helper.createAndVerify("helloworld");
        AtlasUnit.Assert.areEqual("Sys.UI.TemplateContext", Object.getTypeName(result));
        var elements = result.nodes;
        AtlasUnit.Assert.isTrue(elements instanceof Array, "Context.nodes returned non array.");
        AtlasUnit.Assert.areEqual(1, elements.length);
    }

    this.testTemplateContextGet = function() {
        var result = this._helper.instantiateIn("textelement<div class='d1' sys:id='{{$id(\"abc\")}}'></div><!--commentnode--><div class='d2' id='xyz'></div>");
        var div1 = result.get('#abc');
        var div2 = result.get('#xyz');
        AtlasUnit.Assert.isTrue(!!div1, "div1 not found.");
        AtlasUnit.Assert.isTrue(!!div2, "div2 not found.");
        div1 = result.get(".d1");
        div2 = result.get(".d2");
        AtlasUnit.Assert.isTrue(!!div1, "div1 not found.");
        AtlasUnit.Assert.isTrue(!!div2, "div2 not found.");
    }

    this.testTemplateContextGetByIdSearchesParentContexts = function() {
        var parent = this._helper.instantiateIn("<div id='abc'></div>");
        var child = this._helper.instantiateIn("<div id='xyz'></div>", null, null, parent);
        var div1 = parent.get('#abc');
        var div2 = child.get('#abc');
        AtlasUnit.Assert.areEqual(div1, div2);
    }

    this.testCreateInstanceSimpleHTML = function() {
        var element;
        this._helper.createAndVerify("helloworld");
        this._helper.createAndVerify("<b>HELLOWORLD</b>");
        this._helper.createAndVerify("Hello <b>WORLD</b>");
        this._helper.createAndVerify("[<!-- Hello World -->]");
        this._helper.createAndVerify("<span id='span1'>Hello, world</span>");
        element = this._helper.createAndVerify("<span id='span1' expando='expando!!' class='foo, bar' style='font-size:25px'>Hello, world</span>", null, null, null, null, "span1");
        AtlasUnit.Assert.areEqual("expando!!", element.getAttribute("expando"));
        this._helper.createAndVerify("<div width='8px'>textNode<p>paragraph<p>nestedparagraph</p><i>italics</i></p><br/><div id='div1'>div1</div></div>");
        this._helper.createAndVerify("<table cellpading='0' cellspacing='1' width='10px' height='4em'><tr id='row1'><td id='cell1' colspan='8'>colspan8</td></tr></table>");
        this._helper.createAndVerify("<input type='text' value='tb1' name='textbox1' size='30' />");
        element = this._helper.createAndVerify("<input id='cb1' type='checkbox' value='cb1' checked='checked' />", null, null, null, null, "cb1");
        this._helper.verifyInput(element, { type: "checkbox", value: "cb1", checked: true });
        // use %REMOVE% to distinguish the radio button groups of the actual element and the expected element, because otherwise
        // in the act of creating the comparison element, the actual element's checked status will change.
        element = this._helper.createAndVerify("<input id='rb1' type='radio' name='r1' value='rb1' checked='checked' />", "<input id='rb10' type='radio' name='%REMOVE%r1' value='rb1' checked='checked' />", null, null, null, "rb1");
        this._helper.verifyInput(element, { type: "radio", name: "r1", value: "rb1", checked: true });
        element = this._helper.createAndVerify("<input type='submit' name='submit1' value='submitval' id='submit1' />", null, null, null, null, "submit1");
        this._helper.verifyInput(element, { type: "submit", name: "submit1", value: "submitval" });
        element = this._helper.createAndVerify("<input type='button' name='submit1' value='buttonval' id='button1' />", null, null, null, null, "button1");
        this._helper.verifyInput(element, { type: "button", name: "submit1", value: "buttonval" });
        element = this._helper.createAndVerify("<button type='reset' name='submit1' id='button1' />", null, null, null, null, "button1");
        this._helper.verifyInput(element, { type: "reset", name: "submit1" }, true);
        element = this._helper.createAndVerify("<button type='button' name='submit1' id='button1' />", null, null, null, null, "button1");
        this._helper.verifyInput(element, { type: "button", name: "submit1" }, true);
        element = this._helper.createAndVerify("<button type='submit' name='submit1' id='button1' />", null, null, null, null, "button1");
        this._helper.verifyInput(element, { type: "submit", name: "submit1" }, true);

        element = this._helper.createAndVerify("<select id='select1' name='select1'><option value='value0'>text0</option><option value='value1' selected='selected'>text1</option></select>", null, null, null, null, "select1");
        this._helper.verifySelect(element, [{ value: "value0", text: "text0" }, { value: "value1", text: "text1", selected: true}]);
        element = this._helper.createAndVerify("<select id='select1' name='select1' value='value1'><option value='value0'>text0</option><option value='value1'>text1</option></select>", null, null, null, null, "select1");
        this._helper.verifySelect(element, [{ value: "value0", text: "text0" }, { value: "value1", text: "text1", selected: true}]);
        element = this._helper.createAndVerify("<select id='select1' name='select1' selectedindex='1'><option value='value0'>text0</option><option value='value1'>text1</option></select>", null, null, null, null, "select1");
        this._helper.verifySelect(element, [{ value: "value0", text: "text0" }, { value: "value1", text: "text1", selected: true}]);

        element = this._helper.createAndVerify("<button id='button1' name='button1'>clickme</button>", null, null, null, null, "button1");
        AtlasUnit.Assert.areEqual("button", element.tagName.toLowerCase());
        AtlasUnit.Assert.areEqual("clickme", element.innerHTML);
    }

    this.testRestrictedAttributes = function() {
        // we use a 'z' tag here (which doesnt exist) because (1) it ensures we filter out attributes even on unknown tags,
        // and (2) it works around browser quirks that make it difficult to test <a href> (IE interprets blank as about:blank),
        // also, see testRestrictedAttributeFormats.
        this._helper.createAndVerify("<z src='javascript:Function.emptyFunction()' />", "<z src='' />");
        this._helper.createAndVerify("<z href='javascript:Function.emptyFunction()'/>", "<z href=''/>");
        // using the actual applet tag causes a java warning dialog
        this._helper.createAndVerify("<appletx codebase='javascript:Function.emptyFunction()'/>", "<appletx codebase=''/>");
        this._helper.createAndVerify("<blockquote cite='javascript:Function.emptyFunction()'/>", "<blockquote cite=''/>");
        this._helper.createAndVerify("<body background='javascript:Function.emptyFunction()'/>", "<body background=''/>");
        this._helper.createAndVerify("<form action='javascript:Function.emptyFunction()'/>", "<form action=''/>");
        this._helper.createAndVerify("<iframe longdesc='javascript:Function.emptyFunction()'/>", "<iframe longdesc=''/>");
        this._helper.createAndVerify("<head profile='javascript:Function.emptyFunction()'/>", "<head profile=''/>");
        this._helper.createAndVerify("<object usemap='javascript:Function.emptyFunction()'/>", "<object usemap=''/>");
        this._helper.createAndVerify("<object classid='javascript:Function.emptyFunction()'/>", "<object classid=''/>");
        this._helper.createAndVerify("<object data='javascript:Function.emptyFunction()'/>", "<object data=''/>");
    }

    this.testRestrictedAttributeFormats = function() {
        // 'imgx' used instead of 'img' to workaround an IE8 issue where the width and height of the image is set to 28x30 when the
        // src cannot be loaded, even if a width and height is explicitly specified. We only need to test that the 'src' attribute
        // is restricted, we dont care if its an actual image tag.
        this._helper.createAndVerify("<imgx src='javascript:Function.emptyFunction()'/>", "<imgx src='' />");
        this._helper.createAndVerify("<imgx src='  javascript:Function.emptyFunction()'/>", "<imgx src='' />");
        this._helper.createAndVerify("<imgx src='JaVaScRiPt:Function.emptyFunction()'/>", "<imgx src='' />");
        this._helper.createAndVerify("<imgx src='JaVaScRiPt: Function.emptyFunction()'/>", "<imgx src='' />");
        this._helper.createAndVerify("<imgx sys:src='{{ \"javascript:Function.emptyFunction()\" }}'/>", "<imgx src='' />");
        this._helper.createAndVerify("<imgx sys:src='{{ { toString: function() { return \"javascript:Function.emptyFunction()\"; } } }}'/>", "<imgx src='' />");
        // other wierd schemes that should be caught
        this._helper.createAndVerify("<imgx src='aA09-+.:foo'/>", "<imgx src='' />");
        this._helper.createAndVerify("<imgx src='+:foo'/>", "<imgx src='' />");
        this._helper.createAndVerify("<imgx src='-:foo'/>", "<imgx src='' />");
        this._helper.createAndVerify("<imgx src='.:foo'/>", "<imgx src='' />");
        this._helper.createAndVerify("<imgx src='a:foo'/>", "<imgx src='' />");
        this._helper.createAndVerify("<imgx src='A:foo'/>", "<imgx src='' />");
        this._helper.createAndVerify("<imgx src='0:foo'/>", "<imgx src='' />");
        this._helper.createAndVerify("<imgx src='9:foo'/>", "<imgx src='' />");
        // extensions
        Sys.Application.registerMarkupExtension("testJavascript", function() { return "javascript:Function.emptyFunction()"; });
        this._helper.createAndVerify("<imgx sys:src='{testJavascript}'/>", "<imgx src='' />");
        // should be ok
        this._helper.createAndVerify("<imgx src='javascript  :foo1'/>", "<imgx src='javascript  :foo1' />");
        this._helper.createAndVerify("<imgx src='javascript  :  foo2'/>", "<imgx src='javascript  :  foo2' />");
        this._helper.createAndVerify("<imgx src='javascriptfoo3'/>", "<imgx src='javascriptfoo3' />");
        this._helper.createAndVerify("<imgx src='java script:foo4'/>", "<imgx src='java script:foo4' />");
    }

    this.testCreateInstanceWithScriptTag = function() {
        this._helper.createAndVerify("<span>Hello,</span><script type='text/javascript'></script><span> world</span>", "<span>Hello,</span><span> world</span>");
    }

    this.testBooleanAttributes = function() {
        var element = this._helper.createAndVerify("<input type='text' id='tb1' readonly='readonly' disabled='disabled' />", null, null, null, null, "tb1");
        AtlasUnit.Assert.isTrue(element.readOnly, "readonly on text input");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on text input");
        element = this._helper.createAndVerify("<img id='img1' disabled='disabled' ismap='ismap' />", null, null, null, null, "img1");
        // assert this differently since only IE actually supports disabled on non-input elements
        AtlasUnit.Assert.isTrue(!!element.getAttribute('disabled'), "disabled on img");
        AtlasUnit.Assert.isTrue(element.isMap, "ismap on img");
        element = this._helper.createAndVerify("<input type='checkbox' id='cb1' readonly='readonly' disabled='disabled' checked='checked' />", null, null, null, null, "cb1");
        AtlasUnit.Assert.isTrue(element.readOnly, "readonly on checkbox");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on checkbox");
        AtlasUnit.Assert.isTrue(element.checked, "checked on checkbox");
        element = this._helper.createAndVerify("<textarea id='ta1' readonly='readonly' disabled='disabled' />", null, null, null, null, "ta1");
        AtlasUnit.Assert.isTrue(element.readOnly, "readonly on textarea");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on textarea");
        element = this._helper.createAndVerify("<select id='sel1' disabled='disabled' multiple='multiple'/>", null, null, null, null, "sel1");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on select");
        AtlasUnit.Assert.isTrue(element.multiple, "multiple on select");
        element = this._helper.createAndVerify("<select multiple='multiple'><option id='op1' disabled='disabled' selected='selected'>op1</option></select>", null, null, null, null, "op1");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on option");
        AtlasUnit.Assert.isTrue(element.selected, "selected on option");
        element = this._helper.createAndVerify("<select multiple='multiple'><option>dummy</option><option id='op1' disabled='disabled' selected='selected'>op1</option></select>", null, null, null, null, "op1");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on option 2");
        AtlasUnit.Assert.isTrue(element.selected, "selected on option 2");
    }

    this.testBooleanAttributeSys = function() {
        var element = this._helper.instantiateIn("<input type='text' id='tb1' sys:readonly='{{true}}' sys:disabled='{{true}}' />", null, null, null, "tb1");
        AtlasUnit.Assert.isTrue(element.readOnly, "readonly on text input");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on text input");
        element = this._helper.instantiateIn("<input type='text' id='tb1' sys:readonly='{{false}}' sys:disabled='{{false}}' />", null, null, null, "tb1");
        AtlasUnit.Assert.isFalse(element.readOnly, "readonly on text input");
        AtlasUnit.Assert.isFalse(element.disabled, "disabled on text input");

        element = this._helper.instantiateIn("<img id='img1' sys:disabled='{{true}}' sys:ismap='{{true}}' />", null, null, null, "img1");
        // assert this differently since only IE actually supports disabled on non-input elements
        AtlasUnit.Assert.isTrue(!!element.getAttribute('disabled'), "disabled on img");
        AtlasUnit.Assert.isTrue(element.isMap, "ismap on img");
        element = this._helper.instantiateIn("<img id='img1' sys:disabled='{{false}}' sys:ismap='{{false}}' />", null, null, null, "img1");
        AtlasUnit.Assert.isFalse(!!element.getAttribute('disabled'), "disabled on img");
        AtlasUnit.Assert.isFalse(element.isMap, "ismap on img");

        element = this._helper.instantiateIn("<input type='checkbox' id='cb1' sys:readonly='{{true}}' sys:disabled='{{true}}' sys:checked='{{true}}' />", null, null, null, "cb1");
        AtlasUnit.Assert.isTrue(element.readOnly, "readonly on checkbox");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on checkbox");
        AtlasUnit.Assert.isTrue(element.checked, "checked on checkbox");
        element = this._helper.instantiateIn("<input type='checkbox' id='cb1' sys:readonly='{{false}}' sys:disabled='{{false}}' sys:checked='{{false}}' />", null, null, null, "cb1");
        AtlasUnit.Assert.isFalse(element.readOnly, "readonly on checkbox");
        AtlasUnit.Assert.isFalse(element.disabled, "disabled on checkbox");
        AtlasUnit.Assert.isFalse(element.checked, "checked on checkbox");

        element = this._helper.instantiateIn("<textarea id='ta1' sys:readonly='{{true}}' sys:disabled='{{true}}' />", null, null, null, "ta1");
        AtlasUnit.Assert.isTrue(element.readOnly, "readonly on textarea");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on textarea");
        element = this._helper.instantiateIn("<textarea id='ta1' sys:readonly='{{false}}' sys:disabled='{{false}}' />", null, null, null, "ta1");
        AtlasUnit.Assert.isFalse(element.readOnly, "readonly on textarea");
        AtlasUnit.Assert.isFalse(element.disabled, "disabled on textarea");

        element = this._helper.instantiateIn("<select id='sel1' sys:disabled='{{true}}' sys:multiple='{{true}}'/>", null, null, null, "sel1");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on select");
        AtlasUnit.Assert.isTrue(element.multiple, "multiple on select");
        element = this._helper.instantiateIn("<select id='sel1' sys:disabled='{{false}}' sys:multiple='{{false}}'/>", null, null, null, "sel1");
        AtlasUnit.Assert.isFalse(element.disabled, "disabled on select");
        AtlasUnit.Assert.isFalse(element.multiple, "multiple on select");

        element = this._helper.instantiateIn("<select multiple='multiple'><option>dummy</option><option id='op1' sys:disabled='{{true}}' sys:selected='{{true}}'>op1</option></select>", null, null, null, "op1");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on option");
        AtlasUnit.Assert.isTrue(element.selected, "selected on option");
        element = this._helper.instantiateIn("<select multiple='multiple'><option>dummy</option><option id='op1' sys:disabled='{{false}}' sys:selected='{{false}}'>op1</option></select>", null, null, null, "op1");
        AtlasUnit.Assert.isFalse(element.disabled, "disabled on option");
        AtlasUnit.Assert.isFalse(element.selected, "selected on option");

        element = this._helper.instantiateIn("<select multiple='multiple'><option>dummy</option><option id='op1' sys:disabled='{{true}}' sys:selected='{{true}}'>op1</option></select>", null, null, null, "op1");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on option 2");
        AtlasUnit.Assert.isTrue(element.selected, "selected on option 2");
        element = this._helper.instantiateIn("<select multiple='multiple'><option>dummy</option><option id='op1' sys:disabled='{{false}}' sys:selected='{{false}}'>op1</option></select>", null, null, null, "op1");
        AtlasUnit.Assert.isFalse(element.disabled, "disabled on option 2");
        AtlasUnit.Assert.isFalse(element.selected, "selected on option 2");
    }

    this.testSysAttributes = function() {
        var element = this._helper.instantiateIn("<a id='a1' sys:href='{{ \"http://somehref/\" }}'></a>", null, null, null, "a1");
        AtlasUnit.Assert.areEqual("http://somehref/", element.href);
        element = this._helper.instantiateIn("<img id='img1' sys:src='{{ \"http://somesrc/\" }}'/>", null, null, null, "img1");
        AtlasUnit.Assert.areEqual("http://somesrc/", element.src);
        element = this._helper.instantiateIn("<iframe id='if1' sys:src='{{ \"http://someiframe/\" }}'/>", null, null, null, "if1");
        AtlasUnit.Assert.areEqual("http://someiframe/", element.src);
        element = this._helper.instantiateIn("<p id='p1' sys:foo='{{ \"foo\" }}'/>", null, null, null, "p1");
        AtlasUnit.Assert.areEqual("foo", element.getAttribute("foo"));
        element = this._helper.instantiateIn("<input id='i1' sys:name='foo' sys:type='button' />", null, null, null, "i1");
        AtlasUnit.Assert.areEqual("foo", element.getAttribute("name"));
        AtlasUnit.Assert.areEqual("button", element.getAttribute("type"));
    }

    this.testSysAttributesHavePriority = function() {
        var element;
        element = this._helper.instantiateIn("<a id='a1' href='foo' sys:href='{{ \"http://somehref/\" }}'></a>", null, null, null, "a1");
        AtlasUnit.Assert.areEqual("http://somehref/", element.href);
        element = this._helper.instantiateIn("<a id='a1' sys:href='{{ \"http://somehref/\" }}' href='foo'></a>", null, null, null, "a1");
        AtlasUnit.Assert.areEqual("http://somehref/", element.href);

        element = this._helper.instantiateIn("<img id='img1' src='foo' sys:src='{{ \"http://somesrc/\" }}'/>", null, null, null, "img1");
        AtlasUnit.Assert.areEqual("http://somesrc/", element.src);
        element = this._helper.instantiateIn("<img id='img1' sys:src='{{ \"http://somesrc/\" }}' src='foo' />", null, null, null, "img1");
        AtlasUnit.Assert.areEqual("http://somesrc/", element.src);

        element = this._helper.instantiateIn("<iframe id='if1' src='foo' sys:src='{{ \"http://someiframe/\" }}'/>", null, null, null, "if1");
        AtlasUnit.Assert.areEqual("http://someiframe/", element.src);
        element = this._helper.instantiateIn("<iframe id='if1' sys:src='{{ \"http://someiframe/\" }}' src='foo' />", null, null, null, "if1");
        AtlasUnit.Assert.areEqual("http://someiframe/", element.src);

        element = this._helper.instantiateIn("<p id='p1' foo='bar' sys:foo='{{ \"foo\" }}'/>", null, null, null, "p1");
        AtlasUnit.Assert.areEqual("foo", element.getAttribute("foo"));
        element = this._helper.instantiateIn("<p id='p1' sys:foo='{{ \"foo\" }}' foo='bar' />", null, null, null, "p1");
        AtlasUnit.Assert.areEqual("foo", element.getAttribute("foo"));
    }

    this.testNamespaceMappingInvalidTypeTemplate = function() {
        var div = document.createElement("div");
        div.setAttribute("xmlns:foo", "javascript:Sys.Foo");
        div.innerHTML = "<div sys:attach='foo'></div>";
        var template = new Sys.UI.Template(div);
        var container = document.createElement("div");
        template.instantiateIn(container);
    }
    this.testNamespaceMappingInvalidTypeTemplate["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testNamespaceMappingInvalidTypeTemplate["AtlasUnit.ExpectedException"] = {
        message: "Sys.InvalidOperationException: Invalid type namespace declaration, 'Sys.Foo' is not a valid type."
    }

    this.testInvalidSysAttachTemplate = function() {
        var div = document.createElement("div");
        div.setAttribute("xmlns:foo", "javascript:Sys.Component");
        div.innerHTML = "<div sys:attach='foo,bar' />";
        var template = new Sys.UI.Template(div);
        var container = document.createElement("div");
        template.instantiateIn(container);
    }
    this.testInvalidSysAttachTemplate["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testInvalidSysAttachTemplate["AtlasUnit.ExpectedException"] = {
        message: "Sys.InvalidOperationException: Invalid attribute 'sys:attach', the type 'bar' is not a registered namespace."
    }

    this.testUnmappedAttribute = function() {
        this._helper.createAndVerify("<div abc:def='xyz'></div>", "<div abc:def='xyz'></div>");
    }

    this.testWithDataContext = function() {
        var data = { foo: 'foovalue' };
        this._helper.createAndVerify("<input type='text' sys:value='{{foo}}' sys:name='{{$dataItem.foo}}' />", "<input type='text' value='foovalue' name='foovalue' />", data, null, null);
    }


    this.testWithParentDataContext = function() {
        var data = { foo: 'foovalue' };
        var parentData = { foo: 'parentvalue' };
        var pctx = new Sys.UI.TemplateContext();
        pctx.dataItem = parentData;
        this._helper.createAndVerify("<input type='text' sys:value='{{foo}}' sys:name='{{$context.parentContext.dataItem.foo}}' />", "<input type='text' value='foovalue' name='parentvalue' />", data, null, pctx);
    }

    this.testPseudoId = function() {
        var div = document.createElement("div");
        div.innerHTML = "{{$id('foo')}}";
        var template = new Sys.UI.Template(div);
        var container = document.createElement("div");
        template.instantiateIn(container);
        template.instantiateIn(container);
        template.instantiateIn(container);
        AtlasUnit.Assert.areEqual("foo0foo1foo2", container.innerHTML);
        container.innerHTML = "";
        template.instantiateIn(container);
        AtlasUnit.Assert.areEqual("foo3", container.innerHTML);
    }

    this.testPseudoIdUsesParentContexts = function() {
        var div = document.createElement("div");
        div.innerHTML = "{{$id('foo')}}";
        var template = new Sys.UI.Template(div);
        var container = document.createElement("div");
        var parentContext = template.instantiateIn(container);
        parentContext = template.instantiateIn(container, null, null, 0, null, parentContext);
        template.instantiateIn(container, null, null, 0, null, parentContext);
        template.instantiateIn(container, null, null, 1, null, parentContext);
        AtlasUnit.Assert.areEqual("foo0foo0_0foo0_0_0foo0_0_1", container.innerHTML);
    }

    this.testPseudoIndex = function() {
        var div = document.createElement("div");
        div.id = 'div1';
        div.innerHTML = "{{$index}}";
        var template = new Sys.UI.Template(div);
        var container = document.createElement("div");
        template.instantiateIn(container);
        template.instantiateIn(container, null, null, 88);
        template.instantiateIn(container);
        AtlasUnit.Assert.areEqual("0882", container.innerHTML);
        container.innerHTML = "";
        template.instantiateIn(container);
        AtlasUnit.Assert.areEqual("3", container.innerHTML);
    }

    this.testPseudoElement = function() {
        this._helper.createAndVerify("<div id='div1'>{{$element.id}}<span id='span2' sys:foo='{{$element.tagName.toLowerCase()}}'>{{$element.id}}</span></div>{{$element.id}}", "<div id='div10'>div10<span id='span20' foo='span'>span20</span></div>div10");
    }

    this.testDOMEvent = function() {
        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' onclick='foo(1)' sys:onmouseover=\"{{ 'foo(' + id + ')'}}\"></div>";
        var template = new Sys.UI.Template(div);
        var container = document.createElement("div");
        var result = template.instantiateIn(container, null, { id: "123" });
        div = result.get('#div1');
        AtlasUnit.Assert.areNotEqual(-1, div.onclick.toString().indexOf('foo(1)'));
        AtlasUnit.Assert.areNotEqual(-1, div.onmouseover.toString().indexOf('foo(123)'));
    }

    this.testStyle = function() {
        // no existing style attribute
        this._helper.createAndVerify("<div sys:style-font-size='88px' sys:style-display='none' sys:style-border-bottom-width='8px'></div>", "<div style='border-bottom-width: 8px; display:none; font-size:88px;'></div>");
        // existing style attribute first
        this._helper.createAndVerify("<div style='font-size:87px' sys:style-font-size='88px' sys:style-display='none' sys:style-border-bottom-width='8px'></div>", "<div style='border-bottom-width: 8px; display:none; font-size:88px;'></div>");
        // existing style attribute last
        this._helper.createAndVerify("<div sys:style-font-size='88px' sys:style-display='none' sys:style-border-bottom-width='8px' style='font-size:87px'></div>", "<div style='border-bottom-width: 8px; display:none; font-size:88px;'></div>");
    }

    this.testClass = function() {
        // none added
        this._helper.createAndVerify("<div sys:class-addme='{{false}}'></div>", "<div></div>");
        // no existing class attribute
        this._helper.createAndVerify("<div sys:class-addme='{{true}}'></div>", "<div class='addme'></div>");
        // existing class attribute before
        this._helper.createAndVerify("<div class='foo bar baz removeme alreadythere' sys:class-removeme='{{false}}' sys:class-addme='{{true}}' sys:class-alreadythere='{{true}}' sys:class-notthere='{{false}}'></div>", "<div class='foo bar baz alreadythere addme'></div>");
        // existing class attribute after
        this._helper.createAndVerify("<div sys:class-removeme='{{false}}' sys:class-addme='{{true}}' sys:class-alreadythere='{{true}}' sys:class-notthere='{{false}}' class='foo bar baz removeme alreadythere' ></div>", "<div class='foo bar baz alreadythere addme'></div>");
    }

    this.testCodeIf = function() {
        this._helper.createAndVerify("<span><p>[</p><span sys:if='{{2 - 2}}'>hello_0</span><span sys:if='{{2 - 1}}'>hello_1</span><p>]</p></span>",
                                     "<span><p>[</p><span>hello_1</span><p>]</p></span>");
        this._helper.createAndVerify("<span><p>[</p><span sys:if='2 - 2'>hello_0</span><span sys:if='2 - 1'>hello_1</span><p>]</p></span>",
                                     "<span><p>[</p><span>hello_1</span><p>]</p></span>");
        function fooTrue() {
            return true;
        }
        function fooFalse() {
            return false;
        }
        Sys.Application.registerMarkupExtension("IfTrueExtension", fooTrue, true);
        Sys.Application.registerMarkupExtension("IfFalseExtension", fooFalse, true);
        this._helper.createAndVerify("<span><p>[</p><span sys:if='{IfTrueExtension}'>hello_0</span><span sys:if='{IfFalseExtension}'>hello_1</span><p>]</p></span>",
                                     "<span><p>[</p><span>hello_0</span><p>]</p></span>");
    }

    this.testCodeBeforeAndAfter = function() {
        this._helper.createAndVerify("<span><p>[</p><span sys:codebefore='for(var i=0; i < 5; i++) {' sys:codeafter='}'>hello</span><p>]</p></span>",
                                     "<span><p>[</p><span>hello</span><span>hello</span><span>hello</span><span>hello</span><span>hello</span><p>]</p></span>");
        this._helper.createAndVerify("<span><p>[</p><span sys:codebefore='{{for(var i=0; i < 5; i++) {}}' sys:codeafter='{{}}}'>hello</span><p>]</p></span>",
                                     "<span><p>[</p><span>hello</span><span>hello</span><span>hello</span><span>hello</span><span>hello</span><p>]</p></span>");
        this._testCodeBefore = false;
        this._testCodeAfter = false;
        function fooCodeBefore() {
            Sys.UI.Test.TemplateTest._testCodeBefore = true;
        }
        function fooCodeAfter() {
            Sys.UI.Test.TemplateTest._testCodeAfter = true;
        }
        Sys.Application.registerMarkupExtension("CodeBeforeExtension", fooCodeBefore, true);
        Sys.Application.registerMarkupExtension("CodeAfterExtension", fooCodeAfter, true);
        this._helper.createAndVerify("<span><p>[</p><span sys:codebefore='{CodeBeforeExtension}' sys:codeafter='{CodeAfterExtension}'>hello</span><p>]</p></span>",
                                     "<span><p>[</p><span>hello</span><p>]</p></span>");
        AtlasUnit.Assert.isTrue(Sys.UI.Test.TemplateTest._testCodeBefore);
        AtlasUnit.Assert.isTrue(Sys.UI.Test.TemplateTest._testCodeAfter);
    }

    this.testCodeBeforeAndAfterWithCodeIf = function() {
        this._helper.createAndVerify("<span><p>[</p><span sys:if='{{2 - 2}}' sys:codebefore='for(var i=0; i < 5; i++) {' sys:codeafter='}'>hello</span><span sys:if='2 - 1' sys:codebefore='for(var i=0; i < 5; i++) {' sys:codeafter='}'>hello2</span><p>]</p></span>",
                                     "<span><p>[</p><span>hello2</span><span>hello2</span><span>hello2</span><span>hello2</span><span>hello2</span><p>]</p></span>");
    }

    this.testTextCode = function() {
        this._helper.createAndVerify("{{ 888 }}", "888");
        this._helper.createAndVerify("<p>{{ 100 }}</p>hi<p>{{ 999 }}</p>", "<p>100</p>hi<p>999</p>");
        this._helper.createAndVerify("<p>{{ 101 }}</p>{hi}x", "<p>101</p>{hi}x");
        this._helper.createAndVerify("{{ 102 }}<!-- {{ 'hi' }} -->", "102<!-- {{ 'hi' }} -->");
        this._helper.createAndVerify("<p>hello</p><p>{{ 'world' }}</p><p>!</p>", "<p>hello</p><p>world</p><p>!</p>");
    }

    this.testGet = function() {
        this._helper.createAndVerify("<span id='span1'>hello</span><p>{{ $context.get('#span1').id }}</p>world", "<span id='span10'>hello</span><p>span10</p>world");
        AtlasUnit.Assert.isNull(Sys.UI.DomElement.getElementById('span1'));
    }

    this.testNestedTemplate = function() {
        var result = this._helper.createAndVerify("<span sys:id='span1'><span sys:id='span2' class='sys-template other'><div>[level1-1]</div></span><span sys:id='span3' class='other sys-template'><div>[level1-2]</div></span></span>", "<span id='span10'><span id='span20' class='other sys-template'></span><span id='span30' class='sys-template other'></span></span>");
        var template = result.template;
        var span2 = result.get("#span2");
        var span3 = result.get("#span3");
        var nested1 = new Sys.UI.Template(span2);
        var nested2 = new Sys.UI.Template(span3);
        nested1.instantiateIn(span2);
        nested1.instantiateIn(span2);
        this._helper.verifyHTML(result.containerElement, "<span id='span10'><span id='span20' class='sys-template other'><div>[level1-1]</div><div>[level1-1]</div></span><span id='span30' class='other sys-template'></span></span>");
        nested2.instantiateIn(span3);
        nested2.instantiateIn(span3);
        this._helper.verifyHTML(result.containerElement, "<span id='span10'><span id='span20' class='sys-template other'><div>[level1-1]</div><div>[level1-1]</div></span><span id='span30' class='other sys-template'><div>[level1-2]</div><div>[level1-2]</div></span></span>");
    }

    this.testTemplateLazyCompilesAndReusesCompilation = function() {
        var div = document.createElement('div');
        div._msajaxtemplate = ["foo"];
        var t = new Sys.UI.Template(div);
        AtlasUnit.Assert.isFalse(!!t._instantiateIn);
        t._ensureCompiled();
        AtlasUnit.Assert.areEqual("foo", t._instantiateIn);
        t.dispose();
        AtlasUnit.Assert.isFalse(!!t._instantiateIn, "dispose should release reference.");
        AtlasUnit.Assert.isNotNull(div._msajaxtemplate, "dispose should not release reference on element, other templates might refer to it.");
    }

    this.testActivationNonComponent = function() {
        this._helper.clearNamespaces();
        document.body.setAttribute("xmlns:foo", "javascript:Sys.UI.Test.TemplateTest.FooNonComponent");
        var result = this._helper.instantiateIn("<div sys:attach='foo' foo:lowerproperty='val1' foo:upperproperty='{{\"val2\"}}' foo:onlowerevent='val3' foo:onupperevent='val4' foo:lowerfield='val5' foo:upperfield='val6'></div>");
        AtlasUnit.Assert.areEqual(1, result.components.length);
        var component = result.components[0];
        AtlasUnit.Assert.areEqual("Sys.UI.Test.TemplateTest.FooNonComponent", Object.getTypeName(component));
        AtlasUnit.Assert.areEqual("val1", component.get_lowerproperty());
        AtlasUnit.Assert.areEqual("val2", component.get_UPPERPROPERTY());
        AtlasUnit.Assert.isNotNull(component._lowerevent);
        AtlasUnit.Assert.isNotNull(component._UPPEREVENT);
        AtlasUnit.Assert.areNotEqual(-1, component._lowerevent.toString().indexOf('val3'));
        AtlasUnit.Assert.areNotEqual(-1, component._UPPEREVENT.toString().indexOf('val4'));
        AtlasUnit.Assert.areEqual("val5", component.lowerfield);
        AtlasUnit.Assert.areEqual("val6", component.UPPERFIELD);
    }

    this.testActivationComponent = function() {
        this._helper.clearNamespaces();
        document.body.setAttribute("xmlns:foo", "javascript:Sys.UI.Test.TemplateTest.FooComponent");
        Sys.Application._createdComponents = [];
        Sys.Application.beginCreateComponents();
        var result = this._helper.instantiateIn("<div id='div1' sys:attach='foo' foo:id='foo1'></div>");
        Sys.Application.endCreateComponents();
        AtlasUnit.Assert.areEqual(1, result.components.length);
        var component = result.components[0];
        AtlasUnit.Assert.areEqual("Sys.UI.Test.TemplateTest.FooComponent", Object.getTypeName(component));
        AtlasUnit.Assert.areEqual("foo10", component.get_id());
        AtlasUnit.Assert.areEqual(component, Sys.Application.findComponent("foo10"));
        AtlasUnit.Assert.areEqual(component, Sys.Application._createdComponents[0], "component should be added to createdComponents while creating components, so it is in the event args of the page load event.");
        AtlasUnit.Assert.areEqual(component, result.get("$foo1"));
        Sys.Application._createdComponents = [];
        AtlasUnit.Assert.isFalse(component.get_isInitialized());
        result.initializeComponents();
        AtlasUnit.Assert.isTrue(component.get_isInitialized());
        component.dispose();
    }

    this.testActivationControl = function() {
        this._helper.clearNamespaces();
        document.body.setAttribute("xmlns:foo", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var result = this._helper.instantiateIn("<div id='div1' sys:attach='foo'></div>");
        AtlasUnit.Assert.areEqual(1, result.components.length);
        var component = result.components[0];
        AtlasUnit.Assert.areEqual(component, result.get("$div1"));
        AtlasUnit.Assert.areEqual("div10", component.get_id());
        AtlasUnit.Assert.areEqual("div10", component.get_element().id);
        component.dispose();
    }

    this.testActivationBehavior = function() {
        this._helper.clearNamespaces();
        document.body.setAttribute("xmlns:foo", "javascript:Sys.UI.Test.TemplateTest.FooBehavior");
        var result = this._helper.instantiateIn("<div id='div1' sys:attach='foo'></div>");
        AtlasUnit.Assert.areEqual(1, result.components.length);
        var component = result.components[0];
        AtlasUnit.Assert.areEqual(component, result.get("$div10$FooBehavior"));
        AtlasUnit.Assert.areEqual("div10$FooBehavior", component.get_id());
        AtlasUnit.Assert.areEqual("div10", component.get_element().id);
        component.dispose();

        result = this._helper.instantiateIn("<div id='div1' sys:attach='foo' foo:name='fooname'></div>");
        component = result.components[0];
        AtlasUnit.Assert.areEqual("div10$fooname", component.get_id());
        component.dispose();
    }

    this.testActivationMultiple = function() {
        this._helper.clearNamespaces();
        document.body.setAttribute("xmlns:foocontrol", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        document.body.setAttribute("xmlns:foobehavior", "javascript:Sys.UI.Test.TemplateTest.FooBehavior");
        var result = this._helper.instantiateIn("<div id='div1' sys:attach='foocontrol,foobehavior'></div>");
        AtlasUnit.Assert.areEqual(2, result.components.length);
        var component1 = result.components[0];
        var component2 = result.components[1];
        AtlasUnit.Assert.areEqual("Sys.UI.Test.TemplateTest.FooControl", Object.getTypeName(component1));
        AtlasUnit.Assert.areEqual("Sys.UI.Test.TemplateTest.FooBehavior", Object.getTypeName(component2));
        component1.dispose();
        component2.dispose();
    }

    this.testActivationFunction = function() {
        var element = null, props = null, context = null;
        Sys.UI.Test.TemplateTest.testActivationFunction$myFunction = function(e, p, c) {
            element = e;
            props = p;
            context = c;
            return [new Sys.Component(), new Sys.Component()];
        }
        Sys.Application.registerMarkupExtension("test", function() {
            return "ext";
        });
        this._helper.clearNamespaces();
        document.body.setAttribute("xmlns:fn", "javascript:Sys.UI.Test.TemplateTest.testActivationFunction$myFunction");
        var result = this._helper.instantiateIn("<div id='div1' sys:attach='fn' fn:foo='foo1' fn:bar='{{88}}' fn:baz='{test}'></div>");
        AtlasUnit.Assert.isNotNull(element, "The function was not called.");
        AtlasUnit.Assert.areEqual(element, result.get('#div1'), "Element passed in should be equal to the one it was attached to.");
        AtlasUnit.Assert.isNotNull(props, "The propertyBag is null.");
        AtlasUnit.Assert.areEqual("foo1", props.foo);
        AtlasUnit.Assert.areEqual(88, props.bar);
        AtlasUnit.Assert.areEqual("ext", props.baz);
        AtlasUnit.Assert.areEqual(result, context, "The 3rd parameter to the function should be the template context.");
        AtlasUnit.Assert.areEqual(2, result.components.length, "Components returned by the function, if any, should be added to the context's components list.");
    }

    this.testActivationFunctionNoProperties = function() {
        var props = null;
        Sys.UI.Test.TemplateTest.testActivationFunctionNoProperties$myFunction = function(e, p, c) {
            props = p;
        }
        this._helper.clearNamespaces();
        document.body.setAttribute("xmlns:fn", "javascript:Sys.UI.Test.TemplateTest.testActivationFunctionNoProperties$myFunction");
        var result = this._helper.instantiateIn("<div id='div1' sys:attach='fn'></div>");
        AtlasUnit.Assert.isNotNull(props, "The propertyBag should not be null even when there are no properties.");
    }

    this.testActivationFunctionMultiple = function() {
        var element1 = null, props1 = null, context1 = null;
        var element2 = null, props2 = null, context2 = null;
        Sys.UI.Test.TemplateTest.testActivationFunctionMultiple$myFunction1 = function(e, p, c) {
            element1 = e;
            props1 = p;
            context1 = c;
            return [new Sys.Component(), new Sys.Component()];
        }
        Sys.UI.Test.TemplateTest.testActivationFunctionMultiple$myFunction2 = function(e, p, c) {
            element2 = e;
            props2 = p;
            context2 = c;
            return new Sys.Component();
        }
        this._helper.clearNamespaces();
        document.body.setAttribute("xmlns:fn1", "javascript:Sys.UI.Test.TemplateTest.testActivationFunctionMultiple$myFunction1");
        document.body.setAttribute("xmlns:fn2", "javascript:Sys.UI.Test.TemplateTest.testActivationFunctionMultiple$myFunction2");
        var result = this._helper.instantiateIn("<div id='div1' sys:attach='fn1,fn2' fn1:foo='foo1' fn2:foo='foo2'></div>");
        AtlasUnit.Assert.isNotNull(element1, "Function1 was not called.");
        AtlasUnit.Assert.isNotNull(element2, "Function2 was not called.");
        AtlasUnit.Assert.areEqual(element1, result.get('#div1'), "Element1 passed in should be equal to the one it was attached to.");
        AtlasUnit.Assert.areEqual(element2, result.get('#div1'), "Element2 passed in should be equal to the one it was attached to.");
        AtlasUnit.Assert.isNotNull(props1, "The propertyBag is null.");
        AtlasUnit.Assert.isNotNull(props2, "The propertyBag is null.");
        AtlasUnit.Assert.areEqual("foo1", props1.foo);
        AtlasUnit.Assert.areEqual("foo2", props2.foo);
        AtlasUnit.Assert.areEqual(3, result.components.length, "Components returned by the function, if any, should be added to the context's components list.");
    }

    this.testReferenceNodeFirst = function() {
        var div = document.createElement("div");
        div.innerHTML = "<div id='template'>{{$dataItem}}</div>";
        var template = new Sys.UI.Template(div);
        var container = document.createElement("div");
        container.innerHTML = "<div id='ref'></div><div id='c1'></div>";
        var ref = Sys.UI.DomElement.getElementById('ref', container);
        template.instantiateIn(container, null, 1, null, ref);
        template.instantiateIn(container, null, 2, null, ref);
        this._helper.verifyHTML(container, "<div id='template0'>1</div><div id='template1'>2</div><div id='ref'></div><div id='c1'></div>");
    }

    this.testReferenceNodeLast = function() {
        var div = document.createElement("div");
        div.innerHTML = "<div id='template'>{{$dataItem}}</div>";
        var template = new Sys.UI.Template(div);
        var container = document.createElement("div");
        container.innerHTML = "<div id='c1'></div><div id='ref'></div>";
        var ref = Sys.UI.DomElement.getElementById('ref', container);
        template.instantiateIn(container, null, 1, null, ref);
        template.instantiateIn(container, null, 2, null, ref);
        this._helper.verifyHTML(container, "<div id='c1'></div><div id='template0'>1</div><div id='template1'>2</div><div id='ref'></div>");
    }

    this.testReferenceNodeNull = function() {
        var div = document.createElement("div");
        div.innerHTML = "<div id='template'>{{$dataItem}}</div>";
        var template = new Sys.UI.Template(div);
        var container = document.createElement("div");
        container.innerHTML = "<div id='c1'></div><div id='c2'></div>";
        template.instantiateIn(container, null, 1, null, null);
        template.instantiateIn(container, null, 2, null, null);
        this._helper.verifyHTML(container, "<div id='c1'></div><div id='c2'></div><div id='template0'>1</div><div id='template1'>2</div>");
    }

    this.testSysInnerText = function() {
        this._helper.createAndVerify("<span sys:innertext='foo&lt;br/&gt;'>ignored</span>", "<span>foo&lt;br/&gt;</span>");
    }

    this.testSysInnerHTML = function() {
        this._helper.createAndVerify("<span sys:innerhtml='foo&lt;br/&gt;bar'>ignored</span>", "<span>foo<br/>bar</span>");
    }
}
Sys.UI.Test.TemplateTest.registerClass("Sys.UI.Test.TemplateTest");
Sys.UI.Test.TemplateTest["AtlasUnit.IsTestFixture"] = true;

Sys.UI.Test.TemplateTest.FooControl = function(element) {
    Sys.UI.Test.TemplateTest.FooControl.initializeBase(this, [element]);
}
Sys.UI.Test.TemplateTest.FooControl.prototype = {
    dispose: function() {
        this.disposed = true;
        Sys.UI.Test.TemplateTest.FooControl.callBaseMethod(this, "dispose");
    }
}
Sys.UI.Test.TemplateTest.FooControl.registerClass("Sys.UI.Test.TemplateTest.FooControl", Sys.UI.Control);

Sys.UI.Test.TemplateTest.FooBehavior = function(element) {
    Sys.UI.Test.TemplateTest.FooBehavior.initializeBase(this, [element]);
}
Sys.UI.Test.TemplateTest.FooBehavior.prototype = {
    dispose: function() {
        this.disposed = true;
        Sys.UI.Test.TemplateTest.FooBehavior.callBaseMethod(this, "dispose");
    }
}
Sys.UI.Test.TemplateTest.FooBehavior.registerClass("Sys.UI.Test.TemplateTest.FooBehavior", Sys.UI.Behavior);

Sys.UI.Test.TemplateTest.FooComponent = function() {
    Sys.UI.Test.TemplateTest.FooComponent.initializeBase(this);
}
Sys.UI.Test.TemplateTest.FooComponent.prototype = {
    get_property: function() {
        return this._property;
    },
    set_property: function(value) {
        this._property = value;
    },
    dispose: function() {
        this.disposed = true;
        Sys.UI.Test.TemplateTest.FooComponent.callBaseMethod(this, "dispose");
    }
}
Sys.UI.Test.TemplateTest.FooComponent.registerClass("Sys.UI.Test.TemplateTest.FooComponent", Sys.Component);

Sys.UI.Test.TemplateTest.FooNonComponent = function() {
}
Sys.UI.Test.TemplateTest.FooNonComponent.prototype = {
    lowerfield: null,
    UPPERFIELD: null,
    _lowerproperty: null,
    _UPPREPROPERTY: null,
    _lowerevent: null,
    _UPPEREVENT: null,
    _otherProperty: null,
    
    add_lowerevent: function(handler) {
        this._lowerevent = handler;
    },
    remove_lowerevent: function(handler) {
        this._lowerevent = null;
    },
    add_UPPEREVENT: function(handler) {
        this._UPPEREVENT = handler;
    },
    remove_UPPEREVENT: function(handler) {
        this._UPPEREVENT = null;
    },
    
    get_lowerproperty: function() {
        return this._lowerproperty;
    },
    set_lowerproperty: function(value) {
        this._lowerproperty = value;
    },

    get_UPPERPROPERTY: function() {
        return this._UPPERPROPERTY;
    },
    set_UPPERPROPERTY: function(value) {
        this._UPPERPROPERTY = value;
    },
    
    get_otherProperty: function() {
        return this._otherProperty;
    },
    set_otherProperty: function(value) {
        this._otherProperty = value;
    },
    
    dispose: function() {
        this.disposed = true;
    }
}
Sys.UI.Test.TemplateTest.FooNonComponent.registerClass("Sys.UI.Test.TemplateTest.FooNonComponent");

 