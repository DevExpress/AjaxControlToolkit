$type = Object;
$type.__typeName = 'Object';
$type.__class = true;

$type.getType = function Object$getType(instance) {
    /// <summary locid="M:J#Object.getType"></summary>
    /// <param name="instance">The object for which the type must be returned.</param>
    /// <returns type="Type">The type of the object.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "instance"}
    ]);
    if (e) throw e;
    //#endif
    var ctor = instance.constructor;
    if (!ctor || (typeof(ctor) !== "function") || !ctor.__typeName || (ctor.__typeName === 'Object')) {
        return Object;
    }
    return ctor;
}

$type.getTypeName = function Object$getTypeName(instance) {
    /// <summary locid="M:J#Object.getTypeName"></summary>
    /// <param name="instance">The object for which the type name must be returned.</param>
    /// <returns type="String">The name of the type of the object.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "instance"}
    ]);
    if (e) throw e;
    //#endif
    return Object.getType(instance).getName();
}
