$type = Sys.Component = function Component() {
    /// <summary locid="M:J#Sys.Component.#ctor">Base class for Control, Behavior and any object that wants its lifetime to be managed.</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    if (Sys.Application) Sys.Application.registerDisposableObject(this);
}
$type.prototype = {
    //#if DEBUG
    _idSet: false,
    //#endif
    get_events: function Component$get_events() {
        /// <value type="Sys.EventHandlerList" locid="P:J#Sys.Component.events">The collection of event handlers for this behavior.  This property should only be used by derived behaviors  and should not be publicly called by other code.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return Sys.Observer._getContext(this, true).events;
    },
    get_id: function Component$get_id() {
        /// <value type="String" locid="P:J#Sys.Component.id"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._id || null;
    },
    set_id: function Component$set_id(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        //#endif
        //#if DEBUG
        if (this._idSet) throw Error.invalidOperation(Sys.Res.componentCantSetIdTwice);
        this._idSet = true;
        var oldId = this.get_id();
        if (oldId && Sys.Application.findComponent(oldId)) throw Error.invalidOperation(Sys.Res.componentCantSetIdAfterAddedToApp);
        //#endif
        this._id = value;
    },
    get_isInitialized: function Component$get_isInitialized() {
        /// <value type="Boolean" locid="P:J#Sys.Component.isInitialized"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return !!this._initialized;
    },
    get_isUpdating: function Component$get_isUpdating() {
        /// <value type="Boolean" locid="P:J#Sys.Component.isUpdating"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return !!this._updating;
    },
    add_disposing: function Component$add_disposing(handler) {
        /// <summary locid="E:J#Sys.Component.disposing"></summary>
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        this._addHandler("disposing", handler);
    },
    remove_disposing: function Component$remove_disposing(handler) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        this._removeHandler("disposing", handler);
    },
    add_propertyChanged: function Component$add_propertyChanged(handler) {
        /// <summary locid="E:J#Sys.Component.propertyChanged"></summary>
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        this._addHandler("propertyChanged", handler);
    },
    remove_propertyChanged: function Component$remove_propertyChanged(handler) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        this._removeHandler("propertyChanged", handler);
    },
    _addHandler: function Component$_addHandler(eventName, handler) {
        Sys.Observer.addEventHandler(this, eventName, handler);
    },
    _removeHandler: function Component$_removeHandler(eventName, handler) {
        Sys.Observer.removeEventHandler(this, eventName, handler);
    },
    beginUpdate: function Component$beginUpdate() {
        this._updating = true;
    },
    dispose: function Component$dispose() {
        Sys.Observer.raiseEvent(this, "disposing")
        Sys.Observer.clearEventHandlers(this);
        Sys.Application.unregisterDisposableObject(this);
        Sys.Application.removeComponent(this);
    },
    endUpdate: function Component$endUpdate() {
        this._updating = false;
        if (!this._initialized) this.initialize();
        this.updated();
    },
    initialize: function Component$initialize() {
        this._initialized = true;
    },
    raisePropertyChanged: function Component$raisePropertyChanged(propertyName) {
        /// <summary locid="M:J#Sys.Component.raisePropertyChanged">Raises a change notification event.</summary>
        /// <param name="propertyName" type="String">The name of the property that changed.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "propertyName", type: String}
        ]);
        if (e) throw e;
        //#endif
        Sys.Observer.raisePropertyChanged(this, propertyName);
    },
    updated: function Component$updated() {
    }
}
$type.registerClass('Sys.Component', null, Sys.IDisposable, Sys.INotifyPropertyChange, Sys.INotifyDisposing);

$type._setProperties = function Component$_setProperties(target, properties) {
    /// <summary locid="M:J#Sys.Component._setProperties">Recursively sets properties on an object.</summary>
    /// <param name="target">The object on which to set the property values.</param>
    /// <param name="properties">A JSON object containing the property values.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "properties"}
    ]);
    if (e) throw e;
    //#endif
    var current;
    var targetType = Object.getType(target);
    var isObject = (targetType === Object) || (targetType === Sys.UI.DomElement);
    var isComponent = Sys.Component.isInstanceOfType(target) && !target.get_isUpdating();
    if (isComponent) target.beginUpdate();
    for (var name in properties) {
        var val = properties[name];
        var getter = isObject ? null : target["get_" + name];
        if (isObject || typeof(getter) !== 'function') {
            // No getter, looking for an existing field.
            var targetVal = target[name];
            if (!val || (typeof(val) !== 'object') || (isObject && !targetVal)) {
                target[name] = val;
            }
            else {
                this._setProperties(targetVal, val);
            }
        }
        else {
            var setter = target["set_" + name];
            if (typeof(setter) === 'function') {
                // The setter exists, using it in all cases.
                setter.apply(target, [val]);
            }
            else if (val instanceof Array) {
                // There is a getter but no setter and the value to set is an array. Adding to the existing array.
                current = getter.apply(target);
                //#if DEBUG
                if (!(current instanceof Array)) throw new Error.invalidOperation(String.format(Sys.Res.propertyNotAnArray, name));
                //#endif
                for (var i = 0, j = current.length, l= val.length; i < l; i++, j++) {
                    current[j] = val[i];
                }
            }
            else if ((typeof(val) === 'object') && (Object.getType(val) === Object)) {
                // There is a getter but no setter and the value to set is a plain object. Adding to the existing object.
                current = getter.apply(target);
                //#if DEBUG
                if ((typeof(current) === 'undefined') || (current === null)) throw new Error.invalidOperation(String.format(Sys.Res.propertyNullOrUndefined, name));
                //#endif
                this._setProperties(current, val);
            }
            //#if DEBUG
            else {
                // No setter, and the value is not an array or object, throwing.
                throw new Error.invalidOperation(String.format(Sys.Res.propertyNotWritable, name));
            }
            //#endif
        }
    }
    if (isComponent) target.endUpdate();
}

