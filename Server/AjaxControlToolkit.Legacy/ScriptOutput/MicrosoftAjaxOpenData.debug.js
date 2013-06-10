// (c) 2010 CodePlex Foundation

//!/ <reference name="MicrosoftAjaxDataContext.js" />
(function() {

function execute() {
Type._registerScript("MicrosoftAjaxOpenData.js", ["MicrosoftAjaxDataContext.js"]);

var $type, $prototype;
var merge = Sys._merge;
var forIn = Sys._forIn;

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
$type = Sys.Data.OpenDataQueryBuilder = function Data$OpenDataQueryBuilder(uri) {
    /// <summary locid="M:J#Sys.Data.OpenDataQueryBuilder.#ctor">Allows construction of ADO.NET Data Service queries.</summary>
    /// <param name="uri" type="String">The URI (absolute or relative) to parse.</param>
    this._queryParameters = {};
    this._uri = uri;
    var idxQuery = uri.indexOf('?');
    if (idxQuery >= 0) {
        this._uri = uri.substr(0, idxQuery);
        var params = uri.substr(idxQuery + 1).split('&');
        for (var i in params) {
            var param = params[i];
            var idxValue = param.indexOf('=');
            if (idxValue >= 0) {
                this._queryParameters[decodeURIComponent(param.substr(0, idxValue))] = decodeURIComponent(param.substr(idxValue + 1));
            }
            else {
                this._queryParameters[decodeURIComponent(param)] = "";
            }
        }
    }
}
$type.prototype = {
    _queryParameters: null,
    _uri: null,
    get_skip: function OpenDataQueryBuilder$get_skip() {
        /// <value type="Number" integer="true" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.skip">The number of elements to skip when returning results, or null if no skip value is specified.</value>
        return this._getIntParam("$skip");
    },
    set_skip: function OpenDataQueryBuilder$set_skip(value) {
        this._setParam("$skip", value);
    },
    get_top: function OpenDataQueryBuilder$get_top() {
        /// <value type="Number" integer="true" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.top">The maximum number of elements to return, or null if no maximum is specified.</value>
        return this._getIntParam("$top");
    },
    set_top: function OpenDataQueryBuilder$set_top(value) {
        this._setParam("$top", value);
    },
    get_orderby: function OpenDataQueryBuilder$get_orderby() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.orderby">The ordering applied to the result set, or null if no ordering is specified.</value>
        return this._getStringParam("$orderby");
    },
    set_orderby: function OpenDataQueryBuilder$set_orderby(value) {
        this._setParam("$orderby", value);
    },
    get_filter: function OpenDataQueryBuilder$get_filter() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.filter">The filter applied to the result set, or null if no filter is specified.</value>
        return this._getStringParam("$filter");
    },
    set_filter: function OpenDataQueryBuilder$set_filter(value) {
        this._setParam("$filter", value);
    },
    get_select: function OpenDataQueryBuilder$get_select() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.select">A comma-delimited list of columns to retrieve.</value>
        return this._getStringParam("$select");
    },
    set_select: function OpenDataQueryBuilder$set_select(value) {
        this._setParam("$select", value);
    },
    get_expand: function OpenDataQueryBuilder$get_expand() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.expand">The property expansion applied to the result set, or null if no property expansion is specified.</value>
        return this._getStringParam("$expand");
    },
    set_expand: function OpenDataQueryBuilder$set_expand(value) {
        this._setParam("$expand", value);
    },
    get_inlineCount: function OpenDataQueryBuilder$get_inlineCount() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.inlineCount">.</value>
        return this._getStringParam("$inlinecount");
    },
    set_inlineCount: function OpenDataQueryBuilder$set_inlineCount(value) {
        this._setParam("$inlinecount", value);
    },
    get_resourcePath: function OpenDataQueryBuilder$get_resourcePath() {
        /// <value type="string" locid="P:J#Sys.Data.OpenDataQueryBuilder.resourcePath">The resource path of this QueryBuilder object.</value>
        return this._uri;
    },
    /* setter temporarily removed until we can figure out how to spec it
    set_resourcePath: function(value) {
    var idxQuery = value.indexOf('?');
    this._uri = (idxQuery >= 0) ? value.substr(0, idxQuery) : value;
    }, */
    get_queryParameters: function OpenDataQueryBuilder$get_queryParameters() {
        /// <value type="Object" locid="P:J#Sys.Data.OpenDataQueryBuilder.queryParameters">A dictionary of query parameters. This object will be non-null but may contain no fields if no query parameters have been set.</value>
        return this._queryParameters;
    },
    set_queryParameters: function OpenDataQueryBuilder$set_queryParameters(value) {
        this._queryParameters = value;
    },
    toString: function OpenDataQueryBuilder$toString() {
        /// <summary locid="M:J#Sys.Data.OpenDataQueryBuilder.toString">Generates a complete query string based on this object's resource path and parameter dictionary.</summary>
        /// <returns type="string">The complete query string.</returns>
        var key, i, value, params = new Array(), qParams = this._queryParameters, options = Sys.Data.OpenDataQueryBuilder._queryOptions;
        for (key in qParams) {
            if (qParams.hasOwnProperty(key) && !Array.contains(options, key)) {
                value = qParams[key];
                if (value != null) {
                    params.push({ key: key, value: value });
                }
            }
        }
        for (i in options) {
            key = options[i];
            value = qParams[key];
            if (value != null) {
                params.push({ key: key, value: value });
            }
        }

        var sb = new Sys.StringBuilder(this._uri);
        var firstElement = true;
        for (i in params) {
            if (params.hasOwnProperty(i)) {
                sb.append((firstElement) ? '?' : '&');
                sb.append(encodeURIComponent(params[i].key));
                sb.append('=');
                sb.append(encodeURIComponent(params[i].value));
                firstElement = false;
            }
        }
        return sb.toString();
    },
    _getIntParam: function OpenDataQueryBuilder$_getIntParam(name) {
        var value = parseInt(this._queryParameters[name]);
        return (isNaN(value)) ? null : value;
    },
    _getStringParam: function OpenDataQueryBuilder$_getStringParam(name) {
        var value = this._queryParameters[name];
        return value || null;
    },
    _setParam: function OpenDataQueryBuilder$_setParam(name, value) {
        if (typeof(value) === "undefined" || (value === null)) {
            delete this._queryParameters[name];
        }
        else {
            this._queryParameters[name] = value;
        }
    }
}

