Sys._defaultPath = Sys.Services._AuthenticationService.DefaultWebServicePath;

$type = Sys.Services._AuthenticationService = function Services$_AuthenticationService() {
    /// <summary locid="M:J#Sys.Services.AuthenticationService.#ctor">A proxy to an authentication service.</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
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
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._defaultLoginCompletedCallback;
    },
    set_defaultLoginCompletedCallback: function _AuthenticationService$set_defaultLoginCompletedCallback(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        //#endif
        this._defaultLoginCompletedCallback = value;
    },

    get_defaultLogoutCompletedCallback: function _AuthenticationService$get_defaultLogoutCompletedCallback() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Services.AuthenticationService.defaultLogoutCompletedCallback">Default callback to call when logout completes.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._defaultLogoutCompletedCallback;
    },
    set_defaultLogoutCompletedCallback: function _AuthenticationService$set_defaultLogoutCompletedCallback(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        //#endif
        this._defaultLogoutCompletedCallback = value;
    },

    get_isLoggedIn: function _AuthenticationService$get_isLoggedIn() {
        /// <value type="Boolean" locid="P:J#Sys.Services.AuthenticationService.isLoggedIn">True if the user is currently authenticated.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._authenticated;
    },

    get_path: function _AuthenticationService$get_path() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Services.AuthenticationService.path">Path to an authentication webservice.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        // override from base to ensure returned value is '' even if usercode sets to null.
        // also refactored from v1 to ensure empty string on getter instead of setter.
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
        //#if DEBUG
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
        //#endif
        // note: use of internal type here, but theres no other way
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
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "redirectUrl", type: String, mayBeNull: true, optional: true},
            {name: "logoutCompletedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "failedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "userContext", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        //#endif
        // note: use of internal type here, but theres no other way
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
                // url may be empty which is a valid link
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
        //#if DEBUG
        else {
            Sys.Net.WebServiceProxy._defaultFailedCallback(err, methodName);
        }
        //#endif
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
        
        // always redirect when logging out
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
        //#if DEBUG
        else {
            Sys.Net.WebServiceProxy._defaultFailedCallback(err, methodName);
        }
        //#endif
    },
    
    _setAuthenticated: function _AuthenticationService$_setAuthenticated(authenticated) {
        this._authenticated = authenticated;
    }    
}

$type.registerClass('Sys.Services._AuthenticationService', Sys.Net.WebServiceProxy);

// read compat data
Sys._path = Sys.Services.AuthenticationService._path;
Sys._auth = Sys.Services.AuthenticationService._auth;

$type = Sys.Services.AuthenticationService = new Sys.Services._AuthenticationService();

// apply compat data
if (Sys._path) {
    $type.set_path(Sys._path);
    delete Sys._path;
}
if (typeof(Sys._auth) !== "undefined") {
    $type._authenticated = Sys._auth;
    delete Sys._auth;
}
