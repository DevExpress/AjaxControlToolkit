$type = Sys.Data.MergeOption = function Data$MergeOption() {
    /// <summary locid="M:J#Sys.Data.MergeOption.#ctor">Describes how an item has changed.</summary>
    /// <field name="appendOnly" type="Number" integer="true" static="true" locid="F:J#Sys.Data.MergeOption.appendOnly"></field>
    /// <field name="overwriteChanges" type="Number" integer="true" static="true" locid="F:J#Sys.Data.MergeOption.overwriteChanges"></field>
    //#if DEBUG
    throw Error.notImplemented();
    //#endif
}
$type.prototype = {
    appendOnly: 0,
    overwriteChanges: 1
    // ado.net .net client also has preserveChanges and noTracking
}
$type.registerEnum("Sys.Data.MergeOption");

