$type = Sys.Observer = function Observer() {
    //#if DEBUG
    throw Error.invalidOperation();
    //#endif
}
$type.registerClass("Sys.Observer");

$type.makeObservable = function Observer$makeObservable(target) {
    /// <summary locid="M:J#Sys.Observer.makeObservable">Makes an object directly observable by adding observable methods to it.</summary>
    /// <param name="target" mayBeNull="false">The object, array, or DOM element to make observable.</param>
    /// <returns>The observable object.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target"}
    ]);
    if (e) throw e;
    //#endif
    var isArray = target instanceof Array,
        o = Sys.Observer;
    //#if DEBUG
    Sys.Observer._ensureObservable(target);
    //#endif
    if (target.setValue === o._observeMethods.setValue) return target;
    o._addMethods(target, o._observeMethods);
    if (isArray) {
        o._addMethods(target, o._arrayMethods);
    }
    return target;
}

//#if DEBUG
$type._ensureObservable = function Observer$_ensureObservable(target) {
    var type = typeof target;
    if ((type === "string") || (type === "number") || (type === "boolean") || (type === "date")) {
        throw Error.invalidOperation(String.format(Sys.Res.notObservable, type));
    }
}
//#endif
$type._addMethods = function Observer$_addMethods(target, methods) {
    for (var m in methods) {
        //#if DEBUG
        if (target[m] && (target[m] !== methods[m])) {
            throw Error.invalidOperation(String.format(Sys.Res.observableConflict, m));
        }
        //#endif
        target[m] = methods[m];
    }
}
// Make use of private version for significant perf improvement in Binding.
// See references of these functions in binding.js for more details.
$type._addEventHandler = function Observer$_addEventHandler(target, eventName, handler) {
    Sys.Observer._getContext(target, true).events._addHandler(eventName, handler);
}
$type.addEventHandler = function Observer$addEventHandler(target, eventName, handler) {
    /// <summary locid="M:J#Sys.Observer.addEventHandler">Adds an observable event handler to the target.</summary>
    /// <param name="target"></param>
    /// <param name="eventName" type="String"></param>
    /// <param name="handler" type="Function"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "eventName", type: String},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    Sys.Observer._ensureObservable(target);
    //#endif
    Sys.Observer._addEventHandler(target, eventName, handler);
}
// Make use of private version for significant perf improvement in Binding.
// See references of these functions in binding.js for more details.
$type._removeEventHandler = function Observer$_removeEventHandler(target, eventName, handler) {
    Sys.Observer._getContext(target, true).events._removeHandler(eventName, handler);
}
$type.removeEventHandler = function Observer$removeEventHandler(target, eventName, handler) {
    /// <summary locid="M:J#Sys.Observer.removeEventHandler">Removes an observable event handler from the target.</summary>
    /// <param name="target"></param>
    /// <param name="eventName" type="String"></param>
    /// <param name="handler" type="Function"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "eventName", type: String},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    Sys.Observer._ensureObservable(target);
    //#endif
    Sys.Observer._removeEventHandler(target, eventName, handler);
}
$type.clearEventHandlers = function Observer$clearEventHandlers(target, eventName) {
    /// <summary locid="M:J#Sys.Observer.clearEventHandlers">Removes all observable event handlers from the target.</summary>
    /// <param name="target"></param>
    /// <param name="eventName" type="String" mayBeNull="true" optional="true">If not given, handlers for all events are removed.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "eventName", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    Sys.Observer._ensureObservable(target);
    //#endif
    Sys.Observer._getContext(target, true).events._removeHandlers(eventName);
}
$type.raiseEvent = function Observer$raiseEvent(target, eventName, eventArgs) {
    /// <summary locid="M:J#Sys.Observer.raiseEvent">Raises an observable event on the target.</summary>
    /// <param name="target"></param>
    /// <param name="eventName" type="String"></param>
    /// <param name="eventArgs" optional="true" mayBeNull="true"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "eventName", type: String},
        {name: "eventArgs", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    Sys.Observer._ensureObservable(target);
    //#endif
    var ctx = Sys.Observer._getContext(target);
    if (!ctx) return;
    var handler = ctx.events.getHandler(eventName);
    if (handler) {
        handler(target, eventArgs || Sys.EventArgs.Empty);
    }
}
$type.addPropertyChanged = function Observer$addPropertyChanged(target, handler) {
    /// <summary locid="M:J#Sys.Observer.addPropertyChanged">Adds a propertyChanged event handler to the target.</summary>
    /// <param name="target" mayBeNull="false">The object to observe.</param>
    /// <param name="handler" type="Function">The event handler.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    Sys.Observer._ensureObservable(target);
    //#endif
    Sys.Observer._addEventHandler(target, "propertyChanged", handler);
}
$type.removePropertyChanged = function Observer$removePropertyChanged(target, handler) {
    /// <summary locid="M:J#Sys.Observer.removePropertyChanged">Removes a propertyChanged event handler from the target.</summary>
    /// <param name="target" mayBeNull="false">The object to observe.</param>
    /// <param name="handler" type="Function">The event handler.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    Sys.Observer._ensureObservable(target);
    //#endif
    Sys.Observer._removeEventHandler(target, "propertyChanged", handler);
}
$type.beginUpdate = function Observer$beginUpdate(target) {
    /// <summary locid="M:J#Sys.Observer.beginUpdate"></summary>
    /// <param name="target" mayBeNull="false"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target"}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    Sys.Observer._ensureObservable(target);
    //#endif
    Sys.Observer._getContext(target, true).updating = true;
}
$type.endUpdate = function Observer$endUpdate(target) {
    /// <summary locid="M:J#Sys.Observer.endUpdate"></summary>
    /// <param name="target" mayBeNull="false"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target"}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    Sys.Observer._ensureObservable(target);
    //#endif
    var ctx = Sys.Observer._getContext(target);
    if (!ctx || !ctx.updating) return;
    ctx.updating = false;
    var dirty = ctx.dirty;
    ctx.dirty = false;
    if (dirty) {
        if (target instanceof Array) {
            var changes = ctx.changes;
            ctx.changes = null;
            Sys.Observer.raiseCollectionChanged(target, changes);
        }
        Sys.Observer.raisePropertyChanged(target, "");
    }
}
$type.isUpdating = function Observer$isUpdating(target) {
    /// <summary locid="M:J#Sys.Observer.isUpdating"></summary>
    /// <param name="target" mayBeNull="false"></param>
    /// <returns type="Boolean"></returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target"}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    Sys.Observer._ensureObservable(target);
    //#endif
    var ctx = Sys.Observer._getContext(target);
    return ctx ? ctx.updating : false;
}
// Make use of private version for significant perf improvement in Binding.
// See references of these functions in binding.js for more details.
$type._setValue = function Observer$_setValue(target, propertyName, value) {
    var getter, setter, mainTarget = target, path = propertyName.split('.');
    for (var i = 0, l = (path.length - 1); i < l ; i++) {
        var name = path[i];
        getter = target["get_" + name]; 
        if (typeof (getter) === "function") {
            target = getter.call(target);
        }
        else {
            target = target[name];
        }
        var type = typeof (target);
        if ((target === null) || (type === "undefined")) {
            throw Error.invalidOperation(String.format(Sys.Res.nullReferenceInPath, propertyName));
        }
    }    
    var currentValue, lastPath = path[l];
    getter = target["get_" + lastPath];
    if (typeof(getter) === 'function') {
        currentValue = getter.call(target);
    }
    else {
        currentValue = target[lastPath];
    }
    callIf(target, "set_" + lastPath, value) || (target[lastPath] = value);
    if (currentValue !== value) {
        var ctx = Sys.Observer._getContext(mainTarget);
        if (ctx && ctx.updating) {
            ctx.dirty = true;
            return;
        };
        Sys.Observer.raisePropertyChanged(mainTarget, path[0]);
    }
}
$type.setValue = function Observer$setValue(target, propertyName, value) {
    /// <summary locid="M:J#Sys.Observer.setValue">Sets a property or field on the target in an observable manner.</summary>
    /// <param name="target" mayBeNull="false">The object to set a property on.</param>
    /// <param name="propertyName" type="String">The name of the property to field to set.</param>
    /// <param name="value" mayBeNull="true">The value to set.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target"},
        {name: "propertyName", type: String},
        {name: "value", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    Sys.Observer._ensureObservable(target);
    //#endif
    Sys.Observer._setValue(target, propertyName, value);
}
$type.raisePropertyChanged = function Observer$raisePropertyChanged(target, propertyName) {
    /// <summary locid="M:J#Sys.Observer.raisePropertyChanged">Raises a change notification event.</summary>
    /// <param name="target" mayBeNull="false">The object to raise the event on.</param>
    /// <param name="propertyName" type="String">The name of the property that changed.</param>
    Sys.Observer.raiseEvent(target, "propertyChanged", new Sys.PropertyChangedEventArgs(propertyName));
}

$type.addCollectionChanged = function Observer$addCollectionChanged(target, handler) {
    /// <summary locid="M:J#Sys.Observer.addCollectionChanged"></summary>
    /// <param name="target" type="Array" elementMayBeNull="true"></param>
    /// <param name="handler" type="Function"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    //#endif
    Sys.Observer._addEventHandler(target, "collectionChanged", handler);
}
$type.removeCollectionChanged = function Observer$removeCollectionChanged(target, handler) {
    /// <summary locid="M:J#Sys.Observer.removeCollectionChanged"></summary>
    /// <param name="target" type="Array" elementMayBeNull="true"></param>
    /// <param name="handler" type="Function"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "handler", type: Function}
    ]);
    if (e) throw e;
    //#endif
    Sys.Observer._removeEventHandler(target, "collectionChanged", handler);
}
$type._collectionChange = function Observer$_collectionChange(target, change) {
    var ctx = this._getContext(target);
    if (ctx && ctx.updating) {
        ctx.dirty = true;
        var changes = ctx.changes;
        if (!changes) {
            ctx.changes = changes = [change];
        }
        else {
            changes.push(change);
        }
    }
    else {
        this.raiseCollectionChanged(target, [change]);
        this.raisePropertyChanged(target, 'length');
    }
}
$type.add = function Observer$add(target, item) {
    /// <summary locid="M:J#Sys.Observer.add">Adds an item to the collection in an observable manner.</summary>
    /// <param name="target" type="Array" elementMayBeNull="true">The array to add to.</param>
    /// <param name="item" mayBeNull="true">The item to add.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    var change = new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [item], target.length);
    Array.add(target, item);
    Sys.Observer._collectionChange(target, change);
}
$type.addRange = function Observer$addRange(target, items) {
    /// <summary locid="M:J#Sys.Observer.addRange">Adds items to the collection in an observable manner.</summary>
    /// <param name="target" type="Array" elementMayBeNull="true">The array to add to.</param>
    /// <param name="items" type="Array" elementMayBeNull="true">The array of items to add.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "items", type: Array, elementMayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    var change = new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, items, target.length);
    Array.addRange(target, items);
    Sys.Observer._collectionChange(target, change);
}
$type.clear = function Observer$clear(target) {
    /// <summary locid="M:J#Sys.Observer.clear">Clears the array of its elements in an observable manner.</summary>
    /// <param name="target" type="Array" elementMayBeNull="true">The array to clear.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    var oldItems = Array.clone(target);
    Array.clear(target);
    Sys.Observer._collectionChange(target, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.reset, null, -1, oldItems, 0));
}
$type.insert = function Observer$insert(target, index, item) {
    /// <summary locid="M:J#Sys.Observer.insert">Inserts an item at the specified index in an observable manner.</summary>
    /// <param name="target" type="Array" elementMayBeNull="true">The array to insert into.</param>
    /// <param name="index" type="Number" integer="true">The index where the item will be inserted.</param>
    /// <param name="item" mayBeNull="true">The item to insert.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "index", type: Number, integer: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    Array.insert(target, index, item);
    Sys.Observer._collectionChange(target, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [item], index));
}
$type.remove = function Observer$remove(target, item) {
    /// <summary locid="M:J#Sys.Observer.remove">Removes the first occurence of an item from the array in an observable manner.</summary>
    /// <param name="target" type="Array" elementMayBeNull="true">The array to remove from.</param>
    /// <param name="item" mayBeNull="true">The item to remove.</param>
    /// <returns type="Boolean">True if the item was found.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    var index = Array.indexOf(target, item);
    if (index !== -1) {
        Array.remove(target, item);
        Sys.Observer._collectionChange(target, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, [item], index));
        return true;
    }
    return false;
}
$type.removeAt = function Observer$removeAt(target, index) {
    /// <summary locid="M:J#Sys.Observer.removeAt">Removes the item at the specified index from the array in an observable manner.</summary>
    /// <param name="target" type="Array" elementMayBeNull="true">The array to remove from.</param>
    /// <param name="index" type="Number" integer="true">The index of the item to remove.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "target", type: Array, elementMayBeNull: true},
        {name: "index", type: Number, integer: true}
    ]);
    if (e) throw e;
    //#endif
    if ((index > -1) && (index < target.length)) {
        var item = target[index];
        Array.removeAt(target, index);
        Sys.Observer._collectionChange(target, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, [item], index));
    }
}
$type.raiseCollectionChanged = function Observer$raiseCollectionChanged(target, changes) {
    /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Raises the collectionChanged event.</summary>
    /// <param name="target">The collection to raise the event on.</param>
    /// <param name="changes" type="Array" elementType="Sys.CollectionChange">A list of changes that were performed on the collection since the last event.</param>
    Sys.Observer.raiseEvent(target, "collectionChanged", new Sys.NotifyCollectionChangedEventArgs(changes));
}

