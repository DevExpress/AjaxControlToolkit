// Name:        MicrosoftAjaxApplicationServices.debug.js
// Assembly:    System.Web.Ajax
// Version:     3.0.31106.22099
// FileVersion: 3.0.31106.0
/// <reference name="MicrosoftAjaxWebServices.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxApplicationServices.js", ["MicrosoftAjaxWebServices.js"]);

Type.registerNamespace('Sys.Services');

Sys._defaultPath = Sys.Services._ProfileService.DefaultWebServicePath;

Sys.Services._ProfileService = function Sys$Services$_ProfileService() {
    /// <summary locid="M:J#Sys.Net.ProfileService.#ctor" />
    if (arguments.length !== 0) throw Error.parameterCount();
    Sys.Services._ProfileService.initializeBase(this);
    this.properties = {};
}
Sys.Services._ProfileService.DefaultWebServicePath = Sys._defaultPath || '';
delete Sys._defaultPath;







    function Sys$Services$_ProfileService$get_defaultLoadCompletedCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Services.ProfileService.defaultLoadCompletedCallback"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._defaultLoadCompletedCallback;
    }
    function Sys$Services$_ProfileService$set_defaultLoadCompletedCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._defaultLoadCompletedCallback = value;
    }

    function Sys$Services$_ProfileService$get_defaultSaveCompletedCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Services.ProfileService.defaultSaveCompletedCallback"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._defaultSaveCompletedCallback;
    }
    function Sys$Services$_ProfileService$set_defaultSaveCompletedCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._defaultSaveCompletedCallback = value;
    }

    function Sys$Services$_ProfileService$get_path() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Services.ProfileService.path"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._path || '';
    }

    function Sys$Services$_ProfileService$load(propertyNames, loadCompletedCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Services.ProfileService.load" />
        /// <param name="propertyNames" type="Array" elementType="String" optional="true" elementMayBeNull="false" mayBeNull="true"></param>
        /// <param name="loadCompletedCallback" type="Function" optional="true" mayBeNull="true"></param>
        /// <param name="failedCallback" type="Function" optional="true" mayBeNull="true"></param>
        /// <param name="userContext" optional="true" mayBeNull="true"></param>
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
    }

    function Sys$Services$_ProfileService$save(propertyNames, saveCompletedCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Services.ProfileService.save" />
        /// <param name="propertyNames" type="Array" elementType="String" optional="true" elementMayBeNull="false" mayBeNull="true"></param>
        /// <param name="saveCompletedCallback" type="Function" optional="true" mayBeNull="true"></param>
        /// <param name="failedCallback" type="Function" optional="true" mayBeNull="true"></param>
        /// <param name="userContext" optional="true" mayBeNull="true"></param>
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
    }


    function Sys$Services$_ProfileService$_clonePropertyNames(arr) {
        var nodups = [];
        var seen = {};
        for (var i=0; i < arr.length; i++) {
            var prop = arr[i];
            if(!seen[prop]) { Array.add(nodups, prop); seen[prop]=true; };
        }
        return nodups;
    }





    function Sys$Services$_ProfileService$_flattenProperties(
propertyNames, properties, groupName) {
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
                count += obj.count; 
                for(var subKey in groupProperties) {
                    var subVal = groupProperties[subKey];
                    flattenedProperties[subKey] = subVal;
                }
            }
            else {
                if(!propertyNames || Array.indexOf(propertyNames, key) !== -1) {
                    flattenedProperties[key] = val;
                    count++; 
                }
            }
        }
        return { value: flattenedProperties, count: count };
    }

    function Sys$Services$_ProfileService$_get_path() {
        var path = this.get_path();
        if (!path.length) {
            path = Sys.Services._ProfileService.DefaultWebServicePath;
        }
        if (!path || !path.length) {
            throw Error.invalidOperation(Sys.Res.servicePathNotSet);
        }
        return path;
    }

    function Sys$Services$_ProfileService$_onLoadComplete(result, context, methodName) {
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
    }

    function Sys$Services$_ProfileService$_onLoadFailed(err, context, methodName) {
        var callback = context[1] || this.get_defaultFailedCallback();
        if (callback) {
            var userContext = context[2] || this.get_defaultUserContext();        
            callback(err, userContext, "Sys.Services.ProfileService.load");
        }
        else {
            Sys.Net.WebServiceProxy._defaultFailedCallback(err, methodName);
        }
    }

    function Sys$Services$_ProfileService$_onSaveComplete(result, context, methodName) {
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
    }

    function Sys$Services$_ProfileService$_onSaveFailed(err, context, methodName) {
        var callback = context[1] || this.get_defaultFailedCallback();
        if (callback) {
            var userContext = context[2] || this.get_defaultUserContext();
            callback(err, userContext, "Sys.Services.ProfileService.save");
        }
        else {
            Sys.Net.WebServiceProxy._defaultFailedCallback(err, methodName);
        }
    }

    function Sys$Services$_ProfileService$_unflattenProperties(properties) {
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
Sys.Services._ProfileService.prototype = {
    _defaultLoadCompletedCallback: null,
    _defaultSaveCompletedCallback: null,
    _path: '',
    _timeout: 0,
    get_defaultLoadCompletedCallback: Sys$Services$_ProfileService$get_defaultLoadCompletedCallback,
    set_defaultLoadCompletedCallback: Sys$Services$_ProfileService$set_defaultLoadCompletedCallback,
    get_defaultSaveCompletedCallback: Sys$Services$_ProfileService$get_defaultSaveCompletedCallback,
    set_defaultSaveCompletedCallback: Sys$Services$_ProfileService$set_defaultSaveCompletedCallback,
    get_path: Sys$Services$_ProfileService$get_path,
    load: Sys$Services$_ProfileService$load,
    save: Sys$Services$_ProfileService$save,
    _clonePropertyNames: Sys$Services$_ProfileService$_clonePropertyNames,    
    _flattenProperties: Sys$Services$_ProfileService$_flattenProperties,
    _get_path: Sys$Services$_ProfileService$_get_path,    
    _onLoadComplete: Sys$Services$_ProfileService$_onLoadComplete,
    _onLoadFailed: Sys$Services$_ProfileService$_onLoadFailed,
    _onSaveComplete: Sys$Services$_ProfileService$_onSaveComplete,
    _onSaveFailed: Sys$Services$_ProfileService$_onSaveFailed,
    _unflattenProperties: Sys$Services$_ProfileService$_unflattenProperties
}
Sys.Services._ProfileService.registerClass('Sys.Services._ProfileService', Sys.Net.WebServiceProxy);

Sys.Services.ProfileGroup = function Sys$Services$ProfileGroup(properties) {
    /// <summary locid="M:J#Sys.Services.ProfileGroup.#ctor" />
    /// <param name="properties" optional="true" mayBeNull="true"></param>
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
Sys.Services.ProfileGroup.registerClass('Sys.Services.ProfileGroup');


Sys._path = Sys.Services.ProfileService._path;
Sys._properties = Sys.Services.ProfileService.properties;

Sys.Services.ProfileService = new Sys.Services._ProfileService();


if (Sys._path) {
    Sys.Services.ProfileService.set_path(Sys._path);
    delete Sys._path;
}
if (Sys._properties) {
    Sys.Services.ProfileService.properties = Sys._properties;
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

Sys.Services._AuthenticationService = function Sys$Services$_AuthenticationService() {
    /// <summary locid="M:J#Sys.Services.AuthenticationService.#ctor" />
    if (arguments.length !== 0) throw Error.parameterCount();
    Sys.Services._AuthenticationService.initializeBase(this);
}
Sys.Services._AuthenticationService.DefaultWebServicePath = Sys._defaultPath || '';
delete Sys._defaultPath;








    function Sys$Services$_AuthenticationService$get_defaultLoginCompletedCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Services.AuthenticationService.defaultLoginCompletedCallback"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._defaultLoginCompletedCallback;
    }
    function Sys$Services$_AuthenticationService$set_defaultLoginCompletedCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._defaultLoginCompletedCallback = value;
    }

    function Sys$Services$_AuthenticationService$get_defaultLogoutCompletedCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Services.AuthenticationService.defaultLogoutCompletedCallback"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._defaultLogoutCompletedCallback;
    }
    function Sys$Services$_AuthenticationService$set_defaultLogoutCompletedCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._defaultLogoutCompletedCallback = value;
    }

    function Sys$Services$_AuthenticationService$get_isLoggedIn() {
        /// <value type="Boolean" locid="P:J#Sys.Services.AuthenticationService.isLoggedIn"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._authenticated;
    }

    function Sys$Services$_AuthenticationService$get_path() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Services.AuthenticationService.path"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._path || '';
    }

    function Sys$Services$_AuthenticationService$login(username, password, isPersistent, customInfo, redirectUrl, loginCompletedCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Services.AuthenticationService.login" />
        /// <param name="username" type="String" mayBeNull="false"></param>
        /// <param name="password" type="String" mayBeNull="true"></param>
        /// <param name="isPersistent" type="Boolean" optional="true" mayBeNull="true"></param>
        /// <param name="customInfo" type="String" optional="true" mayBeNull="true"></param>
        /// <param name="redirectUrl" type="String" optional="true" mayBeNull="true"></param>
        /// <param name="loginCompletedCallback" type="Function" optional="true" mayBeNull="true"></param>
        /// <param name="failedCallback" type="Function" optional="true" mayBeNull="true"></param>
        /// <param name="userContext" optional="true" mayBeNull="true"></param>
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
    }

    function Sys$Services$_AuthenticationService$logout(redirectUrl, logoutCompletedCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Services.AuthenticationService.logout" />
        /// <param name="redirectUrl" type="String" optional="true" mayBeNull="true"></param>
        /// <param name="logoutCompletedCallback" type="Function" optional="true" mayBeNull="true"></param>
        /// <param name="failedCallback" type="Function" optional="true" mayBeNull="true"></param>
        /// <param name="userContext" optional="true" mayBeNull="true"></param>
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
    }

    function Sys$Services$_AuthenticationService$_get_path() {
        var path = this.get_path();
        if(!path.length) {
            path = Sys.Services._AuthenticationService.DefaultWebServicePath;
        }
        if(!path || !path.length) {
            throw Error.invalidOperation(Sys.Res.servicePathNotSet);
        }
        return path;
    }

    function Sys$Services$_AuthenticationService$_onLoginComplete(result, 
context, methodName) {
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
    }

    function Sys$Services$_AuthenticationService$_onLoginFailed(err, context, methodName) {
        var callback = context[6] || this.get_defaultFailedCallback();
        if (callback) {
            var userContext = context[7] || this.get_defaultUserContext();
            callback(err, userContext, "Sys.Services.AuthenticationService.login");
        }
        else {
            Sys.Net.WebServiceProxy._defaultFailedCallback(err, methodName);
        }
    }

    function Sys$Services$_AuthenticationService$_onLogoutComplete(result, context, methodName) {
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
    }

    function Sys$Services$_AuthenticationService$_onLogoutFailed(err, context, methodName) {
        var callback = context[2] || this.get_defaultFailedCallback();
        if (callback) {
            callback(err, context[3], "Sys.Services.AuthenticationService.logout");
        }
        else {
            Sys.Net.WebServiceProxy._defaultFailedCallback(err, methodName);
        }
    }

    function Sys$Services$_AuthenticationService$_setAuthenticated(authenticated) {
        this._authenticated = authenticated;
    }
