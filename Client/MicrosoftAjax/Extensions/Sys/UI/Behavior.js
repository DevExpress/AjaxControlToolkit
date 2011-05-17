$type = Sys.UI.Behavior = function Behavior(element) {
    /// <summary locid="M:J#Sys.UI.Behavior.#ctor"></summary>
    /// <param name="element" domElement="true">The DOM element the behavior is associated with.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;
    //#endif
    Sys.UI.Behavior.initializeBase(this);
    this._element = element;
    var behaviors = (element._behaviors = element._behaviors || []);
    behaviors.push(this);
}
$type.prototype = {
    get_element: function Behavior$get_element() {
        /// <value domElement="true" locid="P:J#Sys.UI.Behavior.element">The DOM element this behavior is associated with</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._element;
    },
    get_id: function Behavior$get_id() {
        /// <value type="String" locid="P:J#Sys.UI.Behavior.id"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        var baseId = Sys.UI.Behavior.callBaseMethod(this, 'get_id');
        if (baseId) return baseId;
        var element = this._element;
        if (!element || !element.id) return '';
        return element.id + '$' + this.get_name();
    },
    get_name: function Behavior$get_name() {
        /// <value type="String" locid="P:J#Sys.UI.Behavior.name"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        if (this._name) return this._name;
        var name = Object.getTypeName(this);
        var i = name.lastIndexOf('.');
        if (i >= 0) name = name.substr(i + 1);
        if (!this._initialized) this._name = name;
        return name;
    },
    set_name: function Behavior$set_name(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        //#endif
        //#if DEBUG
        if ((value === '') || (value.charAt(0) === ' ') || (value.charAt(value.length - 1) === ' '))
            throw Error.argument('value', Sys.Res.invalidId);
        if (typeof(this._element[value]) !== 'undefined')
            throw Error.invalidOperation(String.format(Sys.Res.behaviorDuplicateName, value));
        if (this.get_isInitialized()) throw Error.invalidOperation(Sys.Res.cantSetNameAfterInit);
        //#endif
        this._name = value;
    },
    initialize: function Behavior$initialize() {
        Sys.UI.Behavior.callBaseMethod(this, 'initialize');
        var name = this.get_name();
        if (name) this._element[name] = this;
    },
    dispose: function Behavior$dispose() {
        Sys.UI.Behavior.callBaseMethod(this, 'dispose');
        var e = this._element;
        if (e) {
            var name = this.get_name();
            if (name) {
                e[name] = null;
            }
            var behaviors = e._behaviors;
            Array.remove(behaviors, this);
            if (!behaviors.length) {
                e._behaviors = null;
            }
            delete this._element;
        }
    }
}
$type.registerClass('Sys.UI.Behavior', Sys.Component);

$type.getBehaviorByName = function Behavior$getBehaviorByName(element, name) {
    /// <summary locid="M:J#Sys.UI.Behavior.getBehaviorByName">Gets a behavior with the specified name from the dom element.</summary>
    /// <param name="element" domElement="true">The DOM element to inspect.</param>
    /// <param name="name" type="String">The name of the behavior to look for.</param>
    /// <returns type="Sys.UI.Behavior" mayBeNull="true">The behaviors or null if it was not found.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "name", type: String}
    ]);
    if (e) throw e;
    //#endif
    var b = element[name];
    return (b && Sys.UI.Behavior.isInstanceOfType(b)) ? b : null;
}

$type.getBehaviors = function Behavior$getBehaviors(element) {
    /// <summary locid="M:J#Sys.UI.Behavior.getBehaviors">Gets a collection containing the behaviors associated with an element.</summary>
    /// <param name="element" domElement="true">The DOM element.</param>
    /// <returns type="Array" elementType="Sys.UI.Behavior">An array containing the behaviors associated with the DOM element.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;
    //#endif
    var behaviors = element._behaviors;
    return behaviors ? Array.clone(behaviors) : [];
}

Sys.UI.Behavior.getBehaviorsByType = function Behavior$getBehaviorsByType(element, type) {
    /// <summary locid="M:J#Sys.UI.Behavior.getBehaviorsByType">Gets an array of behaviors with the specified type from the dom element.</summary>
    /// <param name="element" domElement="true">The DOM element to inspect.</param>
    /// <param name="type" type="Type">The type of behavior to look for.</param>
    /// <returns type="Array" elementType="Sys.UI.Behavior">An array containing the behaviors of the specified type found on the element.  The array is empty if no behavior of this type was found.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "type", type: Type}
    ]);
    if (e) throw e;
    //#endif
    var behaviors = element._behaviors;
    var results = [];
    if (behaviors) {
        for (var i = 0, l = behaviors.length; i < l; i++) {
            var behavior = behaviors[i];
            if (type.isInstanceOfType(behavior)) {
                results.push(behavior);
            }
        }
    }
    return results;
}
