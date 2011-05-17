// Define the root object (for non-browser hosts)
if (!window) this.window = this;

// Alias Function as Type
window.Type = $type = Function;

// This has undistinguishable perf from compiled a RegExp.
// The regexps here are kept a little too wide to allow for Unicode characters but still
// capture the most obvious developer errors. The JavaScript parser, as well as the checks for
// eval('name') === name will take care of the other errors.
// ********************************************************************************************
// NOTE: update ScriptComponentDescriptor.cs with any change to this expression
// so server and client-side are in sync.
//#if DEBUG
$type.__fullyQualifiedIdentifierRegExp = new RegExp("^[^.0-9 \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\]([^ \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\]*[^. \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\])?$", "i");
$type.__identifierRegExp = new RegExp("^[^.0-9 \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\][^. \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\]*$", "i");
//#endif

$prototype = $type.prototype;
$prototype.callBaseMethod = function Type$callBaseMethod(instance, name, baseArguments) {
    /// <summary locid="M:J#Type.callBaseMethod"></summary>
    /// <param name="instance">The instance for the base method. Usually 'this'.</param>
    /// <param name="name" type="String">The name of the base method.</param>
    /// <param name="baseArguments" type="Array" optional="true" mayBeNull="true" elementMayBeNull="true">The arguments to pass to the base method.</param>
    /// <returns>The return value of the base method.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "instance"},
        {name: "name", type: String},
        {name: "baseArguments", type: Array, mayBeNull: true, optional: true, elementMayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    var baseMethod = Sys._getBaseMethod(this, instance, name);
    //#if DEBUG
    if (!baseMethod) throw Error.invalidOperation(String.format(Sys.Res.methodNotFound, name));
    //#endif
    return baseArguments ? baseMethod.apply(instance, baseArguments) : baseMethod.apply(instance);
}

$prototype.getBaseMethod = function Type$getBaseMethod(instance, name) {
    /// <summary locid="M:J#Type.getBaseMethod">Use this method to get the base implementation of a method from the base class.</summary>
    /// <param name="instance">The instance for which the base method is needed. Usually 'this'.</param>
    /// <param name="name" type="String">The name of the method to get.</param>
    /// <returns type="Function" mayBeNull="true">The base method.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "instance"},
        {name: "name", type: String}
    ]);
    if (e) throw e;
    //#endif
    return Sys._getBaseMethod(this, instance, name);
}

$prototype.getBaseType = function Type$getBaseType() {
    /// <summary locid="M:J#Type.getBaseType"></summary>
    /// <returns type="Type" mayBeNull="true">The base type.</returns>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    return (typeof(this.__baseType) === "undefined") ? null : this.__baseType;
}

$prototype.getInterfaces = function Type$getInterfaces() {
    /// <summary locid="M:J#Type.getInterfaces"></summary>
    /// <returns type="Array" elementType="Type" mayBeNull="false" elementMayBeNull="false">A copy of the list of interfaces that the type implements.</returns>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    var result = [];
    var type = this;
    while(type) {
        var interfaces = type.__interfaces;
        if (interfaces) {
            for (var i = 0, l = interfaces.length; i < l; i++) {
                var interfaceType = interfaces[i];
                if (!Array.contains(result, interfaceType)) {
                    result.push(interfaceType);
                }
            }
        }
        type = type.__baseType;
    }
    return result;
}

$prototype.getName = function Type$getName() {
    /// <summary locid="M:J#Type.getName"></summary>
    /// <returns type="String">The name of the type.</returns>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    return (typeof(this.__typeName) === "undefined") ? "" : this.__typeName;
}

$prototype.implementsInterface = function Type$implementsInterface(interfaceType) {
    /// <summary locid="M:J#Type.implementsInterface"></summary>
    /// <param name="interfaceType" type="Type">The interface to test.</param>
    /// <returns type="Boolean">True if the type implements the interface.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "interfaceType", type: Type}
    ]);
    if (e) throw e;
    //#endif
    this.resolveInheritance();

    var interfaceName = interfaceType.getName();
    var cache = this.__interfaceCache;
    if (cache) {
        var cacheEntry = cache[interfaceName];
        if (typeof(cacheEntry) !== 'undefined') return cacheEntry;
    }
    else {
        cache = this.__interfaceCache = {};
    }

    var baseType = this;
    while (baseType) {
        var interfaces = baseType.__interfaces;
        if (interfaces && Array.indexOf(interfaces, interfaceType) !== -1) {
            return cache[interfaceName] = true;
        }

        baseType = baseType.__baseType;
    }

    return cache[interfaceName] = false;
}

