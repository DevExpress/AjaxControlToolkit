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
        // break reference to array so user can't modify after kickoff
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
                    // insert: [0, uri, item,  ctx]
                    // give the Content-ID so future entries can refer to it with $i
                    bw.addChange(uri, eTag, "POST", Sys.Serialization.JavaScriptSerializer.serialize(item), i);
                    break;
                case 1:
                    action[0] = "edit";
                    // edit: [1, updateUri || null, item, ctx]
                    if (!uri) {
                        uri = Sys.Data._OpenDataUtil.extractUri(item);
                    }
                    bw.addChange(uri, eTag, ds.get_replaceOnUpdate() ? "PUT" : "MERGE", Sys.Serialization.JavaScriptSerializer.serialize(item));
                    break;
                case 2:
                    action[0] = "remove";
                    // remove: [2, null, item, ctx]
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
            //#if DEBUG
            else {
                throw Sys.Data.OpenDataServiceProxy._createFailedError("actionSequence", dsError.get_message());
            }
            //#endif
        }
        
        if (dsError) {
            doError();
            return;
        }
        
        // result contains a batch response which needs to be converted to an ActionResult list
        // the response should be a batch response with one nested batch for the changeset
        responses = Sys.Data._OpenDataBatchReader._parseResponse(executor);
        if (responses.length !== 1) {
            dsError = Sys.Data.OpenDataActionSequence._getError(false, -1,
                String.format(Sys.Data.OpenDataRes.invalidBatchResponse, executor.get_webRequest().get_url()));
            doError();
            return;
        }
        responses = responses[0];
        if (responses.length === 1) {
            // a changeset which fails is returned in a batch response as a single error response
            response = responses[0];
            checkPartForError();
            if (dsError) {
                doError();
                return;
            }
            // else: there was only one response but it isnt an error, it could be a successful
            // changeset that had only one change
        }
        // else: there are multiple responses, so there was definitely no error
        if (responses.length !== queue.length) {
            // something went wrong, we should get the same number of results as there were action items.
            dsError = Sys.Data.OpenDataActionSequence._getError(false, -1, 
                String.format(Sys.Data.OpenDataRes.invalidBatchResponse, executor.get_webRequest().get_url()));
            doError();
            return;
        }
        
        // there was either 1 non-error part or there are multiple parts, and the count matches the
        // number of actions there were.
        
        if (onSuccess) {
            // there no point in converting each response to an OpenDataActionResult if
            // no one is listening anyway.
            var l = responses.length,
                results = new Array(l),
                body;
            // todo: how do we deal with failures to parse the response?
            for (var i = 0; i < l; i++) {
                response = responses[i];
                body = response.body;
                data = null;
                if (body) {
                    data = Sys.Serialization.JavaScriptSerializer.deserialize(body);
                    if (data && data.d) {
                        // unwrap 'd' if it exists
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
//example of an error
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
