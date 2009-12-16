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
        arr = arr instanceof Array || 
            (typeof(arr.length) === 'number' && (typeof(arr.callee) === "function" || (arr.item && typeof(arr.nodeType) === "undefined") && !arr.addEventListener && !arr.attachEvent))
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
        loaded = 3;

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
            target.addEventListener(name, onEvent, false);
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
            function domReady() {
                if (!Sys._domReady) {
                    Sys._domReady = true;
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
        _getById: function _getById(found, id, single, includeSelf, element) {
            if (element) {
                if (includeSelf && (element.id === id)) {
                    found[0] = element;
                }
                else {
                    foreach(all("*", element), function(element) {
                        if (element.id === id) {
                            found[0] = element;
                            return true;
                        }
                    });
                }
            }
            else {
                var e = document.getElementById(id);
                if (e) found[0] = e;
            }
            return found.length;
        },
        _getByClass: function _getByClass(found, targetClass, single, includeSelf, element) {
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
        },
        query: function query(selector, context) {
            /// <summary>Queries the DOM for a set of DOM elements.</summary>
            /// <validationOptions enabled="false" />
            /// <param name="selector">Selector for a set of DOM elements based on id (#&lt;id>), class (.&lt;name>), or tag name (&lt;tagname>). More complex selectors may be used if jQuery is loaded.</param>
            /// <param name="context" optional="true" mayBeNull="true">An element, array of elements, or Sys.UI.TemplateContext to restrict the query within.</param>
            /// <returns type="Array">Array of matching elements. If no results, an empty array.</returns>
            return (context && typeof(context.query) === "function") ?
                context.query(selector) :
                this._find(selector, context);
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
        _find: function _find(selector, context, single) {
            var found = [];
            if (typeof(selector) !== "string") {
                found.push(selector);
            }
            else {
                var includeSelf = context instanceof Array,
                    match = /^([\$#\.])((\w|[$:\.\-])+)$/.exec(selector);
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
                                    return finder(found, selector, single, includeSelf, node);
                                }
                            });
                        }
                        else {
                            finder(found, selector, single);
                        }
                    }
                }
                else if (/^\w+$/.test(selector)) {
                    if (includeSelf) {
                        foreach(context, function(node) {
                            if (node.nodeType === 1) {
                                if (node.tagName.toLowerCase() === selector) {
                                    found.push(node);
                                    if (single) return true;
                                }
                                if(!foreach(all(selector, node), function(node) {
                                    found.push(node);
                                    if (single) return true;
                                })) {
                                    return true;
                                }
                            }
                        });
                    }
                    else {
                        var nodes = all(selector, context);
                        if (single) {
                            return (nodes[0] || null);
                        }
                        foreach(nodes, function(node) {
                            found.push(node);
                        });
                    }
                }
                else if (window.jQuery) {
                    found = jQuery(selector).get();
                }
            }
            return found.length ? (single ? found[0] : found) : null;
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
                    Sys.onDomReady(function() { completedCallback(features, userContext) });
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
            basePath: null,
            _loading: 0,
            _session: 0,
            _init: function _init() {
                var scripts = all("script"),
                selfUrl = scripts.length ? scripts[scripts.length - 1].src : null;
                this.basePath = selfUrl ? (selfUrl.slice(0, selfUrl.lastIndexOf("/"))) : "";
            },
            _loadSrc: function _loadSrc(src, callback) {
                var script = merge(createElement('script'), {
                        type: 'text/javascript',
                        src: src }),
                    loaded = lazyget(this, "_loadedScripts", {});
                foreach(all("script"), function(script) {
                    var src = script.src;
                    if (src) loaded[src] = true;
                });
                if (loaded[script.src]) {
                    if (callback) callback();
                }
                else {
                    listenOnce(script, "load", "onreadystatechange", callback, true, true);
                    this._loading++;
                    loaded[script.src] = true;
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
                    path = (debug ? (scriptInfo.debugUrl || scriptInfo.releaseUrl) : scriptInfo.releaseUrl).replace(/\{0\}/, name) || "";
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
                        if (scriptInfo.name === "jQuery" && window.jQuery) {
                            var loader = Sys.loader;
                            forIn(Sys.components, loader._createPlugin);
                            forIn(Sys.plugins, function(plugin) {
                                loader._createPlugin(plugin, true);
                            });
                        }
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
            _buildArgs: function _buildArgs(fn, arglist, defaultSummary) {
                var desc = fn.description || defaultSummary,
                    comments = [];
                if (desc) {
                    comments.push('/// <summary>', desc, '</summary>\n');
                }
                foreach(fn.parameters, function(parameter) {
                    var name = parameter, type = '', desc = '';
                    if (typeof(parameter) !== "string") {
                        name = parameter.name;
                        type = parameter.type;
                        desc = parameter.description||'';
                    }
                    arglist.push(name);
                    comments.push('/// <param name="', name, '"');
                    if (type) {
                        comments.push(' type="', type, '"');
                    }
                    comments.push('>', desc, '</param>\n');
                });
                return comments;
            },
            _getCreate: function _getCreateDebug(component, isPlugin, isjQuery, creatingjQueryPlugin) {
                var name = component.name,
                    scriptInfo = component.script,
                    isBehavior = component._isBehavior,
                    typeName = component.typeName,
                    arglist = [],
                    comments = this._buildArgs(component, arglist,
                        isPlugin ? "" : "Creates an instance of the type '" + typeName  + "' and sets the given properties.");
                if (isBehavior && !isjQuery) {
                    arglist.splice(0, 0, "target");
                    comments.push('/// <param name="target">The DOM element to attach to, as a DOM element or selector.</param>\n');
                }
                if (!isPlugin) {
                    arglist.push("properties");
                    comments.push('/// <param name="properties" type="Object" mayBeNull="true" optional="true">Additional properties to set on the component.</param>\n');
                    if (!isjQuery) {
                        comments.push('/// <returns type="', typeName, '" />\n');
                    }
                }
                else if (component.returnType) {
                    comments.push('/// <returns type="', component.returnType, '" />\n');
                }
                if (isjQuery) {
                    if (!isPlugin && component._isBehavior) {
                        comments.push("var args = Array.prototype.slice.call(arguments, 0);\
args.splice(0, 0, null); \
return this.each(function() { \
    args[0] = this; \
    Sys.create[\"", name, "\"].apply(Sys.create, args); \
});\n");
                    }
                    else {
                        comments.push('Sys.create["', name, '"].apply(Sys.create, arguments);\n');
                    }
                }
                else {
                    comments.push("throw new Error(\"The '", name, "' plugin requires Sys.scripts.", scriptInfo.name, " to be loaded with a call to Sys.require() first.\");\n");
                }
                arglist.push(comments.join(''));
                var createFn = Function.apply(null, arglist);
                if (!creatingjQueryPlugin) {
                    this._createPlugin(component, isPlugin);
                }
                return createFn;
            },
            _registerParents: function _registerParents(scriptInfo) {
                function register(dependency) {
                    var depInfo = getScriptInfo(dependency);
                    lazyset(depInfo, "_parents", scriptInfo.name, scriptInfo);
                }
                foreach(scriptInfo["dependencies"], register);
                foreach(scriptInfo["executionDependencies"], register);
            },
            _createPlugin: function _createPlugin(component, isPlugin) {
                if (window.jQuery) {
                    var name = component.name,
                        target = component._isBehavior ? jQuery.fn : jQuery,
                        fn = target[name],
                        defaults = fn && fn.defaults;
                    target[name] = fn = (isPlugin && component.plugin) || Sys.loader._getCreate(component, isPlugin === true, true, true);
                    if (!isPlugin) {
                        fn.defaults = defaults || null;
                    }
                }
            },
            defineScript: function defineScript(scriptInfo) {
                /// <summary>Defines a script and its dependencies.</summary>
                /// <validationOptions enabled="false" />
                /// <param name="scriptInfo" type="Object">The script to define. You may use the following fields: name (required), debugUrl (string), releaseUrl (string), dependencies (array), executionDependencies (array).</param>
                var scripts = Sys.scripts,
                    name = scriptInfo.name,
                    contains = scriptInfo.contains;
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
                        Sys.components[name] = merge(Sys.components[name], component);
                        var fn = Sys.create[name],
                            defaults = fn && fn.defaults;
                        Sys.create[name] = fn = Sys.loader._getCreate(component);
                        fn.defaults = defaults || null;
                    }
                    
                    foreach(scriptInfo.components, registerComponent);
                    isBehavior = true;
                    foreach(scriptInfo.behaviors, registerComponent);
                    foreach(scriptInfo.plugins, function(plugin) {
                        if (typeof(plugin) === "string") {
                            plugin = { name: plugin };
                        }
                        var name = plugin.name;
                        plugin.script = scriptInfo;
                        Sys.plugins[name] = merge(Sys.plugins[name], plugin);
                        Sys[name] = Sys[name] || Sys.loader._getCreate(plugin, true);
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
    
    var loader = Sys.loader;
    loader._init();

    loader.defineScripts({
        releaseUrl: "%/MicrosoftAjax{0}.js",
        debugUrl: "%/MicrosoftAjax{0}.debug.js",
        executionDependencies: ["Core"]
    },
    [{ name: "Core",
        executionDependencies: null,
        isLoaded: !!window.Type
    },
     { name: "ComponentModel",
       isLoaded: !!Sys.Component,
       plugins: [{name: "setCommand", description: "Causes a DOM element to raise a bubble event when clicked.",
                    parameters: [{name: "commandSource", description: "The DOM element that causes the event when clicked."},
                                 {name: "commandName", description: "The name of the command to raise."},
                                 {name: "commandArgument", description: "Optional command argument."},
                                 {name: "commandTarget", description: "DOM element from which the command should start bubbling up."}]},
                 {name: "addHandler", description: "A cross-browser way to add a DOM event handler to an element.",
                    parameters: [{name: "elements", description: "The element or text node, or array of elements or text nodes, that exposes the event."},
                                 {name: "eventName", type: "String", description: "The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'."},
                                 {name: "handler", type: "Function", description: "The event handler to add."},
                                 {name: "autoRemove", type: "Boolean", description: "Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or Sys.Application.disposeElement is called."}] },
                 {name: "removeHandler", description: "A cross-browser way to remove a DOM event handler from an element.",
                    parameters: [{name: "elements", description: "The element or text node, or array of elements or text nodes, that exposes the event."},
                                 {name: "eventName", type: "String", description: "The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'."},
                                 {name: "handler", type: "Function", description: "The event handler to remove."}] },
                 {name: "addHandlers", description: "Adds a list of event handlers to an element. If a handlerOwner is specified, delegates are created with each of the handlers.",
                    parameters: [{name: "elements", description: "The element or text node, or array of element or text nodes, that exposes the event."},
                                 {name: "events", type: "Object", description: "A dictionary of event handlers."},
                                 {name: "handlerOwner", description: "The owner of the event handlers that will be the this pointer for the delegates that will be created from the handlers."},
                                 {name: "autoRemove", type: "Boolean", description: "Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or Sys.Application.disposeElement is called."}] },
                 {name: "clearHandlers", description: "Clears all the event handlers that were added to the element or array of elements.",
                    parameters: [{name: "elements", description: "The element or text node, or an array of elements or text nodes."}] }
       ]
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
     { name: "AdoNet",
       executionDependencies: ["WebServices"],
       components: ["Sys.Data.AdoNetServiceProxy"],
       isLoaded: !!(Sys.Data && Sys.Data.AdoNetServiceProxy)
     },
     { name: "DataContext",
       executionDependencies: ["ComponentModel", "Serialization", "WebServices", "AdoNet"],
       components: ["Sys.Data.DataContext", "Sys.Data.AdoNetDataContext"],
       isLoaded: !!(Sys.Data && Sys.Data.DataContext)
     },
     { name: "Templates",
       executionDependencies: ["ComponentModel", "Serialization"],
       behaviors: ["Sys.UI.DataView"],
       plugins: [{name: "bind", parameters: ['target',{name:'property',type:'String'},'source',{name:'path',type:'String'},'options']},
                 {name: "activateElements", returnType: "Sys.UI.TemplateContext",
                    parameters: [{name: "elements", description: "The elements to activate."}, {name: "bindingContext", description: "The binding context."}, {name: "recursive", type: "Boolean", description: "Specifies whether processing should occur recursively."}]}],
       isLoaded: !!(Sys.UI && Sys.UI.Template)
     },
     { name: "MicrosoftAjax",
       releaseUrl: "%/MicrosoftAjax.js",
       debugUrl: "%/MicrosoftAjax.debug.js",
       executionDependencies: null,
       contains: ["Core", "ComponentModel", "History", "Serialization", "Network", "WebServices", "Globalization"]
     }
    ]);
    
    var ajaxPath = (window.location.protocol === "https" ? "https" : "http") + "://ajax.microsoft.com/ajax/";
    
    loader.defineScripts(null, [
     { name: "jQuery",
       releaseUrl: ajaxPath + "jquery/jquery-1.3.2.min.js",
       debugUrl: ajaxPath + "jquery/jquery-1.3.2.js",
       isLoaded: !!window.jQuery
     },
     { name: "jQueryValidate",
       releaseUrl: ajaxPath + "jquery.validate/1.5.5/jquery.validate.min.js",
       debugUrl: ajaxPath + "jquery.validate/1.5.5/jquery.validate.js",
       dependencies: ["jQuery"],
       isLoaded: !!(window.jQuery && jQuery.fn.validate)
     }
    ]);
    loader = null;

Sys._domLoaded();
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
}

})(window, window.Sys);

