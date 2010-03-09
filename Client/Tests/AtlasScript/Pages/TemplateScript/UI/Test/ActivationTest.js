Type.registerNamespace("Sys.UI.Test");

Sys.UI.Test.ActivationTest = function() {
    var helper;
    this.setUp = function() {
        helper = Sys.UI.Test.TemplateHelper;
        // must do this manually because it is skipped normally if there's no sys:activate attribute.
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        if (prm._updatePanel !== Sys.Application._activateOnPartial) {
            prm._updatePanelOld = prm._updatePanel;
            prm._updatePanel = Sys.Application._activateOnPartial;
        }
        helper.clearNamespaces();
        Sys.Application._context = new Sys.UI.TemplateContext();
        Sys.Application._context._global = true;
    }

    this.testActivateElement = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var dataItem = {};
        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' sys:attach='t'></div>";
        var tc = Sys.query(div).activateElements(dataItem);
        AtlasUnit.Assert.areEqual(Sys.UI.TemplateContext, Object.getType(tc));
        var div1 = Sys.UI.DomElement.getElementById('div1', div);
        AtlasUnit.Assert.isTrue(!!div1.control);
        AtlasUnit.Assert.areEqual(1, tc.components.length);
        AtlasUnit.Assert.areEqual(tc.components[0], div1.control);
        AtlasUnit.Assert.areEqual(dataItem, tc.dataItem, "tc.dataItem should be equal to the bindingContext parameter.");
        div1.control.dispose();
    }
    
    this.testActivateElementReusesGlobalContext = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var dataItem = {};
        var div1 = document.createElement("div");
        var div2 = document.createElement("div");
        div1.innerHTML = "<div id='div1' sys:attach='t'></div>";
        div2.innerHTML = "<div id='div2' sys:attach='t'></div>";
        
        Sys.query(div1).activateElements(dataItem);
        var tc = Sys.query(div2).activateElements(dataItem);
        AtlasUnit.Assert.areEqual(tc, Sys.Application.get_templateContext());
        AtlasUnit.Assert.areEqual(2, tc.components.length);
        Sys.Application.disposeElement(div2, false);
        AtlasUnit.Assert.isFalse(!!tc.components[1], "Should be removed from template context components array.");
        Sys.Application.disposeElement(div1, false);
        AtlasUnit.Assert.isFalse(!!tc.components[0], "Should be removed from template context components array.");
    }    

    this.testActivateElementFunction = function() {
        var element = null, props = null, context = null;
        Sys.UI.Test.ActivationTest$TestFunction = function(e, p, c) {
            element = e;
            props = p;
            context = c;
            return [new Sys.Component(), new Sys.Component()];
        }
        Sys.Application.registerMarkupExtension("test", function() {
            return "ext";
        });
        helper.clearNamespaces();
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.ActivationTest$TestFunction");
        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' sys:attach='t' t:foo='foo' t:bar='{{88}}' t:baz='{test}'></div>";
        var tc = Sys.query(div).activateElements(div);
        var div1 = Sys.UI.DomElement.getElementById('div10', div);
        AtlasUnit.Assert.isNotNull(element, "The function was not called.");
        AtlasUnit.Assert.isNotNull(props, "A property bag should be specified.");
        AtlasUnit.Assert.areEqual(tc, context, "The 3rd parameter to the function should be the template context.");
        AtlasUnit.Assert.areEqual("foo", props["foo"]);
        AtlasUnit.Assert.areEqual(88, props["bar"]);
        AtlasUnit.Assert.areEqual("ext", props["baz"]);
        AtlasUnit.Assert.areEqual(2, tc.components.length, "Components returned by the function, if any, should be added to the context's components list.");
    }

    this.testActivateElementFunctionNoProperties = function() {
        var props = null;
        Sys.UI.Test.ActivationTest.testActivateElementFunctionNoProperties$myFunction = function(e, p, c) {
            props = p;
        }
        helper.clearNamespaces();
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.ActivationTest.testActivateElementFunctionNoProperties$myFunction");
        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' sys:attach='t'></div>";
        var tc = Sys.query(div).activateElements();
        AtlasUnit.Assert.isNotNull(props, "The propertyBag should not be null even when there are no properties.");
    }

    this.testActivateElementFunction = function() {
        var element1 = null, props1 = null, context1 = null;
        var element2 = null, props2 = null, context2 = null;
        Sys.UI.Test.ActivationTest$TestFunction1 = function(e, p, c) {
            element1 = e;
            props1 = p;
            context1 = c;
            return [new Sys.Component(), new Sys.Component()];
        }
        Sys.UI.Test.ActivationTest$TestFunction2 = function(e, p, c) {
            element2 = e;
            props2 = p;
            context2 = c;
            return new Sys.Component();
        }
        helper.clearNamespaces();
        document.body.setAttribute("xmlns:t1", "javascript:Sys.UI.Test.ActivationTest$TestFunction1");
        document.body.setAttribute("xmlns:t2", "javascript:Sys.UI.Test.ActivationTest$TestFunction2");
        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' sys:attach='t1,t2' t1:foo='foo1' t2:foo='foo2'></div>";
        var tc = Sys.query(div).activateElements();
        var div1 = Sys.UI.DomElement.getElementById('div1', div);
        AtlasUnit.Assert.isNotNull(element1, "The function1 was not called.");
        AtlasUnit.Assert.isNotNull(element2, "The function2 was not called.");
        AtlasUnit.Assert.isNotNull(props1, "A property1 bag should be specified.");
        AtlasUnit.Assert.isNotNull(props2, "A property2 bag should be specified.");
        AtlasUnit.Assert.areEqual(tc, context1, "The 3rd parameter to the function1 should be the template context.");
        AtlasUnit.Assert.areEqual(tc, context2, "The 3rd parameter to the function2 should be the template context.");
        AtlasUnit.Assert.areEqual("foo1", props1["foo"]);
        AtlasUnit.Assert.areEqual("foo2", props2["foo"]);
        AtlasUnit.Assert.areEqual(3, tc.components.length, "Components returned by the function, if any, should be added to the context's components list.");
    }

    this.testActivateElements = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' sys:attach='t' t:id='component1'></div><div xmlns:zzz='javascript:Sys.UI.Test.TemplateTest.FooControl' id='div2' sys:attach='zzz' zzz:x='{binding source=#div1}' zzz:y='{binding source=$component1}'></div>";
        var div1 = Sys.UI.DomElement.getElementById('div1', div),
            div2 = Sys.UI.DomElement.getElementById('div2', div);
        var dataItem = {};
        var tc = Sys.query([div1, div2]).activateElements(dataItem);
        AtlasUnit.Assert.areEqual(Sys.UI.TemplateContext, Object.getType(tc));
        AtlasUnit.Assert.isTrue(!!div1.control);
        AtlasUnit.Assert.isTrue(!!div2.control);
        AtlasUnit.Assert.areEqual(div1, div2.control.x, "x reference incorrect.");
        AtlasUnit.Assert.areEqual(div1.control, div2.control.y, "y reference incorrect.");
        AtlasUnit.Assert.areEqual(dataItem, tc.dataItem, "tc.dataItem should be equal to the bindingContext parameter.");
        AtlasUnit.Assert.areEqual(4, tc.components.length, "Should include two bindings.");
        div1.control.dispose();
        div2.control.dispose();
    }

    this.testActivateElementsDefault = function() {
        var activated = null;
        Sys.Application._activateElementOld = Sys.Application._activateElement;
        Sys.Application._activateElement = function(e) {
            activated = e;
        }
        try {
            Sys.query(document.documentElement).activateElements();
            AtlasUnit.Assert.areEqual(document.documentElement, activated);
        }
        finally {
            Sys.Application._activateElement = Sys.Application._activateElementOld;
            delete Sys.Application._activateElementOld;
        }
    }

    this.testCrossIdRef = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' sys:attach='t' t:ref='{binding control,source=#div2}'></div><div id='div2' sys:attach='t' t:ref='{binding control,source=#div1}'></div>";
        var div1 = Sys.UI.DomElement.getElementById('div1', div),
            div2 = Sys.UI.DomElement.getElementById('div2', div);
        var tc = Sys.query([div1, div2]).activateElements();
        AtlasUnit.Assert.isNotNull(div1.control);
        AtlasUnit.Assert.isNotNull(div2.control);
        AtlasUnit.Assert.areEqual(div1.control, div2.control.ref, "2 should reference 1");
        AtlasUnit.Assert.areEqual(div2.control, div1.control.ref, "1 should reference 2");
        div1.control.dispose();
        div2.control.dispose();
    }

    this.testCrossGetRef = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' sys:attach='t' t:ref='{binding element,source=$div2}'></div><div id='div2' sys:attach='t' t:ref='{binding element,source=$div1}'></div>";
        var div1 = Sys.UI.DomElement.getElementById('div1', div),
            div2 = Sys.UI.DomElement.getElementById('div2', div);
        var tc = Sys.query([div1, div2]).activateElements();
        AtlasUnit.Assert.areEqual(div1, div2.control.ref, "2 should reference element 1");
        AtlasUnit.Assert.areEqual(div2, div1.control.ref, "1 should reference element 2");
        div1.control.dispose();
        div2.control.dispose();
    }

    this.testCrossFindRef = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' sys:attach='t' t:ref='{binding source=$div2}'></div><div id='div2' sys:attach='t' t:ref='{binding source=$div1}'></div>";
        var div1 = Sys.UI.DomElement.getElementById('div1', div),
            div2 = Sys.UI.DomElement.getElementById('div2', div);
        var tc = Sys.query([div1, div2]).activateElements();
        AtlasUnit.Assert.areEqual(div1.control, div2.control.ref, "2 should reference control 1");
        AtlasUnit.Assert.areEqual(div2.control, div1.control.ref, "1 should reference control 2");
        div1.control.dispose();
        div2.control.dispose();
    }

    this.testSkipSysTemplate = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var div = document.createElement("div");
        div.innerHTML = "<div sys:attach='t'></div><div sys:attach='t' class='sys-template'><div sys:attach='t'></div></div><div sys:attach='t'></div>";
        var components = Sys.query(div).activateElements().components;
        AtlasUnit.Assert.areEqual(3, components.length);
    }

    this.testSkipSysTemplateWithLeadingClasses = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var div = document.createElement("div");
        div.innerHTML = "<div sys:attach='t'></div><div sys:attach='t' class='start sys-template'><div sys:attach='t'></div></div><div sys:attach='t'></div>";
        var components = Sys.query(div).activateElements().components;
        AtlasUnit.Assert.areEqual(3, components.length);
    }
    
    this.testSkipSysTemplateWithTrailingClasses = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var div = document.createElement("div");
        div.innerHTML = "<div sys:attach='t'></div><div sys:attach='t' class='sys-template end'><div sys:attach='t'></div></div><div sys:attach='t'></div>";
        var components = Sys.query(div).activateElements().components;
        AtlasUnit.Assert.areEqual(3, components.length);
    }
    
    this.testSkipSysTemplateWithLeadingAndTrailingClasses = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var div = document.createElement("div");
        div.innerHTML = "<div sys:attach='t'></div><div sys:attach='t' class='start sys-template end'><div sys:attach='t'></div></div><div sys:attach='t'></div>";
        var components = Sys.query(div).activateElements().components;
        AtlasUnit.Assert.areEqual(3, components.length);
    }
    

    this.testSkipSysTemplateEnd = function() {
        // when sys-template element is at the end of the dom
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var div = document.createElement("div");
        div.innerHTML = "<div></div><div class='sys-template'><div sys:attach='t'></div></div>";
        var components = Sys.query(div).activateElements().components;
        AtlasUnit.Assert.areEqual(0, components.length);
    }

    this.testSkipSysTemplateNoSibling = function() {
        // when sys-template element is the last sibling in its parent tree
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var div = document.createElement("div");
        div.innerHTML = "<div><div class='sys-template'></div></div><div sys:attach='t'></div>";
        var components = Sys.query(div).activateElements().components;
        AtlasUnit.Assert.areEqual(1, components.length);
    }

    this.testSkipSysTemplateStopsAtRoot = function() {
        // when sys-template element is the last sibling in its parent tree, and the the next element that would
        // logically be processes is outside the scope of the element being activated.
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var div = document.createElement("div");
        div.innerHTML = "<div sys:attach='t'></div><div id='div1'><div class='sys-template'></div></div><div sys:attach='t'></div>";
        div = Sys.UI.DomElement.getElementById('div1', div);
        var components = Sys.query(div).activateElements().components;
        AtlasUnit.Assert.areEqual(0, components.length);
    }

    this.testSkipSysTemplateTextSibling = function() {
        // when sys-template element is the last element sibling in its parent tree but it and parent has a text sibling
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var div = document.createElement("div");
        div.innerHTML = "<div><div class='sys-template'></div>test</div>test<div sys:attach='t'></div>test";
        var components = Sys.query(div).activateElements().components;
        AtlasUnit.Assert.areEqual(1, components.length);
    }

    this.testDisposalNonComponent = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooNonComponent");
        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' sys:attach='t'></div>";
        var div1 = Sys.UI.DomElement.getElementById('div1', div);
        var tc = Sys.query(div1).activateElements();
        var noncomponent = tc.components[0];
        Sys.Application.disposeElement(div1, false);
        AtlasUnit.Assert.isTrue(noncomponent.disposed);
        AtlasUnit.Assert.isNull(div1._components);
    }

    this.testDisposalComponent = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooComponent");
        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' sys:attach='t'></div>";
        var div1 = Sys.UI.DomElement.getElementById('div1', div);
        var component = Sys.query(div1).activateElements().components[0];
        Sys.Application.disposeElement(div1, false);
        AtlasUnit.Assert.isTrue(component.disposed);
        AtlasUnit.Assert.isNull(div1._components);
    }

    this.testDisposalControl = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' sys:attach='t'></div>";
        var div1 = Sys.UI.DomElement.getElementById('div1', div);
        var component = Sys.query(div1).activateElements().components[0];
        Sys.Application.disposeElement(div1, false);
        AtlasUnit.Assert.isTrue(component.disposed);
        AtlasUnit.Assert.isNull(div1.control);
    }

    this.testDisposalBehavior = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooBehavior");
        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' sys:attach='t'></div>";
        var div1 = Sys.UI.DomElement.getElementById('div1', div);
        var component = Sys.query(div1).activateElements().components[0];
        Sys.Application.disposeElement(div1, false);
        AtlasUnit.Assert.isTrue(component.disposed);
        AtlasUnit.Assert.isNull(div1._behaviors);
    }

    this.testAttributes = function() {
        function foo(c, n, tc, p) { return 'foo' + p.x; };
        Sys.Application.registerMarkupExtension("foo", foo);
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooNonComponent");

        var div = document.createElement("div");
        div.innerHTML = "<div id='div1' sys:attach='t' t:lowerproperty='lower' t:upperproperty='{{ \"UPPER\" }}' t:otherproperty='{foo x={{88}}}'></div>";
        var components = Sys.query(div).activateElements().components;
        var div1 = Sys.UI.DomElement.getElementById('div1', div);
        AtlasUnit.Assert.areEqual(1, components.length);
        var c = components[0];
        AtlasUnit.Assert.areEqual("lower", c.get_lowerproperty());
        AtlasUnit.Assert.areEqual("UPPER", c.get_UPPERPROPERTY());
        AtlasUnit.Assert.areEqual("foo88", c.get_otherProperty());
    }

    this.testActivateAfterUpdate = function() {
        document.body.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        var div = document.createElement("div");

        // all activation
        prm._updatePanel(div, "<div id='div1' sys:attach='t'><div>");
        var div1 = Sys.UI.DomElement.getElementById('div1', div);
        AtlasUnit.Assert.isTrue(!!div1.control, "UpdatePanel wasn't activated after updating.");
        AtlasUnit.Assert.areEqual("Sys.UI.Test.TemplateTest.FooControl", Object.getTypeName(div1.control));

        // with alternate namespace than body has as a parent element
        var divp = document.createElement("div");
        divp.setAttribute("xmlns:zzz", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        divp.appendChild(div);
        prm._updatePanel(div, "<div id='div1' sys:attach='zzz'><div>");
        div1 = Sys.UI.DomElement.getElementById('div1', div);
        AtlasUnit.Assert.isTrue(!!div1.control, "UpdatePanel should activate after an update and it should use the same namespace mappings of any parent elements.");
        div1.control.dispose();
    }

    this.testNamespaceMappingInvalidType = function() {
        var div = document.createElement("div");
        div.setAttribute("xmlns:foo", "javascript:Sys.Foo");
        div.innerHTML = "<div sys:attach='foo'></div>";
        Sys.query(div).activateElements();
    }
    this.testNamespaceMappingInvalidType["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testNamespaceMappingInvalidType["AtlasUnit.ExpectedException"] = {
        message: "Sys.InvalidOperationException: Invalid type namespace declaration, 'Sys.Foo' is not a valid type."
    }

    this.testNamespaceMappingMissingType = function() {
        var div = document.createElement("div");
        div.setAttribute("xmlns:foo", "javascript:Sys.Foo");
        div.innerHTML = "<div sys:attach='bar'></div>";
        Sys.query(div).activateElements();
    }
    this.testNamespaceMappingMissingType["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testNamespaceMappingMissingType["AtlasUnit.ExpectedException"] = {
        message: "Sys.InvalidOperationException: Invalid attribute 'sys:attach', the type 'bar' is not a registered namespace."
    }

    this.testElementBindingsSimpleHTML = function() {
        var element;
        helper.processAndVerify("helloworld");
        helper.processAndVerify("<b>HELLOWORLD</b>");
        helper.processAndVerify("Hello <b>WORLD</b>");
        helper.processAndVerify("[<!-- Hello World -->]");
        helper.processAndVerify("<span sys:id='span1'>Hello, world</span>", "auto");
        element = helper.processAndVerify("<span id='span1' sys:expando='expando!!' sys:class='foo, bar' sys:style='font-size:25px;'>Hello, world</span>", "auto", null, "span1");
        AtlasUnit.Assert.areEqual("expando!!", element.getAttribute("expando"));
        helper.processAndVerify("<table sys:cellpadding='0' sys:cellspacing='1' sys:width='10px' sys:height='4em'><tr sys:id='row1'><td sys:id='cell1' sys:colspan='8'>colspan8</td></tr></table>", "auto");
        helper.processAndVerify("<input type='text' sys:value='tb1' name='textbox1' sys:size='30' />", "auto");
        element = helper.processAndVerify("<input id='cb1' type='checkbox' sys:value='cb1' sys:checked='checked' />", "auto", null, "cb1");
        helper.verifyInput(element, { type: "checkbox", value: "cb1", checked: true });
        // use %REMOVE% to distinguish the radio button groups of the actual element and the expected element, because otherwise
        // in the act of creating the comparison element, the actual element's checked status will change.
        element = helper.processAndVerify("<input id='rb1' type='radio' name='r1' sys:value='rb1' sys:checked='checked' />", "<input sys:checked='checked' id='rb1' type='radio' name='%REMOVE%r1' sys:value='rb1' value='rb1' checked='checked' />", null, "rb1");
        helper.verifyInput(element, { type: "radio", name: "r1", value: "rb1", checked: true });

        element = helper.processAndVerify("<input type='submit' name='submit1' sys:value='submitval' id='submit1' />", "auto", null, "submit1");
        helper.verifyInput(element, { type: "submit", name: "submit1", value: "submitval" });
        element = helper.processAndVerify("<input type='button' name='submit1' sys:value='buttonval' id='button1' />", "auto", null, "button1");
        helper.verifyInput(element, { type: "button", name: "submit1", value: "buttonval" });

        element = helper.processAndVerify("<select id='select1' name='select1'><option sys:value='value0'>text0</option><option sys:value='value1' sys:selected='selected'>text1</option></select>", "auto", null, "select1");
        helper.verifySelect(element, [{ value: "value0", text: "text0" }, { value: "value1", text: "text1", selected: true}], "test 1");

        element = helper.processAndVerify("<select id='select1' name='select1' sys:value='value1'><option value='value0'>text0</option><option value='value1'>text1</option></select>", "auto", null, "select1");
        helper.verifySelect(element, [{ value: "value0", text: "text0" }, { value: "value1", text: "text1", selected: true}], "test 2");
        element = helper.processAndVerify("<select id='select1' name='select1' sys:selectedindex='1'><option value='value0'>text0</option><option value='value1'>text1</option></select>", "auto", null, "select1");
        helper.verifySelect(element, [{ value: "value0", text: "text0" }, { value: "value1", text: "text1", selected: true}], "test 3");
    }

    this.testElementBindingsBooleanAttributes = function() {
        var element = helper.processAndVerify("<input type='text' id='tb1' sys:readonly='readonly' sys:disabled='disabled' />", "auto", null, "tb1");
        AtlasUnit.Assert.isTrue(element.readOnly, "readonly on text input");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on text input");
        element = helper.processAndVerify("<img id='img1' sys:disabled='disabled' sys:ismap='ismap' />", "auto", null, "img1");
        // assert this differently since only IE actually supports disabled on non-input elements
        AtlasUnit.Assert.isTrue(!!element.getAttribute('disabled'), "disabled on img");
        AtlasUnit.Assert.isTrue(element.isMap, "ismap on img");
        element = helper.processAndVerify("<input type='checkbox' id='cb1' sys:readonly='readonly' sys:disabled='disabled' sys:checked='checked' />", "auto", null, "cb1");
        AtlasUnit.Assert.isTrue(element.readOnly, "readonly on checkbox");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on checkbox");
        AtlasUnit.Assert.isTrue(element.checked, "checked on checkbox");
        element = helper.processAndVerify("<textarea id='ta1' sys:readonly='readonly' sys:disabled='disabled' />", "auto", null, "ta1");
        AtlasUnit.Assert.isTrue(element.readOnly, "readonly on textarea");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on textarea");
        element = helper.processAndVerify("<select id='sel1' sys:disabled='disabled' sys:multiple='multiple'/>", "auto", null, "sel1");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on select");
        AtlasUnit.Assert.isTrue(element.multiple, "multiple on select");
        element = helper.processAndVerify("<select sys:multiple='multiple'><option id='op1' sys:disabled='disabled' sys:selected='selected'>op1</option></select>", "auto", null, "op1");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on option");
        AtlasUnit.Assert.isTrue(element.selected, "selected on option");
        element = helper.processAndVerify("<select sys:multiple='multiple'><option>dummy</option><option id='op1' sys:disabled='disabled' sys:selected='selected'>op1</option></select>", "auto", null, "op1");
        AtlasUnit.Assert.isTrue(element.disabled, "disabled on option 2");
        AtlasUnit.Assert.isTrue(element.selected, "selected on option 2");
    }

    this.testElementBindingsBooleanAttributesFalse = function() {
        var element = helper.processAndVerify("<input type='text' id='tb1' sys:readonly='{{false}}' sys:disabled='{{false}}' />", null, null, "tb1");
        AtlasUnit.Assert.isFalse(element.readOnly, "readonly on text input");
        AtlasUnit.Assert.isFalse(element.disabled, "disabled on text input");
        element = helper.processAndVerify("<img id='img1' sys:disabled='{{false}}' sys:ismap='{{false}}' />", null, null, "img1");
        // assert this differently since only IE actually supports disabled on non-input elements
        AtlasUnit.Assert.isFalse(!!element.getAttribute('disabled'), "disabled on img");
        AtlasUnit.Assert.isFalse(element.isMap, "ismap on img");
        element = helper.processAndVerify("<input type='checkbox' id='cb1' sys:readonly='{{false}}' sys:disabled='{{false}}' sys:checked='{{false}}' />", null, null, "cb1");
        AtlasUnit.Assert.isFalse(element.readOnly, "readonly on checkbox");
        AtlasUnit.Assert.isFalse(element.disabled, "disabled on checkbox");
        AtlasUnit.Assert.isFalse(element.checked, "checked on checkbox");
        element = helper.processAndVerify("<textarea id='ta1' sys:readonly='{{false}}' sys:disabled='{{false}}' />", null, null, "ta1");
        AtlasUnit.Assert.isFalse(element.readOnly, "readonly on textarea");
        AtlasUnit.Assert.isFalse(element.disabled, "disabled on textarea");
        element = helper.processAndVerify("<select id='sel1' sys:disabled='{{false}}' sys:multiple='{{false}}'/>", null, null, "sel1");
        AtlasUnit.Assert.isFalse(element.disabled, "disabled on select");
        AtlasUnit.Assert.isFalse(element.multiple, "multiple on select");
        element = helper.processAndVerify("<select sys:multiple='{{true}}'><option id='op1' sys:disabled='{{false}}' sys:selected='{{false}}'>op1</option></select>", "<select multiple='multiple' sys:multiple='{{true}}'><option id='op1' sys:disabled='{{false}}' sys:selected='{{false}}'>op1</option></select>", null, "op1");
        AtlasUnit.Assert.isFalse(element.disabled, "disabled on option");
        AtlasUnit.Assert.isFalse(element.selected, "selected on option");
        element = helper.processAndVerify("<select sys:multiple='{{true}}'><option>dummy</option><option id='op1' sys:disabled='{{false}}' sys:selected='{{false}}'>op1</option></select>", "<select multiple='multiple' sys:multiple='{{true}}'><option>dummy</option><option id='op1' sys:disabled='{{false}}' sys:selected='{{false}}'>op1</option></select>", null, "op1");
        AtlasUnit.Assert.isFalse(element.disabled, "disabled on option 2");
        AtlasUnit.Assert.isFalse(element.selected, "selected on option 2");
    }

    this.testElementBindingsInnerText = function() {
        helper.processAndVerify("<span sys:innertext='foo&lt;br/&gt;'>existing</span>", "<span sys:innertext='foo&lt;br/&gt;'>foo&lt;br/&gt;</span>");
        helper.processAndVerify("<span sys:innertext='{{ 8 }}'>existing</span>", "<span sys:innertext='{{ 8 }}'>8</span>");
        helper.processAndVerify("<span sys:innertext='{{ {toString: function() { return \"calledToString\" } } }}'>existing</span>", "<span sys:innertext='{{ {toString: function() { return \"calledToString\" } } }}'>calledToString</span>");
    }

    this.testElementBindingsInnerHtml = function() {
        helper.processAndVerify("<span sys:innerhtml='foo&lt;br/&gt;bar'>existing</span>", "<span sys:innerhtml='foo&lt;br/&gt;bar'>foo<br/>bar</span>");
        helper.processAndVerify("<span sys:innerhtml='{{ 8 }}'>existing</span>", "<span sys:innerhtml='{{ 8 }}'>8</span>");
    }

    this.testDeclarativelySettingBehaviorId = function() {
        var div = document.createElement("div");
        div.innerHTML = "<span sys:attach='b' xmlns:b='javascript:Sys.UI.Test.TemplateTest.FooBehavior' id='element1' b:id='behavior1'></span>";
        var tc = Sys.query(div).activateElements();
        AtlasUnit.Assert.areEqual(1, tc.components.length);
        AtlasUnit.Assert.areEqual("behavior1", tc.components[0].get_id());
        tc.dispose();
    }
}
Sys.UI.Test.ActivationTest.registerClass("Sys.UI.Test.ActivationTest");
Sys.UI.Test.ActivationTest["AtlasUnit.IsTestFixture"] = true;