$prototype.inheritsFrom = function Type$inheritsFrom(parentType) {
    /// <summary locid="M:J#Type.inheritsFrom"></summary>
    /// <param name="parentType" type="Type">The type to test.</param>
    /// <returns type="Boolean">True if the type inherits from parentType.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "parentType", type: Type}
    ]);
    if (e) throw e;
    //#endif
    this.resolveInheritance();
    return Sys._inheritsFrom(this, parentType);
}

Sys._inheritsFrom = function _inheritsFrom(type, parentType) {
    var ret;
    if (parentType) {
        var baseType = type.__baseType;
        while (baseType) {
            if (baseType === parentType) {
                ret = true;
                break;
            }
            baseType = baseType.__baseType;
        }
    }
    return !!ret;
}

$prototype.initializeBase = function Type$initializeBase(instance, baseArguments) {
    /// <summary locid="M:J#Type.initializeBase">This method initializes the base type in the context   of a given instance object (to keep track of the base type, and to   effectively inherit the object model of the base class, and   initializing members of the base class).   This should be called from the derived class constructor.</summary>
    /// <param name="instance">The object to initialize base types for. Usually 'this'.</param>
    /// <param name="baseArguments" type="Array" optional="true" mayBeNull="true" elementMayBeNull="true">The arguments for the base constructor.</param>
    /// <returns>The instance.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "instance"},
        {name: "baseArguments", type: Array, mayBeNull: true, optional: true, elementMayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    if (!Sys._isInstanceOfType(this, instance)) throw Error.argumentType('instance', Object.getType(instance), this);
    //#endif

    this.resolveInheritance();
    var baseType = this.__baseType;
    if (baseType) {
        baseArguments ? baseType.apply(instance, baseArguments) : baseType.apply(instance);
    }

    return instance;
}

$prototype.isImplementedBy = function Type$isImplementedBy(instance) {
    /// <summary locid="M:J#Type.isImplementedBy"></summary>
    /// <param name="instance" mayBeNull="true">The object on which the interface must be tested.</param>
    /// <returns type="Boolean">True if the instance implements the interface.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "instance", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    if (typeof(instance) === "undefined" || instance === null) return false;

    var instanceType = Object.getType(instance);
    return !!(instanceType.implementsInterface && instanceType.implementsInterface(this));
}

$prototype.isInstanceOfType = function Type$isInstanceOfType(instance) {
    /// <summary locid="M:J#Type.isInstanceOfType"></summary>
    /// <param name="instance" mayBeNull="true">The object on which the type must be tested.</param>
    /// <returns type="Boolean">True if the object is an instance of the type or one of its derived types.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "instance", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    return Sys._isInstanceOfType(this, instance);
}

$prototype.registerClass = function Type$registerClass(typeName, baseType, interfaceTypes) {
    /// <summary locid="M:J#Type.registerClass">Registers a class (represented by its ctor function), and   optional base type, followed by any number of interfaces.</summary>
    /// <param name="typeName" type="String">The fully-qualified name of the type.</param>
    /// <param name="baseType" type="Type" optional="true" mayBeNull="true">The base type.</param>
    /// <param name="interfaceTypes" parameterArray="true" type="Type">One or several interfaces that the type implements.</param>
    /// <returns type="Type">The registered type.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "typeName", type: String},
        {name: "baseType", type: Type, mayBeNull: true, optional: true},
        {name: "interfaceTypes", type: Type, parameterArray: true}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    if (!Type.__fullyQualifiedIdentifierRegExp.test(typeName)) throw Error.argument('typeName', Sys.Res.notATypeName);
    // Check if the type name parses to an existing object that matches this.
    var parsedName;
    try {
        // note: would like to use window.eval() here instead of eval().
        // however, window.eval() is a no-op in the VS intellisense environment
        parsedName = eval(typeName);
    }
    catch(e) {
        throw Error.argument('typeName', Sys.Res.argumentTypeName);
    }
    if (parsedName !== this) throw Error.argument('typeName', Sys.Res.badTypeName);
    // Check for double registrations
    if (Sys.__registeredTypes[typeName]) throw Error.invalidOperation(String.format(Sys.Res.typeRegisteredTwice, typeName));

    // We never accept undefined for this parameter because this is the only way we can catch
    // registerClass("Sys.Foo", Sys.BArWithATypo, Sys.ISomeInterface).
    if ((arguments.length > 1) && (typeof(baseType) === 'undefined')) throw Error.argumentUndefined('baseType');
    //#endif
    var prototype = this.prototype;
    prototype.constructor = this;
    this.__typeName = typeName;
    this.__class = true;
    if (baseType) {
        this.__baseType = baseType;
        this.__basePrototypePending = true;
    }
    // Saving a case-insensitive index of the registered types on each namespace
    Sys.__upperCaseTypes[typeName.toUpperCase()] = this;

    // It is more performant to check "if (interfaceTypes)" than "if (arguments.length > 2)".
    // Accessing the arguments array is relatively expensive, so we only want to do so if there
    // are actually interface parameters.
    if (interfaceTypes) {
        var interfaces = this.__interfaces = [];
        //#if DEBUG
        this.resolveInheritance();
        //#endif
        for (var i = 2, l = arguments.length; i < l; i++) {
            var interfaceType = arguments[i];
            //#if DEBUG
            if (!interfaceType.__interface) throw Error.argument('interfaceTypes[' + (i - 2) + ']', Sys.Res.notAnInterface);
            for (var methodName in interfaceType.prototype) {
                var method = interfaceType.prototype[methodName];
                if (!prototype[methodName]) {
                    prototype[methodName] = method;
                }
            }
            //#endif
            interfaces.push(interfaceType);
        }
    }
    //#if DEBUG
    Sys.__registeredTypes[typeName] = true;
    //#endif
    return this;
}

Sys.registerComponent = function registerComponent(type, options) {
    /// <summary locid="M:J#Sys.registerComponent">Generates a create() function for the given type using the optional description and parameters for intellisense.</summary>
    /// <param name="type" type="Function">The type to be created.</param>
    /// <param name="options" type="Object" optional="true" mayBeNull="true"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "type", type: Function},
        {name: "options", type: Object, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    var typeName = type.getName();
    var isControlOrBehavior = Sys.UI && (Sys._inheritsFrom(type, Sys.UI.Control) || Sys._inheritsFrom(type, Sys.UI.Behavior));
    var name = (options && options.name);
    if (!name) {
        name = typeName;
        var i = name.lastIndexOf('.');
        if (i >= 0) {
            // if it is a type name, like Sys.UI.DataView,
            // we make 'DataView' the component name, but with a 
            // lowercase first letter to convert to camel case
            name = name.substr(i+1);
            // private type
            if (name && name.charAt(0) === "_") return;
        }
        name = name.substr(0, 1).toLowerCase() + name.substr(1);
    }
    if (!options) {
        options = {};
    }
    options.name = name;
    options.type = type;
    options.typeName = typeName;
    options._isBehavior = isControlOrBehavior;
    
    options = Sys.components[name] = merge(Sys.components[name], options);

    var fn = Sys._getCreate(options),
        target = isControlOrBehavior ? Sys.ElementSet.prototype : Sys.create;
    target[name] = fn;
}

Sys.registerPlugin = function registerPlugin(pluginInfo) {
    /// <summary locid="M:J#Sys.registerPlugin"></summary>
    /// <param name="pluginInfo" type="Object">An object describing the plugin (name, plugin, dom, global, components)</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "pluginInfo", type: Object}
    ]);
    if (e) throw e;
    //#endif
    var name = pluginInfo.name,
        fnName = pluginInfo.functionName || name;
    Sys.plugins[name] = merge(Sys.plugins[name], pluginInfo);
    var plugin = pluginInfo.plugin,
        sysTarget;
    if (pluginInfo.global) {
        sysTarget = Sys;
    }
    else if (pluginInfo.dom) {
        sysTarget = Sys.ElementSet.prototype;
    }
    else if (pluginInfo.components) {
        sysTarget = Sys.ComponentSet.prototype;
    }
    if (sysTarget) {
        sysTarget[fnName] = Sys._getCreate(pluginInfo, true);
    }
}

