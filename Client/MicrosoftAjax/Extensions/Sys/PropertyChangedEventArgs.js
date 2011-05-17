$type = Sys.PropertyChangedEventArgs = function PropertyChangedEventArgs(propertyName) {
    /// <summary locid="M:J#Sys.PropertyChangedEventArgs.#ctor">Describes property changes.</summary>
    /// <param name="propertyName" type="String">The name of the property that changed.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "propertyName", type: String}
    ]);
    if (e) throw e;
    //#endif
    Sys.PropertyChangedEventArgs.initializeBase(this);
    this._propertyName = propertyName;
}
 $type.prototype = {
    get_propertyName: function PropertyChangedEventArgs$get_propertyName() {
        /// <value type="String" locid="P:J#Sys.PropertyChangedEventArgs.propertyName">The name of the property that changed.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._propertyName;
    }
}
$type.registerClass('Sys.PropertyChangedEventArgs', Sys.EventArgs);
