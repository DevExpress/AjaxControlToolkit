/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.Net.Test");

Sys.Net.Test.WebRequestTest = function() {

    this.setUp = function() {
    }

    this.testSetNullVerb = function() {
        var request = new Sys.Net.WebRequest();
        request.set_httpVerb(null);
    }
    this.testSetNullVerb["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testSetNullVerb["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentNullException', paramName: 'value' }

    this.testSetEmptyStringVerb = function() {
        var request = new Sys.Net.WebRequest();
        request.set_httpVerb("");
    }
    this.testSetEmptyStringVerb["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testSetEmptyStringVerb["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentException', paramName: 'value' }

    this.testSetVerb = function() {
        var request = new Sys.Net.WebRequest();
        request.set_httpVerb("HaoVerb");
        AtlasUnit.Assert.areEqual("HaoVerb", request.get_httpVerb());
    }

    this.testBadSetUrl = function() {
        var request = new Sys.Net.WebRequest();
        request.set_url([]);
    }
    this.testBadSetUrl["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testBadSetUrl["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentTypeException', paramName: 'value' }

    this.testSetNullUrl = function() {
        var request = new Sys.Net.WebRequest();
        request.set_url(null);
    }
    this.testSetNullUrl["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testSetNullUrl["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentNullException', paramName: 'value' }

    this.testGetDefaultVerb = function() {
        var request = new Sys.Net.WebRequest();
        AtlasUnit.Assert.isTrue(request.get_httpVerb() == "GET", "getHttpVerb default should be GET with no body");
    }

    this.testGetDefaultVerbWithBody = function() {
        var request = new Sys.Net.WebRequest();
        request.set_body("");
        AtlasUnit.Assert.isTrue(request.get_httpVerb() == "POST", "getHttpVerb default should be GET with no body");
    }

    this.testInvokeTwice = function() {
        var request = new Sys.Net.WebRequest();
        request._invokeCalled = true;
        request.invoke();
    }
    this.testInvokeTwice["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testInvokeTwice["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testSetExecutorAfterInvoke = function() {
        var request = new Sys.Net.WebRequest();
        var failed = false;
        request.set_executor(new Sys.Net.XMLHttpExecutor());
        request.get_executor()._started = true;
        request.set_executor(new Sys.Net.XMLHttpExecutor());
    }
    this.testSetExecutorAfterInvoke["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testSetExecutorAfterInvoke["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testBadSetExecutor = function() {
        var request = new Sys.Net.WebRequest();
        request.set_executor([]);
    }
    this.testBadSetExecutor["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testBadSetExecutor["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentTypeException', paramName: 'value' }

    this.testNullSetExecutor = function() {
        var request = new Sys.Net.WebRequest();
        request.set_executor(null);
    }
    this.testNullSetExecutor["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testNullSetExecutor["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentNullException', paramName: 'value' }

    this.testSetNegativeTimeout = function() {
        var request = new Sys.Net.WebRequest();
        request.set_timeout(-1);
    }
    this.testSetNegativeTimeout["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testSetNegativeTimeout["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentOutOfRangeException', paramName: 'value' }

    this.testSetArrayTimeout = function() {
        var request = new Sys.Net.WebRequest();
        request.set_timeout([]);
    }
    this.testSetArrayTimeout["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testSetArrayTimeout["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentTypeException', paramName: 'value' }

    this.testGetDefaultTimeout = function() {
        var request = new Sys.Net.WebRequest();
        AtlasUnit.Assert.areEqual(0, request.get_timeout(), "Default timeout should be zero");
        AtlasUnit.Assert.isTrue(request.get_timeout() == Sys.Net.WebRequestManager.get_defaultTimeout(), "getTimeout should default to WebRequestManager's default");
    }

    this.testSetDefaultTimeout = function() {
        var request = new Sys.Net.WebRequest();
        request.set_timeout(100);
        request.set_timeout(0);
        AtlasUnit.Assert.isTrue(request.get_timeout() == Sys.Net.WebRequestManager.get_defaultTimeout(), "getTimeout should default to WebRequestManager's default");
    }

    this.testSetRequestTimeout = function() {
		var request = new Sys.Net.WebRequest();
		request.set_timeout(200);
		AtlasUnit.Assert.areEqual(200, request.get_timeout(), "get_timeout() should return value set by set_timeout()");
    }

    this.testResolveUrl = function() {
        AtlasUnit.Assert.areEqual(Sys.Net.WebRequest._resolveUrl("foo.aspx", "http://haok1/atlas2/test.aspx"), "http://haok1/atlas2/foo.aspx");
        AtlasUnit.Assert.areEqual(Sys.Net.WebRequest._resolveUrl("/foo.aspx", "http://haok1/atlas2/test.aspx"), "http://haok1/foo.aspx");
        AtlasUnit.Assert.areEqual(Sys.Net.WebRequest._resolveUrl("bar/foo.aspx", "http://haok1/atlas2/atlas3/test.aspx"), "http://haok1/atlas2/atlas3/bar/foo.aspx");
        AtlasUnit.Assert.areEqual(Sys.Net.WebRequest._resolveUrl("/bar/foo.aspx", "https://haok1/atlas2/atlas3/test.aspx"), "https://haok1/bar/foo.aspx");
        AtlasUnit.Assert.areEqual(Sys.Net.WebRequest._resolveUrl("https://bar/foo.aspx", "http://haok1/atlas2/atlas3/test.aspx"), "https://bar/foo.aspx");
        AtlasUnit.Assert.areEqual(Sys.Net.WebRequest._resolveUrl("http://bar/foo.aspx", "http://haok1/atlas2/atlas3/test.aspx"), "http://bar/foo.aspx");
        AtlasUnit.Assert.areEqual(Sys.Net.WebRequest._resolveUrl("hao://bar/foo.aspx", "http://haok1/atlas2/atlas3/test.aspx"), "hao://bar/foo.aspx");
        AtlasUnit.Assert.areEqual(Sys.Net.WebRequest._resolveUrl("bar/foo.aspx", "http://haok1/test.aspx?baz=bob"), "http://haok1/bar/foo.aspx");
    }

    this.testResolveUrlBadBase1 = function() {
        Sys.Net.WebRequest._resolveUrl("/foo.aspx", "haok1/atlas2/test.aspx");
    }
    this.testResolveUrlBadBase1["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testResolveUrlBadBase1["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentException', paramName: 'baseUrl' }

    this.testResolveUrlBadBase2 = function() {
        Sys.Net.WebRequest._resolveUrl("/foo.aspx", "http://haok1");
    }
    this.testResolveUrlBadBase2["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testResolveUrlBadBase2["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentException', paramName: 'baseUrl' }

    this.testResolveUrlBadBase3 = function() {
        Sys.Net.WebRequest._resolveUrl("foo.aspx", "haok1");
    }
    this.testResolveUrlBadBase3["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testResolveUrlBadBase3["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentException', paramName: 'baseUrl' }

    this.testDefaultHeaderDictionaryIsEmpty = function() {
		var request = new Sys.Net.WebRequest();
		var headersDict = request.get_headers();
		var isEmptyDictionary = true;
		for(var member in headersDict) {
			isEmptyDictionary = false;
		}
		AtlasUnit.Assert.isTrue(isEmptyDictionary, "Default request header dictionary should be empty");
    }
}
Sys.Net.Test.WebRequestTest.registerClass("Sys.Net.Test.WebRequestTest");
Sys.Net.Test.WebRequestTest["AtlasUnit.IsTestFixture"] = true;

