// (c) 2010 CodePlex Foundation
//!/ <reference name="MicrosoftAjaxCore.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxComponentModel.js", ["MicrosoftAjaxCore.js"]);

Type.registerNamespace('Sys.UI');

var $type, $prototype,
    isBrowser = Sys._isBrowser,
	foreach = Sys._foreach,
	forIn = Sys._forIn,
	callIf = Sys._callIf;

$type = Sys.CommandEventArgs = function CommandEventArgs(commandName, commandArgument, commandSource, commandEvent) {
    /// <summary locid="M:J#Sys.CommandEventArgs.#ctor"></summary>
    /// <param name="commandName" type="String">The command name.</param>
    /// <param name="commandArgument" mayBeNull="true">The command arguments.</param>
    /// <param name="commandSource" mayBeNull="true">The command source.</param>
    /// <param name="commandEvent" type="Sys.UI.DomEvent" mayBeNull="true" optional="true">The DOM event that caused the command, if any.</param>
    var e = Function._validateParams(arguments, [
        {name: "commandName", type: String},
        {name: "commandArgument", mayBeNull: true},
        {name: "commandSource", mayBeNull: true},
        {name: "commandEvent", type: Sys.UI.DomEvent, mayBeNull: true, optional: true }
    ]);
    if (e) throw e;
    Sys.CommandEventArgs.initializeBase(this);
    this._commandName = commandName;
    this._commandArgument = commandArgument;
    this._commandSource = commandSource;
    this._commandEvent = commandEvent;
}
$type.prototype = {
    get_commandName: function CommandEventArgs$get_commandName() {
        /// <value type="String" locid="P:J#Sys.CommandEventArgs.commandName">The command name.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._commandName || null;
    },
    get_commandArgument: function CommandEventArgs$get_commandArgument() {
        /// <value mayBeNull="true" locid="P:J#Sys.CommandEventArgs.commandArgument">The command arguments.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._commandArgument;
    },
    get_commandSource: function CommandEventArgs$get_commandSource() {
        /// <value mayBeNull="true" locid="P:J#Sys.CommandEventArgs.commandSource">The command source.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._commandSource || null;
    },
    get_commandEvent: function CommandEventArgs$get_commandEvent() {
        /// <value mayBeNull="true" type="Sys.UI.DomEvent" locid="P:J#Sys.CommandEventArgs.commandEvent">The DOM event that caused the command, if any.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._commandEvent || null;
    }
}
$type.registerClass("Sys.CommandEventArgs", Sys.CancelEventArgs);
$type = Sys.INotifyDisposing = function INotifyDisposing() {
    /// <summary locid="M:J#Sys.INotifyDisposing.#ctor">Implement this interface if the class exposes an event to notify when it's disposing.</summary>
    if (arguments.length !== 0) throw Error.parameterCount();
    throw Error.notImplemented();
}
$type.prototype = {
    add_disposing: function INotifyDisposing$add_disposing(handler) {
    /// <summary locid="E:J#Sys.INotifyDisposing.disposing"></summary>
    var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
    if (e) throw e;
        throw Error.notImplemented();
    },
    remove_disposing: function INotifyDisposing$remove_disposing(handler) {
    var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
    if (e) throw e;
        throw Error.notImplemented();
    }
}
$type.registerInterface("Sys.INotifyDisposing");
$type = Sys.Component = function Component() {
    /// <summary locid="M:J#Sys.Component.#ctor">Base class for Control, Behavior and any object that wants its lifetime to be managed.</summary>
    if (arguments.length !== 0) throw Error.parameterCount();
    if (Sys.Application) Sys.Application.registerDisposableObject(this);
}
$type.prototype = {
    _idSet: false,
    get_events: function Component$get_events() {
        /// <value type="Sys.EventHandlerList" locid="P:J#Sys.Component.events">The collection of event handlers for this behavior.  This property should only be used by derived behaviors  and should not be publicly called by other code.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return Sys.Observer._getContext(this, true).events;
    },
    get_id: function Component$get_id() {
        /// <value type="String" locid="P:J#Sys.Component.id"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._id || null;
    },
    set_id: function Component$set_id(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        if (this._idSet) throw Error.invalidOperation(Sys.Res.componentCantSetIdTwice);
        this._idSet = true;
        var oldId = this.get_id();
        if (oldId && Sys.Application.findComponent(oldId)) throw Error.invalidOperation(Sys.Res.componentCantSetIdAfterAddedToApp);
        this._id = value;
    },
    get_isInitialized: function Component$get_isInitialized() {
        /// <value type="Boolean" locid="P:J#Sys.Component.isInitialized"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return !!this._initialized;
    },
    get_isUpdating: function Component$get_isUpdating() {
        /// <value type="Boolean" locid="P:J#Sys.Component.isUpdating"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return !!this._updating;
    },
    add_disposing: function Component$add_disposing(handler) {
        /// <summary locid="E:J#Sys.Component.disposing"></summary>
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        this._addHandler("disposing", handler);
    },
    remove_disposing: function Component$remove_disposing(handler) {
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        this._removeHandler("disposing", handler);
    },
    add_propertyChanged: function Component$add_propertyChanged(handler) {
        /// <summary locid="E:J#Sys.Component.propertyChanged"></summary>
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        this._addHandler("propertyChanged", handler);
    },
    remove_propertyChanged: function Component$remove_propertyChanged(handler) {
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
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
        var e = Function._validateParams(arguments, [
            {name: "propertyName", type: String}
        ]);
        if (e) throw e;
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
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "properties"}
    ]);
    if (e) throw e;
    var current;
    var targetType = Object.getType(target);
    var isObject = (targetType === Object) || (targetType === Sys.UI.DomElement);
    var isComponent = Sys.Component.isInstanceOfType(target) && !target.get_isUpdating();
    if (isComponent) target.beginUpdate();
    for (var name in properties) {
        var val = properties[name];
        var getter = isObject ? null : target["get_" + name];
        if (isObject || typeof(getter) !== 'function') {
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
                setter.apply(target, [val]);
            }
            else if (val instanceof Array) {
                current = getter.apply(target);
                if (!(current instanceof Array)) throw new Error.invalidOperation(String.format(Sys.Res.propertyNotAnArray, name));
                for (var i = 0, j = current.length, l= val.length; i < l; i++, j++) {
                    current[j] = val[i];
                }
            }
            else if ((typeof(val) === 'object') && (Object.getType(val) === Object)) {
                current = getter.apply(target);
                if ((typeof(current) === 'undefined') || (current === null)) throw new Error.invalidOperation(String.format(Sys.Res.propertyNullOrUndefined, name));
                this._setProperties(current, val);
            }
            else {
                throw new Error.invalidOperation(String.format(Sys.Res.propertyNotWritable, name));
            }
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
    var e = Function._validateParams(arguments, [
        {name: "type", type: Type},
        {name: "properties", mayBeNull: true, optional: true},
        {name: "events", mayBeNull: true, optional: true},
        {name: "references", mayBeNull: true, optional: true},
        {name: "element", mayBeNull: true, domElement: true, optional: true}
    ]);
    if (e) throw e;
    if (type.inheritsFrom(Sys.UI.Behavior) || type.inheritsFrom(Sys.UI.Control)) {
        if (!element) throw Error.argument('element', Sys.Res.createNoDom);
    }
    else if (element) throw Error.argument('element', Sys.Res.createComponentOnDom);
    var component = (element ? new type(element): new type());
    callIf(component, "beginUpdate");
    if (properties) {
        Sys.Component._setProperties(component, properties);
    }
    if (events) {
        for (var name in events) {
            if (!(component["add_" + name] instanceof Function)) throw new Error.invalidOperation(String.format(Sys.Res.undefinedEvent, name));
            if (!(events[name] instanceof Function)) throw new Error.invalidOperation(Sys.Res.eventHandlerNotFunction);
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
    var app = Sys.Application,
        useTwoPass = !app.get_isCreatingComponents();
    if (useTwoPass) app.beginCreateComponents();
    foreach(callback, function(c) { c() });
    if (useTwoPass) app.endCreateComponents();
}
$type = Sys.UI.MouseButton = function MouseButton() {
    /// <summary locid="M:J#Sys.UI.MouseButton.#ctor">Describes mouse buttons. The values are those from the DOM standard, which are different from the IE values.</summary>
    /// <field name="leftButton" type="Number" integer="true" static="true" locid="F:J#Sys.UI.MouseButton.leftButton"></field>
    /// <field name="middleButton" type="Number" integer="true" static="true" locid="F:J#Sys.UI.MouseButton.middleButton"></field>
    /// <field name="rightButton" type="Number" integer="true" static="true" locid="F:J#Sys.UI.MouseButton.rightButton"></field>
    if (arguments.length !== 0) throw Error.parameterCount();
    throw Error.notImplemented();
}
$type.prototype = {
    leftButton: 0,
    middleButton: 1,
    rightButton: 2
}
$type.registerEnum("Sys.UI.MouseButton");
$type = Sys.UI.Key = function Key() {
    /// <summary locid="M:J#Sys.UI.Key.#ctor">Describes key codes.</summary>
    /// <field name="backspace" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.backspace"></field>
    /// <field name="tab" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.tab"></field>
    /// <field name="enter" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.enter"></field>
    /// <field name="esc" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.esc"></field>
    /// <field name="space" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.space"></field>
    /// <field name="pageUp" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.pageUp"></field>
    /// <field name="pageDown" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.pageDown"></field>
    /// <field name="end" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.end"></field>
    /// <field name="home" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.home"></field>
    /// <field name="left" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.left"></field>
    /// <field name="up" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.up"></field>
    /// <field name="right" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.right"></field>
    /// <field name="down" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.down"></field>
    /// <field name="del" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.del"></field>
    if (arguments.length !== 0) throw Error.parameterCount();
    throw Error.notImplemented();
}
$type.prototype = {
    backspace: 8,
    tab: 9,
    enter: 13,
    esc: 27,
    space: 32,
    pageUp: 33,
    pageDown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    del: 127
}
$type.registerEnum("Sys.UI.Key");
$type = Sys.UI.Point = function Point(x, y) {
    /// <summary locid="M:J#Sys.UI.Point.#ctor"></summary>
    /// <param name="x" type="Number" integer="true"></param>
    /// <param name="y" type="Number" integer="true"></param>
    /// <field name="x" type="Number" integer="true" locid="F:J#Sys.UI.Point.x"></field>
    /// <field name="y" type="Number" integer="true" locid="F:J#Sys.UI.Point.y"></field>
    var e = Function._validateParams(arguments, [
        {name: "x", type: Number, integer: true},
        {name: "y", type: Number, integer: true}
    ]);
    if (e) throw e;
    this.x = x;
    this.y = y;
}
$type.registerClass('Sys.UI.Point');
$type = Sys.UI.Bounds = function Bounds(x, y, width, height) {
    /// <summary locid="M:J#Sys.UI.Bounds.#ctor"></summary>
    /// <param name="x" type="Number" integer="true"></param>
    /// <param name="y" type="Number" integer="true"></param>
    /// <param name="width" type="Number" integer="true"></param>
    /// <param name="height" type="Number" integer="true"></param>
    /// <field name="x" type="Number" integer="true" locid="F:J#Sys.UI.Bounds.x"></field>
    /// <field name="y" type="Number" integer="true" locid="F:J#Sys.UI.Bounds.y"></field>
    /// <field name="width" type="Number" integer="true" locid="F:J#Sys.UI.Bounds.width"></field>
    /// <field name="height" type="Number" integer="true" locid="F:J#Sys.UI.Bounds.height"></field>
    var e = Function._validateParams(arguments, [
        {name: "x", type: Number, integer: true},
        {name: "y", type: Number, integer: true},
        {name: "width", type: Number, integer: true},
        {name: "height", type: Number, integer: true}
    ]);
    if (e) throw e;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
}
$type.registerClass('Sys.UI.Bounds');
$type = Sys.UI.DomEvent = function DomEvent(eventObject) {
    /// <summary locid="M:J#Sys.UI.DomEvent.#ctor">A cross-browser object that represents event properties.</summary>
    /// <param name="eventObject">The browser-specific event object (window.event for IE).</param>
    /// <field name="altKey" type="Boolean" locid="F:J#Sys.UI.DomEvent.altKey"></field>
    /// <field name="button" type="Sys.UI.MouseButton" locid="F:J#Sys.UI.DomEvent.button"></field>
    /// <field name="charCode" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.charCode">The character code for the pressed key.</field>
    /// <field name="clientX" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.clientX"></field>
    /// <field name="clientY" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.clientY"></field>
    /// <field name="ctrlKey" type="Boolean" locid="F:J#Sys.UI.DomEvent.ctrlKey"></field>
    /// <field name="keyCode" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.keyCode">The key code for the pressed key.</field>
    /// <field name="offsetX" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.offsetX"></field>
    /// <field name="offsetY" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.offsetY"></field>
    /// <field name="screenX" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.screenX"></field>
    /// <field name="screenY" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.screenY"></field>
    /// <field name="shiftKey" type="Boolean" locid="F:J#Sys.UI.DomEvent.shiftKey"></field>
    /// <field name="target" locid="F:J#Sys.UI.DomEvent.target"></field>
    /// <field name="type" type="String" locid="F:J#Sys.UI.DomEvent.type"></field>
    var e = Function._validateParams(arguments, [
        {name: "eventObject"}
    ]);
    if (e) throw e;
    var ev = eventObject;
    var etype = this.type = ev.type.toLowerCase();
    this.rawEvent = ev;
    this.altKey = ev.altKey;
    if (typeof(ev.button) !== 'undefined') {
        this.button = (typeof(ev.which) !== 'undefined') ? ev.button :
            (ev.button === 4) ? Sys.UI.MouseButton.middleButton :
            (ev.button === 2) ? Sys.UI.MouseButton.rightButton :
            Sys.UI.MouseButton.leftButton;
    }
    if (etype === 'keypress') {
        this.charCode = ev.charCode || ev.keyCode;
    }
    else if (ev.keyCode && (ev.keyCode === 46)) {
        this.keyCode = 127;
    }
    else {
        this.keyCode = ev.keyCode;
    }
    this.clientX = ev.clientX;
    this.clientY = ev.clientY;
    this.ctrlKey = ev.ctrlKey;
    this.target = ev.target || ev.srcElement;
    if (!etype.startsWith('key')) {
        if ((typeof(ev.offsetX) !== 'undefined') && (typeof(ev.offsetY) !== 'undefined')) {
            this.offsetX = ev.offsetX;
            this.offsetY = ev.offsetY;
        }
        else if (this.target && (this.target.nodeType !== 3) && (typeof(ev.clientX) === 'number')) {
            var loc = Sys.UI.DomElement.getLocation(this.target);
            var w = Sys.UI.DomElement._getWindow(this.target);
            this.offsetX = (w.pageXOffset || 0) + ev.clientX - loc.x;
            this.offsetY = (w.pageYOffset || 0) + ev.clientY - loc.y;
        }
    }
    this.screenX = ev.screenX;
    this.screenY = ev.screenY;
    this.shiftKey = ev.shiftKey;
}
$type.prototype = {
    preventDefault: function DomEvent$preventDefault() {
        /// <summary locid="M:J#Sys.UI.DomEvent.preventDefault">Prevents the default event action from happening. For example, a textbox keydown event,  if suppressed, will prevent the character from being appended to the textbox.</summary>
        if (arguments.length !== 0) throw Error.parameterCount();
        var raw = this.rawEvent;
        if (raw.preventDefault) {
            raw.preventDefault();
        }
        else if (window.event) {
            raw.returnValue = false;
        }
    },
    stopPropagation: function DomEvent$stopPropagation() {
        /// <summary locid="M:J#Sys.UI.DomEvent.stopPropagation">Prevents the event from being propagated to parent elements.</summary>
        if (arguments.length !== 0) throw Error.parameterCount();
        var raw = this.rawEvent;
        if (raw.stopPropagation) {
            raw.stopPropagation();
        }
        else if (window.event) {
            raw.cancelBubble = true;
        }
    }
}
$type.registerClass('Sys.UI.DomEvent');

$addHandler = $type.addHandler = function DomEvent$addHandler(elements, eventName, handler, autoRemove) {
    /// <summary locid="M:J#Sys.UI.DomEvent.addHandler">A cross-browser way to add a DOM event handler to an element.</summary>
    /// <param name="elements">The element or text node, or array of elements or text nodes, that exposes the event. You may also pass a DOM selector or array of DOM selectors.</param>
    /// <param name="eventName" type="String">The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'.</param>
    /// <param name="handler" type="Function">The event handler to add.</param>
    /// <param name="autoRemove" type="Boolean" optional="true" mayBeNull="true">Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or Sys.Application.disposeElement is called.</param>
    var e = Function._validateParams(arguments, [
        {name: "elements"},
        {name: "eventName", type: String},
        {name: "handler", type: Function},
        {name: "autoRemove", type: Boolean, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    if (eventName === "error") throw Error.invalidOperation(Sys.Res.addHandlerCantBeUsedForError);
    Sys.query(elements).each(function() {
        var nodeType = this.nodeType;
        if (nodeType === 3 || nodeType === 2 || nodeType === 8) return;
        Sys.UI.DomEvent._ensureDomNode(this);
        if (!this._events) {
            this._events = {};
        }
        var eventCache = this._events[eventName];
        if (!eventCache) {
            this._events[eventName] = eventCache = [];
        }
        var element = this, 
            browserHandler;
        if (this.addEventListener) {
            browserHandler = function(e) {
                return handler.call(element, new Sys.UI.DomEvent(e));
            }
            this.addEventListener(eventName, browserHandler, false);
        }
        else if (this.attachEvent) {
            browserHandler = function() {
                var ex, ev = {};
                try {ev = Sys.UI.DomElement._getWindow(element).event} catch(ex) {}
                return handler.call(element, new Sys.UI.DomEvent(ev));
            }
            this.attachEvent('on' + eventName, browserHandler);
        }
        eventCache.push({handler: handler, browserHandler: browserHandler, autoRemove: autoRemove });
        if (autoRemove) {
            Sys.UI.DomElement._onDispose(this, Sys.UI.DomEvent._disposeHandlers);
        }
    });
}

Sys.registerPlugin({
    name: "addHandler",
    dom: true,
    returnType: "Sys.ElementSet",
    description: "A cross-browser way to add a DOM event handler to an element.",
    parameters: [
        {name: "eventName", type: "String", description: "The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'."},
        {name: "handler", type: "Function", description: "The event handler to add."},
        {name: "autoRemove", type: "Boolean", description: "Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or Sys.Application.disposeElement is called."}
    ],
    plugin: function (eventName, handler, autoRemove) {
        Sys.UI.DomEvent.addHandler(this.get(), eventName, handler, autoRemove);
        return this;
    }
});

$addHandlers = $type.addHandlers = function DomEvent$addHandlers(elements, events, handlerOwner, autoRemove) {
    /// <summary locid="M:J#Sys.UI.DomEvent.addHandlers">Adds a list of event handlers to an element.  If a handlerOwner is specified, delegates are created with each of the handlers.</summary>
    /// <param name="elements">The element or text node, or array of element or text nodes, that exposes the event. You may also pass a DOM selector or array of DOM selectors.</param>
    /// <param name="events" type="Object">A dictionary of event handlers.</param>
    /// <param name="handlerOwner" optional="true" mayBeNull="true">The owner of the event handlers that will be the this pointer  for the delegates that will be created from the handlers.</param>
    /// <param name="autoRemove" type="Boolean" optional="true" mayBeNull="true">Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or when Sys.Application.disposeElement is called.</param>
    var e = Function._validateParams(arguments, [
        {name: "elements"},
        {name: "events", type: Object},
        {name: "handlerOwner", mayBeNull: true, optional: true},
        {name: "autoRemove", type: Boolean, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    Sys.query(elements).each(function() {
        var nodeType = this.nodeType;
        if (nodeType === 3 || nodeType === 2 || nodeType === 8) return;
        Sys.UI.DomEvent._ensureDomNode(this);
        for (var name in events) {
            var handler = events[name];
            if (typeof(handler) !== 'function') throw Error.invalidOperation(Sys.Res.cantAddNonFunctionhandler);
            if (handlerOwner) {
                handler = Function.createDelegate(handlerOwner, handler);
            }
            $addHandler(this, name, handler, autoRemove || false);
        }
    });
}

Sys.registerPlugin({
    name: "addHandlers",
    dom: true,
    returnType: "Sys.ElementSet",
    description: "Adds a list of event handlers to an element. If a handlerOwner is specified, delegates are created with each of the handlers.",
    parameters: [
        {name: "events", type: "Object", description: "A dictionary of event handlers."},
        {name: "handlerOwner", description: "The owner of the event handlers that will be the this pointer for the delegates that will be created from the handlers."},
        {name: "autoRemove", type: "Boolean", description: "Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or Sys.Application.disposeElement is called."}
    ],
    plugin: function (events, handlerOwner, autoRemove) {
        Sys.UI.DomEvent.addHandlers(this.get(), events, handlerOwner, autoRemove);
        return this;
    }
});

$clearHandlers = $type.clearHandlers = function DomEvent$clearHandlers(elements) {
    /// <summary locid="M:J#Sys.UI.DomEvent.clearHandlers">Clears all the event handlers that were added to the element or array of elements.</summary>
    /// <param name="elements">The element or text node, or an array of elements or text nodes. You may also pass a DOM selector or array of DOM selectors.</param>
    var e = Function._validateParams(arguments, [
        {name: "elements"}
    ]);
    if (e) throw e;
    Sys.query(elements).each(function() {
        var nodeType = this.nodeType;
        if (nodeType === 3 || nodeType === 2 || nodeType === 8) return;
        Sys.UI.DomEvent._ensureDomNode(this);
        Sys.UI.DomEvent._clearHandlers(this, false);
    });
}

Sys.registerPlugin({
    name: "clearHandlers",
    dom: true,
    returnType: "Sys.ElementSet",
    description: "Clears all the event handlers that were added to the element or array of elements.",
    plugin: function() {
        Sys.UI.DomEvent.clearHandlers(this.get());
        return this;
    }
});

$type._clearHandlers = function DomEvent$_clearHandlers(elements, autoRemoving) {
    Sys.query(elements).each(function() {
        var nodeType = this.nodeType;
        if (nodeType === 3 || nodeType === 2 || nodeType === 8) return;
        Sys.UI.DomEvent._ensureDomNode(this);
        var cache = this._events;
        if (cache) {
            for (var name in cache) {
                var handlers = cache[name];
                for (var i = handlers.length - 1; i >= 0; i--) {
                    var entry = handlers[i];
                    if (!autoRemoving || entry.autoRemove) {
                        $removeHandler(this, name, entry.handler);
                    }
                }
            }
        }
    });
}

$type._disposeHandlers = function DomEvent$_disposeHandlers() {
    Sys.UI.DomEvent._clearHandlers(this, true);
}

$removeHandler = $type.removeHandler = function DomEvent$removeHandler(elements, eventName, handler) {
    /// <summary locid="M:J#Sys.UI.DomEvent.removeHandler">A cross-browser way to remove a DOM event handler from an element.</summary>
    /// <param name="elements">The element or text node, or array of elements or text nodes, that exposes the event. You may also pass a DOM selector or array of DOM selectors.</param>
    /// <param name="eventName" type="String">The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'.</param>
    /// <param name="handler" type="Function">The event handler to remove.</param>
    var e = Function._validateParams(arguments, [
        {name: "elements"},
        {name: "eventName", type: String},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    Sys.UI.DomEvent._removeHandler(elements, eventName, handler);
}
$type._removeHandler = function DomEvent$_removeHandler(elements, eventName, handler) {
    Sys.query(elements).each(function() {
        var nodeType = this.nodeType;
        if (nodeType === 3 || nodeType === 2 || nodeType === 8) return;
        Sys.UI.DomEvent._ensureDomNode(this);
        var browserHandler = null;
        if ((typeof(this._events) !== 'object') || !this._events) throw Error.invalidOperation(Sys.Res.eventHandlerInvalid);
        var cache = this._events[eventName];
        if (!(cache instanceof Array)) throw Error.invalidOperation(Sys.Res.eventHandlerInvalid);
        for (var i = 0, l = cache.length; i < l; i++) {
            if (cache[i].handler === handler) {
                browserHandler = cache[i].browserHandler;
                break;
            }
        }
        if (typeof(browserHandler) !== 'function') throw Error.invalidOperation(Sys.Res.eventHandlerInvalid);
        if (this.removeEventListener) {
            this.removeEventListener(eventName, browserHandler, false);
        }
        else if (this.detachEvent) {
            this.detachEvent('on' + eventName, browserHandler);
        }
        cache.splice(i, 1);
    });
}

Sys.registerPlugin({
    name: "removeHandler",
    dom: true,
    returnType: "Sys.ElementSet",
    description: "A cross-browser way to remove a DOM event handler from an element.",
    parameters: [
        {name: "eventName", type: "String", description: "The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'."},
        {name: "handler", type: "Function", description: "The event handler to remove."}
    ],
    plugin: function (eventName, handler) {
        Sys.UI.DomEvent.removeHandler(this.get(), eventName, handler);
        return this;
    }
});


$type._ensureDomNode = function DomEvent$_ensureDomNode(element) {
    if (element && element.tagName && (element.tagName.toUpperCase() === "SCRIPT")) return;
    
    var doc = element ? (element.ownerDocument || element.document || element) : null;
    if (!element ||
        ((typeof(element.document) !== 'object') && (element != doc) && (typeof(element.nodeType) !== 'number'))) {
        throw Error.argument("element", Sys.Res.argumentDomNode);
    }
}
$type = Sys.UI.DomElement = function DomElement() {
    /// <summary locid="M:J#Sys.UI.DomElement.#ctor">This static class provides helpers to work with DOM elements.</summary>
    if (arguments.length !== 0) throw Error.parameterCount();
    throw Error.notImplemented();
}
$type.registerClass('Sys.UI.DomElement');

$type.addCssClass = function DomElement$addCssClass(element, className) {
    /// <summary locid="M:J#Sys.UI.DomElement.addCssClass">Adds a CSS class to an element if it doesn't already have it.</summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="className" type="String">The name of the CSS class to add.</param>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "className", type: String}
    ]);
    if (e) throw e;
    if (!Sys.UI.DomElement.containsCssClass(element, className)) {
        if (element.className === '') {
            element.className = className;
        }
        else {
            element.className += ' ' + className;
        }
    }
}

$type.containsCssClass = function DomElement$containsCssClass(element, className) {
    /// <summary locid="M:J#Sys.UI.DomElement.containsCssClass">Determines if an element has the specified CSS class.</summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="className" type="String">The name of the CSS class to test.</param>
    /// <returns type="Boolean">True if the CSS class was found on the element.</returns>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "className", type: String}
    ]);
    if (e) throw e;
    return Array.contains(element.className.split(' '), className);
}

$type.getBounds = function DomElement$getBounds(element) {
    /// <summary locid="M:J#Sys.UI.DomElement.getBounds">Gets the coordinates, width and height of an element.</summary>
    /// <param name="element" domElement="true"></param>
    /// <returns type="Sys.UI.Bounds">A Bounds object with four fields, x, y, width and height, which contain the pixel coordinates,  width and height of the element.</returns>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;
    var offset = Sys.UI.DomElement.getLocation(element);

    return new Sys.UI.Bounds(offset.x, offset.y, element.offsetWidth || 0, element.offsetHeight || 0);
}

$get = $type.getElementById = function DomElement$getElementById(id, element) {
    /// <summary locid="M:J#Sys.UI.DomElement.getElementById">Finds an element by id.</summary>
    /// <param name="id" type="String">The id of the element to find.</param>
    /// <param name="element" domElement="true" optional="true" mayBeNull="true"></param>
    /// <returns domElement="true" mayBeNull="true">The element, or null if it was not found.</returns>
    var e = Function._validateParams(arguments, [
        {name: "id", type: String},
        {name: "element", mayBeNull: true, domElement: true, optional: true}
    ]);
    if (e) throw e;
    return Sys.get("#" + id, element || null);
}

if (document.documentElement.getBoundingClientRect) {
    $type.getLocation = function DomElement$getLocation(element) {
        /// <summary locid="M:J#Sys.UI.DomElement.getLocation">Gets the coordinates of a DOM element.</summary>
        /// <param name="element" domElement="true"></param>
        /// <returns type="Sys.UI.Point">A Point object with two fields, x and y, which contain the pixel coordinates of the element.</returns>
        var e = Function._validateParams(arguments, [
            {name: "element", domElement: true}
        ]);
        if (e) throw e;
        
        if (element.self || element.nodeType === 9 ||
            (element === document.documentElement) ||
            (element.parentNode === element.ownerDocument.documentElement)) {
            return new Sys.UI.Point(0, 0);
        }        
        
        var clientRect = element.getBoundingClientRect();
        if (!clientRect) {
            return new Sys.UI.Point(0,0);
        }
        var ex, ownerDoc = element.ownerDocument, documentElement = ownerDoc.documentElement,
            offsetX = Math.round(clientRect.left) + (documentElement.scrollLeft || (ownerDoc.body ? ownerDoc.body.scrollLeft : 0)),
            offsetY = Math.round(clientRect.top) + (documentElement.scrollTop || (ownerDoc.body ? ownerDoc.body.scrollTop : 0));
        if (isBrowser("InternetExplorer")) {
            try {
                var f = element.ownerDocument.parentWindow.frameElement || null;
                if (f) {
                    f = f.frameBorder;
                    var offset = (f === "0" || f === "no") ? 2 : 0;
                    offsetX += offset;
                    offsetY += offset;
                }
            }
            catch(ex) {
            }
            if (Sys.Browser.version === 7 && !document.documentMode) {
                var body = document.body,
                    rect = body.getBoundingClientRect(),
                    zoom = (rect.right-rect.left) / body.clientWidth;
                zoom = Math.round(zoom * 100);
                zoom = (zoom - zoom % 5) / 100;
                if (!isNaN(zoom) && (zoom !== 1)) {
                    offsetX = Math.round(offsetX / zoom);
                    offsetY = Math.round(offsetY / zoom);
                }
            }        
            if ((document.documentMode || 0) < 8) {
                offsetX -= documentElement.clientLeft;
                offsetY -= documentElement.clientTop;
            }
        }
        return new Sys.UI.Point(offsetX, offsetY);
    }
}
else if (isBrowser("Safari")) {
    $type.getLocation = function DomElement$getLocation_Safari(element) {
        /// <summary locid="M:J#Sys.UI.DomElement.getLocation">Gets the coordinates of a DOM element.</summary>
        /// <param name="element" domElement="true"></param>
        /// <returns type="Sys.UI.Point">A Point object with two fields, x and y, which contain the pixel coordinates of the element.</returns>
        var e = Function._validateParams(arguments, [
            {name: "element", domElement: true}
        ]);
        if (e) throw e;
        if ((element.window && (element.window === element)) || element.nodeType === 9) return new Sys.UI.Point(0,0);

        var offsetX = 0, offsetY = 0,
            parent,
            previous = null,
            previousStyle = null,
            currentStyle;
        for (parent = element; parent; previous = parent, previousStyle = currentStyle, parent = parent.offsetParent) {
            currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);
            var tagName = parent.tagName ? parent.tagName.toUpperCase() : null;

            if ((parent.offsetLeft || parent.offsetTop) &&
                ((tagName !== "BODY") || (!previousStyle || previousStyle.position !== "absolute"))) {
                offsetX += parent.offsetLeft;
                offsetY += parent.offsetTop;
            }

            if (previous && Sys.Browser.version >= 3) {
                offsetX += parseInt(currentStyle.borderLeftWidth);
                offsetY += parseInt(currentStyle.borderTopWidth);
            }
        }

        currentStyle = Sys.UI.DomElement._getCurrentStyle(element);
        var elementPosition = currentStyle ? currentStyle.position : null;
        if (elementPosition !== "absolute") {
            for (parent = element.parentNode; parent; parent = parent.parentNode) {
                tagName = parent.tagName ? parent.tagName.toUpperCase() : null;

                if ((tagName !== "BODY") && (tagName !== "HTML") && (parent.scrollLeft || parent.scrollTop)) {
                    offsetX -= (parent.scrollLeft || 0);
                    offsetY -= (parent.scrollTop || 0);
                }
                currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);
                var parentPosition = currentStyle ? currentStyle.position : null;

                if (parentPosition && (parentPosition === "absolute")) break;
            }
        }
        return new Sys.UI.Point(offsetX, offsetY);
    }
}
else {
    $type.getLocation = function DomElement$getLocation_Generic(element) {
        /// <summary locid="M:J#Sys.UI.DomElement.getLocation">Gets the coordinates of a DOM element.</summary>
        /// <param name="element" domElement="true"></param>
        /// <returns type="Sys.UI.Point">A Point object with two fields, x and y, which contain the pixel coordinates of the element.</returns>
        var e = Function._validateParams(arguments, [
            {name: "element", domElement: true}
        ]);
        if (e) throw e;
        if ((element.window && (element.window === element)) || element.nodeType === 9) return new Sys.UI.Point(0,0);

        var offsetX = 0, offsetY = 0,
            parent,
            previous = null,
            previousStyle = null,
            currentStyle = null;
        for (parent = element; parent; previous = parent, previousStyle = currentStyle, parent = parent.offsetParent) {
            var tagName = parent.tagName ? parent.tagName.toUpperCase() : null;
            currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);

            if ((parent.offsetLeft || parent.offsetTop) &&
                !((tagName === "BODY") &&
                (!previousStyle || previousStyle.position !== "absolute"))) {

                offsetX += parent.offsetLeft;
                offsetY += parent.offsetTop;
            }

            if (previous !== null && currentStyle) {
                if ((tagName !== "TABLE") && (tagName !== "TD") && (tagName !== "HTML")) {
                    offsetX += parseInt(currentStyle.borderLeftWidth) || 0;
                    offsetY += parseInt(currentStyle.borderTopWidth) || 0;
                }
                if (tagName === "TABLE" &&
                    (currentStyle.position === "relative" || currentStyle.position === "absolute")) {
                    offsetX += parseInt(currentStyle.marginLeft) || 0;
                    offsetY += parseInt(currentStyle.marginTop) || 0;
                }
            }
        }

        currentStyle = Sys.UI.DomElement._getCurrentStyle(element);
        var elementPosition = currentStyle ? currentStyle.position : null;
        if (elementPosition !== "absolute") {
            for (parent = element.parentNode; parent; parent = parent.parentNode) {
                tagName = parent.tagName ? parent.tagName.toUpperCase() : null;

                if ((tagName !== "BODY") && (tagName !== "HTML") && (parent.scrollLeft || parent.scrollTop)) {

                    offsetX -= (parent.scrollLeft || 0);
                    offsetY -= (parent.scrollTop || 0);

                    currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);
                    if (currentStyle) {
                        offsetX += parseInt(currentStyle.borderLeftWidth) || 0;
                        offsetY += parseInt(currentStyle.borderTopWidth) || 0;
                    }
                }
            }
        }
        return new Sys.UI.Point(offsetX, offsetY);
    }
}

$type.isDomElement = function DomElement$isDomElement(obj) {
    /// <summary locid="M:J#Sys.UI.DomElement.isDomElement">Determines if the given argument is a DOM element.</summary>
    /// <param name="obj"></param>
    /// <returns type="Boolean">True if the object is a DOM element, otherwise false.</returns>
    var e = Function._validateParams(arguments, [
        {name: "obj"}
    ]);
    if (e) throw e;
    return Sys._isDomElement(obj);
}

$type.removeCssClass = function DomElement$removeCssClass(element, className) {
    /// <summary locid="M:J#Sys.UI.DomElement.removeCssClass">Removes a CSS class from an element.</summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="className" type="String">The name of the CSS class to remove.</param>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "className", type: String}
    ]);
    if (e) throw e;
    var currentClassName = ' ' + element.className + ' ';
    var index = currentClassName.indexOf(' ' + className + ' ');
    if (index >= 0) {
        element.className = (currentClassName.substr(0, index) + ' ' +
            currentClassName.substring(index + className.length + 1, currentClassName.length)).trim();
    }
}