Sys._createComp = function _createComp(component, defaults, args) {
    var type = component.type,
        parameters = component.parameters || [],
        isBehavior = component._isBehavior,
        target = isBehavior ? args[0] : null;
    var props = args[parameters.length] || {};
    props = merge({}, defaults, props);
    // stuff the normal arguments into the props argument before calling Sys._create.
    // For example, Sys.create.foo(/*param1*/a, /*param2*/b, { c: c })
    // becomes the same as: Sys.create.foo(null, null, { param1: a, param2: b, c: c })
    foreach(parameters, function(parameter, i) {
        var name = typeof(parameter) === "string" ? parameter : parameter.name,
            value = args[i];
        // values already in the properties dictionary have precedence
        if (typeof(value) !== "undefined" && typeof(props[name]) === "undefined") {
            props[name] = value;
        }
    });
    if (this instanceof Sys.ElementSet) {
        var components = [];
        this.each(function() {
            components.push(Sys._create(type, props, this));
        });
        return new Sys.ComponentSet(this, components);
    }
    else {
        return Sys._create(type, props);
    }
}

Sys._create = function _create(type, properties, target) {
    var targetType = typeof(target);
    if (targetType === "string") {
        target = Sys.get(target);
    }
    var instance;
    Sys._2Pass(function() {
        instance = targetType === "undefined" ? new type() : new type(target);
        callIf(instance, "beginUpdate");
        Sys._set(instance, properties);
        // compatibility with created components with Sys.Application in ComponentModel.js
        // call its _register method so it is registered with Sys.Application (which also takes
        // care of calling endUpdate/initialize.
        var componentType = Sys.Component;
        if (!componentType || !componentType._register(instance)) {
            callIf(instance, "endUpdate") || callIf(instance, "initialize");
        }
    });    
    return instance;
}