Sys.Services._AuthenticationService.prototype = {
    _defaultLoginCompletedCallback: null,
    _defaultLogoutCompletedCallback: null,
    _path: '',
    _timeout: 0,
    _authenticated: false,
    get_defaultLoginCompletedCallback: Sys$Services$_AuthenticationService$get_defaultLoginCompletedCallback,
    set_defaultLoginCompletedCallback: Sys$Services$_AuthenticationService$set_defaultLoginCompletedCallback,
    get_defaultLogoutCompletedCallback: Sys$Services$_AuthenticationService$get_defaultLogoutCompletedCallback,
    set_defaultLogoutCompletedCallback: Sys$Services$_AuthenticationService$set_defaultLogoutCompletedCallback,
    get_isLoggedIn: Sys$Services$_AuthenticationService$get_isLoggedIn,
    get_path: Sys$Services$_AuthenticationService$get_path,  
    login: Sys$Services$_AuthenticationService$login,
    logout: Sys$Services$_AuthenticationService$logout,
    _get_path: Sys$Services$_AuthenticationService$_get_path,
    _onLoginComplete: Sys$Services$_AuthenticationService$_onLoginComplete,
    _onLoginFailed: Sys$Services$_AuthenticationService$_onLoginFailed,
    _onLogoutComplete: Sys$Services$_AuthenticationService$_onLogoutComplete,
    _onLogoutFailed: Sys$Services$_AuthenticationService$_onLogoutFailed,
    _setAuthenticated: Sys$Services$_AuthenticationService$_setAuthenticated    
}

