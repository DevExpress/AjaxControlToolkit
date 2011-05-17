$type = Sys.UI.Point = function Point(x, y) {
    /// <summary locid="M:J#Sys.UI.Point.#ctor"></summary>
    /// <param name="x" type="Number" integer="true"></param>
    /// <param name="y" type="Number" integer="true"></param>
    /// <field name="x" type="Number" integer="true" locid="F:J#Sys.UI.Point.x"></field>
    /// <field name="y" type="Number" integer="true" locid="F:J#Sys.UI.Point.y"></field>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "x", type: Number, integer: true},
        {name: "y", type: Number, integer: true}
    ]);
    if (e) throw e;
    //#endif
    this.x = x;
    this.y = y;
}
$type.registerClass('Sys.UI.Point');
