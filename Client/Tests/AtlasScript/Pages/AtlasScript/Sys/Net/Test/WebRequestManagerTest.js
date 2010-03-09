/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.Net.Test");

Sys.Net.TestExecutor = function() {
    Sys.Net.TestExecutor.initializeBase(this);

    var _this = this;
    var _webRequest = null;
    var _responseAvailable = false;
    var _timedOut = false;
    var _timer = null;
    var _aborted = false;
    var _started = false;

    this.get_timedOut = function() {
        return Sys.Net.TestExecutor.callBaseMethod(this, "get_timedOut");
    }

    this.get_started = function() {
        return Sys.Net.TestExecutor.callBaseMethod(this, "get_started");
    }

    this.get_responseAvailable = function() {
        return _responseAvailable;
    }

    this.get_aborted = function() {
        return _aborted;
    }

    this.executeRequest = function() {
        _started = true;
        _webRequest = this.get_webRequest();
    }

    this.getResponseHeader = function(value) {
        return this.get_webRequest().get_headers()[value];
    }

    this.get_responseData = function() {
        return this.get_webRequest().get_body();
    }

    this.get_statusCode = function() {
        return "200";
    }

    this.get_statusText = function() {
        return "OK";
    }

    this.abort = function() {
        _aborted = true;
    }
}
Sys.Net.TestExecutor.registerClass('Sys.Net.TestExecutor', Sys.Net.XMLHttpExecutor);

Sys.Net.Test.WebRequestManagerTest = function() {
    var _requestManager;

    this.setUp = function() {
        _requestManager = new Sys.Net._WebRequestManager();
    }

    this.testInvalidExecutorType = function() {
        var requestManager = new Sys.Net._WebRequestManager();
        var oldExecutorType = requestManager.get_defaultExecutorType();
        requestManager.set_defaultExecutorType("XMLDom");
        try {
            var req = new Sys.Net.WebRequest();
            requestManager.executeRequest(req);
        }
        finally {
            requestManager.set_defaultExecutorType(oldExecutorType);
        }
    }
    this.testInvalidExecutorType["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testInvalidExecutorType["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentException', paramName: 'defaultExecutorType' }

    this.testBadSetDefaultExecutorType = function() {
        var requestManager = new Sys.Net._WebRequestManager();
        requestManager.set_defaultExecutorType([]);
    }
    this.testBadSetDefaultExecutorType["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testBadSetDefaultExecutorType["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentTypeException', paramName: 'value' }

    this.testExecuteRequestWhenWebRequestIsAnotherType = function() {
        Sys.Net.WebRequestManager.executeRequest(new Date());
    }
    this.testExecuteRequestWhenWebRequestIsAnotherType["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testExecuteRequestWhenWebRequestIsAnotherType["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentTypeException', paramName: 'webRequest' }

    this.testExecuteRequestWhenWebRequestIsNull = function() {
        Sys.Net.WebRequestManager.executeRequest(null);
    }
    this.testExecuteRequestWhenWebRequestIsNull["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testExecuteRequestWhenWebRequestIsNull["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentNullException', paramName: 'webRequest' }

    this.testCustomExecutorType = function() {
        var requestManager = new Sys.Net._WebRequestManager();
        requestManager.set_defaultExecutorType("Sys.Net.TestExecutor");
        var req = new Sys.Net.WebRequest();
        req.get_headers()["Test"] = "Foo"
        req.set_body("Body");
        requestManager.executeRequest(req);
        AtlasUnit.Assert.isFalse(req.get_executor().get_started());
        AtlasUnit.Assert.isFalse(req.get_executor().get_timedOut());
        AtlasUnit.Assert.areEqual("Body", req.get_executor().get_responseData());
        AtlasUnit.Assert.areEqual("Foo", req.get_executor().getResponseHeader("Test"));
    }

    this.testSetNegativeTimeout = function() {
        var requestManager = new Sys.Net._WebRequestManager();
        requestManager.set_defaultTimeout(-1);
    }
    this.testSetNegativeTimeout["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testSetNegativeTimeout["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentOutOfRangeException', paramName: 'value' }

    this.testSetStringTimeout = function() {
        var requestManager = new Sys.Net._WebRequestManager();
        requestManager.set_defaultTimeout("whatever");
    }
    this.testSetStringTimeout["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testSetStringTimeout["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentTypeException', paramName: 'value' }

    this.testDefaultExecutorType = function() {
        var requestManager = new Sys.Net._WebRequestManager();
        AtlasUnit.Assert.areEqual("Sys.Net.XMLHttpExecutor", requestManager.get_defaultExecutorType());
    }

}
Sys.Net.Test.WebRequestManagerTest.registerClass("Sys.Net.Test.WebRequestManagerTest");
Sys.Net.Test.WebRequestManagerTest["AtlasUnit.IsTestFixture"] = true;