$prototype.registerInterface = function Type$registerInterface(typeName) {
    /// <summary locid="M:J#Type.registerInterface">Registers an interface (represented by its ctor function).</summary>
    /// <param name="typeName" type="String">The fully-qualified name of the interface.</param>
    /// <returns type="Type">The registered interface.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "typeName", type: String}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    if (!Type.__fullyQualifiedIdentifierRegExp.test(typeName)) throw Error.argument('typeName', Sys.Res.notATypeName);
    // Check if the type name parses to an existing object that matches this.
    var parsedName;
    try {
        // note: would like to use window.eval() here instead of eval().
        // however, window.eval() is a no-op in the VS intellisense environment
        parsedName = eval(typeName);
    }
    catch(e) {
        throw Error.argument('typeName', Sys.Res.argumentTypeName);
    }
    if (parsedName !== this) throw Error.argument('typeName', Sys.Res.badTypeName);
    // Check for double registrations
    if (Sys.__registeredTypes[typeName]) throw Error.invalidOperation(String.format(Sys.Res.typeRegisteredTwice, typeName));
    //#endif
    // Saving a case-insensitive index of the registered types on each namespace
    Sys.__upperCaseTypes[typeName.toUpperCase()] = this;

    this.prototype.constructor = this;
    this.__typeName = typeName;
    this.__interface = true;
    //#if DEBUG
    Sys.__registeredTypes[typeName] = true;
    //#endif

    return this;
}

$prototype.resolveInheritance = function Type$resolveInheritance() {
    /// <summary locid="M:J#Type.resolveInheritance">This method is called on the ctor function instance. It does three things: 1. It stores __baseType as a property of the constructor function 2. It copies members from the baseType's prototype into the  prototype associated with the type represented by this ctor,  if this type itself doesn't have the same member in its prototype,  i.e., it doesn't override the method. 3. It recurses up the inheritance chain to do the same for the base type.  Note that this logic runs only once per type, because it  is based on true value for __basePrototypePending property  off the ctor function.</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif

    if (this.__basePrototypePending) {
        var baseType = this.__baseType;

        baseType.resolveInheritance();
        var basePrototype = baseType.prototype,
            thisPrototype = this.prototype;
        for (var memberName in basePrototype) {
            thisPrototype[memberName] = thisPrototype[memberName] || basePrototype[memberName];
        }
        delete this.__basePrototypePending;
    }
}

$type.getRootNamespaces = function Type$getRootNamespaces() {
    /// <summary locid="M:J#Type.getRootNamespaces"></summary>
    /// <returns type="Array">Returns an array containing references to all the root namespaces</returns>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    return Array.clone(Sys.__rootNamespaces);
}

