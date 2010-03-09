/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.Test");

Sys.Test.ApplicationTest = function() {
    // ****************************************************************************
    // Infrastructure tests (subscription to the window events, disposing logic)
    this.setUp = function() {
        Sys._ready = false;
    }
    this.tearDown = function() {
        Sys._ready = true;
    }

    // Not using setup because not all unit tests here need to check the application
    // correctly subscribes to the window events.
    this.customSetUp = function() {
        // tests that require this customsetup are debug only, since the mockup relies on variable names
        // that are crunched in release mode.
        function mockDomReady() {
        }

        // Temporarily replace the application constructor with a closure that mocks the window object.
        var ctor = Sys._Application;
        var window = this.window = new Sys.Test.ApplicationTest.WindowMock();
        var mockApplication;
        var ctorCode = ctor.toString();
        var openingBrace = ctorCode.indexOf('{');
        var isBrowser = Sys._isBrowser; // global used by application code
        eval("mockApplication = function() " + ctorCode.substr(openingBrace).replace(/this\.\_domReady\(\)/g, "mockDomReady()"));
        var ctorCopy = mockApplication;
        for (var expando in ctor) {
            mockApplication[expando] = ctor[expando];
        }
        mockApplication.prototype = Sys._Application.prototype;
        mockApplication.prototype.constructor = ctorCopy;
        mockApplication.prototype._isMock = true;

        // Substitute the add and remove handler functions with equivalents that don't throw with non-elements:
        this._addHandler = Sys.UI.DomEvent.addHandler;
        Sys.UI.DomEvent.addHandler = function(element, eventName, handler) {
            if (!handler._browserHandler) {
                handler._browserHandler = function(e) {
                    handler.call(element, new Sys.UI.DomEvent(e));
                }
            }
            element.addEventListener(eventName, handler._browserHandler, false);
        }
        this._removeHandler = Sys.UI.DomEvent.removeHandler;
        Sys.UI.DomEvent.removeHandler = function(element, eventName, handler) {
            element.removeEventListener(eventName, handler._browserHandler, false);
        }

        // Setup the mock application
        this.application = new mockApplication();

        // Re-evaluate all functions in case they reference the 'real' window.
        for (var fn in Sys._Application.prototype) {
            if ((typeof (Sys._Application.prototype[fn]) === "function") && (fn !== 'constructor')) {
                eval("this.application." + fn + " = " + Sys._Application.prototype[fn].toString());
            }
        }

        // there are private fields set directly on Sys.Application by history.
        this.application._appLoadHandler = null;
        this.application._beginRequestHandler = null;
        this.application._clientId = null;
        this.application._currentEntry = '';
        this.application._endRequestHandler = null;
        this.application._history = null;
        this.application._enableHistory = false;
        this.application._historyEnabledInScriptManager = false;
        this.application._historyFrame = null;
        this.application._historyInitialized = false;
        this.application._historyInitialLength = 0;
        this.application._historyLength = 0;
        this.application._historyPointIsNew = false;
        this.application._ignoreTimer = false;
        this.application._initialState = null;
        this.application._state = {};
        this.application._timerCookie = 0;
        this.application._timerHandler = null;
        this.application._uniqueId = null;

        this.application.oldSetState = this.application._setState;
        this.application._setState = function(v) {
            this.oldSetState(v);
            window.location.href = "foo.aspx#" + window.location.hash;
        }

        // Do not let this mock application be disposed of by the real one:
        Sys.Application.unregisterDisposableObject(this.application);
    }

    this.customTearDown = function() {
        Sys.UI.DomEvent.addHandler = this._addHandler;
        Sys.UI.DomEvent.removeHandler = this._removeHandler;
    }

    this.testInitLoad = function() {
        // Function.toString() is broken in Safari (webkit bug 11609), which prevents this test from working.
        if (Sys.Browser.agent === Sys.Browser.Safari) return;
        this.customSetUp();
        var log = '';
        var app = this.application;
        var realApp = Sys.Application;
        Sys.Application = app;

        var oldLoad = window.pageLoad;

        function load(sender, args) {
            AtlasUnit.Assert.areEqual(app, sender);
            log += 'loaded ';
            var components = args.get_components();
            for (var i = 0, l = components.length; i < l; i++) {
                log += components[i].get_id() + ' ';
            }
        }

        function init(sender, args) {
            AtlasUnit.Assert.areEqual(app, sender);
            log += 'init ';
        }

        this.window.pageLoad = function(sender, args) {
            log += 'pageLoad ';
            var components = args.get_components();
            for (var i = 0, l = components.length; i < l; i++) {
                log += components[i].get_id() + ' ';
            }
        }

        try {
            app.add_load(load);
            app.add_init(init);
            app.beginCreateComponents();
            $create(Sys.Test.ApplicationTest.Component, { id: "comp1" });
            app.endCreateComponents();
            // After handlers have been added, but before the app initialized, the log is empty
            AtlasUnit.Assert.areEqual('', log);
            app.initialize();

            // The log should have been filled by the handlers
            AtlasUnit.Assert.areEqual('init loaded comp1 pageLoad comp1 ', log);
            log = '';
            // Any handlers added after initialization should be called immediately
            app.add_load(load);
            AtlasUnit.Assert.areEqual('', log);
            app.remove_load(load);

            app.add_init(init);
            AtlasUnit.Assert.areEqual('init ', log);

            app.beginCreateComponents();
            $create(Sys.Test.ApplicationTest.Component, { id: "comp2" });
            $create(Sys.Test.ApplicationTest.Component, { id: "comp3" });
            app.endCreateComponents();
            app.raiseLoad();
            AtlasUnit.Assert.areEqual('init loaded comp2 comp3 pageLoad comp2 comp3 ', log);
        }
        catch (e) {
            throw e;
        }
        finally {
            Sys.Application = realApp;
            window.pageLoad = oldLoad;
            this.customTearDown();
        }
    }
    this.testInitLoad["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testUnload = function() {
        // Function.toString() is broken in Safari (webkit bug 11609), which prevents this test from working.
        if (Sys.Browser.agent === Sys.Browser.Safari) return;
        this.customSetUp();
        var log = '';
        var app = this.application;

        function unload(sender, args) {
            AtlasUnit.Assert.areEqual(app, sender);
            log += 'unloaded ';
        }

        this.window.pageUnload = function(sender, args) {
            log += 'pageUnload ';
        }

        AtlasUnit.Assert.isFalse(app.get_isDisposing());
        try {
            app.add_unload(unload);
            AtlasUnit.Assert.areEqual('', log);
            this.window.raiseUnload();
            AtlasUnit.Assert.areEqual('pageUnload unloaded ', log);
            AtlasUnit.Assert.isTrue(app.get_isDisposing());
        }
        catch (e) {
            throw e;
        }
        finally {
            this.customTearDown();
        }
    }
    this.testUnload["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testDispose = function() {
        // Function.toString() is broken in Safari (webkit bug 11609), which prevents this test from working.
        if (Sys.Browser.agent === Sys.Browser.Safari) return;
        this.customSetUp();
        var app = this.application;
        Sys.Application.unregisterDisposableObject(app);

        var disp1 = new Sys.Test.ApplicationTest.Disposable();
        var disp2 = new Sys.Test.ApplicationTest.Disposable();
        var disp3 = new Sys.Test.ApplicationTest.Disposable();
        var disp4 = new Sys.Test.ApplicationTest.Disposable();
        var disp5 = new Sys.Test.ApplicationTest.Disposable();
        app.registerDisposableObject(disp1);
        app.registerDisposableObject(disp2);
        app.registerDisposableObject(disp3);
        app.registerDisposableObject(disp4);
        app.registerDisposableObject(disp5);
        app.unregisterDisposableObject(disp2);
        // simulate an array prototype extension that shouldnt trip up
        // the app's enumeration of the array.
        app._disposableObjects["hi"] = {};
        disp3.dispose();
        disp5.dispose();

        var log = '';
        function unload(sender, args) {
            AtlasUnit.Assert.areEqual(app, sender);
            log += 'unloaded ';
        }
        function dispose(sender, args) {
            AtlasUnit.Assert.areEqual(app, sender);
            log += 'disposed ';
        }
        app.add_unload(unload);
        app.add_disposing(dispose);

        AtlasUnit.Assert.areEqual('', log);
        app.dispose();
        AtlasUnit.Assert.areEqual('unloaded disposed ', log);
        AtlasUnit.Assert.isTrue(disp1.get_isDisposed(), "disp1");
        AtlasUnit.Assert.isFalse(disp2.get_isDisposed(), "disp2");
        AtlasUnit.Assert.isTrue(disp3.get_isDisposed(), "disp3");
        AtlasUnit.Assert.isTrue(disp4.get_isDisposed(), "disp4");
        AtlasUnit.Assert.isTrue(disp5.get_isDisposed(), "disp5");

        app._disposing = false;
        app._disposableObjects = [];
        app._deleteCount = 0;
        // create and dispose of enough objects to trigger rebuilding the array
        // first create twice as many as we need
        var i, objs = [];
        for (i = 0; i < 2000; i++) {
            disp1 = new Sys.Test.ApplicationTest.Disposable();
            objs.push(disp1);
            app.registerDisposableObject(disp1);
        }
        // now dispose of every other one
        for (i = 0; i < 2000; i+=2) {
            disp1 = objs[i];
            app.unregisterDisposableObject(disp1);
        }
        // array has not yet been rebuilt
        AtlasUnit.Assert.areEqual(1000, app._deleteCount);
        AtlasUnit.Assert.isTrue(typeof(app._disposableObjects[0]) === "undefined");
        AtlasUnit.Assert.isTrue(typeof(app._disposableObjects[1]) !== "undefined");
        // now dispose of that last one which makes it rebuild
        app.unregisterDisposableObject(app._disposableObjects[1]);
        // should have 999 items left and they should be have their indexes set accordingly
        AtlasUnit.Assert.areEqual(0, app._deleteCount);
        AtlasUnit.Assert.areEqual(999, app._disposableObjects.length);
        AtlasUnit.Assert.areEqual(0, app._disposableObjects[0].__msdisposeindex);
        AtlasUnit.Assert.areEqual(1, app._disposableObjects[1].__msdisposeindex);
        AtlasUnit.Assert.areEqual(2, app._disposableObjects[2].__msdisposeindex);
        AtlasUnit.Assert.areEqual(512, app._disposableObjects[512].__msdisposeindex);
        this.customTearDown();
    }
    this.testDispose["AtlasUnit.Categories"] = ["DebugOnly"];

    // ****************************************************************************
    // Other application behavior tests

    this.testEnableHistory = function() {
        // Function.toString() is broken in Safari (webkit bug 11609), which prevents this test from working.
        if (Sys.Browser.agent === Sys.Browser.Safari) return;
        this.customSetUp();
        var app = this.application;
        var isEnabled = false;

        // test default value.
        isEnabled = app.get_enableHistory();
        AtlasUnit.Assert.areEqual(false, isEnabled);

        // test enableHistory(true) when
        app.set_enableHistory(true);
        isEnabled = app.get_enableHistory();
        AtlasUnit.Assert.areEqual(true, isEnabled);

        // test enableHistory(false) 
        app.set_enableHistory(false);
        isEnabled = app.get_enableHistory();
        AtlasUnit.Assert.areEqual(false, isEnabled);

        // test state string when history is enabled
        app.set_enableHistory(true);
        var entry = 'test=1';
        app._historyPointIsNew = true;
        app._setState(entry);
        var currentEntry = app.get_stateString();
        AtlasUnit.Assert.areEqual('test=1', currentEntry);

        // test state string when history is disabled
        app.set_enableHistory(false);
        entry = 'test2=2';
        app._historyPointIsNew = true;
        app._setState(entry);
        currentEntry = app.get_stateString();
        AtlasUnit.Assert.areEqual('test=1', currentEntry);

        this.customTearDown();
    }
    this.testEnableHistory["AtlasUnit.Categories"] = ["DebugOnly"];

    // test calling addHistoryPoint when History is disabled. expected to throw.
    this.testCallAddHistoryPointWhenHistoryIsDisabled = function() {
        // Function.toString() is broken in Safari (webkit bug 11609), which prevents this test from working.
        if (Sys.Browser.agent === Sys.Browser.Safari) throw Error.invalidOperation("Safari not supported");
        var app = this.application;
        app.set_enableHistory(false);
        app.addHistoryPoint({ index2: "1", value2: "2" }, "addHistoryPoint");
    }
    this.testCallAddHistoryPointWhenHistoryIsDisabled["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException'
    };
    this.testCallAddHistoryPointWhenHistoryIsDisabled["AtlasUnit.Categories"] = ["DebugOnly"];

    // test disabling history when ScriptManager enabled it. expected to throw.
    this.testDisableHistoryWhenEnabledInScriptManager = function() {
        // Function.toString() is broken in Safari (webkit bug 11609), which prevents this test from working.
        if (Sys.Browser.agent === Sys.Browser.Safari) throw Error.invalidOperation("Safari not supported");
        var app = this.application;
        // we are calling this internal method to emulate script injection that occurs automatically
        // in prerender by the ScriptManager when history is enabled on the server side.
        app._enableHistoryInScriptManager();
        // we are checking how the previous call affects the public surface by calling a public API, this one is expected to throw.
        app.set_enableHistory(false);
    }
    this.testDisableHistoryWhenEnabledInScriptManager["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException'
    };
    this.testDisableHistoryWhenEnabledInScriptManager["AtlasUnit.Categories"] = ["DebugOnly"];

    // test enableHistory when app already initialized. expected to throw.
    this.testEnableHistoryAfterInit = function() {
        // Function.toString() is broken in Safari (webkit bug 11609), which prevents this test from working.
        if (Sys.Browser.agent === Sys.Browser.Safari) throw Error.invalidOperation("Safari not supported");
        var app = this.application;
        this.window.honorTimeoutCount = 1;
        app.initialize();
        app.set_enableHistory(true);
    }
    this.testEnableHistoryAfterInit["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException'
    };
    this.testEnableHistoryAfterInit["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testFindAlias = function() {
        AtlasUnit.Assert.areEqual(Sys.Application.findComponent, $find);
    }

    this.testFindComponentBehavior = function() {
        var elt = document.createElement('DIV');
        var behavior = new Sys.Test.ApplicationTest.Behavior(elt);
        var name = "Sys.Test.ApplicationTest.behavior1";
        behavior.set_name(name);
        AtlasUnit.Assert.isNull(Sys.Application.findComponent(name, elt));
        behavior.initialize();
        AtlasUnit.Assert.areEqual(behavior, Sys.Application.findComponent(name, elt));
        behavior.dispose();
    }

    this.testFindComponentControl = function() {
        var elt = document.createElement('DIV');
        var id = elt.id = "Sys.Test.ApplicationTest.control2";
        var control = new Sys.Test.ApplicationTest.Control(elt);
        AtlasUnit.Assert.isNull(Sys.Application.findComponent(id));
        Sys.Application.addComponent(control);
        AtlasUnit.Assert.areEqual(control, Sys.Application.findComponent(id));
        Sys.Application.removeComponent(control);
        control.dispose();
    }

    this.testFindComponentNested = function() {
        var container = new Sys.Test.ApplicationTest.Container(document.createElement('DIV'));
        var elt = document.createElement('DIV');
        var control = new Sys.Test.ApplicationTest.Control(elt);
        var id = elt.id = "Sys.Test.ApplicationTest.control1";
        AtlasUnit.Assert.isNull(Sys.Application.findComponent(id, container));
        container.addComponent(control);
        AtlasUnit.Assert.isNull(Sys.Application.findComponent(id));
        AtlasUnit.Assert.areEqual(control, Sys.Application.findComponent(id, container));
        container.dispose();
        control.dispose();
    }

    this.testAddComponent = function() {
        var c = new Sys.Test.ApplicationTest.Component();
        var id = "Sys.Test.ApplicationTest.component1";
        c.set_id(id);
        AtlasUnit.Assert.isNull(Sys.Application.findComponent(id));
        Sys.Application.addComponent(c);
        AtlasUnit.Assert.areEqual(c, Sys.Application.findComponent(id));
        AtlasUnit.Assert.isTrue(Array.contains(Sys.Application.getComponents(), c));
        Sys.Application.removeComponent(c);
        AtlasUnit.Assert.isNull(Sys.Application.findComponent(id));
        AtlasUnit.Assert.isFalse(Array.contains(Sys.Application.getComponents(), c));
    }

    this.testAddComponentWithoutId = function() {
        var c = new Sys.Test.ApplicationTest.Component();
        Sys.Application.addComponent(c);
    }
    this.testAddComponentWithoutId["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: Can't add a component that doesn't have an id."
    };
    this.testAddComponentWithoutId["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testAddTwoComponentWithSameId = function() {
        var c1 = new Sys.Test.ApplicationTest.Component();
        var id = "Sys.Test.ApplicationTest.component2";
        c1.set_id(id);
        Sys.Application.addComponent(c1);
        var c2 = new Sys.Test.ApplicationTest.Component();
        c2.set_id(id);
        Sys.Application.addComponent(c2);
    }
    this.testAddTwoComponentWithSameId["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: Two components with the same id 'Sys.Test.ApplicationTest.component2' can't be added to the application."
    };
    this.testAddTwoComponentWithSameId["AtlasUnit.Categories"] = ["DebugOnly"];
}
Sys.Test.ApplicationTest.registerClass("Sys.Test.ApplicationTest");
Sys.Test.ApplicationTest["AtlasUnit.IsTestFixture"] = true;

