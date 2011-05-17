$type = Sys.WebForms.EndRequestEventArgs = function EndRequestEventArgs(error, dataItems, response) {
    /// <summary locid="M:J#Sys.WebForms.EndRequestEventArgs.#ctor">The arguments for the PageRequestManager's endRequest event. The endRequest event is raised when a response has finished processing.</summary>
    /// <param name="error" type="Error" mayBeNull="true"></param>
    /// <param name="dataItems" type="Object" mayBeNull="true"></param>
    /// <param name="response" type="Sys.Net.WebRequestExecutor"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "error", type: Error, mayBeNull: true},
        {name: "dataItems", type: Object, mayBeNull: true},
        {name: "response", type: Sys.Net.WebRequestExecutor}
    ]);
    if (e) throw e;
    //#endif

    Sys.WebForms.EndRequestEventArgs.initializeBase(this);
    this._errorHandled = false;
    this._error = error;
    // Need to use "new Object()" instead of "{}", since the latter breaks code coverage.
    this._dataItems = dataItems || new Object();
    this._response = response;
}

$type.prototype = {
    get_dataItems: function EndRequestEventArgs$get_dataItems() {
        /// <value type="Object" locid="P:J#Sys.WebForms.EndRequestEventArgs.dataItems"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._dataItems;
    },

    get_error: function EndRequestEventArgs$get_error() {
        /// <value type="Error" locid="P:J#Sys.WebForms.EndRequestEventArgs.error"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._error;
    },

    get_errorHandled: function EndRequestEventArgs$get_errorHandled() {
        /// <value type="Boolean" locid="P:J#Sys.WebForms.EndRequestEventArgs.errorHandled"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._errorHandled;
    },
    set_errorHandled: function EndRequestEventArgs$set_errorHandled(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: Boolean}]);
        if (e) throw e;
        //#endif
        this._errorHandled = value;
    },

    get_response: function EndRequestEventArgs$get_response() {
        /// <value type="Sys.Net.WebRequestExecutor" locid="P:J#Sys.WebForms.EndRequestEventArgs.response"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._response;
    }
}

$type.registerClass('Sys.WebForms.EndRequestEventArgs', Sys.EventArgs);
