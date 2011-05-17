// (c) 2010 CodePlex Foundation
//!/ <reference name="MicrosoftAjaxComponentModel.js" />
//!/ <reference name="MicrosoftAjaxSerialization.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxHistory.js", ["MicrosoftAjaxComponentModel.js", "MicrosoftAjaxSerialization.js"]);

var $type, $prototype,
    isBrowser = Sys._isBrowser;

$type = Sys.HistoryEventArgs = function HistoryEventArgs(state) {
    /// <summary locid="M:J#Sys.HistoryEventArgs.#ctor"></summary>
    /// <param name="state" type="Object"></param>
    var e = Function._validateParams(arguments, [
        {name: "state", type: Object}
    ]);
    if (e) throw e;
    Sys.HistoryEventArgs.initializeBase(this);
    this._state = state;
}
$type.prototype = {
    get_state: function HistoryEventArgs$get_state() {
        /// <value type="Object" locid="P:J#Sys.HistoryEventArgs.state"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._state;
    }
}
$type.registerClass('Sys.HistoryEventArgs', Sys.EventArgs);
$type = Sys.Application;
$type._currentEntry = '';
$type._initialState = null;
$type._state = {};

$prototype = Sys._Application.prototype;
$prototype.get_stateString = function _Application$get_stateString() {
    /// <summary locid="M:J#Sys._Application.get_stateString"></summary>
    if (arguments.length !== 0) throw Error.parameterCount();
    var hash = null;
    
    if (isBrowser("Firefox")) {
        var href = window.location.href;
        var hashIndex = href.indexOf('#');
        if (hashIndex !== -1) {
            hash = href.substring(hashIndex + 1);
        }
        else {
            hash = "";
        }
        return hash;
    }
    else {
        hash = window.location.hash;
    }
    
    if (hash.length && (hash.charAt(0) === '#')) {
        hash = hash.substring(1);
    }

    return hash;
};

$prototype.get_enableHistory = function _Application$get_enableHistory() {
    /// <summary locid="M:J#Sys._Application.get_enableHistory"></summary>
    if (arguments.length !== 0) throw Error.parameterCount();
    return !!this._enableHistory;
};

$prototype.set_enableHistory = function _Application$set_enableHistory(value) {
    if (this._initialized && !this._initializing) {
        throw Error.invalidOperation(Sys.Res.historyCannotEnableHistory);
    }
    else if (this._historyEnabledInScriptManager && !value) {
        throw Error.invalidOperation(Sys.Res.invalidHistorySettingCombination);
    }
    this._enableHistory = value;
};