Sys.Services._AuthenticationService.registerClass('Sys.Services._AuthenticationService', Sys.Net.WebServiceProxy);


Sys._path = Sys.Services.AuthenticationService._path;
Sys._auth = Sys.Services.AuthenticationService._auth;

Sys.Services.AuthenticationService = new Sys.Services._AuthenticationService();


if (Sys._path) {
    Sys.Services.AuthenticationService.set_path(Sys._path);
    delete Sys._path;
}
if (typeof(Sys._auth) !== "undefined") {
    Sys.Services.AuthenticationService._authenticated = Sys._auth;
    delete Sys._auth;
}
Sys._defaultPath = Sys.Services._RoleService.DefaultWebServicePath;

Sys.Services._RoleService = function Sys$Services$_RoleService() {
    /// <summary locid="M:J#Sys.Services.RoleService.#ctor" />
    if (arguments.length !== 0) throw Error.parameterCount();
    Sys.Services._RoleService.initializeBase(this);
    this._roles = [];
}
Sys.Services._RoleService.DefaultWebServicePath = Sys._defaultPath || '';
delete Sys._defaultPath;







    function Sys$Services$_RoleService$get_defaultLoadCompletedCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Services.RoleService.defaultLoadCompletedCallback"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._defaultLoadCompletedCallback;
    }
    function Sys$Services$_RoleService$set_defaultLoadCompletedCallback(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        this._defaultLoadCompletedCallback = value;
    }

    function Sys$Services$_RoleService$get_path() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Services.RoleService.path"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._path || '';
    }

    function Sys$Services$_RoleService$get_roles() {
        /// <value type="Array" elementType="String" mayBeNull="false" locid="P:J#Sys.Services.RoleService.roles"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return Array.clone(this._roles);
    }

    function Sys$Services$_RoleService$isUserInRole(role) {
        /// <summary locid="M:J#Sys.Services.RoleService.isUserInRole" />
        /// <param name="role" type="String" mayBeNull="false"></param>
        /// <returns type="Boolean"></returns>
        var e = Function._validateParams(arguments, [
            {name: "role", type: String}
        ]);
        if (e) throw e;
        var v = this._get_rolesIndex()[role.trim().toLowerCase()];
        return !!v;
    }

    function Sys$Services$_RoleService$load(loadCompletedCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Services.RoleService.load" />
        /// <param name="loadCompletedCallback" type="Function" optional="true" mayBeNull="true"></param>
        /// <param name="failedCallback" type="Function" optional="true" mayBeNull="true"></param>
        /// <param name="userContext" optional="true" mayBeNull="true"></param>
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
                    {} 
,
                    Function.createDelegate(this, this._onLoadComplete),
                    Function.createDelegate(this, this._onLoadFailed),
                    [loadCompletedCallback, failedCallback, userContext],
                    this.get_timeout());
    }

    function Sys$Services$_RoleService$_get_path() {
        var path = this.get_path();
        if(!path || !path.length) {
            path = Sys.Services._RoleService.DefaultWebServicePath;
        }
        if(!path || !path.length) {
            throw Error.invalidOperation(Sys.Res.servicePathNotSet);
        }
        return path;
    }

    function Sys$Services$_RoleService$_get_rolesIndex() {
        if (!this._rolesIndex) {
            var index = {};
            for(var i=0; i < this._roles.length; i++) {
                index[this._roles[i].toLowerCase()] = true;
            }
            this._rolesIndex = index;
        }
        return this._rolesIndex;
    }

    function Sys$Services$_RoleService$_onLoadComplete(result, context, methodName) {
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
    }

    function Sys$Services$_RoleService$_onLoadFailed(err, context, methodName) {
        var callback = context[1] || this.get_defaultFailedCallback();
        if (callback) {
            var userContext = context[2] || this.get_defaultUserContext();
            callback(err, userContext, "Sys.Services.RoleService.load");
        }
        else {
            Sys.Net.WebServiceProxy._defaultFailedCallback(err, methodName);
        }
    }
