Type.registerNamespace("Sys.Data.Test");

Sys.Data.Test.OpenDataServiceErrorTest = function() {
    var helper = new Sys.Data.Test.MockRequestHelper();
    this.setUp = function() {
        helper.setUp();
    }
    this.tearDown = function() {
        helper.tearDown();
    }

    this.testJsonError = function() {
        var error = null, p = new Sys.Data.OpenDataServiceProxy("uri");
        p.query("query", success, failed);
        function success() {
            AtlasUnit.Assert.fail("Request should fail.");
        }
        function failed(e) {
            error = e;
        }
        var request = helper.verifyRequest({ uri: "uri/query" });
        var errormessage = "errormessage";
        var result = { error: { message: { value: errormessage}} };
        request.completed(this.getMockExecutor(request.request, 500, "application/json", result));
        AtlasUnit.Assert.isNotNull(error);
        AtlasUnit.Assert.areEqual(500, error.get_statusCode());
        AtlasUnit.Assert.areEqual(result, error.get_errorObject());
        AtlasUnit.Assert.areEqual(errormessage, error.get_message());
    }

    this.testDataServiceVersionTooBig = function() {
        var error = null, p = new Sys.Data.OpenDataServiceProxy("uri");
        p.query("query", success, failed);
        function success() {
            AtlasUnit.Assert.fail("Request should fail.");
        }
        function failed(e) {
            error = e;
        }
        var request = helper.verifyRequest({ uri: "uri/query" });
        var result = { };
        request.completed(this.getMockExecutor(request.request, 500, "application/json", result, 3));
        AtlasUnit.Assert.isNotNull(error);
        AtlasUnit.Assert.areEqual(500, error.get_statusCode());
        AtlasUnit.Assert.areEqual(null, error.get_errorObject());
        AtlasUnit.Assert.areEqual("The URI 'uri' points to an ADO.NET Data Service of a higher version than is supported by this library.", error.get_message());
    }

    this.testNonJsonError = function() {
        var error = null, p = new Sys.Data.OpenDataServiceProxy("uri");
        p.query("query", success, failed);
        function success() {
            AtlasUnit.Assert.fail("Request should fail.");
        }
        function failed(e) {
            error = e;
        }
        var request = helper.verifyRequest({ uri: "uri/query" });
        request.completed(this.getMockExecutor(request.request, 404, "text/html", null));
        AtlasUnit.Assert.isNotNull(error);
        AtlasUnit.Assert.areEqual(404, error.get_statusCode());
        AtlasUnit.Assert.isNull(error.get_errorObject());
    }
    
    this.testXmlError = function() {
        var error = null, p = new Sys.Data.OpenDataServiceProxy("uri");
        p.query("query", success, failed);
        function success() {
            AtlasUnit.Assert.fail("Request should fail.");
        }
        function failed(e) {
            error = e;
        }
        var request = helper.verifyRequest({ uri: "uri/query" });
        request.completed(this.getMockExecutor(request.request, 500, "application/xml", "<error><message>[errormessage]</message></error>"));
        AtlasUnit.Assert.isNotNull(error);
        AtlasUnit.Assert.areEqual(500, error.get_statusCode());
        AtlasUnit.Assert.areEqual("[errormessage]", error.get_message());
    }    

    this.testBatchError = function() {
        var p = new Sys.Data.OpenDataServiceProxy("uri");
        var sequence = p.createActionSequence();
        sequence.addInsertAction({}, "resourceuri");

        function onSuccess() {
            AtlasUnit.Assert.fail("Request should fail because it contains an error.");
        }
        var error = null;
        function onFail(e) {
            error = e;
        }
        sequence.execute(onSuccess, onFail);

        var batchResponse = '\r\n--batchresponse_1931c912-1c56-4d0f-b625-b0a6aae5cbc1\r\nContent-Type: multipart/mixed; boundary=changesetresponse_ad561553-4cd0-463d-aec8-c8f67a7e18c1\r\n\r\n--changesetresponse_ad561553-4cd0-463d-aec8-c8f67a7e18c1\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nHTTP/1.1 501 Internal Server Error\r\nContent-Type: application/json\r\nCache-Control: no-cache\r\nDataServiceVersion: 1.0;\r\n\r\n{\r\n"error": {\r\n"code": "", "message": {\r\n"lang": "en-US", "value": "An error occurred while processing this request."\r\n\r\n}, "innererror": {\r\n"message": "An error occurred while updating the entries. See the InnerException for details.", "type"\r\n: "System.Data.UpdateException", "stacktrace": "[stacktrace]", "internalexception": {\r\n"message": "Cannot insert the value NULL into column [etc]", "type": "System.Data.SqlClient.SqlException",\r\n"stacktrace": "[stacktrace]"\r\n}\r\n}\r\n}\r\n}\r\n\r\n--changesetresponse_ad561553-4cd0-463d-aec8-c8f67a7e18c1--\r\n\r\n--batchresponse_1931c912-1c56-4d0f-b625-b0a6aae5cbc1--';
        var request = helper.verifyRequest({ uri: "uri/$batch" });
        request.completed(this.getMockExecutorBatch(request.request, 202, batchResponse, "batchresponse_1931c912-1c56-4d0f-b625-b0a6aae5cbc1"));

        AtlasUnit.Assert.isNotNull(error, "FailedCallback should have been called.");
        AtlasUnit.Assert.areEqual("An error occurred while processing this request.", error.get_message());
        AtlasUnit.Assert.areEqual("System.Data.UpdateException", error.get_exceptionType());
        AtlasUnit.Assert.areEqual(501, error.get_statusCode());
        AtlasUnit.Assert.isFalse(error.get_timedOut());
        AtlasUnit.Assert.areEqual("[stacktrace]", error.get_stackTrace());
        AtlasUnit.Assert.isNotNull(error.get_errorObject());
    }

    this.getMockExecutorBatch = function(request, status, result, batchboundary) {
        var e = {};
        e.get_webRequest = function() { return request; };
        e.get_responseAvailable = function() { return true; };
        e.get_statusCode = function() { return status; };
        e.getResponseHeader = function(name) {
            var headers = { "DataServiceVersion": "1.0;", "Content-Type": "multipart/mixed;boundary=" + batchboundary };
            return headers[name];
        };
        e.get_responseData = function() {
            return result;
        };
        return e;
    }

    this.getMockExecutor = function(request, status, contentType, result, version) {
        var e = {};
        e.get_webRequest = function() { return request; };
        e.get_responseAvailable = function() { return true; };
        e.get_statusCode = function() { return status; };
        e.getResponseHeader = function(name) {
            var headers = { "DataServiceVersion": (version || "1.0;"), "Content-Type": contentType };
            return headers[name];
        };
        e.get_object = function() {
            return result;
        };
        e.get_xml = function() {
            return Sys.Net.XMLDOM(result);
        };
        return e;
    }

}
Sys.Data.Test.OpenDataServiceErrorTest.registerClass("Sys.Data.Test.OpenDataServiceErrorTest");
Sys.Data.Test.OpenDataServiceErrorTest["AtlasUnit.IsTestFixture"] = true;
