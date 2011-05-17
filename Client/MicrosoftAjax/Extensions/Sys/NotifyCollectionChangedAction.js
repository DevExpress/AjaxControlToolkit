$type = Sys.NotifyCollectionChangedAction = function NotifyCollectionChangedAction() {
    /// <summary locid="M:J#Sys.NotifyCollectionChangedAction.#ctor">Describes how a collection has changed.</summary>
    /// <field name="add" type="Number" integer="true" static="true" locid="F:J#Sys.NotifyCollectionChangedAction.add"></field>
    /// <field name="remove" type="Number" integer="true" static="true" locid="F:J#Sys.NotifyCollectionChangedAction.remove"></field>
    /// <field name="reset" type="Number" integer="true" static="true" locid="F:J#Sys.NotifyCollectionChangedAction.reset"></field>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    //#if DEBUG
    throw Error.notImplemented();
    //#endif
}
$type.prototype = {
    add: 0,
    remove: 1,
    reset: 2
}
$type.registerEnum('Sys.NotifyCollectionChangedAction');
