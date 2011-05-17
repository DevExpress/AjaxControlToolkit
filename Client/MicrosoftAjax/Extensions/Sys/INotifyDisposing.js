$type = Sys.INotifyDisposing = function INotifyDisposing() {
    /// <summary locid="M:J#Sys.INotifyDisposing.#ctor">Implement this interface if the class exposes an event to notify when it's disposing.</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    //#if DEBUG
    throw Error.notImplemented();
    //#endif
}
//#if DEBUG
$type.prototype = {
    add_disposing: function INotifyDisposing$add_disposing(handler) {
    /// <summary locid="E:J#Sys.INotifyDisposing.disposing"></summary>
    //#if DEBUG
    var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
    if (e) throw e;
    //#endif
        throw Error.notImplemented();
    },
    remove_disposing: function INotifyDisposing$remove_disposing(handler) {
    //#if DEBUG
    var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
    if (e) throw e;
    //#endif
        throw Error.notImplemented();
    }
}
//#endif
$type.registerInterface("Sys.INotifyDisposing");
