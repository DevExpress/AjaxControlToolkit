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
                // operation is of the form scheme:// so it is a full uri, not just the query part
                // this can happen when loading deferred properties where __deferred.uri is a full uri
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
            // not an entity or a deferred object
            throw Error.invalidOperation(String.format(Sys.Data.OpenDataRes.propertyNotFound, propertyName));
        }
        return new Sys.Net.WebServiceOperation(uri, parameters);
    },
    _isDeferred: function OpenDataContext$_isDeferred(dataContext, entity, propertyName) {
        var value = entity[propertyName];
        return !!(value && (typeof(value) === "object") && value.__deferred);
    },
    _processResultsOpenData: function OpenDataContext$_processResultsOpenData(dataContext, changes, results) {
        // inserted items have returned metadata that needs to be set upon the original item
        // in case it is subsequently updated or removed
        if (results && (results.length === changes.length)) {
            for (var i = 0, l = results.length; i < l; i++) {
                var change = changes[i], item = change.item,
                    result = results[i], data = result.get_result(),
                    headers = result.get_httpHeaders();
                if (item) {
                    if (data) {
                        // if the change was a $link then item is null
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
            //#if DEBUG
            if (!uri) {
                // the item doesnt have a batch reference or an identity.
                // that means someone created a link to a new item before
                // inserting the item. They must insert an entity before they
                // create links to it.
                throw Error.invalidOperation(Sys.Data.OpenDataRes.batchLinkBeforeInsert);
            }
            //#endif
            if (stripUri) {
                // http://foo.svc/entities(12)
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
                            // insert of an entity.
                            var originalItem = dataContext.get_items()[dataContext.getIdentity(item)];
                            delete item.__metadata;
                            // inserting a new entity -- but a link could later exist to associate from or to this item.
                            // astoria supports referencing them by their batch number, so we have to save it here.
                            // its ok to use __metadata for this custom purpose, it will be replaced after the update
                            // succeeds and the actual __metadata is returned. We use a different fields for each save
                            // attempt though, so that if this save fails, we dont pick up an incorrect batch number
                            // on future saves.
                            originalItem.__metadata[batchField] = i;
                            sequence.addInsertAction(item, originalItem.__metadata.entitySet);
                        }
                        else {
                            // insert of a new link
                            // insert: body is { uri: targetUri }, uri is sourceidentity/$links/field
                            sequence.addInsertAction({ uri: dataContext._getBatchReference(change.linkTarget, batchField, "") },
                                dataContext._getBatchReference(change.linkSource, batchField, "/") + "/$links/" + change.linkSourceField);
                        }
                        break;
                    case Sys.Data.ChangeOperationType.update:
                        if (item) {
                            // update of an entity
                            sequence.addUpdateAction(item);
                        }
                        else {
                            // update of a 1:many link
                            // update: body is { uri: targetUri }, uri is sourceidentity/$links/field
                            if (change.linkTarget) {
                                sequence.addUpdateAction({ uri: dataContext._getBatchReference(change.linkTarget, batchField, "") },
                                    dataContext._getBatchReference(change.linkSource, batchField, "/") + "/$links/" + change.linkSourceField);
                            }
                            else {
                                // if setting to null, it is a delete
                                // body is nothing, uri is sourceidentity/$links/field
                                sequence.addRemoveAction(
                                    {__metadata: { uri:
                                        dataContext._getBatchReference(change.linkSource, batchField, "/") + "/$links/" + change.linkSourceField }});
                            }
                        }
                        break;
                    case Sys.Data.ChangeOperationType.remove:                
                        if (item) {
                            // delete of an entity
                            sequence.addRemoveAction(item);
                        }
                        else {
                            // removing of a link
                            // remove: body is nothing, uri is sourceidentity/$links/targetidentity-with-uri-part-stripped
                            // todo: ideally the sequence would have addLink/removeLink methods or else you have to do this
                            // stuff yourself if you dont use the data source.
                            // note that linkSourceField isnt needed here because the server doesnt support there being multiple
                            // associations to the same table, so the association is implied by the target entity type.
                            // for example, you can have a link from person to person as both friend and enemy,
                            // so DELETE person(1)/$links/person(2) implies removing person(2) as a friend of person(1).
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
        //#if DEBUG
        if (!entitySetName) {
            throw Error.invalidOperation(Sys.Data.OpenDataRes.entityWithNoResourceSet);
        }
        //#endif
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
