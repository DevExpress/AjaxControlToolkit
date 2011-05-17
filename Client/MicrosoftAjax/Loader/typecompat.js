if (!window.Type) {
    // We have to provide this global 'Type' alias and 'registerNamespace' on it because ScriptManager adds script resources for
    // scripts that support localizationto the bottom, adding a Type.registerNamespace() call to ensure the strings object can be
    // defined within its namespace. We need it to actually work, too, creating the namespaces.
    window.Type = Function;
    Type.registerNamespace = Type.registerNamespace || function registerNamespace(namespacePath) {
        lazypush(Sys, "_ns", namespacePath);
        var rootObject = window;
        foreach(namespacePath.split('.'), function(part) {
            rootObject = rootObject[part] = rootObject[part] || {};
        });
        rootObject = null;
    }
}
