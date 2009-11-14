// Name:        MicrosoftAjaxNetwork.debug.js
// Assembly:    System.Web.Ajax
// Version:     3.0.31106.22099
// FileVersion: 3.0.31106.0
/// <reference name="MicrosoftAjaxSerialization.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxNetwork.js", ["MicrosoftAjaxSerialization.js"]);

if (!window.XMLHttpRequest) {
    window.XMLHttpRequest = function window$XMLHttpRequest() {
        var progIDs = [ 'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP' ];
        for (var i = 0, l = progIDs.length; i < l; i++) {
            try {
                return new ActiveXObject(progIDs[i]);
            }
            catch (ex) {
            }
        }
        return null;
    }
}

Type.registerNamespace('Sys.Net');

Sys.Net.WebRequestExecutor = function Sys$Net$WebRequestExecutor() {
    /// <summary locid="M:J#Sys.Net.WebRequestExecutor.#ctor" />
    if (arguments.length !== 0) throw Error.parameterCount();
    this._webRequest = null;
    this._resultObject = null;
}


    function Sys$Net$WebRequestExecutor$get_webRequest() {
        /// <value type="Sys.Net.WebRequest" locid="P:J#Sys.Net.WebRequestExecutor.webRequest"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._webRequest;
    }

    function Sys$Net$WebRequestExecutor$_set_webRequest(value) {
        if (this.get_started()) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOnceStarted, 'set_webRequest'));
        }

        this._webRequest = value;
    }


    function Sys$Net$WebRequestExecutor$get_started() {
        /// <value type="Boolean" locid="P:J#Sys.Net.WebRequestExecutor.started"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }

    function Sys$Net$WebRequestExecutor$get_responseAvailable() {
        /// <value type="Boolean" locid="P:J#Sys.Net.WebRequestExecutor.responseAvailable"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }

    function Sys$Net$WebRequestExecutor$get_timedOut() {
        /// <value type="Boolean" locid="P:J#Sys.Net.WebRequestExecutor.timedOut"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }
    function Sys$Net$WebRequestExecutor$get_aborted() {
        /// <value type="Boolean" locid="P:J#Sys.Net.WebRequestExecutor.aborted"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }
    function Sys$Net$WebRequestExecutor$get_responseData() {
        /// <value type="String" locid="P:J#Sys.Net.WebRequestExecutor.responseData"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }
    function Sys$Net$WebRequestExecutor$get_statusCode() {
        /// <value type="Number" locid="P:J#Sys.Net.WebRequestExecutor.statusCode"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }
    function Sys$Net$WebRequestExecutor$get_statusText() {
        /// <value type="String" locid="P:J#Sys.Net.WebRequestExecutor.statusText"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }
    function Sys$Net$WebRequestExecutor$get_xml() {
        /// <value locid="P:J#Sys.Net.WebRequestExecutor.xml"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }
    function Sys$Net$WebRequestExecutor$get_object() {
        /// <value locid="P:J#Sys.Net.WebRequestExecutor.object"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        if (!this._resultObject) {
            this._resultObject = Sys.Serialization.JavaScriptSerializer.deserialize(this.get_responseData());
        }
        return this._resultObject;
    }


    function Sys$Net$WebRequestExecutor$executeRequest() {
        /// <summary locid="M:J#Sys.Net.WebRequestExecutor.executeRequest" />
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }
    function Sys$Net$WebRequestExecutor$abort() {
        /// <summary locid="M:J#Sys.Net.WebRequestExecutor.abort" />
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }
    function Sys$Net$WebRequestExecutor$getResponseHeader(header) {
        /// <summary locid="M:J#Sys.Net.WebRequestExecutor.getResponseHeader" />
        /// <param name="header" type="String"></param>
        var e = Function._validateParams(arguments, [
            {name: "header", type: String}
        ]);
        if (e) throw e;
        throw Error.notImplemented();
    }
    function Sys$Net$WebRequestExecutor$getAllResponseHeaders() {
        /// <summary locid="M:J#Sys.Net.WebRequestExecutor.getAllResponseHeaders" />
        if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }
Sys.Net.WebRequestExecutor.prototype = {
    get_webRequest: Sys$Net$WebRequestExecutor$get_webRequest,
    _set_webRequest: Sys$Net$WebRequestExecutor$_set_webRequest,
    get_started: Sys$Net$WebRequestExecutor$get_started,
    get_responseAvailable: Sys$Net$WebRequestExecutor$get_responseAvailable,
    get_timedOut: Sys$Net$WebRequestExecutor$get_timedOut,
    get_aborted: Sys$Net$WebRequestExecutor$get_aborted,
    get_responseData: Sys$Net$WebRequestExecutor$get_responseData,
    get_statusCode: Sys$Net$WebRequestExecutor$get_statusCode,
    get_statusText: Sys$Net$WebRequestExecutor$get_statusText,
    get_xml: Sys$Net$WebRequestExecutor$get_xml,
    get_object: Sys$Net$WebRequestExecutor$get_object,
    executeRequest: Sys$Net$WebRequestExecutor$executeRequest,
    abort: Sys$Net$WebRequestExecutor$abort,
    getResponseHeader: Sys$Net$WebRequestExecutor$getResponseHeader,
    getAllResponseHeaders: Sys$Net$WebRequestExecutor$getAllResponseHeaders
}
Sys.Net.WebRequestExecutor.registerClass('Sys.Net.WebRequestExecutor');
Sys.Net.XMLDOM = function Sys$Net$XMLDOM(markup) {
    /// <summary locid="M:J#Sys.Net.XMLDOM.#ctor" />
    /// <param name="markup" type="String"></param>
    var e = Function._validateParams(arguments, [
        {name: "markup", type: String}
    ]);
    if (e) throw e;
    if (!window.DOMParser) {
        var progIDs = [ 'Msxml2.DOMDocument.3.0', 'Msxml2.DOMDocument' ];
        for (var i = 0, l = progIDs.length; i < l; i++) {
            try {
                var xmlDOM = new ActiveXObject(progIDs[i]);
                xmlDOM.async = false;
                xmlDOM.loadXML(markup);
                xmlDOM.setProperty('SelectionLanguage', 'XPath');
                return xmlDOM;
            }
            catch (ex) {
            }
        }
    }
    else {
        try {
            var domParser = new window.DOMParser();
            return domParser.parseFromString(markup, 'text/xml');
        }
        catch (ex) {
        }
    }
    return null;
}

Sys.Net.XMLHttpExecutor = function Sys$Net$XMLHttpExecutor() {
    /// <summary locid="M:J#Sys.Net.XMLHttpExecutor.#ctor" />
    if (arguments.length !== 0) throw Error.parameterCount();

    Sys.Net.XMLHttpExecutor.initializeBase(this);

    var _this = this;
    this._xmlHttpRequest = null;
    this._webRequest = null;
    this._responseAvailable = false;
    this._timedOut = false;
    this._timer = null;
    this._aborted = false;
    this._started = false;

    this._onReadyStateChange = (function () {

        if (_this._xmlHttpRequest.readyState === 4 
) {
            try {
                if (typeof(_this._xmlHttpRequest.status) === "undefined") {
                    return;
                }
            }
            catch(ex) {
                return;
            }
            _this._clearTimer();
            _this._responseAvailable = true;
                _this._webRequest.completed(Sys.EventArgs.Empty);
                if (_this._xmlHttpRequest != null) {
                    _this._xmlHttpRequest.onreadystatechange = Function.emptyMethod;
                    _this._xmlHttpRequest = null;
                }
        }
    });

    this._clearTimer = (function() {
        if (_this._timer != null) {
            window.clearTimeout(_this._timer);
            _this._timer = null;
        }
    });

    this._onTimeout = (function() {
        if (!_this._responseAvailable) {
            _this._clearTimer();
            _this._timedOut = true;
            _this._xmlHttpRequest.onreadystatechange = Function.emptyMethod;
            _this._xmlHttpRequest.abort();
            _this._webRequest.completed(Sys.EventArgs.Empty);
            _this._xmlHttpRequest = null;
        }
    });

}



    function Sys$Net$XMLHttpExecutor$get_timedOut() {
        /// <value type="Boolean" locid="P:J#Sys.Net.XMLHttpExecutor.timedOut"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._timedOut;
    }

    function Sys$Net$XMLHttpExecutor$get_started() {
        /// <value type="Boolean" locid="P:J#Sys.Net.XMLHttpExecutor.started"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._started;
    }

    function Sys$Net$XMLHttpExecutor$get_responseAvailable() {
        /// <value type="Boolean" locid="P:J#Sys.Net.XMLHttpExecutor.responseAvailable"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._responseAvailable;
    }

    function Sys$Net$XMLHttpExecutor$get_aborted() {
        /// <value type="Boolean" locid="P:J#Sys.Net.XMLHttpExecutor.aborted"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._aborted;
    }

    function Sys$Net$XMLHttpExecutor$executeRequest() {
        /// <summary locid="M:J#Sys.Net.XMLHttpExecutor.executeRequest" />
        if (arguments.length !== 0) throw Error.parameterCount();
        this._webRequest = this.get_webRequest();

        if (this._started) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOnceStarted, 'executeRequest'));
        }
        if (this._webRequest === null) {
            throw Error.invalidOperation(Sys.Res.nullWebRequest);
        }

        var body = this._webRequest.get_body();
        var headers = this._webRequest.get_headers();
        this._xmlHttpRequest = new XMLHttpRequest();
        this._xmlHttpRequest.onreadystatechange = this._onReadyStateChange;
        var verb = this._webRequest.get_httpVerb();
        this._xmlHttpRequest.open(verb, this._webRequest.getResolvedUrl(), true 
);
        this._xmlHttpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        if (headers) {
            for (var header in headers) {
                var val = headers[header];
                if (typeof(val) !== "function")
                    this._xmlHttpRequest.setRequestHeader(header, val);
            }
        }

        if (verb.toLowerCase() === "post") {
            if ((headers === null) || !headers['Content-Type']) {
                this._xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
            }

            if (!body) {
                body = "";
            }
        }

        var timeout = this._webRequest.get_timeout();
        if (timeout > 0) {
            this._timer = window.setTimeout(Function.createDelegate(this, this._onTimeout), timeout);
        }
        this._xmlHttpRequest.send(body);
        this._started = true;
    }

    function Sys$Net$XMLHttpExecutor$getResponseHeader(header) {
        /// <summary locid="M:J#Sys.Net.XMLHttpExecutor.getResponseHeader" />
        /// <param name="header" type="String"></param>
        /// <returns type="String"></returns>
        var e = Function._validateParams(arguments, [
            {name: "header", type: String}
        ]);
        if (e) throw e;
        if (!this._responseAvailable) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'getResponseHeader'));
        }
        if (!this._xmlHttpRequest) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'getResponseHeader'));
        }

        var result;
        try {
            result = this._xmlHttpRequest.getResponseHeader(header);
        } catch (e) {
        }
        if (!result) result = "";
        return result;
    }

    function Sys$Net$XMLHttpExecutor$getAllResponseHeaders() {
        /// <summary locid="M:J#Sys.Net.XMLHttpExecutor.getAllResponseHeaders" />
        /// <returns type="String"></returns>
        if (arguments.length !== 0) throw Error.parameterCount();
        if (!this._responseAvailable) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'getAllResponseHeaders'));
        }
        if (!this._xmlHttpRequest) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'getAllResponseHeaders'));
        }

        return this._xmlHttpRequest.getAllResponseHeaders();
    }

    function Sys$Net$XMLHttpExecutor$get_responseData() {
        /// <value type="String" locid="P:J#Sys.Net.XMLHttpExecutor.responseData"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        if (!this._responseAvailable) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_responseData'));
        }
        if (!this._xmlHttpRequest) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_responseData'));
        }

        return this._xmlHttpRequest.responseText;
    }

    function Sys$Net$XMLHttpExecutor$get_statusCode() {
        /// <value type="Number" locid="P:J#Sys.Net.XMLHttpExecutor.statusCode"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        if (!this._responseAvailable) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_statusCode'));
        }
        if (!this._xmlHttpRequest) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_statusCode'));
        }
        var result = 0;
        try {
            result = this._xmlHttpRequest.status;
        }
        catch(ex) {
        }
        return result;
    }

    function Sys$Net$XMLHttpExecutor$get_statusText() {
        /// <value type="String" locid="P:J#Sys.Net.XMLHttpExecutor.statusText"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        if (!this._responseAvailable) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_statusText'));
        }
        if (!this._xmlHttpRequest) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_statusText'));
        }

        return this._xmlHttpRequest.statusText;
    }

    function Sys$Net$XMLHttpExecutor$get_xml() {
        /// <value locid="P:J#Sys.Net.XMLHttpExecutor.xml"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        if (!this._responseAvailable) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_xml'));
        }
        if (!this._xmlHttpRequest) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_xml'));
        }

        var xml = this._xmlHttpRequest.responseXML;
        if (!xml || !xml.documentElement) {

            xml = Sys.Net.XMLDOM(this._xmlHttpRequest.responseText);

            if (!xml || !xml.documentElement)
                return null;
        }
        else if (navigator.userAgent.indexOf('MSIE') !== -1) {
            xml.setProperty('SelectionLanguage', 'XPath');
        }

        if (xml.documentElement.namespaceURI === "http://www.mozilla.org/newlayout/xml/parsererror.xml" &&
            xml.documentElement.tagName === "parsererror") {
            return null;
        }
        if (xml.documentElement.firstChild && xml.documentElement.firstChild.tagName === "parsererror") {
            return null;
        }
        return xml;
    }

    function Sys$Net$XMLHttpExecutor$abort() {
        /// <summary locid="M:J#Sys.Net.XMLHttpExecutor.abort" />
        if (arguments.length !== 0) throw Error.parameterCount();
        if (!this._started) {
            throw Error.invalidOperation(Sys.Res.cannotAbortBeforeStart);
        }

        if (this._aborted || this._responseAvailable || this._timedOut)
            return;

        this._aborted = true;

        this._clearTimer();

        if (this._xmlHttpRequest && !this._responseAvailable) {

            this._xmlHttpRequest.onreadystatechange = Function.emptyMethod;
            this._xmlHttpRequest.abort();
            this._xmlHttpRequest = null;            

            this._webRequest.completed(Sys.EventArgs.Empty);
        }
    }
