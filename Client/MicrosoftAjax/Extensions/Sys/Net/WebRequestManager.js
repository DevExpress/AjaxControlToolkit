$type = Sys.Net._WebRequestManager = function _WebRequestManager() {
    /// <summary locid="P:J#Sys.Net.WebRequestManager.#ctor"></summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    this._defaultExecutorType = "Sys.Net.XMLHttpExecutor";
}

$type.prototype = {
    add_invokingRequest: function _WebRequestManager$add_invokingRequest(handler) {
        /// <summary locid="E:J#Sys.Net.WebRequestManager.invokingRequest"></summary>
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        Sys.Observer.addEventHandler(this, "invokingRequest", handler);
    },
    remove_invokingRequest: function _WebRequestManager$remove_invokingRequest(handler) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        Sys.Observer.removeEventHandler(this, "invokingRequest", handler);
    },

    add_completedRequest: function _WebRequestManager$add_completedRequest(handler) {
        /// <summary locid="E:J#Sys.Net.WebRequestManager.completedRequest"></summary>
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        Sys.Observer.addEventHandler(this, "completedRequest", handler);
    },
    remove_completedRequest: function _WebRequestManager$remove_completedRequest(handler) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
        if (e) throw e;
        //#endif
        Sys.Observer.removeEventHandler(this, "completedRequest", handler);
    },
    get_defaultTimeout: function _WebRequestManager$get_defaultTimeout() {
        /// <value type="Number" locid="P:J#Sys.Net.WebRequestManager.defaultTimeout">The default timeout for requests in milliseconds.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._defaultTimeout || 0;
    },
    set_defaultTimeout: function _WebRequestManager$set_defaultTimeout(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: Number}]);
        if (e) throw e;
        //#endif
        //#if DEBUG
        if (value < 0) {
            throw Error.argumentOutOfRange("value", value, Sys.Res.invalidTimeout);
        }
        //#endif

        this._defaultTimeout = value;
    },

    get_defaultExecutorType: function _WebRequestManager$get_defaultExecutorType() {
        /// <value type="String" locid="P:J#Sys.Net.WebRequestManager.defaultExecutorType">The default executor type name.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._defaultExecutorType;
    },
    set_defaultExecutorType: function _WebRequestManager$set_defaultExecutorType(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        //#endif
        this._defaultExecutorType = value;
    },

    executeRequest: function _WebRequestManager$executeRequest(webRequest) {
        /// <summary locid="M:J#Sys.Net.WebRequestManager.executeRequest">Executes a request.</summary>
        /// <param name="webRequest" type="Sys.Net.WebRequest">The webRequest to execute.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "webRequest", type: Sys.Net.WebRequest}
        ]);
        if (e) throw e;
        //#endif
        var executor = webRequest.get_executor();
        // if the request didn't set an executor, use the request manager default executor
        if (!executor) {
            var er, failed;
            try {
                var executorType = window.eval(this._defaultExecutorType);
                executor = new executorType();
            }
            catch (er) {
                failed = true;
            }

            //#if DEBUG
            if (failed  || !Sys.Net.WebRequestExecutor.isInstanceOfType(executor) || !executor) {
                throw Error.argument("defaultExecutorType", String.format(Sys.Res.invalidExecutorType, this._defaultExecutorType));
            }
            //#endif

            webRequest.set_executor(executor);
        }

        // skip the request if it has been aborted;
        if (!executor.get_aborted()) {
            var evArgs = new Sys.Net.NetworkRequestEventArgs(webRequest);
            Sys.Observer.raiseEvent(this, "invokingRequest", evArgs);
            if (!evArgs.get_cancel()) {
                executor.executeRequest();
            }
        }
    }
}

$type.registerClass('Sys.Net._WebRequestManager');

// Create a single instance of the class
Sys.Net.WebRequestManager = new Sys.Net._WebRequestManager();
