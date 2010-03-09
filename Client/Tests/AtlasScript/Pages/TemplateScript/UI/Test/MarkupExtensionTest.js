Type.registerNamespace("Sys.UI.Test");

Sys.UI.Test.MarkupExtensionsTest = function() {
    this._provideValue = function(c, n, tc, p) {
        var s = "[Property=" + n;
        var arr = [];
        // sort them since they are in an unpredictable order
        for (var o in p) {
            if (o.startsWith("$") && o !== "$default") continue;
            arr[arr.length] = o;
        }
        arr.sort();
        for (var i = 0; i < arr.length; i++) {
            s += "," + arr[i] + "=" + p[arr[i]];
        }
        s += "]";
        return s;
    }

    this.testRegisterMarkupExtension = function() {
        var foo = function() { };
        var bar = function() { };
        Sys.Application.registerMarkupExtension("foo", foo);
        Sys.Application.registerMarkupExtension("bar", bar, false);
        AtlasUnit.Assert.areEqual(foo, Sys.Application._getMarkupExtension('foo').extension, 'foo');
        AtlasUnit.Assert.isTrue(Sys.Application._getMarkupExtension('foo').expression, 'foo expression');
        AtlasUnit.Assert.areEqual(bar, Sys.Application._getMarkupExtension('bar').extension, 'bar');
        AtlasUnit.Assert.isFalse(Sys.Application._getMarkupExtension('bar').expression, 'bar expression');
        Sys.Application.registerMarkupExtension("foo", bar);
        AtlasUnit.Assert.areEqual(bar, Sys.Application._getMarkupExtension('foo').extension, 'bar should replace foo');
    }

    this.testCreateAndVerify = function() {
        // test for the test helper, which validates other tests are not false positives
        var err;
        try {
            Sys.UI.Test.TemplateHelper.createAndVerify("<span foo='a'></span>", "<span bar='b'></span>");
        }
        catch (e) {
            err = e;
        }
        AtlasUnit.Assert.isTrue(!!err);
        AtlasUnit.Assert.areNotEqual(-1, err.message.indexOf("Mismatch"));
    }

    this.testMarkupParsingString = function() {
        Sys.Application.registerMarkupExtension("Test", this._provideValue);
        Sys.UI.Test.TemplateHelper.createAndVerify("<span foo0='{Test}'></span>", "<span foo0='{Test}'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo1='{Test}'></span>", "<span foo1='[Property=foo1]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo2='{Test def}'></span>", "<span foo2='[Property=foo2,$default=def]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo3='{  Test  def  }'></span>", "<span foo3='[Property=foo3,$default=def]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo4='{Test def,a=b}'></span>", "<span foo4='[Property=foo4,$default=def,a=b]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo5='{Test a=b,def}'></span>", "<span foo5='[Property=foo5,$default=def,a=b]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo6='{Test def ,a = b, c = d }'></span>", "<span foo6='[Property=foo6,$default=def,a=b,c=d]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo7='{Test a = b\\,c\\,d}'></span>", "<span foo7='[Property=foo7,a=b,c,d]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo8='{Test a=}'></span>", "<span foo8='[Property=foo8,a=]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo9='{Test a=,}'></span>", "<span foo9='[Property=foo9,$default=,a=]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo10='{Test ,a=}'></span>", "<span foo10='[Property=foo10,$default=,a=]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo17='{Test a{}'></span>", "<span foo17='[Property=foo17,$default=a{]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo18='{Test a{{}'></span>", "<span foo18='[Property=foo18,$default=a{{]'></span>");
    }

    this.testMarkupParsingExpression = function() {
        Sys.Application.registerMarkupExtension("Test", this._provideValue);
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo2=\"{Test {{'def'}}}\"></span>", "<span foo2='[Property=foo2,$default=def]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo4=\"{Test {{'def'}},a={{'b'}}}\"></span>", "<span foo4='[Property=foo4,$default=def,a=b]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo5=\"{Test a={{'b'}},{{'def'}}}\"></span>", "<span foo5='[Property=foo5,$default=def,a=b]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo6=\"{Test {{'def'}} ,a = {{'b'}}, c = {{'d'}} }\"></span>", "<span foo6='[Property=foo6,$default=def,a=b,c=d]'></span>");
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo7=\"{Test a = {{'b\\,c\\,d'}}}\"></span>", "<span foo7='[Property=foo7,a=b,c,d]'></span>");
    }

    this.testMarkupParsingInline = function() {
        Sys.Application.registerMarkupExtension("Test", this._provideValue);
        // the 'x' is necessary because otherwise the browser discounts the whitespace inside the span,
        // probably because it goes within a div.
        Sys.UI.Test.TemplateHelper.createAndVerify("x<span>{Test}</span>x", "x<span>[Property=innerText]</span>x");
        Sys.UI.Test.TemplateHelper.createAndVerify("x<span> {Test}</span>x", "x<span>[Property=innerText]</span>x");
        Sys.UI.Test.TemplateHelper.createAndVerify("x<span>{Test} </span>x", "x<span>[Property=innerText]</span>x");
        Sys.UI.Test.TemplateHelper.createAndVerify("x<span>\n{Test}</span>x", "x<span>[Property=innerText]</span>x");
    }

    this.testMarkupParsingStyle = function() {
        Sys.Application.registerMarkupExtension("Literal", function() { return "88px"; });
        Sys.UI.Test.TemplateHelper.clearNamespaces();
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:style-font-size='{Literal}'></span>", "<span style='font-size:88px'></span>");
    }

    this.testMarkupParsingNonExpression = function() {
        Sys.UI.Test.MarkupExtensionsTest._calledFoo = false;
        function foo() {
            Sys.UI.Test.MarkupExtensionsTest._calledFoo = true;
        }
        Sys.Application.registerMarkupExtension("NonExpression", foo, false);
        Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:foo='{NonExpression}'></span>", "<span></span>");
        AtlasUnit.Assert.isTrue(Sys.UI.Test.MarkupExtensionsTest._calledFoo);
        Sys.UI.Test.MarkupExtensionsTest._calledFoo = false;
    }

    this.testMarkupParsingComponent = function() {
        Sys.Application.registerMarkupExtension("Test", this._provideValue);
        Sys.UI.Test.TemplateHelper.clearNamespaces();
        document.body.setAttribute("xmlns:abc", "javascript:Sys.UI.Test.FooComponent");
        var result = Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:attach='abc' abc:foo='{Test def,a=b}'></span>", "<span></span>");
        var foo = result.components[0];
        AtlasUnit.Assert.areEqual("[Property=foo,$default=def,a=b]", foo.get_foo());
    }

    this.testMarkupParsingComponentNonExpression = function() {
        Sys.UI.Test.MarkupExtensionsTest._component = "notset";
        function foo(component) {
            Sys.UI.Test.MarkupExtensionsTest._component = component;
        }
        Sys.Application.registerMarkupExtension("NonExpression", foo, false);
        Sys.UI.Test.TemplateHelper.clearNamespaces();
        document.body.setAttribute("xmlns:abc", "javascript:Sys.UI.Test.FooComponent");
        var result = Sys.UI.Test.TemplateHelper.createAndVerify("<span sys:attach='abc' abc:foo='{NonExpression def,a=b}'></span>", "<span></span>");
        var f = result.components[0];
        AtlasUnit.Assert.isNull(f.get_foo());
        AtlasUnit.Assert.areEqual(f, Sys.UI.Test.MarkupExtensionsTest._component);
        Sys.UI.Test.MarkupExtensionsTest._component = null;
    }
}
Sys.UI.Test.MarkupExtensionsTest.registerClass("Sys.UI.Test.MarkupExtensionsTest");
Sys.UI.Test.MarkupExtensionsTest["AtlasUnit.IsTestFixture"] = true;

Sys.UI.Test.FooComponent = function() {
    Sys.UI.Test.FooComponent.initializeBase(this);
    this._foo = null;
}
Sys.UI.Test.FooComponent.prototype = {
    get_foo: function() { return this._foo; },
    set_foo: function(value) { this._foo = value; }
}
Sys.UI.Test.FooComponent.registerClass("Sys.UI.Test.FooComponent", Sys.Component);

 