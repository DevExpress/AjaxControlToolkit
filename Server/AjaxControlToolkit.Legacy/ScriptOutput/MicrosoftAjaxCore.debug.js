// (c) 2010 CodePlex Foundation
(function(window, Sys) {

var merge = function _merge(target) {
    target = target || {};
    foreach(arguments, function(o) {
        if (o) {
            forIn(o, function(v, n) {
                target[n] = v;
            });
        }
    }, 1);
    return target;
}
var forIn = function _forIn(obj, callback) {
    for (var x in obj) {
        callback(obj[x], x);
    }
}
var foreach = function _foreach(arr, callback, start) {
    var cancelled;
    if (arr) {
        arr = arr !== window && typeof(arr.nodeType) === "undefined" &&
            (arr instanceof Array || 
            (typeof(arr.length) === 'number' && (typeof(arr.callee) === "function" || (arr.item && typeof(arr.nodeType) === "undefined") && !arr.addEventListener && !arr.attachEvent)))
            ? arr : [arr];
        for (var i = start||0, l = arr.length; i < l; i++) {
            if (callback(arr[i], i)) {
                cancelled = true;
                break;
            }
        }
    }
    return !cancelled;
}
var callIf = function _callIf(obj, name, args) {
    var fn = obj[name],
        exists = typeof(fn) === "function";
    if (exists) fn.call(obj, args);
    return exists;
}
if (!Sys || !Sys.loader) {
    function append(target) {
        target = target || {};
        foreach(arguments, function(o) {
            if (o) {
                forIn(o, function(v, n) {
                    if (typeof(target[n]) === "undefined") target[n] = v;
                });
            }
        }, 1);
        return target;
    }

    var attachEvent = !!document.attachEvent;
  
    function getAndDelete(obj, field) {
        var r = obj[field];
        delete obj[field];
        return r;
    }
    function foreachCall(obj, field, args) {
        foreach(getAndDelete(obj, field), function(callback) {
            callback.apply(null, args||[]);
        });
    }
    function lazyget(obj, name, value) {
        return obj ? (obj[name] = obj[name] || value) : value;
    }
    function lazypush(obj, name, value) {
        lazyget(obj, name, []).push(value);
    }
    function lazyset(obj, name, key, value) {
        lazyget(obj, name, {})[key] = value;
    }
    function all(tag, element) {
        return (element||document).getElementsByTagName(tag);
    }
    function createElement(tag) {
        return document.createElement(tag);
    }
    function listenOnce(target, name, ieName, callback, isReadyState, isScript) {
        function onEvent() {
            if (!attachEvent || !isReadyState || /loaded|complete/.test(target.readyState)) {
                if (attachEvent) {
                    target.detachEvent(ieName || ("on" + name), onEvent);
                }
                else {
                    target.removeEventListener(name, onEvent, false);
                    if (isScript) {
                        target.removeEventListener("error", onEvent, false);
                    }
                }
                callback.apply(target);
                target = null;
            }
        }
        if (attachEvent) {
            target.attachEvent(ieName || ("on" + name), onEvent);
        }
        else {
            if (target.addEventListener) {
            target.addEventListener(name, onEvent, false);
            }
            if (isScript) {
                target.addEventListener("error", onEvent, false);
            }
        }
    }
    function raiseDomReady() {
        if (Sys._domReady) {
            Sys._2Pass(getAndDelete(Sys, "_domReadyQueue"));
        }
    }
    function raiseOnReady() {
        var ready = Sys._ready;
        if (!ready && Sys._domReady && !(Sys.loader && Sys.loader._loading)) {
            Sys._ready = ready = true;
        }
        if (ready) {
            Sys._2Pass(getAndDelete(Sys, "_readyQueue"));
        }
    }
    window.Sys = Sys = append(Sys, {
        version: [3, 0, 31106, 0],
        __namespace: true,
        debug: true,
        scripts: {},
        activateDom: true,
        composites: {},
        components: {},
        plugins: {},
        create: {},
        converters: {},
        _domLoaded: function _domLoaded() {
            if (Sys._domChecked) return;
            Sys._domChecked = true;
            function domReady() {
                if (!Sys._domReady) {
                    Sys._domReady = true;
                    var autoRequire = Sys._autoRequire;
                    if (autoRequire) {
                        Sys.require(autoRequire, function() {
                            Sys._autoRequire = null;
                            foreachCall(Sys, "_autoQueue");
                        }, autoToken);
                    }
                    raiseDomReady();
                    raiseOnReady();
                }
            }
            listenOnce(window, "load", null, domReady);

            var check;
            if (attachEvent) {
                if ((window == window.top) && document.documentElement.doScroll) {
                    var timeout, er, el = createElement("div");
                    check = function() {
                        try {
                            el.doScroll("left");
                        }
                        catch (er) {
                            timeout = window.setTimeout(check, 0);
                            return;
                        }
                        el = null;
                        domReady();
                    }
                    check();
                }
                else {
                    listenOnce(document, null, "onreadystatechange", domReady, true);
                }
            }
            else if (document.addEventListener) {
                listenOnce(document, "DOMContentLoaded", null, domReady);
            }
        },
        _getById: function _getById(found, id, single, includeSelf, element, filter) {
            if (element) {
                if (includeSelf && (element.id === id)) {
                    found.push(element);
                }
                else if (!filter) {
                    foreach(all("*", element), function(element) {
                        if (element.id === id) {
                            found.push(element);
                            return true;
                        }
                    });
                }
            }
            else {
                var e = document.getElementById(id);
                if (e) found.push(e);
            }
            return found.length;
        },
        _getByClass: function _getByClass(found, targetClass, single, includeSelf, element, filter) {
            function pushIfMatch(element) {
                var ret, className = element.className;
                if (className && ((className === targetClass) || (className.indexOf(' ' + targetClass) >= 0) || (className.indexOf(targetClass + ' ') >= 0))) {
                    found.push(element);
                    ret = true;
                }
                return ret;
            }
            var i, l, nodes;
            if (includeSelf && pushIfMatch(element) && single) {
                return true;
            }
            if (!filter) {
                element = element || document;
                var finder = element.querySelectorAll || element.getElementsByClassName;
                if (finder) {
                    if (element.querySelectorAll) targetClass = "." + targetClass;
                    nodes = finder.call(element, targetClass);
                    for (i = 0, l = nodes.length; i < l; i++) {
                        found.push(nodes[i]);
                        if (single) return true;
                    }
                }
                else {
                    nodes = all("*", element);
                    for (i = 0, l = nodes.length; i < l; i++) {
                        if (pushIfMatch(nodes[i]) && single) {
                            return true;
                        }
                    }
                }
            }
        },
        query: function query(selector, context) {
            /// <summary>Queries the DOM for a set of DOM elements.</summary>
            /// <validationOptions enabled="false" />
            /// <param name="selector">Selector for a set of DOM elements based on id (#&lt;id>), class (.&lt;name>), or tag name (&lt;tagname>). Also supports an array of DOM elements or selectors. More complex selectors may be used if jQuery is loaded.</param>
            /// <param name="context" optional="true" mayBeNull="true">A DOM element (exclusive), array of DOM elements (inclusive), or other Sys.ElementSet or Sys.UI.TemplateContext (exclusive) to restrict the search within.</param>
            /// <returns type="Sys.ElementSet">An object representing the set of matching elements.</returns>
            return new Sys.ElementSet(selector, context);
        },
        get: function get(selector, context) {
            /// <summary>Queries the DOM for a single DOM element.</summary>
            /// <validationOptions enabled="false" />
            /// <param name="selector">
            /// Selector for a DOM element based on id (#&lt;id>), class (.&lt;name>), or tag name (&lt;tagname>). More complex selectors may be used if jQuery is loaded.
            /// If multiple elements match the selector, the first one is returned.
            /// </param>
            /// <param name="context" optional="true" mayBeNull="true">An element, array of elements, or Sys.UI.TemplateContext to restrict the query within.</param>
            /// <returns>The matching element, or null if none match.</returns>
            return (context && typeof(context.get) === "function") ?
                context.get(selector) :
                this._find(selector, context, true);
        },
        _find: function _find(selector, context, single, filter) {
            var found = [],
                selectors;
            if (typeof(selector) === "string") {
                selectors = [selector];
            }
            else {
                selectors = selector;
            }
            var includeSelf = context instanceof Array,
                simpleNonTag = /^([\$#\.])((\w|[$:\.\-])+)$/,
                tag = /^((\w+)|\*)$/;
            if ((typeof(context) === "string") || (context instanceof Array)) {
                context = Sys._find(context);
            }
            if (context instanceof Sys.ElementSet) {
                context = context.get();
            }
            foreach(selectors, function(selector) {
                if (typeof(selector) !== "string") {
                    if (filter) {
                        if (contains(context, selector)) {
                            found.push(selector);
                        }
                    }
                    else {
                        found.push(selector);
                    }
                }
                else {
                    var match = simpleNonTag.exec(selector);
                    if (match && match.length === 4) {
                        selector = match[2];
                        var type = match[1];
                        if (type === "$") {
                            Sys._getComponent(found, selector, context);
                        }
                        else {
                            var finder = type === "#" ? Sys._getById : Sys._getByClass;
                            if (context) {
                                foreach(context, function(node) {
                                    if (node.nodeType === 1) {
                                        return finder(found, selector, single, includeSelf, node, filter);
                                    }
                                });
                            }
                            else {
                                finder(found, selector, single);
                            }
                        }
                    }
                    else if (tag.test(selector)) {
                        if (context instanceof Array) {
                            foreach(context, function(node) {
                                if (node.nodeType === 1) {
                                    if (includeSelf && (selector === "*" || (node.tagName.toLowerCase() === selector))) {
                                        found.push(node);
                                        if (single) return true;
                                    }
                                    if (!filter) {
                                        if(!foreach(all(selector, node), function(node) {
                                            found.push(node);
                                            if (single) return true;
                                        })) {
                                            return true;
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            var nodes = all(selector, context);
                            if (single) {
                                if (nodes[0]) {
                                    found.push(nodes[0]);
                                }
                                return true;
                            }
                            foreach(nodes, function(node) {
                                found.push(node);
                            });
                        }
                    }
                    else if (window.jQuery) {
                        if (!filter) {
                            found.push.apply(found, jQuery(selector, context).get());
                        }
                        if (includeSelf) {
                            found.push.apply(found, jQuery(context).filter(selector).get());
                        }
                    }
                }
            });
            return found.length ? (single ? (found[0] || null) : found) : null;
        },
        onDomReady: function onDomReady(callback) {
            /// <summary>Registers a function to be called when the DOM is ready.</summary>
            /// <validationOptions enabled="false" />
            /// <param name="callback" type="Function"></param>
            lazypush(this, "_domReadyQueue", callback);
            raiseDomReady();
        },
        onReady: function onReady(callback) {
            /// <summary>Registers a function to be called when the DOM is ready and when all required resources have been loaded.</summary>
            /// <validationOptions enabled="false" />
            /// <param name="callback" type="Function"></param>
            lazypush(this, "_readyQueue", callback);
            raiseOnReady();
        },
        _set: function(instance, properties) {
            forIn(properties, function(value, field) {
                callIf(instance, "add_" + field, value) ||
                callIf(instance, "set_" + field, value) ||
                (instance[field] = value);
            });
        }
    });

    Sys._getComponent = Sys._getComponent || function() { }
    
    Sys._2Pass = Sys._2Pass || function _2Pass(callback) {
       foreach(callback, function(c) { c(); });
    }

    var obj;
    if (!Sys.ElementSet) {
obj = Sys.ElementSet = function(selector, context) {
    /// <summary>Represents a set of DOM elements.</summary>
    /// <param name="selector">The DOM selector, array of DOM selectors, or array of DOM elements to query the document for.</param>
    /// <param name="context">A DOM selector (exclusive), A DOM element (exclusive), array of DOM elements (inclusive), or other Sys.ElementSet (exclusive) to restrict the search within.</param>
    this._elements = ((typeof(context) === "object") && typeof(context.query) === "function") ?
        context.query(selector).get() :
        Sys._find(selector, context) || [];
}
obj.prototype = {
    __class: true,
    components: function(type, index) {
        /// <summary>Gets the set of controls and behaviors associated with the current DOM elements.</summary>
        /// <param name="type" type="Function" mayBeNull="true" optional="true">Type to limit the search to.</param>
        /// <param name="index" type="Number" mayBeNull="true" optional="true">Index of the component to limit to.</param>
        /// <returns type="Sys.ComponentSet" />
        var elementSet = new Sys.ElementSet(this.get());
        return new Sys.ComponentSet(elementSet, type, index);
    },
    component: function(type, index) {
        /// <summary>Get the first control or behavior associated with the current set of DOM elements.</summary>
        /// <param name="type" type="Function" mayBeNull="true" optional="true">Type to limit the search to.</param>
        /// <param name="index" type="Number" mayBeNull="true" optional="true">Index of the component to return.</param>
        /// <returns type="Object" mayBeNull="true" />
        return this.components(type, index).get(0);
    },
    each: function(callback) {
        /// <summary>Enumerates all the matched elements, calling the given callback for each with the current element as the context.
        /// The callback may return false to cancel enumeration.</summary>
        /// <returns type="Sys.ElementSet"/>
        var elements = this._elements;
        for (var i = 0, l = elements.length; i < l; i++) {
            if (callback.call(elements[i], i) === false) break;
        }
        return this;
    },
    get: function(index) {
        /// <summary>Retrieves the element at the specified index.</summary>
        /// <param name="index" type="Number">The index of the element to retrieve. Omit to return all elements as an array.</param>
        /// <returns isDomElement="true">The element at the given index, or an array of all the matched elements.</returns>
        var elements = this._elements;
        return (typeof(index) === "undefined") ? (Array.apply(null, elements)) : (elements[index] || null);
    },
    find: function(selector) {
        /// <summary>Searches the current set of DOM elements with the given selector, including descendents.</summary>
        /// <param name="selector">DOM selector or array of DOM selectors to search with.</param>
        /// <returns type="Sys.ElementSet">A new element set with the matched elements.</returns>
        return new Sys.ElementSet(selector, this);
    },
    filter: function(selector) {
        /// <summary>Filters the current set of DOM elements by the given selector, excluding descendents.</summary>
        /// <param name="selector">DOM selector or array of elements to filter by.</param>
        /// <returns type="Sys.ElementSet">A new element set with the matched elements.</returns>
        return new Sys.ElementSet(Sys._find(selector, this._elements, false, true));
    }
}
    }
    if (!Sys.ComponentSet) {
obj = Sys.ComponentSet = function ComponentSet(elementSet, query, index) {
    /// <summary></summary>
    /// <param name="elementSet" type="Sys.ElementSet" mayBeNull="true" optional="true"></param>
    /// <param name="query" mayBeNull="true" optional="true">The type of component to filter by, or an array of components to include.</param>
    /// <param name="index" type="Number" mayBeNull="true" optional="true">The index of the component to retrieve from the filtered list.</param>
    this._elementSet = elementSet || (elementSet = new Sys.ElementSet());
    this._components = this._execute(elementSet, query, index);
}
obj.prototype = {
    __class: true,
    setProperties: function ComponentSet$setProperties(properties) {
        /// <summary>Sets properties on the matched components.</summary>
        /// <param name="properties" type="Object" mayBeNull="false">Object with the names and values of the properties to set.</param>
        /// <returns type="Sys.ComponentSet" />
        return this.each(function() {
            Sys._set(this, properties);
        });
    },
    get: function ComponentSet$get(index) {
        /// <summary>Returns the component at the specified index, or an array of all matches if not specified.</summary>
        /// <param name="index" type="Number" mayBeNull="true" optional="true"></param>
        /// <returns type="Object" mayBeNull="true"/>
        var components = this._components;
        return (typeof(index) === "undefined") ? (Array.apply(null, components)) : (components[index || 0] || null);
    },
    each: function ComponentSet$each(callback) {
        /// <summary>Enumerate all the found components. The index of the component are passed as parameters to a callback. You may return 'false' to cancel the enumeration.</summary>
        /// <param name="callback" type="Function" mayBeNull="false">Function called for each component.</param>
        /// <returns type="Sys.ComponentSet" />
        foreach(this._components, function(c, i) {
            if (callback.call(c, i) === false) {
                return true;
            }
        });
        return this;
    },
    elements: function ComponentSet$elements() {
        /// <summary>Returns the underlying set of elements this component collection came from.</summary>
        /// <returns type="Sys.ElementSet" />
        return this._elementSet;
    },
    _execute: function ComponentSet$_execute(elementSet, query, index) {
        var components = [];
        function match(c) {
            var ctor;
            return (c instanceof query) ||
                ((ctor = c.constructor) && (
                    (ctor === query) ||
                    (ctor.inheritsFrom && ctor.inheritsFrom(query)) ||
                    (ctor.implementsInterface && ctor.implementsInterface(query))));
        }
        if (query instanceof Array) {
            components.push.apply(components, query);
        }
        else {
            elementSet.each(function() {
                var c = this.control;
                if (c && (!query || match(c))) {
                    components.push(c);
                }
                foreach(this._behaviors, function(b) {
                    if (!query || match(b)) {
                        components.push(b);
                    }
                });
            });
        }
        if ((typeof(index) !== "undefined")) {
            if (components[index]) {
                components = [components[index]];
            }
            else {
                components = [];
            }
        }
        return components;
    }
}
    }
    
    obj = null;
}
    var getCreate = function _getCreate(options, isPlugin) {
        var body = [],
            arglist = [],
            type = options.type,
            typeName = options.typeName || (type ? type.getName() : ""),
            isBehavior = options._isBehavior,
            description = (options && options.description) || 
                          (type && ("Creates an instance of the type '" + typeName  + "' and sets the given properties.")) ||
                          "";
        body.push("/// <summary>", description, "</summary>\n");
        foreach(options && options.parameters, function(parameter) {
            var name = parameter, type = '', desc = '';
            if (typeof(parameter) !== "string") {
                name = parameter.name;
                type = parameter.type||'';
                desc = parameter.description||'';
            }
            arglist.push(name);
            body.push('/// <param name="', name, '"');
            if (type) {
                body.push(' type="', type, '"');
            }
            body.push('>', desc, '</param>\n');
        });
        var returnType;
        if (!isPlugin) {
            arglist.push("properties");
            body.push('/// <param name="properties" type="Object" mayBeNull="true" optional="true">Additional properties to set on the component.</param>\n');
            returnType = isBehavior ? 'Sys.ComponentSet' : typeName;
        }
        else {
            returnType = options.returnType;
        }
        if (returnType) {
            body.push('/// <returns type="', returnType, '" />\n');
        }
        if (isPlugin) {
            body.push('return Sys.plugins["', options.name, '"].plugin.apply(this, arguments);');
        }
        else {
            body.push('return Sys._createComp.call(this, arguments.callee._component, arguments.callee._component.defaults, arguments);');
        }
        arglist.push(body.join(''));
    
        var fn = Function.apply(null, arglist);
        if (!isPlugin) {
            fn._component = options;
        }
        return fn;
        
    }
    Sys._getCreate = getCreate;

function execute() {

var $type, $prototype;
Sys._foreach = foreach;
Sys._forIn = forIn;
Sys._merge = merge;
Sys._callIf = callIf;

$type = Function;
$type.__typeName = 'Function';
$type.__class = true;

$type.createCallback = function Function$createCallback(method, context) {
    /// <summary locid="M:J#Function.createCallback">Creates a callback function that retains the parameter initially used during its creation.   The callback is used without parameter but this will call the actual method with the parameter.   This is especially useful when setting up a handler for a DOM event that must retain a parameter   despite the DOM event handler needing to be a function with the event object as the only parameter.   In this case, the function will be called with the event as the first parameter and the context   as the second.   If the callback is called with an arbitrary list of parameters, the context is appended.</summary>
    /// <param name="method" type="Function">The function for which the callback is created.</param>
    /// <param name="context" mayBeNull="true">The parameter for the function.</param>
    /// <returns type="Function">The callback function.</returns>
    var e = Function._validateParams(arguments, [
        {name: "method", type: Function},
        {name: "context", mayBeNull: true}
    ]);
    if (e) throw e;


    return function() {
        var l = arguments.length;
        if (l > 0) {
            var args = [];
            for (var i = 0; i < l; i++) {
                args[i] = arguments[i];
            }
            args[l] = context;
            return method.apply(this, args);
        }
        return method.call(this, context);
    }
}

$type.createDelegate = function Function$createDelegate(instance, method) {
    /// <summary locid="M:J#Function.createDelegate">Creates a delegate function that retains the context from its creation   (i.e. what 'this' means from within its scope).   This is especially useful when setting up an event handler to point to an object method   that needs to use the 'this' pointer from within its scope.</summary>
    /// <param name="instance" mayBeNull="true">The object instance that will be the context for the function (i.e. what 'this' means from within its scope).</param>
    /// <param name="method" type="Function">The function from which the delegate is created.</param>
    /// <returns type="Function">The delegate function.</returns>
    var e = Function._validateParams(arguments, [
        {name: "instance", mayBeNull: true},
        {name: "method", type: Function}
    ]);
    if (e) throw e;


    return function() {
        return method.apply(instance, arguments);
    }
}

$type.emptyFunction = $type.emptyMethod = function Function$emptyMethod() {
    /// <summary locid="M:J#Function.emptyMethod">A function that does nothing.</summary>
}

$type.validateParameters = function Function$validateParameters(parameters, expectedParameters, validateParameterCount) {
    /// <summary locid="M:J#Function.validateParameters">Validates the parameters to a method are as expected.</summary>
    /// <param name="parameters"></param>
    /// <param name="expectedParameters"></param>
    /// <param name="validateParameterCount" type="Boolean" optional="true" mayBeNull="true">True if extra parameters are prohibited, false if they should be ignored. The default is true.</param>
    /// <returns type="Error" mayBeNull="true"></returns>
    var e = Function._validateParams(arguments, [
        {name: "parameters"},
        {name: "expectedParameters"},
        {name: "validateParameterCount", type: Boolean, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    return Function._validateParams(parameters, expectedParameters, validateParameterCount);
}

$type._validateParams = function Function$_validateParams(params, expectedParams, validateParameterCount) {
    var e, expectedLength = expectedParams.length;
    validateParameterCount = validateParameterCount !== false;
    e = Function._validateParameterCount(params, expectedParams, validateParameterCount);
    if (e) {
        e.popStackFrame();
        return e;
    }
    for (var i = 0, l = params.length; i < l; i++) {
        var expectedParam = expectedParams[Math.min(i, expectedLength - 1)],
            paramName = expectedParam.name;
        if (expectedParam.parameterArray) {
            paramName += "[" + (i - expectedLength + 1) + "]";
        }
        else if (!validateParameterCount && (i >= expectedLength)) {
            break;
        }
        e = Function._validateParameter(params[i], expectedParam, paramName);
        if (e) {
            e.popStackFrame();
            return e;
        }
    }
    return null;
}

$type._validateParameterCount = function Function$_validateParameterCount(params, expectedParams, validateParameterCount) {
    var i, error,
        expectedLen = expectedParams.length,
        actualLen = params.length;
    if (actualLen < expectedLen) {
        var minParams = expectedLen;
        for (i = 0; i < expectedLen; i++) {
            var param = expectedParams[i];
            if (param.optional || param.parameterArray) {
                minParams--;
            }
        }        
        if (actualLen < minParams) {
            error = true;
        }
    }
    else if (validateParameterCount && (actualLen > expectedLen)) {
        error = true;      
        for (i = 0; i < expectedLen; i++) {
            if (expectedParams[i].parameterArray) {
                error = false;
                break;
            }
        }  
    }

    if (error) {
        var e = Error.parameterCount();
        e.popStackFrame();
        return e;
    }

    return null;
}

$type._validateParameter = function Function$_validateParameter(param, expectedParam, paramName) {
    var e,
        expectedType = expectedParam.type,
        expectedInteger = !!expectedParam.integer,
        expectedDomElement = !!expectedParam.domElement,
        mayBeNull = !!expectedParam.mayBeNull;

    e = Function._validateParameterType(param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName);
    if (e) {
        e.popStackFrame();
        return e;
    }

    var expectedElementType = expectedParam.elementType,
        elementMayBeNull = !!expectedParam.elementMayBeNull;
    if (expectedType === Array && typeof(param) !== "undefined" && param !== null &&
        (expectedElementType || !elementMayBeNull)) {
        var expectedElementInteger = !!expectedParam.elementInteger,
            expectedElementDomElement = !!expectedParam.elementDomElement;
        for (var i=0; i < param.length; i++) {
            var elem = param[i];
            e = Function._validateParameterType(elem, expectedElementType,
                expectedElementInteger, expectedElementDomElement, elementMayBeNull,
                paramName + "[" + i + "]");
            if (e) {
                e.popStackFrame();
                return e;
            }
        }
    }

    return null;
}

$type._validateParameterType = function Function$_validateParameterType(param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName) {
    var e, i;

    if (typeof(param) === "undefined" || param === null) {
        if (mayBeNull) {
            return null;
        }
        e = param === null ? Error.argumentNull(paramName) : Error.argumentUndefined(paramName);
        e.popStackFrame();
        return e;
    }

    if (expectedType && expectedType.__enum) {
        if (typeof(param) !== 'number') {
            e = Error.argumentType(paramName, Object.getType(param), expectedType);
            e.popStackFrame();
            return e;
        }
        if ((param % 1) === 0) {
            var values = expectedType.prototype;
            if (!expectedType.__flags || (param === 0)) {
                for (i in values) {
                    if (values[i] === param) return null;
                }
            }
            else {
                var v = param;
                for (i in values) {
                    var vali = values[i];
                    if (vali === 0) continue;
                    if ((vali & param) === vali) {
                        v -= vali;
                    }
                    if (v === 0) return null;
                }
            }
        }
        e = Error.argumentOutOfRange(paramName, param, String.format(Sys.Res.enumInvalidValue, param, expectedType.getName()));
        e.popStackFrame();
        return e;
    }

    if (expectedDomElement && (!Sys._isDomElement(param) || (param.nodeType === 3))) {
        e = Error.argument(paramName, Sys.Res.argumentDomElement);
        e.popStackFrame();
        return e;
    }

    if (expectedType && !Sys._isInstanceOfType(expectedType, param)) {
        e = Error.argumentType(paramName, Object.getType(param), expectedType);
        e.popStackFrame();
        return e;
    }

    if (expectedType === Number && expectedInteger) {
        if ((param % 1) !== 0) {
            e = Error.argumentOutOfRange(paramName, param, Sys.Res.argumentInteger);
            e.popStackFrame();
            return e;
        }
    }

    return null;
}
$type = Error;
$type.__typeName = 'Error';
$type.__class = true;

Sys._errorArgument = function(kind, paramName, message) {
    var name = "Sys.Argument" + kind + "Exception";
    var displayMessage = name + ": " + (message || Sys.Res["argument"+kind]);
    if (paramName) {
        displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
    }

    var err = Error.create(displayMessage, { name: name, paramName: paramName });
    err.popStackFrame();
    err.popStackFrame();
    return err;
}

Sys._error = function(kind, message, defaultMessage) {
    var name = "Sys." + kind + "Exception";
    var displayMessage = name + ": " + (message || Sys.Res[defaultMessage]);
    var err = Error.create(displayMessage, {name: name});
    err.popStackFrame();
    err.popStackFrame();
    return err;
}

$type.create = function Error$create(message, errorInfo) {
    /// <summary locid="M:J#Error.create">Use this method to create a new error.</summary>
    /// <param name="message" type="String" optional="true" mayBeNull="true">The error message.</param>
    /// <param name="errorInfo" optional="true" mayBeNull="true">A plain JavaScript object that contains extended information about the error.   The object should have a 'name' field that contains a string that identifies the error   and any additional fields that are necessary to fully describe the error.</param>
    /// <returns type="Error">An Error object.</returns>
    var e = Function._validateParams(arguments, [
        {name: "message", type: String, mayBeNull: true, optional: true},
        {name: "errorInfo", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;

    var err = new Error(message);
    err.message = message;

    if (errorInfo) {
        for (var v in errorInfo) {
            err[v] = errorInfo[v];
        }
    }

    err.popStackFrame();
    return err;
}

$type.argument = function Error$argument(paramName, message) {
    /// <summary locid="M:J#Error.argument">Creates an ArgumentException with a specified error message   and the name of the parameter that caused this exception.</summary>
    /// <param name="paramName" type="String" optional="true" mayBeNull="true">The name of the parameter that caused the exception.</param>
    /// <param name="message" type="String" optional="true" mayBeNull="true">A message that describes the error.</param>
    /// <returns>An Error instance that represents an ArgumentException.</returns>
    var e = Function._validateParams(arguments, [
        {name: "paramName", type: String, mayBeNull: true, optional: true},
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    return Sys._errorArgument("", paramName, message);
}

$type.argumentNull = function Error$argumentNull(paramName, message) {
    /// <summary locid="M:J#Error.argumentNull">Creates an ArgumentNullException with a specified error message   and the name of the parameter that caused this exception.</summary>
    /// <param name="paramName" type="String" optional="true" mayBeNull="true">The name of the parameter that caused the exception.</param>
    /// <param name="message" type="String" optional="true" mayBeNull="true">A message that describes the error.</param>
    /// <returns>An Error instance that represents an ArgumentNullException.</returns>
    var e = Function._validateParams(arguments, [
        {name: "paramName", type: String, mayBeNull: true, optional: true},
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    return Sys._errorArgument("Null", paramName, message);
}

$type.argumentOutOfRange = function Error$argumentOutOfRange(paramName, actualValue, message) {
    /// <summary locid="M:J#Error.argumentOutOfRange">Creates an ArgumentOutOfRangeException with a specified error message   and the name and actual value of the parameter that caused this exception.</summary>
    /// <param name="paramName" type="String" optional="true" mayBeNull="true">The name of the parameter that caused the exception.</param>
    /// <param name="actualValue" optional="true" mayBeNull="true">The actual value of the parameter.</param>
    /// <param name="message" type="String" optional="true" mayBeNull="true">A message that describes the error.</param>
    /// <returns>An Error instance that represents an ArgumentOutOfRangeException.</returns>
    var e = Function._validateParams(arguments, [
        {name: "paramName", type: String, mayBeNull: true, optional: true},
        {name: "actualValue", mayBeNull: true, optional: true},
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;

    var displayMessage = "Sys.ArgumentOutOfRangeException: " + (message || Sys.Res.argumentOutOfRange);
    if (paramName) {
        displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
    }

    if (typeof(actualValue) !== "undefined" && actualValue !== null) {
        displayMessage += "\n" + String.format(Sys.Res.actualValue, actualValue);
    }

    var err = Error.create(displayMessage, {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: paramName,
        actualValue: actualValue
    });
    err.popStackFrame();
    return err;
}

$type.argumentType = function Error$argumentType(paramName, actualType, expectedType, message) {
    /// <summary locid="M:J#Error.argumentType">Creates an ArgumentTypeException with a specified error message   and the name, actual type, and expected type of the parameter that   caused this exception.</summary>
    /// <param name="paramName" type="String" optional="true" mayBeNull="true">The name of the parameter that caused the exception.</param>
    /// <param name="actualType" type="Type" optional="true" mayBeNull="true">The actual type of the parameter value.</param>
    /// <param name="expectedType" type="Type" optional="true" mayBeNull="true">The expected type of the parameter value.</param>
    /// <param name="message" type="String" optional="true" mayBeNull="true">A message that describes the error.</param>
    /// <returns>An Error instance that represents an ArgumentTypeException.</returns>
    var e = Function._validateParams(arguments, [
        {name: "paramName", type: String, mayBeNull: true, optional: true},
        {name: "actualType", type: Type, mayBeNull: true, optional: true},
        {name: "expectedType", type: Type, mayBeNull: true, optional: true},
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;

    var displayMessage = "Sys.ArgumentTypeException: ";
    if (message) {
        displayMessage += message;
    }
    else if (actualType && expectedType) {
        displayMessage +=
            String.format(Sys.Res.argumentTypeWithTypes, actualType.getName(), expectedType.getName());
    }
    else {
        displayMessage += Sys.Res.argumentType;
    }

    if (paramName) {
        displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
    }

    var err = Error.create(displayMessage, {
        name: "Sys.ArgumentTypeException",
        paramName: paramName,
        actualType: actualType,
        expectedType: expectedType
    });
    err.popStackFrame();
    return err;
}

$type.argumentUndefined = function Error$argumentUndefined(paramName, message) {
    /// <summary locid="M:J#Error.argumentUndefined">Creates an ArgumentUndefinedException with a specified error message   and the name of the parameter that caused this exception.</summary>
    /// <param name="paramName" type="String" optional="true" mayBeNull="true">The name of the parameter that caused the exception.</param>
    /// <param name="message" type="String" optional="true" mayBeNull="true">A message that describes the error.</param>
    /// <returns>An Error instance that represents an ArgumentUndefinedException.</returns>
    var e = Function._validateParams(arguments, [
        {name: "paramName", type: String, mayBeNull: true, optional: true},
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    return Sys._errorArgument("Undefined", paramName, message);
}

$type.format = function Error$format(message) {
    /// <summary locid="M:J#Error.format">Creates a format error.</summary>
    /// <param name="message" type="String" optional="true" mayBeNull="true">The error message.</param>
    /// <returns>An Error object that represents a FormatException.</returns>
    var e = Function._validateParams(arguments, [
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    return Sys._error("Format", message, "format");
}

$type.invalidOperation = function Error$invalidOperation(message) {
    /// <summary locid="M:J#Error.invalidOperation">Creates an invalid operation error.</summary>
    /// <param name="message" type="String" optional="true" mayBeNull="true">The error message.</param>
    /// <returns>An Error instance that represents an InvalidOperationException.</returns>
    var e = Function._validateParams(arguments, [
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    return Sys._error("InvalidOperation", message, "invalidOperation");
}

$type.notImplemented = function Error$notImplemented(message) {
    /// <summary locid="M:J#Error.notImplemented">Creates a not implemented error.</summary>
    /// <param name="message" type="String" optional="true" mayBeNull="true">The error message.</param>
    /// <returns>An Error instance that represents a NotImplementedException.</returns>
    var e = Function._validateParams(arguments, [
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    return Sys._error("NotImplemented", message, "notImplemented");
}

$type.parameterCount = function Error$parameterCount(message) {
    /// <summary locid="M:J#Error.parameterCount">Creates a ParameterCountException with a specified error message.</summary>
    /// <param name="message" type="String" optional="true" mayBeNull="true">A message that describes the error.</param>
    /// <returns>An Error instance that represents a ParameterCountException.</returns>
    var e = Function._validateParams(arguments, [
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    return Sys._error("ParameterCount", message, "parameterCount");
}

$type.prototype.popStackFrame = function Error$popStackFrame() {
    /// <summary locid="M:J#checkParam">Updates the fileName and lineNumber fields based on the next frame in the   stack trace. Call this method whenever an instance of Error is returned   from a function. This makes the fileName and lineNumber reported in the   FireFox console point to the location where the exception was thrown, not   the location where the instance of Error was created.</summary>
    if (arguments.length !== 0) throw Error.parameterCount();


    if (typeof(this.stack) === "undefined" || this.stack === null ||
        typeof(this.fileName) === "undefined" || this.fileName === null ||
        typeof(this.lineNumber) === "undefined" || this.lineNumber === null) {
        return;
    }

    var stackFrames = this.stack.split("\n");

    var currentFrame = stackFrames[0];
    var pattern = this.fileName + ":" + this.lineNumber;
    while(typeof(currentFrame) !== "undefined" &&
          currentFrame !== null &&
          currentFrame.indexOf(pattern) < 0) {
        stackFrames.shift();
        currentFrame = stackFrames[0];
    }

    var nextFrame = stackFrames[1];

    if (typeof(nextFrame) === "undefined" || nextFrame === null) {
        return;
    }

    var nextFrameParts = nextFrame.match(/@(.*):(\d+)$/);
    if (typeof(nextFrameParts) === "undefined" || nextFrameParts === null) {
        return;
    }

    this.fileName = nextFrameParts[1];

    this.lineNumber = parseInt(nextFrameParts[2]);

    stackFrames.shift();
    this.stack = stackFrames.join("\n");
}
$type = Object;
$type.__typeName = 'Object';
$type.__class = true;

$type.getType = function Object$getType(instance) {
    /// <summary locid="M:J#Object.getType"></summary>
    /// <param name="instance">The object for which the type must be returned.</param>
    /// <returns type="Type">The type of the object.</returns>
    var e = Function._validateParams(arguments, [
        {name: "instance"}
    ]);
    if (e) throw e;
    var ctor = instance.constructor;
    if (!ctor || (typeof(ctor) !== "function") || !ctor.__typeName || (ctor.__typeName === 'Object')) {
        return Object;
    }
    return ctor;
}

$type.getTypeName = function Object$getTypeName(instance) {
    /// <summary locid="M:J#Object.getTypeName"></summary>
    /// <param name="instance">The object for which the type name must be returned.</param>
    /// <returns type="String">The name of the type of the object.</returns>
    var e = Function._validateParams(arguments, [
        {name: "instance"}
    ]);
    if (e) throw e;
    return Object.getType(instance).getName();
}
$type = String;
$type.__typeName = 'String';
$type.__class = true;

$prototype = $type.prototype;
$prototype.endsWith = function String$endsWith(suffix) {
    /// <summary locid="M:J#String.endsWith">Determines whether the end of this instance matches the specified string.</summary>
    /// <param name="suffix" type="String">A string to compare to.</param>
    /// <returns type="Boolean">true if suffix matches the end of this instance; otherwise, false.</returns>
    var e = Function._validateParams(arguments, [
        {name: "suffix", type: String}
    ]);
    if (e) throw e;
    return (this.substr(this.length - suffix.length) === suffix);
}

$prototype.startsWith = function String$startsWith(prefix) {
    /// <summary locid="M:J#String.startsWith">Determines whether the beginning of this instance matches the specified string.</summary>
    /// <param name="prefix" type="String">The String to compare.</param>
    /// <returns type="Boolean">true if prefix matches the beginning of this string; otherwise, false.</returns>
    var e = Function._validateParams(arguments, [
        {name: "prefix", type: String}
    ]);
    if (e) throw e;
    return (this.substr(0, prefix.length) === prefix);
}

$prototype.trim = function String$trim() {
    /// <summary locid="M:J#String.trim">Removes all leading and trailing white-space characters from the current String object.</summary>
    /// <returns type="String">The string that remains after all white-space characters are removed from the start and end of the current String object.</returns>
    if (arguments.length !== 0) throw Error.parameterCount();
    return this.replace(/^\s+|\s+$/g, '');
}

$prototype.trimEnd = function String$trimEnd() {
    /// <summary locid="M:J#String.trimEnd">Removes all trailing white spaces from the current String object.</summary>
    /// <returns type="String">The string that remains after all white-space characters are removed from the end of the current String object.</returns>
    if (arguments.length !== 0) throw Error.parameterCount();
    return this.replace(/\s+$/, '');
}

$prototype.trimStart = function String$trimStart() {
    /// <summary locid="M:J#String.trimStart">Removes all leading white spaces from the current String object.</summary>
    /// <returns type="String">The string that remains after all white-space characters are removed from the start of the current String object.</returns>
    if (arguments.length !== 0) throw Error.parameterCount();
    return this.replace(/^\s+/, '');
}

$type.format = function String$format(format, args) {
    /// <summary locid="M:J#String.format">Replaces the format items in a specified String with the text equivalents of the values of   corresponding object instances. The invariant culture will be used to format dates and numbers.</summary>
    /// <param name="format" type="String">A format string.</param>
    /// <param name="args" parameterArray="true" mayBeNull="true">The objects to format.</param>
    /// <returns type="String">A copy of format in which the format items have been replaced by the   string equivalent of the corresponding instances of object arguments.</returns>
    var e = Function._validateParams(arguments, [
        {name: "format", type: String},
        {name: "args", mayBeNull: true, parameterArray: true}
    ]);
    if (e) throw e;
    return String._toFormattedString(false, arguments);
}

$type._toFormattedString = function String$_toFormattedString(useLocale, args) {
    var result = '';
    var format = args[0];

    for (var i=0;;) {
        var open = format.indexOf('{', i);
        var close = format.indexOf('}', i);
        if ((open < 0) && (close < 0)) {
            result += format.slice(i);
            break;
        }
        if ((close > 0) && ((close < open) || (open < 0))) {
            if (format.charAt(close + 1) !== '}') {
                throw Error.argument('format', Sys.Res.stringFormatBraceMismatch);
            }
            result += format.slice(i, close + 1);
            i = close + 2;
            continue;
        }

        result += format.slice(i, open);
        i = open + 1;

        if (format.charAt(i) === '{') {
            result += '{';
            i++;
            continue;
        }

        if (close < 0) throw Error.argument('format', Sys.Res.stringFormatBraceMismatch);


        var brace = format.substring(i, close);
        var colonIndex = brace.indexOf(':');
        var argNumber = parseInt((colonIndex < 0)? brace : brace.substring(0, colonIndex), 10) + 1;
        if (isNaN(argNumber)) throw Error.argument('format', Sys.Res.stringFormatInvalid);
        var argFormat = (colonIndex < 0)? '' : brace.substring(colonIndex + 1);

        var arg = args[argNumber];
        if (typeof(arg) === "undefined" || arg === null) {
            arg = '';
        }

        if (arg.toFormattedString) {
            result += arg.toFormattedString(argFormat);
        }
        else if (useLocale && arg.localeFormat) {
            result += arg.localeFormat(argFormat);
        }
        else if (arg.format) {
            result += arg.format(argFormat);
        }
        else
            result += arg.toString();

        i = close + 1;
    }

    return result;
}
$type = Boolean;
$type.__typeName = 'Boolean';
$type.__class = true;

$type.parse = function Boolean$parse(value) {
    /// <summary locid="M:J#Boolean.parse">Creates a bool from its string representation.</summary>
    /// <param name="value" type="String">"true" or "false".</param>
    /// <returns type="Boolean"></returns>
    var e = Function._validateParams(arguments, [
        {name: "value", type: String}
    ], false);
    if (e) throw e;
    var v = value.trim().toLowerCase(),
        r;
    if (v === 'false') {
        r = false;
    }
    else if (v === 'true') {
        r = true;
    }
    else {
        throw Error.argumentOutOfRange('value', value, Sys.Res.boolTrueOrFalse);
    }
    return r;
}
$type = Date;
$type.__typeName = 'Date';
$type.__class = true;
$type = Number;
$type.__typeName = 'Number';
$type.__class = true;
$type = RegExp;
$type.__typeName = 'RegExp';
$type.__class = true;
if (!window) this.window = this;

window.Type = $type = Function;

$type.__fullyQualifiedIdentifierRegExp = new RegExp("^[^.0-9 \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\]([^ \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\]*[^. \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\])?$", "i");
$type.__identifierRegExp = new RegExp("^[^.0-9 \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\][^. \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\]*$", "i");

$prototype = $type.prototype;
$prototype.callBaseMethod = function Type$callBaseMethod(instance, name, baseArguments) {
    /// <summary locid="M:J#Type.callBaseMethod"></summary>
    /// <param name="instance">The instance for the base method. Usually 'this'.</param>
    /// <param name="name" type="String">The name of the base method.</param>
    /// <param name="baseArguments" type="Array" optional="true" mayBeNull="true" elementMayBeNull="true">The arguments to pass to the base method.</param>
    /// <returns>The return value of the base method.</returns>
    var e = Function._validateParams(arguments, [
        {name: "instance"},
        {name: "name", type: String},
        {name: "baseArguments", type: Array, mayBeNull: true, optional: true, elementMayBeNull: true}
    ]);
    if (e) throw e;
    var baseMethod = Sys._getBaseMethod(this, instance, name);
    if (!baseMethod) throw Error.invalidOperation(String.format(Sys.Res.methodNotFound, name));
    return baseArguments ? baseMethod.apply(instance, baseArguments) : baseMethod.apply(instance);
}

$prototype.getBaseMethod = function Type$getBaseMethod(instance, name) {
    /// <summary locid="M:J#Type.getBaseMethod">Use this method to get the base implementation of a method from the base class.</summary>
    /// <param name="instance">The instance for which the base method is needed. Usually 'this'.</param>
    /// <param name="name" type="String">The name of the method to get.</param>
    /// <returns type="Function" mayBeNull="true">The base method.</returns>
    var e = Function._validateParams(arguments, [
        {name: "instance"},
        {name: "name", type: String}
    ]);
    if (e) throw e;
    return Sys._getBaseMethod(this, instance, name);
}

$prototype.getBaseType = function Type$getBaseType() {
    /// <summary locid="M:J#Type.getBaseType"></summary>
    /// <returns type="Type" mayBeNull="true">The base type.</returns>
    if (arguments.length !== 0) throw Error.parameterCount();
    return (typeof(this.__baseType) === "undefined") ? null : this.__baseType;
}

$prototype.getInterfaces = function Type$getInterfaces() {
    /// <summary locid="M:J#Type.getInterfaces"></summary>
    /// <returns type="Array" elementType="Type" mayBeNull="false" elementMayBeNull="false">A copy of the list of interfaces that the type implements.</returns>
    if (arguments.length !== 0) throw Error.parameterCount();
    var result = [];
    var type = this;
    while(type) {
        var interfaces = type.__interfaces;
        if (interfaces) {
            for (var i = 0, l = interfaces.length; i < l; i++) {
                var interfaceType = interfaces[i];
                if (!Array.contains(result, interfaceType)) {
                    result.push(interfaceType);
                }
            }
        }
        type = type.__baseType;
    }
    return result;
}

$prototype.getName = function Type$getName() {
    /// <summary locid="M:J#Type.getName"></summary>
    /// <returns type="String">The name of the type.</returns>
    if (arguments.length !== 0) throw Error.parameterCount();
    return (typeof(this.__typeName) === "undefined") ? "" : this.__typeName;
}

$prototype.implementsInterface = function Type$implementsInterface(interfaceType) {
    /// <summary locid="M:J#Type.implementsInterface"></summary>
    /// <param name="interfaceType" type="Type">The interface to test.</param>
    /// <returns type="Boolean">True if the type implements the interface.</returns>
    var e = Function._validateParams(arguments, [
        {name: "interfaceType", type: Type}
    ]);
    if (e) throw e;
    this.resolveInheritance();

    var interfaceName = interfaceType.getName();
    var cache = this.__interfaceCache;
    if (cache) {
        var cacheEntry = cache[interfaceName];
        if (typeof(cacheEntry) !== 'undefined') return cacheEntry;
    }
    else {
        cache = this.__interfaceCache = {};
    }

    var baseType = this;
    while (baseType) {
        var interfaces = baseType.__interfaces;
        if (interfaces && Array.indexOf(interfaces, interfaceType) !== -1) {
            return cache[interfaceName] = true;
        }

        baseType = baseType.__baseType;
    }

    return cache[interfaceName] = false;
}

$prototype.inheritsFrom = function Type$inheritsFrom(parentType) {
    /// <summary locid="M:J#Type.inheritsFrom"></summary>
    /// <param name="parentType" type="Type">The type to test.</param>
    /// <returns type="Boolean">True if the type inherits from parentType.</returns>
    var e = Function._validateParams(arguments, [
        {name: "parentType", type: Type}
    ]);
    if (e) throw e;
    this.resolveInheritance();
    return Sys._inheritsFrom(this, parentType);
}

Sys._inheritsFrom = function _inheritsFrom(type, parentType) {
    var ret;
    if (parentType) {
        var baseType = type.__baseType;
        while (baseType) {
            if (baseType === parentType) {
                ret = true;
                break;
            }
            baseType = baseType.__baseType;
        }
    }
    return !!ret;
}

$prototype.initializeBase = function Type$initializeBase(instance, baseArguments) {
    /// <summary locid="M:J#Type.initializeBase">This method initializes the base type in the context   of a given instance object (to keep track of the base type, and to   effectively inherit the object model of the base class, and   initializing members of the base class).   This should be called from the derived class constructor.</summary>
    /// <param name="instance">The object to initialize base types for. Usually 'this'.</param>
    /// <param name="baseArguments" type="Array" optional="true" mayBeNull="true" elementMayBeNull="true">The arguments for the base constructor.</param>
    /// <returns>The instance.</returns>
    var e = Function._validateParams(arguments, [
        {name: "instance"},
        {name: "baseArguments", type: Array, mayBeNull: true, optional: true, elementMayBeNull: true}
    ]);
    if (e) throw e;
    if (!Sys._isInstanceOfType(this, instance)) throw Error.argumentType('instance', Object.getType(instance), this);

    this.resolveInheritance();
    var baseType = this.__baseType;
    if (baseType) {
        baseArguments ? baseType.apply(instance, baseArguments) : baseType.apply(instance);
    }

    return instance;
}

$prototype.isImplementedBy = function Type$isImplementedBy(instance) {
    /// <summary locid="M:J#Type.isImplementedBy"></summary>
    /// <param name="instance" mayBeNull="true">The object on which the interface must be tested.</param>
    /// <returns type="Boolean">True if the instance implements the interface.</returns>
    var e = Function._validateParams(arguments, [
        {name: "instance", mayBeNull: true}
    ]);
    if (e) throw e;
    if (typeof(instance) === "undefined" || instance === null) return false;

    var instanceType = Object.getType(instance);
    return !!(instanceType.implementsInterface && instanceType.implementsInterface(this));
}

$prototype.isInstanceOfType = function Type$isInstanceOfType(instance) {
    /// <summary locid="M:J#Type.isInstanceOfType"></summary>
    /// <param name="instance" mayBeNull="true">The object on which the type must be tested.</param>
    /// <returns type="Boolean">True if the object is an instance of the type or one of its derived types.</returns>
    var e = Function._validateParams(arguments, [
        {name: "instance", mayBeNull: true}
    ]);
    if (e) throw e;
    return Sys._isInstanceOfType(this, instance);
}

$prototype.registerClass = function Type$registerClass(typeName, baseType, interfaceTypes) {
    /// <summary locid="M:J#Type.registerClass">Registers a class (represented by its ctor function), and   optional base type, followed by any number of interfaces.</summary>
    /// <param name="typeName" type="String">The fully-qualified name of the type.</param>
    /// <param name="baseType" type="Type" optional="true" mayBeNull="true">The base type.</param>
    /// <param name="interfaceTypes" parameterArray="true" type="Type">One or several interfaces that the type implements.</param>
    /// <returns type="Type">The registered type.</returns>
    var e = Function._validateParams(arguments, [
        {name: "typeName", type: String},
        {name: "baseType", type: Type, mayBeNull: true, optional: true},
        {name: "interfaceTypes", type: Type, parameterArray: true}
    ]);
    if (e) throw e;
    if (!Type.__fullyQualifiedIdentifierRegExp.test(typeName)) throw Error.argument('typeName', Sys.Res.notATypeName);
    var parsedName;
    try {
        parsedName = eval(typeName);
    }
    catch(e) {
        throw Error.argument('typeName', Sys.Res.argumentTypeName);
    }
    if (parsedName !== this) throw Error.argument('typeName', Sys.Res.badTypeName);
    if (Sys.__registeredTypes[typeName]) throw Error.invalidOperation(String.format(Sys.Res.typeRegisteredTwice, typeName));

    if ((arguments.length > 1) && (typeof(baseType) === 'undefined')) throw Error.argumentUndefined('baseType');
    var prototype = this.prototype;
    prototype.constructor = this;
    this.__typeName = typeName;
    this.__class = true;
    if (baseType) {
        this.__baseType = baseType;
        this.__basePrototypePending = true;
    }
    Sys.__upperCaseTypes[typeName.toUpperCase()] = this;

    if (interfaceTypes) {
        var interfaces = this.__interfaces = [];
        this.resolveInheritance();
        for (var i = 2, l = arguments.length; i < l; i++) {
            var interfaceType = arguments[i];
            if (!interfaceType.__interface) throw Error.argument('interfaceTypes[' + (i - 2) + ']', Sys.Res.notAnInterface);
            for (var methodName in interfaceType.prototype) {
                var method = interfaceType.prototype[methodName];
                if (!prototype[methodName]) {
                    prototype[methodName] = method;
                }
            }
            interfaces.push(interfaceType);
        }
    }
    Sys.__registeredTypes[typeName] = true;
    return this;
}

Sys.registerComponent = function registerComponent(type, options) {
    /// <summary locid="M:J#Sys.registerComponent">Generates a create() function for the given type using the optional description and parameters for intellisense.</summary>
    /// <param name="type" type="Function">The type to be created.</param>
    /// <param name="options" type="Object" optional="true" mayBeNull="true"></param>
    var e = Function._validateParams(arguments, [
        {name: "type", type: Function},
        {name: "options", type: Object, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    var typeName = type.getName();
    var isControlOrBehavior = Sys.UI && (Sys._inheritsFrom(type, Sys.UI.Control) || Sys._inheritsFrom(type, Sys.UI.Behavior));
    var name = (options && options.name);
    if (!name) {
        name = typeName;
        var i = name.lastIndexOf('.');
        if (i >= 0) {
            name = name.substr(i+1);
            if (name && name.charAt(0) === "_") return;
        }
        name = name.substr(0, 1).toLowerCase() + name.substr(1);
    }
    if (!options) {
        options = {};
    }
    options.name = name;
    options.type = type;
    options.typeName = typeName;
    options._isBehavior = isControlOrBehavior;
    
    options = Sys.components[name] = merge(Sys.components[name], options);

    var fn = Sys._getCreate(options),
        target = isControlOrBehavior ? Sys.ElementSet.prototype : Sys.create;
    target[name] = fn;
}

Sys.registerPlugin = function registerPlugin(pluginInfo) {
    /// <summary locid="M:J#Sys.registerPlugin"></summary>
    /// <param name="pluginInfo" type="Object">An object describing the plugin (name, plugin, dom, global, components)</param>
    var e = Function._validateParams(arguments, [
        {name: "pluginInfo", type: Object}
    ]);
    if (e) throw e;
    var name = pluginInfo.name,
        fnName = pluginInfo.functionName || name;
    Sys.plugins[name] = merge(Sys.plugins[name], pluginInfo);
    var plugin = pluginInfo.plugin,
        sysTarget;
    if (pluginInfo.global) {
        sysTarget = Sys;
    }
    else if (pluginInfo.dom) {
        sysTarget = Sys.ElementSet.prototype;
    }
    else if (pluginInfo.components) {
        sysTarget = Sys.ComponentSet.prototype;
    }
    if (sysTarget) {
        sysTarget[fnName] = Sys._getCreate(pluginInfo, true);
    }
}

Sys._createComp = function _createComp(component, defaults, args) {
    var type = component.type,
        parameters = component.parameters || [],
        isBehavior = component._isBehavior,
        target = isBehavior ? args[0] : null;
    var props = args[parameters.length] || {};
    props = merge({}, defaults, props);
    foreach(parameters, function(parameter, i) {
        var name = typeof(parameter) === "string" ? parameter : parameter.name,
            value = args[i];
        if (typeof(value) !== "undefined" && typeof(props[name]) === "undefined") {
            props[name] = value;
        }
    });
    if (this instanceof Sys.ElementSet) {
        var components = [];
        this.each(function() {
            components.push(Sys._create(type, props, this));
        });
        return new Sys.ComponentSet(this, components);
    }
    else {
        return Sys._create(type, props);
    }
}

Sys._create = function _create(type, properties, target) {
    var targetType = typeof(target);
    if (targetType === "string") {
        target = Sys.get(target);
    }
    var instance;
    Sys._2Pass(function() {
        instance = targetType === "undefined" ? new type() : new type(target);
        callIf(instance, "beginUpdate");
        Sys._set(instance, properties);
        var componentType = Sys.Component;
        if (!componentType || !componentType._register(instance)) {
            callIf(instance, "endUpdate") || callIf(instance, "initialize");
        }
    });    
    return instance;
}

$prototype.registerInterface = function Type$registerInterface(typeName) {
    /// <summary locid="M:J#Type.registerInterface">Registers an interface (represented by its ctor function).</summary>
    /// <param name="typeName" type="String">The fully-qualified name of the interface.</param>
    /// <returns type="Type">The registered interface.</returns>
    var e = Function._validateParams(arguments, [
        {name: "typeName", type: String}
    ]);
    if (e) throw e;
    if (!Type.__fullyQualifiedIdentifierRegExp.test(typeName)) throw Error.argument('typeName', Sys.Res.notATypeName);
    var parsedName;
    try {
        parsedName = eval(typeName);
    }
    catch(e) {
        throw Error.argument('typeName', Sys.Res.argumentTypeName);
    }
    if (parsedName !== this) throw Error.argument('typeName', Sys.Res.badTypeName);
    if (Sys.__registeredTypes[typeName]) throw Error.invalidOperation(String.format(Sys.Res.typeRegisteredTwice, typeName));
    Sys.__upperCaseTypes[typeName.toUpperCase()] = this;

    this.prototype.constructor = this;
    this.__typeName = typeName;
    this.__interface = true;
    Sys.__registeredTypes[typeName] = true;

    return this;
}

$prototype.resolveInheritance = function Type$resolveInheritance() {
    /// <summary locid="M:J#Type.resolveInheritance">This method is called on the ctor function instance. It does three things: 1. It stores __baseType as a property of the constructor function 2. It copies members from the baseType's prototype into the  prototype associated with the type represented by this ctor,  if this type itself doesn't have the same member in its prototype,  i.e., it doesn't override the method. 3. It recurses up the inheritance chain to do the same for the base type.  Note that this logic runs only once per type, because it  is based on true value for __basePrototypePending property  off the ctor function.</summary>
    if (arguments.length !== 0) throw Error.parameterCount();

    if (this.__basePrototypePending) {
        var baseType = this.__baseType;

        baseType.resolveInheritance();
        var basePrototype = baseType.prototype,
            thisPrototype = this.prototype;
        for (var memberName in basePrototype) {
            thisPrototype[memberName] = thisPrototype[memberName] || basePrototype[memberName];
        }
        delete this.__basePrototypePending;
    }
}

$type.getRootNamespaces = function Type$getRootNamespaces() {
    /// <summary locid="M:J#Type.getRootNamespaces"></summary>
    /// <returns type="Array">Returns an array containing references to all the root namespaces</returns>
    if (arguments.length !== 0) throw Error.parameterCount();
    return Array.clone(Sys.__rootNamespaces);
}

$type.isClass = function Type$isClass(type) {
    /// <summary locid="M:J#Type.isClass"></summary>
    /// <param name="type" mayBeNull="true">The type to test.</param>
    /// <returns type="Boolean">True if the type is a class.</returns>
    var e = Function._validateParams(arguments, [
        {name: "type", mayBeNull: true}
    ]);
    if (e) throw e;
    return !!(type && type.__class);
}

$type.isInterface = function Type$isInterface(type) {
    /// <summary locid="M:J#Type.isInterface"></summary>
    /// <param name="type" mayBeNull="true">The type to test.</param>
    /// <returns type="Boolean">True if the type is an interface.</returns>
    var e = Function._validateParams(arguments, [
        {name: "type", mayBeNull: true}
    ]);
    if (e) throw e;
    return !!(type && type.__interface);
}

$type.isNamespace = function Type$isNamespace(object) {
    /// <summary locid="M:J#Type.isNamespace"></summary>
    /// <param name="object" mayBeNull="true">The type to test.</param>
    /// <returns type="Boolean">True if the object is a namespace.</returns>
    var e = Function._validateParams(arguments, [
        {name: "object", mayBeNull: true}
    ]);
    if (e) throw e;
    return !!(object && object.__namespace);
}

$type.parse = function Type$parse(typeName, ns) {
    /// <summary locid="M:J#Type.parse">If a namespace is specified, the type name is searched for on this namespace in a  case-insensitive way.  If no namespace is specified, the fully-qualified, case-sensitive type name must be specified.</summary>
    /// <param name="typeName" type="String" mayBeNull="true">The name of the type.</param>
    /// <param name="ns" optional="true" mayBeNull="true">The namespace where to look for the type.</param>
    /// <returns type="Type" mayBeNull="true">The type or null.</returns>
    var e = Function._validateParams(arguments, [
        {name: "typeName", type: String, mayBeNull: true},
        {name: "ns", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    var fn;
    if (ns) {
        fn = Sys.__upperCaseTypes[ns.getName().toUpperCase() + '.' + typeName.toUpperCase()];
        return fn || null;
    }
    if (!typeName) return null;
    var htClasses = Type.__htClasses;
    if (!htClasses) {
        Type.__htClasses = htClasses = {};
    }
    fn = htClasses[typeName];
    if (!fn) {
        fn = window.eval(typeName);
        if (typeof(fn) !== 'function') throw Error.argument('typeName', Sys.Res.notATypeName);
        htClasses[typeName] = fn;
    }
    return fn;
}

$type.registerNamespace = function Type$registerNamespace(namespacePath) {
    /// <summary locid="M:J#Type.registerNamespace">Creates a namespace.</summary>
    /// <param name="namespacePath" type="String">The full path of the namespace.</param>
    var e = Function._validateParams(arguments, [
        {name: "namespacePath", type: String}
    ]);
    if (e) throw e;
    Type._registerNamespace(namespacePath);
}
$type._registerNamespace = function Type$_registerNamespace(namespacePath) {
    if (!Type.__fullyQualifiedIdentifierRegExp.test(namespacePath)) throw Error.argument('namespacePath', Sys.Res.invalidNameSpace);
    var rootObject = window;
    var namespaceParts = namespacePath.split('.');

    for (var i = 0, l = namespaceParts.length; i < l; i++) {
        var currentPart = namespaceParts[i];
        var ns = rootObject[currentPart];
        var nsType = typeof(ns);
        if ((nsType !== "undefined") && (ns !== null)) {
            if (nsType === "function") {
                throw Error.invalidOperation(String.format(Sys.Res.namespaceContainsClass, namespaceParts.splice(0, i + 1).join('.')));
            }
            if ((typeof(ns) !== "object") || (ns instanceof Array)) {
                throw Error.invalidOperation(String.format(Sys.Res.namespaceContainsNonObject, namespaceParts.splice(0, i + 1).join('.')));
            }
        }
        if (!ns) {
            ns = rootObject[currentPart] = {};
        }
        if (!ns.__namespace) {
            if (!i && (namespacePath !== "Sys")) {
                Sys.__rootNamespaces.push(ns);
            }
            ns.__namespace = true;
            ns.__typeName = namespaceParts.slice(0, i + 1).join('.');
            var parsedName;
            try {
                parsedName = eval(ns.__typeName);
            }
            catch(e) {
                parsedName = null;
            }
            if (parsedName !== ns) {
                delete rootObject[currentPart];
                throw Error.argument('namespacePath', Sys.Res.invalidNameSpace);
            }
            ns.getName = function ns$getName() {return this.__typeName;}
        }
        rootObject = ns;
    }
}

$type._checkDependency = function Type$_checkDependency(dependency, featureName) {
    var scripts = Type._registerScript._scripts, isDependent = (scripts ? (!!scripts[dependency]) : false);
    if ((typeof(featureName) !== 'undefined') && !isDependent) {
        throw Error.invalidOperation(String.format(Sys.Res.requiredScriptReferenceNotIncluded, 
        featureName, dependency));
    }
    return isDependent;
}

$type._registerScript = function Type$_registerScript(scriptName, dependencies) {
    var scripts = Type._registerScript._scripts;
    if (!scripts) {
        Type._registerScript._scripts = scripts = {};
    }
    if (scripts[scriptName]) {
        throw Error.invalidOperation(String.format(Sys.Res.scriptAlreadyLoaded, scriptName));
    }
    scripts[scriptName] = true;
    if (dependencies) {
        for (var i = 0, l = dependencies.length; i < l; i++) {
            var dependency = dependencies[i];
            if (!Type._checkDependency(dependency)) {
                throw Error.invalidOperation(String.format(Sys.Res.scriptDependencyNotFound, scriptName, dependency));
            }
        }
    }
}

$type._registerNamespace("Sys");
Sys.__upperCaseTypes = {};
Sys.__rootNamespaces = [Sys];
Sys.__registeredTypes = {};

Sys._isInstanceOfType = function _isInstanceOfType(type, instance) {
    if (typeof(instance) === "undefined" || instance === null) return false;
    if (instance instanceof type) return true;
    var instanceType = Object.getType(instance);
    return !!(instanceType === type) ||
           (instanceType.inheritsFrom && instanceType.inheritsFrom(type)) ||
           (instanceType.implementsInterface && instanceType.implementsInterface(type));
}

Sys._getBaseMethod = function _getBaseMethod(type, instance, name) {
    if (!Sys._isInstanceOfType(type, instance)) throw Error.argumentType('instance', Object.getType(instance), type);
    var baseType = type.getBaseType();
    if (baseType) {
        var baseMethod = baseType.prototype[name];
        return (baseMethod instanceof Function) ? baseMethod : null;
    }
    return null;
}

Sys._isDomElement = function _isDomElement(obj) {
    var val = false;
    if (typeof (obj.nodeType) !== 'number') {
        var doc = obj.ownerDocument || obj.document || obj;
        if (doc != obj) {
            var w = doc.defaultView || doc.parentWindow;
            val = (w != obj);
        }
        else {
            val = !doc.body || !Sys._isDomElement(doc.body);
        }
    }
    return !val;
}

var isBrowser = Sys._isBrowser = function _isBrowser(name) {
    return Sys.Browser.agent === Sys.Browser[name];
}


foreach(Sys._ns, $type._registerNamespace);
delete Sys._ns;
$type = Array;
$type.__typeName = 'Array';
$type.__class = true;

var indexOf = Sys._indexOf = function _indexOf(array, item, start) {
    if (typeof(item) === "undefined") return -1;
    var length = array.length;
    if (length !== 0) {
        start = start - 0;
        if (isNaN(start)) {
            start = 0;
        }
        else {
            if (isFinite(start)) {
                start = start - (start % 1);
            }
            if (start < 0) {
                start = Math.max(0, length + start);
            }
        }

        for (var i = start; i < length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
    }
    return -1;
}

$type.add = $type.enqueue = function Array$enqueue(array, item) {
    /// <summary locid="M:J#Array.enqueue">Adds an element at the end of the array.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to add to.</param>
    /// <param name="item" mayBeNull="true">The object to add.</param>
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    array[array.length] = item;
}

$type.addRange = function Array$addRange(array, items) {
    /// <summary locid="M:J#Array.addRange">Adds a range of items at the end of the array.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to add to.</param>
    /// <param name="items" type="Array" elementMayBeNull="true">The array of items to append.</param>
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "items", type: Array, elementMayBeNull: true}
    ]);
    if (e) throw e;

    array.push.apply(array, items);
}

$type.clear = function Array$clear(array) {
    /// <summary locid="M:J#Array.clear">Clears the array of its elements.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to clear.</param>
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true}
    ]);
    if (e) throw e;
    array.length = 0;
}

$type.clone = function Array$clone(array) {
    /// <summary locid="M:J#Array.clone">Makes a clone of the array.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to clone.</param>
    /// <returns type="Array" elementMayBeNull="true">A clone of the array.</returns>
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true}
    ]);
    if (e) throw e;
    return array.length === 1 ? [array[0]] : Array.apply(null, array);
}

$type.contains = function Array$contains(array, item) {
    /// <summary locid="M:J#Array.contains">Use this method to determine if an array contains the specified element.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to look into.</param>
    /// <param name="item" mayBeNull="true">The object to find in the array.</param>
    /// <returns type="Boolean">True if the object was found.</returns>
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    return (indexOf(array, item) >= 0);
}

$type.dequeue = function Array$dequeue(array) {
    /// <summary locid="M:J#Array.dequeue"></summary>
    /// <param name="array" type="Array" elementMayBeNull="true">Removes and returns the object at the beginning of the array.</param>
    /// <returns mayBeNull="true">The object that is removed from the beginning of the array.</returns>
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true}
    ]);
    if (e) throw e;
    return array.shift();
}

$type.forEach = function Array$forEach(array, method, instance) {
    /// <summary locid="M:J#Array.forEach">Calls the specified function on each element of the array.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to enumerate.</param>
    /// <param name="method" type="Function">The method to call.   The method should take the array element, the index of the element and   the array itself as its parameters.</param>
    /// <param name="instance" optional="true" mayBeNull="true">The context under which the function must run (i.e. what 'this' means inside the function).</param>
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "method", type: Function},
        {name: "instance", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    for (var i = 0, l = array.length; i < l; i++) {
        var elt = array[i];
        if (typeof(elt) !== 'undefined') method.call(instance, elt, i, array);
    }
}

$type.indexOf = function Array$indexOf(array, item, start) {
    /// <summary locid="M:J#Array.indexOf">Finds the index in the array of the provided item.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to look into.</param>
    /// <param name="item" optional="true" mayBeNull="true">The object to find.</param>
    /// <param name="start" optional="true" mayBeNull="true">The index where the search begins.</param>
    /// <returns type="Number">The index of the item or -1 if it wasn't found.</returns>
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "item", mayBeNull: true, optional: true},
        {name: "start", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    return indexOf(array, item, start);
}

$type.insert = function Array$insert(array, index, item) {
    /// <summary locid="M:J#Array.insert">Inserts an item at the specified index.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to insert into.</param>
    /// <param name="index" mayBeNull="true">The index where the item will be inserted.</param>
    /// <param name="item" mayBeNull="true">The item to insert.</param>
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "index", mayBeNull: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    array.splice(index, 0, item);
}

$type.parse = function Array$parse(value) {
    /// <summary locid="M:J#Array.parse">Creates an array from a string representation of the form "[elt1, elt2, elt3]".</summary>
    /// <param name="value" type="String" mayBeNull="true">The string representation of the array.</param>
    /// <returns type="Array" elementMayBeNull="true">An array built from the string representation.</returns>
    var e = Function._validateParams(arguments, [
        {name: "value", type: String, mayBeNull: true}
    ]);
    if (e) throw e;
    var v = value ? window.eval("(" + value + ")") : [];
    if (!Array.isInstanceOfType(v)) throw Error.argument('value', Sys.Res.arrayParseBadFormat);
    return v;
}

$type.remove = function Array$remove(array, item) {
    /// <summary locid="M:J#Array.remove">Removes the first occurence of an item from the array.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to remove from.</param>
    /// <param name="item" mayBeNull="true">The item to remove.</param>
    /// <returns type="Boolean">True if the item was found.</returns>
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    var index = indexOf(array, item);
    if (index >= 0) {
        array.splice(index, 1);
    }
    return (index >= 0);
}

$type.removeAt = function Array$removeAt(array, index) {
    /// <summary locid="M:J#Array.removeAt">Removes the item at the specified index from the array.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to remove from.</param>
    /// <param name="index" mayBeNull="true">The index of the item to remove.</param>
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "index", mayBeNull: true}
    ]);
    if (e) throw e;
    array.splice(index, 1);
}



Type._registerScript("MicrosoftAjaxCore.js");

$type = Sys.IDisposable = function IDisposable() {
    throw Error.notImplemented();
}
$type.prototype = {
    dispose: function IDisposable$dispose() {
        throw Error.notImplemented();
    }
}
$type.registerInterface('Sys.IDisposable');
$type = Sys.StringBuilder = function StringBuilder(initialText) {
    /// <summary locid="M:J#Sys.StringBuilder.#ctor">Provides an optimized mechanism to concatenate a sequence of strings.</summary>
    /// <param name="initialText" optional="true" mayBeNull="true">The initial text for the StringBuilder.</param>
    var e = Function._validateParams(arguments, [
        {name: "initialText", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    this._parts = (typeof(initialText) !== 'undefined' && initialText !== null && initialText !== '') ?
        [initialText.toString()] : [];
    this._value = {};
    this._len = 0;
}

$type.prototype = {
    append: function StringBuilder$append(text) {
        /// <summary locid="M:J#Sys.StringBuilder.append">Appends a new string at the end of the StringBuilder.</summary>
        /// <param name="text" mayBeNull="true">The string to append.</param>
        /// <returns type="Sys.StringBuilder"></returns>
        var e = Function._validateParams(arguments, [
            {name: "text", mayBeNull: true}
        ]);
        if (e) throw e;
        this._parts.push(text);
        return this;
    },

    appendLine: function StringBuilder$appendLine(text) {
        /// <summary locid="M:J#Sys.StringBuilder.appendLine">Appends a new string as a line of text at the end of the StringBuilder.</summary>
        /// <param name="text" optional="true" mayBeNull="true">The string to append.</param>
        /// <returns type="Sys.StringBuilder"></returns>
        var e = Function._validateParams(arguments, [
            {name: "text", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        this._parts.push(
            ((typeof(text) === 'undefined') || (text === null) || (text === '')) ?
            '\r\n' : (text + '\r\n'));
        return this;
    },

    clear: function StringBuilder$clear() {
        /// <summary locid="M:J#Sys.StringBuilder.clear">Clears the StringBuilder of its current contents.</summary>
        if (arguments.length !== 0) throw Error.parameterCount();
        this._parts = [];
        this._value = {};
        this._len = 0;
    },

    isEmpty: function StringBuilder$isEmpty() {
        /// <summary locid="M:J#Sys.StringBuilder.isEmpty">Use this method to determine if the StringBuilder has contents.</summary>
        /// <returns type="Boolean">True if the StringBuilder has any contents.</returns>
        if (arguments.length !== 0) throw Error.parameterCount();
        return (!this._parts.length || !this.toString());
    },

    toString: function StringBuilder$toString(separator) {
        /// <summary locid="M:J#Sys.StringBuilder.toString">Creates a string from the contents of the StringBuilder.</summary>
        /// <param name="separator" type="String" optional="true" mayBeNull="true">The separator to insert between the elements of the StringBuilder.</param>
        /// <returns type="String">The string built from the StringBuilder.</returns>
        var e = Function._validateParams(arguments, [
            {name: "separator", type: String, mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        separator = separator || '';
        var parts = this._parts;
        if (this._len !== parts.length) {
            this._value = {};
            this._len = parts.length;
        }
        var val = this._value;
        var ret = val[separator];
        if (typeof(ret) === 'undefined') {
            if (separator !== '') {
                for (var i = 0; i < parts.length;) {
                    var part = parts[i];
                    if ((typeof(part) === 'undefined') || (part === '') || (part === null)) {
                        parts.splice(i, 1);
                    }
                    else {
                        i++;
                    }
                }
            }
            val[separator] = ret = parts.join(separator);
        }
        return ret;
    }
}
$type.registerClass('Sys.StringBuilder');

var agent = navigator.userAgent,
    browser = Sys.Browser = {
        InternetExplorer: {},
        Firefox: {},
        Safari: {},
        Opera: {},
        agent: null,
        hasDebuggerStatement: false,
        name: navigator.appName,
        version: parseFloat(navigator.appVersion),
        documentMode: 0 };

if (agent.indexOf(' MSIE ') > -1) {
    browser.agent = browser.InternetExplorer;
    browser.version = parseFloat(agent.match(/MSIE (\d+\.\d+)/)[1]);
    if ((browser.version > 7) && (document.documentMode > 6)) {
        browser.documentMode = document.documentMode;    
    }
    browser.hasDebuggerStatement = true;
}
else if (agent.indexOf(' Firefox/') > -1) {
    browser.agent = browser.Firefox;
    browser.version = parseFloat(agent.match(/ Firefox\/(\d+\.\d+)/)[1]);
    browser.name = 'Firefox';
    browser.hasDebuggerStatement = true;
}
else if (agent.indexOf(' AppleWebKit/') > -1) {
    browser.agent = browser.Safari;
    browser.version = parseFloat(agent.match(/ AppleWebKit\/(\d+(\.\d+)?)/)[1]);
    browser.name = 'Safari';
}
else if (agent.indexOf('Opera/') > -1) {
    browser.agent = browser.Opera;
}



$type = Sys.EventArgs = function EventArgs() {
    /// <summary locid="M:J#Sys.EventArgs.#ctor">EventArgs is the base class for classes containing event data.</summary>
    if (arguments.length !== 0) throw Error.parameterCount();
}
$type.registerClass('Sys.EventArgs');

Sys.EventArgs.Empty = new Sys.EventArgs();
$type = Sys.CancelEventArgs = function CancelEventArgs() {
    /// <summary locid="M:J#Sys.CancelEventArgs.#ctor">CancelEventArgs is the base class for classes containing event data, which can be used to cancel the event.</summary>
    if (arguments.length !== 0) throw Error.parameterCount();
    Sys.CancelEventArgs.initializeBase(this);

    this._cancel = false;
}
$type.prototype = {
    get_cancel: function CancelEventArgs$get_cancel() {
        /// <value type="Boolean" locid="P:J#Sys.CancelEventArgs.cancel"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._cancel;
    },
    set_cancel: function CancelEventArgs$set_cancel(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Boolean}]);
        if (e) throw e;
        this._cancel = value;
    }
}
$type.registerClass('Sys.CancelEventArgs', Sys.EventArgs);
$type = Sys.EventHandlerList = function EventHandlerList() {
    /// <summary locid="M:J#Sys.EventHandlerList.#ctor">The EventHandlerList class contains a dictionary of multicast events.</summary>
    if (arguments.length !== 0) throw Error.parameterCount();
    this._list = {};
}

$type.prototype = {
    _addHandler: function EventHandlerList$_addHandler(id, handler) {
        Array.add(this._getEvent(id, true), handler);
    },
    addHandler: function EventHandlerList$addHandler(id, handler) {
        /// <summary locid="M:J#Sys.EventHandlerList.addHandler">The addHandler method adds a handler to the event identified by id.</summary>
        /// <param name="id" type="String">The identifier for the event.</param>
        /// <param name="handler" type="Function">The handler to add to the event.</param>
        var e = Function._validateParams(arguments, [
            {name: "id", type: String},
            {name: "handler", type: Function}
        ]);
        if (e) throw e;
        this._addHandler(id, handler);
    },
    _removeHandler: function EventHandlerList$_removeHandler(id, handler) {
        var evt = this._getEvent(id);
        if (!evt) return;
        Array.remove(evt, handler);
    },
    _removeHandlers: function EventHandlerList$_removeHandlers(id) {
        if (!id) {
            this._list = {};
        }
        else {
            var evt = this._getEvent(id);
            if (!evt) return;
            evt.length = 0;
        }
    },
    removeHandler: function EventHandlerList$removeHandler(id, handler) {
        /// <summary locid="M:J#Sys.EventHandlerList.removeHandler">The removeHandler method removes a handler to the event identified by id.</summary>
        /// <param name="id" type="String">The identifier for the event.</param>
        /// <param name="handler" type="Function">The handler to remove from the event.</param>
        var e = Function._validateParams(arguments, [
            {name: "id", type: String},
            {name: "handler", type: Function}
        ]);
        if (e) throw e;
        this._removeHandler(id, handler);
    },
    getHandler: function EventHandlerList$getHandler(id) {
        /// <summary locid="M:J#Sys.EventHandlerList.getHandler">The getHandler method returns a single function that will call all   handlers sequentially for the specified event.</summary>
        /// <param name="id" type="String">The identifier for the event.</param>
        /// <returns type="Function">A function that will call each handler sequentially.</returns>
        var e = Function._validateParams(arguments, [
            {name: "id", type: String}
        ]);
        if (e) throw e;
        var evt = this._getEvent(id);
        if (!evt || !evt.length) return null;
        evt = Array.clone(evt);
        return function(source, args) {
            for (var i = 0, l = evt.length; i < l; i++) {
                evt[i](source, args);
            }
        };
    },
    _getEvent: function EventHandlerList$_getEvent(id, create) {
        var e = this._list[id];
        if (!e) {
            if (!create) return null;
            this._list[id] = e = [];
        }
        return e;
    }
}
$type.registerClass('Sys.EventHandlerList');

Type.registerNamespace('Sys.UI');

$type = Sys._Debug = function _Debug() {
    /// <summary locid="M:J#Sys.Debug.#ctor">Provides a set of methods that help debug your code.</summary>
    /// <field name="isDebug" type="Boolean" locid="F:J#Sys.Debug.isDebug"></field>
    if (arguments.length !== 0) throw Error.parameterCount();
}
$type.prototype = {
    _appendConsole: function _Debug$_appendConsole(text) {
        if ((typeof(Debug) !== 'undefined') && Debug.writeln) {
            Debug.writeln(text);
        }
        if (window.console && window.console.log) {
            window.console.log(text);
        }
        if (window.opera) {
            window.opera.postError(text);
        }
        if (window.debugService) {
            window.debugService.trace(text);
        }
    },

    _getTrace: function() {
        var traceElement = Sys.get('#TraceConsole');
        return (traceElement && (traceElement.tagName.toUpperCase() === 'TEXTAREA')) ? traceElement : null;
    },

    _appendTrace: function _Debug$_appendTrace(text) {
        var traceElement = this._getTrace();
        if (traceElement) {
            traceElement.value += text + '\n';
        }
    },

    assert: function _Debug$assert(condition, message, displayCaller) {
        /// <summary locid="M:J#Sys.Debug.assert">Checks for a condition, displays a message and prompts the user to break   into the debugger if the condition is false.</summary>
        /// <param name="condition" type="Boolean">true to prevent a message being displayed; otherwise, false.</param>
        /// <param name="message" type="String" optional="true" mayBeNull="true">A message to display.</param>
        /// <param name="displayCaller" type="Boolean" optional="true" mayBeNull="true">True if the function calling assert should be displayed in the message.</param>
        var e = Function._validateParams(arguments, [
            {name: "condition", type: Boolean},
            {name: "message", type: String, mayBeNull: true, optional: true},
            {name: "displayCaller", type: Boolean, mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        if (!condition) {
            message = (displayCaller && this.assert.caller) ?
                String.format(Sys.Res.assertFailedCaller, message, this.assert.caller) :
                String.format(Sys.Res.assertFailed, message);

            if (confirm(String.format(Sys.Res.breakIntoDebugger, message))) {
                this.fail(message);
            }
        }
    },

    clearTrace: function _Debug$clearTrace() {
        /// <summary locid="M:J#Sys.Debug.clearTrace"></summary>
        if (arguments.length !== 0) throw Error.parameterCount();
        var traceElement = this._getTrace();
        if (traceElement) {
            traceElement.value = '';
        }
    },

    fail: function _Debug$fail(message) {
        /// <summary locid="M:J#Sys.Debug.fail">Displays a message in the debugger's output window and breaks into the debugger.</summary>
        /// <param name="message" type="String" mayBeNull="true">A message to display.</param>
        var e = Function._validateParams(arguments, [
            {name: "message", type: String, mayBeNull: true}
        ]);
        if (e) throw e;
        this._appendConsole(message);

        if (Sys.Browser.hasDebuggerStatement) {
            window.eval('debugger');
        }
    },

    trace: function _Debug$trace(text) {
        /// <summary locid="M:J#Sys.Debug.trace">Appends a text line to the debugger console and the TraceConsole textarea element if available.</summary>
        /// <param name="text">Text for trace.</param>
        var e = Function._validateParams(arguments, [
            {name: "text"}
        ]);
        if (e) throw e;
        this._appendConsole(text);
        this._appendTrace(text);
    },

    traceDump: function _Debug$traceDump(object, name) {
        /// <summary locid="M:J#Sys.Debug.traceDump">Dumps an object to the debugger console and the TraceConsole textarea element if available.</summary>
        /// <param name="object" mayBeNull="true">Object for trace dump.</param>
        /// <param name="name" type="String" mayBeNull="true" optional="true">Object name.</param>
        var e = Function._validateParams(arguments, [
            {name: "object", mayBeNull: true},
            {name: "name", type: String, mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        this._traceDump(object, name, true);
    },

    _traceDump: function _Debug$_traceDump(object, name, recursive, indentationPadding, loopArray) {
        name = name || 'traceDump';
        indentationPadding = indentationPadding || '';
        var prefix = indentationPadding + name + ": ";
        if (object === null) {
            this.trace(prefix + 'null');
            return;
        }
        switch(typeof(object)) {
            case 'undefined':
                this.trace(prefix + 'Undefined');
                break;
            case 'number': case 'string': case 'boolean':
                this.trace(prefix + object);
                break;
            default:
                if (Date.isInstanceOfType(object) || RegExp.isInstanceOfType(object)) {
                    this.trace(prefix + object.toString());
                    break;
                }
                if (!loopArray) {
                    loopArray = [];
                }
                else if (Array.contains(loopArray, object)) {
                    this.trace(prefix + '...');
                    return;
                }
                loopArray.push(object);

                if ((object == window) || (object === document) ||
                    (window.HTMLElement && (object instanceof HTMLElement)) ||
                    (typeof(object.nodeName) === 'string')) {
                    var tag = object.tagName || 'DomElement';
                    if (object.id) {
                        tag += ' - ' + object.id;
                    }
                    this.trace(indentationPadding + name + ' {' +  tag + '}');
                }
                else {
                    var typeName = Object.getTypeName(object);
                    this.trace(indentationPadding + name + (typeof(typeName) === 'string' ? ' {' + typeName + '}' : ''));
                    if ((indentationPadding === '') || recursive) {
                        indentationPadding += "    ";
                        var i, length, properties, p, v;
                        if (object instanceof Array) {
                            length = object.length;
                            for (i = 0; i < length; i++) {
                                this._traceDump(object[i], '[' + i + ']', recursive, indentationPadding, loopArray);
                            }
                        }
                        else {
                            for (p in object) {
                                v = object[p];
                                if (typeof(v) !== "function") {
                                    this._traceDump(v, p, recursive, indentationPadding, loopArray);
                                }
                            }
                        }
                    }
                }
                Array.remove(loopArray, object);
        }
    }
}
$type.registerClass('Sys._Debug');

$type = Sys.Debug = new Sys._Debug();
$type.isDebug = true;
function Sys$Enum$parse(value, ignoreCase) {
    /// <summary locid="M:J#Sys.Enum.parse">Converts the string representation of the name or numeric value of one or more enumerated   constants to an equivalent enumerated object.</summary>
    /// <param name="value" type="String">A string containing the name or value to convert.</param>
    /// <param name="ignoreCase" type="Boolean" optional="true" mayBeNull="true">If true, the parsing will be done case-insensitively.  If omitted, the parsing is done case-sensitively.</param>
    /// <returns>An object of type enumType whose value is represented by value.</returns>
    var e = Function._validateParams(arguments, [
        {name: "value", type: String},
        {name: "ignoreCase", type: Boolean, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    var values, parsed, val;
    if (ignoreCase) {
        values = this.__lowerCaseValues;
        if (!values) {
            this.__lowerCaseValues = values = {};
            var prototype = this.prototype;
            for (var name in prototype) {
                values[name.toLowerCase()] = prototype[name];
            }
        }
    }
    else {
        values = this.prototype;
    }
    function throwError(v) {
        if (typeof(parsed) !== 'number') throw Error.argument('value', String.format(Sys.Res.enumInvalidValue, v, this.__typeName));
    }
    if (!this.__flags) {
        val = (ignoreCase ? value.toLowerCase() : value);
        parsed = values[val.trim()];
        if (typeof(parsed) !== 'number') throwError.call(this, value);
        return parsed;
    }
    else {
        var parts = (ignoreCase ? value.toLowerCase() : value).split(',');
        var v = 0;

        for (var i = parts.length - 1; i >= 0; i--) {
            var part = parts[i].trim();
            parsed = values[part];
            if (typeof(parsed) !== 'number') throwError.call(this, value.split(',')[i].trim());
            v |= parsed;
        }
        return v;
    }
}

function Sys$Enum$toString(value) {
    /// <summary locid="M:J#Sys.Enum.toString">Converts the value of an enum instance to its equivalent string representation.</summary>
    /// <param name="value" optional="true" mayBeNull="true">The value of the enum instance for which the string representation must be constructed.</param>
    /// <returns type="String">The string representation of "value".</returns>
    var e = Function._validateParams(arguments, [
        {name: "value", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    if ((typeof(value) === 'undefined') || (value === null)) return this.__string;
    if ((typeof(value) != 'number') || ((value % 1) !== 0)) throw Error.argumentType('value', Object.getType(value), this);
    var values = this.prototype;
    var i;
    if (!this.__flags || (value === 0)) {
        for (i in values) {
            if (values[i] === value) {
                return i;
            }
        }
    }
    else {
        var sorted = this.__sortedValues;
        if (!sorted) {
            sorted = [];
            for (i in values) {
                sorted.push({key: i, value: values[i]});
            }
            sorted.sort(function(a, b) {
                return a.value - b.value;
            });
            this.__sortedValues = sorted;
        }
        var parts = [];
        var v = value;
        for (i = sorted.length - 1; i >= 0; i--) {
            var kvp = sorted[i];
            var vali = kvp.value;
            if (vali === 0) continue;
            if ((vali & value) === vali) {
                parts.push(kvp.key);
                v -= vali;
                if (v === 0) break;
            }
        }
        if (parts.length && v === 0) return parts.reverse().join(', ');
    }
    throw Error.argumentOutOfRange('value', value, String.format(Sys.Res.enumInvalidValue, value, this.__typeName));
}

$type = Type;

$type.prototype.registerEnum = function Type$registerEnum(name, flags) {
    /// <summary locid="M:J#Sys.UI.LineType.#ctor">Registers an enum type.</summary>
    /// <param name="name" type="String">The fully-qualified name of the enum.</param>
    /// <param name="flags" type="Boolean" optional="true" mayBeNull="true">True if the enum is a flags collection.</param>
    var e = Function._validateParams(arguments, [
        {name: "name", type: String},
        {name: "flags", type: Boolean, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    if (!Type.__fullyQualifiedIdentifierRegExp.test(name)) throw Error.argument('name', Sys.Res.notATypeName);
    var parsedName;
    try {
        parsedName = eval(name);
    }
    catch(e) {
        throw Error.argument('name', Sys.Res.argumentTypeName);
    }
    if (parsedName !== this) throw Error.argument('name', Sys.Res.badTypeName);
    if (Sys.__registeredTypes[name]) throw Error.invalidOperation(String.format(Sys.Res.typeRegisteredTwice, name));
    for (var j in this.prototype) {
        var val = this.prototype[j];
        if (!Type.__identifierRegExp.test(j)) throw Error.invalidOperation(String.format(Sys.Res.enumInvalidValueName, j));
        if (typeof(val) !== 'number' || (val % 1) !== 0) throw Error.invalidOperation(Sys.Res.enumValueNotInteger);
        if (typeof(this[j]) !== 'undefined') throw Error.invalidOperation(String.format(Sys.Res.enumReservedName, j));
    }
    Sys.__upperCaseTypes[name.toUpperCase()] = this;

    for (var i in this.prototype) {
        this[i] = this.prototype[i];
    }
    this.__typeName = name;
    this.parse = Sys$Enum$parse;
    this.__string = this.toString();
    this.toString = Sys$Enum$toString;
    this.__flags = flags;
    this.__enum = true;
    Sys.__registeredTypes[name] = true;
}

$type.isEnum = function Type$isEnum(type) {
    /// <summary locid="M:J#Type.isEnum"></summary>
    /// <param name="type" mayBeNull="true">The type to test.</param>
    /// <returns type="Boolean">True if the type is an enum.</returns>
    var e = Function._validateParams(arguments, [
        {name: "type", mayBeNull: true}
    ]);
    if (e) throw e;
    return !!(type && type.__enum);
}

$type.isFlags = function Type$isFlags(type) {
    /// <summary locid="M:J#Type.isFlags"></summary>
    /// <param name="type" mayBeNull="true">The type to test.</param>
    /// <returns type="Boolean">True if the type is a set of flags.</returns>
    var e = Function._validateParams(arguments, [
        {name: "type", mayBeNull: true}
    ]);
    if (e) throw e;
    return !!(type && type.__flags);
}

$type = Sys.CollectionChange = function CollectionChange(action, newItems, newStartingIndex, oldItems, oldStartingIndex) {
    /// <summary locid="M:J#Sys.CollectionChange.#ctor">Describes a change in a collection.</summary>
    /// <param name="action" type="Sys.NotifyCollectionChangedAction"></param>
    /// <param name="newItems" optional="true" mayBeNull="true">The items that were added when action is add or replace.</param>
    /// <param name="newStartingIndex" type="Number" integer="true" optional="true" mayBeNull="true">The index where new items have been inserted.</param>
    /// <param name="oldItems" optional="true" mayBeNull="true">The items that were removed when action is remove or replace.</param>
    /// <param name="oldStartingIndex" type="Number" integer="true" optional="true" mayBeNull="true">The index where old items have been removed.</param>
    /// <field name="action" type="Sys.NotifyCollectionChangedAction" locid="F:J#Sys.CollectionChange.action"></field>
    /// <field name="newItems" type="Array" mayBeNull="true" elementMayBeNull="true" locid="F:J#Sys.CollectionChange.newItems">The items that were added when action is add.</field>
    /// <field name="newStartingIndex" type="Number" integer="true" locid="F:J#Sys.CollectionChange.newStartingIndex">The index where new items have been inserted.</field>
    /// <field name="oldItems" type="Array" mayBeNull="true" elementMayBeNull="true" locid="F:J#Sys.CollectionChange.oldItems">The items that were removed when action is remove.</field>
    /// <field name="oldStartingIndex" type="Number" integer="true" locid="F:J#Sys.CollectionChange.oldStartingIndex">The index where old items have been removed.</field>
    var e = Function._validateParams(arguments, [
        {name: "action", type: Sys.NotifyCollectionChangedAction},
        {name: "newItems", mayBeNull: true, optional: true},
        {name: "newStartingIndex", type: Number, mayBeNull: true, integer: true, optional: true},
        {name: "oldItems", mayBeNull: true, optional: true},
        {name: "oldStartingIndex", type: Number, mayBeNull: true, integer: true, optional: true}
    ]);
    if (e) throw e;
    this.action = action;
    if (newItems) {
        if (!(newItems instanceof Array)) {
            newItems = [newItems];
        }
    }
    this.newItems = newItems || null;
    if (typeof newStartingIndex !== "number") {
        newStartingIndex = -1;
    }
    this.newStartingIndex = newStartingIndex;
    if (oldItems) {
        if (!(oldItems instanceof Array)) {
            oldItems = [oldItems];
        }
    }
    this.oldItems = oldItems || null;
    if (typeof oldStartingIndex !== "number") {
        oldStartingIndex = -1;
    }
    this.oldStartingIndex = oldStartingIndex;
}
$type.registerClass("Sys.CollectionChange");
$type = Sys.NotifyCollectionChangedAction = function NotifyCollectionChangedAction() {
    /// <summary locid="M:J#Sys.NotifyCollectionChangedAction.#ctor">Describes how a collection has changed.</summary>
    /// <field name="add" type="Number" integer="true" static="true" locid="F:J#Sys.NotifyCollectionChangedAction.add"></field>
    /// <field name="remove" type="Number" integer="true" static="true" locid="F:J#Sys.NotifyCollectionChangedAction.remove"></field>
    /// <field name="reset" type="Number" integer="true" static="true" locid="F:J#Sys.NotifyCollectionChangedAction.reset"></field>
    if (arguments.length !== 0) throw Error.parameterCount();
    throw Error.notImplemented();
}
$type.prototype = {
    add: 0,
    remove: 1,
    reset: 2
}
$type.registerEnum('Sys.NotifyCollectionChangedAction');
$type = Sys.NotifyCollectionChangedEventArgs = function NotifyCollectionChangedEventArgs(changes) {
    /// <summary locid="M:J#Sys.NotifyCollectionChangedEventArgs.#ctor">Describes how the collection was changed.</summary>
    /// <param name="changes" type="Array" elementType="Sys.CollectionChange">A list of changes that were performed on the collection since the last event.</param>
    var e = Function._validateParams(arguments, [
        {name: "changes", type: Array, elementType: Sys.CollectionChange}
    ]);
    if (e) throw e;
    this._changes = changes;
    Sys.NotifyCollectionChangedEventArgs.initializeBase(this);
}
$type.prototype = {
    get_changes: function NotifyCollectionChangedEventArgs$get_changes() {
        /// <value type="Array" elementType="Sys.CollectionChange" locid="P:J#Sys.NotifyCollectionChangedEventArgs.changes"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._changes || [];
    }
}
$type.registerClass("Sys.NotifyCollectionChangedEventArgs", Sys.EventArgs);

$type = Sys.INotifyPropertyChange = function INotifyPropertyChange() {
    /// <summary locid="M:J#Sys.INotifyPropertyChange.#ctor">Implement this interface to become a provider of property change notifications.</summary>
    if (arguments.length !== 0) throw Error.parameterCount();
    throw Error.notImplemented();
}
$type.prototype = {
    add_propertyChanged: function INotifyPropertyChange$add_propertyChanged(handler) {
    /// <summary locid="E:J#Sys.INotifyPropertyChange.propertyChanged"></summary>
    var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
    if (e) throw e;
        throw Error.notImplemented();
    },
    remove_propertyChanged: function INotifyPropertyChange$remove_propertyChanged(handler) {
    var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
    if (e) throw e;
        throw Error.notImplemented();
    }
}
$type.registerInterface('Sys.INotifyPropertyChange');
$type = Sys.PropertyChangedEventArgs = function PropertyChangedEventArgs(propertyName) {
    /// <summary locid="M:J#Sys.PropertyChangedEventArgs.#ctor">Describes property changes.</summary>
    /// <param name="propertyName" type="String">The name of the property that changed.</param>
    var e = Function._validateParams(arguments, [
        {name: "propertyName", type: String}
    ]);
    if (e) throw e;
    Sys.PropertyChangedEventArgs.initializeBase(this);
    this._propertyName = propertyName;
}
 $type.prototype = {
    get_propertyName: function PropertyChangedEventArgs$get_propertyName() {
        /// <value type="String" locid="P:J#Sys.PropertyChangedEventArgs.propertyName">The name of the property that changed.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._propertyName;
    }
}
$type.registerClass('Sys.PropertyChangedEventArgs', Sys.EventArgs);
$type = Sys.Observer = function Observer() {
    throw Error.invalidOperation();
}
$type.registerClass("Sys.Observer");

$type.makeObservable = function Observer$makeObservable(target) {
    /// <summary locid="M:J#Sys.Observer.makeObservable">Makes an object directly observable by adding observable methods to it.</summary>
    /// <param name="target" mayBeNull="false">The object, array, or DOM element to make observable.</param>
    /// <returns>The observable object.</returns>
    var e = Function._validateParams(arguments, [
        {name: "target"}
    ]);
    if (e) throw e;
    var isArray = target instanceof Array,
        o = Sys.Observer;
    Sys.Observer._ensureObservable(target);
    if (target.setValue === o._observeMethods.setValue) return target;
    o._addMethods(target, o._observeMethods);
    if (isArray) {
        o._addMethods(target, o._arrayMethods);
    }
    return target;
}

$type._ensureObservable = function Observer$_ensureObservable(target) {
    var type = typeof target;
    if ((type === "string") || (type === "number") || (type === "boolean") || (type === "date")) {
        throw Error.invalidOperation(String.format(Sys.Res.notObservable, type));
    }
}
$type._addMethods = function Observer$_addMethods(target, methods) {
    for (var m in methods) {
        if (target[m] && (target[m] !== methods[m])) {
            throw Error.invalidOperation(String.format(Sys.Res.observableConflict, m));
        }
        target[m] = methods[m];
    }
}
$type._addEventHandler = function Observer$_addEventHandler(target, eventName, handler) {
    Sys.Observer._getContext(target, true).events._addHandler(eventName, handler);
}
$type.addEventHandler = function Observer$addEventHandler(target, eventName, handler) {
    /// <summary locid="M:J#Sys.Observer.addEventHandler">Adds an observable event handler to the target.</summary>
    /// <param name="target"></param>
    /// <param name="eventName" type="String"></param>
    /// <param name="handler" type="Function"></param>
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "eventName", type: String},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    Sys.Observer._ensureObservable(target);
    Sys.Observer._addEventHandler(target, eventName, handler);
}
$type._removeEventHandler = function Observer$_removeEventHandler(target, eventName, handler) {
    Sys.Observer._getContext(target, true).events._removeHandler(eventName, handler);
}
$type.removeEventHandler = function Observer$removeEventHandler(target, eventName, handler) {
    /// <summary locid="M:J#Sys.Observer.removeEventHandler">Removes an observable event handler from the target.</summary>
    /// <param name="target"></param>
    /// <param name="eventName" type="String"></param>
    /// <param name="handler" type="Function"></param>
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "eventName", type: String},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    Sys.Observer._ensureObservable(target);
    Sys.Observer._removeEventHandler(target, eventName, handler);
}
$type.clearEventHandlers = function Observer$clearEventHandlers(target, eventName) {
    /// <summary locid="M:J#Sys.Observer.clearEventHandlers">Removes all observable event handlers from the target.</summary>
    /// <param name="target"></param>
    /// <param name="eventName" type="String" mayBeNull="true" optional="true">If not given, handlers for all events are removed.</param>
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "eventName", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    Sys.Observer._ensureObservable(target);
    Sys.Observer._getContext(target, true).events._removeHandlers(eventName);
}
$type.raiseEvent = function Observer$raiseEvent(target, eventName, eventArgs) {
    /// <summary locid="M:J#Sys.Observer.raiseEvent">Raises an observable event on the target.</summary>
    /// <param name="target"></param>
    /// <param name="eventName" type="String"></param>
    /// <param name="eventArgs" optional="true" mayBeNull="true"></param>
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "eventName", type: String},
        {name: "eventArgs", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    Sys.Observer._ensureObservable(target);
    var ctx = Sys.Observer._getContext(target);
    if (!ctx) return;
    var handler = ctx.events.getHandler(eventName);
    if (handler) {
        handler(target, eventArgs || Sys.EventArgs.Empty);
    }
}
$type.addPropertyChanged = function Observer$addPropertyChanged(target, handler) {
    /// <summary locid="M:J#Sys.Observer.addPropertyChanged">Adds a propertyChanged event handler to the target.</summary>
    /// <param name="target" mayBeNull="false">The object to observe.</param>
    /// <param name="handler" type="Function">The event handler.</param>
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    Sys.Observer._ensureObservable(target);
    Sys.Observer._addEventHandler(target, "propertyChanged", handler);
}
$type.removePropertyChanged = function Observer$removePropertyChanged(target, handler) {
    /// <summary locid="M:J#Sys.Observer.removePropertyChanged">Removes a propertyChanged event handler from the target.</summary>
    /// <param name="target" mayBeNull="false">The object to observe.</param>
    /// <param name="handler" type="Function">The event handler.</param>
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    Sys.Observer._ensureObservable(target);
    Sys.Observer._removeEventHandler(target, "propertyChanged", handler);
}
$type.beginUpdate = function Observer$beginUpdate(target) {
    /// <summary locid="M:J#Sys.Observer.beginUpdate"></summary>
    /// <param name="target" mayBeNull="false"></param>
    var e = Function._validateParams(arguments, [
        {name: "target"}
    ]);
    if (e) throw e;
    Sys.Observer._ensureObservable(target);
    Sys.Observer._getContext(target, true).updating = true;
}
$type.endUpdate = function Observer$endUpdate(target) {
    /// <summary locid="M:J#Sys.Observer.endUpdate"></summary>
    /// <param name="target" mayBeNull="false"></param>
    var e = Function._validateParams(arguments, [
        {name: "target"}
    ]);
    if (e) throw e;
    Sys.Observer._ensureObservable(target);
    var ctx = Sys.Observer._getContext(target);
    if (!ctx || !ctx.updating) return;
    ctx.updating = false;
    var dirty = ctx.dirty;
    ctx.dirty = false;
    if (dirty) {
        if (target instanceof Array) {
            var changes = ctx.changes;
            ctx.changes = null;
            Sys.Observer.raiseCollectionChanged(target, changes);
        }
        Sys.Observer.raisePropertyChanged(target, "");
    }
}
$type.isUpdating = function Observer$isUpdating(target) {
    /// <summary locid="M:J#Sys.Observer.isUpdating"></summary>
    /// <param name="target" mayBeNull="false"></param>
    /// <returns type="Boolean"></returns>
    var e = Function._validateParams(arguments, [
        {name: "target"}
    ]);
    if (e) throw e;
    Sys.Observer._ensureObservable(target);
    var ctx = Sys.Observer._getContext(target);
    return ctx ? ctx.updating : false;
}
$type._setValue = function Observer$_setValue(target, propertyName, value) {
    var getter, setter, mainTarget = target, path = propertyName.split('.');
    for (var i = 0, l = (path.length - 1); i < l ; i++) {
        var name = path[i];
        getter = target["get_" + name]; 
        if (typeof (getter) === "function") {
            target = getter.call(target);
        }
        else {
            target = target[name];
        }
        var type = typeof (target);
        if ((target === null) || (type === "undefined")) {
            throw Error.invalidOperation(String.format(Sys.Res.nullReferenceInPath, propertyName));
        }
    }    
    var currentValue, lastPath = path[l];
    getter = target["get_" + lastPath];
    if (typeof(getter) === 'function') {
        currentValue = getter.call(target);
    }
    else {
        currentValue = target[lastPath];
    }
    callIf(target, "set_" + lastPath, value) || (target[lastPath] = value);
    if (currentValue !== value) {
        var ctx = Sys.Observer._getContext(mainTarget);
        if (ctx && ctx.updating) {
            ctx.dirty = true;
            return;
        };
        Sys.Observer.raisePropertyChanged(mainTarget, path[0]);
    }
}
$type.setValue = function Observer$setValue(target, propertyName, value) {
    /// <summary locid="M:J#Sys.Observer.setValue">Sets a property or field on the target in an observable manner.</summary>
    /// <param name="target" mayBeNull="false">The object to set a property on.</param>
    /// <param name="propertyName" type="String">The name of the property to field to set.</param>
    /// <param name="value" mayBeNull="true">The value to set.</param>
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "propertyName", type: String},
        {name: "value", mayBeNull: true}
    ]);
    if (e) throw e;
    Sys.Observer._ensureObservable(target);
    Sys.Observer._setValue(target, propertyName, value);
}
$type.raisePropertyChanged = function Observer$raisePropertyChanged(target, propertyName) {
    /// <summary locid="M:J#Sys.Observer.raisePropertyChanged">Raises a change notification event.</summary>
    /// <param name="target" mayBeNull="false">The object to raise the event on.</param>
    /// <param name="propertyName" type="String">The name of the property that changed.</param>
    Sys.Observer.raiseEvent(target, "propertyChanged", new Sys.PropertyChangedEventArgs(propertyName));
}

$type.addCollectionChanged = function Observer$addCollectionChanged(target, handler) {
    /// <summary locid="M:J#Sys.Observer.addCollectionChanged"></summary>
    /// <param name="target" type="Array" elementMayBeNull="true"></param>
    /// <param name="handler" type="Function"></param>
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    Sys.Observer._addEventHandler(target, "collectionChanged", handler);
}
$type.removeCollectionChanged = function Observer$removeCollectionChanged(target, handler) {
    /// <summary locid="M:J#Sys.Observer.removeCollectionChanged"></summary>
    /// <param name="target" type="Array" elementMayBeNull="true"></param>
    /// <param name="handler" type="Function"></param>
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    Sys.Observer._removeEventHandler(target, "collectionChanged", handler);
}
$type._collectionChange = function Observer$_collectionChange(target, change) {
    var ctx = this._getContext(target);
    if (ctx && ctx.updating) {
        ctx.dirty = true;
        var changes = ctx.changes;
        if (!changes) {
            ctx.changes = changes = [change];
        }
        else {
            changes.push(change);
        }
    }
    else {
        this.raiseCollectionChanged(target, [change]);
        this.raisePropertyChanged(target, 'length');
    }
}
$type.add = function Observer$add(target, item) {
    /// <summary locid="M:J#Sys.Observer.add">Adds an item to the collection in an observable manner.</summary>
    /// <param name="target" type="Array" elementMayBeNull="true">The array to add to.</param>
    /// <param name="item" mayBeNull="true">The item to add.</param>
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    var change = new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [item], target.length);
    Array.add(target, item);
    Sys.Observer._collectionChange(target, change);
}
$type.addRange = function Observer$addRange(target, items) {
    /// <summary locid="M:J#Sys.Observer.addRange">Adds items to the collection in an observable manner.</summary>
    /// <param name="target" type="Array" elementMayBeNull="true">The array to add to.</param>
    /// <param name="items" type="Array" elementMayBeNull="true">The array of items to add.</param>
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "items", type: Array, elementMayBeNull: true}
    ]);
    if (e) throw e;
    var change = new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, items, target.length);
    Array.addRange(target, items);
    Sys.Observer._collectionChange(target, change);
}
$type.clear = function Observer$clear(target) {
    /// <summary locid="M:J#Sys.Observer.clear">Clears the array of its elements in an observable manner.</summary>
    /// <param name="target" type="Array" elementMayBeNull="true">The array to clear.</param>
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true}
    ]);
    if (e) throw e;
    var oldItems = Array.clone(target);
    Array.clear(target);
    Sys.Observer._collectionChange(target, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.reset, null, -1, oldItems, 0));
}
$type.insert = function Observer$insert(target, index, item) {
    /// <summary locid="M:J#Sys.Observer.insert">Inserts an item at the specified index in an observable manner.</summary>
    /// <param name="target" type="Array" elementMayBeNull="true">The array to insert into.</param>
    /// <param name="index" type="Number" integer="true">The index where the item will be inserted.</param>
    /// <param name="item" mayBeNull="true">The item to insert.</param>
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "index", type: Number, integer: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    Array.insert(target, index, item);
    Sys.Observer._collectionChange(target, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [item], index));
}
$type.remove = function Observer$remove(target, item) {
    /// <summary locid="M:J#Sys.Observer.remove">Removes the first occurence of an item from the array in an observable manner.</summary>
    /// <param name="target" type="Array" elementMayBeNull="true">The array to remove from.</param>
    /// <param name="item" mayBeNull="true">The item to remove.</param>
    /// <returns type="Boolean">True if the item was found.</returns>
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    var index = Array.indexOf(target, item);
    if (index !== -1) {
        Array.remove(target, item);
        Sys.Observer._collectionChange(target, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, [item], index));
        return true;
    }
    return false;
}
$type.removeAt = function Observer$removeAt(target, index) {
    /// <summary locid="M:J#Sys.Observer.removeAt">Removes the item at the specified index from the array in an observable manner.</summary>
    /// <param name="target" type="Array" elementMayBeNull="true">The array to remove from.</param>
    /// <param name="index" type="Number" integer="true">The index of the item to remove.</param>
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "index", type: Number, integer: true}
    ]);
    if (e) throw e;
    if ((index > -1) && (index < target.length)) {
        var item = target[index];
        Array.removeAt(target, index);
        Sys.Observer._collectionChange(target, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, [item], index));
    }
}
$type.raiseCollectionChanged = function Observer$raiseCollectionChanged(target, changes) {
    /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Raises the collectionChanged event.</summary>
    /// <param name="target">The collection to raise the event on.</param>
    /// <param name="changes" type="Array" elementType="Sys.CollectionChange">A list of changes that were performed on the collection since the last event.</param>
    Sys.Observer.raiseEvent(target, "collectionChanged", new Sys.NotifyCollectionChangedEventArgs(changes));
}

$type._observeMethods = {
    add_propertyChanged: function(handler) {
        Sys.Observer._addEventHandler(this, "propertyChanged", handler);
    },
    remove_propertyChanged: function(handler) {
        Sys.Observer._removeEventHandler(this, "propertyChanged", handler);
    },
    addEventHandler: function(eventName, handler) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Adds an observable event handler.</summary>
        /// <param name="eventName" type="String"></param>
        /// <param name="handler" type="Function"></param>
        var e = Function._validateParams(arguments, [
            {name: "eventName", type: String},
            {name: "handler", type: Function}
        ]);
        if (e) throw e;
        Sys.Observer._addEventHandler(this, eventName, handler);
    },
    removeEventHandler: function(eventName, handler) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Removes an observable event handler.</summary>
        /// <param name="eventName" type="String"></param>
        /// <param name="handler" type="Function"></param>
        var e = Function._validateParams(arguments, [
            {name: "eventName", type: String},
            {name: "handler", type: Function}
        ]);
        if (e) throw e;
        Sys.Observer._removeEventHandler(this, eventName, handler);
    },
    clearEventHandlers: function(eventName) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Removes all observable event handlers from the target.</summary>
        /// <param name="target"></param>
        /// <param name="eventName" type="String" mayBeNull="true" optional="true">If not given, handlers for all events are removed.</param>
        var e = Function._validateParams(arguments, [
            {name: "target"},
            {name: "eventName", type: String, mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        Sys.Observer._getContext(this, true).events._removeHandlers(eventName);
    },
    get_isUpdating: function() {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged"></summary>
        /// <returns type="Boolean"></returns>
        return Sys.Observer.isUpdating(this);
    },
    beginUpdate: function() {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged"></summary>
        Sys.Observer.beginUpdate(this);
    },
    endUpdate: function() {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged"></summary>
        Sys.Observer.endUpdate(this);
    },
    setValue: function(name, value) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Sets a property or field on the target in an observable manner.</summary>
        /// <param name="name" type="String">The name of the property to field to set.</param>
        /// <param name="value" mayBeNull="true">The value to set.</param>
        var e = Function._validateParams(arguments, [
            {name: "name", type: String},
            {name: "value", mayBeNull: true}
        ]);
        if (e) throw e;
        Sys.Observer._setValue(this, name, value);
    },
    raiseEvent: function(eventName, eventArgs) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Raises an observable event.</summary>
        /// <param name="eventName" type="String"></param>
        /// <param name="eventArgs" optional="true" mayBeNull="true"></param>
        Sys.Observer.raiseEvent(this, eventName, eventArgs||null);
    },
    raisePropertyChanged: function(name) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Raises a change notification event.</summary>
        /// <param name="name" type="String">The name of the property that changed.</param>
        Sys.Observer.raiseEvent(this, "propertyChanged", new Sys.PropertyChangedEventArgs(name));
    }
}
$type._arrayMethods = {
    add_collectionChanged: function(handler) {
        Sys.Observer._addEventHandler(this, "collectionChanged", handler);
    },
    remove_collectionChanged: function(handler) {
        Sys.Observer._removeEventHandler(this, "collectionChanged", handler);
    },
    add: function(item) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Adds an item to the collection in an observable manner.</summary>
        /// <param name="item" mayBeNull="true">The item to add.</param>
        Sys.Observer.add(this, item);
    },
    addRange: function(items) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Adds items to the collection in an observable manner.</summary>
        /// <param name="items" type="Array" elementMayBeNull="true">The array of items to add.</param>
        Sys.Observer.addRange(this, items);
    },
    clear: function() {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Clears the array of its elements in an observable manner.</summary>
        Sys.Observer.clear(this);
    },
    insert: function(index, item) { 
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Inserts an item at the specified index in an observable manner.</summary>
        /// <param name="index" type="Number" integer="true">The index where the item will be inserted.</param>
        /// <param name="item" mayBeNull="true">The item to insert.</param>
        Sys.Observer.insert(this, index, item);
    },
    remove: function(item) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Removes the first occurence of an item from the array in an observable manner.</summary>
        /// <param name="item" mayBeNull="true">The item to remove.</param>
        /// <returns type="Boolean">True if the item was found.</returns>
        return Sys.Observer.remove(this, item);
    },
    removeAt: function(index) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Removes the item at the specified index from the array in an observable manner.</summary>
        /// <param name="index" type="Number" integer="true">The index of the item to remove.</param>
        Sys.Observer.removeAt(this, index);
    },
    raiseCollectionChanged: function(changes) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Raises the collectionChanged event.</summary>
        /// <param name="changes" type="Array" elementType="Sys.CollectionChange">A list of changes that were performed on the collection since the last event.</param>
        Sys.Observer.raiseEvent(this, "collectionChanged", new Sys.NotifyCollectionChangedEventArgs(changes));
    }
}
$type._getContext = function Observer$_getContext(obj, create) {
    var ctx = obj._observerContext;
    if (ctx) return ctx();
    if (create) {
        return (obj._observerContext = this._createContext())();
    }
    return null;
}
$type._createContext = function Observer$_createContext() {
    var ctx = {
        events: new Sys.EventHandlerList()
    };
    return function() {
        return ctx;
    }
}

Type.registerNamespace("Sys.Services");
var ns = Sys.Services;
var service = "Service",
    role = "Role",
    auth = "Authentication",
    profile = "Profile";
function setPath(path) {
    this._path = path;
}
ns[auth+service] = {
    set_path: setPath,
    _setAuthenticated: function(auth) {
        this._auth = auth;
    }
};
ns["_" + auth + service] = {};

ns[profile + service] = { set_path: setPath };
ns["_" + profile + service] = {};
ns.ProfileGroup = function ns$ProfileGroup(properties) {
    this._propertygroup = properties;
}

ns[role + service] = { set_path: setPath };
ns["_" + role + service] = {};



Sys._domLoaded();
}

if (Sys.loader) {
	Sys.loader.registerScript("Core", null, execute);
}
else {
	execute();
}

})(window, window.Sys);