$type._queryOptions = ["$filter", "$orderby", "$skip", "$top"];
$type.registerClass("Sys.Data.OpenDataQueryBuilder");
$type = Sys.Data._OpenDataUtil = function Data$_OpenDataUtil() {
    throw Error.invalidOperation();
}

$type.concatUris = function _OpenDataUtil$concatUris(serviceUri, resourceUri) {
    if (resourceUri.indexOf("//") >= 0) {
        return resourceUri;
    }
    
    if (serviceUri.endsWith('/')) {
        serviceUri = serviceUri.substr(0, serviceUri.length - 1);
    }
    if (resourceUri.startsWith('/')) {
        resourceUri = resourceUri.substr(1);
    }
    return serviceUri + '/' + resourceUri;
}

$type.extractETag = function _OpenDataUtil$extractETag(item) {
    return (item.__metadata) ? (item.__metadata.etag || null) : null;
}

$type.extractUri = function _OpenDataUtil$extractUri(item) {
    return (item.__metadata) ? (item.__metadata.uri || null) : null;
}

$type.registerClass("Sys.Data._OpenDataUtil");    
$type = Sys.Data.OpenDataActionResult = function Data$OpenDataActionResult(result, httpHeaders, actionContext, operation) {
    /// <summary locid="M:J#Sys.Data.OpenDataActionResult.#ctor"></summary>
    /// <param name="result" mayBeNull="true">The result of the operation, or null if there was no result.</param>
    /// <param name="httpHeaders" mayBeNull="true">HTTP Headers.</param>
    /// <param name="actionContext" mayBeNull="true">A context associated with this operation.</param>
    /// <param name="operation" type="String">The operation that was performed.</param>
    this._result = result;
    this._headers = httpHeaders || {};
    this._actionContext = actionContext;
    this._operation = operation;
}
$type.prototype = {
    _actionContext: null,
    _operation: null,
    _result: null,
    _headers: null,
    get_httpHeaders: function OpenDataActionResult$get_httpHeaders() {
        /// <value type="Object" locid="P:J#Sys.Data.OpenDataActionResult.httpHeaders">A dictionary of HTTP headers associated with the entry for this action in a batch response.</value>
        return this._headers;
    },
    get_actionContext: function OpenDataActionResult$get_actionContext() {
        /// <value mayBeNull="true" locid="P:J#Sys.Data.OpenDataActionResult.actionContext">A context associated with this operation.</value>
        return this._actionContext;
    },
    get_operation: function OpenDataActionResult$get_operation() {
        /// <value type="String" locid="P:J#Sys.Data.OpenDataActionResult.operation">The operation that was performed.</value>
        return this._operation;
    },
    get_result: function OpenDataActionResult$get_result() {
        /// <value type="Object" mayBeNull="true" locid="P:J#Sys.Data.OpenDataActionResult.result">The result of the operation, or null if there was no result.</value>
        return this._result;
    }
}
$type.registerClass("Sys.Data.OpenDataActionResult");
$type = Sys.Data.OpenDataActionSequence = function Data$OpenDataActionSequence(dataService) {
    /// <summary locid="M:J#Sys.Data.OpenDataActionSequence.#ctor">Exposes methods for performing batch operations against a web-based data service.</summary>
    /// <param name="dataService" type="Sys.Data.OpenDataServiceProxy">The OpenDataServiceProxy object against which to perform operations.</param>
    this._actionQueue = [];
    this._dataService = dataService;
}
$type.prototype = {
    get_serviceProxy: function OpenDataActionSequence$get_serviceProxy() {
        /// <value type="Sys.Data.OpenDataServiceProxy" locid="P:J#Sys.Data.OpenDataActionSequence.serviceProxy">The DataService.</value>
        return this._dataService;
    },
    addInsertAction: function OpenDataActionSequence$addInsertAction(item, resourceSetUri, actionContext) {
        /// <summary locid="M:J#Sys.Data.OpenDataActionSequence.addInsertAction">Adds an insertion to the execution queue.</summary>
        /// <param name="item" type="Object">Item to insert.</param>
        /// <param name="resourceSetUri" type="String" mayBeNull="true">Resource set into which the item should be inserted.</param>
        /// <param name="actionContext" mayBeNull="true" optional="true">A context object associated with this operation.</param>
        this._actionQueue.push([0, resourceSetUri, item, actionContext]);
    },
    addUpdateAction: function OpenDataActionSequence$addUpdateAction(item, updateItemUri, actionContext) {
        /// <summary locid="M:J#Sys.Data.OpenDataActionSequence.addUpdateAction">Adds an update to the execution queue.</summary>
        /// <param name="item" type="Object">Item to serve as the body of the update.</param>
        /// <param name="updateItemUri" type="String" optional="true" mayBeNull="true">The uri of the item being updated, if different than the item.</param>
        /// <param name="actionContext" mayBeNull="true" optional="true">A context object associated with this operation.</param>
        var queue = this._actionQueue;
        this._actionQueue.push([1, updateItemUri || null, item, actionContext]);
    },
    addRemoveAction: function OpenDataActionSequence$addRemoveAction(item, actionContext) {
        /// <summary locid="M:J#Sys.Data.OpenDataActionSequence.addRemoveAction">Adds a removal to the execution queue.</summary>
        /// <param name="item" type="Object" mayBeNull="true">Item to remove.</param>
        /// <param name="actionContext" mayBeNull="true" optional="true">A context object associated with this operation.</param>
        this._actionQueue.push([2, null, item, actionContext]);
    },
    clearActions: function OpenDataActionSequence$clearActions() {
        /// <summary locid="M:J#Sys.Data.OpenDataActionSequence.clearActions">Clears the action queue.</summary>
        this._actionQueue = [];
    },
    execute: function OpenDataActionSequence$execute(succeededCallback, failedCallback, userContext) {
        /// <summary locid="M:J#Sys.Data.OpenDataActionSequence.execute">Executes operations in the action queue.</summary>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon completion of all operations.</param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true">Callback to execute if the batch request fails.</param>
        /// <param name="userContext" mayBeNull="true" optional="true">A context object associated with this batch.</param>
        /// <returns type="Sys.Net.WebRequest"></returns>
        var queue = this._actionQueue,
            bw = new Sys.Data._OpenDataBatchWriter(window.location.host),
            ds = this._dataService;
        this._actionQueue = [];
        
        bw.startChangeSet();
        for (var i = 0, l = queue.length; i < l; i++) {
            var action = queue[i],
                uri = action[1],
                item = action[2],
                eTag = Sys.Data._OpenDataUtil.extractETag(item);
            switch (action[0]) {
                case 0:
                    action[0] = "insert";
                    bw.addChange(uri, eTag, "POST", Sys.Serialization.JavaScriptSerializer.serialize(item), i);
                    break;
                case 1:
                    action[0] = "edit";
                    if (!uri) {
                        uri = Sys.Data._OpenDataUtil.extractUri(item);
                    }
                    bw.addChange(uri, eTag, ds.get_replaceOnUpdate() ? "PUT" : "MERGE", Sys.Serialization.JavaScriptSerializer.serialize(item));
                    break;
                case 2:
                    action[0] = "remove";
                    uri = Sys.Data._OpenDataUtil.extractUri(item);
                    bw.addChange(uri, eTag, "DELETE", null);
                    break;
            }
        }
        bw.endChangeSet();

        var r = new Sys.Net.WebRequest();
        r.set_url(Sys.Data._OpenDataUtil.concatUris(ds.get_serviceUri(), "$batch"));
        r.get_headers()["Content-Type"] = "multipart/mixed; boundary=" + bw.get_topBoundary();
        r.set_httpVerb("POST");
        r.set_timeout(ds.get_timeout());
        r.set_body(bw.get_requestBody());
        r.set_userContext({ q: queue, bw: bw, c: userContext, s: succeededCallback, f: failedCallback });
        r.add_completed(Function.createDelegate(this, this._batchCompleted));
        r.invoke();
        return r;
    },
    _batchCompleted: function OpenDataActionSequence$_batchCompleted(executor) {
        var data, responses, response,
            ctx = executor.get_webRequest().get_userContext(),
            queue = ctx.q,
            onFailed = ctx.f,
            onSuccess = ctx.s,
            userContext = ctx.c,
            bw = ctx.bw,
            dsError = this._dataService._checkForError(executor, "actionSequence", false);
            
        function checkPartForError() {
            var status = response.status ? parseFloat(response.status.code) : -1;
            if (status < 200 || status > 300) {
                var message;
                if (response.headers["Content-Type"] === "application/json") {
                    var errorObj = Sys.Serialization.JavaScriptSerializer.deserialize(response.body);
                    dsError = Sys.Data.OpenDataActionSequence._getError(false, status, null, errorObj, "actionSequence");
                }
                else {
                    dsError = Sys.Data.OpenDataActionSequence._getError(false, status, String.format(Sys.Data.OpenDataRes.operationFailed, "actionSequence"));
                }
            }
        }
        function doError() {
            if (onFailed) {
                onFailed(dsError, userContext, "actionSequence");
            }
            else {
                throw Sys.Data.OpenDataServiceProxy._createFailedError("actionSequence", dsError.get_message());
            }
        }
        
        if (dsError) {
            doError();
            return;
        }
        
        responses = Sys.Data._OpenDataBatchReader._parseResponse(executor);
        if (responses.length !== 1) {
            dsError = Sys.Data.OpenDataActionSequence._getError(false, -1,
                String.format(Sys.Data.OpenDataRes.invalidBatchResponse, executor.get_webRequest().get_url()));
            doError();
            return;
        }
        responses = responses[0];
        if (responses.length === 1) {
            response = responses[0];
            checkPartForError();
            if (dsError) {
                doError();
                return;
            }
        }
        if (responses.length !== queue.length) {
            dsError = Sys.Data.OpenDataActionSequence._getError(false, -1, 
                String.format(Sys.Data.OpenDataRes.invalidBatchResponse, executor.get_webRequest().get_url()));
            doError();
            return;
        }
        
        
        if (onSuccess) {
            var l = responses.length,
                results = new Array(l),
                body;
            for (var i = 0; i < l; i++) {
                response = responses[i];
                body = response.body;
                data = null;
                if (body) {
                    data = Sys.Serialization.JavaScriptSerializer.deserialize(body);
                    if (data && data.d) {
                        data = data.d;
                    }
                }
                var queueEntry = queue[i],
                    actionContext = queueEntry[3],
                    operation = queueEntry[0];
                if (typeof(actionContext) === "undefined") {
                    actionContext = null;
                }
                results[i] = new Sys.Data.OpenDataActionResult(data, response.headers, actionContext, operation);
            }
            onSuccess(results, userContext, "actionSequence");
        }
    }
}
$type.registerClass("Sys.Data.OpenDataActionSequence");
$type._getError = function OpenDataActionSequence$_getError(timedOut, statusCode, message, errorObject, operation) {
    var dserror, e = errorObject ? errorObject.error : null;
    if (!e) {
        dserror = new Sys.Net.WebServiceError(timedOut,
            String.format(message || Sys.Data.OpenDataRes.operationFailed, operation));
    }
    else {
        var m = e.message, innererror = e.innererror, stack, type;
        m = (m && m.value) ? m.value : null;
        if (innererror) {
            type = innererror.type;
            stack = innererror.stacktrace;
        }
        dserror = new Sys.Net.WebServiceError(timedOut,
            String.format(message || m || Sys.Data.OpenDataRes.operationFailed, operation),
            stack || null,
            type || null,
            errorObject);
    }
    dserror._statusCode = statusCode;
    return dserror;
}
/*
var x = {
    "error": {
        "code": "",
        "message": { "lang": "en-US", "value": "An error occurred while processing this request." },
        "innererror": {
            "message": "An error occurred while updating the entries. See the InnerException for details.",
            "type": "System.Data.UpdateException",
            "stacktrace": "   at System.Data.Mapping.Update.Internal.UpdateTranslator...cut...",
            "internalexception": {
                "message": "Cannot insert the value NULL into column \'CustomerID\', table \'NORTHWIND.MDF.dbo.Customers\'; column does not allow nulls. INSERT fails.\r\nThe statement has been terminated.",
                "type": "System.Data.SqlClient.SqlException",
                "stacktrace": "   at System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection)\r\n   at System.Data.SqlClient.SqlInternalConnection.OnError(SqlException exception, Boolean breakConnection)\r\n   at System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj)\r\n   at System.Data.SqlClient.TdsParser.Run(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj)\r\n   at System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString)\r\n   at System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async)\r\n   at System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, DbAsyncResult result)\r\n   at System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(DbAsyncResult result, String methodName, Boolean sendToPipe)\r\n   at System.Data.SqlClient.SqlCommand.ExecuteNonQuery()\r\n   at System.Data.Mapping.Update.Internal.DynamicUpdateCommand.Execute(UpdateTranslator translator, EntityConnection connection, Dictionary`2 identifierValues, List`1 generatedValues)\r\n   at System.Data.Mapping.Update.Internal.UpdateTranslator.Update(IEntityStateManager stateManager, IEntityAdapter adapter)"
                                 }
                      }
             }
        }
*/

