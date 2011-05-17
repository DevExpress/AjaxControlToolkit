$type = Sys.Net.WebRequestEventArgs = function WebRequestEventArgs(executor, error, result) {
    /// <summary locid="M:J#Sys.Net.WebRequestEventArgs.#ctor"></summary>
    /// <param name="executor" type="Sys.Net.WebRequestExecutor" mayBeNull="true"></param>
    /// <param name="error" type="Sys.Net.WebServiceError" optional="true" mayBeNull="true"></param>
    /// <param name="result" optional="true" mayBeNull="true"></param>
    this._executor = executor;
    this._error = error || null;
    this._result = typeof (result) === "undefined" ? null : result;
    Sys.Net.WebRequestEventArgs.initializeBase(this);
}
$type.prototype = {
    get_error: function WebRequestEventArgs$get_error() {
        /// <value type="Sys.Net.WebServiceError" mayBeNull="true" locid="P:J#Sys.Net.WebRequestEventArgs.error"></value>
        return this._error || null;
    },
    get_executor: function WebRequestEventArgs$get_executor() {
        /// <value type="Sys.Net.WebRequestExecutor" mayBeNull="true" locid="P:J#Sys.Net.WebRequestEventArgs.executor"></value>
        return this._executor;
    },
    get_result: function WebRequestEventArgs$get_result() {
        /// <value mayBeNull="true" locid="P:J#Sys.Net.WebRequestEventArgs.result"></value>
        return this._result;
    }
};
$type.registerClass("Sys.Net.WebRequestEventArgs", Sys.EventArgs);