$type._setReferences = function Component$_setReferences(component, references) {
    var reference, refs = {};
    forIn(references, function(id, name) {
        refs[name] = reference = $find(id);
        if (!reference) throw Error.invalidOperation(String.format(Sys.Res.referenceNotFound, id));
    });
    Sys._set(component, refs);
}

$create = $type.create = function Component$create(type, properties, events, references, element) {
    /// <summary locid="M:J#Sys.Component.create">Instantiates a component of the specified type, attaches it to the specified element if it's  a Control or Behavior, sets the properties as described by the specified JSON object,  then calls initialize.</summary>
    /// <param name="type" type="Type">The type of the component to create.</param>
    /// <param name="properties" optional="true" mayBeNull="true">A JSON object that describes the properties and their values.</param>
    /// <param name="events" optional="true" mayBeNull="true">A JSON object that describes the events and their handlers.</param>
    /// <param name="references" optional="true" mayBeNull="true">A JSON object that describes the properties that are references to other components.  The contents of this object consists of name/id pairs.  If in a two-pass creation, the setting of these properties will be delayed until the second pass.</param>
    /// <param name="element" domElement="true" optional="true" mayBeNull="true">The DOM element the component must be attached to.</param>
    /// <returns type="Object">The component instance.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "type", type: Type},
        {name: "properties", mayBeNull: true, optional: true},
        {name: "events", mayBeNull: true, optional: true},
        {name: "references", mayBeNull: true, optional: true},
        {name: "element", mayBeNull: true, domElement: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    if (type.inheritsFrom(Sys.UI.Behavior) || type.inheritsFrom(Sys.UI.Control)) {
        if (!element) throw Error.argument('element', Sys.Res.createNoDom);
    }
    else if (element) throw Error.argument('element', Sys.Res.createComponentOnDom);
    //#endif
    var component = (element ? new type(element): new type());
    callIf(component, "beginUpdate");
    if (properties) {
        Sys.Component._setProperties(component, properties);
    }
    if (events) {
        for (var name in events) {
            //#if DEBUG
            if (!(component["add_" + name] instanceof Function)) throw new Error.invalidOperation(String.format(Sys.Res.undefinedEvent, name));
            if (!(events[name] instanceof Function)) throw new Error.invalidOperation(Sys.Res.eventHandlerNotFunction);
            //#endif
            component["add_" + name](events[name]);
        }
    }
    Sys.Component._register(component, references);
    return component;
}
$type._register = function Component$_register(component, references, dontUpdate) {
    var ret;
    if (Sys.Component.isInstanceOfType(component)) {
        ret = true;
        var app = Sys.Application;
        if (component.get_id()) {
            app.addComponent(component);
        }
        if (app.get_isCreatingComponents()) {
            // DevDiv 81690: Do not add to createdComponent list unless we are in 2 pass mode,
            // which is during the first GET and on partial updates. 
            app._createdComponents.push(component);
            if (references) {
                app._addComponentToSecondPass(component, references);
            }
            else if (!dontUpdate) {
                component.endUpdate();
            }
        }
        else {
            if (references) {
                Sys.Component._setReferences(component, references);
            }
            if (!dontUpdate) {
                component.endUpdate();
            }
        }
    }
    return ret;
}

Sys._getComponent = function _getComponent(found, selector, context) {
    var component = Sys.Application.findComponent(selector);
    if (component) {
        found.push(component);
    }
}

Sys._2Pass = function _2Pass(callback) {
    // overwrite version defined in start.js
    var app = Sys.Application,
        useTwoPass = !app.get_isCreatingComponents();
    if (useTwoPass) app.beginCreateComponents();
    foreach(callback, function(c) { c() });
    if (useTwoPass) app.endCreateComponents();
}
