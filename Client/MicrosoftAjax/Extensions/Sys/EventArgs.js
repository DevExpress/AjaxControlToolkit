$type = Sys.EventArgs = function EventArgs() {
    /// <summary locid="M:J#Sys.EventArgs.#ctor">EventArgs is the base class for classes containing event data.</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
}
$type.registerClass('Sys.EventArgs');

Sys.EventArgs.Empty = new Sys.EventArgs();
