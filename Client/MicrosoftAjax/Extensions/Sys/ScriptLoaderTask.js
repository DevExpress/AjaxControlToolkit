// ScriptLoaderTask loads a single script by injecting a dynamic script tag into the DOM.
// It calls the completed callback when the script element's load/readystatechange or error event occus.
// The task should be disposed of after use, as it contains references to the script element.

$type = Sys._ScriptLoaderTask = function _ScriptLoaderTask(scriptElement, completedCallback) {
    /// <summary locid="M:J#Sys._ScriptLoaderTask.#ctor"></summary>
    /// <param name="scriptElement" domElement="true">The script element to add to the DOM.</param>
    /// <param name="completedCallback" type="Function">Callback to call when the script has loaded or failed to load.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        { name: "scriptElement", domElement: true },
        { name: "completedCallback", type: Function }
    ]);
    if (e) throw e;
    //#endif
    this._scriptElement = scriptElement;
    this._completedCallback = completedCallback;
}
$type.prototype = {
    get_scriptElement: function _ScriptLoaderTask$get_scriptElement() {
        /// <value domElement="true" locid="P:J#Sys._ScriptLoaderTask.scriptElement">The script element.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._scriptElement;
    },

    dispose: function _ScriptLoaderTask$dispose() {
        // disposes of the task by removing the load handlers, aborting the window timeout, and releasing the ref to the dom element
        if (this._disposed) {
            // already disposed
            return;
        }
        this._disposed = true;
        this._removeScriptElementHandlers();
        // remove script element from DOM
        Sys._ScriptLoaderTask._clearScript(this._scriptElement);
        this._scriptElement = null;
    },

    execute: function _ScriptLoaderTask$execute() {
        /// <summary locid="M:J#Sys._ScriptLoaderTask.execute">Begins loading the given script element.</summary>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        this._addScriptElementHandlers();
        // DevDiv Bugs 146697: use lowercase names on getElementsByTagName to work with xhtml content type
        //#if DEBUG
        // DevDiv Bugs 146327: In debug mode, report useful error message for pages without <head> element
        var headElements = document.getElementsByTagName('head');
        if (headElements.length === 0) {
            throw new Error.invalidOperation(Sys.Res.scriptLoadFailedNoHead);
        }
        else {
            headElements[0].appendChild(this._scriptElement);
        }
        //#else
        document.getElementsByTagName('head')[0].appendChild(this._scriptElement);
        //#endif
    },

    _addScriptElementHandlers: function _ScriptLoaderTask$_addScriptElementHandlers() {
        // adds the necessary event handlers to the script node to know when it is finished loading
        this._scriptLoadDelegate = Function.createDelegate(this, this._scriptLoadHandler);

        if (document.addEventListener) {
            if (!this._scriptElement.readyState)
                this._scriptElement.readyState = 'loaded';
            $addHandler(this._scriptElement, 'load', this._scriptLoadDelegate);
        }
        else {
            $addHandler(this._scriptElement, 'readystatechange', this._scriptLoadDelegate);
        }
        // FF throws onerror if the script doesn't exist, not loaded.
        // DevDev Bugs 86101 -- cant use DomElement.addHandler because it throws for 'error' events.
        if (this._scriptElement.addEventListener) {
            this._scriptErrorDelegate = Function.createDelegate(this, this._scriptErrorHandler);
            this._scriptElement.addEventListener('error', this._scriptErrorDelegate, false);
        }
    },

    _removeScriptElementHandlers: function _ScriptLoaderTask$_removeScriptElementHandlers() {
        // removes the load and error handlers from the script element
        if (this._scriptLoadDelegate) {
            var scriptElement = this.get_scriptElement();
            if (document.addEventListener) {
                $removeHandler(scriptElement, 'load', this._scriptLoadDelegate);
            }
            else {
                $removeHandler(scriptElement, 'readystatechange', this._scriptLoadDelegate);
            }
            if (this._scriptErrorDelegate) {
                // DevDev Bugs 86101 -- cant use DomElement.removeHandler because addHandler throws for 'error' events.
                this._scriptElement.removeEventListener('error', this._scriptErrorDelegate, false);
                this._scriptErrorDelegate = null;
            }
            this._scriptLoadDelegate = null;
        }
    },

    _scriptErrorHandler: function _ScriptLoaderTask$_scriptErrorHandler() {
        // handler for when the script element's error event occurs
        if (this._disposed) {
            return;
        }

        // false == did not load successfully (404, etc)
        this._completedCallback(this.get_scriptElement(), false);
    },

    _scriptLoadHandler: function _ScriptLoaderTask$_scriptLoadHandler() {
        // handler for when the script element's load/readystatechange event occurs
        if (this._disposed) {
            return;
        }

        var scriptElement = this.get_scriptElement();
        if ((scriptElement.readyState !== 'loaded') &&
            (scriptElement.readyState !== 'complete')) {
            return;
        }

        this._completedCallback(scriptElement, true);
    }
}
$type.registerClass("Sys._ScriptLoaderTask", null, Sys.IDisposable);

$type._clearScript = function _ScriptLoaderTask$_clearScript(scriptElement) {
    if (!Sys.Debug.isDebug) {
        // In release mode we clear out the script elements that we add
        // so that they don't clutter up the DOM.
        scriptElement.parentNode.removeChild(scriptElement);
    }
}
