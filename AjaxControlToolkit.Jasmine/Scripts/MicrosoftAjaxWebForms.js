// Name:        MicrosoftAjaxWebForms.js
// Assembly:    System.Web.Extensions
// Version:     4.0.0.0
// FileVersion: 4.0.30319.34248
//-----------------------------------------------------------------------
// Copyright (C) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------
// MicrosoftAjaxWebForms.js
// Microsoft AJAX ASP.NET WebForms Framework.
Type._registerScript("MicrosoftAjaxWebForms.js", [
	"MicrosoftAjaxCore.js",
	"MicrosoftAjaxSerialization.js",
	"MicrosoftAjaxNetwork.js",
	"MicrosoftAjaxComponentModel.js"]);
Type.registerNamespace('Sys.WebForms');
Sys.WebForms.BeginRequestEventArgs = function Sys$WebForms$BeginRequestEventArgs(request, postBackElement, updatePanelsToUpdate) {
    /// <summary locid="M:J#Sys.WebForms.BeginRequestEventArgs.#ctor" />
    /// <param name="request" type="Sys.Net.WebRequest"></param>
    /// <param name="postBackElement" domElement="true" mayBeNull="true"></param>
    /// <param name="updatePanelsToUpdate" type="Array" elementType="String" mayBeNull="true" optional="true"></param>
    var e = Function._validateParams(arguments, [
        { name: "request", type: Sys.Net.WebRequest },
        { name: "postBackElement", mayBeNull: true, domElement: true },
        { name: "updatePanelsToUpdate", type: Array, mayBeNull: true, optional: true, elementType: String }
    ]);
    if(e) throw e;
    Sys.WebForms.BeginRequestEventArgs.initializeBase(this);
    this._request = request;
    this._postBackElement = postBackElement;
    this._updatePanelsToUpdate = updatePanelsToUpdate;
}
function Sys$WebForms$BeginRequestEventArgs$get_postBackElement() {
    /// <value domElement="true" mayBeNull="true" locid="P:J#Sys.WebForms.BeginRequestEventArgs.postBackElement"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._postBackElement;
}
function Sys$WebForms$BeginRequestEventArgs$get_request() {
    /// <value type="Sys.Net.WebRequest" locid="P:J#Sys.WebForms.BeginRequestEventArgs.request"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._request;
}
function Sys$WebForms$BeginRequestEventArgs$get_updatePanelsToUpdate() {
    /// <value type="Array" elementType="String" locid="P:J#Sys.WebForms.BeginRequestEventArgs.updatePanelsToUpdate"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._updatePanelsToUpdate ? Array.clone(this._updatePanelsToUpdate) : [];
}
Sys.WebForms.BeginRequestEventArgs.prototype = {
    get_postBackElement: Sys$WebForms$BeginRequestEventArgs$get_postBackElement,
    get_request: Sys$WebForms$BeginRequestEventArgs$get_request,
    get_updatePanelsToUpdate: Sys$WebForms$BeginRequestEventArgs$get_updatePanelsToUpdate
}
Sys.WebForms.BeginRequestEventArgs.registerClass('Sys.WebForms.BeginRequestEventArgs', Sys.EventArgs);

Sys.WebForms.EndRequestEventArgs = function Sys$WebForms$EndRequestEventArgs(error, dataItems, response) {
    /// <summary locid="M:J#Sys.WebForms.EndRequestEventArgs.#ctor" />
    /// <param name="error" type="Error" mayBeNull="true"></param>
    /// <param name="dataItems" type="Object" mayBeNull="true"></param>
    /// <param name="response" type="Sys.Net.WebRequestExecutor"></param>
    var e = Function._validateParams(arguments, [
        { name: "error", type: Error, mayBeNull: true },
        { name: "dataItems", type: Object, mayBeNull: true },
        { name: "response", type: Sys.Net.WebRequestExecutor }
    ]);
    if(e) throw e;
    Sys.WebForms.EndRequestEventArgs.initializeBase(this);
    this._errorHandled = false;
    this._error = error;
    this._dataItems = dataItems || new Object();
    this._response = response;
}
function Sys$WebForms$EndRequestEventArgs$get_dataItems() {
    /// <value type="Object" locid="P:J#Sys.WebForms.EndRequestEventArgs.dataItems"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._dataItems;
}
function Sys$WebForms$EndRequestEventArgs$get_error() {
    /// <value type="Error" locid="P:J#Sys.WebForms.EndRequestEventArgs.error"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._error;
}
function Sys$WebForms$EndRequestEventArgs$get_errorHandled() {
    /// <value type="Boolean" locid="P:J#Sys.WebForms.EndRequestEventArgs.errorHandled"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._errorHandled;
}
function Sys$WebForms$EndRequestEventArgs$set_errorHandled(value) {
    var e = Function._validateParams(arguments, [{ name: "value", type: Boolean }]);
    if(e) throw e;
    this._errorHandled = value;
}
function Sys$WebForms$EndRequestEventArgs$get_response() {
    /// <value type="Sys.Net.WebRequestExecutor" locid="P:J#Sys.WebForms.EndRequestEventArgs.response"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._response;
}
Sys.WebForms.EndRequestEventArgs.prototype = {
    get_dataItems: Sys$WebForms$EndRequestEventArgs$get_dataItems,
    get_error: Sys$WebForms$EndRequestEventArgs$get_error,
    get_errorHandled: Sys$WebForms$EndRequestEventArgs$get_errorHandled,
    set_errorHandled: Sys$WebForms$EndRequestEventArgs$set_errorHandled,
    get_response: Sys$WebForms$EndRequestEventArgs$get_response
}
Sys.WebForms.EndRequestEventArgs.registerClass('Sys.WebForms.EndRequestEventArgs', Sys.EventArgs);
Sys.WebForms.InitializeRequestEventArgs = function Sys$WebForms$InitializeRequestEventArgs(request, postBackElement, updatePanelsToUpdate) {
    /// <summary locid="M:J#Sys.WebForms.InitializeRequestEventArgs.#ctor" />
    /// <param name="request" type="Sys.Net.WebRequest"></param>
    /// <param name="postBackElement" domElement="true" mayBeNull="true"></param>
    /// <param name="updatePanelsToUpdate" type="Array" elementType="String" mayBeNull="true" optional="true"></param>
    var e = Function._validateParams(arguments, [
        { name: "request", type: Sys.Net.WebRequest },
        { name: "postBackElement", mayBeNull: true, domElement: true },
        { name: "updatePanelsToUpdate", type: Array, mayBeNull: true, optional: true, elementType: String }
    ]);
    if(e) throw e;
    Sys.WebForms.InitializeRequestEventArgs.initializeBase(this);
    this._request = request;
    this._postBackElement = postBackElement;
    this._updatePanelsToUpdate = updatePanelsToUpdate;
}
function Sys$WebForms$InitializeRequestEventArgs$get_postBackElement() {
    /// <value domElement="true" mayBeNull="true" locid="P:J#Sys.WebForms.InitializeRequestEventArgs.postBackElement"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._postBackElement;
}
function Sys$WebForms$InitializeRequestEventArgs$get_request() {
    /// <value type="Sys.Net.WebRequest" locid="P:J#Sys.WebForms.InitializeRequestEventArgs.request"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._request;
}
function Sys$WebForms$InitializeRequestEventArgs$get_updatePanelsToUpdate() {
    /// <value type="Array" elementType="String" locid="P:J#Sys.WebForms.InitializeRequestEventArgs.updatePanelsToUpdate"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._updatePanelsToUpdate ? Array.clone(this._updatePanelsToUpdate) : [];
}
function Sys$WebForms$InitializeRequestEventArgs$set_updatePanelsToUpdate(value) {
    var e = Function._validateParams(arguments, [{ name: "value", type: Array, elementType: String }]);
    if(e) throw e;
    this._updated = true;
    this._updatePanelsToUpdate = value;
}
Sys.WebForms.InitializeRequestEventArgs.prototype = {
    get_postBackElement: Sys$WebForms$InitializeRequestEventArgs$get_postBackElement,
    get_request: Sys$WebForms$InitializeRequestEventArgs$get_request,
    get_updatePanelsToUpdate: Sys$WebForms$InitializeRequestEventArgs$get_updatePanelsToUpdate,
    set_updatePanelsToUpdate: Sys$WebForms$InitializeRequestEventArgs$set_updatePanelsToUpdate
}
Sys.WebForms.InitializeRequestEventArgs.registerClass('Sys.WebForms.InitializeRequestEventArgs', Sys.CancelEventArgs);

Sys.WebForms.PageLoadedEventArgs = function Sys$WebForms$PageLoadedEventArgs(panelsUpdated, panelsCreated, dataItems) {
    /// <summary locid="M:J#Sys.WebForms.PageLoadedEventArgs.#ctor" />
    /// <param name="panelsUpdated" type="Array"></param>
    /// <param name="panelsCreated" type="Array"></param>
    /// <param name="dataItems" type="Object" mayBeNull="true"></param>
    var e = Function._validateParams(arguments, [
        { name: "panelsUpdated", type: Array },
        { name: "panelsCreated", type: Array },
        { name: "dataItems", type: Object, mayBeNull: true }
    ]);
    if(e) throw e;
    Sys.WebForms.PageLoadedEventArgs.initializeBase(this);
    this._panelsUpdated = panelsUpdated;
    this._panelsCreated = panelsCreated;
    this._dataItems = dataItems || new Object();
}
function Sys$WebForms$PageLoadedEventArgs$get_dataItems() {
    /// <value type="Object" locid="P:J#Sys.WebForms.PageLoadedEventArgs.dataItems"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._dataItems;
}
function Sys$WebForms$PageLoadedEventArgs$get_panelsCreated() {
    /// <value type="Array" locid="P:J#Sys.WebForms.PageLoadedEventArgs.panelsCreated"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._panelsCreated;
}
function Sys$WebForms$PageLoadedEventArgs$get_panelsUpdated() {
    /// <value type="Array" locid="P:J#Sys.WebForms.PageLoadedEventArgs.panelsUpdated"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._panelsUpdated;
}
Sys.WebForms.PageLoadedEventArgs.prototype = {
    get_dataItems: Sys$WebForms$PageLoadedEventArgs$get_dataItems,
    get_panelsCreated: Sys$WebForms$PageLoadedEventArgs$get_panelsCreated,
    get_panelsUpdated: Sys$WebForms$PageLoadedEventArgs$get_panelsUpdated
}
Sys.WebForms.PageLoadedEventArgs.registerClass('Sys.WebForms.PageLoadedEventArgs', Sys.EventArgs);
Sys.WebForms.PageLoadingEventArgs = function Sys$WebForms$PageLoadingEventArgs(panelsUpdating, panelsDeleting, dataItems) {
    /// <summary locid="M:J#Sys.WebForms.PageLoadingEventArgs.#ctor" />
    /// <param name="panelsUpdating" type="Array"></param>
    /// <param name="panelsDeleting" type="Array"></param>
    /// <param name="dataItems" type="Object" mayBeNull="true"></param>
    var e = Function._validateParams(arguments, [
        { name: "panelsUpdating", type: Array },
        { name: "panelsDeleting", type: Array },
        { name: "dataItems", type: Object, mayBeNull: true }
    ]);
    if(e) throw e;
    Sys.WebForms.PageLoadingEventArgs.initializeBase(this);
    this._panelsUpdating = panelsUpdating;
    this._panelsDeleting = panelsDeleting;
    this._dataItems = dataItems || new Object();
}
function Sys$WebForms$PageLoadingEventArgs$get_dataItems() {
    /// <value type="Object" locid="P:J#Sys.WebForms.PageLoadingEventArgs.dataItems"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._dataItems;
}
function Sys$WebForms$PageLoadingEventArgs$get_panelsDeleting() {
    /// <value type="Array" locid="P:J#Sys.WebForms.PageLoadingEventArgs.panelsDeleting"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._panelsDeleting;
}
function Sys$WebForms$PageLoadingEventArgs$get_panelsUpdating() {
    /// <value type="Array" locid="P:J#Sys.WebForms.PageLoadingEventArgs.panelsUpdating"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._panelsUpdating;
}
Sys.WebForms.PageLoadingEventArgs.prototype = {
    get_dataItems: Sys$WebForms$PageLoadingEventArgs$get_dataItems,
    get_panelsDeleting: Sys$WebForms$PageLoadingEventArgs$get_panelsDeleting,
    get_panelsUpdating: Sys$WebForms$PageLoadingEventArgs$get_panelsUpdating
}
Sys.WebForms.PageLoadingEventArgs.registerClass('Sys.WebForms.PageLoadingEventArgs', Sys.EventArgs);

