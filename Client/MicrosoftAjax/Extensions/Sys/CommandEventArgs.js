$type = Sys.CommandEventArgs = function CommandEventArgs(commandName, commandArgument, commandSource, commandEvent) {
    /// <summary locid="M:J#Sys.CommandEventArgs.#ctor"></summary>
    /// <param name="commandName" type="String">The command name.</param>
    /// <param name="commandArgument" mayBeNull="true">The command arguments.</param>
    /// <param name="commandSource" mayBeNull="true">The command source.</param>
    /// <param name="commandEvent" type="Sys.UI.DomEvent" mayBeNull="true" optional="true">The DOM event that caused the command, if any.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "commandName", type: String},
        {name: "commandArgument", mayBeNull: true},
        {name: "commandSource", mayBeNull: true},
        {name: "commandEvent", type: Sys.UI.DomEvent, mayBeNull: true, optional: true }
    ]);
    if (e) throw e;
    //#endif
    Sys.CommandEventArgs.initializeBase(this);
    this._commandName = commandName;
    this._commandArgument = commandArgument;
    this._commandSource = commandSource;
    this._commandEvent = commandEvent;
}
$type.prototype = {
    get_commandName: function CommandEventArgs$get_commandName() {
        /// <value type="String" locid="P:J#Sys.CommandEventArgs.commandName">The command name.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._commandName || null;
    },
    get_commandArgument: function CommandEventArgs$get_commandArgument() {
        /// <value mayBeNull="true" locid="P:J#Sys.CommandEventArgs.commandArgument">The command arguments.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._commandArgument;
    },
    get_commandSource: function CommandEventArgs$get_commandSource() {
        /// <value mayBeNull="true" locid="P:J#Sys.CommandEventArgs.commandSource">The command source.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._commandSource || null;
    },
    get_commandEvent: function CommandEventArgs$get_commandEvent() {
        /// <value mayBeNull="true" type="Sys.UI.DomEvent" locid="P:J#Sys.CommandEventArgs.commandEvent">The DOM event that caused the command, if any.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._commandEvent || null;
    }
}
$type.registerClass("Sys.CommandEventArgs", Sys.CancelEventArgs);
