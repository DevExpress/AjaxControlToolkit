Type.registerNamespace("Sys.UI.Test");

Sys.UI.Test.DeclarativeBindingTest = function() {
    this.testTextAreaBindingTextNode = function() {
        var data = { foo: 'foovalue' }, div = document.createElement('div');

        div.innerHTML = "<textarea id='ta1' sys:name='{{$dataItem.foo}}' rows='5' cols='20'>{binding foo}</textarea>";
        var template = new Sys.UI.Template(div), container = document.createElement('div'),
            result = template.instantiateIn(container, null, data, null, null);

        AtlasUnit.Assert.areEqual("foovalue", Sys.UI.DomElement.getElementById('ta10', container).value);
    }
    this.testDefaultValue = function() {
        var data = { foo: { baz: "baz"} }, div = document.createElement('div');

        div.innerHTML = "<input type='text' id='text1' sys:value='{binding foo.bar,defaultValue=[null!]}' />";
        var template = new Sys.UI.Template(div), container = document.createElement('div');
        var result = template.instantiateIn(container, null, data, null, null);

        AtlasUnit.Assert.areEqual("[null!]", Sys.UI.DomElement.getElementById('text10', container).value);
    }
    this.testExpando = function() {
        var div = document.createElement('div');
        div.innerHTML = "<input type='text' id='text1' sys:value='{binding source={{window}},foo=str,bar={{88}}}' />";
        var template = new Sys.UI.Template(div), container = document.createElement('div');
        var result = template.instantiateIn(container);
        var b = result.components[0];
        AtlasUnit.Assert.areEqual("str", b.foo);
        AtlasUnit.Assert.areEqual(88, b.bar);
    }    
    this.testStringSource = function() {
        var data = { foo: { baz: "baz"} }, div = document.createElement('div');

        div.innerHTML = "<input type='text' id='text1' sys:value='{binding value,source=#text2}' /><input type='text' id='text2' value='value2'/>";
        var template = new Sys.UI.Template(div), container = document.createElement('div');
        var result = template.instantiateIn(container, null, data, null, null);

        AtlasUnit.Assert.areEqual("value2", Sys.UI.DomElement.getElementById('text10', container).value);
    }
    this.testStringTarget = function() {
        var data = { foo: { baz: "baz"} }, div = document.createElement('div');

        div.innerHTML = "<input type='text' id='text1'  /><input type='text' id='text2' value='value2'/><span>{binding value,source=#text2,target=#text1,targetProperty=value}</span>";
        var template = new Sys.UI.Template(div), container = document.createElement('div');
        var result = template.instantiateIn(container, null, data, null, null);

        AtlasUnit.Assert.areEqual("value2", Sys.UI.DomElement.getElementById('text10', container).value);
    }
    this.testDottedPathWithStringSource = function() {
        div = document.createElement('div');
        div.setAttribute("xmlns:t", "javascript:Sys.UI.Test.TemplateTest.FooControl");
        div.innerHTML = "<input type='text' id='text1' sys:attach='t' t:value='value1' /><input type='text' id='text2' sys:attach='t' t:value='value2'/><span>{binding control.value,source=#text2,target=#text1,targetProperty=control.value}</span>";
        var template = new Sys.UI.Template(div), container = document.createElement('div');
        var result = template.instantiateIn(container, null, null, null, null);
        var c1 = result.components[0];
        var c2 = result.components[1];
        AtlasUnit.Assert.areEqual("value2", c1.value);
    }
    this.testSysInnerText = function() {
        div = document.createElement('div');
        div.innerHTML = "<span sys:innertext='{binding foo}'>existing</span>";
        var span = div.childNodes[0]
        var data = { foo: 'foo<br/>bar' };
        Sys.query(span).activateElements(data);
        AtlasUnit.Assert.areEqual(1, span.childNodes.length);
        AtlasUnit.Assert.areEqual(3, span.childNodes[0].nodeType);
        AtlasUnit.Assert.areEqual("foo<br/>bar", span.childNodes[0].nodeValue);
        Sys.Observer.setValue(data, "foo", "changed");
        AtlasUnit.Assert.areEqual(1, span.childNodes.length);
        AtlasUnit.Assert.areEqual(3, span.childNodes[0].nodeType);
        AtlasUnit.Assert.areEqual("changed", span.childNodes[0].nodeValue);
    }

    this.testSysInnerHTML = function() {
        div = document.createElement('div');
        div.innerHTML = "<span sys:innerhtml='{binding foo}'>existing</span>";
        var span = div.childNodes[0]
        var data = { foo: 'foo<br/>bar' };
        Sys.query(span).activateElements(data);
        AtlasUnit.Assert.areEqual(3, span.childNodes.length);
        AtlasUnit.Assert.areEqual(3, span.childNodes[0].nodeType);
        AtlasUnit.Assert.areEqual("foo", span.childNodes[0].nodeValue);
        AtlasUnit.Assert.areEqual(1, span.childNodes[1].nodeType);
        AtlasUnit.Assert.areEqual("br", span.childNodes[1].tagName.toLowerCase());
        AtlasUnit.Assert.areEqual(3, span.childNodes[2].nodeType);
        AtlasUnit.Assert.areEqual("bar", span.childNodes[2].nodeValue);
        Sys.Observer.setValue(data, "foo", "changed<hr/>");
        AtlasUnit.Assert.areEqual(2, span.childNodes.length);
        AtlasUnit.Assert.areEqual(3, span.childNodes[0].nodeType);
        AtlasUnit.Assert.areEqual("changed", span.childNodes[0].nodeValue);
        AtlasUnit.Assert.areEqual(1, span.childNodes[1].nodeType);
        AtlasUnit.Assert.areEqual("hr", span.childNodes[1].tagName.toLowerCase());
    }

}
Sys.UI.Test.DeclarativeBindingTest.registerClass("Sys.UI.Test.DeclarativeBindingTest");
Sys.UI.Test.DeclarativeBindingTest["AtlasUnit.IsTestFixture"] = true;

 