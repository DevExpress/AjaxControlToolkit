$type = Sys.Binding = function Binding() {
    Sys.Binding.initializeBase(this);
    this._sourceHandlers = [];
    this._targetHandlers = [];
    this._onSourceChanged = Function.createDelegate(this, this._sourceChanged);
    this._onTargetChanged = Function.createDelegate(this, this._targetChanged);
    this._onOptionsUpdated = Function.createDelegate(this, this._optionsUpdated);
    this._onDispose = Function.createDelegate(this, this.dispose);
}
$type.prototype = {
    _defaultValue: null,
    get_convert: function Binding$get_convert() {
        /// <value mayBeNull="true" locid="P:J#Sys.Binding.convert">A function or function name to call when updating the target.</value>
        return this._convert || null;
    },
    set_convert: function Binding$set_convert(value) {
       this._convert = value;
       this._convertFn = this._resolveFunction(value);
    },
    get_convertBack: function Binding$get_convertBack() {
        /// <value mayBeNull="true" locid="P:J#Sys.Binding.convertBack">A function or function name to call when updating the source.</value>
        return this._convertBack || null;
    },
    set_convertBack: function Binding$set_convertBack(value) {
       this._convertBack = value;
       this._convertBackFn = this._resolveFunction(value);
    },
    get_ignoreErrors: function Binding$get_ignoreErrors() {
        /// <value type="Boolean" mayBeNull="false" locid="P:J#Sys.Binding.ignoreErrors">The option to ignore errors in convert/convertBack</value>
        return !!this._ignoreErrors;
    },
    set_ignoreErrors: function Binding$set_ignoreErrors(value) {
       this._ignoreErrors = value;
    },
    get_mode: function Binding$get_mode() {
        /// <value type="Sys.BindingMode" mayBeNull="false" locid="P:J#Sys.Binding.mode">The mode input</value>
        return this._mode || Sys.BindingMode.auto;
    },
    set_mode: function Binding$set_mode(value) {
        //#if DEBUG
        if (this._initialized) {
            throw Error.invalidOperation(String.format(Sys.UI.TemplatesRes.commonNotAfterInit, "Binding", "mode"));
        }
        //#endif
        this._mode = value;
    },
    get_defaultValue: function Binding$get_defaultValue() {
        /// <value mayBeNull="true" locid="P:J#Sys.Binding.defaultValue">The value to use when the source path evalulates to null or undefined.</value>
        return this._defaultValue;
    },
    set_defaultValue: function Binding$set_defaultValue(value) {
        this._defaultValue = value;
    },
    get_source: function Binding$get_source() {
        /// <value mayBeNull="true" locid="P:J#Sys.Binding.source">The source input</value>
        return this._source || null;
    },
    set_source: function Binding$set_source(value) {
        //#if DEBUG
        if (this._initialized) {
            throw Error.invalidOperation(String.format(Sys.UI.TemplatesRes.commonNotAfterInit, "Binding", "source"));
        }
        //#endif
        if (value instanceof Sys.ComponentSet || value instanceof Sys.ElementSet) {
            value = value.get(0);
        }
        this._source = value;
    },
    get_templateContext: function Binding$get_templateContext() {
        /// <value mayBeNull="true" type="Sys.UI.TemplateContext" locid="P:J#Sys.Binding.templateContext"></value>
        return this._templateContext || null;
    },
    set_templateContext: function Binding$set_templateContext(value) {
        this._templateContext = value;
    },
    get_path: function Binding$get_path() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Binding.path">The source datapath input</value>
        return this._path || "";
    },
    set_path: function Binding$set_path(value) {
        //#if DEBUG
        if (this._initialized) {
            throw Error.invalidOperation(String.format(Sys.UI.TemplatesRes.commonNotAfterInit, "Binding", "path"));
        }
        //#endif
        this._path = value;
        this._pathArray = value ? value.split('.') : null;
    },
    get_target: function Binding$get_target() {
        /// <value mayBeNull="true" locid="P:J#Sys.Binding.target">The target object.</value>
        return this._target || null;
    },
    set_target: function Binding$set_target(value) {
        //#if DEBUG
        if (this._initialized) {
            throw Error.invalidOperation(String.format(Sys.UI.TemplatesRes.commonNotAfterInit, "Binding", "target"));
        }
        //#endif
        if (value instanceof Sys.ComponentSet || value instanceof Sys.ElementSet) {
            value = value.get(0);
        }
        this._target = value;
    },
    get_targetProperty: function Binding$get_targetProperty() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Binding.targetProperty">The target data path input</value>
        return this._targetProperty || "";
    },
    set_targetProperty: function Binding$set_targetProperty(value) {
        //#if DEBUG
        if (this._initialized) {
            throw Error.invalidOperation(String.format(Sys.UI.TemplatesRes.commonNotAfterInit, "Binding", "targetProperty"));
        }
        //#endif
        this._targetProperty = value;
        this._targetPropertyArray = value ? value.split('.') : null;
    },
    _addBinding: function Binding$_addBinding(element) {
        // Add bindings of the same element to a list for easy disposing purpose later.
        // Also hook up our own disposeBinding method to the element if it does not have one.
        if (element.nodeType === 3) {
            // cannot add expandos to textnodes in IE
            element = element.parentNode;
            // if binding to a lone textnode we cannot setup disposal
            if (!element) return;
        }
        var bindings = element.__msajaxbindings = element.__msajaxbindings || [];
        bindings.push(this);
        // Hook up the disposing method if needed
        Sys.UI.DomElement._onDispose(element, Sys.Binding._disposeBindings);
    },
    dispose: function Binding$dispose() {
        /// <summary locid="M:J#Sys.Binding.dispose"></summary>
        // Dispose all of the handlers used for this binding.
        if (!this._disposed) {
            this._disposed = true;
            // remove all the handlers for source and target
            this._watchObject(null);
            this._watchObject(null, true);
            this._targetHandlers = null;
            this._sourceHandlers = null;
            var source = this._source,
                target = this._target;
            if (source) {
                if (this._sourceOption) Sys.Observer.removeEventHandler(source, "optionsChanged", this._onOptionsUpdated);
                if (Sys.INotifyDisposing.isImplementedBy(source)) source.remove_disposing(this._onDispose);
            }
            if (target) {
                if (this._targetOption) Sys.Observer.removeEventHandler(target, "optionsChanged", this._onOptionsUpdated);
                if (Sys.INotifyDisposing.isImplementedBy(target)) target.remove_disposing(this._onDispose);
            }
            this._convert = null;
            this._convertBack = null;
            this._convertFn = null;
            this._convertBackFn = null;
            this._lastSource = null;
            this._lastTarget = null;
            this._source = null;
            this._target = null;
            this._pathArray = null;
            this._defaultValue = null;
            this._targetPropertyArray = null;
            this._templateContext = null;
        }
        Sys.Binding.callBaseMethod(this, 'dispose');
    },
    _getPropertyFromIndex: function Binding$_getPropertyFromIndex(obj, path, startIndex, endIndex) {
        // Get a property of 'obj' from an index of its data path. Index must be less than path.length.
        // Return the specified property of 'obj'.
        for (var i = startIndex; i <= endIndex; i++) {
            if (obj === null || typeof(obj) === "undefined") {
                // cant evaluate further
                return null;
            }
            obj = this._getPropertyData(obj, path[i]);
        }
        return obj;
    },
    _getPropertyData: function Binding$_getPropertyData(obj, name) {
        if (typeof (obj["get_" + name]) === "function") {
            return obj["get_" + name]();
        }
        else {
            return obj[name];
        }
    },
    _watchObject: function Binding$_watchObject(object, isSource) {
        var path = isSource ? this._pathArray : this._targetPropertyArray,
            handlers = isSource ? this._sourceHandlers : this._targetHandlers,
            observable = !!object;
        if (path) {
            for (var i = 0, l = path.length; i < l; i++) {
                var property = path[i],
                    handler = handlers[i];
                if (!handler || handler.object !== object) {
                    if (handler) {
                        // forget the old value
                        this._forget(handler);
                        handlers[i] = null;
                    }
                    if (observable) {
                        // listen to new value
                        handlers[i] = this._listen(object, property, isSource);
                    }
                }
                if (observable) {
                    object = this._getPropertyData(object, property);
                    observable = (object && (typeof(object) === "object" || (object instanceof Array) || Sys._isDomElement(object)));
                }
                else {
                    // means we reached a part of the path where we can no longer get new values or there
                    // is no point in listening to changes.
                    // We still evaluate the path, however, to ensure old handlers are removed as appropriate.
                    // For example, path is foo.bar.baz, and foo.bar returned null, or a number, string, or date.
                    object = null;
                }
            }
        }
    },
    _isInput: function Binding$_isInput(element, property) {
        var ret,
            tag = (Sys.UI.DomElement.isDomElement(element) && element.nodeType === 1 && element.tagName) ?
                element.tagName.toLowerCase() : "";
        if (tag === "select" || tag === "input" || tag === "textarea") {
            property = (property||"").toLowerCase();
            if (property === "value" || property === "selectedindex" || property === "checked") {
                if (tag !== "input" || (tag === "input" && !/button|image|hidden|submit|reset/i.test(element.type))) {
                    ret = tag;
                }
            }
        }
        return ret;
    },
    _listen: function Binding$_listen(object, property, isSource) {
        var _this = this,
            listener = isSource ? this._onSourceChanged : this._onTargetChanged,
            handlers = {
                listener: listener,
                object: object,
                pc: function(sender, args) {
                    var changed = args.get_propertyName();
                    if (!changed || changed === property) {
                        listener();
                    }
                },
                dom: []
            };
        Sys.Observer._addEventHandler(object, "propertyChanged", handlers.pc);
        var isInput = this._isInput(object, property),
            adder = Sys.UI.DomEvent.addHandler;
        if (isInput) {
            // Hook up the 'onchange' event for 'input' or 'select' or 'textarea' element.
            handlers.dom.push("change");
            adder(object, "change", listener);
            if (isInput !== "textarea") {
                // If it is a 'select' or 'input' element, also hook up the click event.
                handlers.dom.push("click");
                adder(object, "click", listener);
                if (isInput === "select") {
                    // If it's 'select' element, also hook up the keyup event.
                    handlers.dom.push("keyup");
                    adder(object, "keyup", listener);
                }
            }
        }
        object = null;
        return handlers;
    },
    _forget: function Binding$_forget(handler) {
        var object = handler.object,
            dom = handler.dom;
        Sys.Observer._removeEventHandler(object, "propertyChanged", handler.pc);
        for (var i = 0, l = dom.length; i < l; i++) {
            Sys.UI.DomEvent.removeHandler(object, dom[i], handler.listener);
        }
    },
    _resolveFunction: function Binding$_resolveFunction(value) {
        var e, ret;
        if (typeof(value) === 'function') { // this is a function, call it directly.
            ret = value;
        }
        else {
            //#if DEBUG // throw if value is neither function or string type.            
            if (typeof(value) !== "string") {
                throw Error.invalidOperation(String.format(Sys.UI.TemplatesRes.invalidFunctionName, value));
            }
            //#endif
            ret = Sys.converters[value];
            if (!ret) {
                try {
                    ret = Type.parse(value);
                }
                catch (e) {
                    throw Error.invalidOperation(String.format(Sys.UI.TemplatesRes.functionNotFound, value));
                }
            }
        }
        return ret;
    },
    update: function Binding$update(mode) {
        /// <summary locid="M:J#Sys.Binding.update"></summary>
        /// <param name="mode" optional="true" mayBeNull="true">The updating direction.</param>
        // Force the current binding to update the value of source/target based on the 
        // input binding mode. This method cannot be used before the binding is initialized.
        //#if DEBUG
        if (!this._initialized) {
            throw Error.invalidOperation(Sys.UI.TemplatesRes.updateBeforeInit);
        }
        //#endif
        mode = mode || this.get_mode();
        if (mode === Sys.BindingMode.oneWayToSource) {
            this._targetChanged(true);
        }
        else {
            this._sourceChanged(true);
        }
    },
    //#if DEBUG
    _notSet: function Binding$_notSet(name) {
       throw Error.invalidOperation(String.format(Sys.UI.TemplatesRes.bindingPropertyNotSet, name));
    },
    //#endif
    // Main Methods
    initialize: function Binding$initialize() {
        if (!this.get_isInitialized()) {
            //#if DEBUG
            if (!this.get_targetProperty()) {
                this._notSet("targetProperty");
            }
            //#endif
            var tc = this.get_templateContext();
            if (!tc) {
                this._doInitialize();
            }
            else {
                tc._completed.push(Function.createDelegate(this, this._doInitialize));
            }
        }
    },
    _doInitialize: function Binding$_doInitialize() {
        // Initialize the binding. Make sure the inputs are valid. Do once time update based on the 
        // input mode to initilize the source/target updating values. Hook up the changed and disposing 
        // handlers for source and target based on the binding mode.
        var source = this.get_source(),
            target = this.get_target();
        if (typeof(source) === "string") {
            this.set_source(source = this._resolveReference(source) || null);
        }
        if (typeof(target) === "string") {
            this.set_target(target = this._resolveReference(target) || null);
        }
        var mode = this.get_mode();
        if (target && (mode === Sys.BindingMode.auto)) {
            mode = "oneWay";
            if ((this._isInput(target, this._targetPropertyArray ? this._targetPropertyArray[0] : "")) ||
                Sys.INotifyPropertyChange.isImplementedBy(target)) {
                mode = "twoWay";
            }
            mode = Sys.BindingMode[mode];
            this.set_mode(mode);
        }
        Sys.Binding.callBaseMethod(this, 'initialize');        
        // Do one time update to get the initial data
        this.update(mode);

        if (mode !== Sys.BindingMode.oneTime) {
            if (source) {
                // Hook up changed and disposing handlers for source
                if (mode !== Sys.BindingMode.oneWayToSource) {
                    this._watchObject(source, true);
                    if (Sys.INotifyDisposing.isImplementedBy(source)) {
                        source.add_disposing(this._onDispose);
                    }
                }
                if (Sys.UI.DomElement.isDomElement(source)) {
                    this._addBinding(source);
                }
            }
            if (target) {
                if (mode !== Sys.BindingMode.oneWay) {
                    this._watchObject(target);
                    if (Sys.INotifyDisposing.isImplementedBy(target)) {
                        target.add_disposing(this._onDispose);
                    }
                }
                if (Sys.UI.DomElement.isDomElement(target)) {
                    this._addBinding(target);
                }
            }
        }
        // Binding to a <select>'s selectedIndex or value attribute is troublesome, because setting the value/index
        // has no effect if the select's options have not yet been created. They may not be created yet if they are
        // themseleves created by a template. Anything that binds a selects options should use observer to notify
        // any listeners that it has modified the options, so the value can be tried again afterwards.
        function listen(e, p) {
            if (Sys.UI.DomElement.isDomElement(e) && /^select$/i.test(e.tagName) && /^(selectedIndex|value)$/i.test(p)) {
                Sys.Observer.addEventHandler(e, "optionsChanged", this._onOptionsUpdated);
                return true;
            }
            return false;
        }
        // source might be targetted in modes: oneWayToSource, twoWay
        if (source && mode >= 3) {
            this._sourceOption = listen.call(this, source, this.get_path());
        }
        // target might be targetted in modes: oneTime, oneWay, twoWay
        if (target && mode <= 3) {
            this._targetOption = listen.call(this, target, this.get_targetProperty());
        }
    },
    _isChecked: function Binding$_isChecked(element, name) {
        return (name === "checked") && (element.tagName.toLowerCase() === "input");
    },
    _optionsUpdated: function Binding$_optionsUpdated(select) {
        if (!this._disposed) {
            this.update(select === this.get_source() ? 4/*oneWayToSource*/ : 2/*oneWay*/);
        }
    },
    _sourceChanged: function Binding$_sourceChanged(force) {
        // Dev10 576810: may be called even though we removed the handler
        if (this._disposed) return;
        force = force === true;
        // Update the target on source changed. Retrieve the updated value from source and data path.
        var er,
            target = this.get_target(),
            source = this.get_source();
        if (!target) return;
        source = (source && this._pathArray)
                    ? this._getPropertyFromIndex(source, this._pathArray, 0, this._pathArray.length - 1)
                    : source;
        if (!this._updateSource && (force || (source !== this._lastSource))) {
            try {
                this._updateTarget = true;
                this._lastSource = this._lastTarget = source;
                if (this._convertFn) {
                    if (this._ignoreErrors) {
                        try {
                            source = this._convertFn(source, this);
                        }
                        catch (er) {}
                    }
                    else {
                        source = this._convertFn(source, this);
                    }
                }
                if ((source === null) || (typeof(source) === "undefined")) {
                    source = this.get_defaultValue();
                }
                if (this._targetProperty && this._targetProperty.startsWith("class:")) {
                    var className = this._targetProperty.substr(6).trim();
                    source ? Sys.UI.DomElement.addCssClass(target, className) : Sys.UI.DomElement.removeCssClass(target, className);
                }
                else {
                    var targetArrayLength = this._targetPropertyArray.length;
                    target = this._getPropertyFromIndex(target, this._targetPropertyArray, 0, targetArrayLength - 2);
                    if ((target !== null) && (typeof(target) !== "undefined")) {
                        var name = this._targetPropertyArray[targetArrayLength - 1],
                            isElement = Sys.UI.DomElement.isDomElement(target);
                        if (isElement) {
                            source = Sys.UI.Template._checkAttribute(name, source) || "";
                        }
                        if (isElement && (name === "innerHTML" || name === "innerText")) {
                            Sys.Application._clearContent(target);
                            if (name === "innerHTML") {
                                target.innerHTML = source;
                            }
                            else {
                                target.appendChild(document.createTextNode(source));
                            }
                            Sys.Observer.raisePropertyChanged(target, name);
                        }
                        else {
                            // call the private version for perf. Shown to significantly improve perf
                            // in debug mode as it avoids a whole tree of validateParams, enough to avoid
                            // the "runaway script" warning on a page with a lot of bindings.
                            Sys.Observer._setValue(target, name, source);
                        }
                        if (source && isElement && this._isChecked(target, name)) {
                            // in IE, setting 'checked=true' on an unrooted input element does not take effect
                            // once it is rooted. To set the initial checked state of a checkbox
                            // you must use set setAttributeNode, not element.checked.
                            var a = document.createAttribute(name);
                            a.nodeValue = name;
                            target.setAttributeNode(a);
                        }
                    }
                }
            }
            finally {
                this._updateTarget = false;
            }
        }
        if (!force) {
            this._watchObject(this.get_source(), true);
        }
    },
    _targetChanged: function Binding$_targetChanged(force) {
        // Dev10 576810: may be called even though we removed the handler
        if (this._disposed) return;
        force = force === true;
        // Update the source on target changed. Retrieve the updated value from target and data path.
        var target = this.get_target(),
            source = this.get_source();
        if (!source) return;
        target = !target ? null : this._getPropertyFromIndex(target, this._targetPropertyArray, 
                                                0, this._targetPropertyArray.length - 1);
        if (!this._updateTarget && (force || (target !== this._lastTarget))) {
            try {
                this._updateSource = true;
                this._lastTarget = this._lastSource = target;
                if (this._convertBackFn) {
                    if (this._ignoreErrors) {
                        try {
                            target = this._convertBackFn(target, this);
                        }
                        catch (e) {}
                    }
                    else {
                        target = this._convertBackFn(target, this);
                    }
                }
                if (this._pathArray) {
                    var sourceArrayLength = this._pathArray.length;
                    source = this._getPropertyFromIndex(source, this._pathArray, 0, sourceArrayLength - 2);
                    if ((source !== null) && (typeof(source) !== "undefined")) {                     
                        var name = this._pathArray[sourceArrayLength - 1],
                            isElement = Sys.UI.DomElement.isDomElement(source);
                        if (isElement) {
                            target = Sys.UI.Template._checkAttribute(name, target);
                            if (name === "innerHTML") {
                                Sys.Application._clearContent(source);
                            }
                        }
                        // call the private version for perf. Shown to significantly improve perf
                        // in debug mode as it avoids a whole tree of validateParams, enough to avoid
                        // the "runaway script" warning on a page with a lot of bindings.
                        Sys.Observer._setValue(source, name, target);
                        if (target && isElement && this._isChecked(source, name)) {
                            // in IE, setting 'checked=true' on an unrooted input element does not take effect
                            // once it is rooted. To set the initial checked state of a checkbox
                            // you must use set setAttributeNode, not element.checked.
                            var a = document.createAttribute(name);
                            a.nodeValue = name;
                            source.setAttributeNode(a);
                        }
                    }
                }
            }
            finally {
                this._updateSource = false;
            }
        }
        if (!force) {
            this._watchObject(this.get_target());
        }
    },
    _resolveReference: function Binding$_resolveReference(str) {
        var ref = Sys.get(str, this.get_templateContext());
        //#if DEBUG
        // todo: be tolerent?
        if ((ref === null) || (typeof(ref) === "undefined")) {
            throw Error.invalidOperation(String.format(Sys.UI.TemplatesRes.unresolvedReference, str));
        }
        //#endif
        return ref || null;
    }
}
$type._disposeBindings = function Binding$_disposeBindings() {
    // Method to dispose all the bindings that are attached to an element.
    var bindings = this.__msajaxbindings;    
    if (bindings) {
        for(var i = 0, l = bindings.length; i < l; i++) {
            bindings[i].dispose();
        }
    }
    this.__msajaxbindings = null;
}
$type.registerClass("Sys.Binding", Sys.Component, Sys.UI.ITemplateContextConsumer);
Sys.converters = Sys.converters || {};

