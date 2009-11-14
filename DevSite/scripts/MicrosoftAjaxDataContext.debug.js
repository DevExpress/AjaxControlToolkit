// Name:        MicrosoftAjaxDataContext.debug.js
// Assembly:    System.Web.Ajax
// Version:     3.0.31106.22099
// FileVersion: 3.0.31106.0
/// <reference name="MicrosoftAjaxCore.js" />
(function() {

function execute() {
Type._registerScript("MicrosoftAjaxDataContext.js", ["MicrosoftAjaxComponentModel.js", "MicrosoftAjaxCore.js"]);

var merge = Sys._merge;

Type.registerNamespace("Sys.Net");

Sys.Net.WebServiceOperation = function Sys$Net$WebServiceOperation(operation, parameters, httpVerb) {
    /// <summary locid="M:J#Sys.Net.WebServiceOperation.#ctor" />
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




Sys.Net.WebServiceOperation.prototype = {
    operation: null,
    parameters: null,
    httpVerb: null
}
Sys.Net.WebServiceOperation.registerClass("Sys.Net.WebServiceOperation");


Type.registerNamespace("Sys.Data");

if (!Sys.Data.IDataProvider) {
Sys.Data.IDataProvider = function Sys$Data$IDataProvider() {
}

    function Sys$Data$IDataProvider$fetchData(operation, parameters, mergeOption, httpVerb, succeededCallback, failedCallback, timeout, userContext) {
        /// <summary locid="M:J#Sys.Data.IDataProvider.fetchData" />
        /// <param name="operation"></param>
        /// <param name="parameters" type="Object" mayBeNull="true" optional="true"></param>
        /// <param name="mergeOption" type="Sys.Data.MergeOption" mayBeNull="true" optional="true"></param>
        /// <param name="httpVerb" type="String" mayBeNull="true" optional="true"></param>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="timeout" type="Number" integer="true" mayBeNull="true" optional="true"></param>
        /// <param name="userContext" mayBeNull="true" optional="true"></param>
        /// <returns type="Sys.Net.WebRequest"></returns>
        throw Error.notImplemented();
    }
Sys.Data.IDataProvider.prototype = {
    fetchData: Sys$Data$IDataProvider$fetchData
}
Sys.Data.IDataProvider.registerInterface("Sys.Data.IDataProvider");
}
if (!Sys.Data.MergeOption) {
Sys.Data.MergeOption = function Sys$Data$MergeOption() {
    /// <summary locid="M:J#Sys.Data.MergeOption.#ctor" />
    /// <field name="appendOnly" type="Number" integer="true" static="true" locid="F:J#Sys.Data.MergeOption.appendOnly"></field>
    /// <field name="overwriteChanges" type="Number" integer="true" static="true" locid="F:J#Sys.Data.MergeOption.overwriteChanges"></field>
    throw Error.notImplemented();
}




Sys.Data.MergeOption.prototype = {
    appendOnly: 0,
    overwriteChanges: 1
}
Sys.Data.MergeOption.registerEnum("Sys.Data.MergeOption");

}
Sys.Data.DataContext = function Sys$Data$DataContext() {
    Sys.Data.DataContext.initializeBase(this);
    this._dataChangedDel = Function.createDelegate(this, this._dataChanged);
    this._items = {};
    this._methods = {};
}























    function Sys$Data$DataContext$get_changes() {
        /// <value type="Array" elementType="Sys.Data.ChangeOperation" locid="P:J#Sys.Data.DataContext.changes"></value>
        var changes = this._changelist;
        if (!changes) {
            this._changelist = changes = [];
        }
        return changes;
    }
    function Sys$Data$DataContext$get_createEntityMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.createEntityMethod"></value>
        return this._methods.createEntity || null;
    }
    function Sys$Data$DataContext$set_createEntityMethod(value) {
        this._methods.createEntity = value;
    }
    function Sys$Data$DataContext$get_getIdentityMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.getIdentityMethod"></value>
        return this._methods.getIdentity || null;
    }
    function Sys$Data$DataContext$set_getIdentityMethod(value) {
        if (this.get_isInitialized() && ((this._getIdentityMethod && !value) || (!this._getIdentityMethod && value))) {
            throw Error.invalidOperation(String.format(Sys.Data.DataRes.commonNotAfterInit, "DataContext", "getIdentityMethod"));
        }
        this._methods.getIdentity = value;
        this._useIdentity = !!value;
    }
    function Sys$Data$DataContext$get_handleSaveChangesResultsMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.handleSaveChangesResultsMethod"></value>
        return this._methods.handleSaveResults || null;
    }
    function Sys$Data$DataContext$set_handleSaveChangesResultsMethod(value) {
        this._methods.handleSaveResults = value;
    }
    function Sys$Data$DataContext$get_isDeferredPropertyMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.isDeferredPropertyMethod"></value>
        return this._methods.isDeferredProperty || null;
    }
    function Sys$Data$DataContext$set_isDeferredPropertyMethod(value) {
        this._methods.isDeferredProperty = value;
    }
    function Sys$Data$DataContext$get_getNewIdentityMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.getNewIdentityMethod"></value>
        return this._methods.getNewIdentity || null;
    }
    function Sys$Data$DataContext$set_getNewIdentityMethod(value) {
        this._methods.getNewIdentity = value;
    }
    function Sys$Data$DataContext$get_getDeferredPropertyFetchOperationMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.getDeferredPropertyFetchOperationMethod"></value>
        return this._methods.getDeferredQuery || null;
    }
    function Sys$Data$DataContext$set_getDeferredPropertyFetchOperationMethod(value) {
        this._methods.getDeferredQuery = value;
    }
    function Sys$Data$DataContext$get_items() {
        /// <value type="Object" locid="P:J#Sys.Data.DataContext.items"></value>
        return this._items;
    }
    function Sys$Data$DataContext$get_lastFetchDataResults() {
        /// <value mayBeNull="true" locid="P:J#Sys.Data.DataContext.lastFetchDataResults"></value>
        return this._lastResults || null;
    }
    function Sys$Data$DataContext$get_hasChanges() {
        /// <value type="Boolean" locid="P:J#Sys.Data.DataContext.hasChanges"></value>
        return this._hasChanges;
    }
    function Sys$Data$DataContext$get_fetchDataMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.fetchDataMethod"></value>
        return this._methods.fetchData || null;
    }
    function Sys$Data$DataContext$set_fetchDataMethod(value) {
        this._methods.fetchData = value;
    }
    function Sys$Data$DataContext$get_mergeOption() {
        /// <value type="Sys.Data.MergeOption" locid="P:J#Sys.Data.DataContext.mergeOption"></value>
        return this._mergeOption;
    }
    function Sys$Data$DataContext$set_mergeOption(value) {
        this._mergeOption = value;
    }
    function Sys$Data$DataContext$get_saveChangesMethod() {
        /// <value type="Function" mayBeNull="true" locid="P:J#Sys.Data.DataContext.saveChangesMethod"></value>
        return this._methods.saveChanges || null;
    }
    function Sys$Data$DataContext$set_saveChangesMethod(value) {
        this._methods.saveChanges = value;
    }
    function Sys$Data$DataContext$get_saveOperation() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.DataContext.saveOperation"></value>
        return this._saveOperation || "";
    }
    function Sys$Data$DataContext$set_saveOperation(value) {
        this._saveOperation = value;
    }
    function Sys$Data$DataContext$get_saveHttpVerb() {
        /// <value type="String" locid="P:J#Sys.Data.DataContext.saveHttpVerb"></value>
        return this._saveHttpVerb || "POST";
    }
    function Sys$Data$DataContext$set_saveHttpVerb(value) {
        this._saveHttpVerb = value;
    }
    function Sys$Data$DataContext$get_saveParameters() {
        /// <value type="Object" mayBeNull="true" locid="P:J#Sys.Data.DataContext.saveParameters"></value>
        return this._saveParameters;
    }
    function Sys$Data$DataContext$set_saveParameters(value) {
        this._saveParameters = value;
    }
    function Sys$Data$DataContext$get_saveChangesTimeout() {
        /// <value type="Number" integer="true" locid="P:J#Sys.Data.DataContext.saveChangesTimeout"></value>
        return this._saveTimeout;
    }
    function Sys$Data$DataContext$set_saveChangesTimeout(value) {
        this._saveTimeout = value;
    }
    function Sys$Data$DataContext$get_isSaving() {
        /// <value type="Boolean" locid="P:J#Sys.Data.DataContext.isSaving"></value>
        return this._saving;
    }
    function Sys$Data$DataContext$get_serviceUri() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.DataContext.serviceUri"></value>
        return this._serviceUri || "";
    }
    function Sys$Data$DataContext$set_serviceUri(value) {
        this._serviceUri = value;
    }
    function Sys$Data$DataContext$addLink(sourceEntity, sourcePropertyName, targetEntity) {
        /// <summary locid="M:J#Sys.Data.DataContext.addLink" />
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
    }
    function Sys$Data$DataContext$removeLink(sourceEntity, sourcePropertyName, targetEntity) {
        /// <summary locid="M:J#Sys.Data.DataContext.removeLink" />
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
    }
    function Sys$Data$DataContext$setLink(sourceEntity, sourcePropertyName, targetEntity) {
        /// <summary locid="M:J#Sys.Data.DataContext.setLink" />
        /// <param name="sourceEntity" type="Object"></param>
        /// <param name="sourcePropertyName" type="String"></param>
        /// <param name="targetEntity" type="Object" mayBeNull="true"></param>
        this._toggleLink(sourceEntity, sourcePropertyName, targetEntity);
        this._setLinkField(false, sourceEntity, sourcePropertyName, targetEntity);
        this._registerChange(new Sys.Data.ChangeOperation(Sys.Data.ChangeOperationType.update,
            null, sourceEntity, sourcePropertyName, targetEntity));
    }
    function Sys$Data$DataContext$abortSave() {
        /// <summary locid="M:J#Sys.Data.DataContext.abortSave" />
        if (this._saverequest) {
            this._saverequest.get_executor().abort();
            this._saverequest = null;
        }
        if (this._saving) {
            this._saving = false;
            this.raisePropertyChanged("isSaving");
        }
    }
    function Sys$Data$DataContext$clearChanges() {
        /// <summary locid="M:J#Sys.Data.DataContext.clearChanges" />
        this._edits = this._deletes = this._inserts = null;
        if (this._changelist) {
            Sys.Observer.clear(this._changelist);
        }
        if (this._hasChanges) {
            this._hasChanges = false;
            this.raisePropertyChanged("hasChanges");
        }
    }
    function Sys$Data$DataContext$clearData() {
        /// <summary locid="M:J#Sys.Data.DataContext.clearData" />
        this._clearData();
    }
    function Sys$Data$DataContext$createEntity(entitySetName) {
        /// <summary locid="M:J#Sys.Data.DataContext.createEntity" />
        /// <param name="entitySetName" type="String" optional="true" mayBeNull="true"></param>
        /// <returns type="Object"></returns>
        var getter = this.get_createEntityMethod();
        if (!getter) {
            throw Error.invalidOperation(String.format(Sys.Data.DataRes.requiredMethodProperty, "createEntityMethod", "createEntity"));
        }
        return getter(this, entitySetName);
    }
    function Sys$Data$DataContext$dispose() {
        /// <summary locid="M:J#Sys.Data.DataContext.dispose" />
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
    }
    function Sys$Data$DataContext$initialize() {
        /// <summary locid="M:J#Sys.Data.DataContext.initialize" />
        this.updated();
        Sys.Data.DataContext.callBaseMethod(this, "initialize");
    }
    function Sys$Data$DataContext$fetchDeferredProperty(entity, propertyName, parameters, mergeOption, succeededCallback, failedCallback, timeout, userContext) {
        /// <summary locid="M:J#Sys.Data.DataContext.fetchDeferredProperty" />
        /// <param name="entity" type="Object"></param>
        /// <param name="propertyName" type="String"></param>
        /// <param name="parameters" type="Object" mayBeNull="true" optional="true"></param>
        /// <param name="mergeOption" type="Sys.Data.MergeOption" optional="true" mayBeNull="true"></param>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="timeout" type="Number" integer="true" mayBeNull="true" optional="true"></param>
        /// <param name="userContext" mayBeNull="true" optional="true"></param>
        /// <returns type="Sys.Net.WebRequest"></returns>
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
    }
    function Sys$Data$DataContext$getNewIdentity(entity, entitySetName) {
        /// <summary locid="M:J#fail" />
        /// <param name="entity"></param>
        /// <param name="entitySetName" type="String" mayBeNull="true"></param>
        /// <returns mayBeNull="true"></returns>
        var getter = this.get_getNewIdentityMethod();
        return getter ? (getter(this, entity, entitySetName) || null) : null;
    }
    function Sys$Data$DataContext$insertEntity(entity, entitySetName) {
        /// <summary locid="M:J#fail" />
        /// <param name="entity"></param>
        /// <param name="entitySetName" type="String" optional="true" mayBeNull="true"></param>
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
    }
    function Sys$Data$DataContext$removeEntity(entity) {
        /// <summary locid="M:J#fail" />
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
    }
    function Sys$Data$DataContext$fetchData(operation, parameters, mergeOption, httpVerb, succeededCallback, failedCallback, timeout, userContext) {
        /// <summary locid="M:J#unregister" />
        /// <param name="operation" mayBeNull="true" optional="true"></param>
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
    }
    function Sys$Data$DataContext$_clearData(newData) {
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
    }
    function Sys$Data$DataContext$_fixAfterSave(change, entity, result) {
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
                this._captureEntity(item);
            }
        }
    }
    function Sys$Data$DataContext$trackData(data, mergeOption) {
        /// <summary locid="M:J#fail" />
        /// <param name="data" mayBeNull="true"></param>
        /// <param name="mergeOption" type="Sys.Data.MergeOption" mayBeNull="true" optional="true"></param>
        /// <returns mayBeNull="true"></returns>
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
    }
    function Sys$Data$DataContext$_processResults(dataContext, changes, results) {
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
    }
    function Sys$Data$DataContext$_peekChange(changearray, entity, identity, remove) {
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
    }
    function Sys$Data$DataContext$_pushChange(changearray, entity, identity) {
        if (!changearray) {
            changearray = [];
        }
        if (identity === null) {
            changearray[changearray.length] = entity;
        }
        else {
            changearray["id$" + identity] = true;
        }
        return changearray;
    }
    function Sys$Data$DataContext$_registerChange(change) {
        Sys.Observer.add(this.get_changes(), change);
        if (!this._hasChanges) {
            this._hasChanges = true;
            this.raisePropertyChanged("hasChanges");
        }        
    }
    function Sys$Data$DataContext$saveChanges(succeededCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Data.DataContext.saveChanges" />
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
    }
    function Sys$Data$DataContext$_isDeleted(entity) {
        var i, l, change, changes = this.get_changes(), identity = this.getIdentity(entity);
        for (i = 0, l = changes.length; i < l; i++) {
            change = changes[i];
            if ((change.action === Sys.Data.ChangeOperationType.remove) && change.item &&
                ((change.item === entity) || (this.getIdentity(change.item) === identity)) ) {
                return true;
            }
        }
        return false;
    }
    function Sys$Data$DataContext$_removeChanges(entity, linkField, addsOnly) {
        var i, l, toRemove, change, changes = this.get_changes(),
            anyField = (linkField === "*");
        for (i = 0, l = changes.length; i < l; i++) {
            change = changes[i];
            if (
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
    }
    function Sys$Data$DataContext$_setLinkField(isArray, source, field, target, isRemove) {
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
    }
    function Sys$Data$DataContext$_toggleLink(source, field, target, removing) {
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
    }
    function Sys$Data$DataContext$updated() {
        /// <summary locid="M:J#Sys.Data.DataContext.updated" />
        if (this._dirty) {
            this._dirty = false;
            this.raisePropertyChanged("");
        }
    }
    function Sys$Data$DataContext$_capture(data) {
        if (data instanceof Array) {
            for (var i = 0, l = data.length; i < l; i++) {
                this._captureEntity(data[i]);
            }
        }
        else if (data !== null) {
            this._captureEntity(data);
        }
    }
    function Sys$Data$DataContext$_captureEntity(item) {
        if (this._isCaptureable(item)) {
            Sys.Observer.addPropertyChanged(item, this._dataChangedDel);
        }
    }
    function Sys$Data$DataContext$_dataChanged(object, args) {
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
    }
    function Sys$Data$DataContext$_isActive() {
        return this.get_isInitialized() && !this.get_isUpdating();
    }
    function Sys$Data$DataContext$_isCaptureable(item) {
        if (item === null) return false;
        var type = typeof(item);
        return (type === "object" || type === "unknown");
    }
    function Sys$Data$DataContext$_raiseChanged(name) {
        if (this._isActive()) {
            this.raisePropertyChanged(name);
            return true;
        }
        else {
            this._dirty = true;
            return false;
        }
    }
    function Sys$Data$DataContext$_release(data) {
        if (data instanceof Array) {
            for (var i = 0, l = data.length; i < l; i++) {
                this._releaseEntity(data[i]);
            }
        }
        else if (data !== null) {
            this._releaseEntity(data);
        }
    }
    function Sys$Data$DataContext$_releaseEntity(item) {
        if (this._isCaptureable(item)) {
            Sys.Observer.removePropertyChanged(item, this._dataChangedDel);
        }
    }
    function Sys$Data$DataContext$_saveInternal(dc, changes, succeededCallback, failedCallback, context) {
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
    }
    function Sys$Data$DataContext$_filterLinks(changeSet) {
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
    }
    function Sys$Data$DataContext$_getEntityOnly(source) {
        var target = {};
        this._combine(target, source, null, true);
        return target;
    }
    function Sys$Data$DataContext$getIdentity(entity) {
        /// <summary locid="M:J#failed" />
        /// <param name="entity" type="Object" mayBeNull="false"></param>
        /// <returns mayBeNull="true" type="String"></returns>
        if (entity === null) return null;
        var getter = this.get_getIdentityMethod();
        return getter ? (getter(this, entity) || null) : null;
    }
    function Sys$Data$DataContext$isDeferredProperty(entity, propertyName) {
        /// <summary locid="M:J#failed" />
        /// <param name="entity" type="Object"></param>
        /// <param name="propertyName" type="String"></param>
        /// <returns type="Boolean"></returns>
        var getter = this.get_isDeferredPropertyMethod();
        return getter ? (getter(this, entity, propertyName) || false) : false;
    }
    function Sys$Data$DataContext$_getValueType(parent, name, object) {
        var type = typeof(object);
        if (type === "undefined") return 0;
        if ((object === null) || (type !== "object")) return 2;
        if (this.isDeferredProperty(parent, name)) return 1;
        return 2;
    }
    function Sys$Data$DataContext$_setField(target, name, source, value, mergeOption, isLink) {
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
    }
    function Sys$Data$DataContext$_combine(target, source, mergeOption, excludeEntities) {
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
    }
    function Sys$Data$DataContext$_storeEntity(identity, entity, parent, parentField, source, mergeOption) {
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
    }
    function Sys$Data$DataContext$_storeEntities(entities, mergeOption) {
        var i, l, filtered, deleted, appendOnly = (mergeOption === Sys.Data.MergeOption.appendOnly);
        for (i = 0, l = entities.length; i < l; i++) {
            var entity = entities[i], isObject = (entity && (typeof(entity) === "object"));
            if (isObject) {
                if (appendOnly) {
                    if (this._isDeleted(entity)) {
                        if (!deleted) {
                            deleted = [entity]
                        }
                        else {
                            deleted[deleted.length] = entity;
                        }
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
Sys.Data.DataContext.prototype = {
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
    get_changes: Sys$Data$DataContext$get_changes,
    get_createEntityMethod: Sys$Data$DataContext$get_createEntityMethod,
    set_createEntityMethod: Sys$Data$DataContext$set_createEntityMethod,
    get_getIdentityMethod: Sys$Data$DataContext$get_getIdentityMethod,
    set_getIdentityMethod: Sys$Data$DataContext$set_getIdentityMethod,
    get_handleSaveChangesResultsMethod: Sys$Data$DataContext$get_handleSaveChangesResultsMethod,
    set_handleSaveChangesResultsMethod: Sys$Data$DataContext$set_handleSaveChangesResultsMethod,
    get_isDeferredPropertyMethod: Sys$Data$DataContext$get_isDeferredPropertyMethod,
    set_isDeferredPropertyMethod: Sys$Data$DataContext$set_isDeferredPropertyMethod,
    get_getNewIdentityMethod: Sys$Data$DataContext$get_getNewIdentityMethod,
    set_getNewIdentityMethod: Sys$Data$DataContext$set_getNewIdentityMethod,
    get_getDeferredPropertyFetchOperationMethod: Sys$Data$DataContext$get_getDeferredPropertyFetchOperationMethod,
    set_getDeferredPropertyFetchOperationMethod: Sys$Data$DataContext$set_getDeferredPropertyFetchOperationMethod,
    get_items: Sys$Data$DataContext$get_items,
    get_lastFetchDataResults: Sys$Data$DataContext$get_lastFetchDataResults,
    get_hasChanges: Sys$Data$DataContext$get_hasChanges,
    get_fetchDataMethod: Sys$Data$DataContext$get_fetchDataMethod,
    set_fetchDataMethod: Sys$Data$DataContext$set_fetchDataMethod,
    get_mergeOption: Sys$Data$DataContext$get_mergeOption,
    set_mergeOption: Sys$Data$DataContext$set_mergeOption,
    get_saveChangesMethod: Sys$Data$DataContext$get_saveChangesMethod,
    set_saveChangesMethod: Sys$Data$DataContext$set_saveChangesMethod,
    get_saveOperation: Sys$Data$DataContext$get_saveOperation,
    set_saveOperation: Sys$Data$DataContext$set_saveOperation,
    get_saveHttpVerb: Sys$Data$DataContext$get_saveHttpVerb,
    set_saveHttpVerb: Sys$Data$DataContext$set_saveHttpVerb,
    get_saveParameters: Sys$Data$DataContext$get_saveParameters,
    set_saveParameters: Sys$Data$DataContext$set_saveParameters,    
    get_saveChangesTimeout: Sys$Data$DataContext$get_saveChangesTimeout,
    set_saveChangesTimeout: Sys$Data$DataContext$set_saveChangesTimeout,        
    get_isSaving: Sys$Data$DataContext$get_isSaving,
    get_serviceUri: Sys$Data$DataContext$get_serviceUri,
    set_serviceUri: Sys$Data$DataContext$set_serviceUri,
    addLink: Sys$Data$DataContext$addLink,
    removeLink: Sys$Data$DataContext$removeLink,
    setLink: Sys$Data$DataContext$setLink,    
    abortSave: Sys$Data$DataContext$abortSave,
    clearChanges: Sys$Data$DataContext$clearChanges,
    clearData: Sys$Data$DataContext$clearData,
    createEntity: Sys$Data$DataContext$createEntity,
    dispose: Sys$Data$DataContext$dispose,
    initialize: Sys$Data$DataContext$initialize,
    fetchDeferredProperty: Sys$Data$DataContext$fetchDeferredProperty,
    getNewIdentity: Sys$Data$DataContext$getNewIdentity,
    insertEntity: Sys$Data$DataContext$insertEntity,
    removeEntity: Sys$Data$DataContext$removeEntity,
    fetchData: Sys$Data$DataContext$fetchData,
    _clearData: Sys$Data$DataContext$_clearData,
    _fixAfterSave: Sys$Data$DataContext$_fixAfterSave,
    trackData: Sys$Data$DataContext$trackData,
    _processResults: Sys$Data$DataContext$_processResults,
    _peekChange: Sys$Data$DataContext$_peekChange,
    _pushChange: Sys$Data$DataContext$_pushChange,
    _registerChange: Sys$Data$DataContext$_registerChange,
    saveChanges: Sys$Data$DataContext$saveChanges,
    _isDeleted: Sys$Data$DataContext$_isDeleted,
    _removeChanges: Sys$Data$DataContext$_removeChanges,
    _setLinkField: Sys$Data$DataContext$_setLinkField,
    _toggleLink: Sys$Data$DataContext$_toggleLink,
    updated: Sys$Data$DataContext$updated,
    _capture: Sys$Data$DataContext$_capture,
    _captureEntity: Sys$Data$DataContext$_captureEntity,
    _dataChanged: Sys$Data$DataContext$_dataChanged,
    _isActive: Sys$Data$DataContext$_isActive,
    _isCaptureable: Sys$Data$DataContext$_isCaptureable,
    _raiseChanged: Sys$Data$DataContext$_raiseChanged,
    _release: Sys$Data$DataContext$_release,
    _releaseEntity: Sys$Data$DataContext$_releaseEntity,
    _saveInternal: Sys$Data$DataContext$_saveInternal,
    _filterLinks: Sys$Data$DataContext$_filterLinks,
    _getEntityOnly: Sys$Data$DataContext$_getEntityOnly,
    getIdentity: Sys$Data$DataContext$getIdentity,
    isDeferredProperty: Sys$Data$DataContext$isDeferredProperty,
    _getValueType: Sys$Data$DataContext$_getValueType,
    _setField: Sys$Data$DataContext$_setField,
    _combine: Sys$Data$DataContext$_combine,
    _storeEntity: Sys$Data$DataContext$_storeEntity,
    _storeEntities: Sys$Data$DataContext$_storeEntities
}
Sys.Data.DataContext.registerClass("Sys.Data.DataContext", Sys.Component, Sys.Data.IDataProvider);
Sys.registerComponent(Sys.Data.DataContext);
Sys.Data.ChangeOperationType = function Sys$Data$ChangeOperationType() {
    /// <summary locid="M:J#Sys.Data.ChangeOperationType.#ctor" />
    /// <field name="insert" type="Number" integer="true" static="true" locid="F:J#Sys.Data.ChangeOperationType.insert"></field>
    /// <field name="update" type="Number" integer="true" static="true" locid="F:J#Sys.Data.ChangeOperationType.update"></field>
    /// <field name="remove" type="Number" integer="true" static="true" locid="F:J#Sys.Data.ChangeOperationType.remove"></field>
    throw Error.notImplemented();
}




Sys.Data.ChangeOperationType.prototype = {
    insert: 0,
    update: 1,
    remove: 2
}
Sys.Data.ChangeOperationType.registerEnum("Sys.Data.ChangeOperationType");
Sys.Data.ChangeOperation = function Sys$Data$ChangeOperation(action, item, linkSource, linkSourceField, linkTarget) {
    /// <summary locid="M:J#Sys.Data.ChangeOperation.#ctor" />
    /// <param name="action" type="Sys.Data.ChangeOperationType"></param>
    /// <param name="item" mayBeNull="true"></param>
    /// <param name="linkSource" mayBeNull="true" optional="true"></param>
    /// <param name="linkSourceField" mayBeNull="true" optional="true"></param>
    /// <param name="linkTarget" mayBeNull="true" optional="true"></param>
    /// <field name="action" type="Sys.Data.ChangeOperationType" locid="F:J#Sys.Data.ChangeOperation.action"></field>
    /// <field name="item" mayBeNull="true" locid="F:J#Sys.Data.ChangeOperation.item"></field>
    /// <field name="linkSource" mayBeNull="true" locid="F:J#Sys.Data.ChangeOperation.linkSource"></field>
    /// <field name="linkSourceField" mayBeNull="true" locid="F:J#Sys.Data.ChangeOperation.linkSourceField"></field>
    /// <field name="linkTarget" mayBeNull="true" locid="F:J#Sys.Data.ChangeOperation.linkTarget"></field>
    this.action = action;
    this.item = item;
    this.linkSourceField = linkSourceField;
    this.linkSource = linkSource;
    this.linkTarget = linkTarget;
}






Sys.Data.ChangeOperation.prototype = {
    action: null,
    item: null,
    linkSource: null,
    linkSourceField: null,
    linkTarget: null
}
Sys.Data.ChangeOperation.registerClass("Sys.Data.ChangeOperation");

Sys.Data.AdoNetDataContext = function Sys$Data$AdoNetDataContext() {
    Sys.Data.AdoNetDataContext.initializeBase(this);
    this.set_getIdentityMethod(this._getIdentity);
    this.set_getNewIdentityMethod(this._getNewIdentity);
    this.set_fetchDataMethod(this._fetchAdoNet);
    this.set_saveChangesMethod(this._saveAdoNet);
    this.set_createEntityMethod(this._createEntity);
    this.set_handleSaveChangesResultsMethod(this._processResultsAdoNet);
    this.set_getDeferredPropertyFetchOperationMethod(this._getDeferredQuery);
    this.set_isDeferredPropertyMethod(this._isDeferred);
}





    function Sys$Data$AdoNetDataContext$_createEntity(dataContext, entitySetName) {
        var obj = {};
        dataContext._createMetaData(obj, entitySetName);
        return obj;
    }
    function Sys$Data$AdoNetDataContext$_fetchAdoNet(dataContext, uri, operation, parameters, httpVerb, succeededCallback, failedCallback, timeout, context) {
        if (operation) {
            if (typeof(operation) !== "string") {
                operation = operation.toString();
            }
            var i = operation.indexOf(":");
            if ((i !== -1) && (i < operation.indexOf("/"))) {
                uri = operation;
            }
        }
        var proxy = dataContext._getProxy(uri || "");
        return proxy.fetchData(operation, parameters || null, null, httpVerb || null, succeededCallback || null, failedCallback || null, timeout || 0, context || null);
    }
    function Sys$Data$AdoNetDataContext$_getDeferredQuery(dataContext, entity, propertyName, parameters, userContext) {
        var uri = null, value = entity[propertyName];
        if ((value === null) || (typeof(value) === "undefined") || (value instanceof Array)) {
            uri = dataContext.getIdentity(entity);
            uri += (uri.endsWith("/") ? propertyName : ("/" + propertyName));
        }
        else if (typeof(value) === "object") {
            uri = dataContext.getIdentity(value);
            if (!uri) {
                uri = value.__deferred ? value.__deferred.uri : null;
            }
        }
        if (!uri) {
            throw Error.invalidOperation(String.format(Sys.Data.AdoNetRes.propertyNotFound, propertyName));
        }
        return new Sys.Net.WebServiceOperation(uri, parameters);
    }
    function Sys$Data$AdoNetDataContext$_getProxy(uri) {
        if (this._puri !== uri) {
            Type._checkDependency("MicrosoftAjaxAdoNet.js", "Sys.Data.AdoNetDataContext");
            this._proxy = new Sys.Data.AdoNetServiceProxy(uri);
            this._puri = uri;
        }
        return this._proxy;
    }
    function Sys$Data$AdoNetDataContext$_isDeferred(dataContext, entity, propertyName) {
        var value = entity[propertyName];
        return !!(value && (typeof(value) === "object") && value.__deferred);
    }
    function Sys$Data$AdoNetDataContext$_processResultsAdoNet(dataContext, changes, results) {
        if (results && (results.length === changes.length)) {
            for (var i = 0, l = results.length; i < l; i++) {
                var change = changes[i], item = change.item,
                    result = results[i], data = result.get_result(),
                    headers = result.get_httpHeaders();
                if (item) {
                    if (data) {
                        dataContext._fixAfterSave(change, item, data);
                    }
                    if (headers.ETag && item.__metadata) {
                        item.__metadata.etag = headers.ETag;
                    }
                }
            }
        }
    }
    function Sys$Data$AdoNetDataContext$_getBatchReference(item, batchField, batchRefPrefix, stripUri) {
        var batchnum = item.__metadata[batchField];
        if (typeof(batchnum) === "number") {
            return batchRefPrefix + "$" + batchnum;
        }
        else {
            var uri = this.getIdentity(item);
            if (!uri) {
                throw Error.invalidOperation(Sys.Data.AdoNetRes.batchLinkBeforeInsert);
            }
            if (stripUri) {
                uri = uri.substr(uri.lastIndexOf("/"));
            }
            return uri;
        }
    }
    function Sys$Data$AdoNetDataContext$_saveAdoNet(dataContext, changes, succeededCallback, failedCallback, context) {
        var uri = dataContext.get_serviceUri(),
            request = null;
        if (!uri) {
            failedCallback(new Sys.Net.WebServiceError(false, String.format(Sys.Res.webServiceFailedNoMsg, "saveChanges")), context, "saveChanges");
        }
        else {
            var i, l, proxy = dataContext._getProxy(uri),
                sequence = proxy.createActionSequence(),
                batchField = ("__batchNumber" + dataContext._saveCounter++);
            proxy.set_timeout(dataContext.get_saveChangesTimeout());
            for (i = 0, l = changes.length; i < l; i++) {
                var change = changes[i],
                    item = change.item;
                switch(change.action) {
                    case Sys.Data.ChangeOperationType.insert:
                        if (item) {
                            var originalItem = dataContext.get_items()[dataContext.getIdentity(item)];
                            delete item.__metadata;
                            originalItem.__metadata[batchField] = i;
                            sequence.addInsertAction(item, originalItem.__metadata.entitySet);
                        }
                        else {
                            sequence.addInsertAction({ uri: dataContext._getBatchReference(change.linkTarget, batchField, "") },
                                dataContext._getBatchReference(change.linkSource, batchField, "/") + "/$links/" + change.linkSourceField);
                        }
                        break;
                    case Sys.Data.ChangeOperationType.update:
                        if (item) {
                            sequence.addUpdateAction(item);
                        }
                        else {
                            if (change.linkTarget) {
                                sequence.addUpdateAction({ uri: dataContext._getBatchReference(change.linkTarget, batchField, "") },
                                    dataContext._getBatchReference(change.linkSource, batchField, "/") + "/$links/" + change.linkSourceField);
                            }
                            else {
                                sequence.addRemoveAction(
                                    {__metadata: { uri:
                                        dataContext._getBatchReference(change.linkSource, batchField, "/") + "/$links/" + change.linkSourceField }});
                            }
                        }
                        break;
                    case Sys.Data.ChangeOperationType.remove:                
                        if (item) {
                            sequence.addRemoveAction(item);
                        }
                        else {
                            sequence.addRemoveAction(
                                {__metadata: { uri: dataContext._getBatchReference(change.linkSource, batchField, "/") + "/$links" +
                                dataContext._getBatchReference(change.linkTarget, batchField, "/", true) }});
                        }
                        break;
                }
            }
            request = sequence.execute(succeededCallback, failedCallback, context);
        }
        return request;
    }
    function Sys$Data$AdoNetDataContext$_createMetaData(entity, entitySetName) {
        entity.__metadata = { entitySet: entitySetName, uri: entitySetName + "(__new" + this._entityCounter++ + ")" };
    }
    function Sys$Data$AdoNetDataContext$_getNewIdentity(dataContext, entity, entitySetName) {
        if (!entitySetName) {
            throw Error.invalidOperation(Sys.Data.AdoNetRes.entityWithNoResourceSet);
        }
        dataContext._createMetaData(entity, entitySetName);
        return entity.__metadata.uri;
    }
    function Sys$Data$AdoNetDataContext$_getIdentity(dataContext, entity) {
        var metadata = entity.__metadata;
        if (metadata) {
            return metadata.uri || null;
        }
        return null;
    }
Sys.Data.AdoNetDataContext.prototype = {
    _proxy: null,
    _puri: null,
    _entityCounter: 0,
    _saveCounter: 1,
    _createEntity: Sys$Data$AdoNetDataContext$_createEntity,
    _fetchAdoNet: Sys$Data$AdoNetDataContext$_fetchAdoNet,
    _getDeferredQuery: Sys$Data$AdoNetDataContext$_getDeferredQuery,
    _getProxy: Sys$Data$AdoNetDataContext$_getProxy,
    _isDeferred: Sys$Data$AdoNetDataContext$_isDeferred,
    _processResultsAdoNet: Sys$Data$AdoNetDataContext$_processResultsAdoNet,
    _getBatchReference: Sys$Data$AdoNetDataContext$_getBatchReference,
    _saveAdoNet: Sys$Data$AdoNetDataContext$_saveAdoNet,
    _createMetaData: Sys$Data$AdoNetDataContext$_createMetaData,
    _getNewIdentity: Sys$Data$AdoNetDataContext$_getNewIdentity,
    _getIdentity: Sys$Data$AdoNetDataContext$_getIdentity
}
Sys.Data.AdoNetDataContext.registerClass("Sys.Data.AdoNetDataContext", Sys.Data.DataContext);
Sys.registerComponent(Sys.Data.AdoNetDataContext);
}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("DataContext", null, execute);
}
else {
	execute();
}

})();

Type.registerNamespace('Sys.Data');

Sys.Data.DataRes={
'commonNotAfterInit':'{0} \'{1}\' cannot be set after initialize.',
'requiredUri':'A serviceUri must be set prior to calling fetchData.',
'mustBeArray':'The property \'{0}\' is not an Array.',
'requiredMethodProperty':'The \'{0}\' property must be set to a function to use the \'{1}\' operation.',
'requiredIdentity':'The entity must have an identity or a new identity must be creatable with the set getNewIdentityMethod.',
'entityAlreadyExists':'Entity \'{0}\' already exists and cannot be added again.'
};