Sys._ScriptLoader = function Sys$_ScriptLoader() {
    this._scriptsToLoad = null;
    this._sessions = [];
    this._scriptLoadedDelegate = Function.createDelegate(this, this._scriptLoadedHandler);
}
function Sys$_ScriptLoader$dispose() {
    this._stopSession();
    this._loading = false;
    if(this._events) {
        delete this._events;
    }
    this._sessions = null;
    this._currentSession = null;
    this._scriptLoadedDelegate = null;
}
function Sys$_ScriptLoader$loadScripts(scriptTimeout, allScriptsLoadedCallback, scriptLoadFailedCallback, scriptLoadTimeoutCallback) {
    /// <summary locid="M:J#Sys._ScriptLoader.loadScripts" />
    /// <param name="scriptTimeout" type="Number" integer="true"></param>
    /// <param name="allScriptsLoadedCallback" type="Function" mayBeNull="true"></param>
    /// <param name="scriptLoadFailedCallback" type="Function" mayBeNull="true"></param>
    /// <param name="scriptLoadTimeoutCallback" type="Function" mayBeNull="true"></param>
    var e = Function._validateParams(arguments, [
        { name: "scriptTimeout", type: Number, integer: true },
        { name: "allScriptsLoadedCallback", type: Function, mayBeNull: true },
        { name: "scriptLoadFailedCallback", type: Function, mayBeNull: true },
        { name: "scriptLoadTimeoutCallback", type: Function, mayBeNull: true }
    ]);
    if(e) throw e;
    var session = {
        allScriptsLoadedCallback: allScriptsLoadedCallback,
        scriptLoadFailedCallback: scriptLoadFailedCallback,
        scriptLoadTimeoutCallback: scriptLoadTimeoutCallback,
        scriptsToLoad: this._scriptsToLoad,
        scriptTimeout: scriptTimeout
    };
    this._scriptsToLoad = null;
    this._sessions[this._sessions.length] = session;

    if(!this._loading) {
        this._nextSession();
    }
}
function Sys$_ScriptLoader$queueCustomScriptTag(scriptAttributes) {
    /// <summary locid="M:J#Sys._ScriptLoader.queueCustomScriptTag" />
    /// <param name="scriptAttributes" mayBeNull="false"></param>
    var e = Function._validateParams(arguments, [
        { name: "scriptAttributes" }
    ]);
    if(e) throw e;
    if(!this._scriptsToLoad) {
        this._scriptsToLoad = [];
    }
    Array.add(this._scriptsToLoad, scriptAttributes);
}
function Sys$_ScriptLoader$queueScriptBlock(scriptContent) {
    /// <summary locid="M:J#Sys._ScriptLoader.queueScriptBlock" />
    /// <param name="scriptContent" type="String" mayBeNull="false"></param>
    var e = Function._validateParams(arguments, [
        { name: "scriptContent", type: String }
    ]);
    if(e) throw e;
    if(!this._scriptsToLoad) {
        this._scriptsToLoad = [];
    }
    Array.add(this._scriptsToLoad, { text: scriptContent });
}
function Sys$_ScriptLoader$queueScriptReference(scriptUrl, fallback) {
    /// <summary locid="M:J#Sys._ScriptLoader.queueScriptReference" />
    /// <param name="scriptUrl" type="String" mayBeNull="false"></param>
    /// <param name="fallback" mayBeNull="true" optional="true"></param>
    var e = Function._validateParams(arguments, [
        { name: "scriptUrl", type: String },
        { name: "fallback", mayBeNull: true, optional: true }
    ]);
    if(e) throw e;
    if(!this._scriptsToLoad) {
        this._scriptsToLoad = [];
    }
    Array.add(this._scriptsToLoad, { src: scriptUrl, fallback: fallback });
}
function Sys$_ScriptLoader$_createScriptElement(queuedScript) {
    var scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    for(var attr in queuedScript) {
        scriptElement[attr] = queuedScript[attr];
    }

    return scriptElement;
}
function Sys$_ScriptLoader$_loadScriptsInternal() {
    var session = this._currentSession;
    if(session.scriptsToLoad && session.scriptsToLoad.length > 0) {
        var nextScript = Array.dequeue(session.scriptsToLoad);
        var onLoad = this._scriptLoadedDelegate;
        if(nextScript.fallback) {
            var fallback = nextScript.fallback;
            delete nextScript.fallback;

            var self = this;
            onLoad = function(scriptElement, loaded) {
                loaded || (function() {
                    var fallbackScriptElement = self._createScriptElement({ src: fallback });
                    self._currentTask = new Sys._ScriptLoaderTask(fallbackScriptElement, self._scriptLoadedDelegate);
                    self._currentTask.execute();
                })();
            };
        }
        var scriptElement = this._createScriptElement(nextScript);

        if(scriptElement.text && Sys.Browser.agent === Sys.Browser.Safari) {
            scriptElement.innerHTML = scriptElement.text;
            delete scriptElement.text;
        }
        if(typeof (nextScript.src) === "string") {
            this._currentTask = new Sys._ScriptLoaderTask(scriptElement, onLoad);
            this._currentTask.execute();
        }
        else {
            var headElements = document.getElementsByTagName('head');
            if(headElements.length === 0) {
                throw new Error.invalidOperation(Sys.Res.scriptLoadFailedNoHead);
            }
            else {
                headElements[0].appendChild(scriptElement);
            }


            Sys._ScriptLoaderTask._clearScript(scriptElement);
            this._loadScriptsInternal();
        }
    }
    else {
        this._stopSession();
        var callback = session.allScriptsLoadedCallback;
        if(callback) {
            callback(this);
        }
        this._nextSession();
    }
}
function Sys$_ScriptLoader$_nextSession() {
    if(this._sessions.length === 0) {
        this._loading = false;
        this._currentSession = null;
        return;
    }
    this._loading = true;

    var session = Array.dequeue(this._sessions);
    this._currentSession = session;
    this._loadScriptsInternal();
}
function Sys$_ScriptLoader$_raiseError() {
    var callback = this._currentSession.scriptLoadFailedCallback;
    var scriptElement = this._currentTask.get_scriptElement();
    this._stopSession();

    if(callback) {
        callback(this, scriptElement);
        this._nextSession();
    }
    else {
        this._loading = false;
        throw Sys._ScriptLoader._errorScriptLoadFailed(scriptElement.src);
    }
}
function Sys$_ScriptLoader$_scriptLoadedHandler(scriptElement, loaded) {
    if(loaded) {
        Array.add(Sys._ScriptLoader._getLoadedScripts(), scriptElement.src);
        this._currentTask.dispose();
        this._currentTask = null;
        this._loadScriptsInternal();
    }
    else {
        this._raiseError();
    }
}
function Sys$_ScriptLoader$_stopSession() {
    if(this._currentTask) {
        this._currentTask.dispose();
        this._currentTask = null;
    }
}
Sys._ScriptLoader.prototype = {
    dispose: Sys$_ScriptLoader$dispose,
    loadScripts: Sys$_ScriptLoader$loadScripts,
    queueCustomScriptTag: Sys$_ScriptLoader$queueCustomScriptTag,
    queueScriptBlock: Sys$_ScriptLoader$queueScriptBlock,
    queueScriptReference: Sys$_ScriptLoader$queueScriptReference,
    _createScriptElement: Sys$_ScriptLoader$_createScriptElement,
    _loadScriptsInternal: Sys$_ScriptLoader$_loadScriptsInternal,
    _nextSession: Sys$_ScriptLoader$_nextSession,
    _raiseError: Sys$_ScriptLoader$_raiseError,
    _scriptLoadedHandler: Sys$_ScriptLoader$_scriptLoadedHandler,
    _stopSession: Sys$_ScriptLoader$_stopSession
}
Sys._ScriptLoader.registerClass('Sys._ScriptLoader', null, Sys.IDisposable);
Sys._ScriptLoader.getInstance = function Sys$_ScriptLoader$getInstance() {
    var sl = Sys._ScriptLoader._activeInstance;
    if(!sl) {
        sl = Sys._ScriptLoader._activeInstance = new Sys._ScriptLoader();
    }
    return sl;
}
Sys._ScriptLoader.isScriptLoaded = function Sys$_ScriptLoader$isScriptLoaded(scriptSrc) {
    var dummyScript = document.createElement('script');
    dummyScript.src = scriptSrc;
    return Array.contains(Sys._ScriptLoader._getLoadedScripts(), dummyScript.src);
}
Sys._ScriptLoader.readLoadedScripts = function Sys$_ScriptLoader$readLoadedScripts() {
    if(!Sys._ScriptLoader._referencedScripts) {
        var referencedScripts = Sys._ScriptLoader._referencedScripts = [];
        var existingScripts = document.getElementsByTagName('script');
        for(var i = existingScripts.length - 1; i >= 0; i--) {
            var scriptNode = existingScripts[i];
            var scriptSrc = scriptNode.src;
            if(scriptSrc.length) {
                if(!Array.contains(referencedScripts, scriptSrc)) {
                    Array.add(referencedScripts, scriptSrc);
                }
            }
        }
    }
}
Sys._ScriptLoader._errorScriptLoadFailed = function Sys$_ScriptLoader$_errorScriptLoadFailed(scriptUrl) {
    var errorMessage;
    errorMessage = Sys.Res.scriptLoadFailedDebug;
    var displayMessage = "Sys.ScriptLoadFailedException: " + String.format(errorMessage, scriptUrl);
    var e = Error.create(displayMessage, { name: 'Sys.ScriptLoadFailedException', 'scriptUrl': scriptUrl });
    e.popStackFrame();
    return e;
}
Sys._ScriptLoader._getLoadedScripts = function Sys$_ScriptLoader$_getLoadedScripts() {
    if(!Sys._ScriptLoader._referencedScripts) {
        Sys._ScriptLoader._referencedScripts = [];
        Sys._ScriptLoader.readLoadedScripts();
    }
    return Sys._ScriptLoader._referencedScripts;
}