// note: triple-slash comments in these methods works with the preprocessor despite them being defined in this unique way
$type._observeMethods = {
    add_propertyChanged: function(handler) {
        Sys.Observer._addEventHandler(this, "propertyChanged", handler);
    },
    remove_propertyChanged: function(handler) {
        Sys.Observer._removeEventHandler(this, "propertyChanged", handler);
    },
    addEventHandler: function(eventName, handler) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Adds an observable event handler.</summary>
        /// <param name="eventName" type="String"></param>
        /// <param name="handler" type="Function"></param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "eventName", type: String},
            {name: "handler", type: Function}
        ]);
        if (e) throw e;
        //#endif
        Sys.Observer._addEventHandler(this, eventName, handler);
    },
    removeEventHandler: function(eventName, handler) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Removes an observable event handler.</summary>
        /// <param name="eventName" type="String"></param>
        /// <param name="handler" type="Function"></param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "eventName", type: String},
            {name: "handler", type: Function}
        ]);
        if (e) throw e;
        //#endif
        Sys.Observer._removeEventHandler(this, eventName, handler);
    },
    clearEventHandlers: function(eventName) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Removes all observable event handlers from the target.</summary>
        /// <param name="target"></param>
        /// <param name="eventName" type="String" mayBeNull="true" optional="true">If not given, handlers for all events are removed.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "target"},
            {name: "eventName", type: String, mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        //#endif
        Sys.Observer._getContext(this, true).events._removeHandlers(eventName);
    },
    get_isUpdating: function() {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged"></summary>
        /// <returns type="Boolean"></returns>
        return Sys.Observer.isUpdating(this);
    },
    beginUpdate: function() {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged"></summary>
        Sys.Observer.beginUpdate(this);
    },
    endUpdate: function() {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged"></summary>
        Sys.Observer.endUpdate(this);
    },
    setValue: function(name, value) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Sets a property or field on the target in an observable manner.</summary>
        /// <param name="name" type="String">The name of the property to field to set.</param>
        /// <param name="value" mayBeNull="true">The value to set.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "name", type: String},
            {name: "value", mayBeNull: true}
        ]);
        if (e) throw e;
        //#endif
        Sys.Observer._setValue(this, name, value);
    },
    raiseEvent: function(eventName, eventArgs) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Raises an observable event.</summary>
        /// <param name="eventName" type="String"></param>
        /// <param name="eventArgs" optional="true" mayBeNull="true"></param>
        Sys.Observer.raiseEvent(this, eventName, eventArgs||null);
    },
    raisePropertyChanged: function(name) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Raises a change notification event.</summary>
        /// <param name="name" type="String">The name of the property that changed.</param>
        Sys.Observer.raiseEvent(this, "propertyChanged", new Sys.PropertyChangedEventArgs(name));
    }
}
$type._arrayMethods = {
    add_collectionChanged: function(handler) {
        Sys.Observer._addEventHandler(this, "collectionChanged", handler);
    },
    remove_collectionChanged: function(handler) {
        Sys.Observer._removeEventHandler(this, "collectionChanged", handler);
    },
    add: function(item) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Adds an item to the collection in an observable manner.</summary>
        /// <param name="item" mayBeNull="true">The item to add.</param>
        Sys.Observer.add(this, item);
    },
    addRange: function(items) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Adds items to the collection in an observable manner.</summary>
        /// <param name="items" type="Array" elementMayBeNull="true">The array of items to add.</param>
        Sys.Observer.addRange(this, items);
    },
    clear: function() {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Clears the array of its elements in an observable manner.</summary>
        Sys.Observer.clear(this);
    },
    insert: function(index, item) { 
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Inserts an item at the specified index in an observable manner.</summary>
        /// <param name="index" type="Number" integer="true">The index where the item will be inserted.</param>
        /// <param name="item" mayBeNull="true">The item to insert.</param>
        Sys.Observer.insert(this, index, item);
    },
    remove: function(item) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Removes the first occurence of an item from the array in an observable manner.</summary>
        /// <param name="item" mayBeNull="true">The item to remove.</param>
        /// <returns type="Boolean">True if the item was found.</returns>
        return Sys.Observer.remove(this, item);
    },
    removeAt: function(index) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Removes the item at the specified index from the array in an observable manner.</summary>
        /// <param name="index" type="Number" integer="true">The index of the item to remove.</param>
        Sys.Observer.removeAt(this, index);
    },
    raiseCollectionChanged: function(changes) {
        /// <summary locid="M:J#Sys.Observer.raiseCollectionChanged">Raises the collectionChanged event.</summary>
        /// <param name="changes" type="Array" elementType="Sys.CollectionChange">A list of changes that were performed on the collection since the last event.</param>
        Sys.Observer.raiseEvent(this, "collectionChanged", new Sys.NotifyCollectionChangedEventArgs(changes));
    }
}
$type._getContext = function Observer$_getContext(obj, create) {
    var ctx = obj._observerContext;
    if (ctx) return ctx();
    if (create) {
        return (obj._observerContext = this._createContext())();
    }
    return null;
}
$type._createContext = function Observer$_createContext() {
    // instead of attaching an EventHandlerList, etc directly onto the observed object, we attach a function
    // which returns it as a closure. This prevents the need to attach a field to the object which is not a 
    // function, which could have a negative impact on serializers, whereas they typically always skip functions.
    // It's also better for sparse arrays, where a for-var-in loop need only ignore functions.
    // Return an object instead of the handler list directly so we have a place to put other fields without having
    // to add separate getX() methods for each.
    var ctx = {
        events: new Sys.EventHandlerList()
    };
    return function() {
        return ctx;
    }
}
