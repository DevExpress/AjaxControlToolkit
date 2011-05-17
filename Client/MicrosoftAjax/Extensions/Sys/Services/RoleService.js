Sys._defaultPath = Sys.Services._RoleService.DefaultWebServicePath;

$type = Sys.Services._RoleService = function Services$_RoleService() {
    /// <summary locid="M:J#Sys.Services.RoleService.#ctor"></summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
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
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._defaultLoadCompletedCallback;
    },
    set_defaultLoadCompletedCallback: function _RoleService$set_defaultLoadCompletedCallback(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: Function, mayBeNull: true}]);
        if (e) throw e;
        //#endif
        this._defaultLoadCompletedCallback = value;
    },
    
    get_path: function _RoleService$get_path() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Services.RoleService.path">Path to a role webservice.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        // override from base to ensure returned value is '' even if usercode sets to null, consistent with other appservices in v1.
        return this._path || '';
    },

    get_roles: function _RoleService$get_roles() {
        /// <value type="Array" elementType="String" mayBeNull="false" locid="P:J#Sys.Services.RoleService.roles">An array of role names for the current user.</value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return Array.clone(this._roles);
    },

    isUserInRole: function _RoleService$isUserInRole(role) {
        /// <summary locid="M:J#Sys.Services.RoleService.isUserInRole">Gets a value indicating whether the current user is in the specified role.</summary>
        /// <param name="role" type="String" mayBeNull="false">The name of the role to search in.</param>
        /// <returns type="Boolean"></returns>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "role", type: String}
        ]);
        if (e) throw e;
        //#endif
        var v = this._get_rolesIndex()[role.trim().toLowerCase()];
        return !!v;
    },
    
    load: function _RoleService$load(loadCompletedCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Services.RoleService.load"></summary>
        /// <param name="loadCompletedCallback" type="Function" optional="true" mayBeNull="true">Callback to call when loading has completed.</param>
        /// <param name="failedCallback" type="Function" optional="true" mayBeNull="true">Callback to call if loading fails.</param>
        /// <param name="userContext" optional="true" mayBeNull="true">Custom context passed to the completed or failed callback.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "loadCompletedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "failedCallback", type: Function, mayBeNull: true, optional: true},
            {name: "userContext", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        //#endif
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
        //#if DEBUG
        else {
            Sys.Net.WebServiceProxy._defaultFailedCallback(err, methodName);
        }
        //#endif
    }
}

$type.registerClass('Sys.Services._RoleService', Sys.Net.WebServiceProxy);

// read compat data
Sys._path = Sys.Services.RoleService._path;
Sys._roles = Sys.Services.RoleService._roles;

$type = Sys.Services.RoleService = new Sys.Services._RoleService();

// apply compat data
if (Sys._path) {
    $type.set_path(Sys._path);
    delete Sys._path;
}
if (Sys._roles) {
    $type._roles = Sys._roles;
    delete Sys._roles;
}