$type = Sys.Data.OpenDataInvokeParametersBuilder = function Data$OpenDataInvokeParametersBuilder() {
    /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.#ctor">Creates an empty OpenDataInvokeParametersBuilder object.</summary>
    
    this._queryBuilder = new Sys.Data.OpenDataQueryBuilder("");
    this._parameters = this._queryBuilder.get_queryParameters();
}

$type.prototype = {


    _parameters: null,
    _queryBuilder: null,


    get_parameters: function OpenDataInvokeParametersBuilder$get_parameters() {
        /// <value locid="P:J#Sys.Data.OpenDataInvokeParametersBuilder.parameters">A dictionary of parameters. This object will be non-null but may contain no fields if no parameters have been set.</value>
        return this._parameters;
    },


    addBoolean: function OpenDataInvokeParametersBuilder$addBoolean(name, value) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addBoolean">Adds a Boolean parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="Boolean">The value of the parameter to be added.</param>

        this._parameters[name] = value.toString();
    },

    addDate: function OpenDataInvokeParametersBuilder$addDate(name, value, includeTimeZone) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addDate">Adds a Date parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="Date">The value of the parameter to be added.</param>
        /// <param name="includeTimeZone" type="Boolean" optional="true" mayBeNull="true">True to include time zone information with this Date object, false to exclude the time zone.</param>

        var converted = (includeTimeZone)
            ? value.format("yyyy-MM-ddTHH:mm:ss.fffffffzzz")
            : value.format("yyyy-MM-ddTHH:mm:ss.fffffff");
            
        this._parameters[name] = "datetime'" + converted + "'";
    },

    addDecimal: function OpenDataInvokeParametersBuilder$addDecimal(name, value) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addDecimal">Adds a Decimal parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="Number">The value of the parameter to be added.</param>

        this._parameters[name] = value.toString() + "M";
    },

    addDouble: function OpenDataInvokeParametersBuilder$addDouble(name, value) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addDouble">Adds a floating point parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="Number">The value of the parameter to be added.</param>

        this._parameters[name] = value.toString();
    },

    addGuid: function OpenDataInvokeParametersBuilder$addGuid(name, value) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addGuid">Adds a GUID parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="String">The value of the parameter to be added. The parameter must be a string of the form "dddddddd-dddd-dddd-dddd-dddddddddddd".</param>

        var matchFound = value.match(Sys.Data.OpenDataInvokeParametersBuilder._guidRegex);
        if (!matchFound) {
            var er = Error.create(Sys.Data.OpenDataRes.invalidGuid, { name: "Sys.Data.OpenDataException" });
            throw er;
        }
        
        this._parameters[name] = "guid'" + value + "'";
    },

    addInteger: function OpenDataInvokeParametersBuilder$addInteger(name, value) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addInteger">Adds an integer parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="Number" integer="true">The value of the parameter to be added.</param>

        this._parameters[name] = value.toString();
    },

    addString: function OpenDataInvokeParametersBuilder$addString(name, value) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addString">Adds a string parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="String">The value of the parameter to be added.</param>

        this._parameters[name] = "'" + value.replace(new RegExp("'", "g"), "''") + "'";
    },

    toString: function OpenDataInvokeParametersBuilder$toString() {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.toString">Generates a complete query string based on this object's parameter dictionary.</summary>
        /// <returns type="String">The complete query string.</returns>

        return this._queryBuilder.toString();
    }

}


