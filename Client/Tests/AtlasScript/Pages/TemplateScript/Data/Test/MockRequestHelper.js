Type.registerNamespace("Sys.Data.Test");

Sys.Data.Test.MockRequestHelper = function() {
    var invoke, aborted = false;
    this.setUp = function() {
        this.originalWRInvoke = Sys.Net.WebRequest.prototype.invoke;
        Sys.Net.WebRequest.prototype.invoke = this.mockWRInvoke;
        this.originalInvoke = Sys.Net.WebServiceProxy.invoke;
        Sys.Net.WebServiceProxy.invoke = this.mockInvoke;
        invoke = null;
    }
    this.tearDown = function() {
        Sys.Net.WebServiceProxy.invoke = this.originalInvoke;
        Sys.Net.WebRequest.prototype.invoke = this.originalWRInvoke;
    }

    this.mockInvoke = function(uri, method, useGet, params, succeededCallback, failedCallback, userContext, timeout) {
        invoke = { uri: uri, method: method, useGet: useGet, parameters: params, succeededCallback: succeededCallback, failedCallback: failedCallback, userContext: userContext, timeout: timeout };
        var request = { get_executor: function() {
            var executor = { abort: function() { aborted = true; } };
            executor.constructor = Sys.Net.WebRequestExecutor; // so it passes type validation
            return executor;
        }
        };
        invoke.request = request;
        return request;
    }

    this.mockWRInvoke = function() {
        invoke = { request: this, uri: this.get_url(), headers: this.get_headers(), verb: this.get_httpVerb(),
                   body: this.get_body(), completed: Sys.Observer._getContext(this, true).events.getHandler("completed"),
                   timeout: this.get_timeout() };
        this.get_executor = function() {
            var executor = { abort: function() { aborted = true; } };
            executor.constructor = Sys.Net.WebRequestExecutor; // so it passes type validation
            return executor;
        }
    }

    this.isAborted = function() {
        var wasAborted = aborted;
        aborted = false;
        return wasAborted;
    }

    this.verifyRequest = function(params, msg) {
        var r = invoke;
        invoke = null;
        if (params === null) {
            AtlasUnit.Assert.isNull(r, "Request was found." + (msg ? (" " + msg) : ""));
        }
        else {
            AtlasUnit.Assert.isNotNull(r, "Request not found." + (msg ? (" " + msg) : ""));
            for (var p in params) {
                var expected = params[p], actual = r[p];
                if (typeof (expected) === "object") {
                    for (var expectedv in expected) {
                        var ex = expected[expectedv], ac = actual[expectedv];
                        AtlasUnit.Assert.areEqual(typeof (ex), typeof (ac), "Parameter to invoke '" + p + "." + expectedv + "' not of the correct type." + (msg ? (" " + msg) : ""));
                        if (typeof (ex) === "object") {
                            for (var v in ex) {
                                var exv = ex[v], acv = ac[v];
                                AtlasUnit.Assert.areEqual(exv, acv, "Parameter to invoke '" + p + "." + expectedv + "." + v + " ' does not match." + (msg ? (" " + msg) : ""));
                            }
                        }
                        else {
                            AtlasUnit.Assert.areEqual(expected[expectedv], actual[expectedv], "Parameter to invoke '" + p + "." + expectedv + "' does not match." + (msg ? (" " + msg) : ""));
                        }
                    }
                }
                else {
                    AtlasUnit.Assert.areEqual(params[p], r[p], "Parameter to invoke '" + p + "' does not match." + (msg ? (" " + msg) : ""));
                }
            }
        }
        return r;
    }
}
Sys.Data.Test.MockRequestHelper.registerClass("Sys.Data.Test.MockRequestHelper");