Sys.Services._RoleService.prototype = {
    _defaultLoadCompletedCallback: null,
    _rolesIndex: null,
    _timeout: 0,
    _path: '',
    get_defaultLoadCompletedCallback: Sys$Services$_RoleService$get_defaultLoadCompletedCallback,
    set_defaultLoadCompletedCallback: Sys$Services$_RoleService$set_defaultLoadCompletedCallback,
    get_path: Sys$Services$_RoleService$get_path,
    get_roles: Sys$Services$_RoleService$get_roles,
    isUserInRole: Sys$Services$_RoleService$isUserInRole,
    load: Sys$Services$_RoleService$load,
    _get_path: Sys$Services$_RoleService$_get_path,  
    _get_rolesIndex: Sys$Services$_RoleService$_get_rolesIndex,
    _onLoadComplete: Sys$Services$_RoleService$_onLoadComplete,
    _onLoadFailed: Sys$Services$_RoleService$_onLoadFailed
}

Sys.Services._RoleService.registerClass('Sys.Services._RoleService', Sys.Net.WebServiceProxy);


Sys._path = Sys.Services.RoleService._path;
Sys._roles = Sys.Services.RoleService._roles;

Sys.Services.RoleService = new Sys.Services._RoleService();


if (Sys._path) {
    Sys.Services.RoleService.set_path(Sys._path);
    delete Sys._path;
}
if (Sys._roles) {
    Sys.Services.RoleService._roles = Sys._roles;
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