$type.resolveElement = function DomElement$resolveElement(elementOrElementId, containerElement) {
    /// <summary locid="M:J#Sys.UI.DomElement.resolveElement">Returns the element with the specified Id in the specified container, or the element if it is already an element.</summary>
    /// <param name="elementOrElementId" mayBeNull="true"></param>
    /// <param name="containerElement" domElement="true" optional="true" mayBeNull="true"></param>
    /// <returns domElement="true"></returns>
    var e = Function._validateParams(arguments, [
        {name: "elementOrElementId", mayBeNull: true},
        {name: "containerElement", mayBeNull: true, domElement: true, optional: true}
    ]);
    if (e) throw e;
    var el = elementOrElementId;
    if (!el) return null;
    if (typeof(el) === "string") {
        el = Sys.get("#" + el, containerElement);
        if (!el) {
            throw Error.argument("elementOrElementId", String.format(Sys.Res.elementNotFound, elementOrElementId));
        }
    }
    else if(!Sys.UI.DomElement.isDomElement(el)) {
        throw Error.argument("elementOrElementId", Sys.Res.expectedElementOrId);
    }
    return el;
}

$type.raiseBubbleEvent = function DomElement$raiseBubbleEvent(source, args) {
    /// <summary locid="M:J#Sys.UI.DomElement.raiseBubbleEvent">Raises a bubble event.</summary>
    /// <param name="source" domElement="true">The DOM element that triggers the event.</param>
    /// <param name="args" type="Sys.EventArgs">The event arguments.</param>
    var e = Function._validateParams(arguments, [
        {name: "source", domElement: true},
        {name: "args", type: Sys.EventArgs}
    ]);
    if (e) throw e;
    var target = source;
    while (target) {
        var control = target.control;
        if (control && control.onBubbleEvent && control.raiseBubbleEvent) {
            if (!control.onBubbleEvent(source, args)) {
                control._raiseBubbleEvent(source, args);
            }
            return;
        }
        target = target.parentNode;
    }
}

