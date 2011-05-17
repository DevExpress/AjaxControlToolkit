$type = Sys.EventHandlerList = function EventHandlerList() {
    /// <summary locid="M:J#Sys.EventHandlerList.#ctor">The EventHandlerList class contains a dictionary of multicast events.</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    this._list = {};
}

$type.prototype = {
    _addHandler: function EventHandlerList$_addHandler(id, handler) {
        Array.add(this._getEvent(id, true), handler);
    },
    addHandler: function EventHandlerList$addHandler(id, handler) {
        /// <summary locid="M:J#Sys.EventHandlerList.addHandler">The addHandler method adds a handler to the event identified by id.</summary>
        /// <param name="id" type="String">The identifier for the event.</param>
        /// <param name="handler" type="Function">The handler to add to the event.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "id", type: String},
            {name: "handler", type: Function}
        ]);
        if (e) throw e;
        //#endif
        this._addHandler(id, handler);
    },
    _removeHandler: function EventHandlerList$_removeHandler(id, handler) {
        var evt = this._getEvent(id);
        if (!evt) return;
        Array.remove(evt, handler);
    },
    _removeHandlers: function EventHandlerList$_removeHandlers(id) {
        if (!id) {
            this._list = {};
        }
        else {
            var evt = this._getEvent(id);
            if (!evt) return;
            evt.length = 0;
        }
    },
    removeHandler: function EventHandlerList$removeHandler(id, handler) {
        /// <summary locid="M:J#Sys.EventHandlerList.removeHandler">The removeHandler method removes a handler to the event identified by id.</summary>
        /// <param name="id" type="String">The identifier for the event.</param>
        /// <param name="handler" type="Function">The handler to remove from the event.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "id", type: String},
            {name: "handler", type: Function}
        ]);
        if (e) throw e;
        //#endif
        this._removeHandler(id, handler);
    },
    getHandler: function EventHandlerList$getHandler(id) {
        /// <summary locid="M:J#Sys.EventHandlerList.getHandler">The getHandler method returns a single function that will call all   handlers sequentially for the specified event.</summary>
        /// <param name="id" type="String">The identifier for the event.</param>
        /// <returns type="Function">A function that will call each handler sequentially.</returns>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "id", type: String}
        ]);
        if (e) throw e;
        //#endif
        var evt = this._getEvent(id);
        if (!evt || !evt.length) return null;
        evt = Array.clone(evt);
        return function(source, args) {
            for (var i = 0, l = evt.length; i < l; i++) {
                evt[i](source, args);
            }
        };
    },
    _getEvent: function EventHandlerList$_getEvent(id, create) {
        var e = this._list[id];
        if (!e) {
            if (!create) return null;
            this._list[id] = e = [];
        }
        return e;
    }
}
$type.registerClass('Sys.EventHandlerList');
