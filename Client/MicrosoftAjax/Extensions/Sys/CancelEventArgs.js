$type = Sys.CancelEventArgs = function CancelEventArgs() {
    /// <summary locid="M:J#Sys.CancelEventArgs.#ctor">CancelEventArgs is the base class for classes containing event data, which can be used to cancel the event.</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    Sys.CancelEventArgs.initializeBase(this);

    this._cancel = false;
}
$type.prototype = {
    get_cancel: function CancelEventArgs$get_cancel() {
        /// <value type="Boolean" locid="P:J#Sys.CancelEventArgs.cancel"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._cancel;
    },
    set_cancel: function CancelEventArgs$set_cancel(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: Boolean}]);
        if (e) throw e;
        //#endif
        this._cancel = value;
    }
}
$type.registerClass('Sys.CancelEventArgs', Sys.EventArgs);