Sys.Net.XMLHttpExecutor.prototype = {
    get_timedOut: Sys$Net$XMLHttpExecutor$get_timedOut,
    get_started: Sys$Net$XMLHttpExecutor$get_started,
    get_responseAvailable: Sys$Net$XMLHttpExecutor$get_responseAvailable,
    get_aborted: Sys$Net$XMLHttpExecutor$get_aborted,
    executeRequest: Sys$Net$XMLHttpExecutor$executeRequest,
    getResponseHeader: Sys$Net$XMLHttpExecutor$getResponseHeader,
    getAllResponseHeaders: Sys$Net$XMLHttpExecutor$getAllResponseHeaders,
    get_responseData: Sys$Net$XMLHttpExecutor$get_responseData,
    get_statusCode: Sys$Net$XMLHttpExecutor$get_statusCode,
    get_statusText: Sys$Net$XMLHttpExecutor$get_statusText,
    get_xml: Sys$Net$XMLHttpExecutor$get_xml,
    abort: Sys$Net$XMLHttpExecutor$abort
}
Sys.Net.XMLHttpExecutor.registerClass('Sys.Net.XMLHttpExecutor', Sys.Net.WebRequestExecutor);
Sys.Net._WebRequestManager = function Sys$Net$_WebRequestManager() {
    /// <summary locid="P:J#Sys.Net.WebRequestManager.#ctor" />
    if (arguments.length !== 0) throw Error.parameterCount();
    this._defaultTimeout = 0;
    this._defaultExecutorType = "Sys.Net.XMLHttpExecutor";
}


    function Sys$Net$_WebRequestManager$add_invokingRequest(handler) {
        /// <summary locid="E:J#Sys.Net.WebRequestManager.invokingRequest" />
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        Sys.Observer.addEventHandler(this, "invokingRequest", handler);
    }
    function Sys$Net$_WebRequestManager$remove_invokingRequest(handler) {
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        Sys.Observer.removeEventHandler(this, "invokingRequest", handler);
    }

    function Sys$Net$_WebRequestManager$add_completedRequest(handler) {
        /// <summary locid="E:J#Sys.Net.WebRequestManager.completedRequest" />
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        Sys.Observer.addEventHandler(this, "completedRequest", handler);
    }
    function Sys$Net$_WebRequestManager$remove_completedRequest(handler) {
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        Sys.Observer.removeEventHandler(this, "completedRequest", handler);
    }
    function Sys$Net$_WebRequestManager$get_defaultTimeout() {
        /// <value type="Number" locid="P:J#Sys.Net.WebRequestManager.defaultTimeout"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._defaultTimeout;
    }
    function Sys$Net$_WebRequestManager$set_defaultTimeout(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Number}]);
        if (e) throw e;
        if (value < 0) {
            throw Error.argumentOutOfRange("value", value, Sys.Res.invalidTimeout);
        }

        this._defaultTimeout = value;
    }

    function Sys$Net$_WebRequestManager$get_defaultExecutorType() {
        /// <value type="String" locid="P:J#Sys.Net.WebRequestManager.defaultExecutorType"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._defaultExecutorType;
    }
    function Sys$Net$_WebRequestManager$set_defaultExecutorType(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        this._defaultExecutorType = value;
    }

    function Sys$Net$_WebRequestManager$executeRequest(webRequest) {
        /// <summary locid="M:J#Sys.Net.WebRequestManager.executeRequest" />
        /// <param name="webRequest" type="Sys.Net.WebRequest"></param>
        var e = Function._validateParams(arguments, [
            {name: "webRequest", type: Sys.Net.WebRequest}
        ]);
        if (e) throw e;
        var executor = webRequest.get_executor();
        if (!executor) {

            var er, failed = false;
            try {
                var executorType = window.eval(this._defaultExecutorType);
                executor = new executorType();
            } catch (er) {
                failed = true;
            }

            if (failed  || !Sys.Net.WebRequestExecutor.isInstanceOfType(executor) || !executor) {
                throw Error.argument("defaultExecutorType", String.format(Sys.Res.invalidExecutorType, this._defaultExecutorType));
            }

            webRequest.set_executor(executor);
        }

        if (executor.get_aborted()) {
            return;
        }

        var evArgs = new Sys.Net.NetworkRequestEventArgs(webRequest);
        Sys.Observer.raiseEvent(this, "invokingRequest", evArgs);
        if (!evArgs.get_cancel()) {
            executor.executeRequest();
        }
    }
