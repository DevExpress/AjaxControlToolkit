Sys.Net.XMLDOM = function XMLDOM(markup) {
    /// <summary locid="M:J#Sys.Net.XMLDOM.#ctor">Creates an XML document from an XML string.</summary>
    /// <param name="markup" type="String">The XML string to parse.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "markup", type: String}
    ]);
    if (e) throw e;
    //#endif
    if (!window.DOMParser) {
        // DevDiv Bugs 150054: Msxml2.DOMDocument (version independent ProgID) required for mobile IE
        var ex, progIDs = [ 'Msxml2.DOMDocument.3.0', 'Msxml2.DOMDocument' ];
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
        // Mozilla browsers have a DOMParser
        try {
            var domParser = new window.DOMParser();
            return domParser.parseFromString(markup, 'text/xml');
        }
        catch (ex) {
        }
    }
    return null;
}

$type = Sys.Net.XMLHttpExecutor = function XMLHttpExecutor() {
    /// <summary locid="M:J#Sys.Net.XMLHttpExecutor.#ctor">XMLHttpExecutor</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif

    Sys.Net.XMLHttpExecutor.initializeBase(this);

    var _this = this;

    // Parentheses added around closure methods to work around a preprocessor bug
    // (the preprocessor loses context in that situation and uses the last closure as the name of the current
    // function even when its end has been reached and another function has started.)
    // DevDiv 169493
    this._onReadyStateChange = (function () {
        /*
            readyState values:
            0 = uninitialized
            1 = loading
            2 = loaded
            3 = interactive
            4 = complete
        */
        if (_this._xmlHttpRequest.readyState === 4 /*complete*/) {
            // DevDiv 58581:
            // When a request is pending when the page is closed (navigated away, postback, etc)
            // in FF and Safari, the request is aborted just as if abort() was called on the 
            // xmlhttprequest object.
            // However, even aborted requests have a readyState of 4, which we treat as successful.
            // This happened for example if a regular postback occurred during a partial update request.
            // In FF if you access the 'status' field on an aborted request, an error is thrown,
            // so the error console displayed an error when this happened.
            // On Safari it isn't an error, but status is undefined. That caused PRM to get the completed
            // event, and since the status is not 200, it raises an error.
            // IE and Opera ignore pending requests, or their readyState isn't 4.
            try {
                if (typeof(_this._xmlHttpRequest.status) === "undefined") {
                    // its an aborted request in Safari, ignore it
                    return;
                }
            }
            catch(ex) {
                // its an aborted request in Firefox, ignore it
                return;
            }
            
            _this._clearTimer();
            _this._responseAvailable = true;
            //#if DEBUG
            //#else
            try {
            //#endif
                // DevDiv Bugs 148214: Use try/finally to ensure cleanup occurs even
                // if the completed callback causes an exception (such as with async
                // postbacks where a server-side exception occurred)
                _this._webRequest.completed(Sys.EventArgs.Empty);
            //#if DEBUG
            //#else
            }
            finally {
            //#endif
                if (_this._xmlHttpRequest) {
                    _this._xmlHttpRequest.onreadystatechange = Function.emptyMethod;
                    _this._xmlHttpRequest = null;
                }
            //#if DEBUG
            //#else
            }
            //#endif
        }
    });

    this._clearTimer = (function() {
        if (_this._timer) {
            window.clearTimeout(_this._timer);
            _this._timer = null;
        }
    });

    this._onTimeout = (function() {
        if (!_this._responseAvailable) {
            _this._clearTimer();
            _this._timedOut = true;
            var xhr = _this._xmlHttpRequest;
            xhr.onreadystatechange = Function.emptyMethod;
            xhr.abort();
            _this._webRequest.completed(Sys.EventArgs.Empty);
            _this._xmlHttpRequest = null;
        }
    });

}

