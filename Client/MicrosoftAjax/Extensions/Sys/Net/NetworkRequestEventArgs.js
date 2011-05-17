$type = Sys.Net.NetworkRequestEventArgs = function NetworkRequestEventArgs(webRequest) {
    /// <summary locid="M:J#Sys.Net.NetworkRequestEventArgs.#ctor">This class is raised by the WebRequestManager when a WebRequest is about to be executed.</summary>
    /// <param name="webRequest" type="Sys.Net.WebRequest">The identifier for the event.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "webRequest", type: Sys.Net.WebRequest}
    ]);
    if (e) throw e;
    //#endif
    Sys.Net.NetworkRequestEventArgs.initializeBase(this);
    this._webRequest = webRequest;
}

$type.prototype = {
    get_webRequest: function NetworkRequestEventArgs$get_webRequest() {
        /// <value type="Sys.Net.WebRequest" locid="P:J#Sys.Net.NetworkRequestEventArgs.webRequest">The request about to be executed.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._webRequest;
    }
}

$type.registerClass('Sys.Net.NetworkRequestEventArgs', Sys.CancelEventArgs);
