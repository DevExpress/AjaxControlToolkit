$type = Sys.INotifyPropertyChange = function INotifyPropertyChange() {
    /// <summary locid="M:J#Sys.INotifyPropertyChange.#ctor">Implement this interface to become a provider of property change notifications.</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    //#if DEBUG
    throw Error.notImplemented();
    //#endif
}
//#if DEBUG
$type.prototype = {
    add_propertyChanged: function INotifyPropertyChange$add_propertyChanged(handler) {
    /// <summary locid="E:J#Sys.INotifyPropertyChange.propertyChanged"></summary>
    //#if DEBUG
    var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
    if (e) throw e;
    //#endif
        throw Error.notImplemented();
    },
    remove_propertyChanged: function INotifyPropertyChange$remove_propertyChanged(handler) {
    //#if DEBUG
    var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
    if (e) throw e;
    //#endif
        throw Error.notImplemented();
    }
}
//#endif
$type.registerInterface('Sys.INotifyPropertyChange');