Sys.Test.ApplicationTest.WindowMock = function() {
    this._loadHandlers = [];
    this._unloadHandlers = [];
    this.location = {hash: '', href: 'foo.aspx'};
}
Sys.Test.ApplicationTest.WindowMock.prototype = {
    honorTimeoutCount: 9999,
    _emptyEvent: {
        srcElement: this,
        type: 'mocked',
        button: null,
        clientX: null,
        clientY: null
    },
    addEventListener: function(name, handler) {
        if (name === 'load') {
            this._loadHandlers[this._loadHandlers.length] = handler;
        }
        else if (name === 'unload') {
            this._unloadHandlers[this._unloadHandlers.length] = handler;
        }
    },
    removeEventListener: function(name, handler) {
    },
    raiseLoad: function() {
        for (var i = 0; i < this._loadHandlers.length; i++) {
            this._loadHandlers[i](this._emptyEvent);
        }
    },
    raiseUnload: function() {
        for (var i = 0; i < this._unloadHandlers.length; i++) {
            this._unloadHandlers[i](this._emptyEvent);
        }
    },
    setTimeout: function(delegate, ms) {
        // we dont want application delaying execution of the event handlers
        if (this.honorTimeoutCount-- > 0) {
            delegate();
        }
    }
}
Sys.Test.ApplicationTest.WindowMock.registerClass('Sys.Test.ApplicationTest.WindowMock');

