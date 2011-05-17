$type = Sys._Application = function _Application() {
    /// <summary locid="M:J#Sys.Application.#ctor"></summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    Sys._Application.initializeBase(this);

    this._disposableObjects = [];
    this._components = {};
    this._createdComponents = [];
    this._secondPassComponents = [];

    // dispose the app in window.unload
    this._unloadHandlerDelegate = Function.createDelegate(this, this._unloadHandler);
    Sys.UI.DomEvent.addHandler(window, "unload", this._unloadHandlerDelegate);
}
$type.prototype = {
    _deleteCount: 0,

    get_isCreatingComponents: function _Application$get_isCreatingComponents() {
        /// <value type="Boolean" locid="P:J#Sys.Application.isCreatingComponents"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return !!this._creatingComponents;
    },
    get_isDisposing: function _Application$get_isDisposing() {
        /// <value type="Boolean" locid="P:J#Sys.Application.isDisposing"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return !!this._disposing;
    },
    add_init: function _Application$add_init(handler) {
        /// <summary locid="E:J#Sys.Application.init"></summary>
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        if (this._initialized) {
            handler(this, Sys.EventArgs.Empty);
        }
        else {
            this._addHandler("init", handler);
        }
    },
    remove_init: function _Application$remove_init(handler) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        this._removeHandler("init", handler);
    },
    add_load: function _Application$add_load(handler) {
        /// <summary locid="E:J#Sys.Application.load"></summary>
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        this._addHandler("load", handler);
    },
    remove_load: function _Application$remove_load(handler) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        this._removeHandler("load", handler);
    },
    add_unload: function _Application$add_unload(handler) {
        /// <summary locid="E:J#Sys.Application.unload"></summary>
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        this._addHandler("unload", handler);
    },
    remove_unload: function _Application$remove_unload(handler) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        this._removeHandler("unload", handler);
    },
    addComponent: function _Application$addComponent(component) {
        /// <summary locid="M:J#Sys.Application.addComponent">Adds a top-level component to the application.</summary>
        /// <param name="component" type="Sys.Component">The component to add.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "component", type: Sys.Component}
        ]);
        if (e) throw e;
        //#endif
        //#if DEBUG
        var id = component.get_id();
        if (!id) throw Error.invalidOperation(Sys.Res.cantAddWithoutId);
        if (typeof(this._components[id]) !== 'undefined') throw Error.invalidOperation(String.format(Sys.Res.appDuplicateComponent, id));
        this._components[id] = component;
        //#else
        this._components[component.get_id()] = component;
        //#endif
    },
    beginCreateComponents: function _Application$beginCreateComponents() {
        /// <summary locid="M:J#Sys.Application.beginCreateComponents"></summary>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        this._creatingComponents = true;
    },
    dispose: function _Application$dispose() {
        /// <summary locid="M:J#Sys.Application.dispose"></summary>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        if (!this._disposing) {
            this._disposing = true;
            if (this._timerCookie) {
                window.clearTimeout(this._timerCookie);
                delete this._timerCookie;
            }
            var endHandler = this._endRequestHandler;
            var beginHandler = this._beginRequestHandler;
            if (endHandler || beginHandler) {
                var prm = Sys.WebForms.PageRequestManager.getInstance();
                if (endHandler) prm.remove_endRequest(endHandler);
                if (beginHandler) prm.remove_beginRequest(beginHandler);
                delete this._endRequestHandler;
                delete this._beginRequestHandler;
            }
            if (window.pageUnload) {
                window.pageUnload(this, Sys.EventArgs.Empty);
            }
            Sys.Observer.raiseEvent(this, "unload");
            var disposableObjects = Array.clone(this._disposableObjects);
            for (var i = 0, l = disposableObjects.length; i < l; i++) {
                var object = disposableObjects[i];
                // some entries are undefined, but we keep the density such that no more than 1000 are.
                if (typeof(object) !== "undefined") {
                    object.dispose();
                }
            }
            this._disposableObjects.length = 0;

            Sys.UI.DomEvent.removeHandler(window, "unload", this._unloadHandlerDelegate);

            if (Sys._ScriptLoader) {
                var sl = Sys._ScriptLoader.getInstance();
                if (sl) {
                    sl.dispose();
                }
            }

            Sys._Application.callBaseMethod(this, 'dispose');
        }
    },
    disposeElement: function _Application$disposeElement(element, childNodesOnly) {
        /// <summary locid="M:J#Sys._Application.disposeElement">Disposes of control and behavior resources associated with an element and its child nodes.</summary>
        /// <param name="element">The element to dispose.</param>
        /// <param name="childNodesOnly" type="Boolean">Whether to dispose of the element and its child nodes or only its child nodes.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "element"},
            {name: "childNodesOnly", type: Boolean}
        ]);
        if (e) throw e;
        //#endif
        // note: cannot use domElement="true" for parameter because it fails for text nodes which we want to
        // allow here.
        if (element.nodeType === 1) {
            var d, c, i, list,
                allElements = element.getElementsByTagName("*"),
                length = allElements.length,
                children = new Array(length);
            // we must clone the array first as it is a reference to the actual live tree
            // and will change if disposed components modify the DOM
            // Also we cannot use Array.clone() because it is not actually a javascript array
            for (i = 0; i < length; i++) {
                children[i] = allElements[i];
            }
            for (i = length - 1; i >= 0; i--) {
                var child = children[i];
                // disposes of controls and behaviors attached to an element
                // logic adapted from PageRequestManager._destroyTree
                // This logic inlined because with a large number of DOM elements, the
                // overhead of calling a different method for each element adds up
                d = child.dispose;
                if (d && typeof(d) === "function") {
                    child.dispose();
                }
                else {
                    c = child.control;
                    if (c && typeof(c.dispose) === "function") {
                        c.dispose();
                    }
                }
                list = child._behaviors;
                if (list) {
                    this._disposeComponents(list);
                }
                list = child._components;
                if (list) {
                    this._disposeComponents(list);
                    child._components = null;
                }
            }
            if (!childNodesOnly) {
                d = element.dispose;
                if (d && typeof(d) === "function") {
                    element.dispose();
                }
                else {
                    c = element.control;
                    if (c && typeof(c.dispose) === "function") {
                        c.dispose();
                    }
                }
                list = element._behaviors;
                if (list) {
                    this._disposeComponents(list);
                }
                list = element._components;
                if (list) {
                    this._disposeComponents(list);
                    element._components = null;
                }
            }
        }
    },    
    endCreateComponents: function _Application$endCreateComponents() {
        /// <summary locid="M:J#Sys.Application.endCreateComponents"></summary>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        var components = this._secondPassComponents;
        for (var i = 0, l = components.length; i < l; i++) {
            var entry = components[i],
                component = entry.component;
            Sys.Component._setReferences(component, entry.references);
            component.endUpdate();
        }
        this._secondPassComponents = [];
        this._creatingComponents = false;
    },
    findComponent: function _Application$findComponent(id, parent) {
        /// <summary locid="M:J#Sys.Application.findComponent">Finds top-level components that were added through addComponent if no parent is specified  or children of the specified parent. If parent is a component</summary>
        /// <param name="id" type="String">The id of the component to find.</param>
        /// <param name="parent" optional="true" mayBeNull="true">The component or element that contains the component to find.  If not specified or null, the search is made on Application.</param>
        /// <returns type="Sys.Component" mayBeNull="true">The component, or null if it wasn't found.</returns>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "id", type: String},
            {name: "parent", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        //#endif
        // Need to reference the application singleton directly beause the $find alias
        // points to the instance function without context. The 'this' pointer won't work here.
        return (parent ?
            ((Sys.IContainer.isInstanceOfType(parent)) ?
                parent.findComponent(id) :
                parent[id] || null) :
            Sys.Application._components[id] || null);
    },
    getComponents: function _Application$getComponents() {
        /// <summary locid="M:J#Sys.Application.getComponents"></summary>
        /// <returns type="Array" elementType="Sys.Component"></returns>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        var res = [];
        var components = this._components;
        for (var name in components) {
            if (components.hasOwnProperty(name)) {
                res.push(components[name]);
            }
        }
        return res;
    },
    initialize: function _Application$initialize() {
        /// <summary locid="M:J#Sys.Application.initialize"></summary>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        window.setTimeout(Function.createDelegate(this, this._doInitialize), 0);
    },
    _doInitialize: function _Application$_doInitialize() {
        if(!this.get_isInitialized() && !this._disposing) {
            Sys._Application.callBaseMethod(this, 'initialize');
            this._raiseInit();
            if (this.get_stateString) {
                // only execute if history has been imported
                if (Sys.WebForms && Sys.WebForms.PageRequestManager) {
                    // Subscribe to begin and end request events
                    var prm = Sys.WebForms.PageRequestManager.getInstance();
                    this._beginRequestHandler = Function.createDelegate(this, this._onPageRequestManagerBeginRequest);
                    prm.add_beginRequest(this._beginRequestHandler);
                    this._endRequestHandler = Function.createDelegate(this, this._onPageRequestManagerEndRequest);
                    prm.add_endRequest(this._endRequestHandler);
                }
                var loadedEntry = this.get_stateString();
                if (loadedEntry !== this._currentEntry) {
                    this._navigate(loadedEntry);
                }
                else {
                    // Dev10 Bug: 599356
                    // necessary to ensure history is initialized, or there wont be any timer running to check for changes in the
                    // hash. For example, if the user navigates a few times, then goes back to the first state and refreshes the
                    // page, we will be loading the page with no state (this else case), yet they can click forward -- but we
                    // never initialized history so it goes unnoticed.
                    this._ensureHistory();
                }
            }
            this.raiseLoad();
        }
    },
    notifyScriptLoaded: function _Application$notifyScriptLoaded() {
        /// <summary locid="M:J#Sys.Application.notifyScriptLoaded">Called by referenced scripts to indicate that they have completed loading. [Obsolete]</summary>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
    },
    registerDisposableObject: function _Application$registerDisposableObject(object) {
        /// <summary locid="M:J#Sys.Application.registerDisposableObject">Registers a disposable object with the application.</summary>
        /// <param name="object" type="Sys.IDisposable">The object to register.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "object", type: Sys.IDisposable}
        ]);
        if (e) throw e;
        //#endif
        if (!this._disposing) {
            var objects = this._disposableObjects,
                i = objects.length;
            objects[i] = object;
            object.__msdisposeindex = i;
        }
    },
    raiseLoad: function _Application$raiseLoad() {
        /// <summary locid="M:J#Sys.Application.raiseLoad"></summary>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        var args = new Sys.ApplicationLoadEventArgs(Array.clone(this._createdComponents), !!this._loaded);
        this._loaded = true;
        Sys.Observer.raiseEvent(this, "load", args);
        if (window.pageLoad) {
            window.pageLoad(this, args);
        }
        this._createdComponents = [];
    },
    removeComponent: function _Application$removeComponent(component) {
        /// <summary locid="M:J#Sys.Application.removeComponent">Removes a top-level component from the application.</summary>
        /// <param name="component" type="Sys.Component">The component to remove.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "component", type: Sys.Component}
        ]);
        if (e) throw e;
        //#endif
        var id = component.get_id();
        if (id) delete this._components[id];
    },
    unregisterDisposableObject: function _Application$unregisterDisposableObject(object) {
        /// <summary locid="M:J#Sys.Application.unregisterDisposableObject">Unregisters a disposable object from the application.</summary>
        /// <param name="object" type="Sys.IDisposable">The object to unregister.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "object", type: Sys.IDisposable}
        ]);
        if (e) throw e;
        //#endif
        if (!this._disposing) {
            var i = object.__msdisposeindex;
            if (typeof(i) === "number") {
                // delete it from the array instead of removing it, so the msdisposeindex
                // remains correct on the other existing objects
                // When the array is enumerated we use for/in to skip over the deleted entries.
                var disposableObjects = this._disposableObjects;
                delete disposableObjects[i];
                delete object.__msdisposeindex;
                if (++this._deleteCount > 1000) {
                    // periodically rebuild the array to remove the sparse elements
                    // to put a cap on the amount of memory it can consume
                    var newArray = [];
                    for (var j = 0, l = disposableObjects.length; j < l; j++) {
                        object = disposableObjects[j];
                        if (typeof(object) !== "undefined") {
                            object.__msdisposeindex = newArray.length;
                            newArray.push(object);
                        }
                    }
                    this._disposableObjects = newArray;
                    this._deleteCount = 0;
                }
            }
        }
    },
    _addComponentToSecondPass: function _Application$_addComponentToSecondPass(component, references) {
        this._secondPassComponents.push({component: component, references: references});
    },
    _disposeComponents: function _Application$_disposeComponents(list) {
        if (list) {
            for (var i = list.length - 1; i >= 0; i--) {
                var item = list[i];
                if (typeof(item.dispose) === "function") {
                    item.dispose();
                }
            }
        }
    },
    _raiseInit: function _Application$_raiseInit() {
        this.beginCreateComponents();
        Sys.Observer.raiseEvent(this, "init");
        this.endCreateComponents();
    },
    _unloadHandler: function _Application$_unloadHandler(event) {
        this.dispose();
    }
}
$type.registerClass('Sys._Application', Sys.Component, Sys.IContainer);

Sys.Application = new Sys._Application();
window.$find = Sys.Application.findComponent;

// automatically initialize when the dom is ready
Sys.onReady(function() {
    Sys.Application._doInitialize();
});

