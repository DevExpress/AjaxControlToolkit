$type = Sys.UI.Control = function Control(element) {
    /// <summary locid="M:J#Sys.UI.Control.#ctor"></summary>
    /// <param name="element" domElement="true">The DOM element the behavior is associated with.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    if (element.control) throw Error.invalidOperation(Sys.Res.controlAlreadyDefined);
    //#endif
    Sys.UI.Control.initializeBase(this);

    this._element = element;
    element.control = this;
    // Add support for WAI-ARIA role property.
    var role = this.get_role();
    if (role) {
        element.setAttribute("role", role);
    }
}
$type.prototype = {
    _parent: null,
    _visibilityMode: Sys.UI.VisibilityMode.hide,

    get_element: function Control$get_element() {
        /// <value domElement="true" locid="P:J#Sys.UI.Control.element">The DOM element this behavior is associated with</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._element;
    },
    get_id: function Control$get_id() {
        /// <value type="String" locid="P:J#Sys.UI.Control.id"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._id || (this._element ? this._element.id : "");
    },
    get_parent: function Control$get_parent() {
        /// <value type="Sys.UI.Control" locid="P:J#Sys.UI.Control.parent"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        if (this._parent) return this._parent;
        if (!this._element) return null;
        
        var parentElement = this._element.parentNode;
        while (parentElement) {
            if (parentElement.control) {
                return parentElement.control;
            }
            parentElement = parentElement.parentNode;
        }
        return null;
    },
    set_parent: function Control$set_parent(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: Sys.UI.Control}]);
        if (e) throw e;
        //#endif
        //#if DEBUG
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        var parents = [this];
        var current = value;
        while (current) {
            if (Array.contains(parents, current)) throw Error.invalidOperation(Sys.Res.circularParentChain);
            parents.push(current);
            current = current.get_parent();
        }
        //#endif
        this._parent = value;
    },
    get_role: function Control$get_role() {
        /// <value type="String" locid="P:J#Sys.UI.Control.role"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return null;
    },
    get_visibilityMode: function Control$get_visibilityMode() {
        /// <value type="Sys.UI.VisibilityMode" locid="P:J#Sys.UI.Control.visibilityMode"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        //#if DEBUG
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        //#endif
        return Sys.UI.DomElement.getVisibilityMode(this._element);
    },
    set_visibilityMode: function Control$set_visibilityMode(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: Sys.UI.VisibilityMode}]);
        if (e) throw e;
        //#endif
        //#if DEBUG
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        //#endif
        Sys.UI.DomElement.setVisibilityMode(this._element, value);
    },
    get_visible: function Control$get_visible() {
        /// <value type="Boolean" locid="P:J#Sys.UI.Control.visible"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        //#if DEBUG
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        //#endif
        return Sys.UI.DomElement.getVisible(this._element);
    },
    set_visible: function Control$set_visible(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: Boolean}]);
        if (e) throw e;
        //#endif
        //#if DEBUG
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        //#endif
        Sys.UI.DomElement.setVisible(this._element, value)
    },
    addCssClass: function Control$addCssClass(className) {
        /// <summary locid="M:J#Sys.UI.Control.addCssClass">Adds a CSS class to the control if it doesn't already have it.</summary>
        /// <param name="className" type="String">The name of the CSS class to add.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "className", type: String}
        ]);
        if (e) throw e;
        //#endif
        //#if DEBUG
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        //#endif
        Sys.UI.DomElement.addCssClass(this._element, className);
    },
    dispose: function Control$dispose() {
        Sys.UI.Control.callBaseMethod(this, 'dispose');
        if (this._element) {
            this._element.control = null;
            delete this._element;
        }
        if (this._parent) delete this._parent;
    },
    onBubbleEvent: function Control$onBubbleEvent(source, args) {
        /// <summary locid="M:J#Sys.UI.Control.onBubbleEvent"></summary>
        /// <param name="source">The object that triggered the event.</param>
        /// <param name="args" type="Sys.EventArgs">The event arguments.</param>
        /// <returns type="Boolean">False, because the event was not handled and should bubble up further. Derived classes should override that and return true whenever they handle the event to prevent it from bubbling up.</returns>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "source"},
            {name: "args", type: Sys.EventArgs}
        ]);
        if (e) throw e;
        //#endif
        return false;
    },
    raiseBubbleEvent: function Control$raiseBubbleEvent(source, args) {
        /// <summary locid="M:J#Sys.UI.Control.raiseBubbleEvent"></summary>
        /// <param name="source">The object that triggered the event.</param>
        /// <param name="args" type="Sys.EventArgs">The event arguments.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "source"},
            {name: "args", type: Sys.EventArgs}
        ]);
        if (e) throw e;
        //#endif
        this._raiseBubbleEvent(source, args);
    },
    _raiseBubbleEvent: function Control$_raiseBubbleEvent(source, args) {
        var currentTarget = this.get_parent();
        while (currentTarget) {
            if (currentTarget.onBubbleEvent(source, args)) {
                return;
            }
            currentTarget = currentTarget.get_parent();
        }
    },
    removeCssClass: function Control$removeCssClass(className) {
        /// <summary locid="M:J#Sys.UI.Control.removeCssClass">Removes a CSS class from the control.</summary>
        /// <param name="className" type="String">The name of the CSS class to remove.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "className", type: String}
        ]);
        if (e) throw e;
        //#endif
        //#if DEBUG
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        //#endif
        Sys.UI.DomElement.removeCssClass(this._element, className);
    },
    toggleCssClass: function Control$toggleCssClass(className) {
        /// <summary locid="M:J#Sys.UI.Control.toggleCssClass">Toggles a CSS class on and off on the control.</summary>
        /// <param name="className" type="String">The name of the CSS class to toggle.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "className", type: String}
        ]);
        if (e) throw e;
        //#endif
        //#if DEBUG
        if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
        //#endif
        Sys.UI.DomElement.toggleCssClass(this._element, className);
    }
}
$type.registerClass('Sys.UI.Control', Sys.Component);
