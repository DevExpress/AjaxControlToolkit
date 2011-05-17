$type = Sys.ApplicationLoadEventArgs = function ApplicationLoadEventArgs(components, isPartialLoad) {
    /// <summary locid="M:J#Sys.ApplicationLoadEventArgs.#ctor"></summary>
    /// <param name="components" type="Array" elementType="Sys.Component">The list of components that were created since the last time the load event was raised.</param>
    /// <param name="isPartialLoad" type="Boolean">True if the page is partially loading.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "components", type: Array, elementType: Sys.Component},
        {name: "isPartialLoad", type: Boolean}
    ]);
    if (e) throw e;
    //#endif
    Sys.ApplicationLoadEventArgs.initializeBase(this);
    this._components = components;
    this._isPartialLoad = isPartialLoad;
}
$type.prototype = {
    get_components: function ApplicationLoadEventArgs$get_components() {
        /// <value type="Array" elementType="Sys.Component" locid="P:J#Sys.ApplicationLoadEventArgs.components">The list of components that were created since the last time the load event was raised.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._components;
    },
    get_isPartialLoad: function ApplicationLoadEventArgs$get_isPartialLoad() {
        /// <value type="Boolean" locid="P:J#Sys.ApplicationLoadEventArgs.isPartialLoad">True if the page is partially loading.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._isPartialLoad;
    }
}
$type.registerClass('Sys.ApplicationLoadEventArgs', Sys.EventArgs);