Sys.Net._WebRequestManager.prototype = {
    add_invokingRequest: Sys$Net$_WebRequestManager$add_invokingRequest,
    remove_invokingRequest: Sys$Net$_WebRequestManager$remove_invokingRequest,
    add_completedRequest: Sys$Net$_WebRequestManager$add_completedRequest,
    remove_completedRequest: Sys$Net$_WebRequestManager$remove_completedRequest,
    get_defaultTimeout: Sys$Net$_WebRequestManager$get_defaultTimeout,
    set_defaultTimeout: Sys$Net$_WebRequestManager$set_defaultTimeout,
    get_defaultExecutorType: Sys$Net$_WebRequestManager$get_defaultExecutorType,
    set_defaultExecutorType: Sys$Net$_WebRequestManager$set_defaultExecutorType,
    executeRequest: Sys$Net$_WebRequestManager$executeRequest
}

Sys.Net._WebRequestManager.registerClass('Sys.Net._WebRequestManager');


Sys.Net.WebRequestManager = new Sys.Net._WebRequestManager();
Sys.Net.NetworkRequestEventArgs = function Sys$Net$NetworkRequestEventArgs(webRequest) {
    /// <summary locid="M:J#Sys.Net.NetworkRequestEventArgs.#ctor" />
    /// <param name="webRequest" type="Sys.Net.WebRequest"></param>
    var e = Function._validateParams(arguments, [
        {name: "webRequest", type: Sys.Net.WebRequest}
    ]);
    if (e) throw e;
    Sys.Net.NetworkRequestEventArgs.initializeBase(this);
    this._webRequest = webRequest;
}


    function Sys$Net$NetworkRequestEventArgs$get_webRequest() {
        /// <value type="Sys.Net.WebRequest" locid="P:J#Sys.Net.NetworkRequestEventArgs.webRequest"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._webRequest;
    }