$type.isClass = function Type$isClass(type) {
    /// <summary locid="M:J#Type.isClass"></summary>
    /// <param name="type" mayBeNull="true">The type to test.</param>
    /// <returns type="Boolean">True if the type is a class.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "type", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    return !!(type && type.__class);
}

$type.isInterface = function Type$isInterface(type) {
    /// <summary locid="M:J#Type.isInterface"></summary>
    /// <param name="type" mayBeNull="true">The type to test.</param>
    /// <returns type="Boolean">True if the type is an interface.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "type", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    return !!(type && type.__interface);
}

$type.isNamespace = function Type$isNamespace(object) {
    /// <summary locid="M:J#Type.isNamespace"></summary>
    /// <param name="object" mayBeNull="true">The type to test.</param>
    /// <returns type="Boolean">True if the object is a namespace.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "object", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    return !!(object && object.__namespace);
}

$type.parse = function Type$parse(typeName, ns) {
    /// <summary locid="M:J#Type.parse">If a namespace is specified, the type name is searched for on this namespace in a  case-insensitive way.  If no namespace is specified, the fully-qualified, case-sensitive type name must be specified.</summary>
    /// <param name="typeName" type="String" mayBeNull="true">The name of the type.</param>
    /// <param name="ns" optional="true" mayBeNull="true">The namespace where to look for the type.</param>
    /// <returns type="Type" mayBeNull="true">The type or null.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "typeName", type: String, mayBeNull: true},
        {name: "ns", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    var fn;
    if (ns) {
        fn = Sys.__upperCaseTypes[ns.getName().toUpperCase() + '.' + typeName.toUpperCase()];
        return fn || null;
    }
    if (!typeName) return null;
    var htClasses = Type.__htClasses;
    if (!htClasses) {
        Type.__htClasses = htClasses = {};
    }
    fn = htClasses[typeName];
    if (!fn) {
        fn = window.eval(typeName);
        //#if DEBUG
        if (typeof(fn) !== 'function') throw Error.argument('typeName', Sys.Res.notATypeName);
        //#endif
        htClasses[typeName] = fn;
    }
    return fn;
}

$type.registerNamespace = function Type$registerNamespace(namespacePath) {
    /// <summary locid="M:J#Type.registerNamespace">Creates a namespace.</summary>
    /// <param name="namespacePath" type="String">The full path of the namespace.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "namespacePath", type: String}
    ]);
    if (e) throw e;
    //#endif
    // in debug mode, the private version does all the work to enable bypassing
    // the parameter validation in debug mode when registering 'Sys'.
    Type._registerNamespace(namespacePath);
}
$type._registerNamespace = function Type$_registerNamespace(namespacePath) {
    //#if DEBUG
    if (!Type.__fullyQualifiedIdentifierRegExp.test(namespacePath)) throw Error.argument('namespacePath', Sys.Res.invalidNameSpace);
    //#endif
    var rootObject = window;
    var namespaceParts = namespacePath.split('.');

    for (var i = 0, l = namespaceParts.length; i < l; i++) {
        var currentPart = namespaceParts[i];
        var ns = rootObject[currentPart];
        //#if DEBUG
        var nsType = typeof(ns);
        if ((nsType !== "undefined") && (ns !== null)) {
            if (nsType === "function") {
                throw Error.invalidOperation(String.format(Sys.Res.namespaceContainsClass, namespaceParts.splice(0, i + 1).join('.')));
            }
            if ((typeof(ns) !== "object") || (ns instanceof Array)) {
                throw Error.invalidOperation(String.format(Sys.Res.namespaceContainsNonObject, namespaceParts.splice(0, i + 1).join('.')));
            }
        }
        //#endif
        if (!ns) {
            ns = rootObject[currentPart] = {};
        }
        if (!ns.__namespace) {
            if (!i && (namespacePath !== "Sys")) {
                Sys.__rootNamespaces.push(ns);
            }
            ns.__namespace = true;
            ns.__typeName = namespaceParts.slice(0, i + 1).join('.');
            //#if DEBUG
            var parsedName;
            try {
                // note: would like to use window.eval() here instead of eval().
                // however, window.eval() is a no-op in the VS intellisense environment
                parsedName = eval(ns.__typeName);
            }
            catch(e) {
                parsedName = null;
            }
            if (parsedName !== ns) {
                delete rootObject[currentPart];
                throw Error.argument('namespacePath', Sys.Res.invalidNameSpace);
            }
            //#endif
            ns.getName = function ns$getName() {return this.__typeName;}
        }
        rootObject = ns;
    }
}

