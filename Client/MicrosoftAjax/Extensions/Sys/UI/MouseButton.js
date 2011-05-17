$type = Sys.UI.MouseButton = function MouseButton() {
    /// <summary locid="M:J#Sys.UI.MouseButton.#ctor">Describes mouse buttons. The values are those from the DOM standard, which are different from the IE values.</summary>
    /// <field name="leftButton" type="Number" integer="true" static="true" locid="F:J#Sys.UI.MouseButton.leftButton"></field>
    /// <field name="middleButton" type="Number" integer="true" static="true" locid="F:J#Sys.UI.MouseButton.middleButton"></field>
    /// <field name="rightButton" type="Number" integer="true" static="true" locid="F:J#Sys.UI.MouseButton.rightButton"></field>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    //#if DEBUG
    throw Error.notImplemented();
    //#endif
}
$type.prototype = {
    leftButton: 0,
    middleButton: 1,
    rightButton: 2
}
$type.registerEnum("Sys.UI.MouseButton");
