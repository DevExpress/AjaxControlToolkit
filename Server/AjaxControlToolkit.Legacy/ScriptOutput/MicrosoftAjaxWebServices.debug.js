// (c) 2010 CodePlex Foundation
//!/ <reference name="MicrosoftAjaxNetwork.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxWebServices.js", ["MicrosoftAjaxNetwork.js"]);
var $type, $prototype;
Type.registerNamespace('Sys.Net');

$type = Sys.Net.WebServiceProxy = function WebServiceProxy() {
    var type = Object.getType(this);
    
    if (type._staticInstance && (typeof(type._staticInstance.get_enableJsonp) === "function")) {
        this._jsonp = (type._staticInstance.get_enableJsonp());
    }
}
$type.prototype = {
    get_timeout: function WebServiceProxy$get_timeout() {
        /// <value type="Number" locid="P:J#Sys.Net.WebServiceProxy.timeout">The timeout in milliseconds for the service.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._timeout || 0;
    },
    set_timeout: function WebServiceProxy$set_timeout(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Number}]);
        if (e) throw e;
        if (value < 0) {
            throw Error.argumentOutOfRange('value', value, Sys.Res.invalidTimeout);
        }
        this._timeout = value;
    },
    get_defaultUserContext: function WebServiceProxy$get_defaultUserContext() {
        /// <value mayBeNull="true" locid="P:J#Sys.Net.WebServiceProxy.defaultUserContext">The default userContext for this service.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return (typeof(this._userContext) === "undefined") ? null : this._userContext;
    },
    set_defaultUserContext: function WebServiceProxy$set_defaultUserContext(value) {
        var e = Function._validateParams(arguments, [{name: "value", mayBeNull: true}]);
        if (e) throw e;
        this._userContext = value;
    },
    get_defaultSucceededCallback: function WebServiceProxy$get_defaultSucceededCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Net.WebServiceProxy.defaultSucceededCallback">Returns the default succeededCallback for this service.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._succeeded || null;
    },
    set_defaultSucceededCallback: function WebServiceProxy$set_defaultSucceededCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._succeeded = value;
    },
    get_defaultFailedCallback: function WebServiceProxy$get_defaultFailedCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Net.WebServiceProxy.defaultFailedCallback">Returns the default failedCallback for this service.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._failed || null;
    },
    set_defaultFailedCallback: function WebServiceProxy$set_defaultFailedCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._failed = value;
    },
    get_enableJsonp: function WebServiceProxy$get_enableJsonp() {
        /// <value type="Boolean" locid="P:J#Sys.Net.WebServiceProxy.enableJsonp">Specifies whether the service supports JSONP for cross domain calling.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return !!this._jsonp;
    },
    set_enableJsonp: function WebServiceProxy$set_enableJsonp(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Boolean}]);
        if (e) throw e;
        this._jsonp = value;
    },
    get_path: function WebServiceProxy$get_path() {
        /// <value type="String" locid="P:J#Sys.Net.WebServiceProxy.path">The path to this service.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._path || null;
    },
    set_path: function WebServiceProxy$set_path(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        this._path = value;
    },
    get_jsonpCallbackParameter: function WebServiceProxy$get_jsonpCallbackParameter() {
        /// <value type="String" locid="P:J#Sys.Net.WebServiceProxy.jsonpCallbackParameter">Specifies the parameter name that contains the callback function name for a JSONP request.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._callbackParameter || "callback";
    },
    set_jsonpCallbackParameter: function WebServiceProxy$set_jsonpCallbackParameter(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        this._callbackParameter = value;
    },
    _invoke: function WebServiceProxy$_invoke(servicePath, methodName, useGet, params, onSuccess, onFailure, userContext) {
        /// <summary locid="M:J#Sys.Net.WebServiceProxy._invoke"></summary>
        /// <param name="servicePath" type="String">Path to the webservice</param>
        /// <param name="methodName" type="String">Method to invoke</param>
        /// <param name="useGet" type="Boolean">Controls whether requests use HttpGet</param>
        /// <param name="params">Method args.</param>
        /// <param name="onSuccess" type="Function" mayBeNull="true" optional="true">Success callback</param>
        /// <param name="onFailure" type="Function" mayBeNull="true" optional="true">Failure callback</param>
        /// <param name="userContext" mayBeNull="true" optional="true">Success callback</param>
        /// <returns type="Sys.Net.WebRequest" mayBeNull="true">Returns the request that was sent</returns>
        var e = Function._validateParams(arguments, [
            {name: "servicePath", type: String},
            {name: "methodName", type: String},
            {name: "useGet", type: Boolean},
            {name: "params"},
            {name: "onSuccess", type: Function, mayBeNull: true, optional: true},
            {name: "onFailure", type: Function, mayBeNull: true, optional: true},
            {name: "userContext", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;

        onSuccess = onSuccess || this.get_defaultSucceededCallback();
        onFailure = onFailure || this.get_defaultFailedCallback();
        if (userContext === null || typeof userContext === 'undefined') userContext = this.get_defaultUserContext();
        return Sys.Net.WebServiceProxy.invoke(servicePath, methodName, useGet, params, onSuccess, onFailure, userContext, this.get_timeout(), this.get_enableJsonp(), this.get_jsonpCallbackParameter());
    }
}
$type.registerClass('Sys.Net.WebServiceProxy');

$type.invoke = function WebServiceProxy$invoke(servicePath, methodName, useGet, params, onSuccess, onFailure, userContext, timeout, enableJsonp, jsonpCallbackParameter) {
    /// <summary locid="M:J#Sys.Net.WebServiceProxy.invoke"></summary>
    /// <param name="servicePath" type="String">Path to the webservice</param>
    /// <param name="methodName" type="String" mayBeNull="true" optional="true">Method to invoke</param>
    /// <param name="useGet" type="Boolean" optional="true" mayBeNull="true">Controls whether requests use HttpGet</param>
    /// <param name="params" mayBeNull="true" optional="true">Method args.</param>
    /// <param name="onSuccess" type="Function" mayBeNull="true" optional="true">Success callback</param>
    /// <param name="onFailure" type="Function" mayBeNull="true" optional="true">Failure callback</param>
    /// <param name="userContext" mayBeNull="true" optional="true">Success callback</param>
    /// <param name="timeout" type="Number" optional="true" mayBeNull="true">Timeout in milliseconds</param>
    /// <param name="enableJsonp" type="Boolean" optional="true" mayBeNull="true">Whether to use JSONP if the servicePath is for a different domain (default is true).</param>
    /// <param name="jsonpCallbackParameter" type="String" optional="true" mayBeNull="true">The name of the callback parameter for JSONP request (default is callback).</param>
    /// <returns type="Sys.Net.WebRequest" mayBeNull="true">Returns the request that was sent (null for JSONP requests).</returns>
    var e = Function._validateParams(arguments, [
        {name: "servicePath", type: String},
        {name: "methodName", type: String, mayBeNull: true, optional: true},
        {name: "useGet", type: Boolean, mayBeNull: true, optional: true},
        {name: "params", mayBeNull: true, optional: true},
        {name: "onSuccess", type: Function, mayBeNull: true, optional: true},
        {name: "onFailure", type: Function, mayBeNull: true, optional: true},
        {name: "userContext", mayBeNull: true, optional: true},
        {name: "timeout", type: Number, mayBeNull: true, optional: true},
        {name: "enableJsonp", type: Boolean, mayBeNull: true, optional: true},
        {name: "jsonpCallbackParameter", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    var schemeHost = (enableJsonp !== false) ? Sys.Net.WebServiceProxy._xdomain.exec(servicePath) : null,
        tempCallback, jsonp = schemeHost && (schemeHost.length === 3) && 
            ((schemeHost[1] !== location.protocol) || (schemeHost[2] !== location.host));
    useGet = jsonp || useGet;
    if (jsonp) {
        jsonpCallbackParameter = jsonpCallbackParameter || "callback";
        tempCallback = "_jsonp" + Sys._jsonp++;
    }
    if (!params) params = {};
    var urlParams = params;
    if (!useGet || !urlParams) urlParams = {};
    var error, timeoutcookie = null, body = null,
        url = Sys.Net.WebRequest._createUrl(methodName
            ? (servicePath+"/"+encodeURIComponent(methodName))
            : servicePath, urlParams, jsonp ? (jsonpCallbackParameter + "=Sys." + tempCallback) : null);
    if (jsonp) {
        function jsonpComplete(data, statusCode) {
            if (timeoutcookie !== null) {
                window.clearTimeout(timeoutcookie);
                timeoutcookie = null;
            }
            delete Sys[tempCallback];
            tempCallback = null; 
            if ((typeof(statusCode) !== "undefined") && (statusCode !== 200)) {
                if (onFailure) {
                    error = new Sys.Net.WebServiceError(false,
                            data.Message || String.format(Sys.Res.webServiceFailedNoMsg, methodName),
                            data.StackTrace || null,
                            data.ExceptionType || null,
                            data);
                    error._statusCode = statusCode;
                    onFailure(error, userContext, methodName);
                }
                else {
                    if (data.StackTrace && data.Message) {
                        error = data.StackTrace + "-- " + data.Message;
                    }
                    else {
                        error = data.StackTrace || data.Message;
                    }
                    error = String.format(error ? Sys.Res.webServiceFailed : Sys.Res.webServiceFailedNoMsg, methodName, error);
                    throw Sys.Net.WebServiceProxy._createFailedError(methodName, String.format(Sys.Res.webServiceFailed, methodName, error));
                }
            }
            else if (onSuccess) {
                onSuccess(data, userContext, methodName);
            }
        }
        Sys[tempCallback] = jsonpComplete;
        Sys._loadJsonp(url, function() {
            if (tempCallback) {
                jsonpComplete({ Message: String.format(Sys.Res.webServiceFailedNoMsg, methodName) }, -1);
            }
        });
        return null;
    }
    var request = new Sys.Net.WebRequest();
    request.set_url(url);
    request.get_headers()['Content-Type'] = 'application/json; charset=utf-8';
    if (!useGet) {
        body = Sys.Serialization.JavaScriptSerializer.serialize(params);
        if (body === "{}") body = "";
    }
    request.set_body(body);
    request.add_completed(onComplete);
    if (timeout > 0) request.set_timeout(timeout);
    request.invoke();
    
    function onComplete(response, eventArgs) {
        if (response.get_responseAvailable()) {
            var ex, statusCode = response.get_statusCode();
            var result = null;
            var isJson;

            try {
                var contentType = response.getResponseHeader("Content-Type");
                isJson = contentType.startsWith("application/json");
                result = isJson ? response.get_object() :
                    (contentType.startsWith("text/xml") ? response.get_xml() : response.get_responseData());
            }
            catch (ex) {
            }

            var error = response.getResponseHeader("jsonerror");
            var errorObj = (error === "true");
            if (errorObj) {
                if (result) {
                    result = new Sys.Net.WebServiceError(false, result.Message, result.StackTrace, result.ExceptionType, result);
                }
            }
            else if (isJson) {
                result = (!result || (typeof(result.d) === "undefined")) ? result : result.d;
            }
            if (((statusCode < 200) || (statusCode >= 300)) || errorObj) {
                if (onFailure) {
                    if (!result || !errorObj) {
                        result = new Sys.Net.WebServiceError(false /*timedout*/, String.format(Sys.Res.webServiceFailedNoMsg, methodName));
                    }
                    result._statusCode = statusCode;
                    onFailure(result, userContext, methodName);
                }
                else {
                    if (result && errorObj) {
                        error = result.get_exceptionType() + "-- " + result.get_message();
                    }
                    else {
                        error = response.get_responseData();
                    }
                    throw Sys.Net.WebServiceProxy._createFailedError(methodName, String.format(Sys.Res.webServiceFailed, methodName, error));
                }
            }
            else if (onSuccess) {
                onSuccess(result, userContext, methodName);
            }
        }
        else {
            var timedOut = response.get_timedOut(),
                msg = String.format((timedOut ? Sys.Res.webServiceTimedOut : Sys.Res.webServiceFailedNoMsg), methodName);
            if (onFailure) {
                onFailure(new Sys.Net.WebServiceError(timedOut, msg, "", ""), userContext, methodName);
            }
            else {
                throw Sys.Net.WebServiceProxy._createFailedError(methodName, msg);
            }
        }
    }

    return request;
}

$type._createFailedError = function WebServiceProxy$_createFailedError(methodName, errorMessage) {
    var displayMessage = "Sys.Net.WebServiceFailedException: " + errorMessage;
    var e = Error.create(displayMessage, { 'name': 'Sys.Net.WebServiceFailedException', 'methodName': methodName });
    e.popStackFrame();
    return e;
}

$type._defaultFailedCallback = function WebServiceProxy$_defaultFailedCallback(err, methodName) {
    var error = err.get_exceptionType() + "-- " + err.get_message();
    throw Sys.Net.WebServiceProxy._createFailedError(methodName, String.format(Sys.Res.webServiceFailed, methodName, error));
}

$type._generateTypedConstructor = function WebServiceProxy$_generateTypedConstructor(type) {
    return function(properties) {
        if (properties) {
            for (var name in properties) {
                this[name] = properties[name];
            }
        }
        this.__type = type;
    }
}

Sys._jsonp = 0;

$type._xdomain = /^\s*([a-zA-Z0-9\+\-\.]+\:)\/\/([^?#\/]+)/;

Sys._loadJsonp = function _loadJsonp(src, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    var attachEvent = script.attachEvent;
    function onEvent() {
        if (!attachEvent || /loaded|complete/.test(script.readyState)) {
            if (attachEvent) {
                script.detachEvent("onreadystatechange", onEvent);
            }
            else {
                script.removeEventListener("load", onEvent, false);
                script.removeEventListener("error", onEvent, false);
            }
            callback.apply(script);
            script = null;
        }
    }
    if (attachEvent) {
        script.attachEvent("onreadystatechange", onEvent);
    }
    else {
        script.addEventListener("load", onEvent, false);
        script.addEventListener("error", onEvent, false);
    }    
    Sys.get("head").appendChild(script);
}
$type = Sys.Net.WebServiceError = function WebServiceError(timedOut, message, stackTrace, exceptionType, errorObject) {
    /// <summary locid="M:J#Sys.Net.WebServiceError.#ctor">Represents a webservice error</summary>
    /// <param name="timedOut" type="Boolean">Whether the service timed out.</param>
    /// <param name="message" type="String" mayBeNull="true">The error message.</param>
    /// <param name="stackTrace" type="String" mayBeNull="true" optional="true">The stack trace of the error.</param>
    /// <param name="exceptionType" type="String" mayBeNull="true" optional="true">The server exception type.</param>
    /// <param name="errorObject" type="Object" mayBeNull="true" optional="true">The raw error information.</param>
    var e = Function._validateParams(arguments, [
        {name: "timedOut", type: Boolean},
        {name: "message", type: String, mayBeNull: true},
        {name: "stackTrace", type: String, mayBeNull: true, optional: true},
        {name: "exceptionType", type: String, mayBeNull: true, optional: true},
        {name: "errorObject", type: Object, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    this._timedOut = timedOut;
    this._message = message;
    this._stackTrace = stackTrace;
    this._exceptionType = exceptionType;
    this._errorObject = errorObject;
    this._statusCode = -1;
}

$type.prototype = {
    get_timedOut: function WebServiceError$get_timedOut() {
        /// <value type="Boolean" locid="P:J#Sys.Net.WebServiceError.timedOut">Whether the service failed due to timeout.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._timedOut;
    },

    get_statusCode: function WebServiceError$get_statusCode() {
        /// <value type="Number" locid="P:J#Sys.Net.WebServiceError.statusCode">Int representing the status of the response.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._statusCode;
    },

    get_message: function WebServiceError$get_message() {
        /// <value type="String" locid="P:J#Sys.Net.WebServiceError.message">Error message</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._message;
    },

    get_stackTrace: function WebServiceError$get_stackTrace() {
        /// <value type="String" locid="P:J#Sys.Net.WebServiceError.stackTrace">Stack trace of the error.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._stackTrace || "";
    },

    get_exceptionType: function WebServiceError$get_exceptionType() {
        /// <value type="String" locid="P:J#Sys.Net.WebServiceError.exceptionType">Exception type of the error.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._exceptionType || "";
    },
    
    get_errorObject: function WebServiceError$get_errorObject() {
        /// <value type="Object" locid="P:J#Sys.Net.WebServiceError.errorObject">The raw error object returned by the service.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._errorObject || null;
    }
}
$type.registerClass('Sys.Net.WebServiceError');

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("WebServices", null, execute);
}
else {
	execute();
}

})();
