    var getCreate = function _getCreate(options, isPlugin, isjQuery) {
        // IN THE LOADER
        //      Creates a new function dynamically that actually has the specified parameters and doc comments for intellisense,
        //      but has no actual implementation.
        // IN CORE
        //      Creates a new function dynamically that actually has the specified parameters and doc comments for intellisense,
        //      and that creates the given control or behavior, or calls the given plugin method.
        // In either case, in release mode no intellisense comments are created. The debug and release sections of this method
        // must correspond to the same logic. Debug only does it differently in order to add comments dynamically to the method
        // which are picked up by VS intellisense. Release mode is done differently in order to keep the size much smaller.
        //#if DEBUG
        var body = [],
            arglist = [],
            type = options.type,
            typeName = options.typeName || (type ? type.getName() : ""),
            isBehavior = options._isBehavior,
            description = (options && options.description) || 
                          (type && ("Creates an instance of the type '" + typeName  + "' and sets the given properties.")) ||
                          "";
        body.push("/// <summary>", description, "</summary>\n");
        foreach(options && options.parameters, function(parameter) {
            var name = parameter, type = '', desc = '';
            if (typeof(parameter) !== "string") {
                name = parameter.name;
                type = parameter.type||'';
                desc = parameter.description||'';
            }
            arglist.push(name);
            body.push('/// <param name="', name, '"');
            if (type) {
                body.push(' type="', type, '"');
            }
            body.push('>', desc, '</param>\n');
        });
        var returnType;
        if (!isPlugin) {
            arglist.push("properties");
            // return type is Sys._jComponentSet only in debug mode in order to get the different intellisense that
            // componentSet.elements() returns a jquery object, not a Sys.ElementSet.
            body.push('/// <param name="properties" type="Object" mayBeNull="true" optional="true">Additional properties to set on the component.</param>\n');
            returnType = ((isjQuery && isBehavior) ? 'Sys._jComponentSet' : (isBehavior ? 'Sys.ComponentSet' : typeName));
        }
        else {
            returnType = options.returnType;
            if (isjQuery && returnType === "Sys.ElementSet") {
                returnType = "jQuery";
            }
        }
        if (returnType) {
            body.push('/// <returns type="', returnType, '" />\n');
        }
        //#if LOADER
        // the loader only mocks the method for intellisense purposes.
        body.push("throw new Error(\"The '", options.name, "' plugin requires Sys.scripts.", options.script.name, " to be loaded with a call to Sys.require() first.\");\n");
        //#else
        // core actually implements it
        if (isPlugin) {
            var name = options.name;
            if (isjQuery && options.dom) {
                body.push('var elementSet = new Sys.ElementSet(this.get());\
var ret = Sys.plugins["', name, '"].plugin.apply(elementSet, arguments);\
if (ret === elementSet) return this;\
if (ret instanceof jQuery) return new Sys.ElementSet(ret.get());\
return ret;');
            }
            else {
                body.push('return Sys.plugins["', name, '"].plugin.apply(this, arguments);');
            }
        }
        else {
            if (isjQuery) {
                body.push('\
var args = arguments,\
    callee = args.callee,\
    component = callee._component,\
    source = Sys.create;\
component.defaults = component.defaults || callee.defaults;\
if (component._isBehavior) {\
    source = new Sys.ElementSet(this.get()),\
    source._jquery = this;\
}\
return source[component.name].apply(source, args);');
            }
            else {
                body.push('return Sys._createComp.call(this, arguments.callee._component, arguments.callee._component.defaults, arguments);');
            }
        }
        //#endif
        arglist.push(body.join(''));
    
        var fn = Function.apply(null, arglist);
        if (!isPlugin) {
            fn._component = options;
        }
        //#if LOADER
        fn._slmock = true;
        //#endif
        return fn;
        
        // end of DEBUG mode
        //#else
        // start of RELEASE mode
        //#if LOADER
        // the loader only mocks the method
        var fn = function() {};
        fn._slmock = true;
        return fn;
        //#else
        // core actually implements it
        if (isPlugin) {
            return (isjQuery && options.dom) ?
                function() {
                    var elementSet = new Sys.ElementSet(this.get());
                    var ret = Sys.plugins[options.name].plugin.apply(elementSet, arguments);
                    if (ret === elementSet) return this;
                    if (ret instanceof jQuery) return new Sys.ElementSet(ret.get());
                    return ret;
                }
                :
                function() {
                    return Sys.plugins[options.name].plugin.apply(this, arguments);
                };
        }
        else {
            var fn = isjQuery ? 
                function() {
                    var args = arguments,
                        callee = args.callee,
                        component = callee._component,
                        source = Sys.create;
                    // if $().foo.defaults exists, overwrite Sys.components.foo.defaults.
                    component.defaults = component.defaults || callee.defaults;
                    if (component._isBehavior) {
                        source = new Sys.ElementSet(this.get()),
                        source._jquery = this;
                    }
                    return source[component.name].apply(source, args);
                }
                :
                function() {
                    var callee = arguments.callee,
                        component = callee._component;
                    return Sys._createComp.call(this, component, component.defaults, arguments);
                };
            fn._component = options;
            return fn;
        }
        //#endif
        //#endif
    }
    // Sys._create in loader should never overwrite the implementation in core (such as when start.js comes after core.js)
    // But Sys.create in core should always overwrite the implementation in the loader (such as when core.js comes after start.js)
    //#if LOADER
    Sys._getCreate = Sys._getCreate || getCreate;
    //#else
    Sys._getCreate = getCreate;
    //#endif