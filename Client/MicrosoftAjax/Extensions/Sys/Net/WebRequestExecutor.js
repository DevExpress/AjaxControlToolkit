$type = Sys.Net.WebRequestExecutor = function WebRequestExecutor() {
    /// <summary locid="M:J#Sys.Net.WebRequestExecutor.#ctor">Base class for WebRequestExecutors which handle the actual execution of a WebRequest</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    this._webRequest = null;
    this._resultObject = null;
}

//#if DEBUG
//#else
var empty = function() {};
//#endif

$type.prototype = {
    // abstract methods
    //#if DEBUG
    get_started: function WebRequestExecutor$get_started() {
        /// <value type="Boolean" locid="P:J#Sys.Net.WebRequestExecutor.started"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    },
    get_responseAvailable: function WebRequestExecutor$get_responseAvailable() {
        /// <value type="Boolean" locid="P:J#Sys.Net.WebRequestExecutor.responseAvailable"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    },
    get_timedOut: function WebRequestExecutor$get_timedOut() {
        /// <value type="Boolean" locid="P:J#Sys.Net.WebRequestExecutor.timedOut"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    },
    get_aborted: function WebRequestExecutor$get_aborted() {
        /// <value type="Boolean" locid="P:J#Sys.Net.WebRequestExecutor.aborted"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    },
    get_responseData: function WebRequestExecutor$get_responseData() {
        /// <value type="String" locid="P:J#Sys.Net.WebRequestExecutor.responseData"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    },
    get_statusCode: function WebRequestExecutor$get_statusCode() {
        /// <value type="Number" locid="P:J#Sys.Net.WebRequestExecutor.statusCode"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    },
    get_statusText: function WebRequestExecutor$get_statusText() {
        /// <value type="String" locid="P:J#Sys.Net.WebRequestExecutor.statusText"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    },
    get_xml: function WebRequestExecutor$get_xml() {
        /// <value locid="P:J#Sys.Net.WebRequestExecutor.xml"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    },
    executeRequest: function WebRequestExecutor$executeRequest() {
        /// <summary locid="M:J#Sys.Net.WebRequestExecutor.executeRequest">Begins execution of the request.</summary>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    },
    abort: function WebRequestExecutor$abort() {
        /// <summary locid="M:J#Sys.Net.WebRequestExecutor.abort">Aborts the request.</summary>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    },
    getAllResponseHeaders: function WebRequestExecutor$getAllResponseHeaders() {
        /// <summary locid="M:J#Sys.Net.WebRequestExecutor.getAllResponseHeaders">Returns all the responses header.</summary>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    },
    getResponseHeader: function WebRequestExecutor$getResponseHeader(header) {
        /// <summary locid="M:J#Sys.Net.WebRequestExecutor.getResponseHeader">Returns a response header.</summary>
        /// <param name="header" type="String">The requested header.</param>
        var e = Function._validateParams(arguments, [
            {name: "header", type: String}
        ]);
        if (e) throw e;
        throw Error.notImplemented();
    },
    //#else
    get_started: empty,
    get_responseAvailable: empty,
    get_timedOut: empty,
    get_aborted: empty,
    get_responseData: empty,
    get_statusCode: empty,
    get_statusText: empty,
    get_xml: empty,
    executeRequest: empty,
    abort: empty,
    getAllResponseHeaders: empty,
    getResponseHeader: empty,
    //#endif
    get_webRequest: function WebRequestExecutor$get_webRequest() {
        /// <value type="Sys.Net.WebRequest" locid="P:J#Sys.Net.WebRequestExecutor.webRequest"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._webRequest;
    },
    _set_webRequest: function WebRequestExecutor$_set_webRequest(value) {
        //#if DEBUG
        if (this.get_started()) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOnceStarted, 'set_webRequest'));
        }
        //#endif
        this._webRequest = value;
    },
    get_object: function WebRequestExecutor$get_object() {
        /// <value locid="P:J#Sys.Net.WebRequestExecutor.object">The JSON eval'd response.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        var result = this._resultObject;
        if (!result) {
            this._resultObject = result = Sys.Serialization.JavaScriptSerializer.deserialize(this.get_responseData());
        }
        return result;
    }
}
$type.registerClass('Sys.Net.WebRequestExecutor');
