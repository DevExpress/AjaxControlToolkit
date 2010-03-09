Type.registerNamespace("Sys.Net.Test");

Sys.Net.Test.WebServiceOperationTest = function() {
    var helper = new Sys.Data.Test.MockRequestHelper();
    this.setUp = function() {
        helper.setUp();
    }
    this.tearDown = function() {
        helper.tearDown();
    }

    this.testConstructor = function() {
        var parameters = {};
        var d = new Sys.Net.WebServiceOperation("query", parameters, "GET");
        AtlasUnit.Assert.areEqual("query", d.operation);
        AtlasUnit.Assert.areEqual(parameters, d.parameters);
        AtlasUnit.Assert.areEqual("GET", d.httpVerb);
    }

    this.testOptionalParameters = function() {
        var d = new Sys.Net.WebServiceOperation("query");
        AtlasUnit.Assert.areEqual("query", d.operation);
        AtlasUnit.Assert.isNull(d.parameters);
        AtlasUnit.Assert.isNull(d.httpVerb);
    }

    this.testDataContextGetDeferredFetchPropertyOperation = function() {
        var dc = new Sys.Data.DataContext();
        dc.set_serviceUri("uri");
        var entity = {};
        var parameters = {};
        dc.set_getDeferredPropertyFetchOperationMethod(function(dc, entity, property) {
            return new Sys.Net.WebServiceOperation("dquery-" + entity.foo + "-" + property, parameters, "GET");
        });
        dc.fetchDeferredProperty({ foo: "foo" }, "bar");
        var request = helper.verifyRequest({ uri: "uri", useGet: true, method: "dquery-foo-bar" });
    }
}
Sys.Net.Test.WebServiceOperationTest.registerClass("Sys.Net.Test.WebServiceOperationTest");
Sys.Net.Test.WebServiceOperationTest["AtlasUnit.IsTestFixture"] = true;