$type._checkDependency = function Type$_checkDependency(dependency, featureName) {
    var scripts = Type._registerScript._scripts, isDependent = (scripts ? (!!scripts[dependency]) : false);
    if ((typeof(featureName) !== 'undefined') && !isDependent) {
        throw Error.invalidOperation(String.format(Sys.Res.requiredScriptReferenceNotIncluded, 
        featureName, dependency));
    }
    return isDependent;
}

$type._registerScript = function Type$_registerScript(scriptName, dependencies) {
    var scripts = Type._registerScript._scripts;
    if (!scripts) {
        Type._registerScript._scripts = scripts = {};
    }
    if (scripts[scriptName]) {
        throw Error.invalidOperation(String.format(Sys.Res.scriptAlreadyLoaded, scriptName));
    }
    scripts[scriptName] = true;
    if (dependencies) {
        for (var i = 0, l = dependencies.length; i < l; i++) {
            var dependency = dependencies[i];
            if (!Type._checkDependency(dependency)) {
                throw Error.invalidOperation(String.format(Sys.Res.scriptDependencyNotFound, scriptName, dependency));
            }
        }
    }
}

$type._registerNamespace("Sys");
Sys.__upperCaseTypes = {};
Sys.__rootNamespaces = [Sys];
//#if DEBUG
Sys.__registeredTypes = {};
//#endif

// a private version of getBaseMethod and isInstanceOfType allows for other public APIs to call getBaseMethod without
// causing a re-validation of the arguments. It's only debug mode, but the perf of debug mode was so bad in some cases
// due to validation that it causes the browser to warn of a run-away script. Even in debug mode it's still important
// we have reasonable perf, and avoiding re-validation of public facing parameters is the primary way to do that.
// The private versions are on Sys to avoid adding another function to the prototype of every function.
Sys._isInstanceOfType = function _isInstanceOfType(type, instance) {
    if (typeof(instance) === "undefined" || instance === null) return false;
    if (instance instanceof type) return true;
    var instanceType = Object.getType(instance);
    return !!(instanceType === type) ||
           (instanceType.inheritsFrom && instanceType.inheritsFrom(type)) ||
           (instanceType.implementsInterface && instanceType.implementsInterface(type));
}

// getBaseMethod's validateParameters was shown to be a huge portion of the time spent disposing of a large
// number of components on a page, where they all call type.callBaseMethod, which also calls getBaseMethod. 
Sys._getBaseMethod = function _getBaseMethod(type, instance, name) {
    //#if DEBUG
    if (!Sys._isInstanceOfType(type, instance)) throw Error.argumentType('instance', Object.getType(instance), type);
    //#endif
    var baseType = type.getBaseType();
    if (baseType) {
        var baseMethod = baseType.prototype[name];
        return (baseMethod instanceof Function) ? baseMethod : null;
    }
    return null;
}

Sys._isDomElement = function _isDomElement(obj) {
    // Using nodeType to check this is a DOM element for lack of a better test on IE and Safari.
    // This is not entirely foolproof ({nodeType: 1} would seem to be of type Sys.UI.DomElement)
    // but we need something that works cross-browser.
    // Opera and Firefox both have an HTMLElement type of which DOM elements are instances but
    // we're not using it here for consistency.
    var val = false;
    if (typeof (obj.nodeType) !== 'number') {
        // Windows and documents are considered elements even though they are not strictly speaking.
        // No node type may still be window or document.
        // Try to get the document for the element, revert to obj if not found:
        var doc = obj.ownerDocument || obj.document || obj;
        if (doc != obj) {
            // The parameter is not the document, but it may be window.
            // Try to get the window for the document:
            var w = doc.defaultView || doc.parentWindow;
            val = (w != obj);
        }
        else {
            // doc is equal to obj, but we still need to check that it's really a document.
            // Using the body property for lack of a better cross-browser test.
            val = !doc.body || !Sys._isDomElement(doc.body);
        }
    }
    return !val;
}

var isBrowser = Sys._isBrowser = function _isBrowser(name) {
    return Sys.Browser.agent === Sys.Browser[name];
}


// catch up with namespaces created before componentmodel was loaded
foreach(Sys._ns, $type._registerNamespace);
delete Sys._ns;
