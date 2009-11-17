// Name:        MicrosoftAjaxWebServices.debug.js
// Assembly:    System.Web.Ajax
// Version:     3.0.31106.0
// FileVersion: 3.0.31106.0
/// <reference name="MicrosoftAjaxNetwork.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxWebServices.js", ["MicrosoftAjaxNetwork.js"]);

Type.registerNamespace('Sys.Net');

Sys.Net.WebServiceProxy = function Sys$Net$WebServiceProxy() {
}

    function Sys$Net$WebServiceProxy$get_timeout() {
        /// <value type="Number" locid="P:J#Sys.Net.WebServiceProxy.timeout"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._timeout || 0;
    }
    function Sys$Net$WebServiceProxy$set_timeout(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Number}]);
        if (e) throw e;
        if (value < 0) {
            throw Error.argumentOutOfRange('value', value, Sys.Res.invalidTimeout);
        }
        this._timeout = value;
    }
    function Sys$Net$WebServiceProxy$get_defaultUserContext() {
        /// <value mayBeNull="true" locid="P:J#Sys.Net.WebServiceProxy.defaultUserContext"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return (typeof(this._userContext) === "undefined") ? null : this._userContext;
    }
    function Sys$Net$WebServiceProxy$set_defaultUserContext(value) {
        var e = Function._validateParams(arguments, [{name: "value", mayBeNull: true}]);
        if (e) throw e;
        this._userContext = value;
    }
    function Sys$Net$WebServiceProxy$get_defaultSucceededCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Net.WebServiceProxy.defaultSucceededCallback"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._succeeded || null;
    }
    function Sys$Net$WebServiceProxy$set_defaultSucceededCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._succeeded = value;
    }
    function Sys$Net$WebServiceProxy$get_defaultFailedCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Net.WebServiceProxy.defaultFailedCallback"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._failed || null;
    }
    function Sys$Net$WebServiceProxy$set_defaultFailedCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._failed = value;
    }
    function Sys$Net$WebServiceProxy$get_enableJsonp() {
        /// <value type="Boolean" locid="P:J#Sys.Net.WebServiceProxy.enableJsonp"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return !!this._jsonp;
    }
    function Sys$Net$WebServiceProxy$set_enableJsonp(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Boolean}]);
        if (e) throw e;
        this._jsonp = value;
    }
    function Sys$Net$WebServiceProxy$get_path() {
        /// <value type="String" locid="P:J#Sys.Net.WebServiceProxy.path"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._path || null;
    }
    function Sys$Net$WebServiceProxy$set_path(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        this._path = value;
    }
    function Sys$Net$WebServiceProxy$get_jsonpCallbackParameter() {
        /// <value type="String" locid="P:J#Sys.Net.WebServiceProxy.jsonpCallbackParameter"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._callbackParameter || "callback";
    }
    function Sys$Net$WebServiceProxy$set_jsonpCallbackParameter(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        this._callbackParameter = value;
    }
    function Sys$Net$WebServiceProxy$_invoke(servicePath, methodName, useGet, params, onSuccess, onFailure, userContext) {
        /// <summary locid="M:J#Sys.Net.WebServiceProxy._invoke" />
        /// <param name="servicePath" type="String"></param>
        /// <param name="methodName" type="String"></param>
        /// <param name="useGet" type="Boolean"></param>
        /// <param name="params"></param>
        /// <param name="onSuccess" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="onFailure" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="userContext" mayBeNull="true" optional="true"></param>
        /// <returns type="Sys.Net.WebRequest" mayBeNull="true"></returns>
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
Sys.Net.WebServiceProxy.prototype = {
    get_timeout: Sys$Net$WebServiceProxy$get_timeout,
    set_timeout: Sys$Net$WebServiceProxy$set_timeout,
    get_defaultUserContext: Sys$Net$WebServiceProxy$get_defaultUserContext,
    set_defaultUserContext: Sys$Net$WebServiceProxy$set_defaultUserContext,
    get_defaultSucceededCallback: Sys$Net$WebServiceProxy$get_defaultSucceededCallback,
    set_defaultSucceededCallback: Sys$Net$WebServiceProxy$set_defaultSucceededCallback,
    get_defaultFailedCallback: Sys$Net$WebServiceProxy$get_defaultFailedCallback,
    set_defaultFailedCallback: Sys$Net$WebServiceProxy$set_defaultFailedCallback,
    get_enableJsonp: Sys$Net$WebServiceProxy$get_enableJsonp,
    set_enableJsonp: Sys$Net$WebServiceProxy$set_enableJsonp,
    get_path: Sys$Net$WebServiceProxy$get_path,
    set_path: Sys$Net$WebServiceProxy$set_path,
    get_jsonpCallbackParameter: Sys$Net$WebServiceProxy$get_jsonpCallbackParameter,
    set_jsonpCallbackParameter: Sys$Net$WebServiceProxy$set_jsonpCallbackParameter,
    _invoke: Sys$Net$WebServiceProxy$_invoke
}
Sys.Net.WebServiceProxy.registerClass('Sys.Net.WebServiceProxy');

Sys.Net.WebServiceProxy.invoke = function Sys$Net$WebServiceProxy$invoke(servicePath, methodName, useGet, params, onSuccess, onFailure, userContext, timeout, enableJsonp, jsonpCallbackParameter) {
    /// <summary locid="M:J#Sys.Net.WebServiceProxy.invoke" />
    /// <param name="servicePath" type="String"></param>
    /// <param name="methodName" type="String" mayBeNull="true" optional="true"></param>
    /// <param name="useGet" type="Boolean" optional="true" mayBeNull="true"></param>
    /// <param name="params" mayBeNull="true" optional="true"></param>
    /// <param name="onSuccess" type="Function" mayBeNull="true" optional="true"></param>
    /// <param name="onFailure" type="Function" mayBeNull="true" optional="true"></param>
    /// <param name="userContext" mayBeNull="true" optional="true"></param>
    /// <param name="timeout" type="Number" optional="true" mayBeNull="true"></param>
    /// <param name="enableJsonp" type="Boolean" optional="true" mayBeNull="true"></param>
    /// <param name="jsonpCallbackParameter" type="String" optional="true" mayBeNull="true"></param>
    /// <returns type="Sys.Net.WebRequest" mayBeNull="true"></returns>
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
    if (timeout && timeout > 0) request.set_timeout(timeout);
    request.invoke();
    function onComplete(response, eventArgs) {
        if (response.get_responseAvailable()) {
            var ex, statusCode = response.get_statusCode();
            var result = null;
            try {
                var contentType = response.getResponseHeader("Content-Type");
                result = contentType.startsWith("application/json") ? response.get_object() :
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
            else if (contentType.startsWith("application/json")) {
                result = (!result || (typeof(result.d) === "undefined")) ? result : result.d;
            }
            if (((statusCode < 200) || (statusCode >= 300)) || errorObj) {
                if (onFailure) {
                    if (!result || !errorObj) {
                        result = new Sys.Net.WebServiceError(false 
, String.format(Sys.Res.webServiceFailedNoMsg, methodName));
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

Sys.Net.WebServiceProxy._createFailedError = function Sys$Net$WebServiceProxy$_createFailedError(methodName, errorMessage) {
    var displayMessage = "Sys.Net.WebServiceFailedException: " + errorMessage;
    var e = Error.create(displayMessage, { 'name': 'Sys.Net.WebServiceFailedException', 'methodName': methodName });
    e.popStackFrame();
    return e;
}

Sys.Net.WebServiceProxy._defaultFailedCallback = function Sys$Net$WebServiceProxy$_defaultFailedCallback(err, methodName) {
    var error = err.get_exceptionType() + "-- " + err.get_message();
    throw Sys.Net.WebServiceProxy._createFailedError(methodName, String.format(Sys.Res.webServiceFailed, methodName, error));
}



Sys.Net.WebServiceProxy._generateTypedConstructor = function Sys$Net$WebServiceProxy$_generateTypedConstructor(type) {
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


Sys.Net.WebServiceProxy._xdomain = /^\s*([a-zA-Z0-9\+\-\.]+\:)\/\/([^?#\/]+)/;

Sys._loadJsonp = function _loadJsonp(src, callback) {
    var script = createElement('script');
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
    document.getElementsByTagName("head")[0].appendChild(script);
}

Sys.Net.WebServiceError = function Sys$Net$WebServiceError(timedOut, message, stackTrace, exceptionType, errorObject) {
    /// <summary locid="M:J#Sys.Net.WebServiceError.#ctor" />
    /// <param name="timedOut" type="Boolean"></param>
    /// <param name="message" type="String" mayBeNull="true"></param>
    /// <param name="stackTrace" type="String" mayBeNull="true" optional="true"></param>
    /// <param name="exceptionType" type="String" mayBeNull="true" optional="true"></param>
    /// <param name="errorObject" type="Object" mayBeNull="true" optional="true"></param>
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


    function Sys$Net$WebServiceError$get_timedOut() {
        /// <value type="Boolean" locid="P:J#Sys.Net.WebServiceError.timedOut"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._timedOut;
    }

    function Sys$Net$WebServiceError$get_statusCode() {
        /// <value type="Number" locid="P:J#Sys.Net.WebServiceError.statusCode"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._statusCode;
    }

    function Sys$Net$WebServiceError$get_message() {
        /// <value type="String" locid="P:J#Sys.Net.WebServiceError.message"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._message;
    }

    function Sys$Net$WebServiceError$get_stackTrace() {
        /// <value type="String" locid="P:J#Sys.Net.WebServiceError.stackTrace"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._stackTrace || "";
    }

    function Sys$Net$WebServiceError$get_exceptionType() {
        /// <value type="String" locid="P:J#Sys.Net.WebServiceError.exceptionType"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._exceptionType || "";
    }

    function Sys$Net$WebServiceError$get_errorObject() {
        /// <value type="Object" locid="P:J#Sys.Net.WebServiceError.errorObject"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._errorObject || null;
    }
Sys.Net.WebServiceError.prototype = {
    get_timedOut: Sys$Net$WebServiceError$get_timedOut,
    get_statusCode: Sys$Net$WebServiceError$get_statusCode,
    get_message: Sys$Net$WebServiceError$get_message,
    get_stackTrace: Sys$Net$WebServiceError$get_stackTrace,
    get_exceptionType: Sys$Net$WebServiceError$get_exceptionType,
    get_errorObject: Sys$Net$WebServiceError$get_errorObject
}
Sys.Net.WebServiceError.registerClass('Sys.Net.WebServiceError');

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("WebServices", null, execute);
}
else {
	execute();
}

})();