Sys.Net.NetworkRequestEventArgs.prototype = {
    get_webRequest: Sys$Net$NetworkRequestEventArgs$get_webRequest
}

Sys.Net.NetworkRequestEventArgs.registerClass('Sys.Net.NetworkRequestEventArgs', Sys.CancelEventArgs);
Sys.Net.WebRequest = function Sys$Net$WebRequest() {
    /// <summary locid="M:J#Sys.Net.WebRequest.#ctor" />
    if (arguments.length !== 0) throw Error.parameterCount();
    this._url = "";
    this._headers = { };
    this._body = null;
    this._userContext = null;
    this._httpVerb = null;
    this._executor = null;
    this._invokeCalled = false;
    this._timeout = 0;
}



    function Sys$Net$WebRequest$add_completed(handler) {
    /// <summary locid="E:J#Sys.Net.WebRequest.completed" />
    var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
    if (e) throw e;
        Sys.Observer.addEventHandler(this, "completed", handler);
    }
    function Sys$Net$WebRequest$remove_completed(handler) {
    var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
    if (e) throw e;
        Sys.Observer.removeEventHandler(this, "completed", handler);
    }

    function Sys$Net$WebRequest$completed(eventArgs) {
        /// <summary locid="M:J#Sys.Net.WebRequest.completed" />
        /// <param name="eventArgs" type="Sys.EventArgs"></param>
        var e = Function._validateParams(arguments, [
            {name: "eventArgs", type: Sys.EventArgs}
        ]);
        if (e) throw e;
        function raise(source, sender, eventName) {
            var handler = Sys.Observer._getContext(source, true).events.getHandler(eventName);
            if (handler) {
                handler(sender, eventArgs);
            }
        }
        raise(Sys.Net.WebRequestManager, this._executor, "completedRequest");
        raise(this, this._executor, "completed");
        Sys.Observer.clearEventHandlers(this, "completed");
    }

    function Sys$Net$WebRequest$get_url() {
        /// <value type="String" locid="P:J#Sys.Net.WebRequest.url"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._url;
    }
    function Sys$Net$WebRequest$set_url(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        this._url = value;
    }

    function Sys$Net$WebRequest$get_headers() {
        /// <value locid="P:J#Sys.Net.WebRequest.headers"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._headers;
    }

    function Sys$Net$WebRequest$get_httpVerb() {
        /// <value type="String" locid="P:J#Sys.Net.WebRequest.httpVerb"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        if (this._httpVerb === null) {
            if (this._body === null) {
                return "GET";
            }
            return "POST";
        }
        return this._httpVerb;
    }
    function Sys$Net$WebRequest$set_httpVerb(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        if (value.length === 0) {
            throw Error.argument('value', Sys.Res.invalidHttpVerb);
        }

        this._httpVerb = value;
    }

    function Sys$Net$WebRequest$get_body() {
        /// <value mayBeNull="true" locid="P:J#Sys.Net.WebRequest.body"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._body;
    }
    function Sys$Net$WebRequest$set_body(value) {
        var e = Function._validateParams(arguments, [{name: "value", mayBeNull: true}]);
        if (e) throw e;
        this._body = value;
    }

    function Sys$Net$WebRequest$get_userContext() {
        /// <value mayBeNull="true" locid="P:J#Sys.Net.WebRequest.userContext"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._userContext;
    }
    function Sys$Net$WebRequest$set_userContext(value) {
        var e = Function._validateParams(arguments, [{name: "value", mayBeNull: true}]);
        if (e) throw e;
        this._userContext = value;
    }

    function Sys$Net$WebRequest$get_executor() {
        /// <value type="Sys.Net.WebRequestExecutor" locid="P:J#Sys.Net.WebRequest.executor"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._executor;
    }
    function Sys$Net$WebRequest$set_executor(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Sys.Net.WebRequestExecutor}]);
        if (e) throw e;
        if (this._executor !== null && this._executor.get_started()) {
            throw Error.invalidOperation(Sys.Res.setExecutorAfterActive);
        }

        this._executor = value;
        this._executor._set_webRequest(this);
    }

    function Sys$Net$WebRequest$get_timeout() {
        /// <value type="Number" locid="P:J#Sys.Net.WebRequest.timeout"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        if (this._timeout === 0) {
            return Sys.Net.WebRequestManager.get_defaultTimeout();
        }
        return this._timeout;
    }
    function Sys$Net$WebRequest$set_timeout(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Number}]);
        if (e) throw e;
        if (value < 0) {
            throw Error.argumentOutOfRange("value", value, Sys.Res.invalidTimeout);
        }

        this._timeout = value;
    }

    function Sys$Net$WebRequest$getResolvedUrl() {
        /// <summary locid="M:J#raise" />
        /// <returns type="String"></returns>
        if (arguments.length !== 0) throw Error.parameterCount();
        return Sys.Net.WebRequest._resolveUrl(this._url);
    }

    function Sys$Net$WebRequest$invoke() {
        /// <summary locid="M:J#raise" />
        if (arguments.length !== 0) throw Error.parameterCount();
        if (this._invokeCalled) {
            throw Error.invalidOperation(Sys.Res.invokeCalledTwice);
        }

        Sys.Net.WebRequestManager.executeRequest(this);
        this._invokeCalled = true;
    }