Sys.WebForms.PageRequestManager = function Sys$WebForms$PageRequestManager() {
    this._form = null;
    this._activeDefaultButton = null;
    this._activeDefaultButtonClicked = false;
    this._updatePanelIDs = null;
    this._updatePanelClientIDs = null;
    this._updatePanelHasChildrenAsTriggers = null;
    this._asyncPostBackControlIDs = null;
    this._asyncPostBackControlClientIDs = null;
    this._postBackControlIDs = null;
    this._postBackControlClientIDs = null;
    this._scriptManagerID = null;
    this._pageLoadedHandler = null;
    this._additionalInput = null;
    this._onsubmit = null;
    this._onSubmitStatements = [];
    this._originalDoPostBack = null;
    this._originalDoPostBackWithOptions = null;
    this._originalFireDefaultButton = null;
    this._originalDoCallback = null;
    this._isCrossPost = false;
    this._postBackSettings = null;
    this._request = null;
    this._onFormSubmitHandler = null;
    this._onFormElementClickHandler = null;
    this._onWindowUnloadHandler = null;
    this._asyncPostBackTimeout = null;
    this._controlIDToFocus = null;
    this._scrollPosition = null;
    this._processingRequest = false;
    this._scriptDisposes = {};

    this._transientFields = ["__VIEWSTATEENCRYPTED", "__VIEWSTATEFIELDCOUNT"];
    this._textTypes = /^(text|password|hidden|search|tel|url|email|number|range|color|datetime|date|month|week|time|datetime-local)$/i;
}
function Sys$WebForms$PageRequestManager$_get_eventHandlerList() {
    if(!this._events) {
        this._events = new Sys.EventHandlerList();
    }
    return this._events;
}
function Sys$WebForms$PageRequestManager$get_isInAsyncPostBack() {
    /// <value type="Boolean" locid="P:J#Sys.WebForms.PageRequestManager.isInAsyncPostBack"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._request !== null;
}
function Sys$WebForms$PageRequestManager$add_beginRequest(handler) {
    /// <summary locid="E:J#Sys.WebForms.PageRequestManager.beginRequest" />
    var e = Function._validateParams(arguments, [{ name: "handler", type: Function }]);
    if(e) throw e;
    this._get_eventHandlerList().addHandler("beginRequest", handler);
}
function Sys$WebForms$PageRequestManager$remove_beginRequest(handler) {
    var e = Function._validateParams(arguments, [{ name: "handler", type: Function }]);
    if(e) throw e;
    this._get_eventHandlerList().removeHandler("beginRequest", handler);
}
function Sys$WebForms$PageRequestManager$add_endRequest(handler) {
    /// <summary locid="E:J#Sys.WebForms.PageRequestManager.endRequest" />
    var e = Function._validateParams(arguments, [{ name: "handler", type: Function }]);
    if(e) throw e;
    this._get_eventHandlerList().addHandler("endRequest", handler);
}
function Sys$WebForms$PageRequestManager$remove_endRequest(handler) {
    var e = Function._validateParams(arguments, [{ name: "handler", type: Function }]);
    if(e) throw e;
    this._get_eventHandlerList().removeHandler("endRequest", handler);
}
function Sys$WebForms$PageRequestManager$add_initializeRequest(handler) {
    /// <summary locid="E:J#Sys.WebForms.PageRequestManager.initializeRequest" />
    var e = Function._validateParams(arguments, [{ name: "handler", type: Function }]);
    if(e) throw e;
    this._get_eventHandlerList().addHandler("initializeRequest", handler);
}
function Sys$WebForms$PageRequestManager$remove_initializeRequest(handler) {
    var e = Function._validateParams(arguments, [{ name: "handler", type: Function }]);
    if(e) throw e;
    this._get_eventHandlerList().removeHandler("initializeRequest", handler);
}
function Sys$WebForms$PageRequestManager$add_pageLoaded(handler) {
    /// <summary locid="E:J#Sys.WebForms.PageRequestManager.pageLoaded" />
    var e = Function._validateParams(arguments, [{ name: "handler", type: Function }]);
    if(e) throw e;
    this._get_eventHandlerList().addHandler("pageLoaded", handler);
}
function Sys$WebForms$PageRequestManager$remove_pageLoaded(handler) {
    var e = Function._validateParams(arguments, [{ name: "handler", type: Function }]);
    if(e) throw e;
    this._get_eventHandlerList().removeHandler("pageLoaded", handler);
}
function Sys$WebForms$PageRequestManager$add_pageLoading(handler) {
    /// <summary locid="E:J#Sys.WebForms.PageRequestManager.pageLoading" />
    var e = Function._validateParams(arguments, [{ name: "handler", type: Function }]);
    if(e) throw e;
    this._get_eventHandlerList().addHandler("pageLoading", handler);
}
function Sys$WebForms$PageRequestManager$remove_pageLoading(handler) {
    var e = Function._validateParams(arguments, [{ name: "handler", type: Function }]);
    if(e) throw e;
    this._get_eventHandlerList().removeHandler("pageLoading", handler);
}
function Sys$WebForms$PageRequestManager$abortPostBack() {
    if(!this._processingRequest && this._request) {
        this._request.get_executor().abort();
        this._request = null;
    }
}
function Sys$WebForms$PageRequestManager$beginAsyncPostBack(updatePanelsToUpdate, eventTarget, eventArgument, causesValidation, validationGroup) {
    /// <summary locid="M:J#Sys.WebForms.PageRequestManager.beginAsyncPostBack" />
    /// <param name="updatePanelsToUpdate" type="Array" elementType="String" mayBeNull="true" optional="true"></param>
    /// <param name="eventTarget" type="String" mayBeNull="true" optional="true"></param>
    /// <param name="eventArgument" type="String" mayBeNull="true" optional="true"></param>
    /// <param name="causesValidation" type="Boolean" mayBeNull="true" optional="true"></param>
    /// <param name="validationGroup" type="String" mayBeNull="true" optional="true"></param>
    var e = Function._validateParams(arguments, [
        { name: "updatePanelsToUpdate", type: Array, mayBeNull: true, optional: true, elementType: String },
        { name: "eventTarget", type: String, mayBeNull: true, optional: true },
        { name: "eventArgument", type: String, mayBeNull: true, optional: true },
        { name: "causesValidation", type: Boolean, mayBeNull: true, optional: true },
        { name: "validationGroup", type: String, mayBeNull: true, optional: true }
    ]);
    if(e) throw e;
    if(causesValidation && (typeof (Page_ClientValidate) === 'function') && !Page_ClientValidate(validationGroup || null)) {
        return;
    }
    this._postBackSettings = this._createPostBackSettings(true, updatePanelsToUpdate, eventTarget);
    var form = this._form;
    form.__EVENTTARGET.value = (eventTarget || "");
    form.__EVENTARGUMENT.value = (eventArgument || "");
    this._isCrossPost = false;
    this._additionalInput = null;
    this._onFormSubmit();
}
function Sys$WebForms$PageRequestManager$_cancelPendingCallbacks() {
    for(var i = 0, l = window.__pendingCallbacks.length; i < l; i++) {
        var callback = window.__pendingCallbacks[i];
        if(callback) {
            if(!callback.async) {
                window.__synchronousCallBackIndex = -1;
            }
            window.__pendingCallbacks[i] = null;
            var callbackFrameID = "__CALLBACKFRAME" + i;
            var xmlRequestFrame = document.getElementById(callbackFrameID);
            if(xmlRequestFrame) {
                xmlRequestFrame.parentNode.removeChild(xmlRequestFrame);
            }
        }
    }
}
function Sys$WebForms$PageRequestManager$_commitControls(updatePanelData, asyncPostBackTimeout) {
    if(updatePanelData) {
        this._updatePanelIDs = updatePanelData.updatePanelIDs;
        this._updatePanelClientIDs = updatePanelData.updatePanelClientIDs;
        this._updatePanelHasChildrenAsTriggers = updatePanelData.updatePanelHasChildrenAsTriggers;
        this._asyncPostBackControlIDs = updatePanelData.asyncPostBackControlIDs;
        this._asyncPostBackControlClientIDs = updatePanelData.asyncPostBackControlClientIDs;
        this._postBackControlIDs = updatePanelData.postBackControlIDs;
        this._postBackControlClientIDs = updatePanelData.postBackControlClientIDs;
    }
    if(typeof (asyncPostBackTimeout) !== 'undefined' && asyncPostBackTimeout !== null) {
        this._asyncPostBackTimeout = asyncPostBackTimeout * 1000;
    }
}
function Sys$WebForms$PageRequestManager$_createHiddenField(id, value) {
    var container, field = document.getElementById(id);
    if(field) {
        if(!field._isContained) {
            field.parentNode.removeChild(field);
        }
        else {
            container = field.parentNode;
        }
    }
    if(!container) {
        container = document.createElement('span');
        container.style.cssText = "display:none !important";
        this._form.appendChild(container);
    }
    container.innerHTML = "<input type='hidden' />";
    field = container.childNodes[0];
    field._isContained = true;
    field.id = field.name = id;
    field.value = value;
}
function Sys$WebForms$PageRequestManager$_createPageRequestManagerTimeoutError() {
    var displayMessage = "Sys.WebForms.PageRequestManagerTimeoutException: " + Sys.WebForms.Res.PRM_TimeoutError;
    var e = Error.create(displayMessage, { name: 'Sys.WebForms.PageRequestManagerTimeoutException' });
    e.popStackFrame();
    return e;
}
function Sys$WebForms$PageRequestManager$_createPageRequestManagerServerError(httpStatusCode, message) {
    var displayMessage = "Sys.WebForms.PageRequestManagerServerErrorException: " +
        (message || String.format(Sys.WebForms.Res.PRM_ServerError, httpStatusCode));
    var e = Error.create(displayMessage, {
        name: 'Sys.WebForms.PageRequestManagerServerErrorException',
        httpStatusCode: httpStatusCode
    });
    e.popStackFrame();
    return e;
}
function Sys$WebForms$PageRequestManager$_createPageRequestManagerParserError(parserErrorMessage) {
    var displayMessage = "Sys.WebForms.PageRequestManagerParserErrorException: " + String.format(Sys.WebForms.Res.PRM_ParserError, parserErrorMessage);
    var e = Error.create(displayMessage, { name: 'Sys.WebForms.PageRequestManagerParserErrorException' });
    e.popStackFrame();
    return e;
}
function Sys$WebForms$PageRequestManager$_createPanelID(panelsToUpdate, postBackSettings) {
    var asyncTarget = postBackSettings.asyncTarget,
        toUpdate = this._ensureUniqueIds(panelsToUpdate || postBackSettings.panelsToUpdate),
        panelArg = (toUpdate instanceof Array)
            ? toUpdate.join(',')
            : (toUpdate || this._scriptManagerID);
    if(asyncTarget) {
        panelArg += "|" + asyncTarget;
    }
    return encodeURIComponent(this._scriptManagerID) + '=' + encodeURIComponent(panelArg) + '&';
}
function Sys$WebForms$PageRequestManager$_createPostBackSettings(async, panelsToUpdate, asyncTarget, sourceElement) {
    return { async: async, asyncTarget: asyncTarget, panelsToUpdate: panelsToUpdate, sourceElement: sourceElement };
}
function Sys$WebForms$PageRequestManager$_convertToClientIDs(source, destinationIDs, destinationClientIDs, version4) {
    if(source) {
        for(var i = 0, l = source.length; i < l; i += (version4 ? 2 : 1)) {
            var uniqueID = source[i],
                clientID = (version4 ? source[i + 1] : "") || this._uniqueIDToClientID(uniqueID);
            Array.add(destinationIDs, uniqueID);
            Array.add(destinationClientIDs, clientID);
        }
    }
}
function Sys$WebForms$PageRequestManager$dispose() {
    if(this._form) {
        Sys.UI.DomEvent.removeHandler(this._form, 'submit', this._onFormSubmitHandler);
        Sys.UI.DomEvent.removeHandler(this._form, 'click', this._onFormElementClickHandler);
        Sys.UI.DomEvent.removeHandler(window, 'unload', this._onWindowUnloadHandler);
        Sys.UI.DomEvent.removeHandler(window, 'load', this._pageLoadedHandler);
    }
    if(this._originalDoPostBack) {
        window.__doPostBack = this._originalDoPostBack;
        this._originalDoPostBack = null;
    }
    if(this._originalDoPostBackWithOptions) {
        window.WebForm_DoPostBackWithOptions = this._originalDoPostBackWithOptions;
        this._originalDoPostBackWithOptions = null;
    }
    if(this._originalFireDefaultButton) {
        window.WebForm_FireDefaultButton = this._originalFireDefaultButton;
        this._originalFireDefaultButton = null;
    }
    if(this._originalDoCallback) {
        window.WebForm_DoCallback = this._originalDoCallback;
        this._originalDoCallback = null;
    }
    this._form = null;
    this._updatePanelIDs = null;
    this._updatePanelClientIDs = null;
    this._asyncPostBackControlIDs = null;
    this._asyncPostBackControlClientIDs = null;
    this._postBackControlIDs = null;
    this._postBackControlClientIDs = null;
    this._asyncPostBackTimeout = null;
    this._scrollPosition = null;
    this._activeElement = null;
}
function Sys$WebForms$PageRequestManager$_doCallback(eventTarget, eventArgument, eventCallback, context, errorCallback, useAsync) {
    if(!this.get_isInAsyncPostBack()) {
        this._originalDoCallback(eventTarget, eventArgument, eventCallback, context, errorCallback, useAsync);
    }
}
function Sys$WebForms$PageRequestManager$_doPostBack(eventTarget, eventArgument) {
    var event = window.event;
    if(!event) {
        var caller = arguments.callee ? arguments.callee.caller : null;
        if(caller) {
            var recursionLimit = 30;
            while(caller.arguments.callee.caller && --recursionLimit) {
                caller = caller.arguments.callee.caller;
            }
            event = (recursionLimit && caller.arguments.length) ? caller.arguments[0] : null;
        }
    }
    this._additionalInput = null;
    var form = this._form;
    if((eventTarget === null) || (typeof (eventTarget) === "undefined") || (this._isCrossPost)) {
        this._postBackSettings = this._createPostBackSettings(false);
        this._isCrossPost = false;
    }
    else {
        var mpUniqueID = this._masterPageUniqueID;
        var clientID = this._uniqueIDToClientID(eventTarget);
        var postBackElement = document.getElementById(clientID);
        if(!postBackElement && mpUniqueID) {
            if(eventTarget.indexOf(mpUniqueID + "$") === 0) {
                postBackElement = document.getElementById(clientID.substr(mpUniqueID.length + 1));
            }
        }
        if(!postBackElement) {
            if(Array.contains(this._asyncPostBackControlIDs, eventTarget)) {
                this._postBackSettings = this._createPostBackSettings(true, null, eventTarget);
            }
            else {
                if(Array.contains(this._postBackControlIDs, eventTarget)) {
                    this._postBackSettings = this._createPostBackSettings(false);
                }
                else {
                    var nearestUniqueIDMatch = this._findNearestElement(eventTarget);
                    if(nearestUniqueIDMatch) {
                        this._postBackSettings = this._getPostBackSettings(nearestUniqueIDMatch, eventTarget);
                    }
                    else {
                        if(mpUniqueID) {
                            mpUniqueID += "$";
                            if(eventTarget.indexOf(mpUniqueID) === 0) {
                                nearestUniqueIDMatch = this._findNearestElement(eventTarget.substr(mpUniqueID.length));
                            }
                        }
                        if(nearestUniqueIDMatch) {
                            this._postBackSettings = this._getPostBackSettings(nearestUniqueIDMatch, eventTarget);
                        }
                        else {
                            var activeElement;
                            try {
                                activeElement = event ? (event.target || event.srcElement) : null;
                            }
                            catch(ex) {
                            }
                            activeElement = activeElement || this._activeElement;
                            var causesPostback = /__doPostBack\(|WebForm_DoPostBackWithOptions\(/;
                            function testCausesPostBack(attr) {
                                attr = attr ? attr.toString() : "";
                                return (causesPostback.test(attr) &&
                                    (attr.indexOf("'" + eventTarget + "'") !== -1) || (attr.indexOf('"' + eventTarget + '"') !== -1));
                            }
                            if(activeElement && (
                                    (activeElement.name === eventTarget) ||
                                    testCausesPostBack(activeElement.href) ||
                                    testCausesPostBack(activeElement.onclick) ||
                                    testCausesPostBack(activeElement.onchange)
                                    )) {
                                this._postBackSettings = this._getPostBackSettings(activeElement, eventTarget);
                            }
                            else {
                                this._postBackSettings = this._createPostBackSettings(false);
                            }
                        }
                    }
                }
            }
        }
        else {
            this._postBackSettings = this._getPostBackSettings(postBackElement, eventTarget);
        }
    }
    if(!this._postBackSettings.async) {
        form.onsubmit = this._onsubmit;
        this._originalDoPostBack(eventTarget, eventArgument);
        form.onsubmit = null;
        return;
    }
    form.__EVENTTARGET.value = eventTarget;
    form.__EVENTARGUMENT.value = eventArgument;
    this._onFormSubmit();
}
function Sys$WebForms$PageRequestManager$_doPostBackWithOptions(options) {
    this._isCrossPost = options && options.actionUrl;
    var validationResult = true;
    if(options.validation) {
        if(typeof (Page_ClientValidate) == 'function') {
            validationResult = Page_ClientValidate(options.validationGroup);
        }
    }
    if(validationResult) {
        if((typeof (options.actionUrl) != "undefined") && (options.actionUrl != null) && (options.actionUrl.length > 0)) {
            theForm.action = options.actionUrl;
        }
        if(options.trackFocus) {
            var lastFocus = theForm.elements["__LASTFOCUS"];
            if((typeof (lastFocus) != "undefined") && (lastFocus != null)) {
                if(typeof (document.activeElement) == "undefined") {
                    lastFocus.value = options.eventTarget;
                }
                else {
                    var active = document.activeElement;
                    if((typeof (active) != "undefined") && (active != null)) {
                        if((typeof (active.id) != "undefined") && (active.id != null) && (active.id.length > 0)) {
                            lastFocus.value = active.id;
                        }
                        else if(typeof (active.name) != "undefined") {
                            lastFocus.value = active.name;
                        }
                    }
                }
            }
        }
    }
    if(options.clientSubmit) {
        this._doPostBack(options.eventTarget, options.eventArgument);
    }
}
function Sys$WebForms$PageRequestManager$_elementContains(container, element) {
    while(element) {
        if(element === container) {
            return true;
        }
        element = element.parentNode;
    }
    return false;
}
function Sys$WebForms$PageRequestManager$_endPostBack(error, executor, data) {
    if(this._request === executor.get_webRequest()) {
        this._processingRequest = false;
        this._additionalInput = null;
        this._request = null;
    }
    var handler = this._get_eventHandlerList().getHandler("endRequest");
    var errorHandled = false;
    if(handler) {
        var eventArgs = new Sys.WebForms.EndRequestEventArgs(error, data ? data.dataItems : {}, executor);
        handler(this, eventArgs);
        errorHandled = eventArgs.get_errorHandled();
    }
    if(error && !errorHandled) {
        throw error;
    }
}
function Sys$WebForms$PageRequestManager$_ensureUniqueIds(ids) {
    if(!ids) return ids;
    ids = ids instanceof Array ? ids : [ids];
    var uniqueIds = [];
    for(var i = 0, l = ids.length; i < l; i++) {
        var id = ids[i], index = Array.indexOf(this._updatePanelClientIDs, id);
        uniqueIds.push(index > -1 ? this._updatePanelIDs[index] : id);
    }
    return uniqueIds;
}
function Sys$WebForms$PageRequestManager$_findNearestElement(uniqueID) {
    while(uniqueID.length > 0) {
        var clientID = this._uniqueIDToClientID(uniqueID);
        var element = document.getElementById(clientID);
        if(element) {
            return element;
        }
        var indexOfLastDollar = uniqueID.lastIndexOf('$');
        if(indexOfLastDollar === -1) {
            return null;
        }
        uniqueID = uniqueID.substring(0, indexOfLastDollar);
    }
    return null;
}
function Sys$WebForms$PageRequestManager$_findText(text, location) {
    var startIndex = Math.max(0, location - 20);
    var endIndex = Math.min(text.length, location + 20);
    return text.substring(startIndex, endIndex);
}
function Sys$WebForms$PageRequestManager$_fireDefaultButton(event, target) {
    if(event.keyCode === 13) {
        var src = event.srcElement || event.target;
        if(!src || (src.tagName.toLowerCase() !== "textarea")) {
            var defaultButton = document.getElementById(target);
            if(defaultButton && (typeof (defaultButton.click) !== "undefined")) {


                this._activeDefaultButton = defaultButton;
                this._activeDefaultButtonClicked = false;
                try {
                    defaultButton.click();
                }
                finally {
                    this._activeDefaultButton = null;
                }


                event.cancelBubble = true;
                if(typeof (event.stopPropagation) === "function") {
                    event.stopPropagation();
                }
                return false;
            }
        }
    }
    return true;
}
function Sys$WebForms$PageRequestManager$_getPageLoadedEventArgs(initialLoad, data) {
    var updated = [];
    var created = [];
    var version4 = data ? data.version4 : false;
    var upData = data ? data.updatePanelData : null;
    var newIDs, newClientIDs, childIDs, refreshedIDs;
    if(!upData) {
        newIDs = this._updatePanelIDs;
        newClientIDs = this._updatePanelClientIDs;
        childIDs = null;
        refreshedIDs = null;
    }
    else {
        newIDs = upData.updatePanelIDs;
        newClientIDs = upData.updatePanelClientIDs;
        childIDs = upData.childUpdatePanelIDs;
        refreshedIDs = upData.panelsToRefreshIDs;
    }
    var i, l, uniqueID, clientID;
    if(refreshedIDs) {
        for(i = 0, l = refreshedIDs.length; i < l; i += (version4 ? 2 : 1)) {
            uniqueID = refreshedIDs[i];
            clientID = (version4 ? refreshedIDs[i + 1] : "") || this._uniqueIDToClientID(uniqueID);
            Array.add(updated, document.getElementById(clientID));
        }
    }
    for(i = 0, l = newIDs.length; i < l; i++) {
        if(initialLoad || Array.indexOf(childIDs, newIDs[i]) !== -1) {
            Array.add(created, document.getElementById(newClientIDs[i]));
        }
    }
    return new Sys.WebForms.PageLoadedEventArgs(updated, created, data ? data.dataItems : {});
}
function Sys$WebForms$PageRequestManager$_getPageLoadingEventArgs(data) {
    var updated = [],
        deleted = [],
        upData = data.updatePanelData,
        oldIDs = upData.oldUpdatePanelIDs,
        oldClientIDs = upData.oldUpdatePanelClientIDs,
        newIDs = upData.updatePanelIDs,
        childIDs = upData.childUpdatePanelIDs,
        refreshedIDs = upData.panelsToRefreshIDs,
        i, l, uniqueID, clientID,
        version4 = data.version4;
    for(i = 0, l = refreshedIDs.length; i < l; i += (version4 ? 2 : 1)) {
        uniqueID = refreshedIDs[i];
        clientID = (version4 ? refreshedIDs[i + 1] : "") || this._uniqueIDToClientID(uniqueID);
        Array.add(updated, document.getElementById(clientID));
    }
    for(i = 0, l = oldIDs.length; i < l; i++) {
        uniqueID = oldIDs[i];
        if(Array.indexOf(refreshedIDs, uniqueID) === -1 &&
            (Array.indexOf(newIDs, uniqueID) === -1 || Array.indexOf(childIDs, uniqueID) > -1)) {
            Array.add(deleted, document.getElementById(oldClientIDs[i]));
        }
    }
    return new Sys.WebForms.PageLoadingEventArgs(updated, deleted, data.dataItems);
}
function Sys$WebForms$PageRequestManager$_getPostBackSettings(element, elementUniqueID) {
    var originalElement = element;
    var proposedSettings = null;
    while(element) {
        if(element.id) {
            if(!proposedSettings && Array.contains(this._asyncPostBackControlClientIDs, element.id)) {
                proposedSettings = this._createPostBackSettings(true, null, elementUniqueID, originalElement);
            }
            else {
                if(!proposedSettings && Array.contains(this._postBackControlClientIDs, element.id)) {
                    return this._createPostBackSettings(false);
                }
                else {
                    var indexOfPanel = Array.indexOf(this._updatePanelClientIDs, element.id);
                    if(indexOfPanel !== -1) {
                        if(this._updatePanelHasChildrenAsTriggers[indexOfPanel]) {
                            return this._createPostBackSettings(true, [this._updatePanelIDs[indexOfPanel]], elementUniqueID, originalElement);
                        }
                        else {
                            return this._createPostBackSettings(true, null, elementUniqueID, originalElement);
                        }
                    }
                }
            }
            if(!proposedSettings && this._matchesParentIDInList(element.id, this._asyncPostBackControlClientIDs)) {
                proposedSettings = this._createPostBackSettings(true, null, elementUniqueID, originalElement);
            }
            else {
                if(!proposedSettings && this._matchesParentIDInList(element.id, this._postBackControlClientIDs)) {
                    return this._createPostBackSettings(false);
                }
            }
        }
        element = element.parentNode;
    }
    if(!proposedSettings) {
        return this._createPostBackSettings(false);
    }
    else {
        return proposedSettings;
    }
}
function Sys$WebForms$PageRequestManager$_getScrollPosition() {
    var d = document.documentElement;
    if(d && (this._validPosition(d.scrollLeft) || this._validPosition(d.scrollTop))) {
        return {
            x: d.scrollLeft,
            y: d.scrollTop
        };
    }
    else {
        d = document.body;
        if(d && (this._validPosition(d.scrollLeft) || this._validPosition(d.scrollTop))) {
            return {
                x: d.scrollLeft,
                y: d.scrollTop
            };
        }
        else {
            if(this._validPosition(window.pageXOffset) || this._validPosition(window.pageYOffset)) {
                return {
                    x: window.pageXOffset,
                    y: window.pageYOffset
                };
            }
            else {
                return {
                    x: 0,
                    y: 0
                };
            }
        }
    }
}
function Sys$WebForms$PageRequestManager$_initializeInternal(scriptManagerID, formElement, updatePanelIDs, asyncPostBackControlIDs, postBackControlIDs, asyncPostBackTimeout, masterPageUniqueID) {
    if(this._prmInitialized) {
        throw Error.invalidOperation(Sys.WebForms.Res.PRM_CannotRegisterTwice);
    }
    this._prmInitialized = true;
    this._masterPageUniqueID = masterPageUniqueID;
    this._scriptManagerID = scriptManagerID;
    this._form = Sys.UI.DomElement.resolveElement(formElement);
    this._onsubmit = this._form.onsubmit;
    this._form.onsubmit = null;
    this._onFormSubmitHandler = Function.createDelegate(this, this._onFormSubmit);
    this._onFormElementClickHandler = Function.createDelegate(this, this._onFormElementClick);
    this._onWindowUnloadHandler = Function.createDelegate(this, this._onWindowUnload);
    Sys.UI.DomEvent.addHandler(this._form, 'submit', this._onFormSubmitHandler);
    Sys.UI.DomEvent.addHandler(this._form, 'click', this._onFormElementClickHandler);
    Sys.UI.DomEvent.addHandler(window, 'unload', this._onWindowUnloadHandler);
    this._originalDoPostBack = window.__doPostBack;
    if(this._originalDoPostBack) {
        window.__doPostBack = Function.createDelegate(this, this._doPostBack);
    }
    this._originalDoPostBackWithOptions = window.WebForm_DoPostBackWithOptions;
    if(this._originalDoPostBackWithOptions) {
        window.WebForm_DoPostBackWithOptions = Function.createDelegate(this, this._doPostBackWithOptions);
    }
    this._originalFireDefaultButton = window.WebForm_FireDefaultButton;
    if(this._originalFireDefaultButton) {
        window.WebForm_FireDefaultButton = Function.createDelegate(this, this._fireDefaultButton);
    }
    this._originalDoCallback = window.WebForm_DoCallback;
    if(this._originalDoCallback) {
        window.WebForm_DoCallback = Function.createDelegate(this, this._doCallback);
    }
    this._pageLoadedHandler = Function.createDelegate(this, this._pageLoadedInitialLoad);
    Sys.UI.DomEvent.addHandler(window, 'load', this._pageLoadedHandler);
    if(updatePanelIDs) {
        this._updateControls(updatePanelIDs, asyncPostBackControlIDs, postBackControlIDs, asyncPostBackTimeout, true);
    }
}
function Sys$WebForms$PageRequestManager$_matchesParentIDInList(clientID, parentIDList) {
    for(var i = 0, l = parentIDList.length; i < l; i++) {
        if(clientID.startsWith(parentIDList[i] + "_")) {
            return true;
        }
    }
    return false;
}
function Sys$WebForms$PageRequestManager$_onFormElementActive(element, offsetX, offsetY) {
    if(element.disabled) {
        return;
    }
    this._activeElement = element;
    this._postBackSettings = this._getPostBackSettings(element, element.name);
    if(element.name) {
        var tagName = element.tagName.toUpperCase();
        if(tagName === 'INPUT') {
            var type = element.type;
            if(type === 'submit') {
                this._additionalInput = encodeURIComponent(element.name) + '=' + encodeURIComponent(element.value);
            }
            else if(type === 'image') {
                this._additionalInput = encodeURIComponent(element.name) + '.x=' + offsetX + '&' + encodeURIComponent(element.name) + '.y=' + offsetY;
            }
        }
        else if((tagName === 'BUTTON') && (element.name.length !== 0) && (element.type === 'submit')) {
            this._additionalInput = encodeURIComponent(element.name) + '=' + encodeURIComponent(element.value);
        }
    }
}
function Sys$WebForms$PageRequestManager$_onFormElementClick(evt) {
    this._activeDefaultButtonClicked = (evt.target === this._activeDefaultButton);
    this._onFormElementActive(evt.target, evt.offsetX, evt.offsetY);
}
function Sys$WebForms$PageRequestManager$_onFormSubmit(evt) {
    var i, l, continueSubmit = true,
        isCrossPost = this._isCrossPost;
    this._isCrossPost = false;
    if(this._onsubmit) {
        continueSubmit = this._onsubmit();
    }
    if(continueSubmit) {
        for(i = 0, l = this._onSubmitStatements.length; i < l; i++) {
            if(!this._onSubmitStatements[i]()) {
                continueSubmit = false;
                break;
            }
        }
    }
    if(!continueSubmit) {
        if(evt) {
            evt.preventDefault();
        }
        return;
    }
    var form = this._form;
    if(isCrossPost) {
        return;
    }
    if(this._activeDefaultButton && !this._activeDefaultButtonClicked) {
        this._onFormElementActive(this._activeDefaultButton, 0, 0);
    }
    if(!this._postBackSettings || !this._postBackSettings.async) {
        return;
    }
    var formBody = new Sys.StringBuilder(),
        formElements = form.elements,
        count = formElements.length,
        panelID = this._createPanelID(null, this._postBackSettings);
    formBody.append(panelID);
    for(i = 0; i < count; i++) {
        var element = formElements[i];
        var name = element.name;
        if(typeof (name) === "undefined" || (name === null) || (name.length === 0) || (name === this._scriptManagerID)) {
            continue;
        }
        var tagName = element.tagName.toUpperCase();
        if(tagName === 'INPUT') {
            var type = element.type;
            if(this._textTypes.test(type)
                || ((type === 'checkbox' || type === 'radio') && element.checked)) {
                formBody.append(encodeURIComponent(name));
                formBody.append('=');
                formBody.append(encodeURIComponent(element.value));
                formBody.append('&');
            }
        }
        else if(tagName === 'SELECT') {
            var optionCount = element.options.length;
            for(var j = 0; j < optionCount; j++) {
                var option = element.options[j];
                if(option.selected) {
                    formBody.append(encodeURIComponent(name));
                    formBody.append('=');
                    formBody.append(encodeURIComponent(option.value));
                    formBody.append('&');
                }
            }
        }
        else if(tagName === 'TEXTAREA') {
            formBody.append(encodeURIComponent(name));
            formBody.append('=');
            formBody.append(encodeURIComponent(element.value));
            formBody.append('&');
        }
    }
    formBody.append("__ASYNCPOST=true&");
    if(this._additionalInput) {
        formBody.append(this._additionalInput);
        this._additionalInput = null;
    }

    var request = new Sys.Net.WebRequest();
    var action = form.action;
    if(Sys.Browser.agent === Sys.Browser.InternetExplorer) {
        var fragmentIndex = action.indexOf('#');
        if(fragmentIndex !== -1) {
            action = action.substr(0, fragmentIndex);
        }
        var domain = "", query = "", queryIndex = action.indexOf('?');
        if(queryIndex !== -1) {
            query = action.substr(queryIndex);
            action = action.substr(0, queryIndex);
        }
        if(/^https?\:\/\/.*$/gi.test(action)) {
            var domainPartIndex = action.indexOf("//") + 2,
                slashAfterDomain = action.indexOf("/", domainPartIndex);
            if(slashAfterDomain === -1) {
                domain = action;
                action = "";
            }
            else {
                domain = action.substr(0, slashAfterDomain);
                action = action.substr(slashAfterDomain);
            }
        }
        action = domain + encodeURI(decodeURI(action)) + query;
    }
    request.set_url(action);
    request.get_headers()['X-MicrosoftAjax'] = 'Delta=true';
    request.get_headers()['Cache-Control'] = 'no-cache';
    request.set_timeout(this._asyncPostBackTimeout);
    request.add_completed(Function.createDelegate(this, this._onFormSubmitCompleted));
    request.set_body(formBody.toString());
    var panelsToUpdate, eventArgs, handler = this._get_eventHandlerList().getHandler("initializeRequest");
    if(handler) {
        panelsToUpdate = this._postBackSettings.panelsToUpdate;
        eventArgs = new Sys.WebForms.InitializeRequestEventArgs(request, this._postBackSettings.sourceElement, panelsToUpdate);
        handler(this, eventArgs);
        continueSubmit = !eventArgs.get_cancel();
    }
    if(!continueSubmit) {
        if(evt) {
            evt.preventDefault();
        }
        return;
    }

    if(eventArgs && eventArgs._updated) {
        panelsToUpdate = eventArgs.get_updatePanelsToUpdate();
        request.set_body(request.get_body().replace(panelID, this._createPanelID(panelsToUpdate, this._postBackSettings)));
    }
    this._scrollPosition = this._getScrollPosition();
    this.abortPostBack();
    handler = this._get_eventHandlerList().getHandler("beginRequest");
    if(handler) {
        eventArgs = new Sys.WebForms.BeginRequestEventArgs(request, this._postBackSettings.sourceElement,
            panelsToUpdate || this._postBackSettings.panelsToUpdate);
        handler(this, eventArgs);
    }

    if(this._originalDoCallback) {
        this._cancelPendingCallbacks();
    }
    this._request = request;
    this._processingRequest = false;
    request.invoke();
    if(evt) {
        evt.preventDefault();
    }
}
function Sys$WebForms$PageRequestManager$_onFormSubmitCompleted(sender, eventArgs) {
    this._processingRequest = true;
    if(sender.get_timedOut()) {
        this._endPostBack(this._createPageRequestManagerTimeoutError(), sender, null);
        return;
    }
    if(sender.get_aborted()) {
        this._endPostBack(null, sender, null);
        return;
    }
    if(!this._request || (sender.get_webRequest() !== this._request)) {
        return;
    }
    if(sender.get_statusCode() !== 200) {
        this._endPostBack(this._createPageRequestManagerServerError(sender.get_statusCode()), sender, null);
        return;
    }
    var data = this._parseDelta(sender);
    if(!data) return;

    var i, l;
    if(data.asyncPostBackControlIDsNode && data.postBackControlIDsNode &&
        data.updatePanelIDsNode && data.panelsToRefreshNode && data.childUpdatePanelIDsNode) {

        var oldUpdatePanelIDs = this._updatePanelIDs,
            oldUpdatePanelClientIDs = this._updatePanelClientIDs;
        var childUpdatePanelIDsString = data.childUpdatePanelIDsNode.content;
        var childUpdatePanelIDs = childUpdatePanelIDsString.length ? childUpdatePanelIDsString.split(',') : [];
        var asyncPostBackControlIDsArray = this._splitNodeIntoArray(data.asyncPostBackControlIDsNode);
        var postBackControlIDsArray = this._splitNodeIntoArray(data.postBackControlIDsNode);
        var updatePanelIDsArray = this._splitNodeIntoArray(data.updatePanelIDsNode);
        var panelsToRefreshIDs = this._splitNodeIntoArray(data.panelsToRefreshNode);
        var v4 = data.version4;
        for(i = 0, l = panelsToRefreshIDs.length; i < l; i += (v4 ? 2 : 1)) {
            var panelClientID = (v4 ? panelsToRefreshIDs[i + 1] : "") || this._uniqueIDToClientID(panelsToRefreshIDs[i]);
            if(!document.getElementById(panelClientID)) {
                this._endPostBack(Error.invalidOperation(String.format(Sys.WebForms.Res.PRM_MissingPanel, panelClientID)), sender, data);
                return;
            }
        }

        var updatePanelData = this._processUpdatePanelArrays(
            updatePanelIDsArray,
            asyncPostBackControlIDsArray,
            postBackControlIDsArray, v4);
        updatePanelData.oldUpdatePanelIDs = oldUpdatePanelIDs;
        updatePanelData.oldUpdatePanelClientIDs = oldUpdatePanelClientIDs;
        updatePanelData.childUpdatePanelIDs = childUpdatePanelIDs;
        updatePanelData.panelsToRefreshIDs = panelsToRefreshIDs;
        data.updatePanelData = updatePanelData;
    }
    data.dataItems = {};
    var node;
    for(i = 0, l = data.dataItemNodes.length; i < l; i++) {
        node = data.dataItemNodes[i];
        data.dataItems[node.id] = node.content;
    }
    for(i = 0, l = data.dataItemJsonNodes.length; i < l; i++) {
        node = data.dataItemJsonNodes[i];
        data.dataItems[node.id] = Sys.Serialization.JavaScriptSerializer.deserialize(node.content);
    }
    var handler = this._get_eventHandlerList().getHandler("pageLoading");
    if(handler) {
        handler(this, this._getPageLoadingEventArgs(data));
    }

    Sys._ScriptLoader.readLoadedScripts();
    Sys.Application.beginCreateComponents();
    var scriptLoader = Sys._ScriptLoader.getInstance();
    this._queueScripts(scriptLoader, data.scriptBlockNodes, true, false);

    this._processingRequest = true;
    scriptLoader.loadScripts(0,
        Function.createDelegate(this, Function.createCallback(this._scriptIncludesLoadComplete, data)),
        Function.createDelegate(this, Function.createCallback(this._scriptIncludesLoadFailed, data)),
        null);
}
function Sys$WebForms$PageRequestManager$_onWindowUnload(evt) {
    this.dispose();
}
function Sys$WebForms$PageRequestManager$_pageLoaded(initialLoad, data) {
    var handler = this._get_eventHandlerList().getHandler("pageLoaded");
    if(handler) {
        handler(this, this._getPageLoadedEventArgs(initialLoad, data));
    }
    if(!initialLoad) {
        Sys.Application.raiseLoad();
    }
}
function Sys$WebForms$PageRequestManager$_pageLoadedInitialLoad(evt) {
    this._pageLoaded(true, null);
}
function Sys$WebForms$PageRequestManager$_parseDelta(executor) {
    var reply = executor.get_responseData();
    var delimiterIndex, len, type, id, content;
    var replyIndex = 0;
    var parserErrorDetails = null;
    var delta = [];
    while(replyIndex < reply.length) {
        delimiterIndex = reply.indexOf('|', replyIndex);
        if(delimiterIndex === -1) {
            parserErrorDetails = this._findText(reply, replyIndex);
            break;
        }
        len = parseInt(reply.substring(replyIndex, delimiterIndex), 10);
        if((len % 1) !== 0) {
            parserErrorDetails = this._findText(reply, replyIndex);
            break;
        }
        replyIndex = delimiterIndex + 1;
        delimiterIndex = reply.indexOf('|', replyIndex);
        if(delimiterIndex === -1) {
            parserErrorDetails = this._findText(reply, replyIndex);
            break;
        }
        type = reply.substring(replyIndex, delimiterIndex);
        replyIndex = delimiterIndex + 1;
        delimiterIndex = reply.indexOf('|', replyIndex);
        if(delimiterIndex === -1) {
            parserErrorDetails = this._findText(reply, replyIndex);
            break;
        }
        id = reply.substring(replyIndex, delimiterIndex);
        replyIndex = delimiterIndex + 1;
        if((replyIndex + len) >= reply.length) {
            parserErrorDetails = this._findText(reply, reply.length);
            break;
        }
        content = reply.substr(replyIndex, len);
        replyIndex += len;
        if(reply.charAt(replyIndex) !== '|') {
            parserErrorDetails = this._findText(reply, replyIndex);
            break;
        }
        replyIndex++;
        Array.add(delta, { type: type, id: id, content: content });
    }
    if(parserErrorDetails) {
        this._endPostBack(this._createPageRequestManagerParserError(String.format(Sys.WebForms.Res.PRM_ParserErrorDetails, parserErrorDetails)), executor, null);
        return null;
    }
    var updatePanelNodes = [];
    var hiddenFieldNodes = [];
    var arrayDeclarationNodes = [];
    var scriptBlockNodes = [];
    var scriptStartupNodes = [];
    var expandoNodes = [];
    var onSubmitNodes = [];
    var dataItemNodes = [];
    var dataItemJsonNodes = [];
    var scriptDisposeNodes = [];
    var asyncPostBackControlIDsNode, postBackControlIDsNode,
        updatePanelIDsNode, asyncPostBackTimeoutNode,
        childUpdatePanelIDsNode, panelsToRefreshNode, formActionNode,
        versionNode;
    for(var i = 0, l = delta.length; i < l; i++) {
        var deltaNode = delta[i];
        switch(deltaNode.type) {
            case "#":
                versionNode = deltaNode;
                break;
            case "updatePanel":
                Array.add(updatePanelNodes, deltaNode);
                break;
            case "hiddenField":
                Array.add(hiddenFieldNodes, deltaNode);
                break;
            case "arrayDeclaration":
                Array.add(arrayDeclarationNodes, deltaNode);
                break;
            case "scriptBlock":
                Array.add(scriptBlockNodes, deltaNode);
                break;
            case "fallbackScript":
                scriptBlockNodes[scriptBlockNodes.length - 1].fallback = deltaNode.id;
            case "scriptStartupBlock":
                Array.add(scriptStartupNodes, deltaNode);
                break;
            case "expando":
                Array.add(expandoNodes, deltaNode);
                break;
            case "onSubmit":
                Array.add(onSubmitNodes, deltaNode);
                break;
            case "asyncPostBackControlIDs":
                asyncPostBackControlIDsNode = deltaNode;
                break;
            case "postBackControlIDs":
                postBackControlIDsNode = deltaNode;
                break;
            case "updatePanelIDs":
                updatePanelIDsNode = deltaNode;
                break;
            case "asyncPostBackTimeout":
                asyncPostBackTimeoutNode = deltaNode;
                break;
            case "childUpdatePanelIDs":
                childUpdatePanelIDsNode = deltaNode;
                break;
            case "panelsToRefreshIDs":
                panelsToRefreshNode = deltaNode;
                break;
            case "formAction":
                formActionNode = deltaNode;
                break;
            case "dataItem":
                Array.add(dataItemNodes, deltaNode);
                break;
            case "dataItemJson":
                Array.add(dataItemJsonNodes, deltaNode);
                break;
            case "scriptDispose":
                Array.add(scriptDisposeNodes, deltaNode);
                break;
            case "pageRedirect":
                if(versionNode && parseFloat(versionNode.content) >= 4) {
                    deltaNode.content = unescape(deltaNode.content);
                }
                if(Sys.Browser.agent === Sys.Browser.InternetExplorer) {
                    var anchor = document.createElement("a");
                    anchor.style.display = 'none';
                    anchor.attachEvent("onclick", cancelBubble);
                    anchor.href = deltaNode.content;
                    this._form.parentNode.insertBefore(anchor, this._form);
                    anchor.click();
                    anchor.detachEvent("onclick", cancelBubble);
                    this._form.parentNode.removeChild(anchor);

                    function cancelBubble(e) {
                        e.cancelBubble = true;
                    }
                }
                else {
                    window.location.href = deltaNode.content;
                }
                return null;
            case "error":
                this._endPostBack(this._createPageRequestManagerServerError(Number.parseInvariant(deltaNode.id), deltaNode.content), executor, null);
                return null;
            case "pageTitle":
                document.title = deltaNode.content;
                break;
            case "focus":
                this._controlIDToFocus = deltaNode.content;
                break;
            default:
                this._endPostBack(this._createPageRequestManagerParserError(String.format(Sys.WebForms.Res.PRM_UnknownToken, deltaNode.type)), executor, null);
                return null;
        }
    }
    return {
        version4: versionNode ? (parseFloat(versionNode.content) >= 4) : false,
        executor: executor,
        updatePanelNodes: updatePanelNodes,
        hiddenFieldNodes: hiddenFieldNodes,
        arrayDeclarationNodes: arrayDeclarationNodes,
        scriptBlockNodes: scriptBlockNodes,
        scriptStartupNodes: scriptStartupNodes,
        expandoNodes: expandoNodes,
        onSubmitNodes: onSubmitNodes,
        dataItemNodes: dataItemNodes,
        dataItemJsonNodes: dataItemJsonNodes,
        scriptDisposeNodes: scriptDisposeNodes,
        asyncPostBackControlIDsNode: asyncPostBackControlIDsNode,
        postBackControlIDsNode: postBackControlIDsNode,
        updatePanelIDsNode: updatePanelIDsNode,
        asyncPostBackTimeoutNode: asyncPostBackTimeoutNode,
        childUpdatePanelIDsNode: childUpdatePanelIDsNode,
        panelsToRefreshNode: panelsToRefreshNode,
        formActionNode: formActionNode
    };
}
function Sys$WebForms$PageRequestManager$_processUpdatePanelArrays(updatePanelIDs, asyncPostBackControlIDs, postBackControlIDs, version4) {
    var newUpdatePanelIDs, newUpdatePanelClientIDs, newUpdatePanelHasChildrenAsTriggers;

    if(updatePanelIDs) {
        var l = updatePanelIDs.length,
            m = version4 ? 2 : 1;
        newUpdatePanelIDs = new Array(l / m);
        newUpdatePanelClientIDs = new Array(l / m);
        newUpdatePanelHasChildrenAsTriggers = new Array(l / m);

        for(var i = 0, j = 0; i < l; i += m, j++) {
            var ct,
                uniqueID = updatePanelIDs[i],
                clientID = version4 ? updatePanelIDs[i + 1] : "";
            ct = (uniqueID.charAt(0) === 't');
            uniqueID = uniqueID.substr(1);
            if(!clientID) {
                clientID = this._uniqueIDToClientID(uniqueID);
            }
            newUpdatePanelHasChildrenAsTriggers[j] = ct;
            newUpdatePanelIDs[j] = uniqueID;
            newUpdatePanelClientIDs[j] = clientID;
        }
    }
    else {
        newUpdatePanelIDs = [];
        newUpdatePanelClientIDs = [];
        newUpdatePanelHasChildrenAsTriggers = [];
    }
    var newAsyncPostBackControlIDs = [];
    var newAsyncPostBackControlClientIDs = [];
    this._convertToClientIDs(asyncPostBackControlIDs, newAsyncPostBackControlIDs, newAsyncPostBackControlClientIDs, version4);
    var newPostBackControlIDs = [];
    var newPostBackControlClientIDs = [];
    this._convertToClientIDs(postBackControlIDs, newPostBackControlIDs, newPostBackControlClientIDs, version4);

    return {
        updatePanelIDs: newUpdatePanelIDs,
        updatePanelClientIDs: newUpdatePanelClientIDs,
        updatePanelHasChildrenAsTriggers: newUpdatePanelHasChildrenAsTriggers,
        asyncPostBackControlIDs: newAsyncPostBackControlIDs,
        asyncPostBackControlClientIDs: newAsyncPostBackControlClientIDs,
        postBackControlIDs: newPostBackControlIDs,
        postBackControlClientIDs: newPostBackControlClientIDs
    };
}
function Sys$WebForms$PageRequestManager$_queueScripts(scriptLoader, scriptBlockNodes, queueIncludes, queueBlocks) {

    for(var i = 0, l = scriptBlockNodes.length; i < l; i++) {
        var scriptBlockType = scriptBlockNodes[i].id;
        switch(scriptBlockType) {
            case "ScriptContentNoTags":
                if(!queueBlocks) {
                    continue;
                }
                scriptLoader.queueScriptBlock(scriptBlockNodes[i].content);
                break;
            case "ScriptContentWithTags":
                var scriptTagAttributes;
                eval("scriptTagAttributes = " + scriptBlockNodes[i].content);
                if(scriptTagAttributes.src) {
                    if(!queueIncludes || Sys._ScriptLoader.isScriptLoaded(scriptTagAttributes.src)) {
                        continue;
                    }
                }
                else if(!queueBlocks) {
                    continue;
                }
                scriptLoader.queueCustomScriptTag(scriptTagAttributes);
                break;
            case "ScriptPath":
                var script = scriptBlockNodes[i];
                if(!queueIncludes || Sys._ScriptLoader.isScriptLoaded(script.content)) {
                    continue;
                }
                scriptLoader.queueScriptReference(script.content, script.fallback);
                break;
        }
    }
}
function Sys$WebForms$PageRequestManager$_registerDisposeScript(panelID, disposeScript) {
    if(!this._scriptDisposes[panelID]) {
        this._scriptDisposes[panelID] = [disposeScript];
    }
    else {
        Array.add(this._scriptDisposes[panelID], disposeScript);
    }
}
function Sys$WebForms$PageRequestManager$_scriptIncludesLoadComplete(scriptLoader, data) {


    if(data.executor.get_webRequest() !== this._request) {
        return;
    }

    this._commitControls(data.updatePanelData,
        data.asyncPostBackTimeoutNode ? data.asyncPostBackTimeoutNode.content : null);
    if(data.formActionNode) {
        this._form.action = data.formActionNode.content;
    }

    var i, l, node;
    for(i = 0, l = data.updatePanelNodes.length; i < l; i++) {
        node = data.updatePanelNodes[i];
        var updatePanelElement = document.getElementById(node.id);
        if(!updatePanelElement) {
            this._endPostBack(Error.invalidOperation(String.format(Sys.WebForms.Res.PRM_MissingPanel, node.id)), data.executor, data);
            return;
        }
        this._updatePanel(updatePanelElement, node.content);
    }
    for(i = 0, l = data.scriptDisposeNodes.length; i < l; i++) {
        node = data.scriptDisposeNodes[i];
        this._registerDisposeScript(node.id, node.content);
    }
    for(i = 0, l = this._transientFields.length; i < l; i++) {
        var field = document.getElementById(this._transientFields[i]);
        if(field) {
            var toRemove = field._isContained ? field.parentNode : field;
            toRemove.parentNode.removeChild(toRemove);
        }
    }
    for(i = 0, l = data.hiddenFieldNodes.length; i < l; i++) {
        node = data.hiddenFieldNodes[i];
        this._createHiddenField(node.id, node.content);
    }

    if(data.scriptsFailed) {
        throw Sys._ScriptLoader._errorScriptLoadFailed(data.scriptsFailed.src, data.scriptsFailed.multipleCallbacks);
    }

    this._queueScripts(scriptLoader, data.scriptBlockNodes, false, true);
    var arrayScript = '';
    for(i = 0, l = data.arrayDeclarationNodes.length; i < l; i++) {
        node = data.arrayDeclarationNodes[i];
        arrayScript += "Sys.WebForms.PageRequestManager._addArrayElement('" + node.id + "', " + node.content + ");\r\n";
    }
    var expandoScript = '';
    for(i = 0, l = data.expandoNodes.length; i < l; i++) {
        node = data.expandoNodes[i];
        expandoScript += node.id + " = " + node.content + "\r\n";
    }
    if(arrayScript.length) {
        scriptLoader.queueScriptBlock(arrayScript);
    }
    if(expandoScript.length) {
        scriptLoader.queueScriptBlock(expandoScript);
    }

    this._queueScripts(scriptLoader, data.scriptStartupNodes, true, true);
    var onSubmitStatementScript = '';
    for(i = 0, l = data.onSubmitNodes.length; i < l; i++) {
        if(i === 0) {
            onSubmitStatementScript = 'Array.add(Sys.WebForms.PageRequestManager.getInstance()._onSubmitStatements, function() {\r\n';
        }
        onSubmitStatementScript += data.onSubmitNodes[i].content + "\r\n";
    }
    if(onSubmitStatementScript.length) {
        onSubmitStatementScript += "\r\nreturn true;\r\n});\r\n";
        scriptLoader.queueScriptBlock(onSubmitStatementScript);
    }
    scriptLoader.loadScripts(0,
        Function.createDelegate(this, Function.createCallback(this._scriptsLoadComplete, data)), null, null);
}
function Sys$WebForms$PageRequestManager$_scriptIncludesLoadFailed(scriptLoader, scriptElement, multipleCallbacks, data) {
    data.scriptsFailed = { src: scriptElement.src, multipleCallbacks: multipleCallbacks };
    this._scriptIncludesLoadComplete(scriptLoader, data);
}
function Sys$WebForms$PageRequestManager$_scriptsLoadComplete(scriptLoader, data) {


    var response = data.executor;
    if(window.__theFormPostData) {
        window.__theFormPostData = "";
    }
    if(window.__theFormPostCollection) {
        window.__theFormPostCollection = [];
    }
    if(window.WebForm_InitCallback) {
        window.WebForm_InitCallback();
    }
    if(this._scrollPosition) {
        if(window.scrollTo) {
            window.scrollTo(this._scrollPosition.x, this._scrollPosition.y);
        }
        this._scrollPosition = null;
    }
    Sys.Application.endCreateComponents();
    this._pageLoaded(false, data);
    this._endPostBack(null, response, data);
    if(this._controlIDToFocus) {
        var focusTarget;
        var oldContentEditableSetting;
        if(Sys.Browser.agent === Sys.Browser.InternetExplorer) {
            var targetControl = $get(this._controlIDToFocus);
            focusTarget = targetControl;
            if(targetControl && (!WebForm_CanFocus(targetControl))) {
                focusTarget = WebForm_FindFirstFocusableChild(targetControl);
            }
            if(focusTarget && (typeof (focusTarget.contentEditable) !== "undefined")) {
                oldContentEditableSetting = focusTarget.contentEditable;
                focusTarget.contentEditable = false;
            }
            else {
                focusTarget = null;
            }
        }
        WebForm_AutoFocus(this._controlIDToFocus);
        if(focusTarget) {
            focusTarget.contentEditable = oldContentEditableSetting;
        }
        this._controlIDToFocus = null;
    }
}
function Sys$WebForms$PageRequestManager$_splitNodeIntoArray(node) {
    var str = node.content;
    var arr = str.length ? str.split(',') : [];
    return arr;
}
function Sys$WebForms$PageRequestManager$_uniqueIDToClientID(uniqueID) {
    return uniqueID.replace(/\$/g, '_');
}
function Sys$WebForms$PageRequestManager$_updateControls(updatePanelIDs, asyncPostBackControlIDs, postBackControlIDs, asyncPostBackTimeout, version4) {
    this._commitControls(
        this._processUpdatePanelArrays(updatePanelIDs, asyncPostBackControlIDs, postBackControlIDs, version4),
        asyncPostBackTimeout);
}
function Sys$WebForms$PageRequestManager$_updatePanel(updatePanelElement, rendering) {
    for(var updatePanelID in this._scriptDisposes) {
        if(this._elementContains(updatePanelElement, document.getElementById(updatePanelID))) {
            var disposeScripts = this._scriptDisposes[updatePanelID];
            for(var i = 0, l = disposeScripts.length; i < l; i++) {
                eval(disposeScripts[i]);
            }
            delete this._scriptDisposes[updatePanelID];
        }
    }
    Sys.Application.disposeElement(updatePanelElement, true);
    updatePanelElement.innerHTML = rendering;
}
function Sys$WebForms$PageRequestManager$_validPosition(position) {
    return (typeof (position) !== "undefined") && (position !== null) && (position !== 0);
}
Sys.WebForms.PageRequestManager.prototype = {
    _get_eventHandlerList: Sys$WebForms$PageRequestManager$_get_eventHandlerList,
    get_isInAsyncPostBack: Sys$WebForms$PageRequestManager$get_isInAsyncPostBack,
    add_beginRequest: Sys$WebForms$PageRequestManager$add_beginRequest,
    remove_beginRequest: Sys$WebForms$PageRequestManager$remove_beginRequest,
    add_endRequest: Sys$WebForms$PageRequestManager$add_endRequest,
    remove_endRequest: Sys$WebForms$PageRequestManager$remove_endRequest,
    add_initializeRequest: Sys$WebForms$PageRequestManager$add_initializeRequest,
    remove_initializeRequest: Sys$WebForms$PageRequestManager$remove_initializeRequest,
    add_pageLoaded: Sys$WebForms$PageRequestManager$add_pageLoaded,
    remove_pageLoaded: Sys$WebForms$PageRequestManager$remove_pageLoaded,
    add_pageLoading: Sys$WebForms$PageRequestManager$add_pageLoading,
    remove_pageLoading: Sys$WebForms$PageRequestManager$remove_pageLoading,
    abortPostBack: Sys$WebForms$PageRequestManager$abortPostBack,
    beginAsyncPostBack: Sys$WebForms$PageRequestManager$beginAsyncPostBack,
    _cancelPendingCallbacks: Sys$WebForms$PageRequestManager$_cancelPendingCallbacks,
    _commitControls: Sys$WebForms$PageRequestManager$_commitControls,
    _createHiddenField: Sys$WebForms$PageRequestManager$_createHiddenField,
    _createPageRequestManagerTimeoutError: Sys$WebForms$PageRequestManager$_createPageRequestManagerTimeoutError,
    _createPageRequestManagerServerError: Sys$WebForms$PageRequestManager$_createPageRequestManagerServerError,
    _createPageRequestManagerParserError: Sys$WebForms$PageRequestManager$_createPageRequestManagerParserError,
    _createPanelID: Sys$WebForms$PageRequestManager$_createPanelID,
    _createPostBackSettings: Sys$WebForms$PageRequestManager$_createPostBackSettings,
    _convertToClientIDs: Sys$WebForms$PageRequestManager$_convertToClientIDs,
    dispose: Sys$WebForms$PageRequestManager$dispose,
    _doCallback: Sys$WebForms$PageRequestManager$_doCallback,
    _doPostBack: Sys$WebForms$PageRequestManager$_doPostBack,
    _doPostBackWithOptions: Sys$WebForms$PageRequestManager$_doPostBackWithOptions,
    _elementContains: Sys$WebForms$PageRequestManager$_elementContains,
    _endPostBack: Sys$WebForms$PageRequestManager$_endPostBack,
    _ensureUniqueIds: Sys$WebForms$PageRequestManager$_ensureUniqueIds,
    _findNearestElement: Sys$WebForms$PageRequestManager$_findNearestElement,
    _findText: Sys$WebForms$PageRequestManager$_findText,
    _fireDefaultButton: Sys$WebForms$PageRequestManager$_fireDefaultButton,
    _getPageLoadedEventArgs: Sys$WebForms$PageRequestManager$_getPageLoadedEventArgs,
    _getPageLoadingEventArgs: Sys$WebForms$PageRequestManager$_getPageLoadingEventArgs,
    _getPostBackSettings: Sys$WebForms$PageRequestManager$_getPostBackSettings,
    _getScrollPosition: Sys$WebForms$PageRequestManager$_getScrollPosition,
    _initializeInternal: Sys$WebForms$PageRequestManager$_initializeInternal,
    _matchesParentIDInList: Sys$WebForms$PageRequestManager$_matchesParentIDInList,
    _onFormElementActive: Sys$WebForms$PageRequestManager$_onFormElementActive,
    _onFormElementClick: Sys$WebForms$PageRequestManager$_onFormElementClick,
    _onFormSubmit: Sys$WebForms$PageRequestManager$_onFormSubmit,
    _onFormSubmitCompleted: Sys$WebForms$PageRequestManager$_onFormSubmitCompleted,
    _onWindowUnload: Sys$WebForms$PageRequestManager$_onWindowUnload,
    _pageLoaded: Sys$WebForms$PageRequestManager$_pageLoaded,
    _pageLoadedInitialLoad: Sys$WebForms$PageRequestManager$_pageLoadedInitialLoad,
    _parseDelta: Sys$WebForms$PageRequestManager$_parseDelta,
    _processUpdatePanelArrays: Sys$WebForms$PageRequestManager$_processUpdatePanelArrays,
    _queueScripts: Sys$WebForms$PageRequestManager$_queueScripts,
    _registerDisposeScript: Sys$WebForms$PageRequestManager$_registerDisposeScript,
    _scriptIncludesLoadComplete: Sys$WebForms$PageRequestManager$_scriptIncludesLoadComplete,
    _scriptIncludesLoadFailed: Sys$WebForms$PageRequestManager$_scriptIncludesLoadFailed,
    _scriptsLoadComplete: Sys$WebForms$PageRequestManager$_scriptsLoadComplete,
    _splitNodeIntoArray: Sys$WebForms$PageRequestManager$_splitNodeIntoArray,
    _uniqueIDToClientID: Sys$WebForms$PageRequestManager$_uniqueIDToClientID,
    _updateControls: Sys$WebForms$PageRequestManager$_updateControls,
    _updatePanel: Sys$WebForms$PageRequestManager$_updatePanel,
    _validPosition: Sys$WebForms$PageRequestManager$_validPosition
}
Sys.WebForms.PageRequestManager.getInstance = function Sys$WebForms$PageRequestManager$getInstance() {
    /// <summary locid="M:J#Sys.WebForms.PageRequestManager.getInstance" />
    /// <returns type="Sys.WebForms.PageRequestManager"></returns>
    if(arguments.length !== 0) throw Error.parameterCount();
    var prm = Sys.WebForms.PageRequestManager._instance;
    if(!prm) {
        prm = Sys.WebForms.PageRequestManager._instance = new Sys.WebForms.PageRequestManager();
    }
    return prm;
}
Sys.WebForms.PageRequestManager._addArrayElement = function Sys$WebForms$PageRequestManager$_addArrayElement(arrayName) {
    if(!window[arrayName]) {
        window[arrayName] = new Array();
    }
    for(var i = 1, l = arguments.length; i < l; i++) {
        Array.add(window[arrayName], arguments[i]);
    }
}
Sys.WebForms.PageRequestManager._initialize = function Sys$WebForms$PageRequestManager$_initialize() {
    var prm = Sys.WebForms.PageRequestManager.getInstance();
    prm._initializeInternal.apply(prm, arguments);
}
Sys.WebForms.PageRequestManager.registerClass('Sys.WebForms.PageRequestManager');

Sys.UI._UpdateProgress = function Sys$UI$_UpdateProgress(element) {
    Sys.UI._UpdateProgress.initializeBase(this, [element]);
    this._displayAfter = 500;
    this._dynamicLayout = true;
    this._associatedUpdatePanelId = null;
    this._beginRequestHandlerDelegate = null;
    this._startDelegate = null;
    this._endRequestHandlerDelegate = null;
    this._pageRequestManager = null;
    this._timerCookie = null;
}
function Sys$UI$_UpdateProgress$get_displayAfter() {
    /// <value type="Number" locid="P:J#Sys.UI._UpdateProgress.displayAfter"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._displayAfter;
}
function Sys$UI$_UpdateProgress$set_displayAfter(value) {
    var e = Function._validateParams(arguments, [{ name: "value", type: Number }]);
    if(e) throw e;
    this._displayAfter = value;
}
function Sys$UI$_UpdateProgress$get_dynamicLayout() {
    /// <value type="Boolean" locid="P:J#Sys.UI._UpdateProgress.dynamicLayout"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._dynamicLayout;
}
function Sys$UI$_UpdateProgress$set_dynamicLayout(value) {
    var e = Function._validateParams(arguments, [{ name: "value", type: Boolean }]);
    if(e) throw e;
    this._dynamicLayout = value;
}
function Sys$UI$_UpdateProgress$get_associatedUpdatePanelId() {
    /// <value type="String" mayBeNull="true" locid="P:J#Sys.UI._UpdateProgress.associatedUpdatePanelId"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return this._associatedUpdatePanelId;
}
function Sys$UI$_UpdateProgress$set_associatedUpdatePanelId(value) {
    var e = Function._validateParams(arguments, [{ name: "value", type: String, mayBeNull: true }]);
    if(e) throw e;
    this._associatedUpdatePanelId = value;
}
function Sys$UI$_UpdateProgress$get_role() {
    /// <value type="String" locid="P:J#Sys.UI._UpdateProgress.role"></value>
    if(arguments.length !== 0) throw Error.parameterCount();
    return "status";
}
function Sys$UI$_UpdateProgress$_clearTimeout() {
    if(this._timerCookie) {
        window.clearTimeout(this._timerCookie);
        this._timerCookie = null;
    }
}
function Sys$UI$_UpdateProgress$_getUniqueID(clientID) {
    var i = Array.indexOf(this._pageRequestManager._updatePanelClientIDs, clientID);
    return i === -1 ? null : this._pageRequestManager._updatePanelIDs[i];
}
function Sys$UI$_UpdateProgress$_handleBeginRequest(sender, arg) {
    var curElem = arg.get_postBackElement(),
        showProgress = true,
        upID = this._associatedUpdatePanelId;
    if(this._associatedUpdatePanelId) {
        var updating = arg.get_updatePanelsToUpdate();
        if(updating && updating.length) {
            showProgress = (Array.contains(updating, upID) || Array.contains(updating, this._getUniqueID(upID)))
        }
        else {
            showProgress = false;
        }
    }
    while(!showProgress && curElem) {
        if(curElem.id && this._associatedUpdatePanelId === curElem.id) {
            showProgress = true;
        }
        curElem = curElem.parentNode;
    }
    if(showProgress) {
        this._timerCookie = window.setTimeout(this._startDelegate, this._displayAfter);
    }
}
function Sys$UI$_UpdateProgress$_startRequest() {
    if(this._pageRequestManager.get_isInAsyncPostBack()) {
        var element = this.get_element();
        if(this._dynamicLayout) {
            element.style.display = 'block';
        }
        else {
            element.style.visibility = 'visible';
        }
        if(this.get_role() === "status") {
            element.setAttribute("aria-hidden", "false");
        }
    }
    this._timerCookie = null;
}
function Sys$UI$_UpdateProgress$_handleEndRequest(sender, arg) {
    var element = this.get_element();
    if(this._dynamicLayout) {
        element.style.display = 'none';
    }
    else {
        element.style.visibility = 'hidden';
    }
    if(this.get_role() === "status") {
        element.setAttribute("aria-hidden", "true");
    }
    this._clearTimeout();
}
function Sys$UI$_UpdateProgress$dispose() {
    if(this._beginRequestHandlerDelegate !== null) {
        this._pageRequestManager.remove_beginRequest(this._beginRequestHandlerDelegate);
        this._pageRequestManager.remove_endRequest(this._endRequestHandlerDelegate);
        this._beginRequestHandlerDelegate = null;
        this._endRequestHandlerDelegate = null;
    }
    this._clearTimeout();
    Sys.UI._UpdateProgress.callBaseMethod(this, "dispose");
}
function Sys$UI$_UpdateProgress$initialize() {
    Sys.UI._UpdateProgress.callBaseMethod(this, 'initialize');
    if(this.get_role() === "status") {
        this.get_element().setAttribute("aria-hidden", "true");
    }
    this._beginRequestHandlerDelegate = Function.createDelegate(this, this._handleBeginRequest);
    this._endRequestHandlerDelegate = Function.createDelegate(this, this._handleEndRequest);
    this._startDelegate = Function.createDelegate(this, this._startRequest);
    if(Sys.WebForms && Sys.WebForms.PageRequestManager) {
        this._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();
    }
    if(this._pageRequestManager !== null) {
        this._pageRequestManager.add_beginRequest(this._beginRequestHandlerDelegate);
        this._pageRequestManager.add_endRequest(this._endRequestHandlerDelegate);
    }
}
Sys.UI._UpdateProgress.prototype = {
    get_displayAfter: Sys$UI$_UpdateProgress$get_displayAfter,
    set_displayAfter: Sys$UI$_UpdateProgress$set_displayAfter,
    get_dynamicLayout: Sys$UI$_UpdateProgress$get_dynamicLayout,
    set_dynamicLayout: Sys$UI$_UpdateProgress$set_dynamicLayout,
    get_associatedUpdatePanelId: Sys$UI$_UpdateProgress$get_associatedUpdatePanelId,
    set_associatedUpdatePanelId: Sys$UI$_UpdateProgress$set_associatedUpdatePanelId,
    get_role: Sys$UI$_UpdateProgress$get_role,
    _clearTimeout: Sys$UI$_UpdateProgress$_clearTimeout,
    _getUniqueID: Sys$UI$_UpdateProgress$_getUniqueID,
    _handleBeginRequest: Sys$UI$_UpdateProgress$_handleBeginRequest,
    _startRequest: Sys$UI$_UpdateProgress$_startRequest,
    _handleEndRequest: Sys$UI$_UpdateProgress$_handleEndRequest,
    dispose: Sys$UI$_UpdateProgress$dispose,
    initialize: Sys$UI$_UpdateProgress$initialize
}
Sys.UI._UpdateProgress.registerClass('Sys.UI._UpdateProgress', Sys.UI.Control);


Type.registerNamespace('Sys.WebForms');
Sys.WebForms.Res = {
    "PRM_UnknownToken": "Unknown token: \u0027{0}\u0027.",
    "PRM_MissingPanel": "Could not find UpdatePanel with ID \u0027{0}\u0027. If it is being updated dynamically then it must be inside another UpdatePanel.",
    "PRM_ServerError": "An unknown error occurred while processing the request on the server. The status code returned from the server was: {0}",
    "PRM_ParserError": "The message received from the server could not be parsed.",
    "PRM_TimeoutError": "The server request timed out.",
    "PRM_ParserErrorDetails": "Error parsing near \u0027{0}\u0027.",
    "PRM_CannotRegisterTwice": "The PageRequestManager cannot be initialized more than once."
};
