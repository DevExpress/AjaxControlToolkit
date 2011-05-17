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
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "eventObject"}
    ]);
    if (e) throw e;
    //#endif
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
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
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
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
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
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "elements"},
        {name: "eventName", type: String},
        {name: "handler", type: Function},
        {name: "autoRemove", type: Boolean, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    if (eventName === "error") throw Error.invalidOperation(Sys.Res.addHandlerCantBeUsedForError);
    //#endif
    Sys.query(elements).each(function() {
        var nodeType = this.nodeType;
        if (nodeType === 3 || nodeType === 2 || nodeType === 8) return;
        //#if DEBUG
        Sys.UI.DomEvent._ensureDomNode(this);
        //#endif
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
                // window.event can be denied access in some rare circumstances (DevDiv 68929)
                var ex, ev = {};
                // We want to use the window for the event element, not the window for this script (DevDiv 63167)
                try {ev = Sys.UI.DomElement._getWindow(element).event} catch(ex) {}
                return handler.call(element, new Sys.UI.DomEvent(ev));
            }
            this.attachEvent('on' + eventName, browserHandler);
        }
        eventCache.push({handler: handler, browserHandler: browserHandler, autoRemove: autoRemove });
        if (autoRemove) {
            // element.dispose called when an updatepanel refreshes or disposeElement called.
            Sys.UI.DomElement._onDispose(this, Sys.UI.DomEvent._disposeHandlers);
        }
    });
}

Sys.registerPlugin({
    name: "addHandler",
    dom: true,
    //#if DEBUG
    returnType: "Sys.ElementSet",
    description: "A cross-browser way to add a DOM event handler to an element.",
    parameters: [
        {name: "eventName", type: "String", description: "The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'."},
        {name: "handler", type: "Function", description: "The event handler to add."},
        {name: "autoRemove", type: "Boolean", description: "Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or Sys.Application.disposeElement is called."}
    ],
    //#endif
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
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "elements"},
        {name: "events", type: Object},
        {name: "handlerOwner", mayBeNull: true, optional: true},
        {name: "autoRemove", type: Boolean, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    Sys.query(elements).each(function() {
        var nodeType = this.nodeType;
        if (nodeType === 3 || nodeType === 2 || nodeType === 8) return;
        //#if DEBUG
        Sys.UI.DomEvent._ensureDomNode(this);
        //#endif
        for (var name in events) {
            var handler = events[name];
            //#if DEBUG
            if (typeof(handler) !== 'function') throw Error.invalidOperation(Sys.Res.cantAddNonFunctionhandler);
            //#endif
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
    //#if DEBUG
    returnType: "Sys.ElementSet",
    description: "Adds a list of event handlers to an element. If a handlerOwner is specified, delegates are created with each of the handlers.",
    parameters: [
        {name: "events", type: "Object", description: "A dictionary of event handlers."},
        {name: "handlerOwner", description: "The owner of the event handlers that will be the this pointer for the delegates that will be created from the handlers."},
        {name: "autoRemove", type: "Boolean", description: "Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or Sys.Application.disposeElement is called."}
    ],
    //#endif
    plugin: function (events, handlerOwner, autoRemove) {
        Sys.UI.DomEvent.addHandlers(this.get(), events, handlerOwner, autoRemove);
        return this;
    }
});

$clearHandlers = $type.clearHandlers = function DomEvent$clearHandlers(elements) {
    /// <summary locid="M:J#Sys.UI.DomEvent.clearHandlers">Clears all the event handlers that were added to the element or array of elements.</summary>
    /// <param name="elements">The element or text node, or an array of elements or text nodes. You may also pass a DOM selector or array of DOM selectors.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "elements"}
    ]);
    if (e) throw e;
    //#endif
    Sys.query(elements).each(function() {
        var nodeType = this.nodeType;
        if (nodeType === 3 || nodeType === 2 || nodeType === 8) return;
        //#if DEBUG
        Sys.UI.DomEvent._ensureDomNode(this);
        //#endif
        Sys.UI.DomEvent._clearHandlers(this, false);
    });
}

Sys.registerPlugin({
    name: "clearHandlers",
    dom: true,
    //#if DEBUG
    returnType: "Sys.ElementSet",
    description: "Clears all the event handlers that were added to the element or array of elements.",
    //#endif
    plugin: function() {
        Sys.UI.DomEvent.clearHandlers(this.get());
        return this;
    }
});

$type._clearHandlers = function DomEvent$_clearHandlers(elements, autoRemoving) {
    Sys.query(elements).each(function() {
        var nodeType = this.nodeType;
        if (nodeType === 3 || nodeType === 2 || nodeType === 8) return;
        //#if DEBUG
        Sys.UI.DomEvent._ensureDomNode(this);
        //#endif
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
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "elements"},
        {name: "eventName", type: String},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    //#endif
    Sys.UI.DomEvent._removeHandler(elements, eventName, handler);
}
$type._removeHandler = function DomEvent$_removeHandler(elements, eventName, handler) {
    Sys.query(elements).each(function() {
        var nodeType = this.nodeType;
        if (nodeType === 3 || nodeType === 2 || nodeType === 8) return;
        //#if DEBUG
        Sys.UI.DomEvent._ensureDomNode(this);
        //#endif
        var browserHandler = null;
        //#if DEBUG
        if ((typeof(this._events) !== 'object') || !this._events) throw Error.invalidOperation(Sys.Res.eventHandlerInvalid);
        //#endif
        var cache = this._events[eventName];
        //#if DEBUG
        if (!(cache instanceof Array)) throw Error.invalidOperation(Sys.Res.eventHandlerInvalid);
        //#endif
        for (var i = 0, l = cache.length; i < l; i++) {
            if (cache[i].handler === handler) {
                browserHandler = cache[i].browserHandler;
                break;
            }
        }
        //#if DEBUG
        if (typeof(browserHandler) !== 'function') throw Error.invalidOperation(Sys.Res.eventHandlerInvalid);
        //#endif
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
    //#if DEBUG
    returnType: "Sys.ElementSet",
    description: "A cross-browser way to remove a DOM event handler from an element.",
    parameters: [
        {name: "eventName", type: "String", description: "The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'."},
        {name: "handler", type: "Function", description: "The event handler to remove."}
    ],
    //#endif
    plugin: function (eventName, handler) {
        Sys.UI.DomEvent.removeHandler(this.get(), eventName, handler);
        return this;
    }
});


//#if DEBUG
$type._ensureDomNode = function DomEvent$_ensureDomNode(element) {
    // DevDiv Bugs 100697: Accessing element.document causes dynamic script nodes to load prematurely.
    // DevDiv Bugs 124696: Firefox warns on undefined property element.tagName, added first part of IF
    // DevDiv Bugs 146697: tagName needs to be case insensitive to work with xhtml content type
    if (element && element.tagName && (element.tagName.toUpperCase() === "SCRIPT")) return;
    
    var doc = element ? (element.ownerDocument || element.document || element) : null;
    // Can't use _getWindow here and compare to the element to check if it's a window
    // because the object Safari exposes as document.defaultView is not the window (DevDiv 100229)
    // Looking at the document property instead to include window in DOM nodes, then comparing to the
    // document for this element and finally look for the nodeType property.
    if (!element ||
        ((typeof(element.document) !== 'object') && (element != doc) && (typeof(element.nodeType) !== 'number'))) {
        throw Error.argument("element", Sys.Res.argumentDomNode);
    }
}
//#endif
