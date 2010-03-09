Type.registerNamespace("Sys.Data.Test");

Sys.Data.Test.OpenDataContextTest = function() {
    var ds;
    var helper = new Sys.Data.Test.MockRequestHelper();
    this.setUp = function() {
        ds = new Sys.Data.OpenDataContext();
        helper.setUp();
        invoke = null;
    }
    this.tearDown = function() {
        helper.tearDown();
        ds.dispose();
    }

    this.verifyChangeSet = function(expectedOp, expectedItem, change) {
        AtlasUnit.Assert.areEqual(expectedOp, change.action);
        var p, item = change.item;
        for (p in expectedItem) {
            AtlasUnit.Assert.areEqual(expectedItem[p], item[p], "Field '" + p + "' on change item does not match expected value.");
        }
        for (p in item) {
            if (p !== "_observerContext") {
                AtlasUnit.Assert.areEqual(expectedItem[p], item[p], "Field '" + p + "' on change item does not match expected value.");
            }
        }
    }

    this.testServiceUriProperty = function() {
        AtlasUnit.Assert.areEqual("", ds.get_serviceUri());
        ds.set_serviceUri("foo");
        AtlasUnit.Assert.areEqual("foo", ds.get_serviceUri());
        ds.set_serviceUri(null);
        AtlasUnit.Assert.areEqual("", ds.get_serviceUri());
    }

    this.testInitialize = function() {
        ds.initialize();
        AtlasUnit.Assert.isFalse(!!this._invoke);
    }

    this.testFetch = function() {
        ds.set_serviceUri("hi");
        ds.initialize();
        ds.fetchData("query");
        var request = helper.verifyRequest({ uri: "hi/query" });
        AtlasUnit.Assert.isNull(ds.get_lastFetchDataResults(), "No data should be Fetched yet.");
        var data = [{ foo: "foo"}];
        request.completed(this.getMockExecutor(request.request, 200, data));
        AtlasUnit.Assert.areEqual(data, ds.get_lastFetchDataResults(), "Data should be fetched.");
    }

    this.testOpenDataContextPlugin = function() {
        var dc = Sys.create.openDataContext();
        AtlasUnit.Assert.areEqual(Sys.Data.OpenDataContext, Object.getType(dc));
    }

    this.testOpenDataServiceProxyPlugin = function() {
        var ds = Sys.create.openDataServiceProxy("uri");
        AtlasUnit.Assert.areEqual(Sys.Data.OpenDataServiceProxy, Object.getType(ds));
        AtlasUnit.Assert.areEqual("uri", ds.get_serviceUri());
        // base property
        AtlasUnit.Assert.areEqual("uri", ds.get_path());
    }

    this.testFetchVersion2 = function() {
        ds.set_serviceUri("hi");
        ds.initialize();
        ds.fetchData("query");
        var request = helper.verifyRequest({ uri: "hi/query" });
        AtlasUnit.Assert.isNull(ds.get_lastFetchDataResults(), "No data should be Fetched yet.");
        var data = [{ foo: "foo"}];
        var response = { results: data, __foo: 1, ___bar: 2 };
        request.completed(this.getMockExecutor(request.request, 200, response, 2));
        AtlasUnit.Assert.areEqual(data, ds.get_lastFetchDataResults(), "Data should be fetched.");
        var metadata = ds.get_lastMetadata();
        AtlasUnit.Assert.areEqual(1, metadata.foo, "Metadata should be parsed, leading underscores stripped.");
        AtlasUnit.Assert.areEqual(2, metadata.bar, "Metadata should be parsed, leading underscores stripped.");
    }
    
    this.testFetchParametersParameter = function() {
        ds.set_serviceUri("uri");
        ds.initialize();
        ds.fetchData("query?foo=bar", { "a": "b", "c": "~`!@#$%^&*()_+-={}|[]\\;':\",./<>?" } );
        var request = helper.verifyRequest({ uri: "uri/query?foo=bar&a=b&c=~%60!%40%23%24%25%5E%26*()_%2B-%3D%7B%7D%7C%5B%5D%5C%3B'%3A%22%2C.%2F%3C%3E%3F" });
    }

    this.testAbortFetch = function() {
        ds.set_serviceUri("hi");
        ds.trackData("foo");
        ds.initialize();
        ds.fetchData("query");
        var request = helper.verifyRequest({});
        request.request.get_executor().abort();
        AtlasUnit.Assert.isTrue(helper.isAborted(), "request.get_executor().abort() was not called.");
        AtlasUnit.Assert.elementsEqual("foo", ds.get_lastFetchDataResults(), "Data should not be changed after an abort.");
    }

    this.testAbortSave = function() {
        ds.set_serviceUri("hi");
        ds.set_saveOperation("method");
        ds.trackData(["foo"]);
        ds.initialize();
        var bar = ds.createEntity("bar1");
        bar.bar = "bar";
        ds.insertEntity(bar);
        ds.saveChanges();
        var request = helper.verifyRequest({});
        AtlasUnit.Assert.isTrue(ds.get_isSaving(), "Should be saving.");
        ds.abortSave();
        AtlasUnit.Assert.isFalse(ds.get_isSaving(), "Aborted -- should not be saving.");
        AtlasUnit.Assert.isTrue(helper.isAborted(), "request.get_executor().abort() was not called.");
    }

    this.testSaveRequestFailed = function() {
        ds.set_serviceUri("hi");
        ds.set_saveOperation("method");
        ds.set_saveChangesTimeout(88);
        ds.trackData(["foo"]);
        ds.initialize();
        ds.insertEntity(ds.createEntity("bar1"));
        var err = null;
        function fail(e) {
            err = e;
        }
        ds.saveChanges(null, fail);
        var request = helper.verifyRequest({ timeout: 88 });
        var error = { "error": {
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
        };
        request.completed(this.getMockExecutor(request.request, 500, error));
        AtlasUnit.Assert.isNotNull(err, "RequestFailed callback did not fire.");
        AtlasUnit.Assert.areEqual("Sys.Net.WebServiceError", Object.getTypeName(err));
        AtlasUnit.Assert.areEqual("An error occurred while processing this request.", err.get_message());
        AtlasUnit.Assert.areEqual("System.Data.UpdateException", err.get_exceptionType());
    }

    this.testFetchRequestFailed = function() {
        ds.set_serviceUri("hi");
        ds.initialize();
        var err = null;
        function fail(e) {
            err = e;
        }
        ds.fetchData("query", null, null, null, null, fail);
        var request = helper.verifyRequest({});
        var error = { "error": {
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
        };
        request.completed(this.getMockExecutor(request.request, 500, error));
        AtlasUnit.Assert.isNotNull(err, "RequestFailed callback did not fire.");
    }

    this.testFetchRequestSucceeded = function() {
        ds.set_serviceUri("hi");
        ds.initialize();
        var result;
        function done(r) {
            result = r;
        }
        ds.fetchData("query", null, null, null, done, null, 88);
        var request = helper.verifyRequest({ timeout: 88 });
        request.completed(this.getMockExecutor(request.request, 200, [{ foo: "foo", __metadata: { uri: "uri1"} }, { bar: "bar", __metadata: { uri: "uri2"}}]));
        AtlasUnit.Assert.isNotNull(result, "RequestSucceeed callback did not fire.");
        AtlasUnit.Assert.areEqual(2, ds.get_lastFetchDataResults().length);
        AtlasUnit.Assert.isTrue(!!ds.get_items()["uri1"], "Fetched data should be stored (1).");
        AtlasUnit.Assert.isTrue(!!ds.get_items()["uri2"], "Fetched data should be stored (2).");
    }

    this.testFetchRequestNonStringQuery = function() {
        ds.set_serviceUri("hi");
        ds.initialize();
        var result;
        function done(r) {
            result = r;
        }
        ds.fetchData({toString:function(){return "theQuery"}});
        var request = helper.verifyRequest({ uri: "hi/theQuery" });
    }

    this.testPopulateDeferred = function() {
        var item = { foo: { __deferred: { uri: "def-uri"}} };
        ds.set_serviceUri("uri");
        ds.fetchDeferredProperty(item, "foo", null, null, null, null, 88);
        var request = helper.verifyRequest({ uri: "uri/def-uri", timeout: 88 });
        var result = { foo: "foo1", __metadata: { uri: "urifoo"} };
        request.completed(this.getMockExecutor(request.request, 200, result));
        AtlasUnit.Assert.areEqual(result, item.foo, "Item should be set on property value.");
        AtlasUnit.Assert.areEqual(result, ds.get_items()["urifoo"], "Incomming entities should be stored.");
    }
    
    this.testPopulateDeferredFullUri = function() {
        var item = { foo: { __deferred: { uri: "http://serviceFOO.svc/deferredfoo"}} };
        ds.set_serviceUri("http://serviceBAR.svc");
        ds.fetchDeferredProperty(item, "foo", null, null, null, null, 88);
        helper.verifyRequest({ uri: "http://serviceFOO.svc/deferredfoo", timeout: 88 });
    }

    this.testSave = function() {
        var data = [
            { __metadata: { uri: "item1" }, id: 1, foo: "foo1" },
            { "__metadata": { "uri": "http://localhost/batching/testsvc.svc/TestEntities(2)", "type": "BatchingJS.TestEntity" }, "ID": 2, "Str1": "bbb", "Str2": "222" },
            { "__metadata": { "uri": "http://localhost/batching/testsvc.svc/TestEntities(3)", "type": "BatchingJS.TestEntity" }, "ID": 3, "Str1": "ccc", "Str2": "333" }
            ];
        ds = new Sys.Data.OpenDataContext();
        ds.set_serviceUri("uri");
        ds.set_saveOperation("method");
        ds.set_saveChangesTimeout(5);
        ds.trackData(data);
        ds.initialize();
        // add an item (change 0)
        ds.insertEntity({ "ID": 88, "Str1": "added", "Str2": "addaddadd" }, "orders");
        // edit existing item (change 1)
        Sys.Observer.setValue(data[1], "Str1", "bbbeditedit");
        Sys.Observer.setValue(data[1], "Str1", "bbbediteditedit");
        // edit existing item (change 2)
        Sys.Observer.setValue(data[2], "Str1", "ccced");
        Sys.Observer.setValue(data[2], "Str1", "cccedit");
        // delete first item (change 3)
        ds.removeEntity(data[0]);
        // add another (change 4)
        ds.insertEntity({ "ID": 89, "Str1": "added", "Str2": "addaddadd" }, "orders");

        var result = null;
        function done(r) {
            result = r;
        }
        function fail(e) {
            AtlasUnit.Assert.fail("Failed callback not expected, error = " + e.get_message());
        }

        // save changes...
        ds.saveChanges(done, fail);

        // verify batch request made (but not the semantics of what batching means)
        //var batchResponse = "preamble\r\n--batch_6620-83f3-1e41\r\nContent-Type: multipart/mixed;boundary=changeset_8121-5118-f70a\r\n\r\n\r\n--changeset_8121-5118-f70a\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nPOST customers(1)/orders HTTP/1.1\r\nHost: localhost\r\nAccept: application/json\r\nAccept-Charset: utf-8\r\nContent-Type: application/json;charset=utf-8\r\n\r\n{\"id\":3,\"foo\":\"foo3Edit\"}\r\n--changeset_8121-5118-f70a\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nMERGE item2 HTTP/1.1\r\nHost: localhost\r\nAccept: application/json\r\nAccept-Charset: utf-8\r\nContent-Type: application/json;charset=utf-8\r\n\r\n{\"__metadata\":{\"uri\":\"item2\"},\"id\":2,\"foo\":\"fooEdit2\"}\r\n--changeset_8121-5118-f70a\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nDELETE item1 HTTP/1.1\r\nHost: localhost\r\nAccept: application/json\r\nAccept-Charset: utf-8\r\n\r\n\r\n--changeset_8121-5118-f70a--\r\n--batch_6620-83f3-1e41--";
        var batchResponse = '\r\n--batchresponse_3dccebe9-6456-4b35-8aff-be29553f3025\r\nContent-Type: multipart/mixed; boundary=changesetresponse_47f55057-596b-4f86-872d-aef3fe7945c2\r\n\r\n--changesetresponse_47f55057-596b-4f86-872d-aef3fe7945c2\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nHTTP/1.1 201 Created\r\nContent-Type: application/json;charset=utf-8\r\nCache-Control: no-cache\r\nLocation: http://localhost/batching/testsvc.svc/TestEntities(88)\r\nDataServiceVersion: 1.0;\r\n\r\n{ "d" : {\r\n"__metadata": {\r\n"uri": "http://localhost/batching/testsvc.svc/TestEntities(88)", "type": "BatchingJS.TestEntity"\r\n}, "ID": 88, "Str1": "added", "Str2": "addaddadd"\r\n} }\r\n--changesetresponse_47f55057-596b-4f86-872d-aef3fe7945c2\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nHTTP/1.1 204 No Content\r\nCache-Control: no-cache\r\nDataServiceVersion: 1.0;\r\nETag: UPDATED-ETAG\r\n\r\n\r\n--changesetresponse_47f55057-596b-4f86-872d-aef3fe7945c2\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nHTTP/1.1 204 No Content\r\nCache-Control: no-cache\r\nDataServiceVersion: 1.0;\r\n\r\n\r\n--changesetresponse_47f55057-596b-4f86-872d-aef3fe7945c2\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nHTTP/1.1 204 No Content\r\nCache-Control: no-cache\r\nDataServiceVersion: 1.0;\r\n\r\n--changesetresponse_47f55057-596b-4f86-872d-aef3fe7945c2\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nHTTP/1.1 201 Created\r\nContent-Type: application/json;charset=utf-8\r\nCache-Control: no-cache\r\nLocation: http://localhost/batching/testsvc.svc/TestEntities(89)\r\nDataServiceVersion: 1.0;\r\n\r\n{ "d" : {\r\n"__metadata": {\r\n"uri": "http://localhost/batching/testsvc.svc/TestEntities(89)", "type": "BatchingJS.TestEntity"\r\n}, "ID": 89, "Str1": "added", "Str2": "addaddadd"\r\n} }\r\n--changesetresponse_47f55057-596b-4f86-872d-aef3fe7945c2--\r\n--batchresponse_3dccebe9-6456-4b35-8aff-be29553f3025--\r\n';
        var request = helper.verifyRequest({ uri: "uri/$batch", timeout: 5 });
        request.completed(this.getMockExecutorBatch(request.request, 200, batchResponse));
        AtlasUnit.Assert.isNull(invoke || null);

        AtlasUnit.Assert.isNotNull(result, "RequestSucceeded callback should fire.");
        var actionResults = result;
        AtlasUnit.Assert.areEqual(5, actionResults.length);

        this.verifyActionResult({ actionContext: null, operation: "insert", result: { ID: 88, Str1: "added", Str2: "addaddadd"} }, actionResults[0], 0);
        this.verifyActionResult({ actionContext: null, operation: "edit", result: null }, actionResults[1], 1);
        AtlasUnit.Assert.areEqual("UPDATED-ETAG", actionResults[1].get_httpHeaders().ETag);
        AtlasUnit.Assert.areEqual("UPDATED-ETAG", data[1].__metadata.etag, "Save results should update an entity's etag.");
        this.verifyActionResult({ actionContext: null, operation: "edit", result: null }, actionResults[2], 2);
        this.verifyActionResult({ actionContext: null, operation: "remove", result: null }, actionResults[3], 3);
        this.verifyActionResult({ actionContext: null, operation: "insert", result: { "ID": 89, "Str1": "added", "Str2": "addaddadd"} }, actionResults[4], 4);
    }

    this.verifyActionResult = function(expected, actual, i) {
        AtlasUnit.Assert.areEqual(expected.actionContext, actual.get_actionContext(), "Context mismatch in test #" + i);
        AtlasUnit.Assert.areEqual(expected.operation, actual.get_operation(), "Operation mismatch in test #" + i);
        if (expected.result) {
            expected = expected.result;
            actual = actual.get_result();
            for (var p in expected) {
                AtlasUnit.Assert.areEqual(expected[p], actual[p], "Field '" + p + "' on result does not match expected value in test #" + i);
            }
        }
        else {
            AtlasUnit.Assert.isNull(actual.get_result(), "Result mismatch in test #" + i);
        }
    }

    this.getMockExecutor = function(request, status, result, version) {
        var e = {};
        e.get_webRequest = function() { return request; };
        e.get_responseAvailable = function() { return true; };
        e.get_statusCode = function() { return status; };
        e.getResponseHeader = function(name) {
            var headers = { "DataServiceVersion": (version || "1.0;"), "Content-Type": "application/json" };
            return headers[name];
        };
        e.get_object = function() {
            return result;
        };
        return e;
    }

    this.getMockExecutorBatch = function(request, status, result) {
        var e = {};
        e.get_webRequest = function() { return request; };
        e.get_responseAvailable = function() { return true; };
        e.get_statusCode = function() { return status; };
        e.getResponseHeader = function(name) {
            var headers = { "DataServiceVersion": "1.0;", "Content-Type": "multipart/mixed;boundary=batchresponse_3dccebe9-6456-4b35-8aff-be29553f3025" };
            return headers[name];
        };
        e.get_responseData = function() {
            return result;
        };
        return e;
    }
}
Sys.Data.Test.OpenDataContextTest.registerClass("Sys.Data.Test.OpenDataContextTest");
Sys.Data.Test.OpenDataContextTest["AtlasUnit.IsTestFixture"] = true;
