// (c) 2010 CodePlex Foundation

//!/ <reference name="MicrosoftAjaxCore.js" />
(function() {

function execute() {
Type._registerScript("MicrosoftAjaxDataContext.js", ["MicrosoftAjaxComponentModel.js", "MicrosoftAjaxCore.js"]);

var $type, $prototype;
var merge = Sys._merge;

Type.registerNamespace("Sys.Net");

$type = Sys.Net.WebServiceOperation = function WebServiceOperation(operation, parameters, httpVerb) {
    /// <summary locid="M:J#Sys.Net.WebServiceOperation.#ctor">Defines a seb service operation.</summary>
    /// <param name="operation"></param>
    /// <param name="parameters" type="Object" mayBeNull="true" optional="true"></param>
    /// <param name="httpVerb" type="String" mayBeNull="true" optional="true"></param>
    /// <field name="operation" locid="F:J#Sys.Net.WebServiceOperation.operation"></field>
    /// <field name="parameters" type="Object" mayBeNull="true" locid="F:J#Sys.Net.WebServiceOperation.parameters"></field>
    /// <field name="httpVerb" type="String" mayBeNull="true" locid="F:J#Sys.Net.WebServiceOperation.httpVerb"></field>
    if (typeof(operation) === "undefined") {
        operation = null;
    }
    this.operation = operation;
    this.parameters = parameters || null;
    this.httpVerb = httpVerb || null;
}
$type.prototype = {
    operation: null,
    parameters: null,
    httpVerb: null
}
$type.registerClass("Sys.Net.WebServiceOperation");


Type.registerNamespace("Sys.Data");

if (!Sys.Data.IDataProvider) {
$type = Sys.Data.IDataProvider = function Data$IDataProvider() {
}
$type.prototype = {
    fetchData: function IDataProvider$fetchData(operation, parameters, mergeOption, httpVerb, succeededCallback, failedCallback, timeout, userContext) {
        /// <summary locid="M:J#Sys.Data.IDataProvider.fetchData">Fetches data from the service.</summary>
        /// <param name="operation">The operation to fetch data with.</param>
        /// <param name="parameters" type="Object" mayBeNull="true" optional="true"></param>
        /// <param name="mergeOption" type="Sys.Data.MergeOption" mayBeNull="true" optional="true">Determines how the returned data is tracked if the DataProvider supports it.</param>
        /// <param name="httpVerb" type="String" mayBeNull="true" optional="true"></param>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="timeout" type="Number" integer="true" mayBeNull="true" optional="true"></param>
        /// <param name="userContext" mayBeNull="true" optional="true"></param>
        /// <returns type="Sys.Net.WebRequest"></returns>
        throw Error.notImplemented();
    }
}
$type.registerInterface("Sys.Data.IDataProvider");
}
if (!Sys.Data.MergeOption) {
$type = Sys.Data.MergeOption = function Data$MergeOption() {
    /// <summary locid="M:J#Sys.Data.MergeOption.#ctor">Describes how an item has changed.</summary>
    /// <field name="appendOnly" type="Number" integer="true" static="true" locid="F:J#Sys.Data.MergeOption.appendOnly"></field>
    /// <field name="overwriteChanges" type="Number" integer="true" static="true" locid="F:J#Sys.Data.MergeOption.overwriteChanges"></field>
    throw Error.notImplemented();
}
$type.prototype = {
    appendOnly: 0,
    overwriteChanges: 1
}
$type.registerEnum("Sys.Data.MergeOption");

}
$type = Sys.Data.DataContext = function Data$DataContext() {
    Sys.Data.DataContext.initializeBase(this);
    this._dataChangedDel = Function.createDelegate(this, this._dataChanged);
    this._items = {};
    this._methods = {};
}
$type.prototype = {
    _useIdentity: false,
    _dirty: false,
    _lastResults: null,
    _items: null,
    _ignoreChange: false,
    _inserts: null,
    _edits: null,
    _deletes: null,
    _changelist: null,
    _hasChanges: false,
    _mergeOption: Sys.Data.MergeOption.overwriteChanges,
    _saverequest: null,
    _saving: false,
    _serviceUri: null,
    _saveOperation: null,
    _saveParameters: null,
    _saveHttpVerb: null,
    _saveTimeout: 0,
    _methods: null,
    get_changes: function DataContext$get_changes() {
        /// <value type="Array" elementType="Sys.Data.ChangeOperation" locid="P:J#Sys.Data.DataContext.changes">Gets the current list of changes.</value>
        var changes = this._changelist;
        if (!changes) {
            this._changelist = changes = [];
        }
        return changes;
    },
    get_createEntityMethod: function DataContext$get_createEntityMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.createEntityMethod"></value>
        return this._methods.createEntity || null;
    },
    set_createEntityMethod: function DataContext$set_createEntityMethod(value) {
        this._methods.createEntity = value;
    },
    get_getIdentityMethod: function DataContext$get_getIdentityMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.getIdentityMethod"></value>
        return this._methods.getIdentity || null;
    },
    set_getIdentityMethod: function DataContext$set_getIdentityMethod(value) {
        if (this.get_isInitialized() && ((this._getIdentityMethod && !value) || (!this._getIdentityMethod && value))) {
            throw Error.invalidOperation(String.format(Sys.Data.DataRes.commonNotAfterInit, "DataContext", "getIdentityMethod"));
        }
        this._methods.getIdentity = value;
        this._useIdentity = !!value;
    },
    get_handleSaveChangesResultsMethod: function DataContext$get_handleSaveChangesResultsMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.handleSaveChangesResultsMethod">The method that is called when a save operation completes.</value>
        return this._methods.handleSaveResults || null;
    },
    set_handleSaveChangesResultsMethod: function DataContext$set_handleSaveChangesResultsMethod(value) {
        this._methods.handleSaveResults = value;
    },
    get_isDeferredPropertyMethod: function DataContext$get_isDeferredPropertyMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.isDeferredPropertyMethod">The method that determines if an entity field is currently a deferred entity link placeholder object.</value>
        return this._methods.isDeferredProperty || null;
    },
    set_isDeferredPropertyMethod: function DataContext$set_isDeferredPropertyMethod(value) {
        this._methods.isDeferredProperty = value;
    },
    get_getNewIdentityMethod: function DataContext$get_getNewIdentityMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.getNewIdentityMethod">The method that is called when a new identity is created for an inserted entity.</value>
        return this._methods.getNewIdentity || null;
    },
    set_getNewIdentityMethod: function DataContext$set_getNewIdentityMethod(value) {
        this._methods.getNewIdentity = value;
    },
    get_getDeferredPropertyFetchOperationMethod: function DataContext$get_getDeferredPropertyFetchOperationMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.getDeferredPropertyFetchOperationMethod">The method that determines the operation necessary to fetch a link to another entity or set of entities.</value>
        return this._methods.getDeferredQuery || null;
    },
    set_getDeferredPropertyFetchOperationMethod: function DataContext$set_getDeferredPropertyFetchOperationMethod(value) {
        this._methods.getDeferredQuery = value;
    },
    get_items: function DataContext$get_items() {
        /// <value type="Object" locid="P:J#Sys.Data.DataContext.items">A dictionary of entities, keyed by their identities as determined by the getIdentityMethod.</value>
        return this._items;
    },
    get_lastFetchDataResults: function DataContext$get_lastFetchDataResults() {
        /// <value mayBeNull="true" locid="P:J#Sys.Data.DataContext.lastFetchDataResults">The data last fetched successfully.</value>
        return this._lastResults || null;
    },
    get_hasChanges: function DataContext$get_hasChanges() {
        /// <value type="Boolean" locid="P:J#Sys.Data.DataContext.hasChanges"></value>
        return this._hasChanges;
    },
    get_fetchDataMethod: function DataContext$get_fetchDataMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.fetchDataMethod"></value>
        return this._methods.fetchData || null;
    },
    set_fetchDataMethod: function DataContext$set_fetchDataMethod(value) {
        this._methods.fetchData = value;
    },
    get_mergeOption: function DataContext$get_mergeOption() {
        /// <value type="Sys.Data.MergeOption" locid="P:J#Sys.Data.DataContext.mergeOption"></value>
        return this._mergeOption;
    },
    set_mergeOption: function DataContext$set_mergeOption(value) {
        this._mergeOption = value;
    },
    get_saveChangesMethod: function DataContext$get_saveChangesMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.saveChangesMethod"></value>
        return this._methods.saveChanges || null;
    },
    set_saveChangesMethod: function DataContext$set_saveChangesMethod(value) {
        this._methods.saveChanges = value;
    },
    get_saveOperation: function DataContext$get_saveOperation() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.DataContext.saveOperation"></value>
        return this._saveOperation || "";
    },
    set_saveOperation: function DataContext$set_saveOperation(value) {
        this._saveOperation = value;
    },
    get_saveHttpVerb: function DataContext$get_saveHttpVerb() {
        /// <value type="String" locid="P:J#Sys.Data.DataContext.saveHttpVerb"></value>
        return this._saveHttpVerb || "POST";
    },
    set_saveHttpVerb: function DataContext$set_saveHttpVerb(value) {
        this._saveHttpVerb = value;
    },
    get_saveParameters: function DataContext$get_saveParameters() {
        /// <value type="Object" mayBeNull="true" locid="P:J#Sys.Data.DataContext.saveParameters">A dictionary of parameters use when saving changes.</value>
        return this._saveParameters;
    },
    set_saveParameters: function DataContext$set_saveParameters(value) {
        this._saveParameters = value;
    },    
    get_saveChangesTimeout: function DataContext$get_saveChangesTimeout() {
        /// <value type="Number" integer="true" locid="P:J#Sys.Data.DataContext.saveChangesTimeout"></value>
        return this._saveTimeout;
    },
    set_saveChangesTimeout: function DataContext$set_saveChangesTimeout(value) {
        this._saveTimeout = value;
    },        
    get_isSaving: function DataContext$get_isSaving() {
        /// <value type="Boolean" locid="P:J#Sys.Data.DataContext.isSaving"></value>
        return this._saving;
    },
    get_serviceUri: function DataContext$get_serviceUri() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.DataContext.serviceUri"></value>
        return this._serviceUri || "";
    },
    set_serviceUri: function DataContext$set_serviceUri(value) {
        this._serviceUri = value;
    },
    addLink: function DataContext$addLink(sourceEntity, sourcePropertyName, targetEntity) {
        /// <summary locid="M:J#Sys.Data.DataContext.addLink"></summary>
        /// <param name="sourceEntity" type="Object"></param>
        /// <param name="sourcePropertyName" type="String"></param>
        /// <param name="targetEntity" type="Object"></param>
        var toggled = this._toggleLink(sourceEntity, sourcePropertyName, targetEntity),
            valueSet = this._setLinkField(true, sourceEntity, sourcePropertyName, targetEntity);
        if (!toggled || (toggled.action !== Sys.Data.ChangeOperationType.remove)) {
            if (valueSet || (toggled && (toggled.action === Sys.Data.ChangeOperationType.insert))) {
                this._registerChange(new Sys.Data.ChangeOperation(Sys.Data.ChangeOperationType.insert,
                    null, sourceEntity, sourcePropertyName, targetEntity));
            }
        }
    },
    removeLink: function DataContext$removeLink(sourceEntity, sourcePropertyName, targetEntity) {
        /// <summary locid="M:J#Sys.Data.DataContext.removeLink"></summary>
        /// <param name="sourceEntity" type="Object"></param>
        /// <param name="sourcePropertyName" type="String"></param>
        /// <param name="targetEntity" type="Object"></param>
        var toggled = this._toggleLink(sourceEntity, sourcePropertyName, targetEntity),
            valueSet = this._setLinkField(true, sourceEntity, sourcePropertyName, targetEntity, true);
            
        if (!toggled || (toggled.action !== Sys.Data.ChangeOperationType.insert)) {
            if (valueSet || (toggled && (toggled.action === Sys.Data.ChangeOperationType.remove))) {
                this._registerChange(new Sys.Data.ChangeOperation(Sys.Data.ChangeOperationType.remove,
                    null, sourceEntity, sourcePropertyName, targetEntity));
            }
        }
    },
    setLink: function DataContext$setLink(sourceEntity, sourcePropertyName, targetEntity) {
        /// <summary locid="M:J#Sys.Data.DataContext.setLink"></summary>
        /// <param name="sourceEntity" type="Object"></param>
        /// <param name="sourcePropertyName" type="String"></param>
        /// <param name="targetEntity" type="Object" mayBeNull="true"></param>
        this._toggleLink(sourceEntity, sourcePropertyName, targetEntity);
        this._setLinkField(false, sourceEntity, sourcePropertyName, targetEntity);
        this._registerChange(new Sys.Data.ChangeOperation(Sys.Data.ChangeOperationType.update,
            null, sourceEntity, sourcePropertyName, targetEntity));
    },    
    abortSave: function DataContext$abortSave() {
        /// <summary locid="M:J#Sys.Data.DataContext.abortSave">Aborts the current saveChanges request, if any.</summary>
        if (this._saverequest) {
            this._saverequest.get_executor().abort();
            this._saverequest = null;
        }
        if (this._saving) {
            this._saving = false;
            this.raisePropertyChanged("isSaving");
        }
    },
    clearChanges: function DataContext$clearChanges() {
        /// <summary locid="M:J#Sys.Data.DataContext.clearChanges">Clears any tracked changes without committing them. Does not revert the changes.</summary>
        this._edits = this._deletes = this._inserts = null;
        if (this._changelist) {
            Sys.Observer.clear(this._changelist);
        }
        if (this._hasChanges) {
            this._hasChanges = false;
            this.raisePropertyChanged("hasChanges");
        }
    },
    clearData: function DataContext$clearData() {
        /// <summary locid="M:J#Sys.Data.DataContext.clearData">Clears the stored entities and clears tracked changes.</summary>
        this._clearData();
    },
    createEntity: function DataContext$createEntity(entitySetName) {
        /// <summary locid="M:J#Sys.Data.DataContext.createEntity">Creates a new disconnected entity.</summary>
        /// <param name="entitySetName" type="String" optional="true" mayBeNull="true"></param>
        /// <returns type="Object"></returns>
        var getter = this.get_createEntityMethod();
        if (!getter) {
            throw Error.invalidOperation(String.format(Sys.Data.DataRes.requiredMethodProperty, "createEntityMethod", "createEntity"));
        }
        return getter(this, entitySetName);
    },
    dispose: function DataContext$dispose() {
        /// <summary locid="M:J#Sys.Data.DataContext.dispose">Disposes of the DataContext.</summary>
        if (this._disposed) return;
        this._disposed = true;
        if (this.get_isSaving()) {
            this.abortSave();
        }
        this.clearData();
        this._lastResults = null;
        this._saverequest = null;
        this._methods = {};        
        Sys.Data.DataContext.callBaseMethod(this, "dispose");
    },
    initialize: function DataContext$initialize() {
        /// <summary locid="M:J#Sys.Data.DataContext.initialize"></summary>
        this.updated();
        Sys.Data.DataContext.callBaseMethod(this, "initialize");
    },
    fetchDeferredProperty: function DataContext$fetchDeferredProperty(entity, propertyName, parameters, mergeOption, succeededCallback, failedCallback, timeout, userContext) {
        /// <summary locid="M:J#Sys.Data.DataContext.fetchDeferredProperty">Populates the property of a given item.</summary>
        /// <param name="entity" type="Object">Entity containing the property to be fetched.</param>
        /// <param name="propertyName" type="String">Name of the property which should be fetched.</param>
        /// <param name="parameters" type="Object" mayBeNull="true" optional="true"></param>
        /// <param name="mergeOption" type="Sys.Data.MergeOption" optional="true" mayBeNull="true">The merge option for any entities linked on the deferred entity once it is loaded.</param>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon successful completion of the operation.</param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon unsuccessful completion of the operation.</param>
        /// <param name="timeout" type="Number" integer="true" mayBeNull="true" optional="true"></param>
        /// <param name="userContext" mayBeNull="true" optional="true">A context object associated with this operation.</param>
        /// <returns type="Sys.Net.WebRequest">The WebRequest object used for this operation.</returns>
        var getter = this.get_getDeferredPropertyFetchOperationMethod();
        if (!getter) {
            throw Error.invalidOperation(String.format(Sys.Data.DataRes.requiredMethodProperty, "getDeferredPropertyFetchOperationMethod", "fetchDeferredProperty"));
        }
        var _this = this, query = getter(this, entity, propertyName, parameters || null, userContext);
        if (query && query.operation) {
            function done(result) {
                _this._setField(entity, propertyName, null, result, null, true);
                if (succeededCallback) {
                    succeededCallback(result, userContext, propertyName);
                }
            }
            function fail(error) {
                if (failedCallback) {
                    failedCallback(error, userContext, propertyName);
                }
            }
            if (typeof(userContext) === "undefined") {
                userContext = null;
            }
            if ((typeof(mergeOption) === "undefined") || (mergeOption === null)) {
                mergeOption = this.get_mergeOption();
            }
            return this.fetchData(query.operation, merge(null, query.parameters, parameters), mergeOption, query.httpVerb || "POST", done, fail, timeout || 0, userContext);
        }
    },
    getNewIdentity: function DataContext$getNewIdentity(entity, entitySetName) {
        /// <summary locid="M:J#fail">Generates a new identity for a new entity.</summary>
        /// <param name="entity">The new entity.</param>
        /// <param name="entitySetName" type="String" mayBeNull="true">The type of the new entity.</param>
        /// <returns mayBeNull="true"></returns>
        var getter = this.get_getNewIdentityMethod();
        return getter ? (getter(this, entity, entitySetName) || null) : null;
    },
    insertEntity: function DataContext$insertEntity(entity, entitySetName) {
        /// <summary locid="M:J#fail"></summary>
        /// <param name="entity"></param>
        /// <param name="entitySetName" type="String" optional="true" mayBeNull="true">The type of entity to insert.</param>
        var identity = null;
        if (this._useIdentity) {
            identity = this.getIdentity(entity);
            if (identity === null) {
                identity = this.getNewIdentity(entity, entitySetName || null);
            }
            if (!identity) {
                throw Error.invalidOperation(Sys.Data.DataRes.requiredIdentity);
            }
            if (this._items[identity]) {
                throw Error.invalidOperation(String.format(Sys.Data.DataRes.entityAlreadyExists, identity));
            }
            this._storeEntity(identity, entity);
        }
        else {
            this._captureEntity(entity);
        }
        this._inserts = this._pushChange(this._inserts, entity, identity);
        this._registerChange(new Sys.Data.ChangeOperation(Sys.Data.ChangeOperationType.insert, entity));
    },
    removeEntity: function DataContext$removeEntity(entity) {
        /// <summary locid="M:J#fail"></summary>
        /// <param name="entity"></param>
        if (this._ignoreChange) return;
        var identity = this.getIdentity(entity);
        if (identity !== null) {
            entity = this._items[identity];
            if (typeof (entity) === "undefined") {
                return;
            }
            delete this._items[identity];
        }
        this._releaseEntity(entity);
        var _this = this,
            changelist = this.get_changes(),
            hadChange = this._hasChanges;
        function unregister() {
            for (var i = 0, l = changelist.length; i < l; i++) {
                if (changelist[i].item === entity) {
                    Sys.Observer.removeAt(changelist, i);
                    _this._hasChanges = !!changelist.length;
                    return;
                }
            }
        }
        if (this._peekChange(this._inserts, entity, identity, true)) {
            this._removeChanges(entity, "*");
            unregister();
        }
        else {
            this._deletes = this._pushChange(this._deletes, entity, identity);
            if (this._peekChange(this._edits, entity, identity, true)) {
                unregister();
            }
            this._removeChanges(entity, "*", true);
            Sys.Observer.add(changelist, new Sys.Data.ChangeOperation(Sys.Data.ChangeOperationType.remove, entity));
            this._hasChanges = true;
        }
        if (this._hasChanges !== hadChange) {
            this._raiseChanged("hasChanges");
        }
    },
    fetchData: function DataContext$fetchData(operation, parameters, mergeOption, httpVerb, succeededCallback, failedCallback, timeout, userContext) {
        /// <summary locid="M:J#unregister">Fetches data from the provided service URI.</summary>
        /// <param name="operation" mayBeNull="true" optional="true">The operation to fetch data with.</param>
        /// <param name="parameters" type="Object" mayBeNull="true" optional="true"></param>
        /// <param name="mergeOption" type="Sys.Data.MergeOption" mayBeNull="true" optional="true"></param>
        /// <param name="httpVerb" type="String" mayBeNull="true" optional="true"></param>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="timeout" type="Number" integer="true" mayBeNull="true" optional="true"></param>
        /// <param name="userContext" mayBeNull="true" optional="true"></param>
        /// <returns type="Sys.Net.WebRequest"></returns>
        var _this = this;
        if ((typeof(mergeOption) === "undefined") || (mergeOption === null)) {
            mergeOption = this.get_mergeOption();
        }
        function done(data) {
            if (_this._disposed) return;
            var trackedData = _this.trackData(data, mergeOption);
            if (succeededCallback) {
                if ((data instanceof Array) && (trackedData === data)) {
                    trackedData = Array.clone(trackedData);
                }
                succeededCallback(trackedData, userContext, operation);
            }
        }
        function fail(error) {
            if (_this._disposed) return;
            if (failedCallback) {
                failedCallback(error, userContext, operation);
            }
        }
        if (typeof(userContext) === "undefined") {
            userContext = null;
        }
        var method = this.get_fetchDataMethod(), uri = this.get_serviceUri();
        if (!method) {
            Type._checkDependency("MicrosoftAjaxWebServices.js", "Sys.Data.DataContext.fetchData");
            if (!uri) {
                throw Error.invalidOperation(Sys.Data.DataRes.requiredUri);
            }
        }
        return (method ? method(this, uri, operation, parameters || null, httpVerb || "POST", done, fail, timeout || 0, userContext) 
                       : Sys.Net.WebServiceProxy.invoke(uri, operation, httpVerb ? (httpVerb === "GET") : false, 
                                                        parameters || null, done, fail, userContext, timeout || 0)
                       );
    },
    _clearData: function DataContext$_clearData(newData) {
        if (this._useIdentity) {
            for (var identity in this._items) {
                var entity = this._items[identity];
                this._releaseEntity(entity);
            }
        }
        else if (this._lastResults) {
            this._release(this._lastResults);
        }
        this._items = {};
        var oldData = this._lastResults;
        this._lastResults = newData || null;
        this.clearChanges();
        if (newData) {
            this._capture(newData);
        }
        if (oldData !== null) {
            this._raiseChanged("lastFetchDataResults");
        }
    },
    _fixAfterSave: function DataContext$_fixAfterSave(change, entity, result) {
        if (this._useIdentity) {
            var oldIdentity = this.getIdentity(entity),
                newIdentity = this.getIdentity(result);
            this._combine(entity, result);
            if (oldIdentity !== newIdentity) {
                delete this._items[oldIdentity];
                this._items[newIdentity] = entity;
            }
        }
        else {
            this._combine(entity, result);
            if (change.action === Sys.NotifyCollectionChangedAction.add) {
                this._captureEntity(entity);
            }
        }
    },
    trackData: function DataContext$trackData(data, mergeOption) {
        /// <summary locid="M:J#fail">Loads the given data into the DataContext as if it were loaded with fetchData().</summary>
        /// <param name="data" mayBeNull="true">The data to load.</param>
        /// <param name="mergeOption" type="Sys.Data.MergeOption" mayBeNull="true" optional="true"></param>
        /// <returns mayBeNull="true">The data being tracked. If the mergeOption is appendOnly and there are deleted entities, they will be removed from this list.</returns>
        if (this._useIdentity) {
            if ((typeof(mergeOption) === "undefined") || (mergeOption === null)) {
                mergeOption = this.get_mergeOption();
            }
            var trackedData;
            if (data instanceof Array) {
                data = this._storeEntities(data, mergeOption);
            }
            else if ((typeof(data) !== "undefined") && (data !== null)) {
                trackedData = this._storeEntities([data], mergeOption);
                if (trackedData.length === 0) {
                    data = null;
                }
            }
            var oldData = this._lastResults;
            this._lastResults = data;
            if (oldData !== null) {
                this._raiseChanged("lastFetchDataResults");
            }
        }
        else {
            this._clearData(data);
        }
        return data;
    },
    _processResults: function DataContext$_processResults(dataContext, changes, results) {
        if (results && results.length === changes.length) {
            dataContext._ignoreChange = true;
            try {
                for (var i = 0, l = results.length; i < l; i++) {
                    var result = results[i], change = changes[i], item = change.item;
                    if (result && typeof(result) === "object") {
                        dataContext._fixAfterSave(change, item, result);
                    }
                }
            }
            finally {
                dataContext._ignoreChange = false;
            }
        }
    },
    _peekChange: function DataContext$_peekChange(changearray, entity, identity, remove) {
        if (!changearray) return false;
        if (identity !== null) {
            var key = "id$" + identity,
                i = changearray[key];
            if (i) {
                if (remove) {
                    changearray[key] = null;
                }
                return true;
            }
        }
        else {
            if (remove) {
                return Array.remove(changearray, entity);
            }
            else {
                return Array.contains(changearray, entity);
            }
        }
    },
    _pushChange: function DataContext$_pushChange(changearray, entity, identity) {
        if (!changearray) {
            changearray = [];
        }
        if (identity === null) {
            changearray.push(entity);
        }
        else {
            changearray["id$" + identity] = true;
        }
        return changearray;
    },
    _registerChange: function DataContext$_registerChange(change) {
        Sys.Observer.add(this.get_changes(), change);
        if (!this._hasChanges) {
            this._hasChanges = true;
            this.raisePropertyChanged("hasChanges");
        }        
    },
    saveChanges: function DataContext$saveChanges(succeededCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Data.DataContext.saveChanges">Saves pending changes made to the current data.</summary>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="userContext" mayBeNull="true" optional="true"></param>
        /// <returns type="Sys.Net.WebRequest"></returns>
        var delay = false,
            uri = this.get_serviceUri(),
            saveOperation = this.get_saveOperation(),
            _this = this,
            changes;
        function done(results) {
            if (_this._disposed) return;
            if (!delay) {
                delay = true;
                window.setTimeout(function() { done(results) }, 0);
            }
            else {
                _this.clearChanges();
                var processor = _this.get_handleSaveChangesResultsMethod();
                (processor || _this._processResults)(_this, changes, results);
                _this._saverequest = null;
                _this._saving = false;
                _this._raiseChanged("isSaving");
                if (succeededCallback) {
                    succeededCallback(results, userContext, saveOperation);
                }
            }
        }
        function failed(error) {
            if (_this._disposed) return;
            if (!delay) {
                delay = true;
                window.setTimeout(function() { failed(error) }, 0);
            }
            else {
                _this._saverequest = null;
                _this._saving = false;
                _this._raiseChanged("isSaving");
                if (failedCallback) {
                    failedCallback(error, userContext, saveOperation);
                }
            }
        }
        if (!this._hasChanges) {
            done(null);
            return null;
        }
        changes = Array.clone(this.get_changes());        
        if (changes.length === 0) {
            done(null);
            return null;
        }

        if (this.get_isSaving()) {
            this.abortSave();
        }
        this._saving = true;
        this._raiseChanged("isSaving");
        
        var filteredChanges = this._filterLinks(changes);
        this._saverequest = (this.get_saveChangesMethod() || this._saveInternal)(this, filteredChanges, done, failed, userContext);
        delay = true;
        return this._saverequest;
    },
    _isDeleted: function DataContext$_isDeleted(entity) {
        var i, l, change, changes = this.get_changes(), identity = this.getIdentity(entity);
        for (i = 0, l = changes.length; i < l; i++) {
            change = changes[i];
            if ((change.action === Sys.Data.ChangeOperationType.remove) && change.item &&
                ((change.item === entity) || (this.getIdentity(change.item) === identity)) ) {
                return true;
            }
        }
        return false;
    },
    _removeChanges: function DataContext$_removeChanges(entity, linkField, addsOnly) {
        var i, l, toRemove, change, changes = this.get_changes(),
            anyField = (linkField === "*");
        for (i = 0, l = changes.length; i < l; i++) {
            change = changes[i];
            if (// doing links and the entity is the source, and the linkField is correct
                (linkField && (!addsOnly || change.action === Sys.Data.ChangeOperationType.insert) && (change.linkSource === entity || (anyField && (change.linkTarget === entity))) && (anyField || (change.linkSourceField === linkField))) ||
                (!linkField && change.item && (typeof(change.item) === "object") &&
                    ((change.item === entity) || (this.getIdentity(change.item) === this.getIdentity(entity))))) {
                if (!toRemove) toRemove = [];
                toRemove.push(change);
            }
        }
        if (toRemove) {
            Sys.Observer.beginUpdate(changes);
            for (i = 0, l = toRemove.length; i < l; i++) {
                Sys.Observer.remove(changes, toRemove[i]);
            }
            Sys.Observer.endUpdate(changes);
            if (changes.length === 0) {
                this._hasChanges = false;
                this.raisePropertyChanged("hasChanges");
            }
        }
    },
    _setLinkField: function DataContext$_setLinkField(isArray, source, field, target, isRemove) {
        if (isArray) {
            var value = source[field];
            if (value === null || this._getValueType(source, field, value) !== 2) {
                if (isRemove) {
                    return false;
                }
                source[field] = value = [];
            }
            else if (!(value instanceof Array)) {
                throw Error.invalidOperation(String.format(Sys.Data.DataRes.mustBeArray, field));
            }
            this._ignoreChange = true;
            try {
                if (Array.contains(value, target)) {
                    if (isRemove) {
                        Sys.Observer.remove(value, target);
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (isRemove) {
                        return false;
                    }
                    else {
                        Sys.Observer.add(value, target);
                        return true;
                    }
                }
            }
            finally {
                this._ignoreChange = false;
            }
        }
        else {
            this._ignoreChange = true;
            try {
                if (isRemove) {
                    Sys.Observer.setValue(source, field, null);
                }
                else {
                    Sys.Observer.setValue(source, field, target);
                }
                return true;
            }
            finally {
                this._ignoreChange = false;
            }
        }
    },
    _toggleLink: function DataContext$_toggleLink(source, field, target, removing) {
        var change, changes = this.get_changes();
        for (var i = 0, l = changes.length; i < l; i++) {
            change = changes[i];
            if ((change.linkSourceField === field) && (change.linkSource === source) &&
                ((change.linkTarget === target) || (change.action === Sys.Data.ChangeOperationType.update))) {
                Sys.Observer.remove(changes, change);
                var hadChange = this._hasChanges;
                this._hasChanges = !!changes.length;
                if (hadChange !== this._hasChanges) {
                    this.raisePropertyChanged("hasChanges");
                }
                return change;
            }
        }
        return null;
    },
    updated: function DataContext$updated() {
        /// <summary locid="M:J#Sys.Data.DataContext.updated"></summary>
        if (this._dirty) {
            this._dirty = false;
            this.raisePropertyChanged("");
        }
    },
    _capture: function DataContext$_capture(data) {
        if (data instanceof Array) {
            for (var i = 0, l = data.length; i < l; i++) {
                this._captureEntity(data[i]);
            }
        }
        else if (data !== null) {
            this._captureEntity(data);
        }
    },
    _captureEntity: function DataContext$_captureEntity(item) {
        if (this._isCaptureable(item)) {
            Sys.Observer.addPropertyChanged(item, this._dataChangedDel);
        }
    },
    _dataChanged: function DataContext$_dataChanged(object, args) {
        if (this._ignoreChange) return;
        var changelist = this.get_changes();
        var identity = this.getIdentity(object);
        if (!this._peekChange(this._inserts, object, identity)) {
            var alreadyChanged = this._peekChange(this._edits, object, identity);
            if (!alreadyChanged) {
                Sys.Observer.add(changelist, new Sys.Data.ChangeOperation(Sys.Data.ChangeOperationType.update, object));
                this._edits = this._pushChange(this._edits, object, identity);
                if (!this._hasChanges) {
                    this._hasChanges = true;
                    this.raisePropertyChanged("hasChanges");
                }
            }
        }
    },
    _isActive: function DataContext$_isActive() {
        return this.get_isInitialized() && !this.get_isUpdating();
    },
    _isCaptureable: function DataContext$_isCaptureable(item) {
        if (item === null) return false;
        var type = typeof(item);
        return (type === "object" || type === "unknown");
    },
    _raiseChanged: function DataContext$_raiseChanged(name) {
        if (this._isActive()) {
            this.raisePropertyChanged(name);
            return true;
        }
        else {
            this._dirty = true;
            return false;
        }
    },
    _release: function DataContext$_release(data) {
        if (data instanceof Array) {
            for (var i = 0, l = data.length; i < l; i++) {
                this._releaseEntity(data[i]);
            }
        }
        else if (data !== null) {
            this._releaseEntity(data);
        }
    },
    _releaseEntity: function DataContext$_releaseEntity(item) {
        if (this._isCaptureable(item)) {
            Sys.Observer.removePropertyChanged(item, this._dataChangedDel);
        }
    },
    _saveInternal: function DataContext$_saveInternal(dc, changes, succeededCallback, failedCallback, context) {
        Type._checkDependency("MicrosoftAjaxWebServices.js", "Sys.Data.DataContext.saveChanges");
        var uri = dc.get_serviceUri(),
            operation = dc.get_saveOperation() || "",
            request = null;
        if (!uri) {
            failedCallback(new Sys.Net.WebServiceError(false, String.format(Sys.Res.webServiceFailedNoMsg, operation)), context, operation);
        }
        else {
            request = Sys.Net.WebServiceProxy.invoke(uri,
                operation,
                dc.get_saveHttpVerb() === "GET",
                merge(null, dc.get_saveParameters(), { changeSet: changes }),
                succeededCallback,
                failedCallback,
                context,
                dc.get_saveChangesTimeout() || 0);
        }
        return request;
    },
    _filterLinks: function DataContext$_filterLinks(changeSet) {
        if (!this._useIdentity) return changeSet;
        var i, l = changeSet.length,
            newChangeSet = new Array(l);
        for (i = 0; i < l; i++) {
            var change = changeSet[i], item = change.item, linkSource = change.linkSource, linkTarget = change.linkTarget;
            if (item) {
                item = this._getEntityOnly(item);
            }
            if (linkSource) {
                linkSource = this._getEntityOnly(linkSource);
            }
            if (linkTarget) {
                linkTarget = this._getEntityOnly(linkTarget);
            }
            newChangeSet[i] = new Sys.Data.ChangeOperation(change.action, item, linkSource, change.linkSourceField, linkTarget);
        }
        return newChangeSet;
    },
    _getEntityOnly: function DataContext$_getEntityOnly(source) {
        var target = {};
        this._combine(target, source, null, true);
        return target;
    },
    getIdentity: function DataContext$getIdentity(entity) {
        /// <summary locid="M:J#failed">Gets the unique identity for an entity.</summary>
        /// <param name="entity" type="Object" mayBeNull="false"></param>
        /// <returns mayBeNull="true" type="String">The identity of the entity, null if it has no identity or the identity could not be determined.</returns>
        if (entity === null) return null;
        var getter = this.get_getIdentityMethod();
        return getter ? (getter(this, entity) || null) : null;
    },
    isDeferredProperty: function DataContext$isDeferredProperty(entity, propertyName) {
        /// <summary locid="M:J#failed">Determines if the given entity and property name refer to a deferred link to another entity that has not been loaded yet.</summary>
        /// <param name="entity" type="Object"></param>
        /// <param name="propertyName" type="String"></param>
        /// <returns type="Boolean"></returns>
        var getter = this.get_isDeferredPropertyMethod();
        return getter ? (getter(this, entity, propertyName) || false) : false;
    },
    _getValueType: function DataContext$_getValueType(parent, name, object) {
        var type = typeof(object);
        if (type === "undefined") return 0;
        if ((object === null) || (type !== "object")) return 2;
        if (this.isDeferredProperty(parent, name)) return 1;
        return 2;
    },
    _setField: function DataContext$_setField(target, name, source, value, mergeOption, isLink) {
        var doSet = true, isArray = (target instanceof Array), appendOnly = (mergeOption === Sys.Data.MergeOption.appendOnly);
        if (!isArray) {
            var targetField = target[name], valueType = this._getValueType(target, name, targetField);
            if (appendOnly) {
                if (valueType === 2 &&
                        (!targetField || !value ||
                        (typeof(targetField) !== "object") ||
                        (targetField instanceof Array) ||
                        (typeof(value) !== "object") ||
                        (value instanceof Array) ||
                        (this.getIdentity(targetField) !== this.getIdentity(value)))) {
                    doSet = false;
                }
            }
            else if ((valueType === 2) && value && source && (this._getValueType(source, name, value) === 1)) {
                doSet = false;
            }
        }
        if (doSet) {
            if (isArray) {
                target[name] = value;
            }
            else {
                this._ignoreChange = true;
                try {
                    Sys.Observer.setValue(target, name, value);
                }
                finally {
                    this._ignoreChange = false;
                }
            }
            if (isLink && !appendOnly) {
                this._removeChanges(target, name);
            }
        }
        return doSet;
    },
    _combine: function DataContext$_combine(target, source, mergeOption, excludeEntities) {
        var removedChanges = false;
        for (var name in source) {
            var field = source[name], type = typeof(field);
            if (type === "function") continue;
            if (this._useIdentity && (field instanceof Array)) {
                if (!excludeEntities) {
                    field = this._storeEntities(field, mergeOption);
                    if (target) {
                        this._setField(target, name, source, field, mergeOption, true);
                    }
                }
            }
            else {
                var identity = null;
                if (field && (type === "object"))  {
                    identity = this.getIdentity(field);
                }
                if (identity !== null) {
                    if (!excludeEntities) {
                        this._storeEntity(identity, field, target, name, source, mergeOption);
                    }
                }
                else if (target) {
                    var targetField = target[name];
                    if (targetField && (typeof(targetField) === "object") && this.getIdentity(targetField)) {
                        continue;
                    }
                    if (this._setField(target, name, source, field, mergeOption) && !removedChanges &&
                        ((typeof(mergeOption) !== "number") || (mergeOption === Sys.Data.MergeOption.overwriteChanges))) {
                        removedChanges = true;
                        this._removeChanges(target);
                    }
                }
            }
        }
    },
    _storeEntity: function DataContext$_storeEntity(identity, entity, parent, parentField, source, mergeOption) {
        var updated = true, storedEntity = this._items[identity];
        if ((typeof (storedEntity) !== "undefined")) {
            if (storedEntity === entity) {
                updated = false;
            }
            else {
                this._combine(storedEntity, entity, mergeOption);
            }
        }
        else {
            this._items[identity] = storedEntity = entity;
            this._captureEntity(entity);
            this._combine(entity, entity, mergeOption);
        }
        if (parent && (parent[parentField] !== storedEntity)) {
            this._setField(parent, parentField, source, storedEntity, mergeOption, true);
        }
        return updated;
    },
    _storeEntities: function DataContext$_storeEntities(entities, mergeOption) {
        var i, l, filtered, deleted, appendOnly = (mergeOption === Sys.Data.MergeOption.appendOnly);
        for (i = 0, l = entities.length; i < l; i++) {
            var entity = entities[i], isObject = (entity && (typeof(entity) === "object"));
            if (isObject) {
                if (appendOnly) {
                    if (this._isDeleted(entity)) {
                        deleted = (deleted || []);
                        deleted.push(entity);
                        continue;
                    }
                }
                var identity = this.getIdentity(entity);
                if (identity !== null) {
                    if (this._storeEntity(identity, entity, entities, i, null, mergeOption) && !appendOnly) {
                        this._removeChanges(entity);
                    }
                }
            }
        }
        if (deleted) {
            filtered = Array.clone(entities);
            for (i = 0, l = deleted.length; i < l; i++) {
                Array.remove(filtered, deleted[i]);
            }
        }
        return filtered || entities;
    }
}
$type.registerClass("Sys.Data.DataContext", Sys.Component, Sys.Data.IDataProvider);
Sys.registerComponent($type);
$type = Sys.Data.ChangeOperationType = function Data$ChangeOperationType() {
    /// <summary locid="M:J#Sys.Data.ChangeOperationType.#ctor">Describes how an item has changed.</summary>
    /// <field name="insert" type="Number" integer="true" static="true" locid="F:J#Sys.Data.ChangeOperationType.insert"></field>
    /// <field name="update" type="Number" integer="true" static="true" locid="F:J#Sys.Data.ChangeOperationType.update"></field>
    /// <field name="remove" type="Number" integer="true" static="true" locid="F:J#Sys.Data.ChangeOperationType.remove"></field>
    throw Error.notImplemented();
}
$type.prototype = {
    insert: 0,
    update: 1,
    remove: 2
}
$type.registerEnum("Sys.Data.ChangeOperationType");
$type = Sys.Data.ChangeOperation = function Data$ChangeOperation(action, item, linkSource, linkSourceField, linkTarget) {
    /// <summary locid="M:J#Sys.Data.ChangeOperation.#ctor">Describes a single change in a set of data.</summary>
    /// <param name="action" type="Sys.Data.ChangeOperationType"></param>
    /// <param name="item" mayBeNull="true">The item that was changed.</param>
    /// <param name="linkSource" mayBeNull="true" optional="true">The item that is being linked from.</param>
    /// <param name="linkSourceField" mayBeNull="true" optional="true">The field on the source item representing the relationship.</param>
    /// <param name="linkTarget" mayBeNull="true" optional="true">The item that is being linked to.</param>
    /// <field name="action" type="Sys.Data.ChangeOperationType" locid="F:J#Sys.Data.ChangeOperation.action"></field>
    /// <field name="item" mayBeNull="true" locid="F:J#Sys.Data.ChangeOperation.item">The item that was changed.</field>
    /// <field name="linkSource" mayBeNull="true" locid="F:J#Sys.Data.ChangeOperation.linkSource">The item that is being linked from.</field>
    /// <field name="linkSourceField" mayBeNull="true" locid="F:J#Sys.Data.ChangeOperation.linkSourceField">The field on the source item representing the relationship.</field>
    /// <field name="linkTarget" mayBeNull="true" locid="F:J#Sys.Data.ChangeOperation.linkTarget">The item that is being linked to.</field>
    this.action = action;
    this.item = item;
    this.linkSourceField = linkSourceField;
    this.linkSource = linkSource;
    this.linkTarget = linkTarget;
}
$type.prototype = {
    action: null,
    item: null,
    linkSource: null,
    linkSourceField: null,
    linkTarget: null
}
$type.registerClass("Sys.Data.ChangeOperation");

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("DataContext", null, execute);
}
else {
	execute();
}

})();