$type._ensureGet = function DomElement$_ensureGet(selector, context, arg) {
    var ret = Sys.get(selector, context);
    if (!ret && typeof(selector) === "string") {
        throw Error.invalidOperation(String.format(Sys.Res.selectorNotFound, selector));
    }
    else if (ret && !this.isDomElement(ret)) {
        throw Error.invalidOperation(String.format(Sys.Res.expectedDomElementOrSelector, arg));
    }
    return ret;
}

$type.setLocation = function DomElement$setLocation(element, x, y) {
    /// <summary locid="M:J#Sys.UI.DomElement.setLocation">Sets the position of an element.</summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="x" type="Number" integer="true"></param>
    /// <param name="y" type="Number" integer="true"></param>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "x", type: Number, integer: true},
        {name: "y", type: Number, integer: true}
    ]);
    if (e) throw e;
    var style = element.style;
    style.position = 'absolute';
    style.left = x + "px";
    style.top = y + "px";
}

$type.toggleCssClass = function DomElement$toggleCssClass(element, className) {
    /// <summary locid="M:J#Sys.UI.DomElement.toggleCssClass">Toggles a CSS class on and off o an element.</summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="className" type="String">The name of the CSS class to toggle.</param>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "className", type: String}
    ]);
    if (e) throw e;
    if (Sys.UI.DomElement.containsCssClass(element, className)) {
        Sys.UI.DomElement.removeCssClass(element, className);
    }
    else {
        Sys.UI.DomElement.addCssClass(element, className);
    }
}

