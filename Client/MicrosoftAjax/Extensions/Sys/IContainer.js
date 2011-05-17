$type = Sys.IContainer = function IContainer() {
    //#if DEBUG
    throw Error.notImplemented();
    //#endif
}
//#if DEBUG
$type.prototype = {
    addComponent: function IContainer$addComponent(component) {
        /// <summary locid="M:J#Sys.IContainer.addComponent"></summary>
        /// <param name="component" type="Sys.Component"></param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "component", type: Sys.Component}
        ]);
        if (e) throw e;
        //#endif
        throw Error.notImplemented();
    },
    removeComponent: function IContainer$removeComponent(component) {
        /// <summary locid="M:J#Sys.IContainer.removeComponent"></summary>
        /// <param name="component" type="Sys.Component"></param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "component", type: Sys.Component}
        ]);
        if (e) throw e;
        //#endif
        throw Error.notImplemented();
    },
    findComponent: function IContainer$findComponent(id) {
        /// <summary locid="M:J#Sys.IContainer.findComponent"></summary>
        /// <param name="id" type="String"></param>
        /// <returns type="Sys.Component"></returns>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "id", type: String}
        ]);
        if (e) throw e;
        //#endif
        throw Error.notImplemented();
    },
    getComponents: function IContainer$getComponents() {
        /// <summary locid="M:J#Sys.IContainer.getComponents"></summary>
        /// <returns type="Array" elementType="Sys.Component"></returns>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        throw Error.notImplemented();
    }
}
//#endif
$type.registerInterface("Sys.IContainer");

