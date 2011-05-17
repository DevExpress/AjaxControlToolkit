$type = Sys.Net.WebRequest = function WebRequest() {
    /// <summary locid="M:J#Sys.Net.WebRequest.#ctor">WebRequest class</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    this._url = "";
    this._headers = { };
    this._body = null;
    this._userContext = null;
    this._httpVerb = null;
}

// Properties about the request data
$type.prototype = {
    add_completed: function WebRequest$add_completed(handler) {
        /// <summary locid="E:J#Sys.Net.WebRequest.completed"></summary>
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        Sys.Observer.addEventHandler(this, "completed", handler);
    },
    remove_completed: function WebRequest$remove_completed(handler) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        Sys.Observer.removeEventHandler(this, "completed", handler);
    },

    completed: function WebRequest$completed(eventArgs) {
        /// <summary locid="M:J#Sys.Net.WebRequest.completed">The completed method should be called when the request is completed.</summary>
        /// <param name="eventArgs" type="Sys.EventArgs">The event args to raise the event with.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "eventArgs", type: Sys.EventArgs}
        ]);
        if (e) throw e;
        //#endif
        // call completed handler manually because the sender is not 'this'
        function raise(source, sender, eventName) {
            var handler = Sys.Observer._getContext(source, true).events.getHandler(eventName);
            if (handler) {
                handler(sender, eventArgs);
            }
        }
        raise(Sys.Net.WebRequestManager, this._executor, "completedRequest");
        raise(this, this._executor, "completed");
        Sys.Observer.clearEventHandlers(this, "completed");
    },

    get_url: function WebRequest$get_url() {
        /// <value type="String" locid="P:J#Sys.Net.WebRequest.url">The url.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._url;
    },
    set_url: function WebRequest$set_url(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        //#endif
        this._url = value;
    },

    get_headers: function WebRequest$get_headers() {
        /// <value locid="P:J#Sys.Net.WebRequest.headers">The headers dictionary for the request.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._headers;
    },

    get_httpVerb: function WebRequest$get_httpVerb() {
        /// <value type="String" locid="P:J#Sys.Net.WebRequest.httpVerb">The httpVerb for the request.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        // Default is GET if no body, and POST otherwise
        if (this._httpVerb === null) {
            if (this._body === null) {
                return "GET";
            }
            return "POST";
        }
        return this._httpVerb;
    },
    set_httpVerb: function WebRequest$set_httpVerb(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        if (value.length === 0) {
            throw Error.argument('value', Sys.Res.invalidHttpVerb);
        }
        //#endif
        this._httpVerb = value;
    },

    get_body: function WebRequest$get_body() {
        /// <value mayBeNull="true" locid="P:J#Sys.Net.WebRequest.body">The body of the request.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._body;
    },
    set_body: function WebRequest$set_body(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", mayBeNull: true}]);
        if (e) throw e;
        //#endif
        this._body = value;
    },

    get_userContext: function WebRequest$get_userContext() {
        /// <value mayBeNull="true" locid="P:J#Sys.Net.WebRequest.userContext">The userContext of the request.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._userContext;
    },
    set_userContext: function WebRequest$set_userContext(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", mayBeNull: true}]);
        if (e) throw e;
        //#endif
        this._userContext = value;
    },

    get_executor: function WebRequest$get_executor() {
        /// <value type="Sys.Net.WebRequestExecutor" locid="P:J#Sys.Net.WebRequest.executor">The executor for the request.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._executor || null;
    },
    set_executor: function WebRequest$set_executor(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: Sys.Net.WebRequestExecutor}]);
        if (e) throw e;
        if (this._executor && this._executor.get_started()) {
            throw Error.invalidOperation(Sys.Res.setExecutorAfterActive);
        }
        //#endif
        this._executor = value;
        value._set_webRequest(this);
    },

    get_timeout: function WebRequest$get_timeout() {
        /// <value type="Number" locid="P:J#Sys.Net.WebRequest.timeout">The timeout in milliseconds for the request.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._timeout || Sys.Net.WebRequestManager.get_defaultTimeout();
    },
    set_timeout: function WebRequest$set_timeout(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: Number}]);
        if (e) throw e;
        if (value < 0) {
            throw Error.argumentOutOfRange("value", value, Sys.Res.invalidTimeout);
        }
        //#endif
        this._timeout = value;
    },

    getResolvedUrl: function WebRequest$getResolvedUrl() {
        /// <summary locid="M:J#raise">The getResolvedUrl method returns the url resolved against the base url of the page if set.</summary>
        /// <returns type="String">The resolved url for the request.</returns>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return Sys.Net.WebRequest._resolveUrl(this._url);
    },

    invoke: function WebRequest$invoke() {
        /// <summary locid="M:J#raise">Invokes the request</summary>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        if (this._invokeCalled) {
            throw Error.invalidOperation(Sys.Res.invokeCalledTwice);
        }
        //#endif
        Sys.Net.WebRequestManager.executeRequest(this);
        //#if DEBUG
        this._invokeCalled = true;
        //#endif
    }
}