Sys.Net.WebRequest.prototype = {
    add_completed: Sys$Net$WebRequest$add_completed,
    remove_completed: Sys$Net$WebRequest$remove_completed,
    completed: Sys$Net$WebRequest$completed,
    get_url: Sys$Net$WebRequest$get_url,
    set_url: Sys$Net$WebRequest$set_url,
    get_headers: Sys$Net$WebRequest$get_headers,
    get_httpVerb: Sys$Net$WebRequest$get_httpVerb,
    set_httpVerb: Sys$Net$WebRequest$set_httpVerb,
    get_body: Sys$Net$WebRequest$get_body,
    set_body: Sys$Net$WebRequest$set_body,
    get_userContext: Sys$Net$WebRequest$get_userContext,
    set_userContext: Sys$Net$WebRequest$set_userContext,
    get_executor: Sys$Net$WebRequest$get_executor,
    set_executor: Sys$Net$WebRequest$set_executor,
    get_timeout: Sys$Net$WebRequest$get_timeout,
    set_timeout: Sys$Net$WebRequest$set_timeout,
    getResolvedUrl: Sys$Net$WebRequest$getResolvedUrl,
    invoke: Sys$Net$WebRequest$invoke
}


Sys.Net.WebRequest._resolveUrl = function Sys$Net$WebRequest$_resolveUrl(url, baseUrl) {
    if (url && url.indexOf('://') !== -1) {
        return url;
    }

    if (!baseUrl || baseUrl.length === 0) {
        var baseElement = document.getElementsByTagName('base')[0];
        if (baseElement && baseElement.href && baseElement.href.length > 0) {
            baseUrl = baseElement.href;
        }
        else {
            baseUrl = document.URL;
        }
    }

    var qsStart = baseUrl.indexOf('?');
    if (qsStart !== -1) {
        baseUrl = baseUrl.substr(0, qsStart);
    }
    qsStart = baseUrl.indexOf('#');
    if (qsStart !== -1) {
        baseUrl = baseUrl.substr(0, qsStart);
    }
    baseUrl = baseUrl.substr(0, baseUrl.lastIndexOf('/') + 1);

    if (!url || url.length === 0) {
        return baseUrl;
    }

    if (url.charAt(0) === '/') {
        var slashslash = baseUrl.indexOf('://');
        if (slashslash === -1) {
            throw Error.argument("baseUrl", Sys.Res.badBaseUrl1);
        }

        var nextSlash = baseUrl.indexOf('/', slashslash + 3);
        if (nextSlash === -1) {
            throw Error.argument("baseUrl", Sys.Res.badBaseUrl2);
        }

        return baseUrl.substr(0, nextSlash) + url;
    }
    else {
        var lastSlash = baseUrl.lastIndexOf('/');
        if (lastSlash === -1) {
            throw Error.argument("baseUrl", Sys.Res.badBaseUrl3);
        }

        return baseUrl.substr(0, lastSlash+1) + url;
    }
}

