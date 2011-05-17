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
        
        // we need to merge the parameters into the actual URI
        var qb = new Sys.Data.OpenDataQueryBuilder(operationUri);
        qb._queryParameters = merge(null, qb._queryParameters, parameters);
        httpVerb = httpVerb || "GET";
        var wRequest = this._prepareWebRequest(null, qb.toString(), httpVerb, succeededCallback, failedCallback, userContext, operationUri, webRequest);
        wRequest.invoke();
        return wRequest;       
    },
    // implements Sys.Data.IDataProvider.fetchData
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
        //#if DEBUG
        if (!this.get_serviceUri()) {
            throw Error.invalidOperation(Sys.Data.OpenDataRes.requiredUri);
        }
        if (!operation) {
            throw Error.argumentNull("operation");
        }
        //#endif
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
            // success is noted by passing the original item (with the property set) to the callback function
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
        //#if DEBUG
        else {
            // we can't make sense of this property
            var message = String.format(Sys.Data.OpenDataRes.propertyNotFound, property);
            throw Sys.Data.OpenDataServiceProxy._createFailedError(property, message);
        }
        //#endif
        
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
        // we don't actually want to send the object; just the headers (if there were any) associated with the object
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
                // IE: The browser sometimes returns HTTP 1223 instead of HTTP 204 (DevDiv Bugs #2956 + Windows Out Of Band Releases #1005853)
                // Opera: The browser sometimes returns HTTP 0 instead of HTTP 204
                statusCode = 204;
            }
            if (checkVersion) {
                var version = parseFloat(executor.getResponseHeader('DataServiceVersion'));
                // need to check manually for status code 204 since we won't get headers back in this case
                if ((isNaN(version) || (version > 2)) && statusCode !== 204) {
                    message = isNaN(version)
                        ? String.format(Sys.Data.OpenDataRes.uriNotOpenDataService, this.get_serviceUri())
                        : String.format(Sys.Data.OpenDataRes.serviceVersionTooHigh, this.get_serviceUri());
                }
            }
            if (!message && (statusCode < 200 || statusCode >= 300)) {
                // this is an error condition, so try to extract the error message from the error object
                var contentType = executor.getResponseHeader("Content-Type");
                if (contentType.startsWith("application/json")) {
                    errorObj = executor.get_object();
                }
                else if (contentType.startsWith("application/xml") || contentType.startsWith("text/xml")) {
                    var xml = executor.get_xml(), elements = xml.documentElement.getElementsByTagName("message");
                    if (elements && elements.length) {
                        var element = elements[0];
                        // element = <message>..</message>
                        // now get the text child node to get the value
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
            //#if DEBUG
            else {
                throw Sys.Data.OpenDataServiceProxy._createFailedError(operation, dsError.get_message());
            }
            //#endif
        }
        else if (onSuccess) {
            // parse the response
            var version = parseFloat(executor.getResponseHeader("DataServiceVersion")) || 1.0,
                contentType = executor.getResponseHeader("Content-Type"),
                obj = null;
            if (contentType.startsWith("application/json")) {
                obj = executor.get_object();
                // unwrap 'd' if present
                obj = obj.d || obj;
            }
            var results = obj,
                metadata = null;
            if (version >= 2) {
                results = obj.results;
                delete obj.results;
                metadata = {};
                // metadata from server is double-underscore prefixed.
                // this is a convention it uses to mean metadata. In the ajax
                // world this means "private". This data is public, so we
                // strip the underscores.
                forIn(obj, function(val, name) {
                    metadata[name.replace(/^\_+/, '')] = val;
                });
            }
            onSuccess(results, userContext, operation, metadata);
        }
    },
    _prepareWebRequest: function OpenDataServiceProxy$_prepareWebRequest(item, relativeUri, verb, onSuccess, onFailure, context, operation, webRequest) {
        // prepare the webrequest
        webRequest = webRequest || new Sys.Net.WebRequest();
        webRequest.set_url(Sys.Data._OpenDataUtil.concatUris(this.get_serviceUri(), relativeUri || ""));
        webRequest.set_timeout(this.get_timeout());

        var headers = webRequest.get_headers();
        headers["Accept"] = "application/json";
        headers["MaxDataServiceVersion"] = "2.0;OpenDataAjax";

        // set the verb, tunneling if necessary
        webRequest.set_httpVerb(verb);
        if (this._usePostTunneling) {
            var verbUpper = verb.toUpperCase();
            if ((verbUpper === "PUT") || (verbUpper === "DELETE") || (verbUpper === "MERGE")) {
                webRequest.set_httpVerb("POST");
                headers["X-HTTP-Method"] = verbUpper;
            }
        }

        // if item given, serialize to request object, setting the eTag and uri if necessary
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

        // set defaults and hook event handler
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
//#if DEBUG
$type._createFailedError = function OpenDataServiceProxy$_createFailedError(operation, errorMessage) {
    var displayMessage = "Sys.Data.OpenDataException: " + errorMessage;
    var e = Error.create(displayMessage, { name: "Sys.Data.OpenDataException", operation: operation });
    e.popStackFrame();
    return e;
}
//#endif
$type.registerClass("Sys.Data.OpenDataServiceProxy", Sys.Net.WebServiceProxy, Sys.Data.IDataProvider);
//#if DEBUG
Sys.registerComponent($type, {
    parameters: [{name: "serviceUri", type: "String"}]
});
//#else
Sys.registerComponent($type, {
    parameters: ["serviceUri"]
});
//#endif
