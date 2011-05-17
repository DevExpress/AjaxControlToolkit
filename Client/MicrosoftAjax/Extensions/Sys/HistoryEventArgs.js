$type = Sys.HistoryEventArgs = function HistoryEventArgs(state) {
    /// <summary locid="M:J#Sys.HistoryEventArgs.#ctor"></summary>
    /// <param name="state" type="Object"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "state", type: Object}
    ]);
    if (e) throw e;
    //#endif
    Sys.HistoryEventArgs.initializeBase(this);
    this._state = state;
}
$type.prototype = {
    get_state: function HistoryEventArgs$get_state() {
        /// <value type="Object" locid="P:J#Sys.HistoryEventArgs.state"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._state;
    }
}
$type.registerClass('Sys.HistoryEventArgs', Sys.EventArgs);
