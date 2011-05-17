// (c) 2010 CodePlex Foundation
//!/ <reference name="MicrosoftAjaxWebServices.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxApplicationServices.js", ["MicrosoftAjaxWebServices.js"]);

var $type, $prototype;
Type.registerNamespace('Sys.Services');

Sys._defaultPath = Sys.Services._ProfileService.DefaultWebServicePath;

$type = Sys.Services._ProfileService = function Services$_ProfileService() {
    /// <summary locid="M:J#Sys.Net.ProfileService.#ctor"></summary>
    if (arguments.length !== 0) throw Error.parameterCount();
    Sys.Services._ProfileService.initializeBase(this);
    this.properties = {};
}
$type.DefaultWebServicePath = Sys._defaultPath || '';
delete Sys._defaultPath;

$type.prototype = {
    _defaultLoadCompletedCallback: null,
    _defaultSaveCompletedCallback: null,
    _path: '',
    _timeout: 0,

    get_defaultLoadCompletedCallback: function _ProfileService$get_defaultLoadCompletedCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Services.ProfileService.defaultLoadCompletedCallback">Default callback to call when loading is complete.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._defaultLoadCompletedCallback;
    },
    set_defaultLoadCompletedCallback: function _ProfileService$set_defaultLoadCompletedCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._defaultLoadCompletedCallback = value;
    },

    get_defaultSaveCompletedCallback: function _ProfileService$get_defaultSaveCompletedCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Services.ProfileService.defaultSaveCompletedCallback">Default callback to call when saving is complete.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._defaultSaveCompletedCallback;
    },
    set_defaultSaveCompletedCallback: function _ProfileService$set_defaultSaveCompletedCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._defaultSaveCompletedCallback = value;
    },
    
    get_path: function _ProfileService$get_path() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Services.ProfileService.path">Path to a profile webservice.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._path || '';
    },
        
    load: function _ProfileService$load(propertyNames, loadCompletedCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Services.ProfileService.load"></summary>
        /// <param name="propertyNames" type="Array" elementType="String" optional="true" elementMayBeNull="false" mayBeNull="true">A string array of profile properties to load.</param>
        /// <param name="loadCompletedCallback" type="Function" optional="true" mayBeNull="true">Callback to call when loading has completed.</param>
        /// <param name="failedCallback" type="Function" optional="true" mayBeNull="true">Callback to call if loading fails.</param>
        /// <param name="userContext" optional="true" mayBeNull="true">Custom context passed to the completed or failed callback.</param>
        var e = Function._validateParams(arguments, [
            {name: "propertyNames", type: Array, mayBeNull: true, optional: true, elementType: String},
            {name: "loadCompletedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "failedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "userContext", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        var parameters;
        var methodName;
        if (!propertyNames) {
            methodName = "GetAllPropertiesForCurrentUser";
            parameters = { authenticatedUserOnly: false };
        }
        else {
            methodName = "GetPropertiesForCurrentUser";
            parameters = { properties: this._clonePropertyNames(propertyNames), authenticatedUserOnly: false };
        }

        this._invoke(this._get_path(),
                                        methodName,
                                        false,
                                        parameters,
                                        Function.createDelegate(this, this._onLoadComplete),
                                        Function.createDelegate(this, this._onLoadFailed),
                                        [loadCompletedCallback, failedCallback, userContext]);
    },

    save: function _ProfileService$save(propertyNames, saveCompletedCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Services.ProfileService.save"></summary>
        /// <param name="propertyNames" type="Array" elementType="String" optional="true" elementMayBeNull="false" mayBeNull="true">A string array of profile properties to save.</param>
        /// <param name="saveCompletedCallback" type="Function" optional="true" mayBeNull="true">Callback to call when saving has completed.</param>
        /// <param name="failedCallback" type="Function" optional="true" mayBeNull="true">Callback to call if saving fails.</param>
        /// <param name="userContext" optional="true" mayBeNull="true">Custom context passed to the completed or failed callback.</param>
        var e = Function._validateParams(arguments, [
            {name: "propertyNames", type: Array, mayBeNull: true, optional: true, elementType: String},
            {name: "saveCompletedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "failedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "userContext", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        var flattenedProperties = this._flattenProperties(propertyNames, this.properties);
        this._invoke(this._get_path(),
                                        "SetPropertiesForCurrentUser",
                                        false,
                                        { values: flattenedProperties.value, authenticatedUserOnly: false },
                                        Function.createDelegate(this, this._onSaveComplete),
                                        Function.createDelegate(this, this._onSaveFailed),
                                        [saveCompletedCallback, failedCallback, userContext, flattenedProperties.count]);
    },
    
    _clonePropertyNames: function _ProfileService$_clonePropertyNames(arr) {
        var nodups = [];
        var seen = {};
        for (var i=0; i < arr.length; i++) {
            var prop = arr[i];
            if(!seen[prop]) { Array.add(nodups, prop); seen[prop]=true; };
        }
        return nodups;
    },    

    _flattenProperties: function _ProfileService$_flattenProperties(/*string[]*/propertyNames, properties, groupName) {
        var flattenedProperties = {};
        var val;
        var key;
        var count = 0;
        if (propertyNames && propertyNames.length === 0) {
            return { value: flattenedProperties, count: 0 };
        }

        for (var property in properties) {
            val = properties[property];
            key = groupName ? groupName + "." + property : property;
            if(Sys.Services.ProfileGroup.isInstanceOfType(val)) {
                var obj = this._flattenProperties(propertyNames, val, key);
                var groupProperties = obj.value;
                count += obj.count; // count all the group's properties we're about to merge in
                for(var subKey in groupProperties) {
                    var subVal = groupProperties[subKey];
                    flattenedProperties[subKey] = subVal;
                }
            }
            else {
                if(!propertyNames || Array.indexOf(propertyNames, key) !== -1) {
                    flattenedProperties[key] = val;
                    count++; // keep track of how many properties are in the flattened dictionary
                }
            }
        }
        return { value: flattenedProperties, count: count };
    },
    
    _get_path: function _ProfileService$_get_path() {
        var path = this.get_path();
        if (!path.length) {
            path = Sys.Services._ProfileService.DefaultWebServicePath;
        }
        if (!path || !path.length) {
            throw Error.invalidOperation(Sys.Res.servicePathNotSet);
        }
        return path;
    },    

    _onLoadComplete: function _ProfileService$_onLoadComplete(result, context, methodName) {
        if (typeof(result) !== "object") {
            throw Error.invalidOperation(String.format(Sys.Res.webServiceInvalidReturnType, methodName, "Object"));
        }

        var unflattened = this._unflattenProperties(result);
        for (var name in unflattened) {
            this.properties[name] = unflattened[name];
        }
        
        var callback = context[0] || this.get_defaultLoadCompletedCallback() || this.get_defaultSucceededCallback();
        if (callback) {
            var userContext = context[2] || this.get_defaultUserContext();        
            callback(result.length, userContext, "Sys.Services.ProfileService.load");
        }
    },
    
    _onLoadFailed: function _ProfileService$_onLoadFailed(err, context, methodName) {
        var callback = context[1] || this.get_defaultFailedCallback();
        if (callback) {
            var userContext = context[2] || this.get_defaultUserContext();        
            callback(err, userContext, "Sys.Services.ProfileService.load");
        }
        else {
            Sys.Net.WebServiceProxy._defaultFailedCallback(err, methodName);
        }
    },
    
    _onSaveComplete: function _ProfileService$_onSaveComplete(result, context, methodName) {
        var count = context[3];
        if (result !== null) {
            if (result instanceof Array) {
                count -= result.length;
            }
            else if (typeof(result) === 'number') {
                count = result;
            }
            else {
                throw Error.invalidOperation(String.format(Sys.Res.webServiceInvalidReturnType, methodName, "Array"));
            }
        }
        
        var callback = context[0] || this.get_defaultSaveCompletedCallback() || this.get_defaultSucceededCallback();
        if (callback) {
            var userContext = context[2] || this.get_defaultUserContext();
            callback(count, userContext, "Sys.Services.ProfileService.save");
        }
    },
    
    _onSaveFailed: function _ProfileService$_onSaveFailed(err, context, methodName) {
        var callback = context[1] || this.get_defaultFailedCallback();
        if (callback) {
            var userContext = context[2] || this.get_defaultUserContext();
            callback(err, userContext, "Sys.Services.ProfileService.save");
        }
        else {
            Sys.Net.WebServiceProxy._defaultFailedCallback(err, methodName);
        }
    },
    
    _unflattenProperties: function _ProfileService$_unflattenProperties(properties) {
        var unflattenedProperties = {};
        var dotIndex;
        var val;
        var count = 0;
        for (var key in properties) {
            count++;
            val = properties[key];

            dotIndex = key.indexOf('.');
            if (dotIndex !== -1) {
                var groupName = key.substr(0, dotIndex);
                key = key.substr(dotIndex+1);
                var group = unflattenedProperties[groupName];
                if (!group || !Sys.Services.ProfileGroup.isInstanceOfType(group)) {
                    group = new Sys.Services.ProfileGroup();
                    unflattenedProperties[groupName] = group;
                }
                group[key] = val;
            }
            else {
                unflattenedProperties[key] = val;
            }
        }
        properties.length = count;
        return unflattenedProperties;
    }
}
$type.registerClass('Sys.Services._ProfileService', Sys.Net.WebServiceProxy);

$type = Sys.Services.ProfileGroup = function Services$ProfileGroup(properties) {
    /// <summary locid="M:J#Sys.Services.ProfileGroup.#ctor"></summary>
    /// <param name="properties" optional="true" mayBeNull="true">An object containing the settings for this profile group.</param>
    var e = Function._validateParams(arguments, [
        {name: "properties", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    if (properties) {
        for (var property in properties) {
            this[property] = properties[property];
        }
    }
}
$type.registerClass('Sys.Services.ProfileGroup');

Sys._path = Sys.Services.ProfileService._path;
Sys._properties = Sys.Services.ProfileService.properties;

$type = Sys.Services.ProfileService = new Sys.Services._ProfileService();

if (Sys._path) {
    $type.set_path(Sys._path);
    delete Sys._path;
}
if (Sys._properties) {
    $type.properties = Sys._properties;
    (function(props) {
        for (var name in props) {
            var prop = props[name];
            if (prop && prop._propertygroup) {
                Sys.Services.ProfileService.properties[name] = new Sys.Services.ProfileGroup(prop._propertygroup);
            }
        }
    })(Sys._properties);
    delete Sys._properties;
}

Sys._defaultPath = Sys.Services._AuthenticationService.DefaultWebServicePath;

$type = Sys.Services._AuthenticationService = function Services$_AuthenticationService() {
    /// <summary locid="M:J#Sys.Services.AuthenticationService.#ctor">A proxy to an authentication service.</summary>
    if (arguments.length !== 0) throw Error.parameterCount();
    Sys.Services._AuthenticationService.initializeBase(this);
}
$type.DefaultWebServicePath = Sys._defaultPath || '';
delete Sys._defaultPath;

$type.prototype = {
    _defaultLoginCompletedCallback: null,
    _defaultLogoutCompletedCallback: null,
    _path: '',
    _timeout: 0,
    _authenticated: false,
    
    get_defaultLoginCompletedCallback: function _AuthenticationService$get_defaultLoginCompletedCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Services.AuthenticationService.defaultLoginCompletedCallback">Default callback to call when login completes.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._defaultLoginCompletedCallback;
    },
    set_defaultLoginCompletedCallback: function _AuthenticationService$set_defaultLoginCompletedCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._defaultLoginCompletedCallback = value;
    },

    get_defaultLogoutCompletedCallback: function _AuthenticationService$get_defaultLogoutCompletedCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Services.AuthenticationService.defaultLogoutCompletedCallback">Default callback to call when logout completes.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._defaultLogoutCompletedCallback;
    },
    set_defaultLogoutCompletedCallback: function _AuthenticationService$set_defaultLogoutCompletedCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._defaultLogoutCompletedCallback = value;
    },

    get_isLoggedIn: function _AuthenticationService$get_isLoggedIn() {
        /// <value type="Boolean" locid="P:J#Sys.Services.AuthenticationService.isLoggedIn">True if the user is currently authenticated.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._authenticated;
    },

    get_path: function _AuthenticationService$get_path() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Services.AuthenticationService.path">Path to an authentication webservice.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._path || '';
    },  
    
    login: function _AuthenticationService$login(username, password, isPersistent, customInfo, redirectUrl, loginCompletedCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Services.AuthenticationService.login"></summary>
        /// <param name="username" type="String" mayBeNull="false">The username to authenticate.</param>
        /// <param name="password" type="String" mayBeNull="true">The user's password.</param>
        /// <param name="isPersistent" type="Boolean" optional="true" mayBeNull="true">Whether the issued authentication ticket should be persistent across browser sessions.</param>
        /// <param name="customInfo" type="String" optional="true" mayBeNull="true">Not used. Reserved for future use.</param>
        /// <param name="redirectUrl" type="String" optional="true" mayBeNull="true">A URL to redirect the browser to upon successful authentication. If you omit the redirectUrl parameter or pass null, no redirect will occur.</param>
        /// <param name="loginCompletedCallback" type="Function" optional="true" mayBeNull="true">Callback to be called when login has completed, success or fail.</param>
        /// <param name="failedCallback" type="Function" optional="true" mayBeNull="true">Callback to be called if the authenticaiton webservice fails.</param>
        /// <param name="userContext" optional="true" mayBeNull="true">Custom context passed to the completed or failed callback.</param>
        var e = Function._validateParams(arguments, [
            {name: "username", type: String},
            {name: "password", type: String, mayBeNull: true},
            {name: "isPersistent", type: Boolean, mayBeNull: true, optional: true},
            {name: "customInfo", type: String, mayBeNull: true, optional: true},
            {name: "redirectUrl", type: String, mayBeNull: true, optional: true},
            {name: "loginCompletedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "failedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "userContext", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        this._invoke(this._get_path(), "Login", false,
                                        { userName: username, password: password, createPersistentCookie: isPersistent },
                                        Function.createDelegate(this, this._onLoginComplete),
                                        Function.createDelegate(this, this._onLoginFailed),
                                        [username, password, isPersistent, customInfo, redirectUrl, loginCompletedCallback, failedCallback, userContext]);
    },
    
    logout: function _AuthenticationService$logout(redirectUrl, logoutCompletedCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Services.AuthenticationService.logout">If you omit the redirectUrl parameter or pass null, no redirect will occur.</summary>
        /// <param name="redirectUrl" type="String" optional="true" mayBeNull="true">A URL to redirect the browser to upon successful logout. If you omit the redirectUrl parameter or pass null, a redirect occurs back to the current page.</param>
        /// <param name="logoutCompletedCallback" type="Function" optional="true" mayBeNull="true">Callback to be called when logout has completed, success or fail.</param>
        /// <param name="failedCallback" type="Function" optional="true" mayBeNull="true">Callback to be called if the authenticaiton webservice fails.</param>
        /// <param name="userContext" optional="true" mayBeNull="true">Custom context passed to the completed or failed callback.</param>
        var e = Function._validateParams(arguments, [
            {name: "redirectUrl", type: String, mayBeNull: true, optional: true},
            {name: "logoutCompletedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "failedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "userContext", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        this._invoke(this._get_path(), "Logout", false, {}, 
                                        Function.createDelegate(this, this._onLogoutComplete),
                                        Function.createDelegate(this, this._onLogoutFailed),
                                        [redirectUrl, logoutCompletedCallback, failedCallback, userContext]);
    },
    
    _get_path: function _AuthenticationService$_get_path() {
        var path = this.get_path();
        if(!path.length) {
            path = Sys.Services._AuthenticationService.DefaultWebServicePath;
        }
        if(!path || !path.length) {
            throw Error.invalidOperation(Sys.Res.servicePathNotSet);
        }
        return path;
    },
    
    _onLoginComplete: function _AuthenticationService$_onLoginComplete(result, /*login param list*/context, methodName) {
        if(typeof(result) !== "boolean") {
            throw Error.invalidOperation(String.format(Sys.Res.webServiceInvalidReturnType, methodName, "Boolean"));
        }
        
        var redirectUrl = context[4];
        var userContext = context[7] || this.get_defaultUserContext();
        var callback = context[5] || this.get_defaultLoginCompletedCallback() || this.get_defaultSucceededCallback();
        
        if(result) {
            this._authenticated = true;

            if (callback) {
                callback(true, userContext, "Sys.Services.AuthenticationService.login");
            }
            
            if (typeof(redirectUrl) !== "undefined" && redirectUrl !== null) {
                window.location.href = redirectUrl;
            }
        }
        else if (callback) {
            callback(false, userContext, "Sys.Services.AuthenticationService.login");
        }
    },
    
    _onLoginFailed: function _AuthenticationService$_onLoginFailed(err, context, methodName) {
        var callback = context[6] || this.get_defaultFailedCallback();
        if (callback) {
            var userContext = context[7] || this.get_defaultUserContext();
            callback(err, userContext, "Sys.Services.AuthenticationService.login");
        }
        else {
            Sys.Net.WebServiceProxy._defaultFailedCallback(err, methodName);
        }
    },
    
    _onLogoutComplete: function _AuthenticationService$_onLogoutComplete(result, context, methodName) {
        if(result !== null) {
            throw Error.invalidOperation(String.format(Sys.Res.webServiceInvalidReturnType, methodName, "null"));
        }
        
        var redirectUrl = context[0];
        var userContext = context[3] || this.get_defaultUserContext();
        var callback = context[1] || this.get_defaultLogoutCompletedCallback() || this.get_defaultSucceededCallback();

        this._authenticated = false;
        
        if (callback) {
            callback(null, userContext, "Sys.Services.AuthenticationService.logout");
        }
        
        if(!redirectUrl) {
            window.location.reload();
        }
        else {
            window.location.href = redirectUrl;
        }
    },
    
    _onLogoutFailed: function _AuthenticationService$_onLogoutFailed(err, context, methodName) {
        var callback = context[2] || this.get_defaultFailedCallback();
        if (callback) {
            callback(err, context[3], "Sys.Services.AuthenticationService.logout");
        }
        else {
            Sys.Net.WebServiceProxy._defaultFailedCallback(err, methodName);
        }
    },
    
    _setAuthenticated: function _AuthenticationService$_setAuthenticated(authenticated) {
        this._authenticated = authenticated;
    }    
}

$type.registerClass('Sys.Services._AuthenticationService', Sys.Net.WebServiceProxy);

Sys._path = Sys.Services.AuthenticationService._path;
Sys._auth = Sys.Services.AuthenticationService._auth;

$type = Sys.Services.AuthenticationService = new Sys.Services._AuthenticationService();

if (Sys._path) {
    $type.set_path(Sys._path);
    delete Sys._path;
}
if (typeof(Sys._auth) !== "undefined") {
    $type._authenticated = Sys._auth;
    delete Sys._auth;
}
Sys._defaultPath = Sys.Services._RoleService.DefaultWebServicePath;

$type = Sys.Services._RoleService = function Services$_RoleService() {
    /// <summary locid="M:J#Sys.Services.RoleService.#ctor"></summary>
    if (arguments.length !== 0) throw Error.parameterCount();
    Sys.Services._RoleService.initializeBase(this);
    this._roles = [];
}
$type.DefaultWebServicePath = Sys._defaultPath || '';
delete Sys._defaultPath;

$type.prototype = {
    _defaultLoadCompletedCallback: null,
    _rolesIndex: null,
    _timeout: 0,
    _path: '',

    get_defaultLoadCompletedCallback: function _RoleService$get_defaultLoadCompletedCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Services.RoleService.defaultLoadCompletedCallback">Default callback to call when loading is complete.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._defaultLoadCompletedCallback;
    },
    set_defaultLoadCompletedCallback: function _RoleService$set_defaultLoadCompletedCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._defaultLoadCompletedCallback = value;
    },
    
    get_path: function _RoleService$get_path() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Services.RoleService.path">Path to a role webservice.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._path || '';
    },

    get_roles: function _RoleService$get_roles() {
        /// <value type="Array" elementType="String" mayBeNull="false" locid="P:J#Sys.Services.RoleService.roles">An array of role names for the current user.</value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return Array.clone(this._roles);
    },

    isUserInRole: function _RoleService$isUserInRole(role) {
        /// <summary locid="M:J#Sys.Services.RoleService.isUserInRole">Gets a value indicating whether the current user is in the specified role.</summary>
        /// <param name="role" type="String" mayBeNull="false">The name of the role to search in.</param>
        /// <returns type="Boolean"></returns>
        var e = Function._validateParams(arguments, [
            {name: "role", type: String}
        ]);
        if (e) throw e;
        var v = this._get_rolesIndex()[role.trim().toLowerCase()];
        return !!v;
    },
    
    load: function _RoleService$load(loadCompletedCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Services.RoleService.load"></summary>
        /// <param name="loadCompletedCallback" type="Function" optional="true" mayBeNull="true">Callback to call when loading has completed.</param>
        /// <param name="failedCallback" type="Function" optional="true" mayBeNull="true">Callback to call if loading fails.</param>
        /// <param name="userContext" optional="true" mayBeNull="true">Custom context passed to the completed or failed callback.</param>
        var e = Function._validateParams(arguments, [
            {name: "loadCompletedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "failedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "userContext", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        Sys.Net.WebServiceProxy.invoke(
                    this._get_path(),
                    "GetRolesForCurrentUser",
                    false,
                    {} /* no params*/,
                    Function.createDelegate(this, this._onLoadComplete),
                    Function.createDelegate(this, this._onLoadFailed),
                    [loadCompletedCallback, failedCallback, userContext],
                    this.get_timeout());
    },

    _get_path: function _RoleService$_get_path() {
        var path = this.get_path();
        if(!path || !path.length) {
            path = Sys.Services._RoleService.DefaultWebServicePath;
        }
        if(!path || !path.length) {
            throw Error.invalidOperation(Sys.Res.servicePathNotSet);
        }
        return path;
    },  
    
    _get_rolesIndex: function _RoleService$_get_rolesIndex() {
        if (!this._rolesIndex) {
            var index = {};
            for(var i=0; i < this._roles.length; i++) {
                index[this._roles[i].toLowerCase()] = true;
            }
            this._rolesIndex = index;
        }
        return this._rolesIndex;
    },

    _onLoadComplete: function _RoleService$_onLoadComplete(result, context, methodName) {
        if(result && !(result instanceof Array)) {
            throw Error.invalidOperation(String.format(Sys.Res.webServiceInvalidReturnType, methodName, "Array"));
        }

        this._roles = result;
        this._rolesIndex = null;

        var callback = context[0] || this.get_defaultLoadCompletedCallback() || this.get_defaultSucceededCallback();
        if (callback) {
            var userContext = context[2] || this.get_defaultUserContext();
            var clonedResult = Array.clone(result);
            callback(clonedResult, userContext, "Sys.Services.RoleService.load");
        }
    },

    _onLoadFailed: function _RoleService$_onLoadFailed(err, context, methodName) {
        var callback = context[1] || this.get_defaultFailedCallback();
        if (callback) {
            var userContext = context[2] || this.get_defaultUserContext();
            callback(err, userContext, "Sys.Services.RoleService.load");
        }
        else {
            Sys.Net.WebServiceProxy._defaultFailedCallback(err, methodName);
        }
    }
}

$type.registerClass('Sys.Services._RoleService', Sys.Net.WebServiceProxy);

Sys._path = Sys.Services.RoleService._path;
Sys._roles = Sys.Services.RoleService._roles;

$type = Sys.Services.RoleService = new Sys.Services._RoleService();

if (Sys._path) {
    $type.set_path(Sys._path);
    delete Sys._path;
}
if (Sys._roles) {
    $type._roles = Sys._roles;
    delete Sys._roles;
}
}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("ApplicationServices", null, execute);
}
else {
	execute();
}

})();