$type._bindThis = function (propertyOrOptions, source, path, options) {
    if (arguments.length > 1) {
        options = merge({
            targetProperty: propertyOrOptions,
            source: source,
            path: path
        }, options);
    }
    else {
        options = propertyOrOptions;
    }
    this.each(function() {
        options.target = this;
        Sys.binding(options);
    });
    return this;
}

Sys.registerPlugin({
    name: "binding",
    global: true,
    //#if DEBUG
    returnType: "Sys.Binding",
    description: "Creates a binding between two objects.",
    parameters: [
        { name: "targetOrOptions", description: "&lt;target: The target to bind to.??&gt; OR &lt;options (object): An object containing fields for each of the desired Sys.Binding properties to set&gt;" },
        { name: "property", description: "The property or attribute of the target to bind to." },
        { name: "source", description: "The object to bind from." },
        { name: "path", type: "String", description: "The property or dotted property path on the source object to bind from." },
        { name: "options", type: "Object", description: "An object containing fields for each of the desired Sys.Binding properties to set." }
    ],
    //#endif
    plugin: function(targetOrOptions, property, source, path, options) {
        if (arguments.length > 1) {
            options = merge({
                target: targetOrOptions,
                targetProperty: property,
                source: source,
                path: path,
                templateContext: Sys._isInstanceOfType(Sys.UI.TemplateContext, this) ? this : null
            }, options);
        }
        else {
            options = targetOrOptions;
        }
        var value = options.mode;
        if (typeof(value) === "string") {
            options.mode = Sys.BindingMode.parse(value);
        }
        value = options.ignoreErrors;
        if (typeof(value) === "string") {
            options.ignoreErrors = Boolean.parse(value);
        }
        var binding = new Sys.Binding();
        forIn(options, function(v, n) {
            if (typeof(v) !== "undefined") Sys.Observer.setValue(binding, n, v);
        });
        binding.initialize();
        return binding;
    }
});

