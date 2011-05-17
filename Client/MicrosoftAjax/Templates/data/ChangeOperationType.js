$type = Sys.Data.ChangeOperationType = function Data$ChangeOperationType() {
    /// <summary locid="M:J#Sys.Data.ChangeOperationType.#ctor">Describes how an item has changed.</summary>
    /// <field name="insert" type="Number" integer="true" static="true" locid="F:J#Sys.Data.ChangeOperationType.insert"></field>
    /// <field name="update" type="Number" integer="true" static="true" locid="F:J#Sys.Data.ChangeOperationType.update"></field>
    /// <field name="remove" type="Number" integer="true" static="true" locid="F:J#Sys.Data.ChangeOperationType.remove"></field>
    //#if DEBUG
    throw Error.notImplemented();
    //#endif
}
$type.prototype = {
    insert: 0,
    update: 1,
    remove: 2
}
$type.registerEnum("Sys.Data.ChangeOperationType");