$type._guidRegex = /^[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}$/;

$type.registerClass("Sys.Data.OpenDataInvokeParametersBuilder");
$type = Sys.Data.OpenDataServiceProxy = function Data$OpenDataServiceProxy(serviceUri) {
    /// <summary locid="M:J#Sys.Data.OpenDataServiceProxy.#ctor"></summary>
    /// <param name="serviceUri" type="String" mayBeNull="true" optional="true">Path to the OData Service.</param>
    Sys.Data.OpenDataServiceProxy.initializeBase(this);
    if (serviceUri) {
        this.set_path(serviceUri);
    }
}
$type.prototype = {
    _replaceOnUpdate: false,
    _usePostTunneling: true,
    get_replaceOnUpdate: function OpenDataServiceProxy$get_replaceOnUpdate() {
        /// <value type="Boolean" mayBeNull="false" locid="P:J#Sys.Data.OpenDataServiceProxy.replaceOnUpdate">True if the update() method should replace a server item entirely; false if the method should merge new values into the old item.</value>
        return this._replaceOnUpdate;
    },
    set_replaceOnUpdate: function OpenDataServiceProxy$set_replaceOnUpdate(value) {
        this._replaceOnUpdate = value;
    },
    get_serviceUri: function OpenDataServiceProxy$get_serviceUri() {
        /// <value type="String" mayBeNull="false" locid="P:J#Sys.Data.OpenDataServiceProxy.serviceUri">The path to the ADO.NET Data Service.</value>
        return this.get_path() || "";
    },
    set_serviceUri: function OpenDataServiceProxy$set_serviceUri(value) {
        this.set_path(value || "");
    },
    createActionSequence: function OpenDataServiceProxy$createActionSequence() {
        /// <summary locid="M:J#Sys.Data.OpenDataServiceProxy.createActionSequence">Creates a new action sequence for execution against this data service.</summary>
        /// <returns type="Sys.Data.OpenDataActionSequence">An action sequence object.</returns>
        return new Sys.Data.OpenDataActionSequence(this);
    },
    insert: function OpenDataServiceProxy$insert(item, resourceSetUri, succeededCallback, failedCallback, userContext, webRequest) {
        /// <summary locid="M:J#Sys.Data.OpenDataServiceProxy.insert">Performs an insertion against the data service.</summary>
        /// <param name="item" type="Object">Item to insert.</param>
        /// <param name="resourceSetUri" type="String">Resource set into which the item should be inserted.</param>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon successful completion of the operation.</param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon unsuccessful completion of the operation.</param>
        /// <param name="userContext" mayBeNull="true" optional="true">A context object associated with this operation.</param>
        /// <param name="webRequest" type="Sys.Net.WebRequest" mayBeNull="true" optional="true">A WebRequest object to use for this operation.</param>
        /// <returns type="Sys.Net.WebRequest">The WebRequest object used for this operation.</returns>

        var wRequest = this._prepareWebRequest(item, resourceSetUri, "POST", succeededCallback, failedCallback, userContext, "insert", webRequest);
        wRequest.invoke();
        return wRequest;
    },
    invoke: function OpenDataServiceProxy$invoke(operationUri, httpVerb, parameters, succeededCallback, failedCallback, userContext, webRequest) {
        /// <summary locid="M:J#Sys.Data.OpenDataServiceProxy.invoke">Invokes a method exposed by the data service.</summary>
        /// <param name="operationUri" type="String">Path to the service operation to invoke.</param>
        /// <param name="httpVerb" type="String" mayBeNull="true" optional="true">HTTP verb to be used for this service call.</param>
        /// <param name="parameters" type="Object" mayBeNull="true" optional="true">Dictionary of parameters to be passed to the service method.</param>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon successful completion of the operation.</param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon unsuccessful completion of the operation.</param>
        /// <param name="userContext" mayBeNull="true" optional="true">A context object associated with this operation.</param>
        /// <param name="webRequest" type="Sys.Net.WebRequest" mayBeNull="true" optional="true">A WebRequest object to use for this operation.</param>
        /// <returns type="Sys.Net.WebRequest">The WebRequest object used for this operation.</returns>
        
        var qb = new Sys.Data.OpenDataQueryBuilder(operationUri);
        qb._queryParameters = merge(null, qb._queryParameters, parameters);
        httpVerb = httpVerb || "GET";
        var wRequest = this._prepareWebRequest(null, qb.toString(), httpVerb, succeededCallback, failedCallback, userContext, operationUri, webRequest);
        wRequest.invoke();
        return wRequest;       
    },
    fetchData: function OpenDataServiceProxy$fetchData(operation, parameters, mergeOption, httpVerb, succeededCallback, failedCallback, timeout, userContext) {
        /// <summary locid="M:J#Sys.Data.OpenDataServiceProxy.fetchData">Fetches data from the provided service URI.</summary>
        /// <param name="operation">The operation to fetch data with.</param>
        /// <param name="parameters" type="Object" mayBeNull="true" optional="true"></param>
        /// <param name="mergeOption" type="Sys.Data.MergeOption" mayBeNull="true" optional="true"></param>
        /// <param name="httpVerb" type="String" mayBeNull="true" optional="true"></param>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="timeout" type="Number" integer="true" mayBeNull="true" optional="true"></param>
        /// <param name="userContext" mayBeNull="true" optional="true"></param>
        /// <returns type="Sys.Net.WebRequest"></returns>
        if (!this.get_serviceUri()) {
            throw Error.invalidOperation(Sys.Data.OpenDataRes.requiredUri);
        }
        if (!operation) {
            throw Error.argumentNull("operation");
        }
        var request, oldTimeout = null;
        if (typeof(timeout) !== "undefined") {
            oldTimeout = this.get_timeout();
            this.set_timeout(timeout);
        }
        if (parameters) {
            for (var name in parameters) {
                if (parameters.hasOwnProperty(name)) {
                    operation += ((operation.indexOf('?') < 0) ? "?" : "&") +
                        encodeURIComponent(name) + "=" + encodeURIComponent(parameters[name]);
                }
            }
        }
        request = this.query(operation, succeededCallback, failedCallback, userContext);
        if (oldTimeout !== null) {
            this.set_timeout(oldTimeout);
        }
        return request;
    },
    fetchDeferredProperty: function OpenDataServiceProxy$fetchDeferredProperty(item, property, succeededCallback, failedCallback, userContext, webRequest) {
        /// <summary locid="M:J#Sys.Data.OpenDataServiceProxy.fetchDeferredProperty">Fetches the property of a given item.</summary>
        /// <param name="item" type="Object">Item containing the property to be fetched.</param>
        /// <param name="property" type="String">Name of the property which should be fetched.</param>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon successful completion of the operation.</param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon unsuccessful completion of the operation.</param>
        /// <param name="userContext" mayBeNull="true" optional="true">A context object associated with this operation.</param>
        /// <param name="webRequest" type="Sys.Net.WebRequest" mayBeNull="true" optional="true">A WebRequest object to use for this operation.</param>
        /// <returns type="Sys.Net.WebRequest">The WebRequest object used for this operation.</returns>
        
        var succeededHelper = Function.createDelegate(this, function(result, context, operation) {
            item[property] = result;
            var callback = succeededCallback || this.get_defaultSucceededCallback();
            if (callback) {
                callback(item, context, operation);
            }
        });
        
        var uri;
        if (item[property] && item[property].__deferred && item[property].__deferred.uri) {
            uri = item[property].__deferred.uri;
        }
        else if (item.__metadata && item.__metadata.uri) {
            uri = item.__metadata.uri + '/' + property;
        }
        else {
            var message = String.format(Sys.Data.OpenDataRes.propertyNotFound, property);
            throw Sys.Data.OpenDataServiceProxy._createFailedError(property, message);
        }
        
        var wRequest = this._prepareWebRequest(null, uri, "GET", succeededHelper, failedCallback, userContext, property, webRequest);
        wRequest.invoke();
        return wRequest;
    },
    query: function OpenDataServiceProxy$query(query, succeededCallback, failedCallback, userContext, webRequest) {
        /// <summary locid="M:J#Sys.Data.OpenDataServiceProxy.query">Performs a query (read) against the data service.</summary>
        /// <param name="query" type="String" mayBeNull="true" optional="true">Path to query.</param>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon successful completion of the operation.</param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon unsuccessful completion of the operation.</param>
        /// <param name="userContext" mayBeNull="true" optional="true">A context object associated with this operation.</param>
        /// <param name="webRequest" type="Sys.Net.WebRequest" mayBeNull="true" optional="true">A WebRequest object to use for this operation.</param>
        /// <returns type="Sys.Net.WebRequest">The WebRequest object used for this operation.</returns>
        var wRequest = this._prepareWebRequest(null, query, "GET", succeededCallback, failedCallback, userContext, query, webRequest);
        wRequest.invoke();
        return wRequest;
    },
    update: function OpenDataServiceProxy$update(item, succeededCallback, failedCallback, userContext, webRequest) {
        /// <summary locid="M:J#Sys.Data.OpenDataServiceProxy.update">Performs an update against the data service.</summary>
        /// <param name="item" type="Object">Item to update.</param>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon successful completion of the operation.</param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon unsuccessful completion of the operation.</param>
        /// <param name="userContext" mayBeNull="true" optional="true">A context object associated with this operation.</param>
        /// <param name="webRequest" type="Sys.Net.WebRequest" mayBeNull="true" optional="true">A WebRequest object to use for this operation.</param>
        /// <returns type="Sys.Net.WebRequest">The WebRequest object used for this operation.</returns>

        var verb = (this._replaceOnUpdate) ? "PUT" : "MERGE";
        var wRequest = this._prepareWebRequest(item, null, verb, succeededCallback, failedCallback, userContext, "update", webRequest);
        wRequest.invoke();
        return wRequest;
    },
    remove: function OpenDataServiceProxy$remove(item, succeededCallback, failedCallback, userContext, webRequest) {
        /// <summary locid="M:J#Sys.Data.OpenDataServiceProxy.remove">Performs a removal against the data service.</summary>
        /// <param name="item" type="Object">Item to remove.</param>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon successful completion of the operation.</param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true">Callback to execute upon unsuccessful completion of the operation.</param>
        /// <param name="userContext" mayBeNull="true" optional="true">A context object associated with this operation.</param>
        /// <param name="webRequest" type="Sys.Net.WebRequest" mayBeNull="true" optional="true">A WebRequest object to use for this operation.</param>
        /// <returns type="Sys.Net.WebRequest">The WebRequest object used for this operation.</returns>
        var wRequest = this._prepareWebRequest(item, null, "DELETE", succeededCallback, failedCallback, userContext, "remove", webRequest);
        wRequest.set_body(null);
        delete wRequest.get_headers()["Content-Type"];
        wRequest.invoke();
        return wRequest;
    },
    _checkForError: function OpenDataServiceProxy$_checkForError(executor, operation, checkVersion) {
        var message, errorObj = null, timedOut = false,
            statusCode = 0;
        if (!executor.get_responseAvailable()) {
            timedOut = executor.get_timedOut();
            message = (timedOut ? Sys.Data.OpenDataRes.operationTimedOut : String.format(Sys.Data.OpenDataRes.operationFailed, operation));
        }
        else {
            statusCode = executor.get_statusCode();        
            if ((statusCode === 1223) || (statusCode === 0)) {
                statusCode = 204;
            }
            if (checkVersion) {
                var version = parseFloat(executor.getResponseHeader('DataServiceVersion'));
                if ((isNaN(version) || (version > 2)) && statusCode !== 204) {
                    message = isNaN(version)
                        ? String.format(Sys.Data.OpenDataRes.uriNotOpenDataService, this.get_serviceUri())
                        : String.format(Sys.Data.OpenDataRes.serviceVersionTooHigh, this.get_serviceUri());
                }
            }
            if (!message && (statusCode < 200 || statusCode >= 300)) {
                var contentType = executor.getResponseHeader("Content-Type");
                if (contentType.startsWith("application/json")) {
                    errorObj = executor.get_object();
                }
                else if (contentType.startsWith("application/xml") || contentType.startsWith("text/xml")) {
                    var xml = executor.get_xml(), elements = xml.documentElement.getElementsByTagName("message");
                    if (elements && elements.length) {
                        var element = elements[0];
                        if (element.childNodes.length) {
                            message = element.childNodes[0].nodeValue;
                        }
                    }
                    if (!message) {
                        message = String.format(Sys.Data.OpenDataRes.uriNotOpenDataService, this.get_serviceUri());
                    }
                }
                else {
                    message = String.format(Sys.Data.OpenDataRes.uriNotOpenDataService, this.get_serviceUri());
                }
            }
        }
        if (message || errorObj) {
            return Sys.Data.OpenDataActionSequence._getError(timedOut, statusCode, message, errorObj, operation);
        }
        return null;
    },
    _onResponseComplete: function OpenDataServiceProxy$_onResponseComplete(executor, onSuccess, onFailure, userContext, operation) {
        var dsError = this._checkForError(executor, operation, true);
        if (dsError) {
            if (onFailure) {
                onFailure(dsError, userContext, operation);
            }
            else {
                throw Sys.Data.OpenDataServiceProxy._createFailedError(operation, dsError.get_message());
            }
        }
        else if (onSuccess) {
            var version = parseFloat(executor.getResponseHeader("DataServiceVersion")) || 1.0,
                contentType = executor.getResponseHeader("Content-Type"),
                obj = null;
            if (contentType.startsWith("application/json")) {
                obj = executor.get_object();
                obj = obj.d || obj;
            }
            var results = obj,
                metadata = null;
            if (version >= 2) {
                results = obj.results;
                delete obj.results;
                metadata = {};
                forIn(obj, function(val, name) {
                    metadata[name.replace(/^\_+/, '')] = val;
                });
            }
            onSuccess(results, userContext, operation, metadata);
        }
    },
    _prepareWebRequest: function OpenDataServiceProxy$_prepareWebRequest(item, relativeUri, verb, onSuccess, onFailure, context, operation, webRequest) {
        webRequest = webRequest || new Sys.Net.WebRequest();
        webRequest.set_url(Sys.Data._OpenDataUtil.concatUris(this.get_serviceUri(), relativeUri || ""));
        webRequest.set_timeout(this.get_timeout());

        var headers = webRequest.get_headers();
        headers["Accept"] = "application/json";
        headers["MaxDataServiceVersion"] = "2.0;OpenDataAjax";

        webRequest.set_httpVerb(verb);
        if (this._usePostTunneling) {
            var verbUpper = verb.toUpperCase();
            if ((verbUpper === "PUT") || (verbUpper === "DELETE") || (verbUpper === "MERGE")) {
                webRequest.set_httpVerb("POST");
                headers["X-HTTP-Method"] = verbUpper;
            }
        }

        if (item) {
            webRequest.set_body(Sys.Serialization.JavaScriptSerializer.serialize(item));
            headers["Content-Type"] = "application/json";

            var eTag = Sys.Data._OpenDataUtil.extractETag(item);
            if (eTag) {
                headers["If-Match"] = eTag;
            }

            var uri = Sys.Data._OpenDataUtil.extractUri(item);
            if (uri) {
                webRequest.set_url(uri);
            }
        }

        onSuccess = onSuccess || this.get_defaultSucceededCallback();
        onFailure = onFailure || this.get_defaultFailedCallback();
        if ((typeof(context) === "undefined") || (context === null)) {
            context = this.get_defaultUserContext();
        }

        webRequest.add_completed(Function.createDelegate(this, function(executor) {
            this._onResponseComplete(executor, onSuccess, onFailure, context, operation);
        }));
        return webRequest;
    }
}
$type._createFailedError = function OpenDataServiceProxy$_createFailedError(operation, errorMessage) {
    var displayMessage = "Sys.Data.OpenDataException: " + errorMessage;
    var e = Error.create(displayMessage, { name: "Sys.Data.OpenDataException", operation: operation });
    e.popStackFrame();
    return e;
}
$type.registerClass("Sys.Data.OpenDataServiceProxy", Sys.Net.WebServiceProxy, Sys.Data.IDataProvider);
Sys.registerComponent($type, {
    parameters: [{name: "serviceUri", type: "String"}]
});
$type = Sys.Data._OpenDataBatchReader = function Data$_OpenDataBatchReader(responseBody, boundary) {
    this._responseBody = responseBody;
    this._boundary = [boundary];
    this._position = 0;
    this._responses = [];
    this._parseParts(this._responses);
}
$type.prototype = {
    get_responses: function _OpenDataBatchReader$get_responses() {
        return this._responses;
    },
    _parseParts: function _OpenDataBatchReader$_parseParts(responses) {
        if (this._readToMark("--" + this._currentBoundary(), true) === null) return;
        this._readLine();
        var endmark = null;
        while ((endmark !== "--") && !this._eof()) {
            var partHeaders = [];
            this._parseHeaders(partHeaders);
            var partType = partHeaders["Content-Type"];
            if (partType.indexOf("multipart/mixed") === 0) {
                var nested = [];
                this._boundary.push(Sys.Data._OpenDataBatchReader._boundaryFromTypeHeader(partType));
                this._parseParts(nested);
                this._boundary.pop();
                responses.push(nested);
                var check = this._readToMark("--" + this._currentBoundary(), true);
            }
            else if (partType.indexOf("application/http") === 0) {
                responses.push(this._parseHttpResponse());
            }
            endmark = this._peek(2);
            this._readLine();
        }
    },
    _parseHttpResponse: function _OpenDataBatchReader$_parseHttpResponse() {
        var line = this._readLine(),
            status = this._parseStatus(line);
        var headers = [];
        this._parseHeaders(headers);
        var body = this._readToMark("--" + this._currentBoundary(), true);
        if (body === "\r\n") body = "";
        return { status: status, headers: headers, body: body };
    },
    _parseHeaders: function _OpenDataBatchReader$_parseHeaders(target) {
        for (var line = this._readLine(); line; line = this._readLine()) {
            var h = this._parseHeader(line);
            target[h.name] = h.value;
        }
    },
    _parseHeader: function _OpenDataBatchReader$_parseHeader(s) {
        if (s === null) return null;
        var index = s.indexOf(":");
        return (index === -1) ? null :
            { name: s.substring(0, index).trim(), value: s.substring(index + 1).trim() };
    },
    _parseStatus: function _OpenDataBatchReader$_parseStatus(s) {
        var match = Sys.Data._OpenDataBatchReader._statusRegExp.exec(s);
        return match ? ({ code: match[1], text: match[2] }) : null;
    },
    _currentBoundary: function _OpenDataBatchReader$_currentBoundary() {
        return this._boundary[this._boundary.length - 1];
    },
    _eof: function _OpenDataBatchReader$_eof() {
        return this._position === -1;
    },
    _readLine: function _OpenDataBatchReader$_readLine() {
        return this._readToMark("\r\n", false);
    },
    _readToMark: function _OpenDataBatchReader$_readToMark(mark, nullIfMissing) {
        if (this._eof()) return null;
        var r, index = this._responseBody.indexOf(mark, this._position);
        if (index < 0) {
            if (nullIfMissing) {
                r = null;
            }
            else {
                r = this._responseBody.substring(this._position);
                this._position = -1;
            }
        }
        else {
            r = this._responseBody.substring(this._position, index);
            this._position = index + mark.length;
        }
        return r;
    },
    _peek: function _OpenDataBatchReader$_peek(len) {
        if (this._eof()) return "";
        return this._responseBody.substring(this._position, this._position + len);
    }
}
$type._boundaryFromTypeHeader = function _OpenDataBatchReader$_boundaryFromTypeHeader(header) {
    var re = /;\s*boundary=(.*)$/i,
        match = re.exec(header);
    return match ? match[1] : null;
};
$type._parseResponse = function _OpenDataBatchReader$_parseResponse(executor) {
    var r = new Sys.Data._OpenDataBatchReader(executor.get_responseData(), Sys.Data._OpenDataBatchReader._boundaryFromTypeHeader(executor.getResponseHeader("Content-Type")));
    return r.get_responses();
};
$type._statusRegExp = new RegExp("^HTTP\\/1\\.[01] (\\d{3}) (.*)$", "i");
$type.registerClass("Sys.Data._OpenDataBatchReader");
$type = Sys.Data._OpenDataBatchWriter = function Data$_OpenDataBatchWriter(host) {
    this._host = host;
    this._content = "";
    this._boundary = null;
    this._changesetBoundary = null;
    this._changesetEntries = null;
    this._contentType = "application/json";
}
$type.prototype = {
    get_contentType: function _OpenDataBatchWriter$get_contentType() {
        return this._contentType;
    },
    set_contentType: function _OpenDataBatchWriter$set_contentType(type) {
        this._contentType = type;
    },
    get_requestBody: function _OpenDataBatchWriter$get_requestBody() {
        return this._content + "--" + this.get_topBoundary() + "--";
    },
    get_topBoundary: function _OpenDataBatchWriter$get_topBoundary() {
        if (!this._boundary) {
            this._boundary = "batch_" + this._createBoundary();
        }
        return this._boundary;
    },
    addChange: function _OpenDataBatchWriter$addChange(targetUri, eTag, method, body, contentId) {
        this._changesetEntries.push({ uri: targetUri, eTag: eTag, method: method, body: body, contentId: contentId });
    },
    addQuery: function _OpenDataBatchWriter$addQuery(queryUri) {
        this._content += this._startPart(this.get_topBoundary(), "GET", queryUri, null) + "\r\n";
    },
    endChangeSet: function _OpenDataBatchWriter$endChangeSet() {
        var changeset = "";
        for (var key in this._changesetEntries) {
            var entry = this._changesetEntries[key];
            changeset += this._startPart(this._changesetBoundary, entry.method, entry.uri, entry.eTag, entry.contentId);
            if (entry.body) {
                changeset += "Content-Type: " + this._contentType + ";charset=utf-8\r\n";
            }
            changeset += "\r\n";
            if (entry.body) {
                changeset += entry.body;
            }
        }
        if (changeset) {
            changeset += "\r\n--" + this._changesetBoundary + "--\r\n";
        }
        this._content += "\r\n--" + this.get_topBoundary() + "\r\nContent-Type: multipart/mixed;boundary=" +
                         this._changesetBoundary + "\r\n\r\n" + changeset;
        this._changesetBoundary = null;
        this._changesetEntries = null;
    },
    startChangeSet: function _OpenDataBatchWriter$startChangeSet() {
        this._changesetBoundary = "changeset_" + this._createBoundary();
        this._changesetEntries = [];
    },
    _createBoundary: function _OpenDataBatchWriter$_createBoundary() {
        function hex16() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substr(1);
        }
        return hex16() + "-" + hex16() + "-" + hex16();
    },
    _startPart: function _OpenDataBatchWriter$_startPart(boundary, method, uri, eTag, contentId) {
        var start = "\r\n--" + boundary + "\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\n" + method + " " + uri + " HTTP/1.1\r\n";
        if (typeof(contentId) === "number") {
            start += "Content-ID: " + contentId + "\r\n";
        }
        if (eTag) {
            start += "If-Match: " + eTag + "\r\n";
        }
        start += "Host: " + this._host + "\r\nAccept: " + this.get_contentType() + "\r\nAccept-Charset: utf-8\r\n";
        return start;
    }
}
$type.registerClass("Sys.Data._OpenDataBatchWriter");
$type = Sys.Data.OpenDataContext = function Data$OpenDataContext() {
    Sys.Data.OpenDataContext.initializeBase(this);
    this.set_getIdentityMethod(this._getIdentity);
    this.set_getNewIdentityMethod(this._getNewIdentity);
    this.set_fetchDataMethod(this._fetchOpenData);
    this.set_saveChangesMethod(this._saveOpenData);
    this.set_createEntityMethod(this._createEntity);
    this.set_handleSaveChangesResultsMethod(this._processResultsOpenData);
    this.set_getDeferredPropertyFetchOperationMethod(this._getDeferredQuery);
    this.set_isDeferredPropertyMethod(this._isDeferred);
    this._proxy = new Sys.Data.OpenDataServiceProxy();
}
$type.prototype = {
    _entityCounter: 0,
    _saveCounter: 1,
    get_lastMetadata: function() {
        return this._metadata || null;
    },
    get_serviceUri: function() {
        return this._proxy.get_serviceUri();
    },
    set_serviceUri: function(value) {
        this._proxy.set_serviceUri(value);
    },
    _createEntity: function OpenDataContext$_createEntity(dataContext, entitySetName) {
        var obj = {};
        dataContext._createMetaData(obj, entitySetName);
        return obj;
    },
    _fetchOpenData: function OpenDataContext$_fetchOpenData(dataContext, uri, operation, parameters, httpVerb, succeededCallback, failedCallback, timeout, context) {
        if (operation) {
            if (typeof(operation) !== "string") {
                operation = operation.toString();
            }
            var i = operation.indexOf(":");
            if ((i !== -1) && (i < operation.indexOf("/"))) {
                uri = operation;
            }
        }
        function onSuccess(data, userContext, operation, metadata) {
            dataContext._metadata = metadata;
            if (succeededCallback) {
                succeededCallback.apply(null, arguments);
            }
        }
        return dataContext._proxy.fetchData(operation, parameters || null, null, httpVerb || null, onSuccess, failedCallback || null, timeout || 0, context || null);
    },
    _getDeferredQuery: function OpenDataContext$_getDeferredQuery(dataContext, entity, propertyName, parameters, userContext) {
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
            throw Error.invalidOperation(String.format(Sys.Data.OpenDataRes.propertyNotFound, propertyName));
        }
        return new Sys.Net.WebServiceOperation(uri, parameters);
    },
    _isDeferred: function OpenDataContext$_isDeferred(dataContext, entity, propertyName) {
        var value = entity[propertyName];
        return !!(value && (typeof(value) === "object") && value.__deferred);
    },
    _processResultsOpenData: function OpenDataContext$_processResultsOpenData(dataContext, changes, results) {
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
    },
    _getBatchReference: function OpenDataContext$_getBatchReference(item, batchField, batchRefPrefix, stripUri) {
        var batchnum = item.__metadata[batchField];
        if (typeof(batchnum) === "number") {
            return batchRefPrefix + "$" + batchnum;
        }
        else {
            var uri = this.getIdentity(item);
            if (!uri) {
                throw Error.invalidOperation(Sys.Data.OpenDataRes.batchLinkBeforeInsert);
            }
            if (stripUri) {
                uri = uri.substr(uri.lastIndexOf("/"));
            }
            return uri;
        }
    },
    _saveOpenData: function OpenDataContext$_saveOpenData(dataContext, changes, succeededCallback, failedCallback, context) {
        var uri = dataContext.get_serviceUri(),
            request = null;
        if (!uri) {
            failedCallback(new Sys.Net.WebServiceError(false, String.format(Sys.Res.webServiceFailedNoMsg, "saveChanges")), context, "saveChanges");
        }
        else {
            var i, l, proxy = dataContext._proxy,
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
    },
    _createMetaData: function OpenDataContext$_createMetaData(entity, entitySetName) {
        entity.__metadata = { entitySet: entitySetName, uri: entitySetName + "(__new" + this._entityCounter++ + ")" };
    },
    _getNewIdentity: function OpenDataContext$_getNewIdentity(dataContext, entity, entitySetName) {
        if (!entitySetName) {
            throw Error.invalidOperation(Sys.Data.OpenDataRes.entityWithNoResourceSet);
        }
        dataContext._createMetaData(entity, entitySetName);
        return entity.__metadata.uri;
    },
    _getIdentity: function OpenDataContext$_getIdentity(dataContext, entity) {
        var metadata = entity.__metadata;
        if (metadata) {
            return metadata.uri || null;
        }
        return null;
    }
}
$type.registerClass("Sys.Data.OpenDataContext", Sys.Data.DataContext);
Sys.registerComponent($type);
}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("OpenData", null, execute);
}
else {
	execute();
}

})();