$type.getVisibilityMode = function DomElement$getVisibilityMode(element) {
    /// <summary locid="M:J#Sys.UI.DomElement.getVisibilityMode"></summary>
    /// <param name="element" domElement="true"></param>
    /// <returns type="Sys.UI.VisibilityMode"></returns>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;
    return (element._visibilityMode === Sys.UI.VisibilityMode.hide) ?
        Sys.UI.VisibilityMode.hide :
        Sys.UI.VisibilityMode.collapse;
}
$type.setVisibilityMode = function DomElement$setVisibilityMode(element, value) {
    /// <summary locid="M:J#Sys.UI.DomElement.setVisibilityMode"></summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="value" type="Sys.UI.VisibilityMode"></param>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "value", type: Sys.UI.VisibilityMode}
    ]);
    if (e) throw e;
    Sys.UI.DomElement._ensureOldDisplayMode(element);
    if (element._visibilityMode !== value) {
        element._visibilityMode = value;
        if (Sys.UI.DomElement.getVisible(element) === false) {
            element.style.display = (value === Sys.UI.VisibilityMode.hide) ? element._oldDisplayMode : 'none';
        }
    }
}

$type.getVisible = function DomElement$getVisible(element) {
    /// <summary locid="M:J#Sys.UI.DomElement.getVisible"></summary>
    /// <param name="element" domElement="true"></param>
    /// <returns type="Boolean"></returns>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;
    var style = element.currentStyle || Sys.UI.DomElement._getCurrentStyle(element);
    return style ? (style.visibility !== 'hidden') && (style.display !== 'none') : true;
}
$type.setVisible = function DomElement$setVisible(element, value) {
    /// <summary locid="M:J#Sys.UI.DomElement.setVisible"></summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="value" type="Boolean"></param>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "value", type: Boolean}
    ]);
    if (e) throw e;
    if (value !== Sys.UI.DomElement.getVisible(element)) {
        Sys.UI.DomElement._ensureOldDisplayMode(element);
        var style = element.style;
        style.visibility = value ? 'visible' : 'hidden';
        style.display = (value || (element._visibilityMode === Sys.UI.VisibilityMode.hide)) ? element._oldDisplayMode : 'none';
    }
}

