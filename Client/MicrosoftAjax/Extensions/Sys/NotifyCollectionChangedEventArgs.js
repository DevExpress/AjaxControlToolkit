$type = Sys.NotifyCollectionChangedEventArgs = function NotifyCollectionChangedEventArgs(changes) {
    /// <summary locid="M:J#Sys.NotifyCollectionChangedEventArgs.#ctor">Describes how the collection was changed.</summary>
    /// <param name="changes" type="Array" elementType="Sys.CollectionChange">A list of changes that were performed on the collection since the last event.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "changes", type: Array, elementType: Sys.CollectionChange}
    ]);
    if (e) throw e;
    //#endif
    this._changes = changes;
    Sys.NotifyCollectionChangedEventArgs.initializeBase(this);
}
$type.prototype = {
    get_changes: function NotifyCollectionChangedEventArgs$get_changes() {
        /// <value type="Array" elementType="Sys.CollectionChange" locid="P:J#Sys.NotifyCollectionChangedEventArgs.changes"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._changes || [];
    }
}
$type.registerClass("Sys.NotifyCollectionChangedEventArgs", Sys.EventArgs);

