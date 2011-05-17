$type = Sys.Data.OpenDataActionResult = function Data$OpenDataActionResult(result, httpHeaders, actionContext, operation) {
    /// <summary locid="M:J#Sys.Data.OpenDataActionResult.#ctor"></summary>
    /// <param name="result" mayBeNull="true">The result of the operation, or null if there was no result.</param>
    /// <param name="httpHeaders" mayBeNull="true">HTTP Headers.</param>
    /// <param name="actionContext" mayBeNull="true">A context associated with this operation.</param>
    /// <param name="operation" type="String">The operation that was performed.</param>
    this._result = result;
    this._headers = httpHeaders || {};
    this._actionContext = actionContext;
    this._operation = operation;
}
$type.prototype = {
    _actionContext: null,
    _operation: null,
    _result: null,
    _headers: null,
    get_httpHeaders: function OpenDataActionResult$get_httpHeaders() {
        /// <value type="Object" locid="P:J#Sys.Data.OpenDataActionResult.httpHeaders">A dictionary of HTTP headers associated with the entry for this action in a batch response.</value>
        return this._headers;
    },
    get_actionContext: function OpenDataActionResult$get_actionContext() {
        /// <value mayBeNull="true" locid="P:J#Sys.Data.OpenDataActionResult.actionContext">A context associated with this operation.</value>
        return this._actionContext;
    },
    get_operation: function OpenDataActionResult$get_operation() {
        /// <value type="String" locid="P:J#Sys.Data.OpenDataActionResult.operation">The operation that was performed.</value>
        return this._operation;
    },
    get_result: function OpenDataActionResult$get_result() {
        /// <value type="Object" mayBeNull="true" locid="P:J#Sys.Data.OpenDataActionResult.result">The result of the operation, or null if there was no result.</value>
        return this._result;
    }
}
$type.registerClass("Sys.Data.OpenDataActionResult");
