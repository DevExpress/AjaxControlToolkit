$type = Sys.IDisposable = function IDisposable() {
    //#if DEBUG
    throw Error.notImplemented();
    //#endif
}
//#if DEBUG
$type.prototype = {
    dispose: function IDisposable$dispose() {
        throw Error.notImplemented();
    }
}
//#endif
$type.registerInterface('Sys.IDisposable');