// Given a url and an optional base url, return an absolute url combining the url and base url
$type._resolveUrl = function WebRequest$_resolveUrl(url, baseUrl) {
    // If the url contains a host, we are done
    if (url && url.indexOf('://') > 0) {
        return url;
    }

    // If a base url isn't passed in, we use either the base element if specified or the URL from the browser
    if (!baseUrl || !baseUrl.length) {
        var baseElement = Sys.get('base');
        if (baseElement && baseElement.href && baseElement.href.length) {
            baseUrl = baseElement.href;
        }
        else {
            baseUrl = document.URL;
        }
    }

    // strip off any querystrings
    var qsStart = baseUrl.indexOf('?');
    if (qsStart > 0) {
        baseUrl = baseUrl.substr(0, qsStart);
    }
    // and hashes
    qsStart = baseUrl.indexOf('#');
    if (qsStart > 0) {
        baseUrl = baseUrl.substr(0, qsStart);
    }
    baseUrl = baseUrl.substr(0, baseUrl.lastIndexOf('/') + 1);

    // If a url wasn't specified, we just use the base
    if (!url || !url.length) {
        return baseUrl;
    }

    // For absolute path url, we need to rebase it against the base url, stripping off everything after the http://host
    if (url.charAt(0) === '/') {
        var slashslash = baseUrl.indexOf('://');
        //#if DEBUG
        if (slashslash === -1) {
            throw Error.argument("baseUrl", Sys.Res.badBaseUrl1);
        }
        //#endif

        var nextSlash = baseUrl.indexOf('/', slashslash + 3);
        //#if DEBUG
        if (nextSlash === -1) {
            throw Error.argument("baseUrl", Sys.Res.badBaseUrl2);
        }
        //#endif

        return baseUrl.substr(0, nextSlash) + url;
    }
    // Otherwise for relative urls we just combine with the base url stripping off the last path component (filename typically)
    // Note the app path always contains a trailing slash so when resolving app paths, we never strip off anything important
    else {
        var lastSlash = baseUrl.lastIndexOf('/');
        //#if DEBUG
        if (lastSlash === -1) {
            throw Error.argument("baseUrl", Sys.Res.badBaseUrl3);
        }
        //#endif

        return baseUrl.substr(0, lastSlash+1) + url;
    }
}

$type._createQueryString = function WebRequest$_createQueryString(queryString, encodeMethod, addParams) {
    // By default, use URI encoding
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

$type._createUrl = function WebRequest$_createUrl(url, queryString, addParams) {
    if (!queryString && !addParams) {
        return url;
    }
    var qs = Sys.Net.WebRequest._createQueryString(queryString, null, addParams);
    return qs.length
        ? url + ((url && url.indexOf('?') >= 0) ? "&" : "?") + qs
        : url;
}

$type.registerClass('Sys.Net.WebRequest');
