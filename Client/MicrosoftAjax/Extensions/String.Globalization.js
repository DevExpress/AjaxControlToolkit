String.localeFormat = function String$localeFormat(format, args) {
    /// <summary locid="M:J#String.localeFormat">Replaces the format items in a specified String with the text equivalents of the values of   corresponding object instances. The current culture will be used to format dates and numbers.</summary>
    /// <param name="format" type="String">A format string.</param>
    /// <param name="args" parameterArray="true" mayBeNull="true">The objects to format.</param>
    /// <returns type="String">A copy of format in which the format items have been replaced by the   string equivalent of the corresponding instances of object arguments.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "format", type: String},
        {name: "args", mayBeNull: true, parameterArray: true}
    ]);
    if (e) throw e;
    //#endif
    return String._toFormattedString(true, arguments);
}
