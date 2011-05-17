// Class returned to client if server throws an exception during ProcessRequest
$type = Sys.Net.WebServiceError = function WebServiceError(timedOut, message, stackTrace, exceptionType, errorObject) {
    /// <summary locid="M:J#Sys.Net.WebServiceError.#ctor">Represents a webservice error</summary>
    /// <param name="timedOut" type="Boolean">Whether the service timed out.</param>
    /// <param name="message" type="String" mayBeNull="true">The error message.</param>
    /// <param name="stackTrace" type="String" mayBeNull="true" optional="true">The stack trace of the error.</param>
    /// <param name="exceptionType" type="String" mayBeNull="true" optional="true">The server exception type.</param>
    /// <param name="errorObject" type="Object" mayBeNull="true" optional="true">The raw error information.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "timedOut", type: Boolean},
        {name: "message", type: String, mayBeNull: true},
        {name: "stackTrace", type: String, mayBeNull: true, optional: true},
        {name: "exceptionType", type: String, mayBeNull: true, optional: true},
        {name: "errorObject", type: Object, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
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
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._timedOut;
    },

    get_statusCode: function WebServiceError$get_statusCode() {
        /// <value type="Number" locid="P:J#Sys.Net.WebServiceError.statusCode">Int representing the status of the response.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._statusCode;
    },

    get_message: function WebServiceError$get_message() {
        /// <value type="String" locid="P:J#Sys.Net.WebServiceError.message">Error message</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._message;
    },

    get_stackTrace: function WebServiceError$get_stackTrace() {
        /// <value type="String" locid="P:J#Sys.Net.WebServiceError.stackTrace">Stack trace of the error.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._stackTrace || "";
    },

    get_exceptionType: function WebServiceError$get_exceptionType() {
        /// <value type="String" locid="P:J#Sys.Net.WebServiceError.exceptionType">Exception type of the error.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._exceptionType || "";
    },
    
    get_errorObject: function WebServiceError$get_errorObject() {
        /// <value type="Object" locid="P:J#Sys.Net.WebServiceError.errorObject">The raw error object returned by the service.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._errorObject || null;
    }
}
$type.registerClass('Sys.Net.WebServiceError');