$type.setCommand = function DomElement$setCommand(commandSource, commandName, commandArgument, commandTarget) {
    /// <summary locid="M:J#Sys.UI.DomElement.setCommand">Causes a DOM element to raise a bubble event when clicked.</summary>
    /// <param name="commandSource">The DOM element, array of DOM elements, or DOM element selectors that causes the event when clicked.</param>
    /// <param name="commandName" type="String" mayBeNull="true">The name of the command to raise.</param>
    /// <param name="commandArgument" mayBeNull="true" optional="true">Optional command argument.</param>
    /// <param name="commandTarget" optional="true" mayBeNull="true">DOM element from which the command should start bubbling up.</param>
    var e = Function._validateParams(arguments, [
        {name: "commandSource"},
        {name: "commandName", type: String, mayBeNull: true},
        {name: "commandArgument", mayBeNull: true, optional: true},
        {name: "commandTarget", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    Sys.UI.DomEvent.addHandler(commandSource, 'click', function(ev) {
        var source = commandTarget || this;
        Sys.UI.DomElement.raiseBubbleEvent(source, new Sys.CommandEventArgs(commandName, commandArgument, this, ev)); 
    }, true /*autoRemove*/);
}

Sys.registerPlugin({
    name: "setCommand",
    dom: true,
    returnType: "Sys.ElementSet",
    description: "Causes a DOM element to raise a bubble event when clicked.",
    parameters: [
        {name: "commandName", type:"String", description: "The name of the command to raise."},
        {name: "commandArgument", description: "Optional command argument."},
        {name: "commandTarget", description: "DOM element from which the command should start bubbling up."}
    ],
    plugin: function(commandName, commandArgument, commandTarget) {
        var e = Function._validateParams(arguments, [
            {name: "commandName", type: String, mayBeNull: true},
            {name: "commandArgument", mayBeNull: true, optional: true},
            {name: "commandTarget", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        return this.addHandler('click', function(ev) {
            var source = commandTarget || this;
            Sys.UI.DomElement.raiseBubbleEvent(source, new Sys.CommandEventArgs(commandName, commandArgument, this, ev)); 
        }, true /*autoRemove*/);
    }
});

$type._ensureOldDisplayMode = function DomElement$_ensureOldDisplayMode(element) {
    if (!element._oldDisplayMode) {
        var style = element.currentStyle || this._getCurrentStyle(element);
        element._oldDisplayMode = style ? style.display : null;
        if (!element._oldDisplayMode || element._oldDisplayMode === 'none') {
            var tagName = element.tagName,
                mode = 'inline';
            if (/^(DIV|P|ADDRESS|BLOCKQUOTE|BODY|COL|COLGROUP|DD|DL|DT|FIELDSET|FORM|H1|H2|H3|H4|H5|H6|HR|IFRAME|LEGEND|OL|PRE|TABLE|TD|TH|TR|UL)$/i.test(tagName)) {
                mode = 'block';
            }
            else if (tagName.toUpperCase() === "LI") {
                mode = 'list-item';
            }
            element._oldDisplayMode = mode;
        }
    }
}

$type._getWindow = function DomElement$_getWindow(element) {
    var doc = element.ownerDocument || element.document || element;
    return doc.defaultView || doc.parentWindow;
}

$type._getCurrentStyle = function DomElement$_getCurrentStyle(element) {
    if (element.nodeType === 3) return null;
    var w = this._getWindow(element);
    if (element.documentElement) element = element.documentElement;
    var computedStyle = (w && (element !== w) && w.getComputedStyle) ?
        w.getComputedStyle(element, null) :
        element.currentStyle || element.style;
    return computedStyle;
}

$type._onDispose = function DomElement$_onDispose(element, fn) {
    var queue, d = element.dispose;
    if (d !== Sys.UI.DomElement._dispose) {
        element.dispose = Sys.UI.DomElement._dispose;
        element.__msajaxdispose = queue = [];
        if (typeof(d) === "function") {
            queue.push(d);
        }
    }
    else {
        queue = element.__msajaxdispose;
    }
    queue.push(fn);
}

$type._dispose = function DomElement$_dispose() {
    var queue = this.__msajaxdispose;
    if (queue) {
        for (var i = 0, l = queue.length; i < l; i++) {
            queue[i].apply(this);
        }
    }
    if (this.control && typeof(this.control.dispose) === "function") {
        this.control.dispose();
    }
    this.__msajaxdispose = null;
    this.dispose = null;
}
$type = Sys.IContainer = function IContainer() {
    throw Error.notImplemented();
}
$type.prototype = {
    addComponent: function IContainer$addComponent(component) {
        /// <summary locid="M:J#Sys.IContainer.addComponent"></summary>
        /// <param name="component" type="Sys.Component"></param>
        var e = Function._validateParams(arguments, [
            {name: "component", type: Sys.Component}
        ]);
        if (e) throw e;
        throw Error.notImplemented();
    },
    removeComponent: function IContainer$removeComponent(component) {
        /// <summary locid="M:J#Sys.IContainer.removeComponent"></summary>
        /// <param name="component" type="Sys.Component"></param>
        var e = Function._validateParams(arguments, [
            {name: "component", type: Sys.Component}
        ]);
        if (e) throw e;
        throw Error.notImplemented();
    },
    findComponent: function IContainer$findComponent(id) {
        /// <summary locid="M:J#Sys.IContainer.findComponent"></summary>
        /// <param name="id" type="String"></param>
        /// <returns type="Sys.Component"></returns>
        var e = Function._validateParams(arguments, [
            {name: "id", type: String}
        ]);
        if (e) throw e;
        throw Error.notImplemented();
    },
    getComponents: function IContainer$getComponents() {
        /// <summary locid="M:J#Sys.IContainer.getComponents"></summary>
        /// <returns type="Array" elementType="Sys.Component"></returns>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }
}
$type.registerInterface("Sys.IContainer");

$type = Sys.ApplicationLoadEventArgs = function ApplicationLoadEventArgs(components, isPartialLoad) {
    /// <summary locid="M:J#Sys.ApplicationLoadEventArgs.#ctor"></summary>
    /// <param name="components" type="Array" elementType="Sys.Component">The list of components that were created since the last time the load event was raised.</param>
    /// <param name="isPartialLoad" type="Boolean">True if the page is partially loading.</param>
    var e = Function._validateParams(arguments, [
        {name: "components", type: Array, elementType: Sys.Component},
        {name: "isPartialLoad", type: Boolean}
    ]);
    if (e) throw e;
    Sys.ApplicationLoadEventArgs.initializeBase(this);
    this._components = components;
    this._isPartialLoad = isPartialLoad;
}
$type.prototype = {
    get_components: function ApplicationLoadEventArgs$get_components() {
        /// <value type="Array" elementType="Sys.Component" locid="P:J#Sys.ApplicationLoadEventArgs.components">The list of components that were created since the last time the load event was raised.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._components;
    },
    get_isPartialLoad: function ApplicationLoadEventArgs$get_isPartialLoad() {
        /// <value type="Boolean" locid="P:J#Sys.ApplicationLoadEventArgs.isPartialLoad">True if the page is partially loading.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._isPartialLoad;
    }
}
$type.registerClass('Sys.ApplicationLoadEventArgs', Sys.EventArgs);
$type = Sys._Application = function _Application() {
    /// <summary locid="M:J#Sys.Application.#ctor"></summary>
    if (arguments.length !== 0) throw Error.parameterCount();
    Sys._Application.initializeBase(this);

    this._disposableObjects = [];
    this._components = {};
    this._createdComponents = [];
    this._secondPassComponents = [];

    this._unloadHandlerDelegate = Function.createDelegate(this, this._unloadHandler);
    Sys.UI.DomEvent.addHandler(window, "unload", this._unloadHandlerDelegate);
}
$type.prototype = {
    _deleteCount: 0,

    get_isCreatingComponents: function _Application$get_isCreatingComponents() {
        /// <value type="Boolean" locid="P:J#Sys.Application.isCreatingComponents"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return !!this._creatingComponents;
    },
    get_isDisposing: function _Application$get_isDisposing() {
        /// <value type="Boolean" locid="P:J#Sys.Application.isDisposing"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return !!this._disposing;
    },
    add_init: function _Application$add_init(handler) {
        /// <summary locid="E:J#Sys.Application.init"></summary>
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        if (this._initialized) {
            handler(this, Sys.EventArgs.Empty);
        }
        else {
            this._addHandler("init", handler);
        }
    },
    remove_init: function _Application$remove_init(handler) {
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        this._removeHandler("init", handler);
    },
    add_load: function _Application$add_load(handler) {
        /// <summary locid="E:J#Sys.Application.load"></summary>
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        this._addHandler("load", handler);
    },
    remove_load: function _Application$remove_load(handler) {
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        this._removeHandler("load", handler);
    },
    add_unload: function _Application$add_unload(handler) {
        /// <summary locid="E:J#Sys.Application.unload"></summary>
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        this._addHandler("unload", handler);
    },
    remove_unload: function _Application$remove_unload(handler) {
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        this._removeHandler("unload", handler);
    },
    addComponent: function _Application$addComponent(component) {
        /// <summary locid="M:J#Sys.Application.addComponent">Adds a top-level component to the application.</summary>
        /// <param name="component" type="Sys.Component">The component to add.</param>
        var e = Function._validateParams(arguments, [
            {name: "component", type: Sys.Component}
        ]);
        if (e) throw e;
        var id = component.get_id();
        if (!id) throw Error.invalidOperation(Sys.Res.cantAddWithoutId);
        if (typeof(this._components[id]) !== 'undefined') throw Error.invalidOperation(String.format(Sys.Res.appDuplicateComponent, id));
        this._components[id] = component;
    },
    beginCreateComponents: function _Application$beginCreateComponents() {
        /// <summary locid="M:J#Sys.Application.beginCreateComponents"></summary>
        if (arguments.length !== 0) throw Error.parameterCount();
        this._creatingComponents = true;
    },
    dispose: function _Application$dispose() {
        /// <summary locid="M:J#Sys.Application.dispose"></summary>
        if (arguments.length !== 0) throw Error.parameterCount();
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
        var e = Function._validateParams(arguments, [
            {name: "element"},
            {name: "childNodesOnly", type: Boolean}
        ]);
        if (e) throw e;
        if (element.nodeType === 1) {
            var d, c, i, list,
                allElements = element.getElementsByTagName("*"),
                length = allElements.length,
                children = new Array(length);
            for (i = 0; i < length; i++) {
                children[i] = allElements[i];
            }
            for (i = length - 1; i >= 0; i--) {
                var child = children[i];
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
        if (arguments.length !== 0) throw Error.parameterCount();
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
        var e = Function._validateParams(arguments, [
            {name: "id", type: String},
            {name: "parent", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        return (parent ?
            ((Sys.IContainer.isInstanceOfType(parent)) ?
                parent.findComponent(id) :
                parent[id] || null) :
            Sys.Application._components[id] || null);
    },
    getComponents: function _Application$getComponents() {
        /// <summary locid="M:J#Sys.Application.getComponents"></summary>
        /// <returns type="Array" elementType="Sys.Component"></returns>
        if (arguments.length !== 0) throw Error.parameterCount();
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
        if (arguments.length !== 0) throw Error.parameterCount();
        window.setTimeout(Function.createDelegate(this, this._doInitialize), 0);
    },
    _doInitialize: function _Application$_doInitialize() {
        if(!this.get_isInitialized() && !this._disposing) {
            Sys._Application.callBaseMethod(this, 'initialize');
            this._raiseInit();
            if (this.get_stateString) {
                if (Sys.WebForms && Sys.WebForms.PageRequestManager) {
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
                    this._ensureHistory();
                }
            }
            this.raiseLoad();
        }
    },
    notifyScriptLoaded: function _Application$notifyScriptLoaded() {
        /// <summary locid="M:J#Sys.Application.notifyScriptLoaded">Called by referenced scripts to indicate that they have completed loading. [Obsolete]</summary>
        if (arguments.length !== 0) throw Error.parameterCount();
    },
    registerDisposableObject: function _Application$registerDisposableObject(object) {
        /// <summary locid="M:J#Sys.Application.registerDisposableObject">Registers a disposable object with the application.</summary>
        /// <param name="object" type="Sys.IDisposable">The object to register.</param>
        var e = Function._validateParams(arguments, [
            {name: "object", type: Sys.IDisposable}
        ]);
        if (e) throw e;
        if (!this._disposing) {
            var objects = this._disposableObjects,
                i = objects.length;
            objects[i] = object;
            object.__msdisposeindex = i;
        }
    },
    raiseLoad: function _Application$raiseLoad() {
        /// <summary locid="M:J#Sys.Application.raiseLoad"></summary>
        if (arguments.length !== 0) throw Error.parameterCount();
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
        var e = Function._validateParams(arguments, [
            {name: "component", type: Sys.Component}
        ]);
        if (e) throw e;
        var id = component.get_id();
        if (id) delete this._components[id];
    },
    unregisterDisposableObject: function _Application$unregisterDisposableObject(object) {
        /// <summary locid="M:J#Sys.Application.unregisterDisposableObject">Unregisters a disposable object from the application.</summary>
        /// <param name="object" type="Sys.IDisposable">The object to unregister.</param>
        var e = Function._validateParams(arguments, [
            {name: "object", type: Sys.IDisposable}
        ]);
        if (e) throw e;
        if (!this._disposing) {
            var i = object.__msdisposeindex;
            if (typeof(i) === "number") {
                var disposableObjects = this._disposableObjects;
                delete disposableObjects[i];
                delete object.__msdisposeindex;
                if (++this._deleteCount > 1000) {
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

Sys.onReady(function() {
    Sys.Application._doInitialize();
});


$type = Sys.UI.Behavior = function Behavior(element) {
    /// <summary locid="M:J#Sys.UI.Behavior.#ctor"></summary>
    /// <param name="element" domElement="true">The DOM element the behavior is associated with.</param>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;
    Sys.UI.Behavior.initializeBase(this);
    this._element = element;
    var behaviors = (element._behaviors = element._behaviors || []);
    behaviors.push(this);
}
$type.prototype = {
    get_element: function Behavior$get_element() {
        /// <value domElement="true" locid="P:J#Sys.UI.Behavior.element">The DOM element this behavior is associated with</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._element;
    },
    get_id: function Behavior$get_id() {
        /// <value type="String" locid="P:J#Sys.UI.Behavior.id"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        var baseId = Sys.UI.Behavior.callBaseMethod(this, 'get_id');
        if (baseId) return baseId;
        var element = this._element;
        if (!element || !element.id) return '';
        return element.id + '$' + this.get_name();
    },
    get_name: function Behavior$get_name() {
        /// <value type="String" locid="P:J#Sys.UI.Behavior.name"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        if (this._name) return this._name;
        var name = Object.getTypeName(this);
        var i = name.lastIndexOf('.');
        if (i >= 0) name = name.substr(i + 1);
        if (!this._initialized) this._name = name;
        return name;
    },
    set_name: function Behavior$set_name(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        if ((value === '') || (value.charAt(0) === ' ') || (value.charAt(value.length - 1) === ' '))
            throw Error.argument('value', Sys.Res.invalidId);
        if (typeof(this._element[value]) !== 'undefined')
            throw Error.invalidOperation(String.format(Sys.Res.behaviorDuplicateName, value));
        if (this.get_isInitialized()) throw Error.invalidOperation(Sys.Res.cantSetNameAfterInit);
        this._name = value;
    },
    initialize: function Behavior$initialize() {
        Sys.UI.Behavior.callBaseMethod(this, 'initialize');
        var name = this.get_name();
        if (name) this._element[name] = this;
    },
    dispose: function Behavior$dispose() {
        Sys.UI.Behavior.callBaseMethod(this, 'dispose');
        var e = this._element;
        if (e) {
            var name = this.get_name();
            if (name) {
                e[name] = null;
            }
            var behaviors = e._behaviors;
            Array.remove(behaviors, this);
            if (!behaviors.length) {
                e._behaviors = null;
            }
            delete this._element;
        }
    }
}
$type.registerClass('Sys.UI.Behavior', Sys.Component);

$type.getBehaviorByName = function Behavior$getBehaviorByName(element, name) {
    /// <summary locid="M:J#Sys.UI.Behavior.getBehaviorByName">Gets a behavior with the specified name from the dom element.</summary>
    /// <param name="element" domElement="true">The DOM element to inspect.</param>
    /// <param name="name" type="String">The name of the behavior to look for.</param>
    /// <returns type="Sys.UI.Behavior" mayBeNull="true">The behaviors or null if it was not found.</returns>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "name", type: String}
    ]);
    if (e) throw e;
    var b = element[name];
    return (b && Sys.UI.Behavior.isInstanceOfType(b)) ? b : null;
}

$type.getBehaviors = function Behavior$getBehaviors(element) {
    /// <summary locid="M:J#Sys.UI.Behavior.getBehaviors">Gets a collection containing the behaviors associated with an element.</summary>
    /// <param name="element" domElement="true">The DOM element.</param>
    /// <returns type="Array" elementType="Sys.UI.Behavior">An array containing the behaviors associated with the DOM element.</returns>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;
    var behaviors = element._behaviors;
    return behaviors ? Array.clone(behaviors) : [];
}

Sys.UI.Behavior.getBehaviorsByType = function Behavior$getBehaviorsByType(element, type) {
    /// <summary locid="M:J#Sys.UI.Behavior.getBehaviorsByType">Gets an array of behaviors with the specified type from the dom element.</summary>
    /// <param name="element" domElement="true">The DOM element to inspect.</param>
    /// <param name="type" type="Type">The type of behavior to look for.</param>
    /// <returns type="Array" elementType="Sys.UI.Behavior">An array containing the behaviors of the specified type found on the element.  The array is empty if no behavior of this type was found.</returns>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "type", type: Type}
    ]);
    if (e) throw e;
    var behaviors = element._behaviors;
    var results = [];
    if (behaviors) {
        for (var i = 0, l = behaviors.length; i < l; i++) {
            var behavior = behaviors[i];
            if (type.isInstanceOfType(behavior)) {
                results.push(behavior);
            }
        }
    }
    return results;
}
$type = Sys.UI.VisibilityMode = function VisibilityMode() {
    /// <summary locid="M:J#Sys.UI.VisibilityMode.#ctor">Describes how a DOM element should disappear when its visible property is set to false.</summary>
    /// <field name="hide" type="Number" integer="true" static="true" locid="F:J#Sys.UI.VisibilityMode.hide">The element disappears but its space remains</field>
    /// <field name="collapse" type="Number" integer="true" static="true" locid="F:J#Sys.UI.VisibilityMode.collapse">The element disappears and the space it occupied is collapsed.</field>
    if (arguments.length !== 0) throw Error.parameterCount();
    throw Error.notImplemented();
}
$type.prototype = {
    hide: 0,
    collapse: 1
}
$type.registerEnum("Sys.UI.VisibilityMode");

$type = Sys.UI.Control = function Control(element) {
    /// <summary locid="M:J#Sys.UI.Control.#ctor"></summary>
    /// <param name="element" domElement="true">The DOM element the behavior is associated with.</param>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;
    if (element.control) throw Error.invalidOperation(Sys.Res.controlAlreadyDefined);
    Sys.UI.Control.initializeBase(this);

    this._element = element;
    element.control = this;
    var role = this.get_role();
    if (role) {
        element.setAttribute("role", role);
    }
}
$type.prototype = {
    _parent: null,
    _visibilityMode: Sys.UI.VisibilityMode.hide,

    get_element: function Control$get_element() {
        /// <value domElement="true" locid="P:J#Sys.UI.Control.element">The DOM element this behavior is associated with</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._element;
    },
    get_id: function Control$get_id() {
        /// <value type="String" locid="P:J#Sys.UI.Control.id"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._id || (this._element ? this._element.id : "");
    },
    get_parent: function Control$get_parent() {
        /// <value type="Sys.UI.Control" locid="P:J#Sys.UI.Control.parent"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        if (this._parent) return this._parent;
        if (!this._element) return null;
        
        var parentElement = this._element.parentNode;
        while (parentElement) {
            if (parentElement.control) {
                return parentElement.control;
            }
            parentElement = parentElement.parentNode;
        }
        return null;
    },
    set_parent: function Control$set_parent(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Sys.UI.Control}]);
        if (e) throw e;
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        var parents = [this];
        var current = value;
        while (current) {
            if (Array.contains(parents, current)) throw Error.invalidOperation(Sys.Res.circularParentChain);
            parents.push(current);
            current = current.get_parent();
        }
        this._parent = value;
    },
    get_role: function Control$get_role() {
        /// <value type="String" locid="P:J#Sys.UI.Control.role"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return null;
    },
    get_visibilityMode: function Control$get_visibilityMode() {
        /// <value type="Sys.UI.VisibilityMode" locid="P:J#Sys.UI.Control.visibilityMode"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        return Sys.UI.DomElement.getVisibilityMode(this._element);
    },
    set_visibilityMode: function Control$set_visibilityMode(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Sys.UI.VisibilityMode}]);
        if (e) throw e;
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        Sys.UI.DomElement.setVisibilityMode(this._element, value);
    },
    get_visible: function Control$get_visible() {
        /// <value type="Boolean" locid="P:J#Sys.UI.Control.visible"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        return Sys.UI.DomElement.getVisible(this._element);
    },
    set_visible: function Control$set_visible(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Boolean}]);
        if (e) throw e;
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        Sys.UI.DomElement.setVisible(this._element, value)
    },
    addCssClass: function Control$addCssClass(className) {
        /// <summary locid="M:J#Sys.UI.Control.addCssClass">Adds a CSS class to the control if it doesn't already have it.</summary>
        /// <param name="className" type="String">The name of the CSS class to add.</param>
        var e = Function._validateParams(arguments, [
            {name: "className", type: String}
        ]);
        if (e) throw e;
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        Sys.UI.DomElement.addCssClass(this._element, className);
    },
    dispose: function Control$dispose() {
        Sys.UI.Control.callBaseMethod(this, 'dispose');
        if (this._element) {
            this._element.control = null;
            delete this._element;
        }
        if (this._parent) delete this._parent;
    },
    onBubbleEvent: function Control$onBubbleEvent(source, args) {
        /// <summary locid="M:J#Sys.UI.Control.onBubbleEvent"></summary>
        /// <param name="source">The object that triggered the event.</param>
        /// <param name="args" type="Sys.EventArgs">The event arguments.</param>
        /// <returns type="Boolean">False, because the event was not handled and should bubble up further. Derived classes should override that and return true whenever they handle the event to prevent it from bubbling up.</returns>
        var e = Function._validateParams(arguments, [
            {name: "source"},
            {name: "args", type: Sys.EventArgs}
        ]);
        if (e) throw e;
        return false;
    },
    raiseBubbleEvent: function Control$raiseBubbleEvent(source, args) {
        /// <summary locid="M:J#Sys.UI.Control.raiseBubbleEvent"></summary>
        /// <param name="source">The object that triggered the event.</param>
        /// <param name="args" type="Sys.EventArgs">The event arguments.</param>
        var e = Function._validateParams(arguments, [
            {name: "source"},
            {name: "args", type: Sys.EventArgs}
        ]);
        if (e) throw e;
        this._raiseBubbleEvent(source, args);
    },
    _raiseBubbleEvent: function Control$_raiseBubbleEvent(source, args) {
        var currentTarget = this.get_parent();
        while (currentTarget) {
            if (currentTarget.onBubbleEvent(source, args)) {
                return;
            }
            currentTarget = currentTarget.get_parent();
        }
    },
    removeCssClass: function Control$removeCssClass(className) {
        /// <summary locid="M:J#Sys.UI.Control.removeCssClass">Removes a CSS class from the control.</summary>
        /// <param name="className" type="String">The name of the CSS class to remove.</param>
        var e = Function._validateParams(arguments, [
            {name: "className", type: String}
        ]);
        if (e) throw e;
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        Sys.UI.DomElement.removeCssClass(this._element, className);
    },
    toggleCssClass: function Control$toggleCssClass(className) {
        /// <summary locid="M:J#Sys.UI.Control.toggleCssClass">Toggles a CSS class on and off on the control.</summary>
        /// <param name="className" type="String">The name of the CSS class to toggle.</param>
        var e = Function._validateParams(arguments, [
            {name: "className", type: String}
        ]);
        if (e) throw e;
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        Sys.UI.DomElement.toggleCssClass(this._element, className);
    }
}
$type.registerClass('Sys.UI.Control', Sys.Component);

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("ComponentModel", null, execute);
}
else {
	execute();
}

})();
var $get, $create, $addHandler, $addHandlers, $clearHandlers;