$prototype.add_navigate = function _Application$add_navigate(handler) {
    /// <summary locid="E:J#Sys.Application.navigate"></summary>
    /// <param name="handler" type="Function"></param>
    var e = Function._validateParams(arguments, [
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    this._addHandler("navigate", handler);
};

$prototype.remove_navigate = function _Application$remove_navigate(handler) {
    /// <summary locid="M:J#Sys._Application.remove_navigate"></summary>
    /// <param name="handler" type="Function"></param>
    var e = Function._validateParams(arguments, [
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    this._removeHandler("navigate", handler);
};

$prototype.addHistoryPoint = function _Application$addHistoryPoint(state, title) {
    /// <summary locid="M:J#Sys.Application.addHistoryPoint"></summary>
    /// <param name="state" type="Object">A dictionary of state bits that will be added to the main state   to form the global state of the new history point.   The state must be a string dictionary. The application is responsible   for converting the state bits from and into the relevant types.</param>
    /// <param name="title" type="String" optional="true" mayBeNull="true">The title for the new history point.</param>
    var e = Function._validateParams(arguments, [
        {name: "state", type: Object},
        {name: "title", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    if (!this._enableHistory) throw Error.invalidOperation(Sys.Res.historyCannotAddHistoryPointWithHistoryDisabled);
    for (var n in state) {
        var v = state[n];
        var t = typeof(v);
        if ((v !== null) && ((t === 'object') || (t === 'function') || (t === 'undefined'))) {
            throw Error.argument('state', Sys.Res.stateMustBeStringDictionary);
        }
    }
    this._ensureHistory();
    var initialState = this._state;
    for (var key in state) {
        var value = state[key];
        if (value === null) {
            if (typeof(initialState[key]) !== 'undefined') {
                delete initialState[key];
            }
        }
        else {
            initialState[key] = value;
        }
    }
    var entry = this._serializeState(initialState);
    this._historyPointIsNew = true;
    this._setState(entry, title);
    this._raiseNavigate();
};

$prototype.setServerId = function _Application$setServerId(clientId, uniqueId) {
    /// <summary locid="M:J#Sys.Application.setServerId"></summary>
    /// <param name="clientId" type="String"></param>
    /// <param name="uniqueId" type="String"></param>
    var e = Function._validateParams(arguments, [
        {name: "clientId", type: String},
        {name: "uniqueId", type: String}
    ]);
    if (e) throw e;
    this._clientId = clientId;
    this._uniqueId = uniqueId;
};

$prototype.setServerState = function _Application$setServerState(value) {
    /// <summary locid="M:J#Sys.Application.setServerState"></summary>
    /// <param name="value" type="String"></param>
    var e = Function._validateParams(arguments, [
        {name: "value", type: String}
    ]);
    if (e) throw e;
    this._ensureHistory();
    this._state.__s = value;
    this._updateHiddenField(value);
};

$prototype._deserializeState = function _Application$_deserializeState(entry) {
    var result = {};
    entry = entry || '';
    var serverSeparator = entry.indexOf('&&');
    if ((serverSeparator !== -1) && (serverSeparator + 2 < entry.length)) {
        result.__s = entry.substr(serverSeparator + 2);
        entry = entry.substr(0, serverSeparator);
    }
    var tokens = entry.split('&');
    for (var i = 0, l = tokens.length; i < l; i++) {
        var token = tokens[i];
        var equal = token.indexOf('=');
        if ((equal !== -1) && (equal + 1 < token.length)) {
            var name = token.substr(0, equal);
            var value = token.substr(equal + 1);
            result[name] = decodeURIComponent(value);
        }
    }
    return result;
};

$prototype._enableHistoryInScriptManager = function _Application$_enableHistoryInScriptManager() {
    this._enableHistory = true;
    this._historyEnabledInScriptManager = true;
};

$prototype._ensureHistory = function _Application$_ensureHistory() {
    if (!this._historyInitialized && this._enableHistory) {
        if (isBrowser("InternetExplorer") && (Sys.Browser.documentMode < 8)) {
            this._historyFrame = Sys.get('#__historyFrame');
            if (!this._historyFrame) throw Error.invalidOperation(Sys.Res.historyMissingFrame);
            this._ignoreIFrame = true;
        }
        this._timerHandler = Function.createDelegate(this, this._onIdle);
        this._timerCookie = window.setTimeout(this._timerHandler, 100);
        
        var e;
        try {
            this._initialState = this._deserializeState(this.get_stateString());
        }
        catch(e) {}
        
        this._historyInitialized = true;
    }
};

$prototype._navigate = function _Application$_navigate(entry) {
    this._ensureHistory();

    var state = this._deserializeState(entry);
    
    if (this._uniqueId) {
        var oldServerEntry = this._state.__s || '';
        var newServerEntry = state.__s || '';
        if (newServerEntry !== oldServerEntry) {
            this._updateHiddenField(newServerEntry);
            __doPostBack(this._uniqueId, newServerEntry);
            this._state = state;
            return;
        }
    }
    this._setState(entry);
    this._state = state;
    this._raiseNavigate();
};

$prototype._onIdle = function _Application$_onIdle() {
    delete this._timerCookie;
    
    var entry = this.get_stateString();
    if (entry !== this._currentEntry) {
        if (!this._ignoreTimer) {
            this._historyPointIsNew = false;
            this._navigate(entry);
        }
    }
    else {
        this._ignoreTimer = false;
    }
    this._timerCookie = window.setTimeout(this._timerHandler, 100);
};

$prototype._onIFrameLoad = function _Application$_onIFrameLoad(entry) {
    this._ensureHistory();
    if (!this._ignoreIFrame) {
        this._historyPointIsNew = false;
        this._navigate(entry);
    }
    this._ignoreIFrame = false;
};

$prototype._onPageRequestManagerBeginRequest = function _Application$_onPageRequestManagerBeginRequest(sender, args) {
    this._ignoreTimer = true;
    this._originalTitle = document.title;
};

$prototype._onPageRequestManagerEndRequest = function _Application$_onPageRequestManagerEndRequest(sender, args) {
    var dataItem = args.get_dataItems()[this._clientId];
    var originalTitle = this._originalTitle;
    this._originalTitle = null;

    var eventTarget = Sys.get("#__EVENTTARGET");
    if (eventTarget && eventTarget.value === this._uniqueId) {
        eventTarget.value = '';
    }
    if (typeof(dataItem) !== 'undefined') {
        this.setServerState(dataItem);
        this._historyPointIsNew = true;
    }
    else {
        this._ignoreTimer = false;
    }
    var entry = this._serializeState(this._state);
    if (entry !== this._currentEntry) {
        this._ignoreTimer = true;
        if (typeof(originalTitle) === "string") {
            if (!isBrowser("InternetExplorer") || Sys.Browser.version > 7) {
                var newTitle = document.title;
                document.title = originalTitle;
                this._setState(entry);
                document.title = newTitle;
            }
            else {
                this._setState(entry);
            }
            this._raiseNavigate();
        }
        else {
            this._setState(entry);
            this._raiseNavigate();
        }
    }
};

$prototype._raiseNavigate = function _Application$_raiseNavigate() {
    var isNew = this._historyPointIsNew;
    var stateClone = {};
    for (var key in this._state) {
        if (key !== '__s') {
            stateClone[key] = this._state[key];
        }
    }
    var args = new Sys.HistoryEventArgs(stateClone);
    Sys.Observer.raiseEvent(this, "navigate", args);
    if (!isNew) {
        var err;
        try {
            if (isBrowser("Firefox") && window.location.hash &&
                (!window.frameElement || window.top.location.hash)) {
                (Sys.Browser.version < 3.5) ?
                    window.history.go(0) :
                    location.hash = this.get_stateString();
            }
        }
        catch(err) {
        }
    }
};

$prototype._serializeState = function _Application$_serializeState(state) {
    var serialized = [];
    for (var key in state) {
        var value = state[key];
        if (key === '__s') {
            var serverState = value;
        }
        else {
            if (key.indexOf('=') !== -1) throw Error.argument('state', Sys.Res.stateFieldNameInvalid);
            serialized.push(key + '=' + encodeURIComponent(value));
        }
    }
    return serialized.join('&') + (serverState ? '&&' + serverState : '');
};

$prototype._setState = function _Application$_setState(entry, title) {
    if (this._enableHistory) {
        entry = entry || '';
        if (entry !== this._currentEntry) {
            if (window.theForm) {
                var action = window.theForm.action;
                var hashIndex = action.indexOf('#');
                window.theForm.action = ((hashIndex !== -1) ? action.substring(0, hashIndex) : action) + '#' + entry;
            }
        
            if (this._historyFrame && this._historyPointIsNew) {
                this._ignoreIFrame = true;
                var frameDoc = this._historyFrame.contentWindow.document;
                frameDoc.open("javascript:'<html></html>'");
                frameDoc.write("<html><head><title>" + (title || document.title) +
                    "</title><scri" + "pt type=\"text/javascript\">parent.Sys.Application._onIFrameLoad(" + 
                    Sys.Serialization.JavaScriptSerializer.serialize(entry) +
                    ");</scri" + "pt></head><body></body></html>");
                frameDoc.close();
            }
            this._ignoreTimer = false;
            this._currentEntry = entry;
            if (this._historyFrame || this._historyPointIsNew) {
                var currentHash = this.get_stateString();
                if (entry !== currentHash) {
                    var loc = document.location;
                    if (loc.href.length - loc.hash.length + entry.length > 2048) {
                        throw Error.invalidOperation(String.format(Sys.Res.urlTooLong, 2048));
                    }
                    window.location.hash = entry;
                    this._currentEntry = this.get_stateString();
                    if ((typeof(title) !== 'undefined') && (title !== null)) {
                        document.title = title;
                    }
                }
            }
            this._historyPointIsNew = false;
        }
    }
};

$prototype._updateHiddenField = function _Application$_updateHiddenField(value) {
    if (this._clientId) {
        var serverStateField = document.getElementById(this._clientId);
        if (serverStateField) {
            serverStateField.value = value;
        }
    }
};

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("History", null, execute);
}
else {
	execute();
}

})();