$type.prototype = {

    get_timedOut: function XMLHttpExecutor$get_timedOut() {
        /// <value type="Boolean" locid="P:J#Sys.Net.XMLHttpExecutor.timedOut">True if the executor has timed out.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return !!this._timedOut;
    },

    get_started: function XMLHttpExecutor$get_started() {
        /// <value type="Boolean" locid="P:J#Sys.Net.XMLHttpExecutor.started">True if the executor has started.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return !!this._started;
    },

    get_responseAvailable: function XMLHttpExecutor$get_responseAvailable() {
        /// <value type="Boolean" locid="P:J#Sys.Net.XMLHttpExecutor.responseAvailable">True if a response is available.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return !!this._responseAvailable;
    },

    get_aborted: function XMLHttpExecutor$get_aborted() {
        /// <value type="Boolean" locid="P:J#Sys.Net.XMLHttpExecutor.aborted">True if the executor has been aborted.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return !!this._aborted;
    },

    executeRequest: function XMLHttpExecutor$executeRequest() {
        /// <summary locid="M:J#Sys.Net.XMLHttpExecutor.executeRequest">Invokes the request.</summary>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        var request = this.get_webRequest();
        this._webRequest = request;

        //#if DEBUG
        if (this._started) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOnceStarted, 'executeRequest'));
        }
        if (!this._webRequest) {
            throw Error.invalidOperation(Sys.Res.nullWebRequest);
        }
        //#endif

        var body = request.get_body();
        var headers = request.get_headers();
        var xhr = new XMLHttpRequest();
        this._xmlHttpRequest = xhr;
        xhr.onreadystatechange = this._onReadyStateChange;
        var verb = request.get_httpVerb();
        xhr.open(verb, request.getResolvedUrl(), true /*async*/);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        if (headers) {
            for (var header in headers) {
                var val = headers[header];
                if (typeof(val) !== "function")
                    xhr.setRequestHeader(header, val);
            }
        }

        if (verb.toLowerCase() === "post") {
            // If it's a POST but no Content-Type was specified, default to application/x-www-form-urlencoded; charset=utf-8
            if ((headers === null) || !headers['Content-Type']) {
                // DevDiv 109456: Include charset=utf-8. Javascript encoding methods always use utf-8, server may be set to assume other encoding.
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
            }

            // DevDiv 15893: If POST with no body, default to ""(FireFox needs this)
            if (!body) {
                body = "";
            }
        }

        var timeout = request.get_timeout();
        if (timeout > 0) {
            this._timer = window.setTimeout(Function.createDelegate(this, this._onTimeout), timeout);
        }
        xhr.send(body);
        this._started = true;
    },

    getResponseHeader: function XMLHttpExecutor$getResponseHeader(header) {
        /// <summary locid="M:J#Sys.Net.XMLHttpExecutor.getResponseHeader">Returns a response header.</summary>
        /// <param name="header" type="String">The requested header.</param>
        /// <returns type="String">The value of the header.</returns>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "header", type: String}
        ]);
        if (e) throw e;
        //#endif
        //#if DEBUG
        if (!this._responseAvailable) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'getResponseHeader'));
        }
        if (!this._xmlHttpRequest) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'getResponseHeader'));
        }
        //#endif

        var er, result;
        try {
            result = this._xmlHttpRequest.getResponseHeader(header);
        } catch (er) {
        }
        if (!result) result = "";
        return result;
    },

    getAllResponseHeaders: function XMLHttpExecutor$getAllResponseHeaders() {
        /// <summary locid="M:J#Sys.Net.XMLHttpExecutor.getAllResponseHeaders">Returns all the responses header.</summary>
        /// <returns type="String">The text of all the headers.</returns>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        //#if DEBUG
        if (!this._responseAvailable) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'getAllResponseHeaders'));
        }
        if (!this._xmlHttpRequest) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'getAllResponseHeaders'));
        }
        //#endif

        return this._xmlHttpRequest.getAllResponseHeaders();
    },

    get_responseData: function XMLHttpExecutor$get_responseData() {
        /// <value type="String" locid="P:J#Sys.Net.XMLHttpExecutor.responseData">The text of the response.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        //#if DEBUG
        if (!this._responseAvailable) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_responseData'));
        }
        if (!this._xmlHttpRequest) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_responseData'));
        }
        //#endif

        return this._xmlHttpRequest.responseText;
    },

    get_statusCode: function XMLHttpExecutor$get_statusCode() {
        /// <value type="Number" locid="P:J#Sys.Net.XMLHttpExecutor.statusCode">The status code of the response.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        //#if DEBUG
        if (!this._responseAvailable) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_statusCode'));
        }
        if (!this._xmlHttpRequest) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_statusCode'));
        }
        //#endif
        var ex, result = 0;
        try {
            result = this._xmlHttpRequest.status;
        }
        catch(ex) {
        }
        return result;
    },

    get_statusText: function XMLHttpExecutor$get_statusText() {
        /// <value type="String" locid="P:J#Sys.Net.XMLHttpExecutor.statusText">The status text of the repsonse.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        //#if DEBUG
        if (!this._responseAvailable) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_statusText'));
        }
        if (!this._xmlHttpRequest) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_statusText'));
        }
        //#endif

        return this._xmlHttpRequest.statusText;
    },

    get_xml: function XMLHttpExecutor$get_xml() {
        /// <value locid="P:J#Sys.Net.XMLHttpExecutor.xml">The response in xml format.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        //#if DEBUG
        if (!this._responseAvailable) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_xml'));
        }
        if (!this._xmlHttpRequest) {
            throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_xml'));
        }
        //#endif
        var xhr = this._xmlHttpRequest;
        var xml = xhr.responseXML;
        if (!xml || !xml.documentElement) {

            // This happens if the server doesn't set the content type to text/xml.
            xml = Sys.Net.XMLDOM(xhr.responseText);

            // If we still couldn't get an XML DOM, the data is probably not XML
            if (!xml || !xml.documentElement)
                return null;
        }
        else if (navigator.userAgent.indexOf('MSIE') !== -1) {
            xml.setProperty('SelectionLanguage', 'XPath');
        }

        // For Firefox parser errors have document elements of parser error
        if (xml.documentElement.namespaceURI === "http://www.mozilla.org/newlayout/xml/parsererror.xml" &&
            xml.documentElement.tagName === "parsererror") {
            return null;
        }
        
        // For Safari, parser errors are always the first child of the root
        if (xml.documentElement.firstChild && xml.documentElement.firstChild.tagName === "parsererror") {
            return null;
        }
        
        return xml;
    },

    abort: function XMLHttpExecutor$abort() {
        /// <summary locid="M:J#Sys.Net.XMLHttpExecutor.abort">Aborts the request.</summary>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        //#if DEBUG
        if (!this._started) {
            throw Error.invalidOperation(Sys.Res.cannotAbortBeforeStart);
        }
        //#endif

        // aborts are no ops if we are done, timedout, or aborted already
        if (this._aborted || this._responseAvailable || this._timedOut)
            return;

        this._aborted = true;

        this._clearTimer();
        var xhr = this._xmlHttpRequest;
        if (xhr && !this._responseAvailable) {

            // Remove the onreadystatechange first otherwise abort would trigger readyState to become 4
            xhr.onreadystatechange = Function.emptyMethod;
            xhr.abort();
            
            this._xmlHttpRequest = null;            

            // DevDiv 59229: Call completed on the request instead of raising the event directly
            this._webRequest.completed(Sys.EventArgs.Empty);
        }
    }
}
$type.registerClass('Sys.Net.XMLHttpExecutor', Sys.Net.WebRequestExecutor);
