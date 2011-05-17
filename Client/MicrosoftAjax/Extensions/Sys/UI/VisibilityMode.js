$type = Sys.UI.VisibilityMode = function VisibilityMode() {
    /// <summary locid="M:J#Sys.UI.VisibilityMode.#ctor">Describes how a DOM element should disappear when its visible property is set to false.</summary>
    /// <field name="hide" type="Number" integer="true" static="true" locid="F:J#Sys.UI.VisibilityMode.hide">The element disappears but its space remains</field>
    /// <field name="collapse" type="Number" integer="true" static="true" locid="F:J#Sys.UI.VisibilityMode.collapse">The element disappears and the space it occupied is collapsed.</field>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    //#if DEBUG
    throw Error.notImplemented();
    //#endif
}
$type.prototype = {
    hide: 0,
    collapse: 1
}
$type.registerEnum("Sys.UI.VisibilityMode");

