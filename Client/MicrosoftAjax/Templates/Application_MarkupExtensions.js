$type = Sys.Application;
$type.registerMarkupExtension = function Application$registerMarkupExtension(extensionName, extension, isExpression) {
    /// <summary locid="M:J#Sys.Application.registerMarkupExtension">Registers a callback for processing of a markup extension.</summary>
    /// <param name="extensionName" type="String">The name of the extension.</param>
    /// <param name="extension" type="Function">The callback called while processing the extension in templtae markup.</param>
    /// <param name="isExpression" type="Boolean" optional="true">Specifies whether the extension executes a statement or provides a value.</param>
    if (!this._extensions) {
        this._extensions = {};
    }
    isExpression = ((typeof (isExpression) === "undefined") || (isExpression === true));
    this._extensions[extensionName] = { expression: isExpression, extension: extension };
}
$type._getMarkupExtension = function Application$_getMarkupExtension(name) {
    var extension = this._extensions ? this._extensions[name] : null;
    if (!extension) {
        throw Error.invalidOperation(String.format(Sys.UI.TemplatesRes.cannotFindMarkupExtension, name));
    }
    return extension;
}
