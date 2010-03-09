/// <reference name="MicrosoftAjax.js" />
Type.registerNamespace("Sys.Test");

Sys.Test.LoaderTest = function() {
    var loader = Sys.loader,
        src, callback,
        srcs, callbacks;
    var old;
    
    this.setUp = function() {
        script = null;
        old = {scripts: Sys.scripts, create: Sys.create, components: Sys.components, composites: Sys.composites, plugins: Sys.plugins};
        Sys.scripts = {};
        Sys.create = {};
        Sys.components = {};
        Sys.composites = {};
        Sys.plugins = {};
        Sys.loader.basePath = "http://basepath/scripts/";
        loader._loadedScripts = null;
        // mock _loadSrc so we dont actually load any scripts
        this._oldLoad = loader._loadSrc;
        loader._loadSrc = function(s, c) {
            src = s;
            callback = c;
            srcs.push(s);
            callbacks.push(c);
        }
        src = null;
        callback = null;
        srcs = [];
        callbacks = [];
    }
    this.tearDown = function() {
        loader._loadSrc = this._oldLoad;
        Sys._merge(Sys, old);
    }
    
    this.getOnceHandler = function() {
        var once = false;
        return function() {
            AtlasUnit.Assert.isFalse(once, "Handler should only be called once.");
            once = true;
        }
    }
    
    this.verifyLoadsImmediately = function(name) {
        // now loading foo or bar should succeed immediately
        var loaded = false;
        src = null;
        Sys.require(name, function() {
            loaded = true;
        });
        AtlasUnit.Assert.isNull(src, "Script already loaded, should not load again.");
        AtlasUnit.Assert.isTrue(loaded, name + " should load immediately.");
    }
    
    this.testDefineScript = function() {
        var foo = {name:'foo'};
        Sys.loader.defineScript(foo);
        AtlasUnit.Assert.areNotEqual(foo, Sys.scripts.foo, "Object should be cloned.");
        foo = Sys.scripts.foo;
        var bar = {name:'foo', expando: "expando" };
        Sys.loader.defineScript(bar);
        AtlasUnit.Assert.areEqual(foo, Sys.scripts.foo, "Object should be extended not replaced.");
        AtlasUnit.Assert.areEqual("expando", foo.expando);
    }
    
    this.testDefineScriptComponents = function() {
        var foo = {name:'foo', components: ["Foo.Bar", "Baz", { name: 'FOO', typeName: 'My.Type' }]};
        loader.defineScript(foo);
        foo = Sys.scripts.foo;
        AtlasUnit.Assert.isTrue(!!Sys.create.FOO, "create.FOO");
        AtlasUnit.Assert.isFalse(!!Sys.create.Bar, "create.Bar");
        AtlasUnit.Assert.isTrue(!!Sys.create.bar, "create.bar");
        AtlasUnit.Assert.isFalse(!!Sys.create.Baz, "create.Baz");
        AtlasUnit.Assert.isTrue(!!Sys.create.baz, "create.baz");
        AtlasUnit.Assert.areEqual(foo, Sys.components.FOO.script, "components.FOO.script");
        AtlasUnit.Assert.areEqual(foo, Sys.components.bar.script, "components.bar.script");
        AtlasUnit.Assert.areEqual(foo, Sys.components.baz.script, "components.baz.script");
    }

    this.testRegisterComponent = function() {
        Sys.registerComponent(Sys.UI.Test.TemplateTest.FooComponent, { name: "FOO" });
        AtlasUnit.Assert.isTrue(!!Sys.create.FOO);
        AtlasUnit.Assert.areEqual(1, Sys.create.FOO.length, "Should accept 1 parameter.");
        if (Sys.debug) {
            var fnString = Sys.create.FOO.toString();
            AtlasUnit.Assert.isTrue(/\s*function anonymous\(properties\)\s*\{/.test(fnString), "Unexpected signature in: " + fnString);
            AtlasUnit.Assert.isTrue(/\/\/\/\s*\<summary\>Creates an instance of the type 'Sys.UI.Test.TemplateTest.FooComponent' and sets the given properties.\<\/summary\>\s*/.test(fnString), "Expecting summary doc comment in: " + fnString);
            AtlasUnit.Assert.isTrue(/\/\/\/\s*\<param name=\"properties\" type=\"Object\" mayBeNull=\"true\" optional=\"true\"\>Additional properties to set on the component.\<\/param\>\s*/.test(fnString), "Expecting param doc comment for 'properties' parameter in: " + fnString);
            AtlasUnit.Assert.isTrue(/\/\/\/\s*\<returns type=\"Sys.UI.Test.TemplateTest.FooComponent\" \/\>\s*/.test(fnString), "Expecting returns doc comment in: " + fnString);
        }
        var foo = Sys.create.FOO();
        AtlasUnit.Assert.areEqual(Sys.UI.Test.TemplateTest.FooComponent, Object.getType(foo));
        foo = Sys.create.FOO({ test1: 1, property: "value" });
        AtlasUnit.Assert.areEqual(1, foo.test1);
        AtlasUnit.Assert.areEqual("value", foo.get_property());
        Sys.components.FOO.defaults = {
            test1: "def",
            test2: "def"
        }
        foo = Sys.create.FOO({ test1: 1, property: "value" });
        AtlasUnit.Assert.areEqual(1, foo.test1);
        AtlasUnit.Assert.areEqual("def", foo.test2);
        AtlasUnit.Assert.areEqual("value", foo.get_property());
    }

    this.testRegisterComponentWithCustomParameters = function() {
        Sys.registerComponent(Sys.UI.Test.TemplateTest.FooComponent, {
            name: "FOO",
            description: "A component",
            parameters: ["param1", {name: "param2", description: "param number 2", type: "Number"}]
        });
        AtlasUnit.Assert.isTrue(!!Sys.create.FOO);
        AtlasUnit.Assert.areEqual(3, Sys.create.FOO.length, "Should accept 3 parameters.");
        if (Sys.debug) {
            var fnString = Sys.create.FOO.toString();
            AtlasUnit.Assert.isTrue(/\s*function anonymous\(param1,\s*param2,\s*properties\)\s*\{/.test(fnString), "Unexpected signature in: " + fnString);
            AtlasUnit.Assert.isTrue(/\/\/\/\s*\<summary\>A component\<\/summary\>\s*/.test(fnString), "Expecting summary doc comment in: " + fnString);
            AtlasUnit.Assert.isTrue(/\/\/\/\s*\<param name=\"param1\"\>\<\/param\>\s*/.test(fnString), "Expecting param doc comment for typeless parameter in: " + fnString);
            AtlasUnit.Assert.isTrue(/\/\/\/\s*\<param name=\"param2\" type=\"Number\"\>param number 2\<\/param\>\s*/.test(fnString), "Expecting param doc comment for typed parameter in: " + fnString);
            AtlasUnit.Assert.isTrue(/\/\/\/\s*\<param name=\"properties\" type=\"Object\" mayBeNull=\"true\" optional=\"true\"\>Additional properties to set on the component.\<\/param\>\s*/.test(fnString), "Expecting param doc comment for 'properties' parameter in: " + fnString);
            AtlasUnit.Assert.isTrue(/\/\/\/\s*\<returns type=\"Sys.UI.Test.TemplateTest.FooComponent\" \/\>\s*/.test(fnString), "Expecting returns doc comment in: " + fnString);
        }
        var foo = Sys.create.FOO();
        AtlasUnit.Assert.areEqual(Sys.UI.Test.TemplateTest.FooComponent, Object.getType(foo));
        foo = Sys.create.FOO('p1', 'p2', { test1: 1, property: "value" });
        AtlasUnit.Assert.areEqual('p1', foo.param1);
        AtlasUnit.Assert.areEqual('p2', foo.param2);
        AtlasUnit.Assert.areEqual(1, foo.test1);
        AtlasUnit.Assert.areEqual("value", foo.get_property());
        Sys.components.FOO.defaults = {
            param2: "def",
            test1: "def"
        }
        foo = Sys.create.FOO('p1');
        AtlasUnit.Assert.areEqual('p1', foo.param1);
        AtlasUnit.Assert.areEqual('def', foo.param2);
        AtlasUnit.Assert.areEqual('def', foo.test1);
    }

    this.testDefineScriptBehaviors = function() {
        var foo = {name:'foo', behaviors: ["Foo.Bar", "Baz", { name: 'FOO', typeName: 'My.Type' }]};
        loader.defineScript(foo);
        foo = Sys.scripts.foo;
        function test(api, msg) {
            AtlasUnit.Assert.isTrue(!!api.FOO, msg + ": create.FOO");
            AtlasUnit.Assert.isFalse(!!api.Bar, msg + ": create.Bar");
            AtlasUnit.Assert.isTrue(!!api.bar, msg + ": create.bar");
            AtlasUnit.Assert.isFalse(!!api.Baz, msg + ": create.Baz");
            AtlasUnit.Assert.isTrue(!!api.baz, msg + ": create.baz");
        }
        test(Sys.ElementSet.prototype, "Sys.ElementSet.prototype");
        test(jQuery.fn, "jQuery.fn");
        AtlasUnit.Assert.areEqual(foo, Sys.components.FOO.script, "components.FOO.script");
        AtlasUnit.Assert.areEqual(foo, Sys.components.bar.script, "components.bar.script");
        AtlasUnit.Assert.areEqual(foo, Sys.components.baz.script, "components.baz.script");
    }
    
    this.testRequire = function() {
        loader.defineScript( {name:'foo', releaseUrl: "http://full/foo.js" } );
        var scripts = null, context;
        Sys.require(Sys.scripts.foo, function(s, c) {
            scripts = s;
            context = c;
        }, 88);
        AtlasUnit.Assert.areEqual("http://full/foo.js", src);
        AtlasUnit.Assert.isNull(scripts, "Callback should not be called until script has loaded.");
        callback(); // script loaded
        AtlasUnit.Assert.areEqual(Sys.scripts.foo, scripts);
        AtlasUnit.Assert.areEqual(88, context);
        scripts = null;
        src = null;
        // loading the same script should be immediate since it has already loaded
        this.verifyLoadsImmediately("foo");
    }
    
    this.testRequireUsesTwoPassMode = function() {
        loader.defineScript( {name:'foo', releaseUrl: "http://full/foo.js" } );
        var scripts = null, context;
        AtlasUnit.Assert.isFalse(Sys.Application.get_isCreatingComponents());
        Sys.require(Sys.scripts.foo, function(s, c) {
            AtlasUnit.Assert.isTrue(Sys.Application.get_isCreatingComponents());
        });
        AtlasUnit.Assert.isFalse(Sys.Application.get_isCreatingComponents());
        callback(); // script loaded
    }    
    
    this.testRequireFuzz = function() {
        var done = false;
        function callback() {
            done = true;
        }
        function verify(msg) {
            AtlasUnit.Assert.isTrue(done, msg);
            done = false;
        }
        Sys.require(null, callback);
        verify("<null>");
        Sys.require("", callback);
        verify("<empty>");
        Sys.require(0, callback);
        verify("<0>");
        Sys.require(undefined, callback);
        verify("<undefined>");
        Sys.require([""], callback);
        verify("[empty]");
        Sys.require([null], callback);
        verify("[null]");
        Sys.require([undefined], callback);
        verify("[undefined]");
        Sys.require([0], callback);
        verify("[0]");
        Sys.require({}, callback);
        verify("{}");
    }
    
    this.testLoadScripts = function() {
        var done = false;
        Sys.loadScripts(["http://foo/a.js", "http://foo/b.js"], function(scripts, ctx) {
            AtlasUnit.Assert.isFalse(done);
            AtlasUnit.Assert.areEqual(88, ctx);
            done = true;
        }, 88);
        AtlasUnit.Assert.areEqual("http://foo/a.js", src);
        AtlasUnit.Assert.isFalse(done);
        callback();
        AtlasUnit.Assert.areEqual("http://foo/b.js", src);
        AtlasUnit.Assert.isFalse(done);
        callback();
        AtlasUnit.Assert.isTrue(done);
        // no callback
        Sys.loadScripts(["http://foo/c.js"]);
        AtlasUnit.Assert.areEqual("http://foo/c.js", src);
        callback();
    }
    
    this.testRequireWithExecutionCallbackAndNoDependencies = function() {
        loader.defineScript( {name:'foo', releaseUrl: "http://full/foo.js" } );
        var scripts = null, context;
        Sys.require(Sys.scripts.foo, function(s, c) {
            scripts = s;
            context = c;
        }, 88);
        // script contains a registerScript call
        var foo = false;
        loader.registerScript("foo", null, function() {
            foo = true;
        });
        AtlasUnit.Assert.isTrue(foo, "Execution callback should be called immediately since there are no dependencies.");
        AtlasUnit.Assert.isNull(scripts, "Script is still executing, require() callback should not yet be called.");
        callback(); // script loaded
        AtlasUnit.Assert.areEqual(Sys.scripts.foo, scripts);
        AtlasUnit.Assert.areEqual(88, context);
    } 
    
    this.testRequireWithCodependency = function() {
        loader.defineScript( {name:'foo', releaseUrl: "http://full/foo.js", executionDependencies: ["bar"] } );
        loader.defineScript( {name:'bar', releaseUrl: "http://full/bar.js" } );
        var scripts = null;
        Sys.require(Sys.scripts.foo, function(s, c) {
            AtlasUnit.Assert.isNull(scripts, "Callback should only be raised once.");
            scripts = s;
        });
        AtlasUnit.Assert.areEqual(2, srcs.length);
        AtlasUnit.Assert.areEqual("http://full/bar.js", srcs[0]);
        AtlasUnit.Assert.areEqual("http://full/foo.js", srcs[1]);
        // simulate bar loads, then foo (in order)
        var bar = false, foo = false;
        once = false;
        loader.registerScript("bar", null, function() {
            AtlasUnit.Assert.isFalse(bar, "bar's execution callback should only be called once.");
            bar = true;
        });
        callbacks[0]();
        AtlasUnit.Assert.isNull(scripts, "bar loaded, still waiting for foo.");
        AtlasUnit.Assert.isTrue(bar, "bar should execute as all its co/dependencies have loaded.");
        loader.registerScript("foo", null, function() {
            AtlasUnit.Assert.isFalse(foo, "foo's execution callback should only be called once.");
            foo = true;
        });
        callbacks[1]();
        AtlasUnit.Assert.isTrue(foo, "foo should execute as all its co/dependencies have loaded.");
        AtlasUnit.Assert.areEqual(Sys.scripts.foo, scripts, "Both loaded, time to raise the callback.");
    }        

    this.testRequireWithCodependencyLoadsLast = function() {
        loader.defineScript( {name:'foo', releaseUrl: "http://full/foo.js", executionDependencies: ["bar"] } );
        loader.defineScript( {name:'bar', releaseUrl: "http://full/bar.js" } );
        var scripts = null;
        Sys.require(Sys.scripts.foo, function(s, c) {
            AtlasUnit.Assert.isNull(scripts, "Callback should only be raised once.");
            scripts = s;
        });
        AtlasUnit.Assert.areEqual(2, srcs.length);
        AtlasUnit.Assert.areEqual("http://full/bar.js", srcs[0]);
        AtlasUnit.Assert.areEqual("http://full/foo.js", srcs[1]);
        // simulate foo loads, then bar
        var bar = false, foo = false;
        loader.registerScript("foo", null, function() {
            AtlasUnit.Assert.isFalse(foo, "foo's execution callback should only be called once.");
            foo = true;
        });
        callbacks[1]();
        AtlasUnit.Assert.isNull(scripts, "bar loaded, still waiting for foo.");
        AtlasUnit.Assert.isFalse(foo, "foo should not yet execute as not all its co/dependencies have loaded.");
        loader.registerScript("bar", null, function() {
            AtlasUnit.Assert.isFalse(bar, "bar's execution callback should only be called once.");
            bar = true;
        });
        callbacks[0]();
        AtlasUnit.Assert.isTrue(foo, "foo should execute as all its co/dependencies have loaded.");
        AtlasUnit.Assert.isTrue(foo, "barshould execute as all its co/dependencies have loaded.");
        AtlasUnit.Assert.areEqual(Sys.scripts.foo, scripts, "Both loaded, time to raise the callback.");
    }        
    
    this.testRequireComponent = function() {
        loader.defineScript( {name:'foo', releaseUrl: "http://full/foo.js", components: ["bar"] } );
        var scripts = null, context;
        Sys.require(Sys.components.bar, function(s, c) {
            scripts = s;
            context = c;
        }, 88);
        AtlasUnit.Assert.areEqual("http://full/foo.js", src);
        callback(); // script loaded
        AtlasUnit.Assert.areEqual(Sys.components.bar, scripts);
        AtlasUnit.Assert.areEqual(88, context);
        scripts = null;
        src = null;
        // loading the same script should be immediate since it has already loaded
        this.verifyLoadsImmediately("bar");
    }
    
    this.testRequireComponentParentScriptChangedDuringLoading = function() {
        loader.defineScript( {name:'foo', releaseUrl: "http://full/foo.js", components: ["foo", "bar"] } );
        var scripts = null, context;
        var toLoad = [Sys.components.foo, Sys.components.bar];
        Sys.require(toLoad, function(s, c) {
            scripts = s;
            context = c;
        }, 88);
        AtlasUnit.Assert.areEqual("http://full/foo.js", src);
        src = null;
        // simulate the loaded script re-registering the 'bar' type to say it lives in a different, unloaded script.
        // for completeness, we also throw in a component which successfully loads as usual the first time (foo).
        loader.defineScript( {name:'bar', releaseUrl: "http://full/bar.js", components: ["bar"] } );
        callback(); // script loaded
        // since the script we thought bar was has loaded but is now defined as being in a different unloaded script,
        // we should now be loading that script and should not have raised the callback yet.
        AtlasUnit.Assert.isNull(scripts, "Should not have loaded yet.");
        AtlasUnit.Assert.areEqual("http://full/bar.js", src);
        // just for completeness, now pretend that when bar loads it shuffles the bar type around _again_
        loader.defineScript( {name:'baz', releaseUrl: "http://full/baz.js", components: ["bar"] } );
        callback(); // script loaded
        AtlasUnit.Assert.isNull(scripts);
        AtlasUnit.Assert.areEqual("http://full/baz.js", src);
        // now allow the the component to be considered loaded
        callback(); // script loaded
        AtlasUnit.Assert.areEqual(toLoad, scripts);
        AtlasUnit.Assert.areEqual(88, context);
        scripts = null;
        src = null;
        // loading the same script should be immediate since it has already loaded
        this.verifyLoadsImmediately(Sys.components.bar);
    }    
    
    this.testLoaderRelativePath = function() {
        loader.defineScript({ name: "foo", releaseUrl: "%/foo.js" });
        Sys.require(Sys.scripts.foo);
        AtlasUnit.Assert.areEqual("http://basepath/scripts/foo.js", src);
    }
}
Sys.Test.LoaderTest.registerClass("Sys.Test.LoaderTest");
Sys.Test.LoaderTest["AtlasUnit.IsTestFixture"] = true;
