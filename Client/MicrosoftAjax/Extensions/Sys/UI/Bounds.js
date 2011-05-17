$type = Sys.UI.Bounds = function Bounds(x, y, width, height) {
    /// <summary locid="M:J#Sys.UI.Bounds.#ctor"></summary>
    /// <param name="x" type="Number" integer="true"></param>
    /// <param name="y" type="Number" integer="true"></param>
    /// <param name="width" type="Number" integer="true"></param>
    /// <param name="height" type="Number" integer="true"></param>
    /// <field name="x" type="Number" integer="true" locid="F:J#Sys.UI.Bounds.x"></field>
    /// <field name="y" type="Number" integer="true" locid="F:J#Sys.UI.Bounds.y"></field>
    /// <field name="width" type="Number" integer="true" locid="F:J#Sys.UI.Bounds.width"></field>
    /// <field name="height" type="Number" integer="true" locid="F:J#Sys.UI.Bounds.height"></field>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "x", type: Number, integer: true},
        {name: "y", type: Number, integer: true},
        {name: "width", type: Number, integer: true},
        {name: "height", type: Number, integer: true}
    ]);
    if (e) throw e;
    //#endif
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
}
$type.registerClass('Sys.UI.Bounds');
