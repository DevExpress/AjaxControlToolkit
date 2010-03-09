/// <reference name="MicrosoftAjax.js" />
Type.registerNamespace("Sys.Test");

Sys.Test.LoaderCompositeTest = function() {
    var loader = Sys.loader,
        src, callback,
        srcs, callbacks;
    var old;
    
    this.setUp = function() {
        script = null;
        Sys.oldCombine = Sys.combine;
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
        Sys.combine = Sys.oldCombine;
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
        loader.defineScripts(null,
            [{ name: "foo", releaseUrl: "foo.js" },
            { name: "bar", releaseUrl: "bar.js" },
            { name: "foobar", contains: ["foo", "bar"]}]);
        AtlasUnit.Assert.isTrue(!!Sys.composites.foobar);
        AtlasUnit.Assert.areEqual("foobar", Sys.composites.foobar.name);
    }
    
    this.testRequireTrivial = function() {
        loader.defineScripts(null,
            [{ name: "foo", releaseUrl: "foo.js" },
            { name: "bar", releaseUrl: "bar.js" },
            { name: "foobar", releaseUrl: "foobar.js", contains: ["foo", "bar"]}]);
        var scripts = null;
        Sys.require(["foo", "bar"], function(s) {
            AtlasUnit.Assert.isNull(scripts, "Callback should only be called once.");
            scripts = s;
        });
        AtlasUnit.Assert.areEqual("foobar.js", src);
        AtlasUnit.Assert.areEqual(1, srcs.length, "Only the composite should be requested.");
        AtlasUnit.Assert.isNull(scripts);
        callback();
        AtlasUnit.Assert.isNotNull(scripts);
        this.verifyLoadsImmediately("foo");
        this.verifyLoadsImmediately("bar");
        this.verifyLoadsImmediately(["foo", "bar"]);
    }
    
    this.testRequireChainedDependencies = function() {
        loader.defineScripts(null,
            [{ name: "foo", releaseUrl: "foo.js", dependencies: ["bar"] },
            { name: "middle", releaseUrl: "middle.js", dependencies: ["bar"], isLoaded: true },
            { name: "bar", releaseUrl: "bar.js" },
            { name: "foobar", releaseUrl: "foobar.js", contains: ["foo", "bar"]}]);
        var scripts = null;
        Sys.require(["foo"], function(s) {
            AtlasUnit.Assert.isNull(scripts, "Callback should only be called once.");
            scripts = s;
        });
        AtlasUnit.Assert.areEqual("foobar.js", src);
        AtlasUnit.Assert.areEqual(1, srcs.length, "Only the composite should be requested.");
        AtlasUnit.Assert.isNull(scripts);
        callback();
        AtlasUnit.Assert.isNotNull(scripts);
        this.verifyLoadsImmediately("foo");
        this.verifyLoadsImmediately("bar");
        this.verifyLoadsImmediately(["foo", "bar"]);
    }    
    
    this.testRequireWithInternalDependencies = function() {
        // foo depends on bar, but they are in the same composite
        // bar has a executionDependency on baz, also in the composite
        loader.defineScripts(null,
            [{ name: "foo", releaseUrl: "foo.js", dependencies: ["bar"] },
            { name: "bar", releaseUrl: "bar.js", executionDependencies: ["baz"] },
            { name: "baz", releaseUrl: "baz.js" },
            { name: "foobarbaz", releaseUrl: "foobarbaz.js", contains: ["foo", "bar", "baz"]}]);
        var scripts = null;
        // bar should be implied since foo depends on it
        // baz should be implied since bar codepends on it
        Sys.require(["foo"], function(s) {
            AtlasUnit.Assert.isNull(scripts, "Callback should only be called once.");
            scripts = s;
        });
        AtlasUnit.Assert.areEqual("foobarbaz.js", src);
        AtlasUnit.Assert.areEqual(1, srcs.length, "Only the composite should be requested.");
        AtlasUnit.Assert.isNull(scripts);
        callback();
        AtlasUnit.Assert.isNotNull(scripts);
        this.verifyLoadsImmediately("foo");
        this.verifyLoadsImmediately("bar");
        this.verifyLoadsImmediately("baz");
        this.verifyLoadsImmediately(["foo", "bar"]);
        this.verifyLoadsImmediately(["foo", "bar", "baz"]);
    }      
    
    this.testRequireWithExternalDependencies = function() {
        // foo depends on bar, but they are in the same composite
        // bar has a executionDependency on baz, NOT in the composite
        // bar also has dependency on jaz, NOT in the composite
        loader.defineScripts(null,
            [{ name: "foo", releaseUrl: "foo.js", dependencies: ["bar"] },
            { name: "bar", releaseUrl: "bar.js", executionDependencies: ["baz"], dependencies: ["jaz"] },
            { name: "baz", releaseUrl: "baz.js" },
            { name: "jaz", releaseUrl: "jaz.js" },
            { name: "foobar", releaseUrl: "foobar.js", contains: ["foo", "bar"]}]);
        var scripts = null;
        Sys.require("foo", function(s) {
            AtlasUnit.Assert.isNull(scripts, "Callback should only be called once.");
            scripts = s;
        });
        // the composite should first start loading its dependency, jaz, and executionDependency, baz
        AtlasUnit.Assert.areEqual(2, srcs.length, "Expecting baz and jaz.");
        AtlasUnit.Assert.areEqual("jaz.js", srcs[0]);
        AtlasUnit.Assert.areEqual("baz.js", srcs[1]);
        AtlasUnit.Assert.isNull(scripts);
        srcs = [];
        callbacks[0](); // jaz
        callbacks[1](); // baz
        // next the composite can load
        AtlasUnit.Assert.areEqual(1, srcs.length);
        AtlasUnit.Assert.areEqual("foobar.js", src);
        AtlasUnit.Assert.isNull(scripts, "Composite not yet loaded.");
        callback();
        AtlasUnit.Assert.areEqual("foo", scripts, "Composite has now loaded.");
        this.verifyLoadsImmediately("foo");
        this.verifyLoadsImmediately("bar");
        this.verifyLoadsImmediately("baz");
        this.verifyLoadsImmediately("jaz");
        this.verifyLoadsImmediately(["foo", "bar", "baz", "jaz"]);
    }   
    
    this.testRequireWithExternalDependencyOnAnotherComposite = function() {
        // foo depends on bar, but they are in the same composite
        // bar has a executionDependency on baz, NOT in the composite
        // bar also has dependency on jaz, NOT in the composite
        // bar and jaz are in their own separate composite
        loader.defineScripts(null,
            [{ name: "foo", releaseUrl: "foo.js", dependencies: ["bar"] },
            { name: "bar", releaseUrl: "bar.js", executionDependencies: ["baz"], dependencies: ["jaz"] },
            { name: "baz", releaseUrl: "baz.js" },
            { name: "jaz", releaseUrl: "jaz.js" },
            { name: "foobar", releaseUrl: "foobar.js", contains: ["foo", "bar"]},
            { name: "bazjaz", releaseUrl: "bazjaz.js", contains: ["baz", "jaz"]}]);
        var scripts = null;
        Sys.require("foo", function(s) {
            AtlasUnit.Assert.isNull(scripts, "Callback should only be called once.");
            scripts = s;
        });
        // the composite should first start loading its dependency, bazjaz
        AtlasUnit.Assert.areEqual(1, srcs.length, "Expecting baz and jaz composite.");
        AtlasUnit.Assert.areEqual("bazjaz.js", src);
        AtlasUnit.Assert.isNull(scripts);
        srcs = [];
        callback();
        // next, foobar.js
        AtlasUnit.Assert.areEqual(1, srcs.length);
        AtlasUnit.Assert.areEqual("foobar.js", src);
        AtlasUnit.Assert.isNull(scripts, "Composite not yet loaded.");
        callback();
        AtlasUnit.Assert.areEqual("foo", scripts, "Composite has now loaded.");
        this.verifyLoadsImmediately("foo");
        this.verifyLoadsImmediately("bar");
        this.verifyLoadsImmediately("baz");
        this.verifyLoadsImmediately("jaz");
        this.verifyLoadsImmediately(["foo", "bar", "baz", "jaz"]);
    }
    
    this.testRequireWithExternalExecutionDependencyOnAnotherComposite = function() {
        // foo depends on bar, but they are in the same composite
        // bar has a executionDependency on baz, NOT in the composite
        // bar and jaz are in their own separate composite
        // jaz is also loaded to enable use of 2nd composite
        loader.defineScripts(null,
            [{ name: "foo", releaseUrl: "foo.js", dependencies: ["bar"] },
            { name: "bar", releaseUrl: "bar.js", executionDependencies: ["baz"] },
            { name: "baz", releaseUrl: "baz.js" },
            { name: "jaz", releaseUrl: "jaz.js" },
            { name: "foobar", releaseUrl: "foobar.js", contains: ["foo", "bar"]},
            { name: "bazjaz", releaseUrl: "bazjaz.js", contains: ["baz", "jaz"]}]);
        var scripts = null;
        Sys.require(["foo", "jaz"], function(s) {
            AtlasUnit.Assert.isNull(scripts, "Callback should only be called once.");
            scripts = s;
        });
        // foobar and bazjaz can load at the same time
        AtlasUnit.Assert.areEqual(2, srcs.length);
        AtlasUnit.Assert.areEqual("bazjaz.js", srcs[0]);
        AtlasUnit.Assert.areEqual("foobar.js", srcs[1]);
        AtlasUnit.Assert.isNull(scripts);
        srcs = [];
        callbacks[0]();
        callbacks[1]();
        AtlasUnit.Assert.isNotNull(scripts, "Composite has now loaded.");
        this.verifyLoadsImmediately("foo");
        this.verifyLoadsImmediately("bar");
        this.verifyLoadsImmediately("baz");
        this.verifyLoadsImmediately("jaz");
        this.verifyLoadsImmediately(["foo", "bar", "baz", "jaz"]);
    }       
               
    
    this.testBestChoice = function() {
        // one composite of 3 scripts, where each one is part of a different composite of 2 scripts.
        // verify that the 3 smaller composites are used in place of the larger one since more http requests
        // are saved that way (3 vs 2)
        loader.defineScripts(null, [
            { name: "foo1", releaseUrl: "foo1.js" },
            { name: "foo2", releaseUrl: "foo2.js" },
            { name: "foo3", releaseUrl: "foo3.js" },
            { name: "foo4", releaseUrl: "foo4.js" },
            { name: "foo5", releaseUrl: "foo5.js" },
            { name: "foo6", releaseUrl: "foo6.js" },
            { name: "foo12", releaseUrl: "foo12.js", contains: ["foo1", "foo2"] },
            { name: "foo34", releaseUrl: "foo34.js", contains: ["foo3", "foo4"] },
            { name: "foo56", releaseUrl: "foo56.js", contains: ["foo5", "foo6"] },
            { name: "foo234", releaseUrl: "foo234.js", contains: ["foo2", "foo3", "foo4"] }
        ]);
        Sys.require(["foo1", "foo2", "foo3", "foo4", "foo5", "foo6"]);
        AtlasUnit.Assert.areEqual(3, srcs.length);
        AtlasUnit.Assert.areEqual(srcs[0], "foo12.js");
        AtlasUnit.Assert.areEqual(srcs[1], "foo34.js");
        AtlasUnit.Assert.areEqual(srcs[2], "foo56.js");
    }
    
    this.testWithSingleton = function() {
        // test using a composite and a regular script in one require
        loader.defineScripts(null, [
            { name: "foo1", releaseUrl: "foo1.js" },
            { name: "foo2", releaseUrl: "foo2.js" },
            { name: "bar", releaseUrl: "bar.js" },
            { name: "foo12", releaseUrl: "foo12.js", contains: ["foo1", "foo2"] }
        ]);
        Sys.require(["foo1", "foo2", "bar"]);
        AtlasUnit.Assert.areEqual(2, srcs.length);
        AtlasUnit.Assert.areEqual(srcs[0], "foo12.js");
        AtlasUnit.Assert.areEqual(srcs[1], "bar.js");
    }
    
    this.testWithExtraContains = function() {
        // composite isn't used unless all of its scripts are needed
        loader.defineScripts(null, [
            { name: "foo", releaseUrl: "foo.js" },
            { name: "bar", releaseUrl: "bar.js" },
            { name: "extra", releaseUrl: "extra.js" },
            { name: "foobarextra", releaseUrl: "foobarextra.js", contains: ["foo", "bar", "extra"] }
        ]);
        Sys.require(["foo", "bar"]);
        AtlasUnit.Assert.areEqual(2, srcs.length);
        AtlasUnit.Assert.areEqual(srcs[0], "foo.js");
        AtlasUnit.Assert.areEqual(srcs[1], "bar.js");
    }    
    
    this.testWithAlreadyLoadedContains = function() {
        // composite isn't used unless all of its scripts are needed
        loader.defineScripts(null, [
            { name: "foo", releaseUrl: "foo.js" },
            { name: "bar", releaseUrl: "bar.js" },
            { name: "loaded", releaseUrl: "loaded.js" },
            { name: "foobarloaded", releaseUrl: "foobarloaded.js", contains: ["foo", "bar", "loaded"] }
        ]);
        Sys.require("loaded");
        AtlasUnit.Assert.areEqual(1, srcs.length);
        AtlasUnit.Assert.areEqual("loaded.js", src);
        callback();
        srcs = [];
        Sys.require(["foo", "bar", "loaded"]);
        AtlasUnit.Assert.areEqual(2, srcs.length);
        AtlasUnit.Assert.areEqual(srcs[0], "foo.js");
        AtlasUnit.Assert.areEqual(srcs[1], "bar.js");
    }    
    
    
    this.testWithMultipleSelectedComposites = function() {
        // test having two composites selected at the same time
        loader.defineScripts(null, [
            { name: "foo1", releaseUrl: "foo1.js" },
            { name: "foo2", releaseUrl: "foo2.js" },
            { name: "bar1", releaseUrl: "bar1.js" },
            { name: "bar2", releaseUrl: "bar2.js" },
            { name: "foo12", releaseUrl: "foo12.js", contains: ["foo1", "foo2"] },
            { name: "bar12", releaseUrl: "bar12.js", contains: ["bar1", "bar2"] }
        ]);
        Sys.require(["foo1", "bar1", "foo2", "bar2"]);
        AtlasUnit.Assert.areEqual(2, srcs.length);
        AtlasUnit.Assert.areEqual(srcs[0], "foo12.js");
        AtlasUnit.Assert.areEqual(srcs[1], "bar12.js");
    }    
        
}
Sys.Test.LoaderCompositeTest.registerClass("Sys.Test.LoaderCompositeTest");
Sys.Test.LoaderCompositeTest["AtlasUnit.IsTestFixture"] = true;
