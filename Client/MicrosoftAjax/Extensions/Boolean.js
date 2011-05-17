$type = Boolean;
$type.__typeName = 'Boolean';
$type.__class = true;

$type.parse = function Boolean$parse(value) {
    /// <summary locid="M:J#Boolean.parse">Creates a bool from its string representation.</summary>
    /// <param name="value" type="String">"true" or "false".</param>
    /// <returns type="Boolean"></returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "value", type: String}
    ], false);
    if (e) throw e;
    //#endif
    var v = value.trim().toLowerCase(),
        r;
    if (v === 'false') {
        r = false;
    }
    else if (v === 'true') {
        r = true;
    }
    //#if DEBUG
    else {
        throw Error.argumentOutOfRange('value', value, Sys.Res.boolTrueOrFalse);
    }
    //#endif
    return r;
}