Sys.Net.WebRequest._createQueryString = function Sys$Net$WebRequest$_createQueryString(queryString, encodeMethod, addParams) {
    encodeMethod = encodeMethod || encodeURIComponent;
    var i = 0, obj, val, arg, sb = new Sys.StringBuilder();
    if (queryString) {
        for (arg in queryString) {
            obj = queryString[arg];
            if (typeof(obj) === "function") continue;
            val = Sys.Serialization.JavaScriptSerializer.serialize(obj);
            if (i++) {
                sb.append('&');
            }
            sb.append(arg);
            sb.append('=');
            sb.append(encodeMethod(val));
        }
    }
    if (addParams) {
        if (i) {
            sb.append('&');
        }
        sb.append(addParams);
    }
    return sb.toString();
}

Sys.Net.WebRequest._createUrl = function Sys$Net$WebRequest$_createUrl(url, queryString, addParams) {
    if (!queryString && !addParams) {
        return url;
    }
    var qs = Sys.Net.WebRequest._createQueryString(queryString, null, addParams);
    return qs.length
        ? url + ((url && url.indexOf('?') >= 0) ? "&" : "?") + qs
        : url;
}

Sys.Net.WebRequest.registerClass('Sys.Net.WebRequest');

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("Network", null, execute);
}
else {
	execute();
}

})();

