// (c) 2010 CodePlex Foundation
(function(window, Sys) {

if (!Sys || !Sys.loader) {
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
  
    var notLoading = 0,
        loading = 1,
        loadingCo = 2,
        loaded = 3,
        autoToken = {};

    function foreachScriptInfo(arr, callback) {
        var cancelled;
        if (arr) {
            for (var i = 0, l = arr.length; i < l; i++) {
                if (callback(getScriptInfo(arr[i]))) {
                    cancelled = true;
                    break;
                }
            }
        }
        return !cancelled;
    }
    function toIndex(arr) {
        var obj = {};
        foreach(arr, function(name) {
            obj[name] = true;
        });
        return obj;
    }
    function contains(source, item) {
        for (var i = 0, l = source.length; i < l; i++) {
            if (source[i] === item) return true;
        }
        return false;
    }
    function getCompositeDependencies(composite, executionDependencies) {
        var dependencies = [];
        foreachScriptInfo(composite.contains, function(scriptInfo) {
            foreach(lazyget(scriptInfo, executionDependencies ? "executionDependencies" : "dependencies"), function(name) {
                if (!composite._contains[name]) dependencies.push(name);
            });
        });
        return dependencies;
    }
    function getDependencies(scriptInfo, executionDependencies) {
        var dependencies;
        if (scriptInfo.contains) {
            dependencies = getCompositeDependencies(scriptInfo, executionDependencies);
        }
        else {
            var composite = getComposite(scriptInfo);
            if (composite) {
                dependencies = getCompositeDependencies(composite, executionDependencies);
            }
            else {
                dependencies = lazyget(scriptInfo, executionDependencies ? "executionDependencies" : "dependencies");
            }
        }
        return dependencies;
    }
    function requireParents(scriptInfo) {
        forIn(scriptInfo["_parents"], function(parentInfo) {
            forIn(parentInfo["_composites"], function(composite) {
                requireScript(composite, null, null, true);
            });
            requireScript(parentInfo, null, null, true);
        });
    }
    function getScriptInfo(name) {
        return resolveScriptInfo(name) || (Sys.scripts[name] = { name: name });
    }
    function requireScript(scriptInfo, callback, session, readOnly) {
        return Sys.loader._requireScript(scriptInfo, callback, session, readOnly);
    }
    function requireAll(scriptInfos, callback, session, readOnly) {
        var waiting;
        foreach(scriptInfos, function(dependency) {
            dependency = resolveScriptInfo(dependency);
            waiting |= requireScript(dependency, callback, session, readOnly);
        });
        return waiting;
    }
    function resolveScriptInfo(nameOrScriptInfo, onlyScripts) {
        var info = typeof(nameOrScriptInfo) === "string" ?
                Sys.scripts[nameOrScriptInfo] ||
                Sys.composites[nameOrScriptInfo] ||
                (!onlyScripts && (lazyget(Sys.components[nameOrScriptInfo], "script") || lazyget(Sys.plugins[nameOrScriptInfo], "script"))) :
            (nameOrScriptInfo ? (nameOrScriptInfo.script || nameOrScriptInfo) : null);
        if (info && !info._isScript) {
            info = null;
        }
        return info;
    }
    function state(scriptInfo, newState) {
        var ret = (scriptInfo._state = newState || scriptInfo._state) || 0;
        if (newState) {
            foreachScriptInfo(scriptInfo.contains, function(scriptInfo) {
                state(scriptInfo, newState);
            });
        }
        return ret;
    }
    function getComposite(scriptInfo) {
        return scriptInfo._composite;
    }
    function isLoaded(scriptInfo) {
        return !scriptInfo || (state(scriptInfo) > loadingCo);
    }
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
        ,require: function require(features, completedCallback, userContext) {
            /// <summary>
            /// Declares what scripts or script features are required, loads the appropriate script resources, and executes a callback when they are available.
            /// </summary>
            /// <validationOptions enabled="false" />
            /// <param name="features" type="Array">Array of all the required scripts and/or features. [Sys.scripts.foo, Sys.scripts.bar, Sys.components.foo, ...]</param>
            /// <param name="completedCallback" type="Function" optional="true" mayBeNull="true">Optional callback that is called when all the requirements are available.</param>
            /// <param name="userContext" optional="true" mayBeNull="true">Optional context that is passed to the completed callback.</param>
            var session = Sys.loader._session++,
                iterating,
                loaded;
            function raiseCallback() {
                if (completedCallback) {
                    if (Sys._autoRequire && userContext !== autoToken) {
                        lazypush(Sys, "_autoQueue", raiseCallback);
                    }
                    else {
                        Sys.onDomReady(function() { completedCallback(features, userContext) });
                    }
                }
            }
            function allLoaded() {
                
                if (!loaded && !iterating && !iteration()) {
                    loaded = true;
                    raiseCallback();
                }
                raiseOnReady();
            }
            function iteration() {
                iterating = true;
                var resolvedScripts = [];
                foreach(features, function(feature) {
                    feature = resolveScriptInfo(feature);
                    if (feature) {
                        var contains = feature.contains;
                        if (contains) {
                            foreachScriptInfo(contains, function(scriptInfo) {
                                resolvedScripts.push(scriptInfo);
                            });
                        }
                        else {
                            resolvedScripts.push(feature);
                        }
                    }
                });
                if (Sys.loader.combine) {
                    Sys.loader._findComposites(resolvedScripts);
                }
                var waiting = requireAll(resolvedScripts, allLoaded, session);
                iterating = false;
                return waiting;
            }
            allLoaded();
        },
        loadScripts: function loadScripts(scriptUrls, completedCallback, userContext) {
            /// <summary>
            /// Loads the given scripts, and executes a callback when they are available. Ensures each script is not loaded more than once even if one is referenced with a &lt;script&gt; element on the page.
            /// </summary>
            /// <validationOptions enabled="false" />
            /// <param name="scriptUrls" type="Array" elementType="String">Array of all the scripts to load. The scripts are loaded in sequential order.</param>
            /// <param name="completedCallback" type="Function" optional="true" mayBeNull="true">Optional callback that is called when all the scripts are available.</param>
            /// <param name="userContext" optional="true" mayBeNull="true">Optional context that is passed to the completed callback.</param>
            this.loader._loadScripts(scriptUrls, completedCallback, userContext);
        },
        loader: {
            __class: true,
            combine: true,
            basePath: "",
            _loading: 0,
            _session: 0,
            _init: function _init() {
                var scripts = all("script"),
                    selfUrl = scripts.length ? scripts[scripts.length - 1].src : null;
                if (selfUrl) {
                    this.basePath = selfUrl.slice(0, selfUrl.lastIndexOf("/"));
                    var i = selfUrl.lastIndexOf("#"), list;
                    if (i !== -1) {
                        var args = selfUrl.substr(i+1).split("&");
                        foreach(args, function(pair) {
                            var parts = pair.split("="),
                                name = parts[0],
                                value = parts[1];
                            if (name === "require") {
                                list = value.split(",");
                            }
                        });
                    }
                    Sys._autoRequire = list;
                }
            },
            _loadSrc: function _loadSrc(src, callback) {
                var script = merge(createElement('script'), {
                        type: 'text/javascript',
                        src: src }),
                    loaded = lazyget(this, "_loadedScripts", {});
                foreach(all("script"), function(script) {
                    var src = script.src;
                    if (src && !loaded[src]) loaded[src] = [];
                });
                var ls = loaded[src];
                if (ls) {
                    if (callback) ls.push(callback);
                }
                else {
                    listenOnce(script, "load", "onreadystatechange", function() {
                        foreach(ls, function(callback) {callback();});
                        loaded[src] = null;
                    }, 
                    true, true);

                    this._loading++;
                    loaded[src] = ls = callback ? [callback] : [];
                    all("head")[0].appendChild(script);
                }
            },
            _load: function _load(scriptInfo, callback, session) {
                var waiting;
                if (isLoaded(scriptInfo)) {
                    callback();
                }
                else {
                    waiting = true;
                    var notifyList = lazyget(scriptInfo, "_notify", []),
                        key = "session" + session;
                    if (!notifyList[key]) {
                        notifyList[key] = true;
                        notifyList.push(callback);
                    }
                    if (state(scriptInfo) < loading) {
                        state(scriptInfo, loading);
                        this._loadSrc(this._getUrl(scriptInfo), this._getHandler(scriptInfo));
                    }
                }
                return waiting;
            },            
            _getUrl: function _getUrl(scriptInfo) {
                var debug = Sys.debug,
                    name = scriptInfo.name,
                    path = (debug ? (scriptInfo.debugUrl || scriptInfo.releaseUrl) : scriptInfo.releaseUrl).replace(/\{0\}/g, name) || "";
                if (path.substr(0, 2) === "%/") {
                    var basePath = this.basePath,
                        hasSlash = (basePath.charAt(basePath.length-1) === "/");
                    path = basePath + (hasSlash ? "" : "/") + path.substr(2);
                }
                return path;
            },
            _getHandler: function _getHandler(scriptInfo) {
                return function() {
                    Sys.loader._loading--;
                    if (state(scriptInfo) < loadingCo) {
                        state(scriptInfo, loadingCo);
                    }
                    foreachCall(scriptInfo, "_notify");
                    foreachScriptInfo(scriptInfo.contains, function(scriptInfo) {
                        foreachCall(scriptInfo, "_notify");
                    });
                }
            },
            _findComposites: function _findComposites(scripts) {
                var scriptSet = {},
                    compositeMapping = {},
                    foundAny;
                function visit(script) {
                    script = resolveScriptInfo(script);
                    var currentState = state(script);
                    if (currentState < loading && !getComposite(script)) {
                        scriptSet[script.name] = script;
                        foundAny = true;
                        foreach(script["dependencies"], visit);
                    }
                    if (currentState < loaded) {
                        foreach(script["executionDependencies"], visit);
                    }
                }
                foreach(scripts, visit);
                if (foundAny) {
                    forIn(Sys.composites, function(composite) {
                        if (foreachScriptInfo(composite.contains, function(contained) {
                                if (!scriptSet[contained.name]) {
                                    return true;
                                }
                            })) {
                            var offsets = {}, offsetCount = 0;
                            foreach(composite.contains, function(name) {
                                var otherCandidate = compositeMapping[name];
                                if (otherCandidate && !offsets[otherCandidate.name]) {
                                    offsets[otherCandidate.name] = otherCandidate;
                                    offsetCount += otherCandidate.contains.length - 1;
                                }
                            });
                            if (composite.contains.length - 1 > offsetCount) {
                                forIn(offsets, function(offset) {
                                    foreach(offset.contains, function(name) {
                                        delete compositeMapping[name];
                                    });
                                });
                                foreach(composite.contains, function(name) {
                                    compositeMapping[name] = composite;
                                });
                            }
                        }
                    });
                    forIn(compositeMapping, function(composite, name) {
                        Sys.scripts[name]._composite = composite;
                    });
                }
            },
            _loadScripts: function _loadScripts(scriptUrls, completedCallback, userContext) {
                var index = -1, loaded = lazyget(this, "_loadedScripts", {});
                scriptUrls = scriptUrls instanceof Array ? Array.apply(null, scriptUrls) : [scriptUrls];
                function scriptLoaded(first) {
                    if (!first) Sys.loader._loading--;
                    if (++index < scriptUrls.length) {
                        Sys.loader._loadSrc(scriptUrls[index], scriptLoaded);
                    }
                    else {
                        if (completedCallback) {
                            completedCallback(scriptUrls, userContext);
                        }
                        raiseOnReady();
                    }
                }
                scriptLoaded(true);
            },
            _requireScript: function _requireScript(scriptInfo, callback, session, readOnly) {
                var waiting;
                if (!isLoaded(scriptInfo)) {
                    var waitForDeps = requireAll(getDependencies(scriptInfo), callback, session, readOnly),
                        waitForDepsCo = requireAll(getDependencies(scriptInfo, true), callback, session, readOnly);
                    if (!waitForDeps && !waitForDepsCo && state(scriptInfo) === loadingCo) {
                        state(scriptInfo, loaded);
                        foreachCall(scriptInfo, "_callback");
                        if (readOnly) {
                            var contains = scriptInfo.contains;
                            if (contains) {
                                foreachScriptInfo(contains, function(scriptInfo) {
                                    requireParents(scriptInfo);
                                });
                            }
                            else {
                                requireParents(getScriptInfo(scriptInfo));
                            }
                        }
                    }
                    else if (!readOnly && !waitForDeps) {
                        this._load(getComposite(scriptInfo) || scriptInfo, callback, session);
                    }
                    waiting |= (waitForDeps || waitForDepsCo);
                }
                return waiting || !isLoaded(scriptInfo);
            },            
            _registerParents: function _registerParents(scriptInfo) {
                function register(dependency) {
                    var depInfo = getScriptInfo(dependency);
                    lazyset(depInfo, "_parents", scriptInfo.name, scriptInfo);
                }
                foreach(scriptInfo["dependencies"], register);
                foreach(scriptInfo["executionDependencies"], register);
            },

            defineScript: function defineScript(scriptInfo) {
                /// <summary>Defines a script and its dependencies.</summary>
                /// <validationOptions enabled="false" />
                /// <param name="scriptInfo" type="Object">The script to define. You may use the following fields: name (required), debugUrl (string), releaseUrl (string), dependencies (array), executionDependencies (array).</param>
                var scripts = Sys.scripts,
                    name = scriptInfo.name,
                    contains = scriptInfo.contains,
                    loader = this;
                if (contains) {
                    var composites = Sys.composites;
                    composites[name] = scriptInfo = merge(composites[name], scriptInfo);
                    scriptInfo._contains = toIndex(contains);
                    foreachScriptInfo(contains, function(contain) {
                        lazyset(contain, "_composites", name, scriptInfo);
                    });
                }
                else {
                    scriptInfo = scripts[name] = merge(scripts[name], scriptInfo);
                    this._registerParents(scriptInfo);
                    var isBehavior;
                    function registerComponent(component) {
                        var name;
                        if (typeof(component) === "string") {
                            component = { typeName: component };
                        }
                        else {
                            name = component.name;
                        }
                        if (!name) {
                            name = component.typeName;
                            var i = name.lastIndexOf('.');
                            if (i >= 0) {
                                name = name.substr(i+1);
                            }
                            name = name.substr(0, 1).toLowerCase() + name.substr(1);
                            component.name = name;
                        }
                        component._isBehavior = isBehavior;
                        component.script = scriptInfo;
                        var components = Sys.components,
                            entry = components[name] = merge(components[name], component),
                            fn = Sys._getCreate(component),
                            target = isBehavior ? Sys.ElementSet.prototype : Sys.create;
                        target[name] = target[name] || fn;
                    }
                    foreach(scriptInfo.components, registerComponent);
                    isBehavior = true;
                    foreach(scriptInfo.behaviors, registerComponent);
                    foreach(scriptInfo.plugins, function(plugin) {
                        var name = plugin.name,
                            fnName = plugin.functionName || name,
                            plugins = Sys.plugins;
                        plugin.script = scriptInfo;
                        plugins[name] = merge(plugins[name], plugin);
                        var target = plugin.global ? Sys :
                                (plugin.dom ? Sys.ElementSet.prototype : 
                                    (plugin.components ? Sys.ComponentSet.prototype : null));
                        if (target) {
                            target[fnName] = target[fnName] || Sys._getCreate(plugin, true);
                        }
                    });
                }
                if (scriptInfo.isLoaded) {
                    scriptInfo._state = loaded;
                }
                scriptInfo._isScript = true;
            },
            defineScripts: function defineScripts(defaultScriptInfo, scriptInfos) {
                /// <summary>Defines a set of script and its dependencies.</summary>
                /// <validationOptions enabled="false" />
                /// <param name="defaultScriptInfo" type="Object">A default set of properties to apply to each defined script.</param>
                /// <param name="scriptInfos" type="Array" elementType="Object">The set of scripts to define. You may define on each: name (required), debugUrl (string), releaseUrl (string), dependencies (array), executionDependencies (array).</param>
                foreach(scriptInfos, function(scriptInfo) {
                    Sys.loader.defineScript(merge(null, defaultScriptInfo, scriptInfo));
                });
            },
            registerScript: function registerScript(name, executionDependencies, executionCallback) {
                /// <summary>Called by a script when it loads and it supports deferred exeuction.</summary>
                /// <validationOptions enabled="false" />
                /// <param name="name" type="String"></param>
                /// <param name="executionDependencies" mayBeNull="true" type="Array" elementType="String"></param>
                /// <param name="executionCallback" type="Function"></param>
                var scriptInfo = getScriptInfo(name);
                scriptInfo._callback = executionCallback;
                var existingList = lazyget(scriptInfo, "executionDependencies", []),
                    existing = toIndex(existingList);
                foreach(executionDependencies, function(executionDependency) {
                    if (!existing[executionDependency]) {
                        existingList.push(executionDependency);
                    }
                });
                this._registerParents(scriptInfo);
                
                state(scriptInfo, loadingCo);
                requireScript(scriptInfo, null, null, true);
            }
        } // loader
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
        body.push("throw new Error(\"The '", options.name, "' plugin requires Sys.scripts.", options.script.name, " to be loaded with a call to Sys.require() first.\");\n");
        arglist.push(body.join(''));
    
        var fn = Function.apply(null, arglist);
        if (!isPlugin) {
            fn._component = options;
        }
        fn._slmock = true;
        return fn;
        
    }
    Sys._getCreate = Sys._getCreate || getCreate;
obj = Sys.loader;

obj.defineScripts({
    releaseUrl: "%/MicrosoftAjax{0}.js",
    debugUrl: "%/MicrosoftAjax{0}.debug.js",
    executionDependencies: ["Core"]
},
[{ name: "Core",
    executionDependencies: null,
    isLoaded: !!window.Type
},
 { name: "ComponentModel",
   plugins: [{name: "setCommand", dom: true, description: "Causes a DOM element to raise a bubble event when clicked.",
                parameters: [{name: "commandName", description: "The name of the command to raise."},
                             {name: "commandArgument", description: "Optional command argument."},
                             {name: "commandTarget", description: "DOM element from which the command should start bubbling up."}]},
             {name: "addHandler", dom: true, description: "A cross-browser way to add a DOM event handler to an element.",
                parameters: [{name: "eventName", type: "String", description: "The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'."},
                             {name: "handler", type: "Function", description: "The event handler to add."},
                             {name: "autoRemove", type: "Boolean", description: "Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or Sys.Application.disposeElement is called."}] },
             {name: "removeHandler", dom: true, description: "A cross-browser way to remove a DOM event handler from an element.",
                parameters: [{name: "eventName", type: "String", description: "The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'."},
                             {name: "handler", type: "Function", description: "The event handler to remove."}] },
             {name: "addHandlers", dom: true, description: "Adds a list of event handlers to an element. If a handlerOwner is specified, delegates are created with each of the handlers.",
                parameters: [{name: "events", type: "Object", description: "A dictionary of event handlers."},
                             {name: "handlerOwner", description: "The owner of the event handlers that will be the this pointer for the delegates that will be created from the handlers."},
                             {name: "autoRemove", type: "Boolean", description: "Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or Sys.Application.disposeElement is called."}] },
             {name: "clearHandlers", dom: true, description: "Clears all the event handlers that were added to the element or array of elements." }
   ],
   isLoaded: !!Sys.Component
 },
 { name: "History",
   executionDependencies: ["ComponentModel", "Serialization"],
   isLoaded: !!(Sys.Application && Sys.Application.get_stateString)
 },
 { name: "Serialization",
   isLoaded: !!Sys.Serialization
 },
 { name: "Network",
   executionDependencies: ["Serialization"],
   isLoaded: !!(Sys.Net && Sys.Net.WebRequest)
 },
 { name: "WebServices",
   executionDependencies: ["Network"],
   isLoaded: !!(Sys.Net && Sys.Net.WebServiceProxy)
 },
 { name: "ApplicationServices",
   executionDependencies: ["WebServices"],
   isLoaded: !!(Sys.Services && Sys.Services.RoleService && Sys.Services.RoleService.get_path)
 },
 { name: "Globalization",
   isLoaded: !!Number._parse
 },
 { name: "OpenData",
   executionDependencies: ["DataContext"],
   components: [
        "Sys.Data.OpenDataContext",
        { typeName: "Sys.Data.OpenDataServiceProxy", parameters: [{name: "serviceUri", type: "String"}] }
   ],
   isLoaded: !!(Sys.Data && Sys.Data.OpenDataServiceProxy)
 },
 { name: "DataContext",
   executionDependencies: ["ComponentModel", "Serialization", "WebServices"],
   components: ["Sys.Data.DataContext"],
   isLoaded: !!(Sys.Data && Sys.Data.DataContext)
 },
 { name: "Templates",
   executionDependencies: ["ComponentModel", "Serialization"],
   behaviors: ["Sys.UI.DataView"],
   plugins: [{name: "binding", global: true, parameters: ['target',{name:'property',type:'String'},'source',{name:'path',type:'String'},'options']},
             {name: "binding", dom: true, parameters: [{name:'property',type:'String'},'source',{name:'path',type:'String'},'options']},
             {name: "binding", components: true, parameters: [{name:'property',type:'String'},'source',{name:'path',type:'String'},'options']},
             {name: "activateElements", dom: true, 
                parameters: [{name: "bindingContext", description: "The binding context."}, {name: "recursive", type: "Boolean", description: "Specifies whether processing should occur recursively."}]}],
   isLoaded: !!(Sys.UI && Sys.UI.Template)
 },
 { name: "MicrosoftAjax",
   releaseUrl: "%/MicrosoftAjax.js",
   debugUrl: "%/MicrosoftAjax.debug.js",
   executionDependencies: null,
   contains: ["Core", "ComponentModel", "History", "Serialization", "Network", "WebServices", "Globalization"]
 }
]);

var ajaxPath = (window.location.protocol === "https:" ? "https" : "http") + "://ajax.microsoft.com/ajax/";

obj.defineScripts(null, [
 { name: "jQuery",
   releaseUrl: ajaxPath + "jquery/jquery-1.4.1.min.js",
   debugUrl: ajaxPath + "jquery/jquery-1.4.1.js",
   isLoaded: !!window.jQuery
 },
 { name: "jQueryValidate",
   releaseUrl: ajaxPath + "jquery.validate/1.6/jquery.validate.min.js",
   debugUrl: ajaxPath + "jquery.validate/1.6/jquery.validate.js",
   dependencies: ["jQuery"],
   isLoaded: !!(window.jQuery && jQuery.fn.validate)
 }
]);

obj._init();
if (!window.Type) {
    window.Type = Function;
    Type.registerNamespace = Type.registerNamespace || function registerNamespace(namespacePath) {
        lazypush(Sys, "_ns", namespacePath);
        var rootObject = window;
        foreach(namespacePath.split('.'), function(part) {
            rootObject = rootObject[part] = rootObject[part] || {};
        });
        rootObject = null;
    }
}
Sys._domLoaded();
}

})(window, window.Sys);