Sys.Test.ApplicationTest.Component = function() {
    Sys.Test.ApplicationTest.Component.initializeBase(this);
}
Sys.Test.ApplicationTest.Component.registerClass('Sys.Test.ApplicationTest.Component', Sys.Component);

Sys.Test.ApplicationTest.Disposable = function() {}
Sys.Test.ApplicationTest.Disposable.prototype = {
    _disposed: false,
    get_isDisposed: function() {
        return this._disposed;
    },
    dispose: function() {
        this._disposed = true;
    }
}
Sys.Test.ApplicationTest.Disposable.registerClass('Sys.Test.ApplicationTest.Disposable', null, Sys.IDisposable);

Sys.Test.ApplicationTest.Container = function(element) {
    Sys.Test.ApplicationTest.Container.initializeBase(this, [element]);
    this._components = {};
}
Sys.Test.ApplicationTest.Container.prototype = {
    addComponent: function(component) {
        this._components[component.get_id()] = component;
    },
    findComponent: function(id) {
        return this._components[id] || null;
    }
}
Sys.Test.ApplicationTest.Container.registerClass('Sys.Test.ApplicationTest.Container', Sys.UI.Control, Sys.IContainer);

Sys.Test.ApplicationTest.Control = function(element) {Sys.Test.ApplicationTest.Control.initializeBase(this, [element]);}
Sys.Test.ApplicationTest.Control.registerClass('Sys.Test.ApplicationTest.Control', Sys.UI.Control);

Sys.Test.ApplicationTest.Behavior = function(element) {Sys.Test.ApplicationTest.Behavior.initializeBase(this, [element]);}
Sys.Test.ApplicationTest.Behavior.registerClass('Sys.Test.ApplicationTest.Behavior', Sys.UI.Behavior);

