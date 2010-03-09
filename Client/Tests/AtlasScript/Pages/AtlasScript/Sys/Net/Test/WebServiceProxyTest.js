Type.registerNamespace("Sys.Net.Test");

Sys.Net.Test.WebServiceProxyTest = function() {
    var invoke, aborted, proxy;
    this.setUp = function() {
        proxy = new Sys.Net.WebServiceProxy();
        this.originalWRInvoke = Sys.Net.WebRequest.prototype.invoke;
        Sys.Net.WebRequest.prototype.invoke = this.mockWRInvoke;
    }
    this.tearDown = function() {
        Sys.Net.WebRequest.prototype.invoke = this.originalWRInvoke;
    }

    this.mockWRInvoke = function() {
        invoke = { request: this, uri: this.get_url(), headers: this.get_headers(), verb: this.get_httpVerb(),
                    body: this.get_body(), completed: Sys.Observer._getContext(this, true).events.getHandler("completed"),
                    timeout: this.get_timeout() };
    }

    this.getMockExecutor = function(request, status, result) {
        var e = {};
        e.get_webRequest = function() { return request; };
        e.get_responseAvailable = function() { return true; };
        e.get_statusCode = function() { return status; };
        e.getResponseHeader = function(name) {
            var headers = { "Content-Type": "application/json" };
            return headers[name];
        };
        e.get_object = function() {
            return result;
        };
        return e;
    }


    this.testDefaultSucceededCallbackNull = function() {
        var proxy = new Sys.Net.WebServiceProxy();
        proxy.set_defaultSucceededCallback(function() { });
        proxy.set_defaultSucceededCallback(null);
        AtlasUnit.Assert.areEqual(null, proxy.get_defaultSucceededCallback(), "SucceededCallback should be null");
    }

    this.testDefaultFailedCallbackNull = function() {
        var proxy = new Sys.Net.WebServiceProxy();
        proxy.set_defaultFailedCallback(function() { });
        proxy.set_defaultFailedCallback(null);
        AtlasUnit.Assert.areEqual(null, proxy.get_defaultFailedCallback(), "FailedCallback should be null");
    }

    this.testDefaultUserContextNull = function() {
        var proxy = new Sys.Net.WebServiceProxy();
        proxy.set_defaultUserContext("");
        proxy.set_defaultUserContext(null);
        AtlasUnit.Assert.areEqual(null, proxy.get_defaultUserContext(), "Usercontext should be null");
    }

    this.testEnableJsonpProperty = function() {
        AtlasUnit.Assert.isFalse(proxy.get_enableJsonp(), "Default should be false.");
        proxy.set_enableJsonp(true);
        AtlasUnit.Assert.isTrue(proxy.get_enableJsonp());
        proxy.set_enableJsonp(false);
        AtlasUnit.Assert.isFalse(proxy.get_enableJsonp());
    }

    this.testJsonpCallbackParameterProperty = function() {
        AtlasUnit.Assert.areEqual("callback", proxy.get_jsonpCallbackParameter(), "Default should be callback.");
        proxy.set_jsonpCallbackParameter("foo");
        AtlasUnit.Assert.areEqual("foo", proxy.get_jsonpCallbackParameter());
        proxy.set_jsonpCallbackParameter("");
        AtlasUnit.Assert.areEqual("callback", proxy.get_jsonpCallbackParameter());
    }

    this.testExecuteUsesJsonpForCrossDomain = function() {
        var data, err = null;
        function onSuccess(d) {
            data = d;
        }
        function onFail(e) {
            err = e;
        }
        Sys._loadOld = Sys._loadJsonp;
        var url = null, callback = null;
        Sys._loadJsonp = function(u, c) {
            url = u;
            c = callback;
        };
        try {
            Sys._jsonp = 8;
            Sys.Net.WebServiceProxy.invoke("http://foo/service.svc", "method", true, { p: 1 }, onSuccess, onFail);
            AtlasUnit.Assert.areEqual("http://foo/service.svc/method?p=1&callback=Sys._jsonp8", url);
            var returned = {};
            Sys._jsonp8(returned);
            AtlasUnit.Assert.areEqual("undefined", typeof (Sys._jsonp8), "Temp callback should be removed after success.");
            AtlasUnit.Assert.areEqual(returned, data);

            Sys.Net.WebServiceProxy.invoke("http://foo/service.svc", "method", true, { p: 2 }, onSuccess, onFail);
            AtlasUnit.Assert.areEqual("http://foo/service.svc/method?p=2&callback=Sys._jsonp9", url);
            returned = {Message: "message", StackTrace: "stack", ExceptionType: "exceptiontype" };
            Sys._jsonp9(returned, 500);
            AtlasUnit.Assert.areEqual("undefined", typeof (Sys._jsonp9), "Temp callback should be removed after failure.");
            AtlasUnit.Assert.areEqual(returned, err.get_errorObject());
            AtlasUnit.Assert.areEqual("message", err.get_message());
            AtlasUnit.Assert.areEqual("stack", err.get_stackTrace());
            AtlasUnit.Assert.areEqual("exceptiontype", err.get_exceptionType());

            url = null;
            Sys.Net.WebServiceProxy.invoke("http://localhost/service.svc", "method", true, { p: 2 }, onSuccess, onFail);
            AtlasUnit.Assert.isNull(url, "localhost is the current domain, so should not cause a jsonp request.");

        }
        finally {
            Sys._loadJsonp = Sys._loadOld;
            delete Sys._loadOld;
        }
    }

    this.testWithDataWrapper = function() {
        var r = null;
        function onSuccess(result) {
            r = result;
        }
        function onFail(err) {
            AtlasUnit.Assert.fail(err.get_message());
        }
        Sys.Net.WebServiceProxy.invoke("uri", "method", false, null, onSuccess, onFail);
        invoke.completed(this.getMockExecutor(invoke.request, 200, { "d": { "foo": "bar"} }));
        AtlasUnit.Assert.isNotNull(r);
        AtlasUnit.Assert.areEqual("bar", r.foo);
    }

    this.testWithNoDataWrapper = function() {
        var r = null;
        function onSuccess(result) {
            r = result;
        }
        function onFail(err) {
            AtlasUnit.Assert.fail(err.get_message());
        }
        Sys.Net.WebServiceProxy.invoke("uri", "method", false, null, onSuccess, onFail);
        invoke.completed(this.getMockExecutor(invoke.request, 200, { "foo": "bar" }));
        AtlasUnit.Assert.isNotNull(r);
        AtlasUnit.Assert.areEqual("bar", r.foo);
    }
}

Sys.Net.Test.WebServiceProxyTest.registerClass("Sys.Net.Test.WebServiceProxyTest");
Sys.Net.Test.WebServiceProxyTest["AtlasUnit.IsTestFixture"] = true;