Sys.registerPlugin({
    name: "domBinding",
    functionName: "binding",
    dom: true,
    //#if DEBUG
    returnType: "Sys.ElementSet",
    description: "Binds the set of objects to a given source.",
    parameters: [
        { name: "propertyOrOptions", description: "&lt;property (string): The property or attribute of the target to bind to&gt; OR &lt;options (object): An object containing fields for each of the desired Sys.Binding properties to set&gt;" },
        { name: "source", description: "The source object to bind to." },
        { name: "path", type:"String", description: "The property or dotted property path on the source object to bind to." },
        { name: "options", type:"Object", description: "An object containing fields for each of the desired Sys.Binding properties to set." }
    ],
    //#endif
    plugin: Sys.Binding._bindThis
});

Sys.registerPlugin({
    name: "componentBinding",
    functionName: "binding",
    components: true,
    //#if DEBUG
    returnType: "Sys.ComponentSet",
    description: "Binds the set of objects to a given source.",
    parameters: [
        { name: "propertyOrOptions", description: "&lt;property (string): The property or attribute of the target to bind to&gt; OR &lt;options (object): An object containing fields for each of the desired Sys.Binding properties to set&gt;" },
        { name: "source", description: "The source object to bind to." },
        { name: "path", type:"String", description: "The property or dotted property path on the source object to bind to." },
        { name: "options", type:"Object", description: "An object containing fields for each of the desired Sys.Binding properties to set." }
    ],
    //#endif
    plugin: Sys.Binding._bindThis
});


Sys.Application.registerMarkupExtension(
"binding", 
function(component, targetProperty, templateContext, properties) {
    var options = merge({
        source: templateContext.dataItem,
        templateContext: templateContext,
        target: component,
        targetProperty: targetProperty
    }, properties);
    options.path = options.path || options.$default;
    delete options.$default;
    var binding = Sys.binding(options);
    templateContext.components.push(binding);
}, 
false);
